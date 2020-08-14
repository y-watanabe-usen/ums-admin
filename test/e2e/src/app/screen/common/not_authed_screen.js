const { Builder, By, Key, Capabilitiesi, until } = require('selenium-webdriver');
const Dir = require('dir');
const Screen = require(`${Dir.screenCommon}/screen`);

module.exports = class NotAuthedScreen extends Screen { }