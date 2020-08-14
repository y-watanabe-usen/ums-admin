const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const Dir = require('dir');
const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class AccountDetailScreen extends AuthedScreen {

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
    get usenCartServiceName() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[1]')).getText();
    }
    get usenCartServiceContractNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[2]')).getText();
    }
    get usenCartServiceStatementNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[3]')).getText();
    }
    get usenCartServiceContractStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[4]')).getText();
    }
    get usenCartServiceContractItem() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[5]')).getText();
    }
    get usenCartServiceFixedDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[6]')).getText();
    }
    get usenCartServiceStartDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[7]')).getText();
    }
    get usenCartServiceFirstTimeDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[8]')).getText();
    }
    get usenCartServiceEndDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[9]')).getText();
    }
    get usenCartServiceStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[10]')).getText();
    }
    get otorakuServiceName() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[1]')).getText();
    }
    get otorakuServiceContractNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[2]')).getText();
    }
    get otorakuServiceStatementNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[3]')).getText();
    }
    get otorakuServiceContractStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[4]')).getText();
    }
    get otorakuServiceContractItem() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[5]')).getText();
    }
    get otorakuServiceFixedDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[6]')).getText();
    }
    get otorakuServiceStartDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[7]')).getText();
    }
    get otorakuServiceFirstTimeDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[8]')).getText();
    }
    get otorakuServiceEndDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[9]')).getText();
    }
    get otorakuServiceStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[10]')).getText();
    }
    get stashif1ServiceName() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[1]')).getText();
    }
    get stashif1ServiceContractNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[2]')).getText();
    }
    get stashif1ServiceStatementNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[3]')).getText();
    }
    get stashif1ServiceContractStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[4]')).getText();
    }
    get stashif1ServiceContractItem() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[5]')).getText();
    }
    get stashif1ServiceFixedDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[6]')).getText();
    }
    get stashif1ServiceStartDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[7]')).getText();
    }
    get stashif1ServiceFirstTimeDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[8]')).getText();
    }
    get stashif1ServiceEndDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[9]')).getText();
    }
    get stashif1ServiceStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[10]')).getText();
    }
    get stashif2ServiceName() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[1]')).getText();
    }
    get stashif2ServiceContractNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[2]')).getText();
    }
    get stashif2ServiceStatementNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[3]')).getText();
    }
    get stashif2ServiceContractStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[4]')).getText();
    }
    get stashif2ServiceContractItem() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[5]')).getText();
    }
    get stashif2ServiceFixedDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[6]')).getText();
    }
    get stashif2ServiceStartDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[7]')).getText();
    }
    get stashif2ServiceFirstTimeDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[8]')).getText();
    }
    get stashif2ServiceEndDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[9]')).getText();
    }
    get stashif2ServiceStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[10]')).getText();
    }
    get reachStockRestaurantServiceName() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[1]')).getText();
    }
    get reachStockRestaurantServiceContractNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[2]')).getText();
    }
    get reachStockRestaurantServiceStatementNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[3]')).getText();
    }
    get reachStockRestaurantServiceContractStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[4]')).getText();
    }
    get reachStockRestaurantServiceContractItem() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[5]')).getText();
    }
    get reachStockRestaurantServiceFixedDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[6]')).getText();
    }
    get reachStockRestaurantServiceStartDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[7]')).getText();
    }
    get reachStockRestaurantServiceFirstTimeDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[8]')).getText();
    }
    get reachStockRestaurantServiceEndDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[9]')).getText();
    }
    get reachStockRestaurantServiceStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[10]')).getText();
    }
    get reachStockProducerServiceName() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[1]')).getText();
    }
    get reachStockProducerServiceContractNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[2]')).getText();
    }
    get reachStockProducerServiceStatementNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[3]')).getText();
    }
    get reachStockProducerServiceContractStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[4]')).getText();
    }
    get reachStockProducerServiceContractItem() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[5]')).getText();
    }
    get reachStockProducerServiceFixedDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[6]')).getText();
    }
    get reachStockProducerServiceStartDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[7]')).getText();
    }
    get reachStockProducerServiceFirstTimeDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[8]')).getText();
    }
    get reachStockProducerServiceEndDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[9]')).getText();
    }
    get reachStockProducerServiceStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[10]')).getText();
    }
    get uspotServiceName() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[1]')).getText();
    }
    get uspotServiceContractNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[2]')).getText();
    }
    get uspotServiceStatementNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[3]')).getText();
    }
    get uspotServiceContractStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[4]')).getText();
    }
    get uspotServiceContractItem() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[5]')).getText();
    }
    get uspotServiceFixedDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[6]')).getText();
    }
    get uspotServiceStartDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[7]')).getText();
    }
    get uspotServiceFirstTimeDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[8]')).getText();
    }
    get uspotServiceEndDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[9]')).getText();
    }
    get uspotServiceStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[10]')).getText();
    }

    get conciergeServiceName() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[1]')).getText();
    }
    get conciergeServiceContractNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[2]')).getText();
    }
    get conciergeServiceStatementNo() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[3]')).getText();
    }
    get conciergeServiceContractStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[4]')).getText();
    }
    get conciergeServiceContractItem() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[5]')).getText();
    }
    get conciergeServiceFixedDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[6]')).getText();
    }
    get conciergeServiceStartDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[7]')).getText();
    }
    get conciergeServiceFirstTimeDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[8]')).getText();
    }
    get conciergeServiceEndDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[9]')).getText();
    }
    get conciergeServiceStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[10]')).getText();
    }
    get title() {
        return this.driver.findElement(By.className('main-title')).getText();
    }

    async clickBtnAccountDetail() {
        await this.driver.findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[10]')).click();
    }
    async clickBtnReturnAccountList() {
        await this.driver.findElement(By.xpath('//*[@id="bt_back"]')).click();
    }
    async clickBtnMailAddressChange() {
        await this.driver.findElement(By.xpath('//*[@id="bt_account_modify"]')).click();
    }
    async clearMailAddress() {
        await this.driver.findElement(By.id('new_mail_address')).clear();
    }
    async inputMailAddress(mailaddress) {
        await this.driver.findElement(By.id('new_mail_address')).sendKeys(mailaddress);
    }
    async clickBtnMailAddressChangeSave() {
        await this.driver.findElement(By.xpath('//*[@id="pop_account_modify"]/div[2]/div[2]/button[1]')).click();
    }
    async clickBtnMailAddressAlertAccept() {
        await this.driver.wait(until.alertIsPresent());
        let alert = await this.driver.switchTo().alert();
        await alert.accept();
    }
    async clickBtnServiceDetail() {
        await this.driver.findElement(By.className('bt_detail_account_stop')).click();
    }
}