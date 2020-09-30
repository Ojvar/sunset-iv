"use strict";

import DotEnv from "dotenv";
import CoreModuleInterface from "interfaces/core-module-interface";
import LoggerModule from "./logger-module";
import EventsModule from "./events-module";
import BaseModule from "./base-module";
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
        this.loadEnvData();
        this.initLogger();
    }

    /**
     * Init logger
     */
    private async initLogger(): Promise<void> {
        /* 
            Boot order
                1- Logger
                2- Events
        */

        GlobalData.logger = new LoggerModule();
        await GlobalData.logger.boot();
        GlobalData.logger.info("Logger initialized");

        GlobalData.events = new EventsModule();
        await GlobalData.events.boot();
        GlobalData.logger.info("Events initialized");

        /* Raise AppInit event */
        GlobalData.events.raise("ServerInit");
    }

    /**
     * Loding env-file data
     */
    private loadEnvData(): void {
        const envFile = process.env.ENV_FILE || ".env";
        const envFilePath = GlobalMethods.rPath(envFile);

        DotEnv.config({ path: envFilePath });
    }
}
