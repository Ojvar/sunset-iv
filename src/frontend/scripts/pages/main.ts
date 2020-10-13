"use strict";

import App from "../core/app";
import * as V from "vue";

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
        // const vueApp = createApp({});
        // vueApp.mount("#app");
    }
}

/* Create a new instance */
new MainPage();
