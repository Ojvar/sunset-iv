"use strict";

import Path from "path";

/**
 * Global methods
 */
export default class GlobalMethods {
    public static readonly C_ENV_PRODUCTION: string = "production";

    /**
     * Return relative path by input-paraemters
     * @param args string[] Arguments
     */
    public static rPath(...args: string[]): string {
        return Path.resolve(...args);
    }

    /**
     * Return development mode
     */
    public static isProductionMode(): boolean {
        return process.env.NODE_ENV === GlobalMethods.C_ENV_PRODUCTION;
    }
}
