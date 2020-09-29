"use strict";

import Winston from "winston";
import BaseModule from "./base-module";
import GlobalMethods from "../global/global-methods";
import LoggerConfig from "../../config/core/logger-config";

/**
 * Logger class
 */
export default class Logger extends BaseModule {
    private logsFilename: string;
    private errorFilename: string;

    /**
     * Logger class ctr
     */
    constructor(public logEngine: any = console) {
        super();

        this.setupVariables();
        this.initWinstonLogger();
    }

    /**
     * Setup variables
     */
    private setupVariables(): void {
        let logPath = LoggerConfig.logFolder;

        this.logsFilename = GlobalMethods.rPath(logPath, "logs.log");
        this.errorFilename = GlobalMethods.rPath(logPath, "errors.log");
    }

    /**
     * Colorize the output
     * @param msg Incoming message
     * @returns String
     */
    private colorPrintFnc(msg: Winston.Logform.TransformableInfo): string {
        const colorizer: Winston.Logform.Colorizer = Winston.format.colorize();

        return colorizer.colorize(
            msg.level,
            `${msg.timestamp} - ${msg.level}: ${msg.message}`
        );
    }

    /**
     * Return RAW format of msg
     * @param msg Incoming message
     * @returns String
     */
    private rawPrintFnc(msg: Winston.Logform.TransformableInfo): string {
        return `${msg.level}\t${msg.timestamp} - ${msg.level}: ${msg.message}`;
    }

    /**
     * Init winston logger
     */
    private initWinstonLogger(): void {
        /* Add to log file  */
        const logger = Winston.createLogger({
            // level: "info",
            // defaultMeta: {},
            format: Winston.format.combine(
                Winston.format.timestamp(),
                Winston.format.simple(),
                Winston.format.printf(this.rawPrintFnc)
            ),

            transports: [
                new Winston.transports.File({
                    filename: this.errorFilename,
                    level: "error",
                }),
                new Winston.transports.File({ filename: this.logsFilename }),
            ],
        });

        /* Print to console */
        if (super.isProductionMode() === false) {
            logger.add(
                new Winston.transports.Console({
                    format: Winston.format.combine(
                        Winston.format.timestamp(),
                        Winston.format.simple(),
                        Winston.format.printf(this.colorPrintFnc)
                    ),
                })
            );
        }

        /* Set logger engine */
        this.logEngine = logger;
    }

    /**
     *  Log a message
     * @param type String Log type
     * @param log String Log message
     * @param tag String Log tag
     */
    public log(type: string, log: string, tag?: string): string {
        if (tag) {
            log = `${tag}\n\t${log}`;
        }

        /* Log message */
        this.logEngine[type](log);

        return log;
    }

    /**
     *  Log an info message
     * @param log String Log message
     * @param tag String Log tag
     */
    public info(log: string, tag?: string): string {
        return this.log("info", log, tag);
    }

    /**
     *  Log a debug message
     * @param log String Log message
     * @param tag String Log tag
     */
    public debug(log: string, tag?: string): string {
        return this.log("debug", log, tag);
    }

    /**
     *  Log a warning message
     * @param log String Log message
     * @param tag String Log tag
     */
    public warning(log: string, tag?: string): string {
        return this.log("warning", log, tag);
    }

    /**
     *  Log an error message
     * @param log String Log message
     * @param tag String Log tag
     */
    public error(log: string, tag?: string): string {
        return this.log("error", log, tag);
    }
}
