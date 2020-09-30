"use strict";

import Express from "express";
import BaseModule from "./base-module";
import CoreModuleInterface from "../../types/interfaces/core-module-interface";
import GlobalData from "../global/global-data";

/**
 * Application class
 */
export default class Application extends BaseModule
    implements CoreModuleInterface {
    private host: string = "127.0.0.1";
    private port: number = 8585;
    private useSsl: boolean = false;

    /**
     * Application-Class ctr
     */
    constructor() {
        super();
    }

    /**
     * Boot module
     * @param payload object Payload data
     */
    async boot(payload?: object): Promise<void> {
        GlobalData.logger.info("APP MODULE SHOULD BE IMPLEMENT,,,, ;)");
    }
}
