const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const Dir = require('dir');
const NotAuthedScreen = require(`${Dir.screenCommon}/not_authed_screen`);

module.exports = class LogoutScreen extends NotAuthedScreen {
    get alert() {
        return this.driver.findElement(By.xpath('//*[@id="p1"]/table/tbody/tr[6]/td')).getText();
    }

    async clickBtnLogout() {
        await this.driver.findElement(By.xpath('//*[@id="header_icon_logout"]/button')).click();
    }

    async logoutclick() {
        const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');

        await this.driver.wait(until.alertIsPresent());
        // アラートが出るまで待つ
        await this.driver.wait(until.alertIsPresent());
        // アラートテキストを変数に保存
        let alert = await this.driver.switchTo().alert();
        let alertText = await alert.getText();
        // OKボタンを押下
        await alert.accept();
    }
}
