"use strict";

import Session from "express-session";

/**
 * Session Config Type
 */
export default class SessionConfigType {
    public store: string;
    public options: Session.SessionOptions;
}
