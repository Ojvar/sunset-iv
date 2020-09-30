"use strict";

/**
 * Event handler interface
 */
export default interface EventHandlerInterface {
    /**
     * Get handler name
     */
    getName(): string;

    /**
     * Handle method
     * @param payload object Payload object
     */
    handle(payload: object): Promise<void>;

    /**
     * Boot method
     *   Runs at loading object
     * @param payload object Payload object
     */
    boot(payload: object): Promise<void>;
}
