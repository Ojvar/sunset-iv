"use strict";

import { DatabaseMongoDbConfigType } from "data-types/database-mongodb-config-type";
import CoreModuleInterface from "interfaces/core-module-interface";
import DatabaseDriverInterface from "interfaces/database-driver-interface";
import GlobalData from "../global/global-data";
import GlobalMethods from "../global/global-methods";
import MongoDbDriver from "../heleprs/database-driver/mongodb-driver";
import BaseModule from "./base-module";

/**
 * Data
 */
export type DatabaseGeneralConfig = {
    driver?: string;
};

/**
 * Events class
 */
export default class Events extends BaseModule implements CoreModuleInterface {
    private driver: DatabaseDriverInterface<any>;

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
        const globalConfig = config as {
            driver?: string;
        };

        if (globalConfig.driver === "mongodb") {
            await this.loadMongoDbDriver(config);
        } else {
            GlobalData.logger.warn("No any database-driver selected");
        }

        GlobalData.logger.info("Database Module initialized successfully");
    }

    /**
     * Load mongoDb driver
     */
    private async loadMongoDbDriver(config: object): Promise<void> {
        const mongoDbConfig = config as DatabaseMongoDbConfigType;

        this.driver = new MongoDbDriver();
        await this.driver.init(mongoDbConfig.mongodb);
        await this.driver.connect();

        GlobalData.logger.info("MongoDB driver initialized successfully");
    }
}
