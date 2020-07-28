const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const AuthedScreen = require(`${__dirname}/common/authed_screen`);

module.exports = class AccountSearchScreen extends AuthedScreen {

    get firstCustCd() {
        return this.driver.findElement(By.xpath('//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[1]/td[2]')).getText();
    }
    get name() {
        return this.driver.findElement(By.xpath('//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[2]/td[2]')).getText();
    }
    get clientStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[3]/td[2]')).getText();
    }
    get address() {
        return this.driver.findElement(By.xpath('//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[4]/td[2]')).getText();
    }
    get tel() {
        return this.driver.findElement(By.xpath('//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[5]/td[2]')).getText();
    }
    get branch() {
        return this.driver.findElement(By.xpath('//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[6]/td[2]')).getText();
    }
    get regularStore() {
        return this.driver.findElement(By.xpath('//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[1]/td[2]')).getText();
    }
    get industry() {
        return this.driver.findElement(By.xpath('//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[2]/td[2]')).getText();
    }
    get launch() {
        return this.driver.findElement(By.xpath('//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[3]/td[2]')).getText();
    }
    get close() {
        return this.driver.findElement(By.xpath('//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[4]/td[2]')).getText();
    }
    get cancell() {
        return this.driver.findElement(By.xpath('//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[5]/td[2]')).getText();
    }
    get lastUpdate() {
        return this.driver.findElement(By.xpath('//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[6]/td[2]')).getText();
    }
    get accountId() {
        return this.driver.findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[1]')).getText();
    }
    get accountStatus() {
        return this.driver.findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[2]')).getText();
    }
    get loginId() {
        return this.driver.findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[3]')).getText();
    }
    get mailAddress() {
        return this.driver.findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[4]')).getText();
    }
    get umsidStartDate() {
        return this.driver.findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[5]')).getText();
    }
    get umsidRegistDate() {
        return this.driver.findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[6]')).getText();
    }
    get umsidLostDate() {
        return this.driver.findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[7]')).getText();
    }
    get availability() {
        return this.driver.findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[9]')).getText();
    }
    get shippingDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[1]')).getText();
    }
    get missedDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[2]')).getText();
    }
    get shippingName() {
        return this.driver.findElement(By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[3]')).getText();
    }
    get shippingAddress() {
        return this.driver.findElement(By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[4]')).getText();
    }
    get destination() {
        return this.driver.findElement(By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[5]')).getText();
    }
    get shippingStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[6]')).getText();
    }
    get outputDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr/td[1]')).getText();
    }
    get outputName() {
        return this.driver.findElement(By.xpath('//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr/td[2]')).getText();
    }
    get outputAddress() {
        return this.driver.findElement(By.xpath('//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr/td[3]')).getText();
    }
    get outputPerson() {
        return this.driver.findElement(By.xpath('//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr/td[4]')).getText();
    }
    get deleteTableShippingDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[1]')).getText();
    }
    get addTableDirectOutputDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr[1]/td[1]')).getText();
    }
    get addTableDirectOutputName() {
        return this.driver.findElement(By.xpath('//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr[1]/td[2]')).getText();
    }
    get addTableDirectOutputAddress() {
        return this.driver.findElement(By.xpath('//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr[1]/td[3]')).getText();
    }
    get addTableDirectOutputPerson() {
        return this.driver.findElement(By.xpath('//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr[1]/td[4]')).getText();
    }
    async clickBtnReturnList() {
        await this.driver.findElement(By.id('bt_back')).click();
    }
    async clickBtnReRegist() {
        await this.driver.findElement(By.id('bt_issue')).click();
    }
    async clickBtnReRegistSave() {
        await this.driver.findElement(By.xpath('//*[@id="pop_issue"]/div[2]/div[10]/button[1]')).click();
    }
    async clickBtnReRegistClose() {
        await this.driver.findElement(By.xpath('//*[@id="pop_issue"]/div[2]/div[10]/button[2]')).click();
    }
    async clickBtnShippingDelete() {
        await this.driver.findElement(By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[7]/span/button')).click();
    }
    async clickBtnShippingDeleteClose() {
        await this.driver.findElement(By.xpath('//*[@id="pop_status_flag"]/div[2]/div[3]/button[2]')).click();
    }
    async clickBtnDirectOutput() {
        await this.driver.findElement(By.id('bt_direct_pdf')).click();
    }
    async clickBtnDirectOutputSave() {
        await this.driver.findElement(By.xpath('//*[@id="pop_direct_pdf"]/div[2]/div[3]/button[1]')).click();
    }
    async clickBtnDirectOutputClose() {
        await this.driver.findElement(By.xpath('//*[@id="pop_direct_pdf"]/div[2]/div[3]/button[2]')).click();
    }
}