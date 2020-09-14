const path = require('path');
module.exports = class Dir {
  static get home() {
    return path.resolve(__dirname, '..');
  }
  static get screen() {
    return path.resolve(this.home, 'screen');
  }
  static get files() {
    return path.resolve(this.home, 'files');
  }
  static get config() {
    return path.resolve(this.home, 'config');
  }
  static get tests() {
    return path.resolve(this.home, 'tests');
  }
  static get screenCommon() {
    return path.resolve(this.screen, 'common');
  }
  static get screenLogin() {
    return path.resolve(this.screen, 'login');
  }
  static get screenLogout() {
    return path.resolve(this.screen, 'logout');
  }
  static get screenAccount() {
    return path.resolve(this.screen, 'account');
  }
  static get screenExtraction() {
    return path.resolve(this.screen, 'extraction');
  }
  static get screenDedicated() {
    return path.resolve(this.screen, 'dedicated');
  }
  static get screenBranch() {
    return path.resolve(this.screen, 'branch');
  }
  static get screenRole() {
    return path.resolve(this.screen, 'role');
  }
  static get screenIssue() {
    return path.resolve(this.screen, 'issue');
  }
  static get filesExtraction() {
    return path.resolve(this.files, 'extraction');
  }
  static get filesDedicated() {
    return path.resolve(this.files, 'dedicated');
  }
  static get filesIssue() {
    return path.resolve(this.files, 'issue');
  }
  static get filesBranch() {
    return path.resolve(this.files, 'branch');
  }
}