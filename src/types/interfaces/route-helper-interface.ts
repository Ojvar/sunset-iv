"use strict";

import { RouterItemType } from "data-types/router-item-type";
import { RequestHandler } from "express";
import IHash from "./hash";

/**
 * Event handler interface
 */
export default interface RouterHelperInterface {
    /**
     * Set baseUrl
     * @param baseUrl string Router name
     */
    setBaseUrl(baseUrl: string): void;

    /**
     * Get baseUrl
     * @return string Get the router name
     */
    getBaseUrl(): string;

    /**
     * Get routes list
     */
    getRoutesList(): IHash<RouterItemType>;

    /**
     * Add new route
     * @param alias string
     */
    private updateNamedRoutes(alias: string): void;

    /**
     * Define an action - [ALL]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    all(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [HEAD]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    head(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [GET]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    get(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [POST]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    post(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [PUT]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    put(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [PATCH]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    patch(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [DELETE]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    delete(url: string, handlers: RequestHandler, alias?: string): void;

    /**
     * Define an action - [OPTIONS]
     * @param url string Url
     * @param handlers Handlers
     * @param alias
     */
    options(url: string, handlers: RequestHandler, alias?: string): void;
}
