<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<script type="text/javascript">
//<![CDATA[
    (function ($) {
        $(function () {
            //UNIS情報
            $('#grid_unis1').usengrid({width: "560px", height: "165", resize: false, scroll: false, hcolor: "blue"});
            $('#grid_unis2').usengrid({width: "560px", height: "165", resize: false, scroll: false, hcolor: "blue"});

            //メールアドレスの変更
            $("#bt_account_modify").click(function () {
                $("#new_mail_address").val($('#disp_mail_address').html());
                $(".pop_message", "#pop_account_modify").html("");
                var l = ($(".main-panel").width() - 600) / 2;
                $.blockUI({
                    message: $("#pop_account_modify"),
                    css: {
                        width: "600px",
                        height: "130px",
                        top: "100px",
                        left: l,
                        textAlign: "left",
                        border: "0",
                        background: "none",
                        cursor: "default",
                        borderRadius: "3px"}
                });
            });
            $("#pop_account_modify").on("click", ".bt_pop_save", function() {
                if (confirm("保存してよろしいですか？")) {
                    $.ajax({
                        type: 'POST',
                        url: '/account/save_account',
                        cache: false,
                        datatype: 'json',
                        data: {account_id:<?php echo $account_info["id"]; ?>,new_mail_address:$("#new_mail_address").val()},
                        success: function(json) {
                            if (json.result_cd == 0) {
                                $('#disp_mail_address').html(json.result_data.mail_address);
                                $(".pop_message", "#pop_account_modify").html("保存しました。");
                            } else {
                                $(".pop_message", "#pop_account_modify").html(json.error_message);
                            }
                        },
                        error: function() {
                            $(".pop_message", "#pop_account_modify").html("保存に失敗しました。");
                        }
                    });
                }
            });

            <?php if ($this->Acl->check($this->Auth->user("role_id"), "/account/init_password_display")) { ?>
                // 初期パスワード確認
                $("#bt_password_change").click(function () {
                    var l = ($(".main-panel").width() - 600) / 2;
                    $.blockUI({
                        message: $("#pop_password_change"),
                        css: {
                            width: "600px",
                            height: "130px",
                            top: "100px",
                            left: l,
                            textAlign: "left",
                            border: "0",
                            background: "none",
                            cursor: "default",
                            borderRadius: "3px"}
                    });
                });
            <?php } ?>
            
            //システム日時
            function now_date() {
                var date = new Date();
                var year    = date.getFullYear();
                var month   = ('0' + (date.getMonth() + 1)).slice(-2);
                var ndate    = ('0' + date.getDate()).slice(-2);
                var hours   = ('0' + date.getHours()).slice(-2);
                var minutes = ('0' + date.getMinutes()).slice(-2);
                var seconds = ('0' + date.getSeconds()).slice(-2);
                return year + "/" + month + "/" + ndate + " " + hours + ":" + minutes + ":" + seconds;
            }
            //文字列日時加工
            function process_date(date_time) {
                if (date_time != "") {
                    date_time = date_time.replace(/-/g, '/');
                    date_time = new Date(date_time);
                }
                return date_time;
            }
            //有効データ判定
            function valid_date_check(start_datetime, end_datetime, now_datetime) {
                var valid_date_flag = "0";
                if ((start_datetime <= now_datetime || start_datetime == "") && (end_datetime > now_datetime || end_datetime == "")) {
                    valid_date_flag = "1";
                }
                return valid_date_flag;
            }
            //背景色設定判定
            function grayout_check(t_unis_service_id, status_flag, admin_status_flag, stop_div, start_datetime, release_datetime) {
                var grayout_flag = "0";
                var ndate = new Date(now_date());
                var start_date = process_date(start_datetime);
                var release_date = process_date(release_datetime);
                if (t_unis_service_id == "" || status_flag == "1" || admin_status_flag == "1" || (stop_div != "" && valid_date_check(start_date, release_date, ndate) == "1")) {
                    grayout_flag = "1";
                }
                return grayout_flag;
            }
            //休店/施錠/強制停止判定
            function stop_check(t_unis_service_id, status_flag, admin_status_flag, stop_div, start_datetime, release_datetime) {
                var stop_name = "";
                var ndate = new Date(now_date());
                var start_date = process_date(start_datetime);
                var release_date = process_date(release_datetime);
                var stop_now = "停止中";
                if (status_flag == "0" && admin_status_flag == "1") {
                    stop_name = stop_now;
                } else if (stop_div != "" && valid_date_check(start_date, release_date, ndate) == "1") {
                    if (stop_div == "1") {
                        stop_name = "休店中";
                    } else if (stop_div == "2") {
                        stop_name = stop_now;
                    }
                }
                return stop_name;
            }
            //サービス一覧表示判定
            function status_display() {
                $("#grid2 tbody tr").each(function(i) {
                    <?php
                    //サービス強制停止権限がある場合
                    if ($this->Acl->check($this->Auth->user("role_id"), "/account/detail_account_stop")) {
                        $detail_account_stop = '<button class="bt_detail_account_stop" style="width:90px;">サービス詳細</button>';
                    //ない場合（ボタン非活性）
                    } else {
                        $detail_account_stop = '<button class="bt_noactive" disabled style="width:90px;">サービス詳細</button>';
                    }
                    ?>
                    var tr = '#grid2 tbody tr:eq('+i+')';
                    var t_unis_service_id = $(tr + ' :hidden[name="t_unis_service_id"]').val();
                    var status_flag       = $(tr + ' :hidden[name="status_flag"]').val();
                    var admin_status_flag = $(tr + ' :hidden[name="admin_status_flag"]').val();
                    var stop_div          = $(tr + ' :hidden[name="stop_div"]').val();
                    var start_datetime    = $(tr + ' :hidden[name="start_datetime"]').val();
                    var release_datetime  = $(tr + ' :hidden[name="release_datetime"]').val();
                    //背景色設定判定
                    var grayout_flag = grayout_check(t_unis_service_id, status_flag, admin_status_flag, stop_div, start_datetime, release_datetime);
                    if (grayout_flag == "1") {
                        $(tr + ' td').addClass("grayout");
                    } else {
                        $(tr + ' td').removeClass("grayout");
                    }
                    //休店/施錠/強制停止判定
                    var stop_name = stop_check(t_unis_service_id, status_flag, admin_status_flag, stop_div, start_datetime, release_datetime);
                    $(tr + ' td:eq(9)').text(stop_name);
                    //施錠管理ボタン表示判定
                    if (t_unis_service_id != "") {
                        $(tr + ' td:eq(10)').html('<?php echo $detail_account_stop; ?>');
                    } else {
                        $(tr + ' td:eq(10)').html();
                    }
                });
            }

            //ポップアップの閉じる
            $(".bt_pop_close").click(function () {
                $.unblockUI();
            });

            //詳細画面へ遷移
            $("#grid2").on("click", ".bt_detail_account_stop", function () {
                $('#fr_detail_account_stop input[name="t_unis_service_id"]').val($('input[name="t_unis_service_id"]', $(this).parent().parent()).val());
                $("#fr_detail_account_stop").submit();
            });

            //一覧へ戻る
            $("#bt_back").click(function () {
                $("#fr_back").submit();
            });
            
            status_display();
        });
    })(jQuery);
//]]>
</script>

<!-- メイン -->
<div class="main" style="height:730px;">

    <!-- メインパネル -->
    <div class="main-panel">
        <div class="main-title"><?php echo Func::h($titleName); ?>
            <button id="bt_back" style="bottom:3px;right:0;position:absolute;">戻る</button>
        </div>

        <!-- UNIS情報 -->
        <?php include(TPL_DIR . DS . "account" . DS . "unis_info.tpl"); ?>
        <!-- /UNIS情報 -->

        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:auto;">
            <div class="panel" style="padding-top:25px;">
                <div class="panel-title">アカウント情報</div>

                <div class="unit" style="padding:35px 10px 10px 10px;">
                    <table style="padding:0;margin:0;position:absolute;top:5px;">
                        <tr>
                        <?php
                            if ($this->Acl->check($this->Auth->user("role_id"), "/account/save_account")) {
                                echo '<td style="width:140px;"><button id="bt_account_modify">メールアドレス変更</button></td>';
                            } else {
                                echo '<td style="width:140px;"><button class="bt_noactive" disabled>メールアドレス変更</button></td>';
                            }
                            if ($this->Acl->check($this->Auth->user("role_id"), "/account/init_password_display")) {
                                echo '<td><button id="bt_password_change">初期パスワード確認</button></td>';
                            }
                        ?>
                        </tr>
                    </table>
                    <table id="account_table" class="nogrid_table">
                        <tr>
                            <th style="width:80px;">アカウントID</th>
                            <th style="width:40px;">状態</th>
                            <th style="width:150px">ログインID</th>
                            <th style="width:300px;">メールアドレス</th>
                            <th style="width:90px;">UMsID開始日</th>
                            <th style="width:90px;">UMsID初回登録日</th>
                            <th style="width:90px;">UMsID失効日</th>
                        </tr>
                    <?php
                        $grayout = "";
                        if ($account_info["status_flag"] !== "有効") {
                            $grayout = " grayout";
                        }
                    ?>
                        <tr>
                            <td class="s_info_right<?php echo $grayout; ?>"><?php echo Func::h($account_info["id"]); ?></td>
                            <td class="s_info_center<?php echo $grayout; ?>"><?php echo Func::h($account_info["status_flag"]); ?></td>
                            <td class="<?php echo $grayout; ?>"><?php echo Func::h($account_info["login_id"]); ?></td>
                            <td class="<?php echo $grayout; ?>"><div id="disp_mail_address"><?php echo Func::h($account_info["mail_address"]); ?></div></td>
                            <td class="s_info_center<?php echo $grayout; ?>"><?php echo Func::h($account_info["start_date"]); ?></td>
                            <td class="s_info_center<?php echo $grayout; ?>"><?php echo Func::h($account_info["init_date"]); ?></td>
                            <td class="s_info_center<?php echo $grayout; ?>"><?php echo Func::h($account_info["end_date"]); ?></td>
                        </tr>
                    </table>
                </div>

            </div>
        </div>
        <!-- /パネル -->

        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:auto;">
            <div class="panel" style="padding-top:25px;">
                <div class="panel-title">サービス一覧</div>
                <div class="unit" style="padding:10px 10px 10px 10px;">
                    <table id="grid2" class="nogrid_table" style="width:100%;table-layout:auto;">
                        <thead>
                            <tr>
                                <th width="55px" rowspan="2">サービス</th>
                                <th width="40px" rowspan="2">契約No</th>
                                <th width="40px" rowspan="2">契約明細<br />No</th>
                                <th width="40px" rowspan="2">契約明細<br />状態</th>
                                <th width="65px" rowspan="2">契約品目</th>
                                <th width="65px" rowspan="2">初回確定日</th>
                                <th width="310px" colspan="3">UMS</th>
                                <th width="190px" colspan="2">休店/強制施錠</th>
                            </tr>
                            <tr style="table-layout: fixed;">
                                <th width="80px">開始日</th>
                                <th width="100px">初回認証日時</th>
                                <th width="80px">終了日</th>
                                <th width="50px">状態</th>
                                <th width="140px">サービス施錠管理</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($service_info as $val) { ?>
                                <tr>
                                    <td>
                                        <?php echo Func::h($val["service_name"]); ?>
                                        <input type="hidden" name="t_unis_service_id" value="<?php echo Func::h($val["t_unis_service_id"]); ?>">
                                        <input type="hidden" name="status_flag" value="<?php echo Func::h($val["status_flag"]); ?>">
                                        <input type="hidden" name="admin_status_flag" value="<?php echo Func::h($val["admin_status_flag"]); ?>">
                                        <input type="hidden" name="stop_div" value="<?php echo Func::h($val["stop_div"]); ?>">
                                        <input type="hidden" name="start_datetime" value="<?php echo Func::h($val["start_datetime"]); ?>">
                                        <input type="hidden" name="release_datetime" value="<?php echo Func::h($val["release_datetime"]); ?>">
                                        <input type="hidden" name="t_service_stop_history_id" value="<?php echo Func::h($val["t_service_stop_history_id"]); ?>">
                                    </td>
                                    <td class="s_info_center"><?php echo Func::h($val["cont_no"]); ?></td>
                                    <td class="s_info_center"><?php echo Func::h($val["detail_no"]); ?></td>
                                    <td class="s_info_center"><?php echo Func::h($val["detail_status_div_name"]); ?></td>
                                    <td class="s_info_center"><?php echo Func::h($val["item_name"]); ?></td>
                                    <td class="s_info_center"><?php echo Func::h($val["decide_date"]); ?></td>
                                    <td class="s_info_center"><?php echo Func::h($val["start_date"]); ?></td>
                                    <td class="s_info_center"><?php echo Func::h($val["init_auth_datetime"]); ?></td>
                                    <td class="s_info_center"><?php echo Func::h($val["end_date"]); ?></td>
                                    <td class="s_info_center" style="color: #00f;"></td>
                                    <td class="s_info_center"></td>
                                </tr>
                            <?php } ?>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
        <!-- /パネル -->

        <!-- ポップアップ -->
        <div id="pop_account_modify" class="panel-pop" style="padding-top:25px;">
            <div class="panel-title">アカウント情報の変更</div>
            <!-- ユニット -->
            <div class="unit" style="padding:10px 20px 10px 20px;">
                <table style="width:100%;">
                    <tr>
                        <td style="width:100px;"><span class="required">メールアドレス</span></td>
                        <td><input id="new_mail_address" type="text" style="width:100%;" value="<?php echo $account_info["mail_address"]; ?>"</td>
                    </tr>
                </table>
                <div class="pop_message" style="text-align:center;margin:2px 0;height:20px;color:red;"></div>
                <div style="text-align:center;">
                    <button class="bt_pop_save" style="margin:0 10px;">保存</button>
                    <button class="bt_pop_close" style="margin:0 10px;">閉じる</button>
                </div>
            </div>
            <!-- /ユニット -->
        </div>

        <?php if ($this->Acl->check($this->Auth->user("role_id"), "/account/init_password_display")) { ?>
            <div id="pop_password_change" class="panel-pop" style="padding-top:25px;">
                <div class="panel-title">初期パスワード確認</div>
                <!-- ユニット -->
                <div class="unit" style="padding:10px 20px 10px 20px;">
                    <table style="width:100%;">
                        <tr>
                            <td style='width:100%;text-align:center;'><?php echo $init_password; ?></td>
                        </tr>
                    </table>
                    <div class="pop_password_message" style="text-align:center;margin:2px 0;height:20px;color:red;">
                        <?php echo $init_password_change ? "初期パスワードから変更されています。" : "初期パスワードのまま変更されていません。"; ?>
                    </div>
                    <div style="text-align:center;">
                        <button class="bt_pop_close" style="margin:0 10px;">閉じる</button>
                    </div>
                </div>
            <!-- /ユニット -->
            </div>
        <?php } ?>
        <!-- ポップアップ -->

        <form id="fr_detail_account_stop" action="/account/detail_account_stop" method="POST">
            <input type="hidden" name="cust_cd" value="<?php echo $cust_cd; ?>" />
            <input type="hidden" name="name" value="<?php echo Func::h($name); ?>" />
            <input type="hidden" name="tel" value="<?php echo $tel; ?>" />
            <input type="hidden" name="login_id" value="<?php echo $login_id; ?>" />
            <input type="hidden" name="mail_address" value="<?php echo $mail_address; ?>" />
            <input type="hidden" name="service" value="<?php echo $service; ?>" />
            <input type="hidden" name="account_id" value="<?php echo $this->RequestPost["account_id"]; ?>" />
            <input type="hidden" name="t_unis_service_id" value="" />
            <input type="hidden" name="t_unis_cust_id" value="<?php echo Func::h($account_info["t_unis_cust_id"]); ?>" />
            <input type="hidden" name="transition" value="<?php echo $transition; ?>" />
            <input type="hidden" name="organization_code" value="<?php echo $organization_code; ?>" />
        </form>

        <form id="fr_back" action="/account/account_list" method="POST">
            <input type="hidden" name="type" value="search" />
            <input type="hidden" name="cust_cd" value="<?php echo $cust_cd; ?>" />
            <input type="hidden" name="name" value="<?php echo Func::h($name); ?>" />
            <input type="hidden" name="tel" value="<?php echo $tel; ?>" />
            <input type="hidden" name="login_id" value="<?php echo $login_id; ?>" />
            <input type="hidden" name="mail_address" value="<?php echo $mail_address; ?>" />
            <input type="hidden" name="service" value="<?php echo $service; ?>" />
            <input type="hidden" name="t_unis_cust_id" value="<?php echo Func::h($account_info["t_unis_cust_id"]); ?>" />
            <input type="hidden" name="transition" value="<?php echo $transition; ?>" />
            <input type="hidden" name="organization_code" value="<?php echo $organization_code; ?>" />
        </form>

    </div><!-- /メインパネル -->

</div><!-- /メイン -->
<?php
include(TPL_DIR . DS . "common" . DS . "footer.tpl");
