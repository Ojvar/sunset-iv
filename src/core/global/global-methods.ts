"use strict";

import _, { result } from "lodash";
import Path from "path";
import FS from "fs";
import Glob from "glob";
import Ora from "ora";
import Express, { NextFunction } from "express";
import CSRFConfigType from "data-types/csrf-config-type";

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

    /**
     * Read a file
     * @param filename string File name
     */
    public static readFile(filename: string): object {
        let result: object = FS.readFileSync(GlobalMethods.rPath(filename));

        return result;
    }

    /**
     * Read a config file
     * @param config string Config filename
     * @param keyPath string Key path
     */
    public static async config<T>(
        config: string,
        keyPath?: string
    ): Promise<T> {
        let result: T;
        let path = GlobalMethods.rPath(__dirname, `../../config/${config}`);
        result = (await import(path)).default as T;

        if (keyPath) {
            result = _.get(result, keyPath) as T;
        }

        return result;
    }

    /**
     * Check for Ignore route form CSRF  or not
     * @param req Express.Request The request
     */
    public static async useCSRF(req: Express.Request): Promise<Function> {
        /* TODO: load csrf rules from config-file */
        const csrfRules: CSRFConfigType = await GlobalMethods.config<
            CSRFConfigType
        >("core/csrf-rules");
        const rules = (csrfRules.ignoreList + "").split(/[\ |\:\;\,]+/g);

        return function(
            req: Express.Request,
            res: Express.Response,
            next: NextFunction
        ): boolean {
            return (
                rules.find((rule: string) =>
                    req.originalUrl.match(new RegExp(rule))
                ) != null
            );
        };
    }

    /**
     * Check for RequestType
     * @param req Express.Request The request
     */
    public static getRequestType(req: Express.Request): string | boolean {
        return req.accepts(["html", "json"]);
    }
}
