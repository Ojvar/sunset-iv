"use strict";

import Chalk from "chalk";
import { IService } from "../../core/modules/service-module";
import GlobalData from "../../core/global/global-data";

/**
 * Test service class
 */
export default class TestService implements IService {
    /**
     * Get service name
     */
    public getName(): string {
        return "TestServiceXXX";
    }

    /**
     * Register service method
     * @param payload any Payload object
     */
    public async register(payload?: any): Promise<void> {
        GlobalData.logger.info(
            `Service ${Chalk.yellow(this.getName())} registred successfully`
        );
    }

    /**
     * Boot service method
     * @param payload any Payload object
     */
    public async boot(payload?: any): Promise<void> {
        GlobalData.logger.info(
            `Service ${Chalk.yellow(this.getName())} booted successfully`
        );
    }
}
