"use strict";

export default {
    publicPath: "public",

    host: process.env.HOST || "127.0.0.1",
    port: process.env.PORT || 8585,
    url: process.env.SERVER_URL || "127.0.0.1:8585",
    protocol: process.env.PROTOCOL || "https",
    trustedProxy:
        process.env.TRUSTED_PROXY || "loopback, linklocal, uniquelocal",

    throttleStore: process.env.EXPRESS_THROTTLE_STORE || "memory",
    throttleWindow: process.env.EXPRESS_THROTTLE_WINDOW || 60 * 1000,
    throttleMax: process.env.EXPRESS_THROTTLE_MAX || 60,
    throttleDelay: process.env.EXPRESS_THROTTLE_DELAY || 0,

    /* Use multer as default */
    useMulter: true,
};
