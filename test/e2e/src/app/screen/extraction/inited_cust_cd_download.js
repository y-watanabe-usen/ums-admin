const { Builder, By, Key, Capabilitiesi, until} = require('selenium-webdriver');

// データ抽出・初回認証済顧客抽出画面
module.exports = class InitedCustCdDownloadScreen {
    constructor(driver) {
        this.driver = driver;
    }

    get title() {
        return this.driver.findElement(By.className('main-title')).getText();
    }

    get from() {
         return this.driver.findElement(By.name('from')).getAttribute("value");
    }

    get to() {
        return this.driver.findElement(By.name('to')).getAttribute("value");
    }

    //get select() {
    //    return this.driver.findElement(By.xpath('//*[@id="fr_dl"]/table/tbody/tr[3]/td[2]/select/option[1]'));
    //}

    get alert() {
        return this.driver.findElement(By.xpath('//*[@id="dl_message"]')).getText();
    }

    //async selectService(value) {
    //   let dropdown = this.driver.findElement(By.xpath('//*[@id="fr_dl"]/table/tbody/tr[3]/td[2]/select'));
    //   await Select(dropdown).selectByValue(value);
    //}

    async inputFrom(from) {
        await this.driver.findElement(By.name('from')).sendKeys(from);
    }

    async inputTo(to) {
        await this.driver.findElement(By.name('to')).sendKeys(to);
    }

    async clickTabExtraction() {
        await this.driver.findElement(By.linkText("データ抽出")).click();
    }

    async clickBtnLastMonth() {
        await this.driver.findElement(By.id('bt_last_month')).click();
    }

    async clickBtnThisMonth() {
        await this.driver.findElement(By.id('bt_this_month')).click();
    }

    async clickBtnDownload() {
        await this.driver.findElement(By.id('bt_download')).click();
    }
}
