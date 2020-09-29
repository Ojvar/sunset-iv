"use strict";

import LoggerModule from "./logger-module";
import BaseModule from "./base-module";
import GlobalData from "../global/global-data";

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
        this.initLogger();
    }

    /**
     * Init logger
     */
    private initLogger() {
        GlobalData.logger = new LoggerModule();
        GlobalData.logger.info("I - Logger initialized");
        GlobalData.logger.error("E - Logger initialized");
        GlobalData.logger.warning("W - Logger initialized");
        GlobalData.logger.debug("D - Logger initialized");
    }
}
