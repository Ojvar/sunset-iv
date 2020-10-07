"use strict";

import Chalk from "chalk";
import Mongoose from "mongoose";

/**
 * User model
 */
export default class DbBaseModel {}

/**
 * Database model interface
 */
export interface IDbModel {
    /**
     * Get name
     */
    getName(): string;

    /**
     * Register model
     */
    register(engine?: any): Promise<Mongoose.Model<Mongoose.Document>>;
}
