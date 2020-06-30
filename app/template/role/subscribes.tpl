<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<script type="text/javascript">
//<![CDATA[

(function($) {
    $(function() {

        //実行ボタン
        $("#bt_execute").click(function() {
            $(".pop_message", "#pop_subscribes").html("");
            $(".bt_pop_save", "#pop_subscribes").show();
            var l = ($(".main-panel").width() - 600) / 2;
            $.blockUI({
                message: $("#pop_subscribes"),
                css: {
                width:"400px",
                height: "130px",
                top: "100px",
                left: l,
                textAlign: "left",
                border: "0",
                background:"none",
                cursor: "default",
                borderRadius: "3px"}
            });
        });

        $("#pop_subscribes").on("click", ".bt_pop_save", function() {
            $(this).hide();
            $(".bt_pop_close", "#pop_subscribes").hide();
            var process_type_id = $('input[name="process_type"]:checked').val();
            var processType = "";
            if (process_type_id == "1") {
                processType = "M_ORGANIZATIONS";
            } else if (process_type_id == "2") {
                processType = "M_ORGANIZATIONS";
            } else if (process_type_id == "3") {
                processType = "M_USERS";
            }
            $(".pop_message", "#pop_subscribes").html("処理中です...処理に時間が掛かる場合があります。");
            ajax_subscribes(process_type_id, processType, 1);
        });

        //社員マスタ連携API
        function ajax_subscribes(process_type_id, processType, roop_flag) {
            $.ajax({
                type: 'POST',
                url: '/subscribes/jWHBErnSNG93JFHdkpuYucrrt3VGMsnB/',
                cache: false,
                datatype: 'json',
                timeout: 900000,//15分でタイムアウト
                data: {processType: processType},
                success: function () {
                    if (process_type_id == "1" && roop_flag == "1") {
                        ajax_subscribes(process_type_id, "M_USERS", 0);
                    } else {
                        $(".pop_message", "#pop_subscribes").html("完了しました。");
                        $(".bt_pop_close", "#pop_subscribes").show();
                    }
                },
                error: function () {
                    $(".pop_message", "#pop_subscribes").html("実行中に通信エラーが発生しました。");
                    $(".bt_pop_close", "#pop_subscribes").show();
                }
            });
        }

        //ポップアップの閉じる
        $(".bt_pop_close").click(function () {
            $.unblockUI();
        });

    });
})(jQuery);
//]]>
</script>

<!-- メイン -->
<div class="main">

    <!-- メインパネル -->
    <div class="main-panel" style="padding-top:22px">

        <!-- left -->
        <?php include(TPL_DIR . DS . "role" . DS . "sub_menu.tpl"); ?>
        <!-- /left -->

        <!-- right -->
        <div style="width:auto;height:100%;box-sizing: border-box;-moz-box-sizing: border-box;margin:0;padding-top:28px;overflow:hidden;">
            <div class="main-title" style="left:210px;">DRAGONマスタ連携処理</div>

            <!-- パネル -->
            <div class="panel-base" style="height:100%;width:100%;overflow:hidden;">
                <div class="panel" style="padding-top:5px;">
                    <!-- ユニット -->
                    <div class="unit" style="padding:5px 20px 10px 20px;height:100%;">
                        <table style="width:100%;">
                            <tr>
                                <td style="width: 200px; height: 30px; text-align: left;">DRAGONのサーバーからマスターファイルを取得し処理を実行します。</td>
                            </tr>
                            <tr>
                                <td style="width: 200px; height: 30px; text-align: left;">
                                    <p style="display:inline-block; margin:10px 10px 10px 0px;">
                                        <input type="radio" name="process_type" value="1" checked>部署マスタ一括配信&ユーザマスタ一括配信</input>
                                    </p>
                                    <p style="display:inline-block; margin:10px 10px 10px 0px;">
                                        <input type="radio" name="process_type" value="2">部署マスタ一括配信</input>
                                    </p>
                                    <p style="display:inline-block; margin:10px 10px 10px 0px;">
                                        <input type="radio" name="process_type" value="3">ユーザマスタ一括配信</input>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                            <td style="width: 200px; height: 30px;"><button id="bt_execute" class="bt_mini" style="width: 200px;">DRAGONマスタ連携処理を実行する</button></td>
                            </tr>
                            </table>
                    </div>
                    <!-- /ユニット -->
                </div>
            </div>
            <!-- /パネル -->

            <!-- ポップアップ -->
            <div id="pop_subscribes" class="panel-pop" style="padding-top:25px;">
                <div class="panel-title">DRAGONマスタ連携処理</div>
                <!-- ユニット -->
                <div class="unit" style="padding:10px 20px 10px 20px;">
                    <div id="msg_release" style="font-size:14px;text-align:center;">DRAGONマスタ連携処理を実行しますか？</div>
                    <div class="pop_message" style="text-align:center;margin:5px 0;color:red;"></div>
                    <div style="text-align:center;">
                        <button class="bt_pop_save bt_blue" style="margin:0 10px;">OK</button>
                        <button class="bt_pop_close" style="margin:0 10px;">閉じる</button>
                    </div>
                </div>
                <!-- /ユニット -->
            </div>
            <!-- ポップアップ -->

        </div>
        <!-- /right -->
    </div><!-- /メインパネル -->
</div><!-- /main -->
