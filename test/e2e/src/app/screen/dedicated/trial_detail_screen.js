const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class TrialDetailScreen extends AuthedScreen {

    get accountId() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[1]')).getText();
    }

    get loginId() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[2]')).getText();
    }

    get password() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[3]')).getText();
    }

    get salesChannel() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[4]')).getText();
    }

    get issueDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[5]')).getText();
    }

    get firstAuthenticationDatetimes() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[6]')).getText();
    }

    get expireDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[7]')).getText();
    }

    get viewingHistoryTotal() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[1]/td')).getText();
    }

    get viewingHistory1st() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[2]/td')).getText();
    }

    get viewingHistory2nd() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[3]/td')).getText();
    }

    get viewingHistory3rd() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[4]/td')).getText();
    }

    get viewingHistory4th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[5]/td')).getText();
    }

    get viewingHistory5th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[6]/td')).getText();
    }

    get viewingHistory6th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[7]/td')).getText();
    }

    get viewingHistory7th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[8]/td')).getText();
    }

    get viewingHistory8th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[9]/td')).getText();
    }

    get viewingHistory9th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[10]/td')).getText();
    }

    get viewingHistory10th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[11]/td')).getText();
    }

    get viewingHistory11th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[12]/td')).getText();
    }

    get viewingHistory12th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[13]/td')).getText();
    }

    get viewingHistory13th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[14]/td')).getText();
    }

    get viewingHistory14th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[15]/td')).getText();
    }

    get viewingHistory15th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[16]/td')).getText();
    }

    get viewingHistory16th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[17]/td')).getText();
    }

    get viewingHistory17th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[18]/td')).getText();
    }

    get viewingHistory18th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[19]/td')).getText();
    }

    get viewingHistory19th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[20]/td')).getText();
    }

    get viewingHistory20th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[21]/td')).getText();
    }

    get viewingHistory21st() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[22]/td')).getText();
    }

    get viewingHistory22nd() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[23]/td')).getText();
    }

    get viewingHistory23rd() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[24]/td')).getText();
    }

    get viewingHistory24th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[25]/td')).getText();
    }

    get viewingHistory25th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[26]/td')).getText();
    }

    get viewingHistory26th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[27]/td')).getText();
    }

    get viewingHistory27th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[28]/td')).getText();
    }

    get viewingHistory28th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[29]/td')).getText();
    }

    get viewingHistory29th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[30]/td')).getText();
    }

    get viewingHistory30th() {
        return this.driver.findElement(By.xpath('//*[@id="grid3"]/tbody/tr[31]/td')).getText();
    }

    async clickBtnReturnSearchList() {
        await this.driver.findElement(By.id('bt_back')).click();
    }

    async clickBtnDownloadViewingHistory() {
        await this.driver.findElement(By.id('bt_download')).click();
    }

}