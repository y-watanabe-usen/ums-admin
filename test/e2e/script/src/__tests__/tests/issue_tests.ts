import { publishDownloadTests } from "@/tests/issue/publish_download_tests";
import { notArrivedUploadTests } from "@/tests/issue/not_arrived_upload_tests";
import { publishUploadTests } from "@/tests/issue/publish_upload_tests";

export const issueTests = () => {
  describe("発送管理のテスト", () => {
    publishDownloadTests();
    notArrivedUploadTests();
    publishUploadTests();
  });
};
