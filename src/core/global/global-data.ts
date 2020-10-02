"use strict";

import RateLimit from "express-rate-limit";
import CSURF from "csurf";
import LoggerModule from "../modules/logger-module";
import EventsModule from "../modules/events-module";
import ApplicationModule from "../modules/application-module";

/**
 * Global data
 */
export default class GlobalData {
    public static logger: LoggerModule;
    public static events: EventsModule;
    public static application: ApplicationModule;
    public static rateLimiter: RateLimit.RateLimit;
    public static csrf: CSURF.CookieOptions;
}
