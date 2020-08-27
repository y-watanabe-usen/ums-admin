const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const Const = require('./const');

module.exports = {
    buildUsingServer: () => `http://${process.env.CI ? 'localhost' : 'selenium-hub'}:4444/wd/hub`,
    buildCapabilities: () => {
        let capabilities;
        switch (process.env.BROWSER) {
            // case "ie": {
            //   process.env.PATH = `${process.env.PATH};${__dirname}/Selenium.WebDriver.IEDriver.3.150.0/driver/;`;
            //   const capabilities = webdriver.Capabilities.ie();
            //   capabilities.set("ignoreProtectedModeSettings", true);
            //   capabilities.set("ignoreZoomSetting", true);
            // }
            case "firefox": {
                // console.log("start testing in firefox");
                capabilities = Capabilities.firefox();
                capabilities.set('firefoxOptions', {
                    args: [
                        '-headless',
                    ]
                });
            }
            case "chrome":
            default: {
                // console.log("start testing in chrome");
                capabilities = Capabilities.chrome();
                capabilities.set('chromeOptions', {
                    args: [],
                    prefs: {
                        'download': {
                            'default_directory': Const.DOWNLOAD_PATH,
                            'prompt_for_download': false,
                            'directory_upgrade': true
                        }
                    }
                });
            }
            // case "safari": {
            //     return webdriver.Capabilities.safari();
            // }
        }
        return capabilities;
    }
};