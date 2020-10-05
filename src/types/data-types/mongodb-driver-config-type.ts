"use strict";

import Mongoose from "mongoose";

export default class MongodbDriverConfigType {
    public host?: string;
    public port?: number;
    public db?: string;

    public options?: Mongoose.ConnectionOptions;
}
