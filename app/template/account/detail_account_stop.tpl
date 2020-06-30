<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<script type="text/javascript">
//<![CDATA[
    (function ($) {
        $(function () {
            //UNIS情報
            $('#grid_unis1').usengrid({width: "560px", height: "165", resize: false, scroll: false, hcolor: "blue"});
            $('#grid_unis2').usengrid({width: "560px", height: "165", resize: false, scroll: false, hcolor: "blue"});

            $("#from_div").change(function() {
                if ($(this).val() == "1") {
                    $("#from").hide();
                    $("#from_edit").hide();
                } else if ($(this).val() == "2") {
                    $("#from").show();
                    $("#from_edit").hide();
                }
            });

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

            //サービス一覧表示判定
            function status_display() {
                $("#grid2 tbody").empty();
                var t_unis_service_id = $("#pop_service_stop_add #t_unis_service_id").val();
                var status_flag = $("#grid #status_flag").val();
                var admin_status_flag = $("#grid #admin_status_flag").val();
                $("#err_message").html("");
                $('#grid tbody tr td').removeClass("grayout");
                if (status_flag == "1" || admin_status_flag == "1") {
                    $('#grid tbody tr td').addClass("grayout");
                }
                $.ajax({
                    type: 'POST',
                    url: '/account/get_service_stop_history',
                    cache: false,
                    datatype: 'json',
                    data: {t_unis_service_id: t_unis_service_id},
                    success: function (json) {
                        if (json.result_cd == 0) {
                            var result_data = json.result_data;
                            var now_date = json.now_date;
                            $(result_data).each(function(i) {
                                var release_datetime = "";
                                var release_date = "";
                                if (result_data[i]["release_datetime"] != null) {
                                    release_datetime = result_data[i]["release_datetime"];
                                }
                                if (result_data[i]["release_datetime"] != null) {
                                    release_date = result_data[i]["release_date"];
                                }
                                var history_html = service_stop_history_html(result_data[i]["id"], result_data[i]["stop_div"], result_data[i]["stop_div_name"], result_data[i]["start_datetime"], release_datetime, result_data[i]["start_date"], release_date);
                                $('#grid2').append(history_html);
                            });
                        } else {
                            $("#err_message").html(json.error_message);
                        }
                    },
                    error: function () {
                        $("#err_message").html("休店/強制施錠の取得に失敗しました。");
                    }
                });
            }

            //休店/強制施錠一覧表示用HTML
            function service_stop_history_html(id, stop_div, stop_div_name, start_datetime, release_datetime, ins_start_date, ins_release_date) {
                var ndate = new Date(now_date());
                var start_date = process_date(start_datetime);
                var release_date = process_date(release_datetime);
                var history_tr = '';
                var history_html = '';
                var hidden = '<input type="hidden" name="t_service_stop_history_id" value="' + id + '"><input type="hidden" name="stop_div" value="' + stop_div + '"><input type="hidden" name="start_date" value="' + ins_start_date + '"><input type="hidden" name="release_date" value="' + ins_release_date + '">';
                <?php
                //サービス強制停止権限がある場合
                if ($this->Acl->check($this->Auth->user("role_id"), "/account/ins_up_service_stop_history") && ($service_info["0"]["status_flag"] === "0") && ($service_info["0"]["admin_status_flag"] === "0")) {
                    $edit = '<button class="bt_edit" style="margin:3px;">編集</button>';
                    $release = '<button class="bt_release bt_blue" style="margin:3px;">強制解除</button>';
                    $cancel = '<button class="bt_cancel bt_blue" style="margin:3px;">キャンセル</button>';
                //ない場合（ボタン非活性）
                } else {
                    $edit = '<button class="bt_noactive" disabled style="margin:3px;">編集</button>';
                    $release = '<button class="bt_noactive" disabled style="margin:3px;">強制解除</button>';
                    $cancel = '<button class="bt_noactive" disabled style="margin:3px;">キャンセル</button>';
                }
                ?>
                history_tr = '<tr>';
                history_html = '<td>'+ stop_div_name +'</td><td><div id="start_datetime">'+ start_datetime +'</div></td><td>'+ release_datetime +'</td><td>';
                if (start_date > ndate) {
                    history_html = history_html + '<?php echo $edit . " " . $cancel; ?></td>' + hidden + '</tr>';
                } else if ((start_date <= ndate) && (release_date > ndate || release_date == "")) {
                    history_tr = '<tr style="background-color: #EFC4C4;">';
                    history_html = history_html + '<?php echo $edit . " " . $release; ?></td>' + hidden + '</tr>';
                    $('#grid tbody tr td').addClass("grayout");
                } else {
                    history_html = history_html + '</tr>';
                }
                return history_tr + history_html;
            }

            //追加用ポップアップ
            $("#bt_add_stop").click(function () {
                $(".bt_pop_save", "#pop_service_stop_add").show();
                $(".err-message", "#pop_service_stop_add").html("");
                $("#from_div").val("");
                $("#from_div").show().trigger("change");
                $("#from").hide();
                $("#from_edit").hide();
                $("#stop_div").val("");
                $("#stop_div").attr("disabled", false);
                $("#stop_from").val("").trigger("change");
                $("#stop_to").val("").trigger("change");
                $("#pop_service_stop_add #t_service_stop_history_id").val("").trigger("change");
                $("#pop_service_stop_add #from_change_flag").val("1").trigger('change');
                var l = ($(".main-panel").width() - 600) / 2;
                var ndate = new Date(now_date());
                var t_unis_service_id = $('input[name="t_unis_service_id"]', $(this).parent().parent()).val();
                $.blockUI({
                    message: $("#pop_service_stop_add"),
                    focusInput: false,
                    onBlock: function() { $(".datepicker").datepicker(); },
                    css: {
                        width:"600px",
                        height: "200px",
                        top: "100px",
                        left: l,
                        textAlign: "left",
                        border: "0",
                        background:"none",
                        cursor: "default",
                        borderRadius: "3px"}
                    });
            });

            //編集用ポップアップ
            $("#grid2").on("click", ".bt_edit", function () {
                $(".err-message", "#pop_service_stop_add").html("");
                var t_service_stop_history_id = $('input[name="t_service_stop_history_id"]', $(this).parent().parent()).val();
                var stop_div = $('input[name="stop_div"]', $(this).parent().parent()).val();
                var start_date = $('input[name="start_date"]', $(this).parent().parent()).val();
                var release_date = $('input[name="release_date"]', $(this).parent().parent()).val();
                var ndate = new Date(now_date());
                var start_datetime = $('#start_datetime', $(this).parent().parent()).html();
                var ck_start_date = process_date(start_datetime);
                $("#pop_service_stop_add #t_service_stop_history_id").val(t_service_stop_history_id).trigger('change');
                $("#pop_service_stop_add #stop_from").val(start_date).trigger('change');
                $("#pop_service_stop_add #stop_to").val(release_date).trigger('change');
                $(".bt_pop_save", "#pop_service_stop_add").show();
                if (ck_start_date <= ndate) {
                    $("#from").hide();
                    $("#from_edit").show();
                    $("#pop_service_stop_add #from_edit").html(start_datetime.replace(/-/g, '/'));
                    $("#pop_service_stop_add #from_change_flag").val("2").trigger('change');
                } else {
                    $("#from").show();
                    $("#from_edit").hide();
                    $("#pop_service_stop_add #from_edit").html("").trigger("change");
                    $("#pop_service_stop_add #from_change_flag").val("1").trigger('change');
                }
                $("#from_div").hide();
                $("#from_div").val("2");
                $("#stop_div").val(stop_div);
                $("#stop_div").attr("disabled", true);
                var l = ($(".main-panel").width() - 600) / 2;
                $.blockUI({
                    message: $("#pop_service_stop_add"),
                    focusInput: false,
                    onBlock: function() { $(".datepicker").datepicker(); },
                    css: {
                        width:"600px",
                        height: "200px",
                        top: "100px",
                        left: l,
                        textAlign: "left",
                        border: "0",
                        background:"none",
                        cursor: "default",
                        borderRadius: "3px"}
                    });
            });

            // 強制開錠ポップアップ
            $("#bt_unlock").click(function () {
                var t_unis_service_id = $("#t_unis_service_id").val();
                $(".pop_message", "#pop_unlock").html("");
                $(".bt_pop_save", "#pop_unlock").show();
                $("#msg_unlock").html('<font style="color:red;">強制開錠</font>しますが、よろしいですか？');
                $.data($("#pop_unlock").get(0), "t_unis_service_id", t_unis_service_id);
                var l = ($(".main-panel").width() - 400) / 2;
                $.blockUI({
                    message: $("#pop_unlock"),
                    css: {
                        width: "400px",
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

            // 強制開錠ポップアップのOKボタン押下
            $("#pop_unlock").on("click", ".bt_pop_save", function () {
                $(this).hide();
                var t_unis_service_id = $.data($("#pop_unlock").get(0), "t_unis_service_id");
                $.ajax({
                    type: 'POST',
                    url: '/account/forced_unlock',
                    cache: false,
                    datatype: 'json',
                    data: {t_unis_service_id: t_unis_service_id},
                    success: function (json) {
                        $(".pop_message", "#pop_unlock").html("強制開錠しました。");
                        $("#bt_unlock").prop("disabled", true);
                        $(".bt_red").removeClass("bt_red");
                        $("#status_flag").val(json.status_flag);
                        status_display();
                    },
                    error: function () {
                        $(".pop_message", "#pop_unlock").html("強制開錠に失敗しました。");
                    }
                });
            });

            //保存ボタン押下
            $("#pop_service_stop_add").on("click", ".bt_pop_save", function () {
                $(this).hide();
                var stop_div = $("#stop_div").val();
                var from_div = $("#from_div").val();
                var stop_from = $("#stop_from").val();
                var stop_to = $("#stop_to").val();
                var t_unis_service_id = $("#t_unis_service_id").val();
                var t_service_stop_history_id = $("#t_service_stop_history_id").val();
                var from_change_flag = $("#from_change_flag").val();
                var pro_name = "登録";
                if (t_service_stop_history_id != "") {
                    pro_name = "編集"
                }
                $.ajax({
                    type: 'POST',
                    url: '/account/ins_up_service_stop_history',
                    cache: false,
                    datatype: 'json',
                    data: {stop_div:stop_div,
                        from_div:from_div,
                        stop_from:stop_from,
                        stop_to:stop_to,
                        t_unis_service_id:t_unis_service_id,
                        t_service_stop_history_id:t_service_stop_history_id,
                        from_change_flag:from_change_flag},
                    success: function(json) {
                        if (json.result_cd == 0) {
                            $("#grid_stop tbody").empty();
                            var result_data = json.result_data;
                            var now_date = json.now_date;
                            status_display();
                            $(".err-message", "#pop_service_stop_add").html(pro_name + "しました。");
                        } else {
                            $(".err-message", "#pop_service_stop_add").html(json.error_message);
                            $(".bt_pop_save", "#pop_service_stop_add").show();
                        }
                    },
                    error: function() {
                        $(".err-message", "#pop_service_stop_add").html(pro_name + "に失敗しました。");
                    }
                });
            });

            //強制解除ボタン押下
            $("#grid2").on("click", ".bt_release", function () {
                var t_unis_service_id = $("#t_unis_service_id").val();
                var t_service_stop_history_id = $('input[name="t_service_stop_history_id"]', $(this).parent().parent()).val();
                $(".pop_message", "#pop_release").html("");
                $(".bt_pop_save", "#pop_release").show();
                $("#msg_release").html('<font style="color:red;">強制解除</font>しますが、よろしいですか？');
                $.data($("#pop_release").get(0), "t_unis_service_id", t_unis_service_id);
                $.data($("#pop_release").get(0), "t_service_stop_history_id", t_service_stop_history_id);
                var l = ($(".main-panel").width() - 400) / 2;
                $.blockUI({
                    message: $("#pop_release"),
                    css: {
                        width: "400px",
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

            // 強制解除ポップアップのOKボタン押下
            $("#pop_release").on("click", ".bt_pop_save", function () {
                $(this).hide();
                $.ajax({
                    type: 'POST',
                    url: '/account/forced_release',
                    cache: false,
                    datatype: 'json',
                    data: {t_unis_service_id: $.data($("#pop_release").get(0), "t_unis_service_id"),
                    t_service_stop_history_id: $.data($("#pop_release").get(0), "t_service_stop_history_id")},
                    success: function (json) {
                        $(".pop_message", "#pop_release").html("強制解除しました。");
                        status_display();
                    },
                    error: function () {
                        $(".pop_message", "#pop_release").html("強制解除に失敗しました。");
                    }
                });
            });

            //キャンセルボタン押下
            $("#grid2").on("click", ".bt_cancel", function () {
                var t_unis_service_id = $("#t_unis_service_id").val();
                var t_service_stop_history_id = $('input[name="t_service_stop_history_id"]', $(this).parent().parent()).val();
                $(".pop_message", "#pop_cancel").html("");
                $(".bt_pop_save", "#pop_cancel").show();
                $("#msg_cancel").html('<font style="color:red;">キャンセル</font>しますが、よろしいですか？');
                $.data($("#pop_cancel").get(0), "t_unis_service_id", t_unis_service_id);
                $.data($("#pop_cancel").get(0), "t_service_stop_history_id", t_service_stop_history_id);
                var l = ($(".main-panel").width() - 400) / 2;
                $.blockUI({
                    message: $("#pop_cancel"),
                    css: {
                        width: "400px",
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

            // キャンセルポップアップのOKボタン押下
            $("#pop_cancel").on("click", ".bt_pop_save", function () {
                $(this).hide();
                $.ajax({
                    type: 'POST',
                    url: '/account/del_service_stop_history',
                    cache: false,
                    datatype: 'json',
                    data: {t_unis_service_id: $.data($("#pop_cancel").get(0), "t_unis_service_id"),
                    t_service_stop_history_id: $.data($("#pop_cancel").get(0), "t_service_stop_history_id")},
                    success: function (json) {
                        $(".pop_message", "#pop_cancel").html("キャンセルしました。");
                        status_display();
                    },
                    error: function () {
                        $(".pop_message", "#pop_cancel").html("キャンセルに失敗しました。");
                    }
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
            
            //試聴履歴のページング
            $(".paging").click(function () {
                $("#disp_month").val($(this).attr("name"));
                $("#month_send").submit();
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
                <div class="panel-title">サービス情報</div>
                <div class="unit" style="padding:10px 10px 10px 10px;">
                    <table id="grid" class="nogrid_table" style="width:100%;table-layout:auto;">
                        <thead>
                            <tr>
                                <th width="35px">サービス</th>
                                <th width="40px">契約No</th>
                                <th width="40px">契約明細<br />No</th>
                                <th width="40px">契約明細<br />状態</th>
                                <th width="40px">課金開始月</th>
                                <th width="40px">終了月</th>
                                <th width="40px">契約品目</th>
                                <th width="50px">初回確定日</th>
                                <th width="50px">開始日</th>
                                <th width="60px">初回認証日時</th>
                                <th width="50px">終了日</th>
                                <?php
                                    if ($this->Acl->check($this->Auth->user("role_id"), "/account/forced_unlock") && $unlock_flg) {
                                        echo '<th width="50px">操作</th>';
                                    }
                                ?>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($service_info as $val) {
                                $grayout = "";
                                if ($val["status_flag"] === "1" || $val["admin_status_flag"] === "1") {
                                    $grayout = " grayout";
                                }
                            ?>
                                <tr>
                                    <td>
                                        <?php echo Func::h($val["service_name"]); ?>
                                        <input type="hidden" id="status_flag" name="status_flag" value="<?php echo Func::h($val["status_flag"]); ?>">
                                        <input type="hidden" id="admin_status_flag" name="admin_status_flag" value="<?php echo Func::h($val["admin_status_flag"]); ?>">
                                    </td>
                                    <td class="s_info_center<?php echo $grayout; ?>"><?php echo Func::h($val["cont_no"]); ?></td>
                                    <td class="s_info_center<?php echo $grayout; ?>"><?php echo Func::h($val["detail_no"]); ?></td>
                                    <td class="s_info_center<?php echo $grayout; ?>"><?php echo Func::h($val["detail_status_div_name"]); ?></td>
                                    <td class="s_info_center<?php echo $grayout; ?>"><?php echo $detail_start_month = !empty($val["detail_start_month"]) ? Func::h(date("Y-m", strtotime($val["detail_start_month"]."01"))) : ""; ?></td>
                                    <td class="s_info_center<?php echo $grayout; ?>"><?php echo $detail_end_month = !empty($val["detail_end_month"]) ? Func::h(date("Y-m", strtotime($val["detail_end_month"]."01"))) : ""; ?></td>
                                    <td class="s_info_center<?php echo $grayout; ?>"><?php echo Func::h($val["item_name"]); ?></td>
                                    <td class="s_info_center<?php echo $grayout; ?>"><?php echo Func::h($val["decide_date"]); ?></td>
                                    <td class="s_info_center<?php echo $grayout; ?>"><?php echo Func::h($val["start_date"]); ?></td>
                                    <td class="s_info_center<?php echo $grayout; ?>"><?php echo Func::h($val["init_auth_datetime"]); ?></td>
                                    <td class="s_info_center<?php echo $grayout; ?>"><?php echo Func::h($val["end_date"]); ?></td>
                                    <?php
                                        if ($this->Acl->check($this->Auth->user("role_id"), "/account/forced_unlock") && $unlock_flg) {
                                            $disabled = "";
                                            if ($val["status_flag"] == '0') {
                                                $disabled = " disabled";
                                            }else{
                                                $bt_red = " bt_red";
                                            }
                                            echo '<td class="s_info_center '.$grayout.'"><button class="bt_mini bt_detail '.$bt_red.'" id="bt_unlock" '.$disabled.'>強制開錠</button></td>';
                                        }
                                    ?>
                                </tr>
                            <?php } ?>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
        <!-- /パネル -->

        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:auto;">
            <div class="panel" style="padding-top:25px;">
                <div class="panel-title">休店/強制施錠一覧</div>

                <div class="unit" style="padding:35px 10px 10px 10px;">
                    <table style="padding:0;margin:0;position:absolute;top:5px;">
                        <tr>
                            <td style="width:170px;">
                    <?php
                        if ($this->Acl->check($this->Auth->user("role_id"), "/account/ins_up_service_stop_history") && ($service_info["0"]["status_flag"] === "0") && ($service_info["0"]["admin_status_flag"] === "0")) {
                            echo '<button class="bt_add" id="bt_add_stop">追加</button>';
                        } else {
                            echo '<button class="bt_noactive" disabled>追加</button>';
                        }
                    ?>
                            </td>
                            <td id="err_message" style="text-align:right;margin:5px 0;color:red;"></td>
                        </tr>
                    </table>
                    <table id="grid2" class="nogrid_table">
                        <thead>
                            <tr>
                                <th style="width:70px;">停止区分</th>
                                <th style="width:90px;">開始日時</th>
                                <th style="width:90px">解除日時</th>
                                <th style="width:90px;"></th>
                            </tr>
                        </thead>
                        <tbody style="text-align: center;">
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
        <!-- /パネル -->

        <?php if(!empty($listened_time)): ?>
        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:auto;">
            <div class="panel" style="padding-top:25px;">
                <?php if (!empty($listened_time['error'])): ?>
                <?php echo '<span class="color_red" style="margin-left:20px; font-weight:bold;">&#8251;' . Func::h($listened_time['error']) . '</span>'; ?>
                <?php else: ?>
                <span class="paging_area" style="height: 50px;padding-right:150px;float:right;">
                    <form id="month_send" action="/account/detail_account_stop" method="post">
                        <?php if(!empty($before_month)): ?>
                        <div style="float:left;">
                            <a href="#" name="<?php echo $before_month; ?>" class="paging"><img width="30px" height="30px" src="/img/left.png"><br></a>
                            前の6ヶ月
                        </div>
                        <?php endif; ?>
                        <?php if(!empty($next_month)): ?>
                        <div style="margin-left:10px;float:left;">
                            <a href="#" name="<?php echo $next_month; ?>" class="paging"><img  width="30px" height="30px" src="/img/right.png"><br></a>
                            次の6ヶ月
                        </div>
                        <?php endif; ?>
                        <input type="hidden" name="disp_month" id="disp_month" value="">
                        <?php foreach ($request as $key => $val): ?>
                        <input type="hidden" name="<?php echo $key; ?>" value="<?php echo $val; ?>">
                        <?php endforeach; ?>
                    </form>
                </span>
                <div class="panel-title">視聴履歴 <span style="font-weight:100;">&#8251;2015年8月分まで取得可能です。</span></div>
                <div class="unit" style="margin:50px 0 0 0 ;padding:0 10px 10px 10px;">
                    <?php foreach ($listened_time as $month): ?>
                    <table id="grid3" class="nogrid_table" style="width:15%;table-layout:auto;float:left;margin-left: 10px; ">
                        <thead>
                            <tr>
                                <th width="35px"><?php echo Func::h($month['date_view']); ?></th>
                                <th width="35px">ご利用時間</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="underline">
                                <th>Total</th>
                                <td style="font-weight:bold;text-align:right;"><?php echo Func::h($month['total_view']); ?></td>
                            </tr>
                            <?php foreach($month['days'] as $day): ?>
                            <tr>
                                <th><?php echo Func::h($day['day_view']); ?></th>
                                <td style="text-align:right;"><?php echo Func::h($day['total_view']); ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>
        </div>
        <!-- /パネル -->
        <?php endif; ?>

        <!-- ポップアップ -->
        <div id="pop_service_stop_add" class="panel-pop" style="padding-top:25px;">
            <div class="panel-title">休店/強制施錠登録</div>
            <!-- ユニット -->
            <div class="unit" style="padding:10px 20px 10px 20px;">
                <table style="width:100%;">
                    <tr>
                        <td colspan="2">
                            <div style="font-weight: bold; margin-bottom: 10px;">停止区分と期間のFrom～Toを入力してください。<br/>休店期間は最大6ヶ月まで入力できます。</div>
                        </td>
                    </tr>
                    <tr>
                        <td>停止区分</td>
                        <td>
                            <select id="stop_div" name="stop_div">
                                <option value="1" selected>休店</option>
                                <option value="2">強制施錠</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td style="width:100px;">期間</td>
                        <td>
                            <select id="from_div" name="from_div">
                                <option value="1" selected>現在日時</option>
                                <option value="2" >日付指定</option>
                            </select>
                            <span id="from"><input id="stop_from" type="text" class="datepicker" name="from_text" style="width:20%;" value="" /> 00:00:00</span><span id="from_edit"></span> ～ <input id="stop_to" type="text" class="datepicker" style="width:20%;" value="" /> 23:59:59</td>
                        </td>
                    </tr>
                </table>
                <div class="err-message" style="text-align:center;margin:5px 0;"></div>
                <div><input type="hidden" id="t_unis_service_id" name="t_unis_service_id" value="<?php echo Func::h($service_info["0"]["t_unis_service_id"]); ?>"></div>
                <div><input type="hidden" id="t_service_stop_history_id" name="t_service_stop_history_id" value=""></div>
                <div><input type="hidden" id="from_change_flag" name="from_change_flag" value=""></div>
                <div style="text-align:center;">
                <button class="bt_pop_save bt_blue" style="margin:0 10px;">保存</button>
                <button class="bt_pop_close" style="margin:0 10px;">閉じる</button>
                </div>
            </div>
            <!-- /ユニット -->
        </div>
        <!-- ポップアップ -->

        <!-- ポップアップ -->
        <div id="pop_release" class="panel-pop" style="padding-top:25px;">
            <div class="panel-title">強制解除</div>
            <!-- ユニット -->
            <div class="unit" style="padding:10px 20px 10px 20px;">
                <div id="msg_release" style="font-size:14px;text-align:center;"></div>
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
        <div id="pop_cancel" class="panel-pop" style="padding-top:25px;">
            <div class="panel-title">キャンセル</div>
            <!-- ユニット -->
            <div class="unit" style="padding:10px 20px 10px 20px;">
                <div id="msg_cancel" style="font-size:14px;text-align:center;"></div>
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
        <div id="pop_unlock" class="panel-pop" style="padding-top:25px;">
            <div class="panel-title">強制開錠</div>
            <!-- ユニット -->
            <div class="unit" style="padding:10px 20px 10px 20px;">
                <div id="msg_unlock" style="font-size:14px;text-align:center;"></div>
                <div class="pop_message" style="text-align:center;margin:2px 0;height:20px;color:red;"></div>
                <div style="text-align:center;">
                    <button class="bt_pop_save bt_blue" style="margin:0 10px;">OK</button>
                    <button class="bt_pop_close" style="margin:0 10px;">閉じる</button>
                </div>
            </div>
            <!-- /ユニット -->
        </div>
        <!-- ポップアップ -->

        <form id="fr_back" action="/account/detail" method="POST">
            <input type="hidden" name="type" value="search" />
            <input type="hidden" name="cust_cd" value="<?php echo $cust_cd; ?>" />
            <input type="hidden" name="name" value="<?php echo Func::h($name); ?>" />
            <input type="hidden" name="tel" value="<?php echo $tel; ?>" />
            <input type="hidden" name="login_id" value="<?php echo $login_id; ?>" />
            <input type="hidden" name="mail_address" value="<?php echo $mail_address; ?>" />
            <input type="hidden" name="service" value="<?php echo $service; ?>" />
            <input type="hidden" name="account_id" value="<?php echo $this->RequestPost["account_id"]; ?>" />
            <input type="hidden" name="t_unis_cust_id" value="<?php echo Func::h($account_info["t_unis_cust_id"]); ?>" />
            <input type="hidden" name="transition" value="<?php echo $transition; ?>" />
            <input type="hidden" name="organization_code" value="<?php echo $organization_code; ?>" />
        </form>

    </div><!-- /メインパネル -->

</div><!-- /メイン -->
<?php
include(TPL_DIR . DS . "common" . DS . "footer.tpl");
