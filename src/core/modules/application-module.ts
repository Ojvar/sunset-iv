"use strict";

import Chalk from "chalk";
import Express from "express";
import BaseModule from "./base-module";
import CoreModuleInterface from "../../types/interfaces/core-module-interface";
import GlobalData from "../global/global-data";
import GlobalMethods from "../global/global-methods";
import ApplicationConfigType from "data-types/application-config-type";

/**
 * Application class
 */
export default class Application extends BaseModule
    implements CoreModuleInterface {
    public readonly C_PROTO_HTTPS: string = "https";
    private app: Express.Application;
    private appConfig: ApplicationConfigType;

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
        await this.prepareData();
        await this.setupApp();
        await this.setupMiddlewares();
        await this.listen();

        GlobalData.logger.info("APP MODULE SHOULD BE IMPLEMENT,,,, ;)");
    }

    /**
     * Start listening
     */
    private async listen(): Promise<void> {
        const { port, host, url, protocol, fullUrl } = this.appConfig;

        const messageFnc: () => void = (): void => {
            GlobalData.logger.info(`
Server started
            PROTOCOL  ${Chalk.yellow(protocol)}
                PORT  ${Chalk.yellow(port)}
                HOST  ${Chalk.yellow(host)}
                 URL  ${Chalk.yellow(url)}
            FULL-URL  ${Chalk.red(fullUrl)}`);
        };

        /* Start listening */
        this.app.listen(port, host, messageFnc);
    }

    /**
     * Prepare data
     */
    private async prepareData(): Promise<void> {
        const config = await GlobalMethods.config("core/express-config");

        this.appConfig = config as ApplicationConfigType;

        /* Setup data */
        this.appConfig.isHttps = this.appConfig.protocol === this.C_PROTO_HTTPS;
        this.appConfig.fullUrl = `${this.appConfig.protocol}://${this.appConfig.url}`;
    }

    /**
     * Setup app
     */
    private async setupApp(): Promise<void> {
        this.app = Express();

        /* 
            Load Http/Https server
            Create express application
         */
    }

    private getHttpServer() {}

    /**
     * Setup middlewares
     */
    private async setupMiddlewares(): Promise<void> {}
}
