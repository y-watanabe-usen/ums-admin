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
    const getDir = () => {
      return process.env.CI ? Const.SELENIUM_DOWNLOAD_DIR : Const.LOCAL_DOWNLOAD_DIR;
    };

    const files = fs.readdirSync(getDir());
    const filename = files[files.length - 1];
    const dir = fullpath ? getDir() : "";
    console.log('test3');
    console.log(getDir());
    return path.join(dir, filename);
  },
  removeAllDownloadFiles: () => {
    const getDir = () => {
      return process.env.CI ? Const.SELENIUM_DOWNLOAD_DIR : Const.LOCAL_DOWNLOAD_DIR;
    };
    fs.readdir(getDir(), (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        fs.unlinkSync(path.join(getDir(), file));
      });
    });
  },
  replaceNewLine: (text: string) => {
    return text.replace(/\r\n/g, "\n")
    .replace(/\n/g, "\r\n");
  },
};
