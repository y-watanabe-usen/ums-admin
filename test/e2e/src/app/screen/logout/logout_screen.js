const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const NotAuthedScreen = require(`${Dir.screenCommon}/not_authed_screen`);

module.exports = class LogoutScreen extends NotAuthedScreen {
    get alert() {
        return this.driver.findElement(By.xpath('//*[@id="p1"]/table/tbody/tr[6]/td')).getText();
    }

    async clickBtnLogout() {
        await this.driver.findElement(By.xpath('//*[@id="header_icon_logout"]/button')).click();
    }

    async logoutClick() {
        await this.driver.wait(until.alertIsPresent());
        let alert = await this.driver.switchTo().alert();
        await alert.accept();
    }
}
