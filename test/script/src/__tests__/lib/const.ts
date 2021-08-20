import path from "path";

export default class Const {
  public static readonly ADMIN_URL = "http://ums-admin/";
  public static readonly SELENIUM_DOWNLOAD_DIR = "/tmp/download";
  public static readonly LOCAL_DOWNLOAD_DIR = path.join(
    path.resolve(""),
    "..",
    "selenium",
    "download"
  );
}
