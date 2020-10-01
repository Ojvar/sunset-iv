"use strict";

import FS from "fs";
import Chalk from "chalk";
import Express, { NextFunction, RequestHandler } from "express";
import Http from "https";
import Https from "https";
import BaseModule from "./base-module";
import CoreModuleInterface from "../../types/interfaces/core-module-interface";
import GlobalData from "../global/global-data";
import GlobalMethods from "../global/global-methods";
import ApplicationConfigType from "data-types/application-config-type";

import CORS from "cors";
import RateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import BodyParser from "body-parser";
import CookieParser from "cookie-parser";
import ExpressErrorType from "data-types/express-error-type";
// import CSURF from "csurf";
// import Helmet from "helmet";
// import Multer from "multer";
// import MkDirP from "mkdirp";
// import { v4 as uuidV4 } from "uuid";
// import MimeTypes from "mime-types";

/**
 * Application class
 */
export default class Application extends BaseModule
    implements CoreModuleInterface {
    public readonly C_PROTO_HTTPS: string = "https";
    public readonly C_STORE_REDIS: string = "redis";
    private app: Express.Application;
    private server: Http.Server;
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
        await this.listen();

        GlobalData.logger.info("APP MODULE SHOULD BE IMPLEMENT,,,, ;)");
    }

    /**
     * Start listening
     */
    private async listen(): Promise<void> {
        const { port, host, url, protocol, fullUrl, isHttps } = this.appConfig;
        const messageFnc: () => void = (): void => {
            GlobalData.logger.info(`
Server started
            PROTOCOL  ${Chalk.yellow(protocol)}
                PORT  ${Chalk.yellow(port)}
                HOST  ${Chalk.yellow(host)}
                 URL  ${Chalk.yellow(url)}
            FULL-URL  ${Chalk.red(fullUrl)}`);
        };

        /* Setup a http/https server */
        this.server = this.createServer(isHttps, this.app);

        /* Start listening */
        this.server.listen(port, host, messageFnc);
    }

    /**
     * Create a http/https server
     * @param useHttps boolean Use https
     * @param app Express.Application App instance
     */
    createServer(useHttps: boolean, app: Express.Application): Http.Server {
        let server: Http.Server;

        if (useHttps) {
            const serverPKeyPath: string = GlobalMethods.rPath(
                __dirname,
                "../../ssl/server-key.pem"
            );
            const serverCertPath: string = GlobalMethods.rPath(
                __dirname,
                "../../ssl/server-cert.pem"
            );

            /* Read ssl data */
            const privateKey: string = FS.readFileSync(
                serverPKeyPath
            ).toString();

            const certificate: string = FS.readFileSync(
                serverCertPath
            ).toString();

            /* Setup server */
            let options: Http.ServerOptions = {
                key: privateKey,
                cert: certificate,
            } as Http.ServerOptions;

            server = Https.createServer(options, app);
        } else {
            server = Http.createServer(app);
        }

        return server;
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
        await this.setupMiddlewares(this.app);
    }

    /**
     * Setup middlewares
     * @param app Express.Application App Instance
     */
    private async setupMiddlewares(app: Express.Application): Promise<void> {
        /* 
            Middlewares

            - BodyParser
            - CookieParser
            - CSURF
            - CORS
            - Helmet
            - Morgan
            - RateLimit
            - RedisStore
            - Multer
            - MkDirP
            - uuidV4
            - MimeTypes
        */

        /* Set trusted proxy level */
        if (GlobalMethods.isProductionMode()) {
            app.set("trust proxy", this.appConfig.trustedProxy);
        }

        /* CORS */
        const corsOptions = {
            origin: true,
            // some legacy browsers (IE11, various SmartTVs) choke on 204
            optionsSuccessStatus: 200,
        };
        app.options("*", CORS(corsOptions));
        app.use(CORS());

        /* Setup throttle */
        const rateLimitOptions: RateLimit.Options = {
            windowMs: +this.appConfig.throttleWindow,
            max: +this.appConfig.throttleMax,
            delayMs: +this.appConfig.throttleDelay,
        } as RateLimit.Options;
        if (this.appConfig.throttleStore == this.C_STORE_REDIS) {
            rateLimitOptions.store = new RedisStore({});
        }
        GlobalData.rateLimiter = RateLimit(rateLimitOptions);

        /* Add cookie-parse */
        app.use(CookieParser());

        /* Add body parser */
        app.use(
            BodyParser.urlencoded({
                extended: false,
            } as BodyParser.OptionsUrlencoded)
        );
        app.use(BodyParser.json());

        /* Setup Not found route middleware */
        // app.use();
        app.use(
            (
                req: Express.Request,
                res: Express.Response,
                next: NextFunction
            ): void => {
                res.status(404)
                    .send("ROUTE NOT FOUND")
                    .end();
            }
        );

        /* Setup Error handler middleware */
        app.use(
            (
                error: Error,
                req: Express.Request,
                res: Express.Response,
                next: NextFunction
            ): void => {
                if (res.headersSent) {
                    return next(error);
                }

                let errorData: ExpressErrorType = {
                    text: "Server Internal Error!",
                    error: null,
                };

                if (!GlobalMethods.isProductionMode()) {
                    errorData.error = JSON.stringify(error);
                }

                /* Log error */
                GlobalData.logger.error(JSON.stringify(errorData));

                /* Send to client */
                res.status(500)
                    .send(errorData)
                    .end();
            }
        );
    }
}
