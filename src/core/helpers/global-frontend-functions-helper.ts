"use strict";

import GlobalMethods from "../global/global-methods";
import { ApplicationConfigType } from "../modules/application-module";
import IHash from "../../types/interfaces/hash-interface";

/**
 * GlobalFrontendFucntions class
 */
export default class GlobalFrontendFucntions {
    private mixManifest: IHash<string> = {};
    private appConfig: ApplicationConfigType = {} as ApplicationConfigType;

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

        const mixData: object = await GlobalMethods.loadModule(
            "public/mix-manifest.json"
        );

        this.mixManifest = mixData as IHash<string>;
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
