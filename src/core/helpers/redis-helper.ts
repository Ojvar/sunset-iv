"use strict";

import Redis from "redis";
import GlobalData from "../global/global-data";

/**
 * Redis helper class
 */
export default class RedisHelper {
    private _client: Redis.RedisClient | null = null;
    private clientOptions: Redis.ClientOpts;

    /**
     * Redis class ctr
     * @param option RedisOptionType Options
     */
    constructor(options?: Redis.ClientOpts) {
        this.clientOptions = options || ({} as Redis.ClientOpts);
    }

    /**
     * Get redis client
     * @returns Redis.RedisClient redis client
     */
    get client(): Redis.RedisClient {
        if (null == this._client) {
            throw new Error("Null client");
        }

        return this._client;
    }

    /**
     * Connect to server
     */
    public connect(): Promise<void> {
        return new Promise((resolve, reject): void => {
            this._client = Redis.createClient(this.clientOptions);

            /* Setup event listeners */
            this.client.on("error", (err) => {
                GlobalData.logger.error(JSON.stringify(err));
                reject(err);
            });
            this.client.on("connect", () => {
                GlobalData.logger.info("Redis client connected");
            });
            this.client.on("reconnecting", () => {
                GlobalData.logger.warn("Redis client reconnecting");
            });
            this.client.on("end", () => {
                GlobalData.logger.info(
                    "Redis client connection has been closed"
                );
            });

            if (null != this.clientOptions.password) {
                /* Callback function */
                const cb: Redis.Callback<any> = (
                    err: Error | null,
                    data: any
                ) => {
                    if (err) {
                        GlobalData.logger.error(JSON.stringify(err));
                        reject(err);
                    } else {
                        resolve();
                    }
                };

                this.client.auth(this.clientOptions.password, cb);
            } else {
                resolve();
            }
        });
    }

    /**
     * Disconnect from server
     */
    public disconnect(): void {
        if (this.client) {
            this.client.end();
        }
    }

    /**
     * Change database
     * @param db number|string DB index
     */
    public selectDB(db: number | string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            /* Callback function */
            const cb: Redis.Callback<any> = (err: Error | null, data: any) => {
                if (err) {
                    GlobalData.logger.error(JSON.stringify(err));
                    reject(err);
                } else {
                    resolve(true);
                }
            };

            this.client.select(db, cb);
        });
    }

    /**
     * Run a command - promise based
     */
    public send(cmd: string, ...args: string[]): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            /* Callback function */
            const cb: Redis.Callback<any> = (err: Error | null, data: any) => {
                if (err) {
                    GlobalData.logger.error(JSON.stringify(err));
                    reject(err);
                } else {
                    resolve(data);
                }
            };

            /* Send command */
            this.client.sendCommand(cmd, args, cb);
        });
    }
}
