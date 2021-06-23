import { By } from "selenium-webdriver";

import Screen from "@/screen/common/screen";

export default class AuthedScreen extends Screen {
  async clickTabAccount(): Promise<void> {
    await this.driver.findElement(By.linkText("アカウント管理")).click();
  }
  async clickTabIssue(): Promise<void> {
    await this.driver.findElement(By.linkText("発送管理")).click();
  }
  async clickTabExtraction(): Promise<void> {
    await this.driver.findElement(By.linkText("データ抽出")).click();
  }
  async clickTabDedicated(): Promise<void> {
    await this.driver.findElement(By.linkText("お試し/デモ管理")).click();
  }
  async clickTabBranch(): Promise<void> {
    await this.driver.findElement(By.linkText("支店別顧客管理")).click();
  }
  async clickTabBulk(): Promise<void> {
    await this.driver.findElement(By.linkText("一括処理")).click();
  }
  async clickTabRole(): Promise<void> {
    await this.driver.findElement(By.linkText("権限管理")).click();
  }
}
