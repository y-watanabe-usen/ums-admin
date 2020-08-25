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
    static get tests() {
        return `${this.home}/tests`;
    }
    static get screenCommon() {
        return `${this.screen}/common`;
    }
    static get screenLogin() {
        return `${this.screen}/login`;
    }
    static get screenLogout() {
        return `${this.screen}/logout`;
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
    static get screenRole() {
        return `${this.screen}/role`;
    }
    static get screenIssue() {
        return `${this.screen}/issue`;
    }
    static get filesExtraction() {
        return `${this.files}/extraction`;
    }
    static get filesDedicated() {
        return `${this.files}/dedicated`;
    }
    static get filesIssue() {
        return `${this.files}/issue`;
    }
}