"use strict";

import Mongoose from "mongoose";
import RouteHelper from "../core/heleprs/router-helper";
import HomeController from "../backend/controllers/home-controller";

/* Define router */
const controller = new HomeController();
const router = new RouteHelper("");
export default router;

import GlobalData from "../core/global/global-data";
router.get("/usersList", async (req, res, next) => {
    const User = GlobalData.dbEngine().model("User");
    const allUsers = await User.find({});

    res.send(allUsers).end();
});

/* Prepare routes */
router.get("/about", controller.about, "home.about");
router.get("/:name?", controller.index, "home.index");
