import { userSearchTests } from "@/tests/role/user_search_tests";
import { userDetailTests } from "@/tests/role/user_detail_tests";
import { organizationSearchTests } from "@/tests/role/organization_search_tests";
import { organizationDetailTests } from "@/tests/role/organization_detail_tests";
import { subscribesTests } from "@/tests/role/subscribes_tests";

export const roleTests = () => {
  describe("権限管理のテスト", () => {
    userSearchTests();
    userDetailTests();
    organizationSearchTests();
    organizationDetailTests();
    subscribesTests();
  });
};
