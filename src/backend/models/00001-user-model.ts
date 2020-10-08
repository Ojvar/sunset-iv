"use strict";

import Chalk from "chalk";
import Mongoose from "mongoose";
import GlobalData from "../../core/global/global-data";
import DbBaseModel, { IDbModel } from "../../core/helpers/db-base-model";

/**
 * User model interface
 */
export interface IUserModel extends Mongoose.Document {
    name: string;
    pwd: string;

    activated_at: Date;

    created_at: Date;
    created_by?: Mongoose.Types.ObjectId;
}

/**
 * User model
 */
export default class UserModel extends DbBaseModel implements IDbModel {
    /**
     * Get model name
     */
    public getName(): string {
        return "User";
    }

    /**
     * Register model
     */
    public async register(
        engine: Mongoose.Mongoose
    ): Promise<Mongoose.Model<IUserModel>> {
        const model: Mongoose.Model<IUserModel> = engine.model<IUserModel>(
            this.getName(),
            this.getSchema()
        );

        GlobalData.logger.info(
            `Model ${Chalk.yellow(this.getName())} loaded successfully`
        );

        return model;
    }

    /**
     * Get Schema
     */
    private getSchema(): Mongoose.Schema {
        const schemaDef: Mongoose.SchemaDefinition = {
            name: {
                type: String,
                required: true,
                trimed: true,
                unique: true,
                index: true,
            },

            pwd: {
                type: String,
                required: true,
            },

            activated_at: {
                type: Date,
            },
        };

        /* Define schmea */
        const schema: Mongoose.Schema = new Mongoose.Schema(schemaDef, {
            createdAt: "created_at",
            updatedAt: "updated_at",
        } as Mongoose.SchemaOptions);

        /* Return schema */
        return schema;
    }
}
