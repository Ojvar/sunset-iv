"use strict";

import Express from "express";
import Session from "express-session";
import ConnectRedis from "connect-redis";
import BaseModule, { ICoreModule } from "./base-module";
import GlobalData from "../global/global-data";
import GlobalMethods from "../global/global-methods";
import RedisHelper from "../helpers/redis-helper";

/**
 * Events class
 */
export default class Events extends BaseModule implements ICoreModule {
    private app: Express.Application;

    /**
     * Events-Class ctr
     */
    constructor(app: Express.Application) {
        super();
        this.app = app;
    }

    /**
     * Boot module
     * @param payload object Payload data
     */
    public async boot(payload?: object): Promise<void> {
        await this.init(this.app);

        GlobalData.logger.info("Session Module initialized successfully");
    }

    /**
     * Initialize Session
     * @param app Application
     */
    public async init(app: Express.Application): Promise<void> {
        const config: SessionConfigType = (await GlobalMethods.config(
            "core/session"
        )) as SessionConfigType;

        /* Init Session */
        let sessionStore: Session.Store | Session.MemoryStore;
        switch (config.store) {
            case "redis":
                sessionStore = await this.createRedisSessionStore();
                break;

            case "memory":
            default:
                sessionStore = null;
                break;
        }

        /* Setup session */
        config.options.store = sessionStore;

        /* Setup application */
        app.use(Session(config.options));
    }

    /**
     * Create a Redis-Session Store
     */
    private async createRedisSessionStore(): Promise<Session.Store> {
        /* Intialize redis-client */
        const redisHelper = new RedisHelper();
        await redisHelper.connect();

        /* Init RedisStore */
        let RedisStore = ConnectRedis(Session);
        const redisStore: ConnectRedis.RedisStore = new RedisStore({
            client: redisHelper.client,
        });

        return redisStore;
    }
}

/**
 * Session Config Type
 */
export type SessionConfigType = {
    store: string;
    options: Session.SessionOptions;
};
