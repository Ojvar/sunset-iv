"use strict";

/**
 * Application Config Type
 */
export default class ApplicationConfigType {
    public fullUrl: string;
    public host: string;
    public port: number;
    public url: string;
    public protocol: string;
    public isHttps: boolean;

    public trustedProxy: string;

    public throttleStore: string;
    public throttleWindow: string;
    public throttleMax: string;
    public throttleDelay: string;
    
    public useMulter: boolean;
}
