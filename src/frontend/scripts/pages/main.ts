"use strict";

import App from "../core/app";
// import { createApp } from "vue";

/**
 * MainPage class
 */
export default class MainPage extends App {
    /**
     * Ctr
     */
    constructor() {
        super();
        this.init();
    }

    /**
     * Init vue
     */
    private init(): void {
        const app = createApp({});
        // app.mount("#app");
    }
}

/* Create a new instance */
new MainPage();
