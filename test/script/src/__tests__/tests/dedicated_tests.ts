import { trialSearchTests } from "@/tests/dedicated/trial_search_tests";
import { trialDetailTests } from "@/tests/dedicated/trial_detail_tests";
import { trialCreateTests } from "@/tests/dedicated/trial_create_tests";
import { trialDownloadTests } from "@/tests/dedicated/trial_download_tests";
import { demoSearchTests } from "@/tests/dedicated/demo_search_tests";
import { demoCreateTests } from "@/tests/dedicated/demo_create_tests";
import { demoDownloadTests } from "@/tests/dedicated/demo_download_tests";

export const dedicatedTests = () => {
  describe("お試し/デモ管理のテスト", () => {
    trialSearchTests();
    trialDetailTests();
    trialCreateTests();
    trialDownloadTests();
    demoSearchTests();
    demoCreateTests();
    demoDownloadTests();
  });
};
