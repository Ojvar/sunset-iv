"use strict";

/*
    Driver: [null|mongodb]
*/

export default {
    driver: process.env.DB_DRIVER,

    mongodb: {
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT || 27017,
        db: process.env.DB_DB || "sunset_db",

        options: {
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        },
    },
};
