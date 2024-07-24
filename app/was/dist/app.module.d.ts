import { BeforeApplicationShutdown, OnApplicationBootstrap, OnApplicationShutdown, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { LogService } from './log/log.service';
export declare class AppModule implements OnApplicationBootstrap, OnModuleInit, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {
    private readonly logService;
    constructor(logService: LogService);
    onModuleInit(): Promise<void>;
    onApplicationBootstrap(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    beforeApplicationShutdown(signal?: string): Promise<void>;
    onApplicationShutdown(signal?: string): Promise<void>;
}
