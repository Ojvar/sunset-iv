"use strict";

import Path from "path";
import GlobalMethods from "../global/global-methods";
import { ApplicationConfigType } from "../modules/application-module";

/**
 * GlobalFrontendFucntions class
 */
export default class GlobalFrontendFucntions {
    private mixManifest: any;
    private appConfig: ApplicationConfigType;

    /**
     * Ctr
     */
    constructor() {
        this.loadMixManifest();
    }

    /**
     * Load mix-manifest data
     */
    private async loadMixManifest() {
        this.appConfig = await GlobalMethods.config<ApplicationConfigType>(
            "core/application"
        );

        this.mixManifest = (await import("../global/global-data")) as object;
    }

    /**
     * Mix function
     * @param url string Url path
     * @returns string The compiled url
     */
    public mix(url: string): string {
        const path: string = Path.join(this.appConfig.publicPath, url);

        return this.mixManifest[path] as string;
    }
}
