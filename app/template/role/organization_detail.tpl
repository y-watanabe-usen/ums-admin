<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<script type="text/javascript">
//<![CDATA[

(function($) {
    $(function() {

        <?php
            foreach ($m_role_state_list as $val) {
                if ($val["role_name"] === "ROLE_LOGIN") {
                    $login_role = !empty($val["t_default_role_id"]) ? "1" : "2";
                }
                if (!empty($val["t_default_role_id"])) {
                    echo "\$('[name=\"" . Func::h($val["role_name"]) . "\"][value=1]').prop('checked',true);\n";
                } else {
                    echo "\$('[name=\"" . Func::h($val["role_name"]) . "\"][value=2]').prop('checked',true);\n";
                    if ($val["role_name"] !== "ROLE_LOGIN" && $login_role === "2") {
                        echo "\$('[name=\"" . Func::h($val["role_name"]) . "\"]').attr(\"disabled\", true);\n";
                    }
                }
                echo "\$( \"#" . Func::h($val["role_name"]) . "\" ).buttonset();\n";
            }
        ?>

        // ログイン権限変更時
        $('input[name="ROLE_LOGIN"]:radio' ).change( function() {
            var radioVal = $("input[name='ROLE_LOGIN']:checked").val();
            // ログイン権限を無効にした場合
            if (radioVal == "2") {
                <?php
                    //全ての権限を無効に変更
                    foreach ($m_role_state_list as $kye => $val) {
                        if ($val["role_name"] !== "ROLE_LOGIN") {
                            echo "\$('[name=\"" . Func::h($val["role_name"]) . "\"][value=2]').prop('checked',true);\n";
                            echo "\$('[name=\"" . Func::h($val["role_name"]) . "\"]').attr(\"disabled\", true);\n";
                            echo "\$( \"#" . Func::h($val["role_name"]) . "\" ).buttonset();\n";
                        }
                    }
                ?>
            } else {
                <?php
                    //変更無効を解除
                    foreach ($m_role_state_list as $kye => $val) {
                        if ($val["role_name"] !== "ROLE_LOGIN") {
                            echo "\$('[name=\"" . Func::h($val["role_name"]) . "\"]').attr(\"disabled\", false);\n";
                            //元の状態に戻す
                            if (!empty($val["t_default_role_id"])) {
                                echo "\$('[name=\"" . Func::h($val["role_name"]) . "\"][value=1]').prop('checked',true);\n";
                            } else {
                                echo "\$('[name=\"" . Func::h($val["role_name"]) . "\"][value=2]').prop('checked',true);\n";
                            }
                            echo "\$( \"#" . Func::h($val["role_name"]) . "\" ).buttonset();\n";
                        }
                    }
                ?>
            }
        });

        //保存ボタン
        $(".bt_edit").click(function() {
            $(".pop_message", "#pop_role").html("");
            $(".bt_pop_save", "#pop_role").show();
            var l = ($(".main-panel").width() - 600) / 2;
            $.blockUI({
                message: $("#pop_role"),
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

        $("#pop_role").on("click", ".bt_pop_save", function() {
            $(this).hide();
            $(".bt_pop_close", "#pop_role").hide();
            var organization_id = $("#organization_id").val();
            $(".pop_message", "#pop_role").html("処理中です...");
            <?php
                // 権限マスタをセット
                $role_date ="";
                foreach ($m_role_state_list as $kye => $val) {
                    if ($kye !== 0) {
                        $role_date .= ",";
                    }
                    $role_date .= Func::h($val["id"]) . ": \$('input[name=\"" . Func::h($val["role_name"]) . "\"]:checked').val()";
                }
            ?>
            $.ajax({
                type: 'POST',
                url: '/role/organization_edit',
                cache: false,
                datatype: 'json',
                data: {organization_id: organization_id, <?php echo $role_date; ?>},
                success: function (json) {
                    if (json.result_cd == 0) {
                        $(".pop_message", "#pop_role").html("更新しました。");
                    }
                    $(".bt_pop_close", "#pop_role").show();
                },
                error: function () {
                    $(".pop_message", "#pop_role").html("通信エラーが発生しました。");
                    $(".bt_pop_close", "#pop_role").show();

                }
            });
        });

        //クリアボタン
        $("#bt_clear").click(function () {
            $('#code').val("");
            $('#role_id').val("");
            $("#error_message").html("").css("color", "#000");
            $("#search_cnt").html("").css("color", "#000");
        });
        //ポップアップの閉じる
        $(".bt_pop_close").click(function () {
            $.unblockUI();
        });

        //一覧へ戻る
        $("#bt_back").click(function () {
            $("#fr_back").submit();
        });

    });
})(jQuery);
//]]>
</script>

<!-- メイン -->
<div class="main">

<style>
#label_radio{
  background-image: none;
  background-color: silver;
  color: gray;
}
#label_radio.ui-state-active{
  background-color: blue;
  color: white;
}
</style>


    <!-- メインパネル -->
    <div class="main-panel" style="padding-top:22px">

        <!-- left -->
        <?php include(TPL_DIR . DS . "role" . DS . "sub_menu.tpl"); ?>
        <!-- /left -->

        <!-- right -->
        <div style="width:auto;box-sizing: border-box;-moz-box-sizing: border-box;margin:0;padding-top:28px;overflow:hidden;">
            <div class="main-title" style="left:210px;">部署別権限詳細
                <button id="bt_back" style="bottom:3px;right:0;position:absolute;" onclick='window.location.href = "/role/organization_search"'>検索へ戻る</button>
            </div>

            <!-- パネル -->
            <div class="panel-base" style="width:100%;height:20%;">
                <div class="panel" style="padding-top:25px;">
                    <div class="panel-title">部署情報</div>
                    <div class="unit" style="padding:10px;">
                        <table id="account_table" class="nogrid_table" style="width:100%;">
                            <tr>
                                <th width="90px">部署CD</th>
                                <th width="280px">部署名</th>
                            </tr>
                            <tr>
                                <td class=""><?php echo Func::h($m_organization_list["code"]); ?></td>
                                <td class=""><?php echo Func::h($m_organization_list["organization_name"]); ?></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <!-- /パネル -->

            <!-- パネル2 -->
            <div class="panel-base" style="width:100%;height:30%;">
                <div class="panel" style="padding-top:25px;">
                    <div class="panel-title"><div style="float: left;">更新対象部署</div><div style="float: right; padding-right: 10px; font-weight: normal; font-size: 11px;"></div></div>
                    <div class="unit" style="padding:10px 10px 10px 10px;">
                        <table class="nogrid_table">
                            <colgroup>
                                <col style="width:16%;">
                                <col style="width:28%;">
                                <col style="width:28%;">
                                <col style="width:28%;">
                            </colgroup>
                            <tr>
                                <th>部署CD</th>
                                <th colspan="3">部署名</th>
                            </tr>
                        </table>

                        <div id="mityaku" style="height: 90%; overflow-y: scroll; overflow-x: hidden;">
                            <table class="nogrid_table">
                                <colgroup>
                                    <col style="width:15%;">
                                    <col style="width:28%;">
                                    <col style="width:28%;">
                                    <col style="width:23%;">
                                </colgroup>
                                <?php foreach ($m_organization_info as $val) { ?>
                                    <tr>
                                        <td class=""><?php echo Func::h($val["code"]); ?></td>
                                        <td class=""><?php echo Func::h($val["organization_name"]); ?></td>
                                        <td class=""><?php echo $organization_name2 = !empty($val["organization_name2"]) ? Func::h($val["organization_name2"]) : ""; ?></td>
                                        <td class=""><?php echo $organization_name3 = !empty($val["organization_name3"]) ? Func::h($val["organization_name3"]) : ""; ?></td>
                                    </tr>
                                <?php } ?>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /パネル2 -->

            <!-- パネル3 -->
            <div class="panel-base" style="width:100%;height:50%;">
                <div class="panel" style="padding-top:25px;">
                    <div class="panel-title"><div style="float: left;">権限一覧</div><div style="float: right; padding-right: 10px; font-weight: normal;"><button class="bt_edit">保存</button></div></div>
                    <div class="unit" style="padding:20px 10px 10px 10px;">
                        <table class="nogrid_table">
                            <colgroup>
                                <col style="width:100px;">
                                <col style="width:160px;">
                                <col style="width:120px;">
                                <col style="width:90px;">
                            </colgroup>
                            <tr>
                                <th>権限名称</th>
                                <th>説明</th>
                                <th>親部署権限</th>
                                <th></th>
                            </tr>
                        </table>
                        <div id="search_table_div">
                            <table id="search_table" class="nogrid_table">
                                <colgroup>
                                    <col style="width:100px;">
                                    <col style="width:160px;">
                                    <col style="width:120px;">
                                    <col style="width:90px;">
                                </colgroup>
                                <?php foreach ($m_role_state_list as $val) { ?>
                                    <tr>
                                        <td class=""><?php echo Func::h($val["disp_name"]); ?></td>
                                        <td class=""><?php echo Func::h($val["explanation"]); ?></td>
                                        <td class="">
                                            <?php
                                                if (!empty($m_parent_organization["mo2_id"])) {
                                                    echo $parent_role_info = !empty($val["parent_info"]) ? "有効(" . $val["parent_name"] . ")" : "無効";
                                                }
                                            ?>
                                        </td>
                                        <td class="s_info_center">
                                            <div id="<?php echo Func::h($val["role_name"]); ?>">
                                                <input type="radio" id="<?php echo Func::h($val["role_name"]); ?>1" name="<?php echo Func::h($val["role_name"]); ?>" value="1" ><label for="<?php echo Func::h($val["role_name"]); ?>1" id="label_radio">有効</label>
                                                <input type="radio" id="<?php echo Func::h($val["role_name"]); ?>2" name="<?php echo Func::h($val["role_name"]); ?>" value="2" ><label for="<?php echo Func::h($val["role_name"]); ?>2" id="label_radio">無効</label>

                                            </div>
                                        </td>
                                    </tr>
                                <?php } ?>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /パネル3 -->

            <!-- ポップアップ -->
            <div id="pop_role" class="panel-pop" style="padding-top:25px;">
                <div class="panel-title">権限更新</div>
                <!-- ユニット -->
                <div class="unit" style="padding:10px 20px 10px 20px;">
                    <div id="msg_release" style="font-size:14px;text-align:center;">権限を更新しますか？</div>
                    <div class="pop_message" style="text-align:center;margin:5px 0;color:red;"></div>
                    <div><input type="hidden" id="organization_id" name="organization_id" value="<?php echo Func::h($m_organization_list["id"]); ?>"></div>
                    <div style="text-align:center;">
                        <button class="bt_pop_save bt_blue" style="margin:0 10px;">OK</button>
                        <button class="bt_pop_close" style="margin:0 10px;">閉じる</button>
                    </div>
                </div>
                <!-- /ユニット -->
            </div>
            <!-- ポップアップ -->

            <form id="fr_back" action="/role/organization_search" method="POST">
                <input type="hidden" name="type" value="search" />
                <input type="hidden" name="code" value="<?php echo $code; ?>" />
                <input type="hidden" name="organization_name" value="<?php echo $organization_name; ?>" />
            </form>

        </div>
        <!-- /right -->
    </div><!-- /メインパネル -->
</div><!-- /main -->
