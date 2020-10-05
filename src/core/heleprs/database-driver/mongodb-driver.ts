"use strict";

import _ from "lodash";
import Chalk from "chalk";
import Mongoose from "mongoose";
import DatabaseDriverInterface from "interfaces/database-driver-interface";
import MongodbDriverConfigType from "data-types/mongodb-driver-config-type";
import GlobalData from "../../global/global-data";

/**
 * MongoDB Driver
 */
export default class MongoDbDriver
    implements DatabaseDriverInterface<Mongoose.Mongoose> {
    private config: object = null;
    private _engine: Mongoose.Mongoose;
    private connectionUrl: string;

    /**
     * Get engine
     */
    public getEngine(): Mongoose.Mongoose {
        return this._engine;
    }

    /**
     * Init driver
     * @param config object Config object
     */
    public async init(config?: object): Promise<void> {
        config = config || { options: {} };
        this.config = config;

        let mongoDBConfig: MongodbDriverConfigType = config as MongodbDriverConfigType;

        /* Generate connection url */
        this.connectionUrl = this.getConnectionUrl(mongoDBConfig);

        GlobalData.logger.info(
            `MongoDB Options \n\t${JSON.stringify(this.config, null, 2)}`
        );
        GlobalData.logger.info(
            `MongoDB Connection URL\t${Chalk.yellow(this.connectionUrl)}`
        );
    }

    /**
     * Get connection url
     * @param config object Confing object
     */
    private getConnectionUrl(config: MongodbDriverConfigType): string {
        let connectionString: string = "";

        /* Format: mongodb://host:port/db */
        if (config.host) {
            connectionString = `mongodb://${config.host}`;

            if (config.port) {
                connectionString += `:${config.port}`;
            }

            if (config.db) {
                connectionString += `/${config.db}`;
            }
        }

        return connectionString;
    }

    /**
     * Connect to database
     */
    public async connect(): Promise<void> {
        let mongoDBConfig: MongodbDriverConfigType = this
            .config as MongodbDriverConfigType;

        /* Try to connect */
        this._engine = await Mongoose.connect(
            this.connectionUrl,
            mongoDBConfig.options
        );
    }

    /**
     * Disconnect from database
     */
    public disconnect(): Promise<void> {
        return this._engine.disconnect();
    }

    /**
     * Load models
     */
    public async loadModels(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
