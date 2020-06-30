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

    (function ($) {
        $(function () {
            //高さ調整
            $("#p0").usenautoheight({
                panel: [
                    {"id": "#p1", "height": "100"},
                    {"id": "#p2", "height": "*"}]
            });
            //検索ボタン
            var page = 1;
            var searchFlag = 0;
            var cust_cd = "";
            var name = "";
            var tel = "";
            var login_id = "";
            var mail_address = "";
            var from_date = "";
            var to_date = "";
            var chain_cd = "";
            var service = new Array;
            $("#bt_search").click(function () {
                $('#search_table tr').remove();
                page = 1;
                searchFlag = 0;
                cust_cd = $('#cust_cd').val();
                name = $('#name').val();
                tel = $('#tel').val();
                login_id = $('#login_id').val();
                mail_address = $('#mail_address').val();
                from_date = $('#from_date').val();
                to_date = $('#to_date').val();
                chain_cd = $('#chain_cd').val();
                service = new Array;
                $.each($("#service input"), function (i, row) {
                    if ($(row).prop('checked')) {
                        service.push($(row).val());
                    }
                });

                $("#search_cnt").html("読み込み中...").css("color", "#000");
                get_data(page, cust_cd, name, tel, login_id, mail_address, service, from_date, to_date, chain_cd);
                page++;
            });

            $("#search_table_div").bottom();
            $("#search_table_div").on("bottom", function () {
                get_data(page, cust_cd, name, tel, login_id, mail_address, service, from_date, to_date, chain_cd);
                page++;
            });

            //検索データ取得
            function get_data(page, cust_cd, name, tel, login_id, mail_address, service, from_date, to_date, chain_cd) {
                if (searchFlag == 0) {
                    searchFlag = 1;
                    $.ajax({
                        type: 'POST',
                        url: '/account/get_data',
                        cache: false,
                        datatype: 'json',
                        data: {
                            page: page,
                            cust_cd: cust_cd,
                            name: name,
                            tel: tel,
                            login_id: login_id,
                            mail_address: mail_address,
                            from_date: from_date,
                            to_date: to_date,
                            chain_cd: chain_cd,
                            service: service},
                        success: function (json) {
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

                            var put, before_rowspan = 1;
                            $(json.search_data).each(function () {
                                put = "<tr>";
                                if (this.rowspan > before_rowspan) {
                                    put += "<td rowspan=\"" + this.rowspan + "\">" + this.cust_cd + "</td>";
                                    put += "<td rowspan=\"" + this.rowspan + "\">" + this.name + "</td>";
                                    put += "<td rowspan=\"" + this.rowspan + "\">" + this.tel + "</td>";
                                    put += "<td>" + this.login_id + "</td>";
                                    put += "<td>" + this.mail_address + "</td>";
                                    put += "<td>" + this.start_date + "</td>";
                                    put += "<td>" + this.end_date + "</td>";
                                    put += "<td class=\"s_info_center\" rowspan=\"" + this.rowspan + "\"><button class=\"bt_mini bt_detail\" style=\"width:50px;\" name=\"" + this.t_unis_cust_id + "\">詳細</button></td>";
                                } else if (this.rowspan == before_rowspan) {
                                    put += "<td>" + this.cust_cd + "</td>";
                                    put += "<td>" + this.name + "</td>";
                                    put += "<td>" + this.tel + "</td>";
                                    put += "<td>" + this.login_id + "</td>";
                                    put += "<td>" + this.mail_address + "</td>";
                                    put += "<td>" + this.start_date + "</td>";
                                    put += "<td>" + this.end_date + "</td>";
                                    put += "<td class=\"s_info_center\"><button class=\"bt_mini bt_detail\" style=\"width:50px;\" name=\"" + this.t_unis_cust_id + "\">詳細</button></td>";
                                } else if (this.rowspan < before_rowspan) {
                                    put += "<td>" + this.login_id + "</td>";
                                    put += "<td>" + this.mail_address + "</td>";
                                    put += "<td>" + this.start_date + "</td>";
                                    put += "<td>" + this.end_date + "</td>";
                                }
                                before_rowspan = this.rowspan;
                                put += "</tr>";
                                $("#search_table").append(put);
                            });


                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            if (XMLHttpRequest.status == 403 && page == 1) {
                                location.href = '/';
                            }
                            $("#search_cnt").html("通信エラーが発生しました。").css("color", "red");
                        }
                    });
                }
            }
            //一覧画面へ遷移
            $("#search_table").on("click", ".bt_detail", function () {
                $('#fr_list input[name="t_unis_cust_id"]').val($(this).attr("name"));
                $('#fr_list input[name="cust_cd"]').val(cust_cd);
                $('#fr_list input[name="name"]').val(name);
                $('#fr_list input[name="tel"]').val(tel);
                $('#fr_list input[name="login_id"]').val(login_id);
                $('#fr_list input[name="mail_address"]').val(mail_address);
                $('#fr_list input[name="service"]').val(service);
                $('#fr_list input[name="from_date"]').val(from_date);
                $('#fr_list input[name="to_date"]').val(to_date);
                $('#fr_list input[name="chain_cd"]').val(chain_cd);
                $("#fr_list").submit();
            });
            //クリアボタン
            $("#bt_clear").click(function () {
                $('#cust_cd').val("");
                $('#name').val("");
                $('#tel').val("");
                $('#login_id').val("");
                $('#mail_address').val("");
                $('#from_date').val("");
                $('#to_date').val("");
                $('#chain_cd').val("");
                $.each($('input[type=checkbox]', '#service'), function () {
                    $(this).attr("checked", false);
                });
            });
//            $.blockUI({
//                focusInput: false,
//                onBlock: function() { $(".datepicker").datepicker(); },
//                css: {
//                    width:"600px",
//                    height: "200px",
//                    top: "100px",
//                    left: l,
//                    textAlign: "left",
//                    border: "0",
//                    background:"none",
//                    cursor: "default",
//                    borderRadius: "3px"}
//            });
$(".datepicker").datepicker();

<?php if (isset($search_info["type"]) && $search_info["type"] == "search") { ?>
                //詳細画面からの戻り
                $('#cust_cd').val('<?php echo $search_info["cust_cd"]; ?>');
                $('#name').val('<?php echo $search_info["name"]; ?>');
                $('#tel').val('<?php echo $search_info["tel"]; ?>');
                $('#login_id').val('<?php echo $search_info["login_id"]; ?>');
                $('#mail_address').val('<?php echo $search_info["mail_address"]; ?>');
                $('#from_date').val('<?php echo $search_info["from_date"]; ?>');
                $('#to_date').val('<?php echo $search_info["to_date"]; ?>');
                $('#chain_cd').val('<?php echo $search_info["chain_cd"]; ?>');
    <?php foreach (explode(',', $search_info["service"]) as $val) { ?>
                    $('#service input[value="<?php echo $val; ?>"]').attr("checked", true);
    <?php } ?>
                $('#bt_search').trigger("click");
<?php } ?>
        });
    })(jQuery);
//]]>
</script>

<!-- メイン -->
<div class="main">

    <!-- メインパネル -->
    <div class="main-panel">
        <div class="main-title"><?php echo $titleName; ?></div>

        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:100%;">
            <div id="p0" class="panel">

                <!-- ユニット -->
                <div id="p1" class="unit" style="padding:5px 20px 10px 20px;">
                    <table style="width:100%;">
                        <tr>
                            <td style="width: 100px; text-align: left;">顧客CD(完全一致)</td>
                            <td style="width: 100px;"><input id="cust_cd" type="text" style="width:120px;"></td>
                            <td style="width: 100px; text-align: left;">設置先名称(部分一致)</td>
                            <td style="width: 210px;"><input id="name" type="text" style="width:200px;"></td>
                            <td style="width: 100px; text-align: left;">電話番号(完全一致)</td>
                            <td style="width: 100px;"><input id="tel" type="text" style="width:100px;"></td>
                            <td style="width: 200px;">チェーン店CD(完全一致)&nbsp;&nbsp;&nbsp;&nbsp;<input id="chain_cd" type="text" style="width:80px;"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">ログインID(完全一致)</td>
                            <td style="text-align: left;"><input id="login_id" type="text" style="width:120px;"></td>
                            <td style="text-align: left;">メールアドレス(完全一致)</td>
                            <td style="text-align: left;"><input id="mail_address" type="text" style="width:200px;"></td>
                            <td style="text-align: left;">UMsID開始日</td>
                            <td style="text-align: left;"><input id="from_date" type="text" style="width:100px;" class="datepicker">&nbsp;&nbsp;～</td>
                            <td><input id="to_date" type="text" style="width:100px;" class="datepicker"></td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">利用可能サービス</td>
                            <td colspan=4>
                                <div id="service">
                                    <?php foreach ($service_list as $val) { ?>
                                        <input value="<?php echo $val["service_cd"]; ?>" type="checkbox">　<?php echo $val["service_name"]; ?>　
                                    <?php } ?>
                                </div>
                            </td>
                            <td></td>
                            <td>
                                <button id="bt_search" class="bt_green">検索</button>
                                <button id="bt_clear" class="bt_clear">クリア</button>
                            </td>
                        </tr>
                    </table>

                </div>
                <!-- /ユニット -->

                <!-- ユニット -->
                <div id="p2" class="unit" style="padding:25px 20px 10px 20px;">

                    <table style="width: 95%; padding:0;margin:0;position:absolute;top:6px;">
                        <tr>
                            <td style="width:10px;"></td>
                            <td id="search_cnt" style=""></td>
                        </tr>
                    </table>

                    <div class="unit" style="padding: 5px 0 0 0;">
                        <table class="nogrid_table">
                            <colgroup>
                                <col style="width:6%;">
                                <col style="width:22%;">
                                <col style="width:9%;">
                                <col style="width:15%;">
                                <col style="width:24%;">
                                <col style="width:8%;">
                                <col style="width:8%;">
                                <col style="width:6%;">
                                <col style="width:2%;">
                            </colgroup>
                            <tr>
                                <th>顧客CD</th>
                                <th>設置先名称</th>
                                <th>電話番号</th>
                                <th>ログインID</th>
                                <th>メールアドレス</th>
                                <th>UMsID開始日</th>
                                <th>UMsID失効日</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </table>
                        <div id="search_table_div" style="height: 95%; overflow-y: scroll; overflow-x: hidden;">
                            <table id="search_table" class="nogrid_table">
                                <colgroup>
                                    <col style="width:6%;">
                                    <col style="width:22%;">
                                    <col style="width:9%;">
                                    <col style="width:15%;">
                                    <col style="width:24%;">
                                    <col style="width:8%;">
                                    <col style="width:8%;">
                                    <col style="width:7%;">
                                </colgroup>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- /ユニット -->

                <form id="fr_list" action="/account/account_list" method="POST">
                    <input type="hidden" name="cust_cd" value="" />
                    <input type="hidden" name="name" value="" />
                    <input type="hidden" name="tel" value="" />
                    <input type="hidden" name="login_id" value="" />
                    <input type="hidden" name="mail_address" value="" />
                    <input type="hidden" name="service" value="" />
                    <input type="hidden" name="t_unis_cust_id" value="" />
                    <input type="hidden" name="from_date" value="" />
                    <input type="hidden" name="to_date" value="" />
                    <input type="hidden" name="chain_cd" value="" />
                </form>

            </div>
        </div>
        <!-- /パネル -->

    </div><!-- /メインパネル -->

</div><!-- /main -->
<?php include(TPL_DIR . DS . "common" . DS . "footer.tpl"); ?>
