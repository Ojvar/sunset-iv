"use strict";

import App from "../core/app";

/**
 * MainPage class
 */
export class MainPage extends App {
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
        console.log("Hello from index page");
    }
}

/* Create a new instance */
export default new MainPage();
