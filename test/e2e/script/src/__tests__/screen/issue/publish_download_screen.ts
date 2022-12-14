import { By } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

export default class PublishDownloadScreen extends AuthedScreen {
  get shippingMessage() {
    return this.driver.findElement(By.xpath('//*[@id="dl_message"]')).getText();
  }
  get firstFileName() {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr[1]/td[1]/span'
        )
      )
      .getText();
  }
  get firstCustCd() {
    return this.driver
      .findElement(
        By.xpath('//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr/td[1]/span')
      )
      .getText();
  }
  get UploadMessage() {
    return this.driver
      .findElement(
        By.xpath('//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr[1]/td[3]')
      )
      .getText();
  }

  async getfirstFileText(searchFileName: string) {
    const elements = await this.driver.findElements(
      By.xpath("//table[@class='dataTable']/tbody/tr/td")
    );
    for (const element of elements) {
      const tableText = await element.getText();
      if (tableText === searchFileName) {
        return true;
      }
    }
    return false;
  }

  async clickBtnShippingManagement() {
    await this.driver
      .findElement(By.xpath("/html/body/div[1]/div[3]/ul/li[2]/a"))
      .click();
  }
  async clickBtnDownload(searchFileName: string, searchDownloadBtn: string) {
    const elements = await this.driver.findElements(
      By.xpath("//table[@class='dataTable']/tbody/tr/td")
    );
    let i = 1;
    let downloadFlag = false;

    for (const element of elements) {
      const tableText = await element.getText();

      if (tableText === searchFileName) {
        downloadFlag = true;
      }
      if (downloadFlag == true && tableText === searchDownloadBtn) {
        const trCount = i / 4;
        return await this.driver
          .findElement(
            By.xpath(
              '//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr[' +
                trCount +
                "]/td[4]/span/button"
            )
          )
          .click();
      }
      i++;
    }
  }

  async clickBtnCreateShippingData() {
    await this.driver.findElement(By.xpath('//*[@id="bt_no_publish"]')).click();
  }
  async clickNotArrivedUpload() {
    await this.driver
      .findElement(By.xpath("/html/body/div[2]/div/div[1]/div/div/ul/li[2]/a"))
      .click();
  }
  async clickBtnFile(file: string) {
    await this.driver
      .findElement(By.name("file"))
      .sendKeys(`${__dirname}/../../files` + file);
  }
  async clickBtnUpload() {
    await this.driver.findElement(By.id("bt_upload")).click();
  }
  async clickBtnUpdate() {
    await this.driver.findElement(By.id("bt_save")).click();
  }
}
