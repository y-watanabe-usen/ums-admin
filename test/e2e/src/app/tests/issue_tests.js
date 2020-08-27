const { Dir, Const, Utils } = require('lib');

const PublishDownloadTests = require(`${Dir.tests}/issue/publish_download_tests`);
const NotArrivedUploadTests = require(`${Dir.tests}/issue/not_arrived_upload_tests`);
const PublishUploadTests = require(`${Dir.tests}/issue/publish_upload_tests`);

exports.testMain = () => {
    describe('発送管理のテスト', () => {
        PublishDownloadTests.testMain();
        NotArrivedUploadTests.testMain();
        PublishUploadTests.testMain();
    });
}