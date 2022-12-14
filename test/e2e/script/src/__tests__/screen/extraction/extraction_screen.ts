import { By } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

// データ抽出画面関連操作
export default class ExtractionScreen extends AuthedScreen {
  // メニュー
  // 初回認証済顧客抽出押下
  async clickExtractionMenuInitedCustCdDownload() {
    await this.driver
      .findElement(By.xpath("/html/body/div[2]/div/div[1]/div/div/ul/li[1]/a"))
      .click();
  }
  // アカウント証発送履歴抽出押下
  async clickExtractionMenuIssueHistoryDownload() {
    await this.driver
      .findElement(By.xpath("/html/body/div[2]/div/div[1]/div/div/ul/li[2]/a"))
      .click();
  }
  // ID/PW抽出（顧客CD指定）押下
  async clickExtractionMenuIdPwDownload() {
    await this.driver
      .findElement(By.xpath("/html/body/div[2]/div/div[1]/div/div/ul/li[3]/a"))
      .click();
  }
  // メールアドレス初回登録・仮ID/PW抽出押下
  async clickExtractionMenuMailAddressInitImport() {
    await this.driver
      .findElement(By.xpath("/html/body/div[2]/div/div[1]/div/div/ul/li[4]/a"))
      .click();
  }
  // USEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出押下
  async clickExtractionMenuChainStoreBulkRegist() {
    await this.driver
      .findElement(By.xpath("/html/body/div[2]/div/div[1]/div/div/ul/li[5]/a"))
      .click();
  }
}
