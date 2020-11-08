import { Module } from '@nestjs/common';
import { CommandController } from './command.controller';
import { CommandContainer } from './command.container';
import { PingController } from './controllers/ping.controller';
import { CommandExplorer } from './command.explorer';
import { DiscoveryModule } from '@nestjs/core';
import { MetadataAccessor } from './helpers/metadata.accessor';

@Module({
    imports: [
        DiscoveryModule,
    ],
    providers: [
        CommandContainer,
        MetadataAccessor,
        CommandExplorer,
    ],
    controllers: [
        CommandController,
        PingController,
    ],
})
export class CommandModule {
}