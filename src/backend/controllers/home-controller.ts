"use strict";

import Express, { NextFunction } from "express";
import BaseController from "./base-controller";

/**
 * Home controller
 */
export default class HomeController extends BaseController {
    /**
     * Index action
     * @param req Express.Reuest Request
     * @param res Express.Response Response
     * @param next NextFunction Next function
     */
    public async index(
        req: Express.Request,
        res: Express.Response,
        next: NextFunction
    ): Promise<void> {
        const name: string = req.params.name || "John Doe";
        const session: any = req.session || {};

        if (session) {
            /* Increse visit count */
            session.visitCount = (session.visitCount || 0) + 1;
        }

        res.render("home.pug", {
            name,
            visitCount: session.visitCount,
        });
    }

    /**
     * About action
     * @param req Express.Reuest Request
     * @param res Express.Response Response
     * @param next NextFunction Next function
     */
    public async about(
        req: Express.Request,
        res: Express.Response,
        next: NextFunction
    ): Promise<void> {
        res.render("about.pug");
    }
}
