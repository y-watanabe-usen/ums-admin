<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<script type="text/javascript">
//<![CDATA[

(function ($) {
    $.fn.bottom = function (options) {
        var defaults = {
            // how close to the scrollbar is to the bottom before triggering the event
            proximity: 0
        };
        var options = $.extend(defaults, options);
        return this.each(function () {
            var obj = this;
            $(obj).bind("scroll", function () {
                if (obj == window) {
                    scrollHeight = $(document).height();
                }
                else {
                    scrollHeight = $(obj)[0].scrollHeight;
                }
                scrollPosition = $(obj).height() + $(obj).scrollTop();
                if ((scrollHeight - scrollPosition) / scrollHeight <= options.proximity) {
                    $(obj).trigger("bottom");
                }
            });
            return false;
        });
    };
})(jQuery);

(function($) {
    $(function() {
        $(".datepicker").datepicker();

        //検索ボタン
        var page = 1;
        var searchFlag = 0;
        var login_id = "";
        var market_id = "";
        var start_from = "";
        var start_to = "";
        var init_from = "";
        var init_to = "";
        $("#bt_search").click(function () {
            $('#search_table tr').remove();
            page = 1;
            searchFlag = 0;
            login_id = $('#login_id').val();
            market_id = $('#market_id').val();
            start_from = $('#start_from').val();
            start_to = $('#start_to').val();
            init_from = $('#init_from').val();
            init_to = $('#init_to').val();

            $("#search_cnt").html("読み込み中...").css("color", "#000");
            get_data(page, login_id, market_id, start_from, start_to, init_from, init_to);
            page++;
        });

        $("#search_table_div").bottom();
        $("#search_table_div").on("bottom", function () {
            get_data(page, login_id, market_id, start_from, start_to, init_from, init_to);
            page++;
        });

        //検索データ取得
        function get_data(page, login_id, market_id, start_from, start_to, init_from, init_to) {
            <?php
            //停止権限がある場合
            if ($this->Acl->check($this->Auth->user("role_id"), "/dedicated/demo_stop_data")) {
                $stop = "<button class='bt_mini bt_stop' style='width:50px;'>停止</button>";
            //ない場合（ボタン非活性）
            } else {
                $stop = "<button class='bt_mini bt_stop' disabled style='width:50px;'>停止</button>";
            }
            ?>
            if (searchFlag == 0) {
                searchFlag = 1;
                $.ajax({
                    type: 'POST',
                    url: '/dedicated/demo_get_data',
                    cache: false,
                    datatype: 'json',
                    data: {
                        page: page,
                        login_id: login_id,
                        market_id: market_id,
                        start_from: start_from,
                        start_to: start_to,
                        init_from: init_from,
                        init_to: init_to},
                    success: function (json) {
                        if (json.result_cd == 0) {
                            if (json.search_cnt) {
                                if (json.search_cnt == 10001) {
                                    $("#search_cnt").html("10000件を超えました。").css("color", "red");
                                } else {
                                    $("#search_cnt").html(json.search_cnt + "件").css("color", "#000");
                                }
                            }
                            if (json.search_data) {
                                if (json.length == <?php echo $this->search_limit; ?>)
                                    searchFlag = 0;
                            }

                            $(json.search_data).each(function () {
                                var res_start_date = "";
                                var res_end_date = "";
                                var stop_button = "";
                                var grayout = "";
                                if (this.start_date !== null) {
                                    res_start_date = this.start_date;
                                }
                                if (this.end_date !== null) {
                                    res_end_date = this.end_date;
                                }
                                if (this.valid_account == "1") {
                                    stop_button = "<td class='s_info_center'><?php echo $stop; ?></td>";
                                } else {
                                    stop_button = "<td class='s_info_center grayout'></td>";
                                    grayout = " grayout";
                                }
                                tmp = this;
                                var res_init_auth_datetime = [];
                                $(json.m_service_cds).each(function() {
                                    eval('res_init_auth_datetime.push((tmp.init_auth_datetime_' + this + ' !== null) ? tmp.init_auth_datetime_' + this + ' : "");');
                                });
                                put = "<tr>";
                                put += "<td class='" + grayout +"'>" + this.id + "</td>";
                                put += "<td class='" + grayout +"'>" + this.login_id + "</td>";
                                put += "<td class='s_info_center" + grayout +"'>" + this.market_name + "</td>";
                                put += "<td class='s_info_center" + grayout +"'>" + res_start_date + "</td>";
                                res_init_auth_datetime.forEach(function(val, index, arr) {
                                  put += "<td class='s_info_center" + grayout +"'>" + val + "</td>";
                                });
                                put += "<td class='s_info_center" + grayout +"'>" + res_end_date + "</td>";
                                put += stop_button;
                                put += "</tr>";
                                $("#search_table").append(put);
                            });
                        } else {
                            $("#error_message").html(json.error_message).css("color", "red");
                            $("#search_cnt").html("").css("color", "#000");
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (XMLHttpRequest.status == 403 && page == 1) {
                            location.href = '/';
                        }
                        $("#error_message").html("通信エラーが発生しました。").css("color", "red");
                        $("#search_cnt").html("").css("color", "#000");
                    }
                });
            }
        }

        //停止ボタン
        $("#search_table").on("click", ".bt_stop", function () {
            $(".pop_message", "#pop_stop").html("");
            $(".bt_pop_save", "#pop_stop").show();
            var account_id = $(this).parent().parent().children("td:first").text();
            var row = $(this).closest('tr').index();
            $("#account_id").val(account_id);
            $("#row").val(row);
            var l = ($(".main-panel").width() - 600) / 2;
            $.blockUI({
                message: $("#pop_stop"),
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

        //OKボタン押下時
        $("#pop_stop").on("click", ".bt_pop_save", function() {
            $(this).hide();
            var account_id = $("#account_id").val();
            var row = $("#row").val();
            $.ajax({
                type: 'POST',
                url: '/dedicated/demo_stop_data',
                cache: false,
                datatype: 'json',
                data: {account_id: account_id},
                success: function (json) {
                    if (json.result_cd == 0) {
                        $('#search_table tr:eq('+ row +') td:eq(6)').text(json.result_date);
                        $('#search_table tr:eq('+ row +') td:eq(7)').text("");
                        $('#search_table tr:eq('+ row +') td').addClass("grayout");
                        $(".pop_message", "#pop_stop").html("停止しました。");
                    } else {
                        $("#pop_message").html(json.error_message).css("color", "red");
                        $(".pop_message", "#pop_stop").html(json.error_message);
                    }
                },
                error: function() {
                    $(".pop_message", "#pop_stop").html("停止に失敗しました。");
                }
            });

        });

        //クリアボタン
        $("#bt_clear").click(function () {
            $('#login_id').val("");
            $('#market_id').val("");
            $('#start_from').val("");
            $('#start_to').val("");
            $('#init_from').val("");
            $('#init_to').val("");
            $("#error_message").html("").css("color", "#000");
        });

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
        <?php include(TPL_DIR . DS . "dedicated" . DS . "sub_menu.tpl"); ?>
        <!-- /left -->

        <!-- right -->
        <div style="width:auto;height:100%;box-sizing: border-box;-moz-box-sizing: border-box;margin:0;padding-top:28px;overflow:hidden;">
            <div class="main-title" style="left:210px;">デモアカウント検索</div>

            <!-- パネル2 -->
            <div class="panel-base" style="height:100%;width:100%;overflow:hidden;">
                <div class="panel">

                    <!-- ユニット -->
                    <div class="unit" style="padding:5px 20px 10px 20px;height:100%;">
                        <table style="width:100%;">
                            <tr>
                                <td style="width: 120px; text-align: left;">ログインID(完全一致)</td>
                                <td style="width: 200px;"><input id="login_id" type="text" style="width:120px;"></td>
                                <td style="width: 50px; text-align: left;">販路</td>
                                <td style="width: 250px;">
                                <select id="market_id" name="marcket">
                                    <option value="">---</option>
                                <?php foreach ($marketList as $val) { ?>
                                    <option value="<?php echo $val["id"]; ?>"><?php echo $val["market_name"]; ?></option>　
                                <?php } ?>
                                </select>
                                </td>
                                <td style="width:150px;"></td>
                            </tr>
                            <tr>
                                <td style="width: 120px; text-align: left;">発行日</td>
                                <td colspan="">
                                    <input id="start_from" type="text" name="start_from" class="datepicker" style="width:80px;" value="">&nbsp;～&nbsp;
                                    <input id="start_to" type="text" name="start_to" class="datepicker" style="width:80px;" value="">
                                </td>
                                <td style="width: 120px; text-align: left;">初回認証日</td>
                                <td colspan="">
                                    <input id="init_from" type="text" name="init_from" class="datepicker" style="width:80px;" value="">&nbsp;～&nbsp;
                                    <input id="init_to" type="text" name="init_to" class="datepicker" style="width:80px;" value="">
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <button id="bt_search" class="bt_green">検索</button>
                                    <button id="bt_clear" class="bt_clear">クリア</button>
                                </td>
                            </tr>
                        </table>
                        <div id="p2" class="unit" style="padding:20px 0px 10px 0px;">

                            <table style="width: 95%; padding:0;margin:0;position:absolute;top:6px;">
                                <tr>
                                    <td style="width:10px;"></td>
                                    <td id="error_message" style=""></td>
                                </tr>
                                <tr>
                                    <td style="width:10px;"></td>
                                    <td id="search_cnt" style=""></td>
                                </tr>
                            </table>

                            <?php $serviceCount = count($serviceList); ?>
                            <div class="unit" style="padding: 5px 0 0 0;">
                                <table class="nogrid_table">
                                    <colgroup>
                                        <col style="width:50px;">
                                        <col style="width:50px;">
                                        <col style="width:70px;">
                                        <col style="width:60px;">
                                        <?php foreach ($serviceList as $key => $value) { ?>
                                          <col style="width:80px;">
                                        <?php } ?>
                                        <col style="width:60px;">
                                        <col style="width:40px;">
                                    </colgroup>
                                    <tr>
                                        <th rowspan="<?php echo Func::h($serviceCount); ?>">アカウントID</th>
                                        <th rowspan="<?php echo Func::h($serviceCount); ?>">ログインID</th>
                                        <th rowspan="<?php echo Func::h($serviceCount); ?>">販路</th>
                                        <th rowspan="<?php echo Func::h($serviceCount); ?>">発行日</th>
                                        <th colspan="<?php echo Func::h($serviceCount); ?>">初回認証日時</th>
                                        <th rowspan="<?php echo Func::h($serviceCount); ?>">失効日</th>
                                        <th rowspan="<?php echo Func::h($serviceCount); ?>"></th>
                                    </tr>
                                    <tr>
                                        <?php foreach ($serviceList as $key => $value) { ?>
                                        <th><?php echo Func::h($value["service_name"]); ?></th>
                                        <?php } ?>
                                    </tr>
                                </table>
                                <div id="search_table_div" style="height: 80%; overflow-y: scroll; overflow-x: hidden;">
                                    <table id="search_table" class="nogrid_table">
                                        <colgroup>
                                         <col style="width:52px;">
                                         <col style="width:51px;">
                                         <col style="width:72px;">
                                         <col style="width:63px;">
                                         <?php foreach ($serviceList as $key => $value) { ?>
                                           <col style="width:82px;">
                                         <?php } ?>
                                         <col style="width:64px;">
                                         <col style="width:30px;">
                                        </colgroup>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- /ユニット -->

                </div>
            </div>
            <!-- /パネル2 -->

            <!-- ポップアップ -->
            <div id="pop_stop" class="panel-pop" style="padding-top:25px;">
                <div class="panel-title">停止</div>
                <!-- ユニット -->
                <div class="unit" style="padding:10px 20px 10px 20px;">
                    <div id="msg_release" style="font-size:14px;text-align:center;">停止しますか？</div>
                    <div class="pop_message" style="text-align:center;margin:5px 0;color:red;"></div>
                    <div><input type="hidden" id="account_id" name="account_id" value=""></div>
                    <div><input type="hidden" id="row" name="row" value=""></div>
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
