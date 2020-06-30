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

        //検索ボタン
        var page = 1;
        var searchFlag = 0;
        var code = "";
        var organization_name = "";
        $("#bt_search").click(function () {
            $('#search_table tr').remove();
            page = 1;
            searchFlag = 0;
            code = $('#code').val();
            organization_name = $('#organization_name').val();
            $("#error_message").html("").css("color", "#000");
            $("#search_cnt").html("読み込み中...").css("color", "#000");
            get_data(page, code, organization_name);
            page++;
        });

        $("#search_table_div").bottom();
        $("#search_table_div").on("bottom", function () {
            get_data(page, code, organization_name);
            page++;
        });

        //検索データ取得
        function get_data(page, code, organization_name) {
            if (searchFlag == 0) {
                searchFlag = 1;
                $.ajax({
                    type: 'POST',
                    url: '/role/organization_get_data',
                    cache: false,
                    datatype: 'json',
                    data: {
                        page: page,
                        code: code,
                        organization_name: organization_name},
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
                                put = "<tr>";
                                put += "<td>" + this.code + "</td>";
                                put += "<td>" + this.organization_name + "</td>";
                                put += "<td class=\"s_info_center\"><button class=\"bt_mini bt_detail\" style=\"width:50px;\" name=\"" + this.id + "\">詳細</button></td>";
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

        //クリアボタン
        $("#bt_clear").click(function () {
            $('#code').val("");
            $('#organization_name').val("");
            $("#error_message").html("").css("color", "#000");
            $("#search_cnt").html("").css("color", "#000");
        });
        //一覧画面へ遷移
        $("#search_table").on("click", ".bt_detail", function () {
            $('#fr_list input[name="organization_id"]').val($(this).attr("name"));
            $('#fr_list input[name="code"]').val(code);
            $('#fr_list input[name="organization_name"]').val(organization_name);
            $("#fr_list").submit();
        });

<?php if (isset($search_info["type"]) && $search_info["type"] == "search") { ?>
            //詳細画面からの戻り
            $('#code').val('<?php echo $search_info["code"]; ?>');
            $('#organization_name').val('<?php echo $search_info["organization_name"]; ?>');
            $('#bt_search').trigger("click");
<?php } else { ?>
            get_data(1, code, organization_name);
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
        <?php include(TPL_DIR . DS . "role" . DS . "sub_menu.tpl"); ?>
        <!-- /left -->

        <!-- right -->
        <div style="width:auto;height:100%;box-sizing: border-box;-moz-box-sizing: border-box;margin:0;padding-top:28px;overflow:hidden;">
            <div class="main-title" style="left:210px;">部署別権限検索</div>

            <!-- パネル -->
            <div class="panel-base" style="height:auto;width:100%;overflow:hidden;">
                <div class="panel">

                    <!-- ユニット -->
                    <div class="unit" style="padding:5px 20px 10px 20px;height:100%;">
                        <table style="width:100%;">
                            <tr>
                                <td style="width: 120px; text-align: left;">部署CD(完全一致)</td>
                                <td style="width: 200px;"><input id="code" type="text" style="width:120px;"></td>
                                <td style="width: 120px; text-align: left;">部署名(部分一致)</td>
                                <td style="width: 200px;"><input id="organization_name" type="text" style="width:120px;"></td>
                                <td style="width: 200px;"></td>
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
                    </div>
                    <!-- /ユニット -->

                </div>
            </div>
            <!-- /パネル2 -->
            <div class="panel-base" style="width:100%;height:79%;">
                <div class="panel" style="padding-top:25px;">
                    <div class="panel-title"><div style="float: left;">検索結果</div><div id="search_cnt" style="float: right; padding-right: 10px; font-weight: normal; font-size: 11px;"></div><div id="error_message" style="float: right; padding-right: 10px; font-weight: normal; font-size: 11px;"></div></div>
                    <div class="unit" style="padding:10px 10px 10px 10px;">

                        <div class="unit" style="padding: 5px 0 0 0;">
                            <table class="nogrid_table">
                                <colgroup>
                                    <col style="width:15%;">
                                    <col style="width:70%;">
                                    <col style="width:15%;">
                                </colgroup>
                                <tr>
                                    <th>部署CD</th>
                                    <th>部署名</th>
                                    <th></th>
                                </tr>
                            </table>
                            <div id="search_table_div" style="height: 98%; overflow-y: scroll; overflow-x: hidden;">
                                <table id="search_table" class="nogrid_table">
                                    <colgroup>
                                        <col style="width:15%;">
                                        <col style="width:70%;">
                                        <col style="width:13%;">
                                    </colgroup>
                                </table>
                            </div>
                        </div>

                    </div>
                    <!-- /ユニット -->
                    <form id="fr_list" action="/role/organization_detail" method="POST">
                        <input type="hidden" name="code" value="" />
                        <input type="hidden" name="organization_name" value="" />
                        <input type="hidden" name="organization_id" value="" />
                    </form>
                </div>
            </div>
            <!-- /パネル2 -->

        </div>
        <!-- /right -->
    </div><!-- /メインパネル -->
</div><!-- /main -->
