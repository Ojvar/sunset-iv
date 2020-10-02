"use strict";

import _ from "lodash";
import FS from "fs";
import Path from "path";
import IHash from "interfaces/hash";
import CoreModuleInterface from "interfaces/core-module-interface";
import RouterHelperInterface from "interfaces/route-helper-interface";
import ServerConfigType from "data-types/server-config-type";
import { RouterItemType } from "data-types/router-item-type";
import BaseModule from "./base-module";
import GlobalData from "../global/global-data";
import GlobalMethods from "../global/global-methods";

/**
 * Router class
 */
export default class Router extends BaseModule implements CoreModuleInterface {
    private routers: IHash<RouterItemType> = {};

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
            const router = (await import(file))
                .default as RouterHelperInterface;
            const routesList: IHash<RouterItemType> = router.getRoutesList();

            /* Append to routers list */
            this.routers = _.merge({}, this.routers, routesList);
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

        /* TODO: USE ROUTERS DATA */
        const jsData: string = JSON.stringify(this.routers, null, 2);
        FS.writeFileSync(path, jsData);
    }
}
