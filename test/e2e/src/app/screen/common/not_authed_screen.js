const { Builder, By, Key, Capabilitiesi, until} = require('selenium-webdriver');
const Screen = require(`${__dirname}/screen`);

module.exports = class NotAuthedScreen extends Screen {}