import { initedCustCdDownloadTests } from "@/tests/extraction/inited_cust_cd_download_tests";
import { issueHistoryDownloadTests } from "@/tests/extraction/issue_history_download_tests";
import { idPwDownloadTests } from "@/tests/extraction/id_pw_download_tests";
import { mailAddressInitImportTests } from "@/tests/extraction/mail_address_init_import_tests";
import { chainStoreBulkRegistTests } from "@/tests/extraction/chain_store_bulk_regist_tests";

export const extractionTests = () => {
  describe("データ抽出のテスト", () => {
    initedCustCdDownloadTests();
    issueHistoryDownloadTests();
    idPwDownloadTests();
    mailAddressInitImportTests();
    chainStoreBulkRegistTests();
  });
};
