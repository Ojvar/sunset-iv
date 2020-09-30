"use strict";

import Path from "path";
import Glob from "glob";
import Ora from "ora";

/**
 * Global methods
 */
export default class GlobalMethods {
    public static readonly C_ENV_PRODUCTION: string = "production";
    private static spinner: Ora.Ora;

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

    /**
     * Load all files from a specified location
     *  User can filter by regexp
     * @param pattern String Folder path
     * @param optinos Glob.IOoptions options
     */
    public static loadFiles(
        pattern: string,
        options?: Glob.IOptions
    ): string[] {
        return Glob.sync(pattern, options);
    }

    /**
     *
     * @param text string Loading text
     * @param color
     */
    public static showLoading(text: string, color?: Ora.Color): void {
        if (!GlobalMethods.spinner) {
            GlobalMethods.spinner = Ora(text);
        } else {
            GlobalMethods.spinner.text = text;
        }

        if (color) {
            GlobalMethods.spinner.color = color;
        }

        GlobalMethods.spinner.start();
    }

    /**
     * Stop loading
     */
    public static stopLoading(): void {
        if (!GlobalMethods.spinner) {
            return;
        }

        GlobalMethods.spinner.stop();
    }
}
