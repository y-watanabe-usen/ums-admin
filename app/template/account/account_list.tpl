<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<script type="text/javascript">
//<![CDATA[
    (function ($) {
        $(function () {
            //UNIS情報
            $('#grid_unis1').usengrid({width: "560px", height: "165", resize: false, scroll: false, hcolor: "blue"});
            $('#grid_unis2').usengrid({width: "560px", height: "165", resize: false, scroll: false, hcolor: "blue"});

            //アカウント証発送情報
            $('#grid_issue').usengrid({width: "100%", height: "100px", resize: true, scroll: true, hcolor: "blue",
                column: [{"name": "issue_date"}, {"name": "not_arrived_date"}, {"name": "name"}, {"name": "address"}, {"name": "to_name"}, {"name": "status_flag_name"}, {"name": "status_flag"}, {"name": "can_flag"}],
                data:<?php echo json_encode($issue_info); ?>,
                custom: function(v, l, i, j){

                    if (j == 6) {
                        <?php
                        //削除権限がある場合
                        if ($this->Acl->check($this->Auth->user("role_id"), "/account/up_issue_history")) {
                            $delete = '<button class="bt_status_flag bt_mini" style="width:80px;">削除</button>';
                            $unnecessary = '<button class="bt_status_flag bt_mini" style="width:80px;">再送不要</button>';
                        //ない場合（ボタン非活性）
                        } else {
                            $delete = '<button class="bt_mini" disabled style="width:80px;">削除</button>';
                            $unnecessary = '<button class="bt_mini" disabled style="width:80px;">再送不要</button>';
                        }
                        ?>
                        if (v == 0) {
                            v = '<?php echo $delete; ?>'
                              + '<input type="hidden" name="id" value="' + l.id + '">'
                              + '<input type="hidden" name="status_flag" value="' + v + '">'
                              + '<input type="hidden" name="t_unis_cust_id" value="' + l.t_unis_cust_id + '">';
                        } else if (v == 2 && i == 0) {
                            v = '<?php echo $unnecessary; ?>'
                              + '<input type="hidden" name="id" value="' + l.id + '">'
                              + '<input type="hidden" name="status_flag" value="' + v + '">'
                              + '<input type="hidden" name="t_unis_cust_id" value="' + l.t_unis_cust_id + '">';
                        } else {
                            v = "";
                        }
                    }
                    return v;
                }
            });

            //アカウント証発送情報
            $('#grid_direct_pdf').usengrid({width: "100%", height: "100px", resize: true, scroll: true, hcolor: "blue",
                column: [{"name": "print_date"}, {"name": "name"}, {"name": "address"}, {"name": "print_user"}],
                data: <?php echo json_encode($direct_pdf_info); ?>,
            });

            $("#grid_issue").on("click", ".bt_status_flag", function() {
                $(".pop_message", "#pop_status_flag").html("");
                $(".bt_pop_save", "#pop_status_flag").show();
                var id = $('input[name="id"]', $(this).parent()).val();
                var status_flag = $('input[name="status_flag"]', $(this).parent()).val();
                var t_unis_cust_id = $('input[name="t_unis_cust_id"]', $(this).parent()).val();
                var msg = "";
                if (status_flag == "0") {
                    msg = '<font style="color:blue;">削除</font>しますが、よろしいですか？';
                } else if (status_flag == "2") {
                    msg = '<font style="color:red;">再送不要</font>に更新しますが、よろしいですか？';
                }
                $.data($("#pop_status_flag").get(0), "id", id);
                $.data($("#pop_status_flag").get(0), "status_flag", status_flag);
                $.data($("#pop_status_flag").get(0), "t_unis_cust_id", t_unis_cust_id);

                $("#msg_status_flag").html(msg);
                $(".pop_message", "#pop_status_flag").html();
                var l = ($(".main-panel").width() - 400) / 2;
                $.blockUI({
                    message: $("#pop_status_flag"),
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
            $("#pop_status_flag").on("click", ".bt_pop_save", function() {
                var status_flag = $.data($("#pop_status_flag").get(0),"status_flag");
                var msg = "更新";
                if (status_flag == "0") {
                    msg = "削除";
                }
                $(this).hide();
                $.ajax({
                    type: 'POST',
                    url: '/account/up_issue_history',
                    cache: false,
                    datatype: 'json',
                    data: {id:$.data($("#pop_status_flag").get(0),"id"),
                        status_flag:$.data($("#pop_status_flag").get(0),"status_flag"),
                        t_unis_cust_id:$.data($("#pop_status_flag").get(0),"t_unis_cust_id")},
                    success: function(json) {
                        if (json.result_cd == 0) {
                            $('#grid_issue').usengrid("clear").usengrid("add", json.result_data);
                            $(".pop_message", "#pop_status_flag").html(msg + "しました。");
                            var divname = "#pop_issue";
                            var count = json.count;
                            if (count != null) {
                                var result_data = json.result_data;
                                $(divname + " #name").val(result_data[count]["name"]).trigger('change');
                                $(divname + " #zip_cd1").val(result_data[count]["zip_cd1"]).trigger('change');
                                $(divname + " #zip_cd2").val(result_data[count]["zip_cd2"]).trigger('change');
                                $(divname + " #address1").val(result_data[count]["address1"]).trigger('change');
                                $(divname + " #address2").val(result_data[count]["address2"]).trigger('change');
                                $(divname + " #address3").val(result_data[count]["address3"]).trigger('change');
                                $(divname + " #status_flag").val(result_data[count]["status_flag"]).trigger('change');
                                $(divname + " #t_issue_history_id").val(result_data[count]["id"]).trigger('change');
                            } else {
                                $(divname + " #name").val("<?php echo Func::h($unis_issue['issue_name']); ?>").trigger('change');
                                $(divname + " #zip_cd1").val("<?php echo $unis_issue['issue_zip_cd1']; ?>").trigger('change');
                                $(divname + " #zip_cd2").val("<?php echo $unis_issue['issue_zip_cd2']; ?>").trigger('change');
                                $(divname + " #address1").val("<?php echo $unis_issue['issue_address1']; ?>").trigger('change');
                                $(divname + " #address2").val("<?php echo $unis_issue['issue_address2']; ?>").trigger('change');
                                $(divname + " #address3").val("<?php echo $unis_issue['issue_address3']; ?>").trigger('change');
                                $(divname + " #status_flag").val("").trigger('change');
                                $(divname + " #t_issue_history_id").val("").trigger('change');
                            }
                        } else {
                            $(".pop_message", "#pop_status_flag").html(json.error_message);
                        }
                    },
                    error: function() {
                        $(".pop_message", "#pop_status_flag").html(msg + "に失敗しました。");
                    }
                });
            });

            $("#pop_issue").on("click", ".bt_pop_save", function() {
                $(this).hide();
                var name = $("#input_name").val();
                var zip_cd1 = $("#input_zip_cd1").val();
                var zip_cd2 = $("#input_zip_cd2").val();
                var address1 = $("#input_address1").val();
                var address2 = $("#input_address2").val();
                var address3 = $("#input_address3").val();
                var issue_type = $('input[name="issue_type"]:checked').val();
                var status_flag = $("#status_flag").val();
                var t_issue_history_id = $("#t_issue_history_id").val();
                $.ajax({
                    type: 'POST',
                    url: '/account/ins_issue_history',
                    cache: false,
                    datatype: 'json',
                    data: {t_issue_history_id:t_issue_history_id,
                        name:name,
                        zip_cd1:zip_cd1,
                        zip_cd2:zip_cd2,
                        address1:address1,
                        address2:address2,
                        address3:address3,
                        issue_type:issue_type,
                        t_unis_cust_id:<?php echo $new_issue_info["t_unis_cust_id"]; ?>,
                        status_flag:status_flag},
                    success: function(json) {
                        if (json.result_cd == 0) {
                            $('#grid_issue').usengrid("clear").usengrid("add", json.result_data);
                            $(".pop_message", "#pop_issue").html("登録しました。");
                            var count = json.count;
                            if (count != null) {
                                var result_data = json.result_data;
                                $("#name").val(result_data[count]["name"]).trigger('change');
                                $("#zip_cd1").val(result_data[count]["zip_cd1"]).trigger('change');
                                $("#zip_cd2").val(result_data[count]["zip_cd2"]).trigger('change');
                                $("#address1").val(result_data[count]["address1"]).trigger('change');
                                $("#address2").val(result_data[count]["address2"]).trigger('change');
                                $("#address3").val(result_data[count]["address3"]).trigger('change');
                                $("#status_flag").val(result_data[count]["status_flag"]).trigger('change');
                                $("#t_issue_history_id").val(result_data[count]["id"]).trigger('change');
                            }
                        } else {
                            var add_height = 15;
                            var issue_px = 280 + add_height * Number(json.error_count) + "px";
                            $("#pop_issue").css({'height':issue_px});
                            $(".pop_message", "#pop_issue").html(json.error_message);
                            $(".bt_pop_save", "#pop_issue").show();
                        }
                    },
                    error: function() {
                        $(".pop_message", "#pop_issue").html("登録に失敗しました。");
                    }
                });
            });

            $("#pop_direct_pdf").on("click", ".bt_pop_save", function() {
                $(this).hide();
                $("#fr_direct_pdf").submit();
                $.ajax({
                    type: 'POST',
                    url: '/account/get_direct_pdf_history',
                    cache: false,
                    datatype: 'json',
                    data: {t_unis_cust_id: <?php echo $unis_info["id"]; ?>},
                    success: function(json) {
                        if (json.result_cd == 0) {
                            $('#grid_direct_pdf').usengrid("clear").usengrid("add", json.result_data);
                        }
                    },
                    error: function() {
                    }
                });
            });

            //詳細画面へ遷移
            $(".bt_detail").click(function () {
                $('#fr_detail input[name="account_id"]').val($(this).parent().parent().children("td:first").text());
                $("#fr_detail").submit();
            });

            $("#bt_issue").click(function() {
                $("#input_name").val($("#name").val());
                $("#input_zip_cd1").val($("#zip_cd1").val());
                $("#input_zip_cd2").val($("#zip_cd2").val());
                $("#input_address1").val($("#address1").val());
                $("#input_address2").val($("#address2").val());
                $("#input_address3").val($("#address3").val());
                $('input[name="issue_type"]').val(["1"]);
                $(".pop_message", "#pop_issue").html("");
                $(".bt_pop_save", "#pop_issue").show();
                $("#pop_issue").css({'height':'280'});
                var l = ($(".main-panel").width() - 500) / 2;
                $.blockUI({
                    message: $("#pop_issue"),
                    css: {
                    width:"500px",
                    height: "280",
                    top: "100px",
                    left: l,
                    textAlign: "left",
                    border: "0",
                    background:"none",
                    cursor: "default",
                    borderRadius: "3px"}
                });
            });

            $("#bt_direct_pdf").click(function() {
                $(".pop_message", "#pop_direct_pdf").html("");
                $(".bt_pop_save", "#pop_direct_pdf").show();
                $("#pop_direct_pdf").css({'height':'180'});
                var l = ($(".main-panel").width() - 560) / 2;
                $.blockUI({
                    message: $("#pop_direct_pdf"),
                    css: {
                    width:"560px",
                    height: "180",
                    top: "100px",
                    left: l,
                    textAlign: "left",
                    border: "0",
                    background:"none",
                    cursor: "default",
                    borderRadius: "3px"}
                });
            });

            //ポップアップの閉じる
            $(".bt_pop_close").click(function () {
                $.unblockUI();
            });

            //一覧へ戻る
            $("#bt_back").click(function () {
                $("#fr_back").submit();
            });
            //支店別顧客管理機能へ戻る
            $("#bt_branch_back").click(function () {
                $("#fr_branch_back").submit();
            });
        });
    })(jQuery);
//]]>
</script>

<!-- メイン -->
<div class="main">

    <!-- メインパネル -->
    <div class="main-panel">
        <div class="main-title"><?php echo $titleName; ?>
        <?php if (!empty($transition) && $transition === "branch") { ?>
            <button id="bt_branch_back" style="bottom:3px;right:0;position:absolute;" onclick='window.location.href = "/branch/search"'>一覧へ戻る</button>
        <?php } else { ?>
            <button id="bt_back" style="bottom:3px;right:0;position:absolute;" onclick='window.location.href = "/account/search"'>一覧へ戻る</button>
        <?php } ?>
        </div>

        <!-- UNIS情報 -->
        <?php include(TPL_DIR . DS . "account" . DS . "unis_info.tpl"); ?>
        <!-- /UNIS情報 -->

        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:auto;">
            <div class="panel" style="padding-top:25px;">
                <div class="panel-title">アカウント一覧</div>

                
                <div class="unit" style="padding:10px 10px 0; float:left;">
                    <table id="account_table" class="nogrid_table">
                        <tr style="height:50px;">
                            <th style="width:80px;">アカウントID</th>
                            <th style="width:40px;">状態</th>
                            <th style="width:180px">ログインID</th>
                            <th style="width:220px;">メールアドレス</th>
                            <th style="width:90px;">UMsID開始日</th>
                            <th style="width:90px;">UMsID初回登録日</th>
                            <th style="width:90px;">UMsID失効日</th>
                            <th style="width:140px;">サービス</th>
                            <th style="width:90px;">利用可否</th>
                            <th style="width:70px;"></th>
                        </tr>
                        <?php foreach ($account_info as $account) {
                                $grayout = "";
                                if ($account["status_flag"] !== "有効") {
                                    $grayout = "grayout ";
                                }
                        ?>
                            <?php 
                                $tmpServiceList = $service_list;
                                $serviceCnt = count($service_list);
                                $height = 20 * $serviceCnt;
                                $firstService = array_shift($tmpServiceList);
                            ?>
                            <tr>
                                <td class="<?php echo $grayout; ?>s_info_right"  rowspan="<?php echo $serviceCnt;?>;"><?php echo Func::h($account["id"]); ?></td>
                                <td class="<?php echo $grayout; ?>s_info_center" rowspan="<?php echo $serviceCnt;?>;"><?php echo Func::h($account["status_flag"]); ?></td>
                                <td class="<?php echo $grayout; ?>" rowspan="<?php echo $serviceCnt;?>;"><?php echo Func::h($account["login_id"]); ?></td>
                                <td class="<?php echo $grayout; ?>" rowspan="<?php echo $serviceCnt;?>;"><?php echo Func::h($account["mail_address"]); ?></td>
                                <td class="<?php echo $grayout; ?>s_info_center" rowspan="<?php echo $serviceCnt;?>;"><?php echo Func::h($account["start_date"]); ?></td>
                                <td class="<?php echo $grayout; ?>s_info_center" rowspan="<?php echo $serviceCnt;?>;"><?php echo Func::h($account["init_date"]); ?></td>
                                <td class="<?php echo $grayout; ?>s_info_center" rowspan="<?php echo $serviceCnt;?>;"><?php echo Func::h($account["end_date"]); ?></td>
                                <td class="<?php echo $grayout; ?>" style="width: 70px;background:#dabba2; height: 20px;"><?php echo Func::h($firstService["service_name"]); ?></td>
                                <td class="<?php echo $grayout; ?>s_info_center" style="height: 20px;"><?php echo $check_mark = !empty($service_info[$account["id"]][$firstService["service_cd"]]["check_mark"]) ? $service_info[$account["id"]][$firstService["service_cd"]]["check_mark"] : "" ; ?>
                                <td class="<?php echo $grayout; ?>s_info_center" rowspan="<?php echo $serviceCnt;?>;"><button class="bt_mini bt_detail" style="width:50px;">詳細</button></td>
                            </tr>
                            <?php foreach ($tmpServiceList as $val) { ?>
                            <tr>
                                <td style="width: 70px;background:#dabba2; white-space: normal;"><?php echo Func::h($val["service_name"]); ?></td>
                                <td class="<?php echo $grayout; ?>s_info_check"><?php echo $check_mark = !empty($service_info[$account["id"]][$val["service_cd"]]["check_mark"]) ? $service_info[$account["id"]][$val["service_cd"]]["check_mark"] : "" ; ?></td>
                            </tr>
                            <?php } ?>
                        <?php } ?>
                    </table>
                </div>

            </div>
        </div>
        <!-- /パネル -->

        <!-- ポップアップ -->
        <div id="pop_status_flag" class="panel-pop" style="padding-top:25px;">
            <div class="panel-title">削除</div>
            <!-- ユニット -->
            <div class="unit" style="padding:10px 20px 10px 20px;">
                <div id="msg_status_flag" style="font-size:14px;text-align:center;"></div>
                <div class="pop_message" style="text-align:center;margin:2px 0;height:20px;color:red;"></div>
                <div style="text-align:center;">
                    <button class="bt_pop_save bt_blue" style="margin:0 10px;">OK</button>
                    <button class="bt_pop_close" style="margin:0 10px;">閉じる</button>
                </div>
            </div>
            <!-- /ユニット -->
        </div>
        <!-- ポップアップ -->

        <!-- ポップアップ -->
        <div id="pop_issue" class="panel-pop" style="padding-top:25px;">
            <div class="panel-title">アカウント証　再送登録</div>
            <!-- ユニット -->
            <div class="unit" style="padding:10px 20px 10px 20px;">
                <table style="width:100%;">
                    <tr>
                        <td colspan="2"><div style="font-weight: bold; margin-bottom: 10px;">前回送付先情報をデフォルト表示しています。</div></td>
                    </tr>
                    <tr>
                        <td style="width:90px;"><span class="required">送付先名称</span></td>
                        <td><input id="input_name" type="text" style="width:350px;" maxlength="40" value="" /></td>
                    </tr>
                    <tr>
                        <td style="width:90px;"><span class="required">送付先〒</span></td>
                        <td><input id="input_zip_cd1" type="text" style="width: 40px;" maxlength="3" value="" />&nbsp;-&nbsp;<input id="input_zip_cd2" type="text" style="width: 50px;" maxlength="4" value="" /></td>
                    </tr>
                    <tr>
                        <td style="width:90px;"><span class="required">送付先住所１</span></td>
                        <td><input id="input_address1" type="text" style="width:350px;" maxlength="50" value="" /></td>
                    </tr>
                    <tr>
                        <td style="width:90px;"><span class="required">送付先住所２</span></td>
                        <td><input id="input_address2" type="text" style="width:350px;" maxlength="50" value="" /></td>
                    </tr>
                    <tr>
                        <td style="width:90px;">送付先住所３</td>
                        <td><input id="input_address3" type="text" style="width:350px;" maxlength="50" value="" /></td>
                    </tr>
                    <tr>
                        <td style="width:90px;">発送先</td>
                        <td><input type="radio" id="issue_type" name="issue_type" value="1" checked>顧客発送</input>&nbsp;&nbsp;<input type="radio" id="issue_type" name="issue_type" value="2">技術発送</input></td>
                    </tr>
                </table>
                <div class="pop_message" style="text-align:center;margin:5px 0;color:red;"></div>
                <div><input type="hidden" id="name" name="name" value="<?php echo Func::h($issue['name']); ?>"></div>
                <div><input type="hidden" id="zip_cd1" name="zip_cd1" value="<?php echo Func::h($issue['zip_cd1']); ?>"></div>
                <div><input type="hidden" id="zip_cd2" name="zip_cd2" value="<?php echo Func::h($issue["zip_cd2"]); ?>"></div>
                <div><input type="hidden" id="address1" name="address1" value="<?php echo Func::h($issue['address1']); ?>"></div>
                <div><input type="hidden" id="address2" name="address2" value="<?php echo Func::h($issue['address2']); ?>"></div>
                <div><input type="hidden" id="address3" name="address3" value="<?php echo Func::h($issue['address3']); ?>"></div>
                <div><input type="hidden" id="status_flag" name="status_flag" value="<?php echo !empty($new_issue_info["status_flag"]) ? Func::h($new_issue_info["status_flag"]) : ""; ?>"></div>
                <div><input type="hidden" id="t_issue_history_id" name="t_issue_history_id" value="<?php echo !empty($new_issue_info["id"]) ? Func::h($new_issue_info["id"]) : ""; ?>"></div>
                <div style="text-align:center;">
                <button class="bt_pop_save bt_blue" style="margin:0 10px;">保存</button>
                <button class="bt_pop_close" style="margin:0 10px;">閉じる</button>
                </div>
            </div>
        <!-- /ユニット -->

        </div>
        <!-- ポップアップ -->

        <!-- ポップアップ -->
        <div id="pop_direct_pdf" class="panel-pop" style="padding-top:25px;">
            <div class="panel-title">ダイレクト出力</div>
            <!-- ユニット -->
            <div class="unit" style="padding:10px 20px 10px 20px;">
                <div class="clearfix mb10">
                    <div style="float: left;" class="txt_center width: 70px;"><img src="/img/alert.png" alt="警告" width="60" height="53" /></div>
                    <div style="float: right;">・本機能は、郵便事情などにより施工日までにID通知書が届かない場合に使用してください。<br/>・実行するとID通知書がPDFファイルで表示されますので、通常のPDFファイルと同様に印刷してください。<br/>・実行すると使用者と使用日時が記録されます。</div>
                </div>
                <div class="txt_center mb20">実行しますか？</div>
                <div style="text-align:center;">
                    <button class="bt_pop_save bt_blue" style="margin:0 10px;">実行</button>
                    <button class="bt_pop_close" style="margin:0 10px;">閉じる</button>
                </div>
            </div>
            <!-- /ユニット -->
        </div>
        <!-- ポップアップ -->

        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:auto;">
            <div class="panel" style="padding-top:25px;">
                <div class="panel-title">
                    <div style="float: left;">アカウント証発送情報</div>
                <?php
                    if ($this->Acl->check($this->Auth->user("role_id"), "/account/ins_issue_history") && ($new_issue_info["t_unis_cust_status_flag"] === "1" || $new_issue_info["t_unis_cust_status_flag"] === "2")) {
                        echo '<div style="float: right; padding-right: 10px;"><button id="bt_issue">再送登録</button></div>';
                    }
                ?>
                </div>
                <!-- ユニット -->
                <div class="unit" style="padding:10px 10px 10px 10px;">
                    <table id="grid_issue">
                        <thead>
                            <tr>
                                <th width="90px">発送日</th>
                                <th width="90px">未着日</th>
                                <th width="270px">名称</th>
                                <th width="380px">住所</th>
                                <th width="80px">送付先</th>
                                <th width="80px">ステータス</th>
                                <th width="100px"></th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                <!-- /ユニット -->

            </div>
        </div>
        <!-- /パネル -->

        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:auto;">
            <div class="panel" style="padding-top:25px;">
                <div class="panel-title">
                    <div style="float: left;">アカウント証ダイレクト出力履歴</div>
                <?php
                    if ($this->Acl->check($this->Auth->user("role_id"), "/account/direct_pdf") && ($new_issue_info["t_unis_cust_status_flag"] === "1" || $new_issue_info["t_unis_cust_status_flag"] === "2") && ($valid_service_count > 0)) { // 権限があって、UNIS顧客が受注か確定で、有効なサービスが1件でもあったらボタン表示
                        echo '<div style="float: right; padding-right: 10px;"><button id="bt_direct_pdf">ダイレクト出力</button></div>';
                    }
                ?>
                </div>
                <!-- ユニット -->
                <div class="unit" style="padding:10px 10px 10px 10px;">
                    <table id="grid_direct_pdf">
                        <thead>
                            <tr>
                                <th width="90px">出力日</th>
                                <th width="270px">名称</th>
                                <th width="380px">住所</th>
                                <th width="150px">出力者</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                <!-- /ユニット -->

            </div>
        </div>
        <!-- /パネル -->

        <form id="fr_detail" action="/account/detail" method="POST">
            <input type="hidden" name="cust_cd" value="<?php echo $cust_cd; ?>" />
            <input type="hidden" name="name" value="<?php echo Func::h($name); ?>" />
            <input type="hidden" name="tel" value="<?php echo $tel; ?>" />
            <input type="hidden" name="login_id" value="<?php echo $login_id; ?>" />
            <input type="hidden" name="mail_address" value="<?php echo $mail_address; ?>" />
            <input type="hidden" name="service" value="<?php echo $service; ?>" />
            <input type="hidden" name="account_id" value="" />
            <input type="hidden" name="transition" value="<?php echo $transition; ?>" />
            <input type="hidden" name="organization_code" value="<?php echo $organization_code; ?>" />
        </form>

        <form id="fr_back" action="/account/search" method="POST">
            <input type="hidden" name="type" value="search" />
            <input type="hidden" name="cust_cd" value="<?php echo $cust_cd; ?>" />
            <input type="hidden" name="name" value="<?php echo Func::h($name); ?>" />
            <input type="hidden" name="tel" value="<?php echo $tel; ?>" />
            <input type="hidden" name="login_id" value="<?php echo $login_id; ?>" />
            <input type="hidden" name="mail_address" value="<?php echo $mail_address; ?>" />
            <input type="hidden" name="service" value="<?php echo $service; ?>" />
        </form>

        <form id="fr_branch_back" action="/branch/search" method="POST">
            <input type="hidden" name="type" value="branch" />
            <input type="hidden" name="organization_code" value="<?php echo $organization_code; ?>" />
        </form>

        <form id="fr_direct_pdf" action="/account/direct_pdf" method="POST">
            <input type="hidden" name="t_unis_cust_id" value="<?php echo $unis_info["id"]; ?>" />
        </form>

    </div><!-- /メインパネル -->

</div><!-- /main -->
<?php
include(TPL_DIR . DS . "common" . DS . "footer.tpl");
