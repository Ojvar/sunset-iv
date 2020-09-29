"use strict";

import DotEnv from "dotenv";
import LoggerModule from "./logger-module";
import BaseModule from "./base-module";
import GlobalData from "../global/global-data";
import GlobalMethods from "../global/global-methods";

/**
 * Server class
 */
export default class Server extends BaseModule {
    /**
     * Server class ctr
     */
    constructor() {
        super();
    }

    /**
     * Boot
     */
    public boot(): void {
        this.loadEnvData();
        this.initLogger();
    }

    /**
     * Init logger
     */
    private initLogger(): void {
        GlobalData.logger = new LoggerModule();
        GlobalData.logger.info("Logger initialized");
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
