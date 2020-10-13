"use strict";

import IHash from "../../types/interfaces/hash-interface";
import GlobalMethods from "../global/global-methods";
import { ApplicationConfigType } from "../modules/application-module";

/**
 * GlobalFrontendFucntions class
 */
export default class GlobalFrontendFucntions {
    private mixManifest: IHash<string> = {};
    private appConfig: ApplicationConfigType = {} as ApplicationConfigType;
    private routesData: IHash<RouteDataType> = {};

    /**
     * Ctr
     */
    constructor() {
        this.prepare();
    }

    /**
     * Load mix-manifest data
     */
    private async prepare() {
        await this.loadAppConfig();
        await this.loadRoutesData();

        const mixData: object = await GlobalMethods.loadModule(
            "public/mix-manifest.json"
        );

        this.mixManifest = mixData as IHash<string>;
    }

    /**
     * Load routes data
     */
    private async loadRoutesData(): Promise<void> {
        const path: string = GlobalMethods.rPath(
            this.appConfig.publicPath,
            "router-manifest.json"
        );
        this.routesData = (await GlobalMethods.loadModule(path)) as IHash<
            RouteDataType
        >;
    }

    /**
     * Load application-config data
     */
    private async loadAppConfig(): Promise<void> {
        this.appConfig = await GlobalMethods.config<ApplicationConfigType>(
            "core/application"
        );
    }

    /**
     * Get route path
     * @param routeName string Route alias
     * @param args IHash<string|number> Arguments
     * @returns string The Route path
     */
    public route(routeName: string, args: IHash<string | number> = {}): string {
        const route: RouteDataType = this.routesData[routeName];

        /* Perpare */
        let keys: Array<RouteArgType> = route.keys;
        let routePath = route.path;
        let baseUrl = route.baseUrl;

        /*  Apply arguments */
        keys.forEach((key) => {
            const newValue: string = (args[key.name] as string) || "";
            const argKey = `/\\:${key.name}${key.optional ? "\\??" : ""}`;
            const regexp = new RegExp(argKey, "g");

            routePath = routePath.replace(regexp, `/${newValue}`);
        });

        /* Generate result */
        let result = `${baseUrl}${routePath}`;

        return result;
    }

    /**
     * Get full route data
     * @param routeName string Route alias
     * @param args Array[string|number] Arguments
     * @returns string The Route data
     */
    public routeData(routeName: string): RouteDataType {
        let route: RouteDataType = this.routesData[routeName];

        return route;
    }

    /**
     * Mix function
     * @param url string Url path
     * @returns string The compiled url
     */
    public mix(url: string): string {
        if (!url.startsWith("/")) {
            url = "/" + url;
        }

        url = this.mixManifest[url] as string;
        url = `${this.appConfig.protocol}://${this.appConfig.url}${url}`;

        return url;
    }
}

/**
 * Route data type
 */
export type RouteDataType = {
    baseUrl: string;
    alias: string;
    path: string;
    keys: Array<RouteArgType>;
    method: Array<string>;
};

/**
 * Route Arg type
 */
export type RouteArgType = {
    name: string;
    optional: boolean;
    offset: number;
};
