"use strict";

/**
 * DatabaseDrive Interface
 */
export default interface DatabaseDriverInterface<T> {
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
