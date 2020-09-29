"use strict";

/**
 * BaseModule class
 */
export default class BaseModule {
    /**
     * BaseModule ctr
     */
    constructor() {}

    /**
     * Return development mode
     */
    public isProductionMode(): boolean {
        return process.env.NODE_ENV === "production";
    }
}
