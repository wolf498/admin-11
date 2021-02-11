import {Group} from './entities/group.entity';
import {Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {GroupService} from './services/group.service';
import {Channel} from './entities/channel.entity';
import {ModularChannelContainer} from './modular-channel.container';
import {CategoryChannel, ChannelManager, GuildManager, VoiceChannel} from 'discord.js';
import {empty, unique} from '../utils/filter.utils';
import {DiscordClient} from '../discord/foundation/discord.client';

export enum JobType {
    DELETE = 1,
    CREATE = 2,
}

@Injectable()
export class ModularChannelService implements OnApplicationBootstrap {
    private static readonly logger = new Logger('ModularChannelSystem');

    private readonly channelManager: ChannelManager;
    private readonly guildManager: GuildManager;

    constructor(
        private readonly container: ModularChannelContainer,
        private readonly groupService: GroupService,
        private readonly discordClient: DiscordClient
    ) {
        this.channelManager = discordClient.channels;
        this.guildManager = discordClient.guilds;
    }

    onApplicationBootstrap(): void {
        this.discordClient.on('ready', () => {
            this.initService();
        });
    }

    initService(): void {
        this.groupService.getAll()
            .then(groups => {
                ModularChannelService.logger.log(`Initializing ${groups.length} group(s)`);

                groups.forEach(group =>
                    this.initGroup(group)
                )
            });
    }

    async initGroup(group: Group): Promise<void> {
        await Promise.all(
            group.channels.map(channel => this.initChannel(channel))
        );

        group.guild = await this.guildManager.fetch(group.guildId);
        this.allocate(group);
        this.container.initGroup(group);
    }

    async initChannel(channel: Channel): Promise<void> {
        try {
            channel.voiceChannel = await this.channelManager.fetch(channel.id) as VoiceChannel;
            console.log(channel.voiceChannel.position, channel.voiceChannel.rawPosition);
        } catch (e) {
            ModularChannelService.logger.log(`Unable to fetch channel "${channel.id}": ${e}`);

            channel.removeFromGroup();
        }
    }

    notifyChange(channels: VoiceChannel[]): void {
        channels
            .map(channel => this.container.getChannel(channel))
            .filter(empty)
            .map(({group}) => group)
            .filter(unique)
            .forEach(group => {
                this.allocate(group);
            });
    }

    channelMoved(voiceChannel: VoiceChannel): void {
        const channel = this.container.getChannel(voiceChannel);

        if (channel) {
            const {group} = channel;

            const adjacent = group.parentId == voiceChannel.parentID
                && group.channels.some((member) => Math.abs(member.voiceChannel.position - voiceChannel.position) == 1)

            if (adjacent) {
                // Rename channels
            } else {
                this.container.deleteChannel(channel);
                this.planCreate(group);
            }


        }
    }

    channelDeleted(voiceChannel: VoiceChannel): void {
        const channel = this.container.getChannel(voiceChannel);

        if (channel)
            this.container.deleteChannel(channel);
    }

    parentDeleted(category: CategoryChannel): void {
        const group = this.container.getGroupFromParent(category);

        if (group) {
            const position = group.channels.reduce(
                (nominated, candidate) =>
                    nominated < candidate.voiceChannel.position
                        ? nominated
                        : candidate.voiceChannel.position, 0)

            this.container.updateGroup(group, {
                parentId: undefined,
                position
            })
        }
    }

    allocate(group: Group): void {
        const {tare} = group;

        if (tare > 0)
            this.planDelete(group)
        else if (tare < 0)
            this.planCreate(group);
        else
            this.cancelDeleteOrCreate(group);
    }

    private planDelete(group: Group): void {
        const [type, job] = group.queued ?? [];

        if (type && type !== JobType.DELETE)
            clearTimeout(job);

        if (!type || type !== JobType.DELETE) {
            group.queued = [
                JobType.DELETE,
                setTimeout(() => {
                    delete group.queued;
                    void this.deleteChannel(group);
                }, group.deletionDelay * 1000).unref()
            ];
        }
    }

    private async deleteChannel(group: Group): Promise<void> {
        const channel = group.emptyChannels
            .reduce((nominated, candidate) =>
                nominated.voiceChannel.position > candidate.voiceChannel.position
                    ? nominated
                    : candidate
            );

        try {
            await channel.voiceChannel.delete('Channel expired');
            this.container.deleteChannel(channel);

            if (group.tare > 0)
                this.planDelete(group);
        } catch (e) {
            ModularChannelService.logger.log(`Unable to delete channel "${channel.id}": ${e}`);
        }
    }

    private planCreate(group: Group): void {
        const [type, job] = group.queued ?? [];

        if (type && type !== JobType.CREATE)
            clearTimeout(job);

        if (!type || type !== JobType.CREATE) {
            group.queued = [
                JobType.CREATE,
                setTimeout(() => {
                    delete group.queued;
                    void this.createChannel(group);
                }, group.creationDelay * 1000).unref()
            ]
        }
    }

    private async createChannel(group: Group): Promise<void> {
        try {
            const voiceChannel = await group.guild.channels.create(group.format, {
                type: 'voice',
                parent: group.parentId,
                position: group.position,
                userLimit: group.userLimit
            });

            const channel = new Channel();
            channel.id = voiceChannel.id;
            channel.group = group;
            channel.voiceChannel = voiceChannel;

            this.container.addChannel(channel);

            if (group.tare < 0)
                this.planCreate(group);
        } catch (e) {
            ModularChannelService.logger.warn(`Unable to create new channel in group "${group.id}": ${e}`)
        }
    }

    private cancelDeleteOrCreate(group: Group): void {
        const [, job] = group.queued ?? [];

        if (job) {
            clearTimeout(job);
            delete group.queued;
        }
    }
}