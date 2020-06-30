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

            //マルチセレクト設定
            $("#multiSelect").multiselect({
                selectedList: 7,
                checkAllText: "全選択",
                uncheckAllText: "選択解除",
                noneSelectedText: "未選択",
                selectedText: "#つ選択中",
                minWidth: 500,
                classes: 'multiselect'
            });
            $("#multiSelect").multiselectfilter({
                width:150
            });

            //高さ調整
            $("#p0").usenautoheight({
                panel: [
                    {"id": "#p1", "height": "40"},
                    {"id": "#p2", "height": "*"}]
            });

            //支店情報取得
            function get_multiSelect() {
                var organization_code = new Array;
                var multiSelect = $("#multiSelect option:selected");
                for (i = 0, len = multiSelect.length; i < len; i++) {
                    organization_code.push(multiSelect[i].value);
                }
                return organization_code;
            }

            //検索ボタン
            var not_arrived_page = 1;
            var conf_prospects_page = 1;
            var not_arrived_searchFlag = 0;
            var conf_prospects_searchFlag = 0;
            var organization_code = new Array;
            $("#bt_search").click(function () {
                $('#not_arrived_search_table tr').remove();
                $('#prospects_search_table tr').remove();
                $("#not_arrived_cont").html("");
                $("#prospects_cont").html("");
                $("#not_arrived_download_msg").html("");
                $("#not_prospects_msg").html("");
                $("#multi_select_msg").html("");
                $("#bt_not_arrived_download").hide();
                $("#bt_prospects_download").hide();
                not_arrived_page = 1;
                conf_prospects_page = 1;
                not_arrived_searchFlag = 0;
                conf_prospects_searchFlag = 0;
                organization_code = new Array;
                if (get_multiSelect().length > 0) {
                    organization_code = get_multiSelect();
                    $("#not_arrived_cont").html("読み込み中...").css("color", "#000");
                    $("#prospects_cont").html("読み込み中...").css("color", "#000");
                    get_not_arrived_data(not_arrived_page, organization_code);
                    get_conf_prospects_date(conf_prospects_page, organization_code);
                    not_arrived_page++;
                    conf_prospects_page++;
                } else {
                    $("#multi_select_msg").html("支店を選択してください。").css("color", "red");
                }

            });

            //未着顧客一覧自動検索
            $("#not_arrived_search_table_div").bottom();
            $("#not_arrived_search_table_div").on("bottom", function () {
                get_not_arrived_data(not_arrived_page, organization_code);
                not_arrived_page++;
            });
            //UNIS確定見込顧客一覧自動検索
            $("#prospects_search_table_div").bottom();
            $("#prospects_search_table_div").on("bottom", function () {
                get_conf_prospects_date(conf_prospects_page, organization_code);
                conf_prospects_page++;
            });

            //未着顧客一覧データ取得
            function get_not_arrived_data(page, organization_code) {
                if (not_arrived_searchFlag == 0) {
                    not_arrived_searchFlag = 1;
                    $.ajax({
                        type: 'POST',
                        url: '/branch/get_not_arrived_data',
                        cache: false,
                        datatype: 'json',
                        data: {
                            page: page,
                            organization_code: organization_code},
                        success: function (json) {
                            if (json.search_cnt) {
                                if (json.search_cnt == 10001) {
                                    $("#bt_not_arrived_download").show();
                                    $("#not_arrived_cont").html("10000件を超えました。").css("color", "red");
                                } else {
                                    if (json.search_cnt != 0) {
                                        $("#bt_not_arrived_download").show();
                                    }
                                    $("#not_arrived_cont").text(json.search_cnt + "件").css("color", "#000");
                                }
                            }
                            if (json.search_data) {
                                if (json.length == <?php echo $this->search_limit; ?>)
                                    not_arrived_searchFlag = 0;
                            }
                            $(json.search_data).each(function () {
                                put = "<tr>";
                                put += "<td>" + this.branch_name + "</td>";
                                put += "<td>" + this.cust_cd + "</td>";
                                put += "<td>" + this.issue_date + "</td>";
                                put += "<td>" + this.not_arrived_date + "</td>";
                                put += "<td>" + this.name + "</td>";
                                put += "<td>" + this.street + "</td>";
                                put += "<td class=\"s_info_center\"><button class=\"bt_mini bt_detail\" style=\"width:50px;\" name=\"" + this.t_unis_cust_id + "\">詳細</button></td>";
                                put += "</tr>";
                                $("#not_arrived_search_table").append(put);
                            });
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            if (XMLHttpRequest.status == 403 && page == 1) {
                                location.href = '/branch/';
                            }
                            $("#not_arrived_cont").html("通信エラーが発生しました。").css("color", "red");
                        }
                    });
                }
            }

            //UNIS確定見込顧客一覧データ取得
            function get_conf_prospects_date(page, organization_code) {
                if (conf_prospects_searchFlag == 0) {
                    conf_prospects_searchFlag = 1;
                    $.ajax({
                        type: 'POST',
                        url: '/branch/get_conf_prospects_data',
                        cache: false,
                        datatype: 'json',
                        data: {
                            page: page,
                            organization_code: organization_code},
                        success: function (json) {
                            if (json.search_cnt) {
                                if (json.search_cnt == 10001) {
                                    $("#bt_prospects_download").show();
                                    $("#prospects_cont").html("10000件を超えました。").css("color", "red");
                                } else {
                                    if (json.search_cnt != 0) {
                                        $("#bt_prospects_download").show();
                                    }
                                    $("#prospects_cont").html(json.search_cnt + "件").css("color", "#000");
                                }
                            }
                            if (json.search_data) {
                                if (json.length == <?php echo $this->search_limit; ?>)
                                    conf_prospects_searchFlag = 0;
                            }

                            $(json.search_data).each(function () {
                                put = "<tr>";
                                put += "<td>" + this.branch_name + "</td>";
                                put += "<td>" + this.cust_cd + "</td>";
                                put += "<td>" + this.name + "</td>";
                                put += "<td>" + this.cont_no + "</td>";
                                put += "<td>" + this.detail_no + "</td>";
                                put += "<td>" + this.item_cd + "</td>";
                                put += "<td>" + this.item_name + "</td>";
                                put += "<td>" + this.init_auth_datetime + "</td>";
                                put += "</tr>";
                                $("#prospects_search_table").append(put);
                            });
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            if (XMLHttpRequest.status == 403 && page == 1) {
                                location.href = '/branch/';
                            }
                            $("#prospects_cont").html("通信エラーが発生しました。").css("color", "red");
                        }
                    });
                }
            }

            //一覧画面へ遷移
            $("#not_arrived_search_table").on("click", ".bt_detail", function () {
                organization_code = new Array;
                if (get_multiSelect().length > 0) {
                    organization_code = get_multiSelect();
                }
                $('#fr_list input[name="organization_code"]').val(organization_code);
                $('#fr_list input[name="t_unis_cust_id"]').val($(this).attr("name"));
                $("#fr_list").submit();
            });
            //ダウンロードボタン
            $("#bt_not_arrived_download").click(function () {
                organization_code = new Array;
                var organization_code_list = "";
                if (get_multiSelect().length > 0) {
                    organization_code = get_multiSelect();
                }
                $('#fr_not_arrived_dl input[name="organization_code"]').val(organization_code);
                $("#fr_not_arrived_dl").submit();
            });
            //ダウンロードボタン
            $("#bt_prospects_download").click(function () {
                organization_code = new Array;
                if (get_multiSelect().length > 0) {
                    organization_code = get_multiSelect();
                }
                $('#fr_conf_prospects_dl input[name="organization_code"]').val(organization_code);
                $("#fr_conf_prospects_dl").submit();
            });

            //クリアボタン
            $("#bt_clear").click(function () {
                $("#multiSelect").multiselect("uncheckAll");
                $("#not_arrived_download_msg").html("");
                $("#not_prospects_msg").html("");
                $("#multi_select_msg").html("");
            });

            $("#bt_not_arrived_download").hide();
            $("#bt_prospects_download").hide();
            if (get_multiSelect().length > 0) {
                organization_code = get_multiSelect();
                get_not_arrived_data(not_arrived_page, organization_code);
                get_conf_prospects_date(conf_prospects_page, organization_code);
                not_arrived_page++;
                conf_prospects_page++;
            }

        });
    })(jQuery);
//]]>
</script>

<style>
.ui-multiselect {
    height:25px;
    overflow-x:hidden;
    padding:2px 0 2px 4px;
    text-align:left;
    font-size: 11px;
}
.multiselect {font-size: 11px;}
ul li {list-style: none none;}
</style>

<!-- メイン -->
<div class="main">

    <!-- メインパネル -->
    <div class="main-panel">
        <div class="main-title"><?php echo $titleName; ?></div>

        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:auto;">
            <div class="panel" style="padding-top:5px;">
                <div id="p1" class="unit" style="padding:0px 20px 0px 20px;">
                    <table style="width:100%;">
                        <tr>
                            <td style="width: 100px; text-align: left;">支店検索</td>
                            <td style="width: 500px; text-align: left;">
                            <select id="multiSelect" multiple="multiple" size="7">
                                <?php foreach ($organization_list as $val) { ?>
                                    <?php
                                        $selected = "";
                                        foreach ($o_code_list as $o_code) {
                                            if ($o_code === $val["code"]) {
                                                $selected = " selected ";
                                                break;
                                            }
                                        }
                                    ?>
                                    <option value="<?php echo $val["code"]; ?>"<?php echo $selected ; ?>><?php echo $val["organization_name"]; ?></option>　
                                <?php } ?>
                            </select>
                            </td>
                            <td style="width: 200px; text-align: light;">
                                <button id="bt_search" class="bt_green">検索</button>
                                <button id="bt_clear" class="bt_clear">クリア</button>
                            </td>
                            <td style="width:100px;"></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><span id="multi_select_msg" style="font-weight: normal; font-size: 11px;"></span></td>
                            <td></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <!-- パネル -->

        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:50%;">
            <div class="panel" style="padding-top:25px;">
                <form id="fr_not_arrived_dl" action="/branch/download_not_arrived_data" method="POST">
                    <input type="hidden" name="type" value="download" />
                    <input type="hidden" name="organization_code" value="" />
                </form>
                <div class="panel-title">
                <table style="width:98%;">
                    <tr>
                        <td style="width:50%; text-align:left;">未着顧客一覧</td>
                        <td style="width:40%; text-align:right;"><span id="not_arrived_download_msg" style="font-weight: normal; font-size: 11px;"><?php echo $msg = !empty($msg) ? $msg : ""; ?></span></td>
                        <td style="width:8%; text-align:right;">
                        <?php
                            if ($this->Acl->check($this->Auth->user("role_id"), "/branch/download_not_arrived_data")) {
                                echo '<button id="bt_not_arrived_download" class="bt_mini">ダウンロード</button>';
                            }
                        ?>
                        </td>
                    </tr>
                </table>
                </div>
                <div class="unit" style="padding:10px 10px 10px 10px;">
                    <div id="not_arrived_cont" style="height:15px; font-weight: normal; font-size: 11px;"></div>
                    <table class="nogrid_table">
                        <colgroup>
                            <col style="width:10%;">
                            <col style="width:10%;">
                            <col style="width:9%;">
                            <col style="width:9%;">
                            <col style="width:20%;">
                            <col style="width:34%;">
                            <col style="width:7%;">
                            <col style="width:1%;">
                        </colgroup>
                        <tr>
                            <th>支店名</th>
                            <th>顧客CD</th>
                            <th>発送日</th>
                            <th>未着日</th>
                            <th>送付先名称</th>
                            <th>送付先住所</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </table>
                    <div id="not_arrived_search_table_div" style="height: 90%; overflow-y: scroll; overflow-x: hidden;">
                        <table id="not_arrived_search_table" class="nogrid_table">
                            <colgroup>
                                <col style="width:10%;">
                                <col style="width:10%;">
                                <col style="width:9%;">
                                <col style="width:9%;">
                                <col style="width:20%;">
                                <col style="width:34%;">
                                <col style="width:7%;">
                                <col style="width:1%;">
                            </colgroup>
                        </table>
                    </div>
                </div>
                <form id="fr_list" action="/account/account_list" method="POST">
                    <input type="hidden" name="t_unis_cust_id" value="" />
                    <input type="hidden" name="cust_cd" value="" />
                    <input type="hidden" name="name" value="" />
                    <input type="hidden" name="tel" value="" />
                    <input type="hidden" name="login_id" value="" />
                    <input type="hidden" name="mail_address" value="" />
                    <input type="hidden" name="service" value="" />
                    <input type="hidden" name="organization_code" value="" />
                    <input type="hidden" name="transition" value="branch" />
                </form>
            </div>
        </div>
        <!-- /パネル -->

        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:50%;">
            <div class="panel" style="padding-top:25px;">
                <form id="fr_conf_prospects_dl" action="/branch/download_conf_prospects_data" method="POST">
                    <input type="hidden" name="type" value="download" />
                    <input type="hidden" name="organization_code" value="" />
                </form>
                <div class="panel-title">
                <table style="width:98%;">
                    <tr>
                        <td style="width:50%; text-align:left;">UNIS 連携サービス 確定可能顧客一覧</td>
                        <td style="width:40%; text-align:right;"><span id="not_prospects_msg" style="font-weight: normal; font-size: 11px;"><?php echo $msg = !empty($msg) ? $msg : ""; ?></span></td>
                        <td style="width:8%; text-align:right;">
                        <?php
                            if ($this->Acl->check($this->Auth->user("role_id"), "/branch/download_conf_prospects_data")) {
                                echo '<button id="bt_prospects_download" class="bt_mini">ダウンロード</button>';
                            }
                        ?>
                        </td>
                    </tr>
                </table>
                </div>

                <div class="unit" style="padding:10px 10px 10px 10px;">
                    <div id="prospects_cont" style="height:15px; font-weight: normal; font-size: 11px;"></div>
                    <table id="account_table" class="nogrid_table">
                        <colgroup>
                            <col style="width:10%;">
                            <col style="width:10%;">
                            <col style="width:22%;">
                            <col style="width:6%;">
                            <col style="width:6%;">
                            <col style="width:15%;">
                            <col style="width:15%;">
                            <col style="width:15%;">
                            <col style="width:1%;">
                        </colgroup>
                        <tr>
                            <th>支店名</th>
                            <th>顧客CD</th>
                            <th>設置先名称</th>
                            <th>契約No</th>
                            <th>契約明細No</th>
                            <th>契約品目CD</th>
                            <th>契約品目名称</th>
                            <th>初回認証日時</th>
                            <th></th>
                        </tr>
                    </table>
                    <div id="prospects_search_table_div" style="height: 90%; overflow-y: scroll; overflow-x: hidden;">
                        <table id="prospects_search_table" class="nogrid_table">
                            <colgroup>
                                <col style="width:10%;">
                                <col style="width:10%;">
                                <col style="width:23%;">
                                <col style="width:6%;">
                                <col style="width:6%;">
                                <col style="width:15%;">
                                <col style="width:15%;">
                                <col style="width:15%;">
                            </colgroup>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!-- /パネル -->

    </div><!-- /メインパネル -->

</div><!-- /main -->
<?php include(TPL_DIR . DS . "common" . DS . "footer.tpl"); ?>
