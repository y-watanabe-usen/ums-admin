import Database from "@/lib/database";

import { loginTests } from "@/tests/login_tests";
import { logoutTests } from "@/tests/logout_tests";
import { accountTests } from "@/tests/account_tests";
import { branchTests } from "@/tests/branch_tests";
import { bulkTests } from "@/tests/bulk_tests";
import { dedicatedTests } from "@/tests/dedicated_tests";
import { extractionTests } from "@/tests/extraction_tests";
import { issueTests } from "@/tests/issue_tests";
import { roleTests } from "@/tests/role_tests";

describe("USEN MEMBERS管理機能のSeleniumテスト", () => {
  beforeAll(async () => {
    Database.connect();
  });

  afterAll(() => {
    Database.disconnect();
  });

  loginTests();
  logoutTests();
  accountTests();
  branchTests();
  bulkTests();
  dedicatedTests();
  extractionTests();
  issueTests();
  roleTests();
});
