const { Builder, By, Key, Capabilities } = require('selenium-webdriver');

module.exports = class AccountSearchScreen {
    constructor(driver) {
        this.driver = driver;
    }

    get title() {
        return this.driver.findElement(By.className('main-title')).getText();
    }
}

