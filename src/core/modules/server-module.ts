"use strict";

import DotEnv from "dotenv";
import LoggerModule from "./logger-module";
import EventsModule from "./events-module";
import BaseModule, { ICoreModule } from "./base-module";
import ApplicationModule from "./application-module";
import DatabaseModule from "./database-module";
import ServiceModules from "./service-module";
import GlobalData from "../global/global-data";
import GlobalMethods from "../global/global-methods";

/**
 * Server class
 */
export default class Server extends BaseModule implements ICoreModule {
    /**
     * Server class ctr
     */
    constructor() {
        super();
    }

    /**
     * Boot
     */
    public async boot(payload?: IServerBoot): Promise<void> {
        await this.loadEnvData();
        await this.initLogger();
        await this.initEvents();

        /* Just create a manifest file */
        if (payload === IServerBoot.CREATE_ROUTES_MANIFEST) {
            await this.initApplication();
        } else if (payload == IServerBoot.RUN_SERVER) {
            await this.initDatabase();
            await this.initApplication();
            await this.initServices();

            /* Raise AppInit event */
            GlobalData.events.raise("ServerInit");
        }
    }

    /**
     * Init logger
     */
    private async initLogger(): Promise<void> {
        /* Logger module */
        GlobalData.logger = new LoggerModule();
        await GlobalData.logger.boot();

        GlobalData.logger.info("Logger Module initialized");
    }

    /**
     * Init Events
     */
    private async initEvents(): Promise<void> {
        GlobalData.events = new EventsModule();
        await GlobalData.events.boot();

        GlobalData.logger.info("Events Module initialized");
    }

    /**
     *  Init Application
     */
    private async initApplication(): Promise<void> {
        GlobalData.application = new ApplicationModule();
        await GlobalData.application.boot();

        GlobalData.logger.info("Application Module initialized");
    }

    /**
     *  Init Services
     */
    private async initServices(): Promise<void> {
        GlobalData.services = new ServiceModules();
        await GlobalData.services.boot();

        GlobalData.logger.info("Service Module initialized");
    }

    /**
     *  Init Database
     */
    private async initDatabase(): Promise<void> {
        GlobalData.db = new DatabaseModule();
        await GlobalData.db.boot();

        GlobalData.logger.info("Database Module initialized");
    }

    /**
     * Loding env-file data
     */
    private async loadEnvData(): Promise<void> {
        const envFile = process.env.ENV_FILE || ".env";
        const envFilePath = GlobalMethods.rPath(envFile);

        DotEnv.config({ path: envFilePath });
    }

    /**
     * Create routes-manifest file
     */
    public async createRoutesManifrestFile(): Promise<void> {
        await GlobalData.router.createManifestFile();
    }
}

/**
 * Server Config Type
 */
export type ServerConfigType = {
    publicFolder: string;
    routerManifest: string;
    acceptableTypes: string[];
};

/**
 * Server boot enum
 */
export enum IServerBoot {
    RUN_SERVER = 1,
    CREATE_ROUTES_MANIFEST = 2,
}
