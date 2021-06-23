import { accountSearchTests } from "@/tests/account/account_search_tests";
import { accountListTests } from "@/tests/account/account_list_tests";
import { accountDetailTests } from "@/tests/account/account_detail_tests";
import { accountServiceDetailTests } from "@/tests/account/account_service_detail_tests";

export const accountTests = () => {
  describe("アカウント管理のテスト", () => {
    accountSearchTests();
    accountListTests();
    accountDetailTests();
    accountServiceDetailTests();
  });
};
