"use strict";

import IHash from "interfaces/hash-interface";
import Path from "path";
import GlobalMethods from "../global/global-methods";
import { ApplicationConfigType } from "../modules/application-module";

/**
 * GlobalFrontendFucntions class
 */
export default class GlobalFrontendFucntions {
    private mixManifest: IHash<string> = {};
    private appConfig: ApplicationConfigType;

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
        if (null == this.appConfig) {
            this.appConfig = await GlobalMethods.config<ApplicationConfigType>(
                "core/application"
            );
        }

        const mixData: object = await GlobalMethods.loadModule(
            "public/mix-manifest.json"
        );

        this.mixManifest = mixData as IHash<string>;
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
