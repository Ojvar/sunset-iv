"use strict";

import FS from "fs";
import Path from "path";
import Chalk from "chalk";
import Express, { NextFunction } from "express";
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
import MulterConfigType from "data-types/multer-config-type";
import Multer from "multer";
import { v4 as uuidV4 } from "uuid";
import MimeTypes from "mime-types";

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
            "core/express"
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

        await this.setupPugEngine(this.app);
        await this.setupMiddlewares(this.app);
    }

    /**
     * Setup Pug engine
     * @param app Express.Application App Instance
     */
    private async setupPugEngine(app: Express.Application): Promise<void> {
        app.set("view engine", "pug");
        app.set("views", Path.resolve(__dirname, "../../frontend/views"));
    }

    /**
     * Setup middlewares
     * @param app Express.Application App Instance
     */
    private async setupMiddlewares(app: Express.Application): Promise<void> {
        await this.setupTrustedProxy(app);
        await this.setupCORS(app);
        await this.setupThrottle(app);
        await this.setupBodyAndCookieParser(app);
        await this.setupHelmet(app);
        await this.setupCSRF(app);
        await this.setupMulter(app);

        await this.setupRouteHandler(app);
        await this.setupRouteErrors(app);
    }

    /**
     * Setup trusted proxy level
     * @param app Express.Applicaiton Application instance
     */
    private async setupTrustedProxy(app: Express.Application): Promise<void> {
        if (GlobalMethods.isProductionMode()) {
            app.set("trust proxy", this.appConfig.trustedProxy);
        }
    }

    /**
     * Setup CROS
     * @param app Express.Applicaiton Application instance
     */
    private async setupCORS(app: Express.Application): Promise<void> {
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
    private async setupThrottle(app: Express.Application): Promise<void> {
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
    private async setupBodyAndCookieParser(
        app: Express.Application
    ): Promise<void> {
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
    private async setupHelmet(app: Express.Application): Promise<void> {
        /* Helmet */
        app.use(Helmet());
    }

    /**
     * Setup CSRF
     * @param app Express.Applicaiton Application instance
     */
    private async setupCSRF(app: Express.Application): Promise<void> {
        const csrf = CSURF({
            cookie: true,
        });

        app.use((req, res, next) => {
            if (GlobalMethods.useCSRF(req)) {
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
     * Setup Multer
     * @param app Express.Applicaiton Application instance
     */
    private async setupMulter(app: Express.Application): Promise<void> {
        /* Setup multer */
        const multerConfig: MulterConfigType = await GlobalMethods.config<
            MulterConfigType
        >("core/multer");

        /* Create storage diretory */
        await GlobalMethods.createDir(multerConfig.storage);

        /* Setup multer */
        const storage: Multer.StorageEngine = Multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, multerConfig.storage);
            },
            filename: function(req, file, cb) {
                let ext = MimeTypes.extension(file.mimetype);
                ext = ext ? `.${ext}` : "";

                let filename = `${uuidV4()}${ext}`;
                cb(null, filename);
            },
        });

        GlobalData.upload = Multer({
            limits: { fieldSize: multerConfig.maxSize },
            storage,
        });

        /* Use multer as middleware */
        if (this.appConfig.useMulter) {
            app.use(GlobalData.upload.any());
        }
    }

    /**
     * Setup RouteHandler
     * @param app Express.Applicaiton Application instance
     */
    private async setupRouteHandler(app: Express.Application): Promise<void> {
        app.use(
            (
                req: Express.Request,
                res: Express.Response,
                next: NextFunction
            ): void => {
                switch (GlobalMethods.getRequestType(req)) {
                    case "html":
                        res.render("errors/404.pug");
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
    private async setupRouteErrors(app: Express.Application): Promise<void> {
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
                    res.render("errors/500.pug", {
                        data: errorData,
                    });
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
