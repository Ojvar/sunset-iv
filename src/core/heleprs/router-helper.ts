"use strict";

import Express, { RequestHandler } from "express";
import IHash from "interfaces/hash";
import RouterHelperInterface from "interfaces/router-helper-interface";
import { RouterItemType } from "data-types/router-item-type";

/**
 * Router class
 */
export default class RouterHelper implements RouterHelperInterface {
    private router: Express.Router;
    private namedRoutes: IHash<any> = {};
    private baseUrl: string;

    /**
     * Router ctr
     */
    constructor(baseUrl: string, options?: Express.RouterOptions) {
        this.baseUrl = baseUrl;
        this.router = Express.Router(options);
    }

    /**
     * Set baseUrl
     * @param baseUrl string Router name
     */
    public setBaseUrl(baseUrl: string): void {
        this.baseUrl = baseUrl;
    }

    /**
     * Get baseUrl
     * @return string Get the router name
     */
    public getBaseUrl(): string {
        return this.baseUrl;
    }

    /**
     * Return router
     * @returns Express.IRouter router
     */
    public getRouter(): Express.IRouter {
        return this.router;
    }

    /**
     * Get routes list
     */
    public getRoutesList(): IHash<RouterItemType> {
        const result: IHash<RouterItemType> = {};
        const keys = Object.keys(this.namedRoutes);

        keys.forEach((key) => {
            const route: any = this.namedRoutes[key];

            result[key] = {
                baseUrl: this.baseUrl,
                alias: key,
                path: route.route.path,
                keys: route.keys,
                method: route.route.stack.map((x: any) => x.method),
            } as RouterItemType;
        });

        return result;
    }

    /**
     * Add new route
     * @param alias string
     */
    public updateNamedRoutes(alias: string): void {
        const lastRoute = this.router.stack[this.router.stack.length - 1];

        this.namedRoutes[alias] = lastRoute;
    }

    /**
     * Define an action - [ALL]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    public all(url: string, handlers: RequestHandler, alias?: string): void {
        this.router.all(url, handlers);

        if (alias) {
            this.updateNamedRoutes(alias);
        }
    }

    /**
     * Define an action - [HEAD]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    public head(url: string, handlers: RequestHandler, alias?: string): void {
        this.router.head(url, handlers);

        if (alias) {
            this.updateNamedRoutes(alias);
        }
    }

    /**
     * Define an action - [GET]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    public get(url: string, handlers: RequestHandler, alias?: string): void {
        this.router.get(url, handlers);

        if (alias) {
            this.updateNamedRoutes(alias);
        }
    }

    /**
     * Define an action - [POST]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    public post(url: string, handlers: RequestHandler, alias?: string): void {
        this.router.post(url, handlers);

        if (alias) {
            this.updateNamedRoutes(alias);
        }
    }

    /**
     * Define an action - [PUT]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    public put(url: string, handlers: RequestHandler, alias?: string): void {
        this.router.put(url, handlers);

        if (alias) {
            this.updateNamedRoutes(alias);
        }
    }

    /**
     * Define an action - [PATCH]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    public patch(url: string, handlers: RequestHandler, alias?: string): void {
        this.router.patch(url, handlers);

        if (alias) {
            this.updateNamedRoutes(alias);
        }
    }

    /**
     * Define an action - [DELETE]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    public delete(url: string, handlers: RequestHandler, alias?: string): void {
        this.router.delete(url, handlers);

        if (alias) {
            this.updateNamedRoutes(alias);
        }
    }

    /**
     * Define an action - [OPTIONS]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */ public options(
        url: string,
        handlers: RequestHandler,
        alias?: string
    ): void {
        this.router.options(url, handlers);

        if (alias) {
            this.updateNamedRoutes(alias);
        }
    }
}
