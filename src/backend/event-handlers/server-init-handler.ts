"use strict";

import { IEventHandler } from "../../core//modules/events-module";
import GlobalData from "../../core/global/global-data";

export default class ServerInitHandler implements IEventHandler {
    /**
     * Get handler name
     */
    public getName(): string {
        return "ServerInit";
    }

    /**
     * Boot event
     * @param payload object Payload object
     */
    public async boot(payload: object): Promise<void> {
        GlobalData.logger.info("ServerInit event-handler BOOT() successfully");
    }

    /**
     * Handle method
     * @param payload Object Payload data
     */
    public async handle(payload: object): Promise<void> {
        GlobalData.logger.info(
            "ServerInit Handler\n\t\t> Server initialized successfully"
        );
    }
}
