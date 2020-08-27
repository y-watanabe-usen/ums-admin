const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class RoleUserDetailScreen extends AuthedScreen {
    get employeeCd() {
        return this.driver.findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[1]')).getText();
    }

    get department() {
        return this.driver.findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[2]')).getText();
    }

    get employeeName() {
        return this.driver.findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[3]')).getText();
    }

    get btnEnable() {
        let elemBtn = this.driver.findElement(By.xpath('//*[@id="label_radio"]/span'));
        return elemBtn.isEnabled();
    }

    get updateCompleted() {
        return this.driver.findElement(By.xpath('//*[@id="pop_role"]/div[2]/div[2]')).getText();
    }

    async clickBtnBackSearch() {
        await this.driver.findElement(By.id('bt_back')).click();
    }

    async clickBtnEnable() {
        await this.driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div[3]/div/div[2]/div/table/tbody/tr[1]/td[3]/div/label[1]/span')).click();
    }

    async clickBtnEdit() {
        await this.driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div[3]/div/div[1]/div[2]/button')).click();
    }
    async clickBtnSave() {
        await this.driver.findElement(By.xpath('//*[@id="pop_role"]/div[2]/div[4]/button[1]')).click();
    }

    async clickBtnClose() {
        await this.driver.findElement(By.xpath('//*[@id="pop_role"]/div[2]/div[4]/button[2]')).click();
    }

    async clickBtnDisable() {
        await this.driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div[3]/div/div[2]/div/table/tbody/tr[1]/td[3]/div/label[2]/span')).click();
    }
}