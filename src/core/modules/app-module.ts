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
    /**
     * Application-Class ctr
     * @param port Number Port number
     * @param host:127.0.0.1 String Host IP
     */
    constructor(private port: number, private host: string = "127.0.0.1") {
        super();

        // const App = Express();
        // const PORT: number: 3000;
        // const HOST: string: '0.0.0.0';
        // App.listen(PORT, HOST, () => {
        // });
    }

    /**
     * Boot module
     * @param payload object Payload data
     */
    async boot(payloa?: object): Promise<void> {
        GlobalData.logger.info("APP MODULE SHOULD BE IMPLEMENT,,,, ;)")
    }
}
