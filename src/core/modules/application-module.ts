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
import Helmet from "helmet";
import CSURF from "csurf";
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
        this.appConfig = await GlobalMethods.config<ApplicationConfigType>(
            "core/express-config"
        );

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

        this.setupTrustedProxy(app);
        this.setupCORS(app);
        this.setupThrottle(app);
        this.setupBodyAndCookieParser(app);
        this.setupHelmet(app);
        this.setupCSRF(app);
        this.setupRouteHandler(app);
        this.setupRouteErrors(app);
    }

    /**
     * Setup trusted proxy level
     * @param app Express.Applicaiton Application instance
     */
    private setupTrustedProxy(app: Express.Application): void {
        if (GlobalMethods.isProductionMode()) {
            app.set("trust proxy", this.appConfig.trustedProxy);
        }
    }

    /**
     * Setup CROS
     * @param app Express.Applicaiton Application instance
     */
    private setupCORS(app: Express.Application): void {
        const corsOptions = {
            origin: true,
            // some legacy browsers (IE11, various SmartTVs) choke on 204
            optionsSuccessStatus: 200,
        };

        app.options("*", CORS(corsOptions));
        app.use(CORS());
    }

    /**
     * Setup throttle
     * @param app Express.Applicaiton Application instance
     */
    private setupThrottle(app: Express.Application): void {
        const rateLimitOptions: RateLimit.Options = {
            windowMs: +this.appConfig.throttleWindow,
            max: +this.appConfig.throttleMax,
            delayMs: +this.appConfig.throttleDelay,
        } as RateLimit.Options;

        if (this.appConfig.throttleStore == this.C_STORE_REDIS) {
            rateLimitOptions.store = new RedisStore({});
        }

        GlobalData.rateLimiter = RateLimit(rateLimitOptions);
    }

    /**
     * Setup Body and Cookie parsers
     * @param app Express.Applicaiton Application instance
     */
    private setupBodyAndCookieParser(app: Express.Application): void {
        /* Add cookie-parse */
        app.use(CookieParser());

        /* Add body parser */
        app.use(
            BodyParser.urlencoded({
                extended: false,
            } as BodyParser.OptionsUrlencoded)
        );

        app.use(BodyParser.json());
    }

    /**
     * Setup Helmet
     * @param app Express.Applicaiton Application instance
     */
    private setupHelmet(app: Express.Application): void {
        /* Helmet */
        app.use(Helmet());
    }

    /**
     * Setup CSRF
     * @param app Express.Applicaiton Application instance
     */
    private setupCSRF(app: Express.Application): void {
        const csrf = CSURF({
            cookie: true,
        });

        app.use((req, res, next) => {
            if (GlobalMethods.useCSRF && GlobalMethods.useCSRF(req)) {
                next();
            } else {
                csrf(req, res, next);
            }
        });

        app.use((req, res, next) => {
            res.locals.csrftoken = req.csrfToken ? req.csrfToken() : "";
            next();
        });
    }

    /**
     * Setup RouteHandler
     * @param app Express.Applicaiton Application instance
     */
    private setupRouteHandler(app: Express.Application): void {
        app.use(
            (
                req: Express.Request,
                res: Express.Response,
                next: NextFunction
            ): void => {
                switch (GlobalMethods.getRequestType(req)) {
                    case "html":
                        res.status(404)
                            .send("ROUTE NOT FOUND")
                            .end();
                        break;

                    case "xhr":
                        res.status(404)
                            .send({
                                success: false,
                                data: "Route not found",
                            })
                            .end();
                        break;

                    default:
                        res.status(404)
                            .send("Bad Request")
                            .end();
                        break;
                }
            }
        );
    }

    /**
     * Setup RouteErrors
     * @param app Express.Applicaiton Application instance
     */
    private setupRouteErrors(app: Express.Application): void {
        const errHandler = (
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
            switch (GlobalMethods.getRequestType(req)) {
                case "html":
                    /* TODO: RENDER PAGE */
                    res.status(500)
                        .send(errorData)
                        .end();
                    break;

                case "xhr":
                    res.status(500)
                        .send(errorData)
                        .end();
                    break;

                default:
                    res.status(500)
                        .send("BAD REQUEST")
                        .end();
                    break;
            }
        };

        /* Setup Error handler middleware */
        app.use(errHandler);
    }
}
