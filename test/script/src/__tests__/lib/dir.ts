import path from "path";

class Dir {
  get home() {
    return path.resolve(__dirname, "..");
  }
  get screen() {
    return path.resolve(this.home, "screen");
  }
  get files() {
    return path.resolve(this.home, "files");
  }
  get config() {
    return path.resolve(this.home, "config");
  }
  get tests() {
    return path.resolve(this.home, "tests");
  }
  get screenCommon() {
    return path.resolve(this.screen, "common");
  }
  get screenLogin() {
    return path.resolve(this.screen, "login");
  }
  get screenLogout() {
    return path.resolve(this.screen, "logout");
  }
  get screenAccount() {
    return path.resolve(this.screen, "account");
  }
  get screenExtraction() {
    return path.resolve(this.screen, "extraction");
  }
  get screenDedicated() {
    return path.resolve(this.screen, "dedicated");
  }
  get screenBranch() {
    return path.resolve(this.screen, "branch");
  }
  get screenBulk() {
    return path.resolve(this.screen, "bulk");
  }
  get screenRole() {
    return path.resolve(this.screen, "role");
  }
  get screenIssue() {
    return path.resolve(this.screen, "issue");
  }
  get filesExtraction() {
    return path.resolve(this.files, "extraction");
  }
  get filesDedicated() {
    return path.resolve(this.files, "dedicated");
  }
  get filesIssue() {
    return path.resolve(this.files, "issue");
  }
  get filesBranch() {
    return path.resolve(this.files, "branch");
  }
  get filesBulk() {
    return path.resolve(this.files, "bulk");
  }
}

const dir = new Dir();
export default dir;
