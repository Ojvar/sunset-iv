"use strict";

import DotEnv from "dotenv";
import CoreModuleInterface from "interfaces/core-module-interface";
import LoggerModule from "./logger-module";
import EventsModule from "./events-module";
import BaseModule from "./base-module";
import ApplicationModule from "./application-module";
import GlobalData from "../global/global-data";
import GlobalMethods from "../global/global-methods";

/**
 * Server class
 */
export default class Server extends BaseModule implements CoreModuleInterface {
    /**
     * Server class ctr
     */
    constructor() {
        super();
    }

    /**
     * Boot
     */
    public async boot(): Promise<void> {
        await this.loadEnvData();
        await this.initLogger();
        await this.initEvents();
        await this.initApplication();

        /* Raise AppInit event */
        GlobalData.events.raise("ServerInit");
    }

    /**
     * Init logger
     */
    private async initLogger(): Promise<void> {
        /* Logger module */
        GlobalData.logger = new LoggerModule();
        await GlobalData.logger.boot();
        GlobalData.logger.info("Logger initialized");
    }

    /**
     * Init Events
     */
    private async initEvents(): Promise<void> {
        GlobalData.events = new EventsModule();
        await GlobalData.events.boot();
        GlobalData.logger.info("Events initialized");
    }

    /**
     *  Init Application
     */
    private async initApplication(): Promise<void> {
        GlobalData.application = new ApplicationModule();
        await GlobalData.application.boot();
        GlobalData.logger.info("Application initialized");
    }

    /**
     * Loding env-file data
     */
    private async loadEnvData(): Promise<void> {
        const envFile = process.env.ENV_FILE || ".env";
        const envFilePath = GlobalMethods.rPath(envFile);

        DotEnv.config({ path: envFilePath });
    }
}
