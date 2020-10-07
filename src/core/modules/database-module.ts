"use strict";

import BaseModule, { ICoreModule } from "./base-module";
import GlobalData from "../global/global-data";
import GlobalMethods from "../global/global-methods";
import MongoDbDriver from "../heleprs/database-driver/mongodb-driver";

/**
 * Events class
 */
export default class Database extends BaseModule implements ICoreModule {
    private _driver: IDatabaseDriver<any>;

    /**
     * Getter for Database Driver engine
     */
    public get engine(): IDatabaseDriver<any> {
        return this._driver;
    }

    /**
     * Events-Class ctr
     */
    constructor() {
        super();
    }

    /**
     * Boot module
     * @param payload object Payload data
     */
    public async boot(payload?: object): Promise<void> {
        const config: object = await GlobalMethods.config("core/database");
        const globalConfig = config as DatabaseGeneralConfig;

        /* Load driver */
        const driverType: EnumDatabaseDriver = globalConfig.driver.toUpperCase() as EnumDatabaseDriver;
        switch (driverType) {
            case EnumDatabaseDriver.mongodb:
                await this.loadMongoDbDriver(config);
                break;

            default:
                GlobalData.logger.warn("No any database-driver selected");
                break;
        }

        GlobalData.logger.info("Database Module initialized successfully");
    }

    /**
     * Load mongoDb driver
     */
    private async loadMongoDbDriver(config: object): Promise<void> {
        const mongoDbConfig = config as DatabaseMongoDbConfigType;

        this._driver = new MongoDbDriver();
        await this._driver.init(mongoDbConfig.mongodb);
        await this._driver.connect();
        await this._driver.loadModels();

        GlobalData.logger.info("MongoDB driver initialized successfully");
    }
}

/**
 * Database Driver enum
 */
export enum EnumDatabaseDriver {
    none = "",
    mongodb = "MONGODB",
}

/**
 * Database MongoDB Config type
 */
export type DatabaseMongoDbConfigType = {
    mongodb: object;
};

/**
 * Database General Config type
 */
export type DatabaseGeneralConfig = {
    driver?: string;
};

/**
 * DatabaseDrive Interface
 */
export interface IDatabaseDriver<T> {
    /**
     * Init method
     * @param config object Config data
     */
    init(config?: object): Promise<void>;

    /**
     * Connect method
     */
    connect(): Promise<void>;

    /**
     * Disonnect method
     */
    disconnect(): Promise<void>;

    /**
     * LoadModels method
     */
    loadModels(): Promise<void>;

    /**
     * LoadModels method
     */
    getEngine(): T;
}
