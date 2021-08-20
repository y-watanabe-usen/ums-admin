import { bulkServiceTests } from "@/tests/bulk/bulk_service_tests";

export const bulkTests = () => {
  describe('サービス一括強制施錠／開錠のテスト', () => {
    bulkServiceTests();
  });
}