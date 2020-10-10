"use strict";

import _ from "lodash";
import FS from "fs";
import Path from "path";
import IHash from "interfaces/hash-interface";
import Express, { RequestHandler } from "express";
import { ServerConfigType } from "./server-module";
import BaseModule, { ICoreModule } from "./base-module";
import GlobalData from "../global/global-data";
import GlobalMethods from "../global/global-methods";
import Application from "./application-module";

/**
 * Router class
 */
export default class Router extends BaseModule implements ICoreModule {
    private routers: IRouterHelper[] = [];
    private routeList: IHash<RouterItemType> = {};

    /**
     * Get collected routes list
     */
    public get routesList(): IHash<RouterItemType> {
        return this.routeList;
    }

    /**
     * Events-Class ctr
     */
    constructor() {
        super();
    }

    /**
     * Boot module
     * @param payload object Payload data
     */
    public async boot(payload?: object): Promise<void> {
        await this.prepareRoutes();
        GlobalData.logger.info("Router Module initialized successfully");
    }

    /**
     * Prepare routes list
     */
    public async prepareRoutes(): Promise<void> {
        const routesPath: string = `${__dirname}/../../routes/**/*`;
        const files: string[] = await GlobalMethods.loadFiles(routesPath);

        for (let i = 0; i < files.length; ++i) {
            const file: string = files[i];

            /* Load module */
            const router = await GlobalMethods.loadModule<IRouterHelper>(file);
            const routesList: IHash<RouterItemType> = router.getRoutesList();

            /* Update lists */
            this.routers.push(router);
            this.routeList = _.merge({}, this.routeList, routesList);
        }
    }

    /**
     * Setup App routes
     * @param app Application Application instance
     */
    public setupRoutes(app: Application): void {
        for (let i = 0; i < this.routers.length; i++) {
            const router = this.routers[i];

            app.useRouter(router.getBaseUrl(), router.getRouter());
        }
    }

    /**
     * Create manifest file
     * @param path string Output file-path
     */
    public async createManifestFile(path?: string): Promise<void> {
        const config: ServerConfigType = (await GlobalMethods.config(
            "core/server"
        )) as ServerConfigType;

        if (null == path) {
            path = GlobalMethods.rPath(
                config.publicFolder,
                config.routerManifest
            );
        }

        /* Make path */
        await GlobalMethods.createDir(Path.dirname(path));

        const jsData: string = JSON.stringify(this.routeList, null, 2);
        FS.writeFileSync(path, jsData);
    }
}

/**
 * Route Item DataType
 */
export type RouterItemType = {
    baseUrl: string;
    path: string;
    alias?: string;
    method: string;
    keys?: {
        name: string;
        optional: boolean;
        order: number;
    };
};

/**
 * Event handler interface
 */
export interface IRouterHelper {
    /**
     * Set baseUrl
     * @param baseUrl string Router name
     */
    setBaseUrl(baseUrl: string): void;

    /**
     * Get baseUrl
     * @return string Get the router name
     */
    getBaseUrl(): string;

    /**
     * Get routes list
     */
    getRoutesList(): IHash<RouterItemType>;

    /**
     * Return router
     * @returns Express.IRouter router
     */
    getRouter(): Express.IRouter;

    /**
     * Add new route
     * @param alias string
     */
    updateNamedRoutes(alias: string): void;

    /**
     * Define an action - [ALL]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    all(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [HEAD]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    head(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [GET]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    get(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [POST]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    post(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [PUT]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    put(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [PATCH]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    patch(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [DELETE]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    delete(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [OPTIONS]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    options(url: string, handlers: RequestHandler, alias?: string): void;
}
