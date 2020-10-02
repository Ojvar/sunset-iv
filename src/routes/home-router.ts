"use strict";

import RouteHelper from "../core/heleprs/route-helper";
import HomeController from "../backend/controllers/home-controller";

/* Define router */
const router = new RouteHelper("");
const controller = new HomeController();

export default {
    baseUrl: "",
    router,
};

/* Prepare routes */
router.get("/", controller.index, "home.index");
router.get("/about", controller.about, "home.index");
