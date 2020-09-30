"use strict";

import EventHandlerInterface from "interfaces/event-handler-interface";
import GlobalData from "../global/global-data";

export default class AppInitHandler implements EventHandlerInterface {
    /**
     * Get handler name
     */
    public getName(): string {
        return "AppInit";
    }

    /**
     * Boot event
     * @param payload object Payload object
     */
    public async boot(payload: object): Promise<void> {
        GlobalData.logger.info(
            "App-Init event-handler BOOT() successfully"
        );
    }

    /**
     * Handle method
     * @param payload Object Payload data
     */
    public async handle(payload: object): Promise<void> {
        GlobalData.logger.info("AppInit Handler\n\t\t> Server initialized successfully");
    }
}
