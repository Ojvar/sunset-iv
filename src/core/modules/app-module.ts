"use strict";

import Express from "express";
import BaseModule from "./base-module";

/**
 * Application class
 */
export default class Application extends BaseModule {
    /**
     * Application-Class ctr
     * @param port Number Port number
     * @param host:127.0.0.1 String Host IP
     */
    constructor(port: number, host: string = "127.0.0.1") {
        super();

        // const App = Express();
        // const PORT: number: 3000;
        // const HOST: string: '0.0.0.0';
        // App.listen(PORT, HOST, () => {
        // });
    }
}
