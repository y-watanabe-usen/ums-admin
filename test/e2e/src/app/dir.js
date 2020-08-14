const path = require('path');

module.exports = class Dir {
    static get home() {
        return `${__dirname}`;
    }
    static get screen() {
        return `${this.home}/screen`;
    }
    static get files() {
        return `${this.home}/files`;
    }
    static get config() {
        return `${this.home}/config`;
    }
    static get screenCommon() {
        return `${this.screen}/common`;
    }
    static get screenLogin() {
        return `${this.screen}/login`;
    }
    static get screenAccount() {
        return `${this.screen}/account`;
    }
    static get screenExtraction() {
        return `${this.screen}/extraction`;
    }
    static get screenDedicated() {
        return `${this.screen}/dedicated`;
    }
}