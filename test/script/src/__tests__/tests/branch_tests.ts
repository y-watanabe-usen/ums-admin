import { branchListSearchTests } from "@/tests/branch/branch_list_search_tests";

export const branchTests = () => {
  describe("支店別管轄顧客一覧のテスト", () => {
    branchListSearchTests();
  });
};
