"use strict";

import RouteHelper from "../core/heleprs/router-helper";
import HomeController from "../backend/controllers/home-controller";

/* Define router */
const controller = new HomeController();
const router = new RouteHelper("");
export default router;

/* Prepare routes */
router.get("/:name?", controller.index, "home.index");
router.get("/about", controller.about, "home.about");
