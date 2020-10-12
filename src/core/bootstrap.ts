"use strict";

import Chalk from "chalk";
import ServerModule, { IServerBoot } from "./modules/server-module";

/**
 * Bootstrap class
 */
export default class Bootstraper {
    private static readonly C_ARG_ROUTES_MANIFEST: string = "--routes-manifest";

    /**
     * Boot method
     */
    public static async boot(): Promise<void> {
        const args: string[] = process.argv;
        const server: ServerModule = new ServerModule();

        if (-1 < args.indexOf(Bootstraper.C_ARG_ROUTES_MANIFEST)) {
            await server.boot(IServerBoot.CREATE_ROUTES_MANIFEST);
            await server.createRoutesManifrestFile();
            console.info("Routes manifest file created successfully");
            process.exit(0);
        } else {
            server.boot(IServerBoot.RUN_SERVER);
        }
    }

    /**
     * PrintUsage method
     */
    public static printUsage(): void {
        console.log(`
${Chalk.yellowBright("Sunset-IV")} MiniFramework
Create routes-manifest file
    npm run routes-manifest

Compile & Build resources
    Development mode
        $ npm run watch
    Production mode
        $ npm run prod

Run server (Development mode)
    $ npm run server-dev
Run server (Production mode)
    $ npm run server-start
Build server data (Production mode)
    $ npm run server-build
`);
    }
}

/* Boot server */
Bootstraper.boot();
