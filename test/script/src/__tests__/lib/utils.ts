import fs from "fs";
import path from "path";
import { Capabilities } from "selenium-webdriver";
import Const from "@/lib/const";

export default {
  // buildUsingServer: () => `http://${process.env.CI ? 'localhost' : 'selenium-hub'}:4444/wd/hub`,
  buildUsingServer: () => `http://localhost:4444/wd/hub`,
  buildCapabilities: () => {
    // let capabilities;
    // switch (process.env.BROWSER) {
    //   // case "ie": {
    //   //   process.env.PATH = `${process.env.PATH};${__dirname}/Selenium.WebDriver.IEDriver.3.150.0/driver/;`;
    //   //   const capabilities = webdriver.Capabilities.ie();
    //   //   capabilities.set("ignoreProtectedModeSettings", true);
    //   //   capabilities.set("ignoreZoomSetting", true);
    //   // }
    //   case "firefox": {
    //     // console.log("start testing in firefox");
    //     capabilities = Capabilities.firefox();
    //     capabilities.set('firefoxOptions', {
    //       args: [
    //         '-headless',
    //       ]
    //     });
    //   }
    //   case "chrome":
    //   default: {
    //     capabilities = Capabilities.chrome();
    //     capabilities.set('chromeOptions', {
    //       args: [],
    //       prefs: {
    //         'download': {
    //           'default_directory': Const.DOWNLOAD_PATH,
    //           'prompt_for_download': false,
    //           'directory_upgrade': true
    //         }
    //       }
    //     });
    //   }
    //   // case "safari": {
    //   //     return webdriver.Capabilities.safari();
    //   // }
    // }
    const capabilities = Capabilities.chrome();
    capabilities.set("chromeOptions", {
      args: [],
      prefs: {
        download: {
          default_directory: Const.SELENIUM_DOWNLOAD_DIR,
          prompt_for_download: false,
          directory_upgrade: true,
        },
      },
    });
    return capabilities;
  },
  sleep: async (second: number) => {
    await new Promise((resolve) => setTimeout(resolve, second * 1000));
  },
  getDownloadFilename: (fullpath = true) => {
    const files = fs.readdirSync(Const.LOCAL_DOWNLOAD_DIR);
    const filename = files[files.length - 1];
    const dir = fullpath ? Const.LOCAL_DOWNLOAD_DIR : "";
    return path.join(dir, filename);
  },
  removeAllDownloadFiles: () => {
    fs.readdir(Const.LOCAL_DOWNLOAD_DIR, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        fs.unlinkSync(path.join(Const.LOCAL_DOWNLOAD_DIR, file));
      });
    });
  },
};
