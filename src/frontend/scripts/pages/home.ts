"use strict";

import { createApp } from "vue";
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

        const app = createApp({
            data: () => ({
                name: "ali",
                counter: 0,
            }),

            methods: {
                inc() {
                    this.counter++;
                },
            },
        });

        app.mount("#app");
    }
}

/* Create a new instance */
export default new MainPage();
