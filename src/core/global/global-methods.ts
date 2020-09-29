"use strict";

import Path from "path";

/**
 * Global methods
 */
export default class GlobalMethods {
    /**
     * Return relative path by input-paraemters
     * @param args string[] Arguments
     */
    public static rPath(...args: string[]): string {
        return Path.resolve(...args);
    }
}
