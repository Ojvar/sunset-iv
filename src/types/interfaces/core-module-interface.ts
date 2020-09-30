"use strict";

/**
 * Core Module Interface
 */
export default interface CoreModuleInterface {
    /**
     * Boot method
     *   Runs at loading object
     * @param payload object Payload object
     */
    boot(payload: object): Promise<void>;
}
