const { Builder, By, Key, Capabilities } = require('selenium-webdriver');

module.exports = class LoginScreen {
    constructor(driver) {
        this.driver = driver;
    }

    get code() {
        return this.driver.findElement(By.name('code')).getText();
    }

    get password() {
        return this.driver.findElement(By.name('password')).getText();
    }

    get alert() {
        return this.driver.findElement(By.xpath('//*[@id="p1"]/table/tbody/tr[6]/td')).getText();
    }

    async inputCode(code) {
        await this.driver.findElement(By.name('code')).sendKeys(code);
    }

    async inputPassword(password) {
        await this.driver.findElement(By.name('password')).sendKeys(password);
    }

    async clickBtnLogin() {
        await this.driver.findElement(By.id('bt_login')).click();
    }
}
