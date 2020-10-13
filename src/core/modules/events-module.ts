"use strict";

import _ from "lodash";
import IHash from "../../types/interfaces/hash-interface";
import BaseModule, { ICoreModule } from "./base-module";
import GlobalMethods from "../global/global-methods";
import GlobalData from "../global/global-data";

/**
 * Events class
 */
export default class Events extends BaseModule implements ICoreModule {
    private handlers: IHash<IEventHandler> = {};

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
        await this.init();

        GlobalData.logger.info("Events Module initialized successfully");
    }

    /**
     * Initialize module
     */
    public async init(): Promise<void> {
        const userEventHandlersPath: string = `${__dirname}/../../backend/event-handlers/**/*`;
        const globalEventHandlersPath: string = `${__dirname}/../event-handlers/**/*`;

        /* Load handlers */
        const eventHandlers = await GlobalMethods.loadFiles(
            globalEventHandlersPath
        );
        const userEventHandlers = await GlobalMethods.loadFiles(
            userEventHandlersPath
        );

        /* Union core and user handlers */
        let handlers = _.union(eventHandlers, userEventHandlers);

        /* Try to push to handlers */
        for (let i = 0; i < handlers.length; i++) {
            await this.addHandler(handlers[i]);
        }
    }

    /**
     * Add handler to handlers
     * @param file string File name
     */
    private async addHandler(file: string): Promise<void> {
        /* Load module */
        let EventHandler = await GlobalMethods.loadModule<any>(file);
        const eventHandler: IEventHandler = new EventHandler();
        const eventName: string = eventHandler.getName();

        /* Add to handlers */
        this.handlers[eventName] = eventHandler;

        /* Run module boot() method  */
        await eventHandler.boot(this.handlers);
    }

    /**
     * Raise an event
     * @param eventName string Event name
     * @param payload object Payload data
     */
    public raise(eventName: string, payload?: object): Promise<void> {
        let handler: IEventHandler = this.handlers[eventName];

        return handler.handle(payload);
    }
}

/**
 * Event handler interface
 */
export interface IEventHandler {
    /**
     * Get handler name
     */
    getName(): string;

    /**
     * Handle method
     * @param payload object Payload object
     */
    handle(payload?: object): Promise<void>;

    /**
     * Boot method
     *   Runs at loading object
     * @param payload object Payload object
     */
    boot(payload?: object): Promise<void>;
}
