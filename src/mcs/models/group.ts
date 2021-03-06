import {GroupSettings} from './group-settings.entity';
import {ChannelState} from './channel.state';
import {CategoryChannel, Guild} from 'discord.js';

export class Group {
    readonly channels = new Set<ChannelState>();

    constructor(
        public readonly settings: GroupSettings,
        public readonly guild: Guild,
        public readonly parent?: CategoryChannel,
    ) {
    }

    get id(): number {
        return this.settings.id;
    }

    get emptyChannels(): number {
        return Array.from(this.channels)
            .filter(({channel}) => channel.members.size === 0)
            .length;
    }
}
