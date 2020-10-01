"use strict";

export default {
    host: process.env.HOST || "127.0.0.1",
    port: process.env.PORT || 8585,
    url: process.env.SERVER_URL || "127.0.0.1:8585",
    protocol: process.env.PROTOCOL || "http",
};
