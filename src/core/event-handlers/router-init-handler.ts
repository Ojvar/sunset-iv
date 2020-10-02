"use strict";

import EventHandlerInterface from "interfaces/event-handler-interface";
import GlobalData from "../global/global-data";

/**
 * Router Init Handler class
 */
export default class RouterInitHandler implements EventHandlerInterface {
    /**
     * Get handler name
     */
    public getName(): string {
        return "RouterInit";
    }

    /**
     * Boot event
     * @param payload object Payload object
     */
    public async boot(payload: object): Promise<void> {
        GlobalData.logger.info("Router-Init event-handler BOOT() successfully");
    }

    /**
     * Handle method
     * @param payload Object Payload data
     */
    public async handle(payload: object): Promise<void> {
        GlobalData.router.createManifestFile();

        GlobalData.logger.info(
            "RouterInit Handler\n\t\t> Router initialized successfully"
        );
    }
}
