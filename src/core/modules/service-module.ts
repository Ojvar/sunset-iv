"use strict";

import Chalk from "chalk";
import IHash from "interfaces/hash-interface";
import GlobalData from "../global/global-data";
import GlobalMethods from "../global/global-methods";
import BaseModule, { ICoreModule } from "./base-module";

/**
 * Events class
 */
export default class Service extends BaseModule implements ICoreModule {
    private services: IHash<ServiceKeyType> = {};
    public static readonly C_TAG_SERVICE_CORE: string = "CORE_SERVCICE";
    public static readonly C_TAG_SERVICE_USER: string = "USER_SERVCICE";

    /**
     * Service-Class ctr
     */
    constructor() {
        super();
    }

    /**
     * Boot module
     * @param payload object Payload data
     */
    public async boot(payload?: object): Promise<void> {
        /* Load Core services */
        const coreServciePath: string = GlobalMethods.rPath(
            __dirname,
            "../services/**/*"
        );
        await this.loadServices(Service.C_TAG_SERVICE_CORE, coreServciePath);

        /* Load User service */
        const userServciePath: string = GlobalMethods.rPath(
            __dirname,
            "../../backend/services/**/*"
        );
        await this.loadServices(Service.C_TAG_SERVICE_USER, userServciePath);

        GlobalData.logger.info("Services Module initialized successfully");
    }

    /**
     * Load services
     * @param serviceTag string Service tag
     * @param servicePath string Service path
     */
    private async loadServices(
        serviceTag: string,
        servicePath: string
    ): Promise<void> {
        const files: string[] = await GlobalMethods.loadFiles(servicePath);

        GlobalData.logger.info(
            `Loading services from directory\n\t\t${Chalk.yellow(servicePath)}`
        );

        /* Register service(s) */
        for (let i = 0; i < files.length; i++) {
            const file: string = files[i];
            const newService: IService = await this.loadService(
                serviceTag,
                file
            );

            /* Try to register new service */
            await newService.register();
        }

        /* Try to Boot services */
        const values = Object.values(this.services);
        for (let i = 0; i < values.length; i++) {
            const service: IService = values[i].service;

            /* Try to boot service */
            await service.boot();
        }
    }

    /**
     * Load a service
     * @param servcieTag string Service tag
     * @param file string Service path
     */
    private async loadService(
        serviceTag: string,
        file: string
    ): Promise<IService> {
        GlobalData.logger.info(
            `Loading service from file\n\t\t${Chalk.green(file)}`
        );

        /* Load service and create new instance */
        const Module = await GlobalMethods.loadModule(file);
        const newService: IService = new Module() as IService;

        /* Create new service item */
        let key: string = newService.getName();
        let serviceData: ServiceKeyType = {
            tag: serviceTag,
            path: file,
            service: newService,
        } as ServiceKeyType;

        /* Append to services list */
        this.services[key] = serviceData;

        GlobalData.logger.info(
            `Service ${Chalk.yellow(key)} loaded successfully`
        );

        return newService;
    }
}

/**
 * Service interface
 */
export interface IService {
    /**
     * Get service name
     */
    getName(): string;

    /**
     * Register service method
     * @param payload any Payload object
     */
    register(payload?: any): Promise<void>;

    /**
     * Boot service method
     * @param payload any Payload object
     */
    boot(payload?: any): Promise<void>;
}

/**
 * Service key type
 */
export type ServiceKeyType = {
    tag: string;
    path: string;
    service: IService;
};
