"use strict";

import RateLimit from "express-rate-limit";
import CSURF from "csurf";
import Multer from "multer";
import LoggerModule from "../modules/logger-module";
import EventsModule from "../modules/events-module";
import ApplicationModule from "../modules/application-module";
import DataBaseModule from "../modules/database-module";
import RouterModule from "../modules/router-module";
import ServiceModule from "../modules/service-module";

/**
 * Global data
 */
export default class GlobalData {
    public static logger: LoggerModule;
    public static events: EventsModule;
    public static application: ApplicationModule;
    public static router: RouterModule;
    public static db: DataBaseModule;
    public static services: ServiceModule;

    public static rateLimiter: RateLimit.RateLimit;
    public static csrf: CSURF.CookieOptions;
    public static upload: Multer.Multer;

    /* Getters */
    public static dbEngine(): any {
        return GlobalData.db.engine.getEngine();
    }
}
