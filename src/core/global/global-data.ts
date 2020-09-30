"use strict";

import LoggerModule from "../modules/logger-module";
import EventsModule from "../modules/events-module";

/**
 * Global data
 */
export default class GlobalData {
    public static logger: LoggerModule;
    public static events: EventsModule;
}
