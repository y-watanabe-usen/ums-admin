import { WebDriver } from "selenium-webdriver";

export default class Screen {
  constructor(protected driver: WebDriver) {
    this.driver = driver;
  }
}
