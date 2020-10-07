"use strict";

/**
 * BaseModule class
 */
export default class BaseModule {
    /**
     * BaseModule ctr
     */
    constructor() {}
}

/**
 * Core Module Interface
 */
export interface ICoreModule {
    /**
     * Boot method
     *   Runs at loading object
     * @param payload object Payload object
     */
    boot(payload?: object): Promise<void>;
}
