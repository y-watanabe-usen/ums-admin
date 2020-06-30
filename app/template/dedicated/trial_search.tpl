<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<?php
$inputedFrom = isset($this->RequestPost['from']) ? $this->RequestPost['from'] : '';
$inputedTo = isset($this->RequestPost['to']) ? $this->RequestPost['to'] : '';
$selectedService = isset($this->RequestPost['service']) ? $this->RequestPost['service'] : '100';
$download_cnt = 5000;
?>
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

        $("#bt_last_month").click(function() {
            var date = new Date();
            var from = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            var to = new Date(date.getFullYear(), date.getMonth(), 0);
            $("#from").val(dateFormat(from));
            $("#to").val(dateFormat(to));
            return false;
        });

        $("#bt_this_month").click(function() {
            var date = new Date();
            var from = new Date(date.getFullYear(), date.getMonth(), 1);
            var to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            $("#from").val(dateFormat(from));
            $("#to").val(dateFormat(to));
            return false;
        });

        //検索ボタン
        var page = 1;
        var searchFlag = 0;
        var login_id = "";
        var market_id = "";
        var start_from = "";
        var start_to = "";
        var init_from = "";
        var init_to = "";
        var account_id = "";
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
            account_id = $('#account_id').val();
            $("#error_message").html("").css("color", "#000");
            $("#search_cnt").html("読み込み中...").css("color", "#000");
            get_data(page, login_id, market_id, start_from, start_to, init_from, init_to, account_id);
            clear_download_hidden();
            set_download_hidden();
            page++;
        });

        $("#search_table_div").bottom();
        $("#search_table_div").on("bottom", function () {
            get_data(page, login_id, market_id, start_from, start_to, init_from, init_to, account_id);
            page++;
        });

        //検索データ取得
        function get_data(page, login_id, market_id, start_from, start_to, init_from, init_to, account_id) {
            if (searchFlag == 0) {
                searchFlag = 1;
                $.ajax({
                    type: 'POST',
                    url: '/dedicated/trial_get_data',
                    cache: false,
                    datatype: 'json',
                    data: {
                        page: page,
                        login_id: login_id,
                        market_id: market_id,
                        start_from: start_from,
                        start_to: start_to,
                        init_from: init_from,
                        init_to: init_to,
                        account_id: account_id},
                    success: function (json) {
                        if (json.result_cd == 0) {
                            if (json.search_cnt) {
                                if (json.search_cnt == 10001) {
                                    $("#search_cnt").html("10000件を超えました。").css("color", "red");
                                } else {
                                    $("#search_cnt").html(json.search_cnt + "件").css("color", "#000");
                                }
                                $('input[name="search_cnt"]').val(json.search_cnt);
                            }
                            if (json.search_data) {
                                if (json.length == <?php echo $this->search_limit; ?>)
                                    searchFlag = 0;
                            }

                            $(json.search_data).each(function () {
                                var res_start_date = "";
                                var res_init_auth_datetime = "";
                                var res_end_date = "";
                                if (this.start_date !== null) {
                                    res_start_date = this.start_date;
                                }
                                if (this.init_auth_datetime !== null) {
                                    res_init_auth_datetime = this.init_auth_datetime;
                                }
                                if (this.end_date !== null) {
                                    res_end_date = this.end_date;
                                }
                                put = "<tr>";
                                put += "<td>" + this.id + "</td>";
                                put += "<td>" + this.login_id + "</td>";
                                put += "<td class='s_info_right'>" + this.trial_days + "日</td>";
                                put += "<td class='s_info_center'>" + this.market_name + "</td>";
                                put += "<td class='s_info_center'>" + res_start_date + "</td>";
                                put += "<td class='s_info_center'>" + res_init_auth_datetime + "</td>";
                                put += "<td class='s_info_center'>" + res_end_date + "</td>";
                                put += "<td class='s_info_center'><button class=\"bt_mini bt_detail\" style=\"width:50px;\" name=\"" + this.id + "\">詳細</button></td>";
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

        //結果をダウンロード
        $("#bt_download").click(function() {
            var search_cnt = $('input[name="search_cnt"]').val();
            if (Number(search_cnt) == 0) {
                alert("ダウンロードできるデータがありません。");
            } else if (Number(search_cnt) >= <?php echo $download_cnt; ?>) {
                alert("ダウンロードできる件数は<?php echo $download_cnt; ?>件までです。");
            } else {
                $("#fr_download").submit();
            }

        });

        //詳細画面へ遷移
        $(".nogrid_table").on("click", ".bt_detail", function () {
            $('#fr_detail input[name="account_id"]').val($(this).attr("name"));
            $('#fr_detail input[name="login_id"]').val(login_id);
            $('#fr_detail input[name="market_id"]').val(market_id);
            $('#fr_detail input[name="start_from"]').val(start_from);
            $('#fr_detail input[name="start_to"]').val(start_to);
            $('#fr_detail input[name="init_from"]').val(init_from);
            $('#fr_detail input[name="init_to"]').val(init_to);
            $("#fr_detail").submit();
        });
        //クリアボタン
        $("#bt_clear").click(function () {
            $('#login_id').val("");
            $('#market_id').val("");
            $('#start_from').val("");
            $('#start_to').val("");
            $('#init_from').val("");
            $('#init_to').val("");
            $('#account_id').val("");
            $("#error_message").html("").css("color", "#000");
            clear_download_hidden();
        });

        function dateFormat(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            if (month < 10) { month = '0' + month; }
            if (day < 10) { day = '0' + day; }
            return year + '/' + (month) + '/' + day;
        }

        function set_download_hidden() {
            login_id = $('#login_id').val();
            market_id = $('#market_id').val();
            start_from = $('#start_from').val();
            start_to = $('#start_to').val();
            init_from = $('#init_from').val();
            init_to = $('#init_to').val();
            account_id = $('#account_id').val();

            $('#fr_download input[name="login_id"]').val(login_id);
            $('#fr_download input[name="market_id"]').val(market_id);
            $('#fr_download input[name="start_from"]').val(start_from);
            $('#fr_download input[name="start_to"]').val(start_to);
            $('#fr_download input[name="init_from"]').val(init_from);
            $('#fr_download input[name="init_to"]').val(init_to);
            $('#fr_download input[name="account_id"]').val(account_id);
        }

        function clear_download_hidden() {
            $('#fr_download input[name="login_id"]').val("");
            $('#fr_download input[name="market_id"]').val("");
            $('#fr_download input[name="start_from"]').val("");
            $('#fr_download input[name="start_to"]').val("");
            $('#fr_download input[name="init_from"]').val("");
            $('#fr_download input[name="init_to"]').val("");
            $('#fr_download input[name="account_id"]').val("");
            $('#fr_download input[name="search_cnt"]').val("0");
        }

<?php if (isset($search_info["type"]) && $search_info["type"] == "search") { ?>
                //詳細画面からの戻り
                $('#login_id').val('<?php echo $search_info["login_id"]; ?>');
                $('#market_id').val('<?php echo $search_info["market_id"]; ?>');
                $('#start_from').val('<?php echo $search_info["start_from"]; ?>');
                $('#start_to').val('<?php echo $search_info["start_to"]; ?>');
                $('#init_from').val('<?php echo $search_info["init_from"]; ?>');
                $('#init_to').val('<?php echo $search_info["init_to"]; ?>');
                $('#account_id').val('<?php echo $search_info["account_id"]; ?>');
                $('#bt_search').trigger("click");
<?php } ?>

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
            <div class="main-title" style="left:210px;">お試しアカウント検索</div>

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
                                <td style="width: 120px; text-align: left;">アカウントID(完全一致)</td>
                                <td style="width: 200px;"><input id="account_id" type="text" style="width:120px;"></td>
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
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <button id="bt_download" class="bt_mini" style="margin: 10px 0 1px;">検索結果をダウンロードする</button>
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

                            <div class="unit" style="padding: 5px 0 0 0;">
                                <table class="nogrid_table">
                                    <colgroup>
                                        <col style="width:60px;">
                                        <col style="width:70px;">
                                        <col style="width:40px;">
                                        <col style="width:70px;">
                                        <col style="width:90px;">
                                        <col style="width:90px;">
                                        <col style="width:90px;">
                                        <col style="width:60px;">
                                    </colgroup>
                                    <tr>
                                        <th>アカウントID</th>
                                        <th>ログインID</th>
                                        <th>トライアル日数</th>
                                        <th>販路</th>
                                        <th>発行日</th>
                                        <th>初回認証日時</th>
                                        <th>失効日</th>
                                        <th></th>
                                    </tr>
                                </table>
                                <div id="search_table_div" style="height: 80%; overflow-y: scroll; overflow-x: hidden;">
                                    <table id="search_table" class="nogrid_table">
                                        <colgroup>
                                         <col style="width:62px;">
                                         <col style="width:72px;">
                                         <col style="width:42px;">
                                         <col style="width:72px;">
                                         <col style="width:92px;">
                                         <col style="width:92px;">
                                         <col style="width:92px;">
                                         <col style="width:58px;">
                                        </colgroup>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- /ユニット -->

                    <form id="fr_detail" action="/dedicated/trial_detail" method="POST">
                        <input type="hidden" name="account_id" value="" />
                        <input type="hidden" name="login_id" value="" />
                        <input type="hidden" name="market_id" value="" />
                        <input type="hidden" name="start_from" value="" />
                        <input type="hidden" name="start_to" value="" />
                        <input type="hidden" name="init_from" value="" />
                        <input type="hidden" name="init_to" value="" />
                    </form>

                    <form id="fr_download" action="/dedicated/trial_list_download" method="POST">
                        <input type="hidden" name="account_id" value="" />
                        <input type="hidden" name="login_id" value="" />
                        <input type="hidden" name="market_id" value="" />
                        <input type="hidden" name="start_from" value="" />
                        <input type="hidden" name="start_to" value="" />
                        <input type="hidden" name="init_from" value="" />
                        <input type="hidden" name="init_to" value="" />
                        <input type="hidden" name="search_cnt" value="0" />
                    </form>

                </div>
            </div>
            <!-- /パネル2 -->

        </div>
        <!-- /right -->
    </div><!-- /メインパネル -->
</div><!-- /main -->
