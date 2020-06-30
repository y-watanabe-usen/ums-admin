<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<?php
$count = isset($this->RequestPost['count']) ? $this->RequestPost['count'] : '';
$market_div = isset($this->RequestPost['market_div']) ? $this->RequestPost['market_div'] : '1';
$market_select = isset($this->RequestPost['market_select']) ? $this->RequestPost['market_select'] : '1';
$market_text = isset($this->RequestPost['market_text']) ? $this->RequestPost['market_text'] : '';
?>
<script type="text/javascript">
//<![CDATA[

(function($) {
    $(function() {
        var market_div = $("#market_div").val();
        if (market_div == "1") {
            $("#market_select").show();
            $("#market_text").hide();
        } else if (market_div == "2") {
            $("#market_select").hide();
            $("#market_text").show();
        }

        $("#market_div").change(function() {
            if ($(this).val() == "1") {
                $("#market_select").show();
                $("#market_text").hide();
            } else if ($(this).val() == "2") {
                $("#market_select").hide();
                $("#market_text").show();
            }
        });

        $("#bt_download").click(function() {
            $("#dl_message").text("");
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
            <div class="main-title" style="left:210px;">デモアカウント発行</div>

            <!-- パネル2 -->
            <div class="panel-base" style="height:100%;width:100%;overflow:hidden;">
                <div class="panel">
                    <!-- ユニット -->
                    <div class="unit" style="padding:53px 20px 10px 20px;height:100%;">
                        <form id="fr_dl" action="/dedicated/demo_create" method="POST">
                        <input type="hidden" name="type" value="create" />
                        <table style="padding:0;margin:0;position:absolute;top:0;">
                            <tr>
                                <td colspan="2" style="height: 40px; vertical-align: top;">件数と販路を入力してお試しアカウントを発行してください。<br />一度に<?php echo $create_max_count ?>件まで登録できます。</td>
                            </tr>
                            <tr>
                                <td style="width: 50px; height: 30px;"><span class="required">件数</span></td>
                                <td>
                                    <input id="count" type="text" name="count" style="width:120px;" value="<?php echo Func::h($count); ?>">
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 50px; height: 30px;"><span class="required">販路</span></td>
                                <td>
                                    <select id="market_div" name="market_div">
                                        <option value="1" <?php echo $selected = $market_div === "1" ? "selected" : ""; ?>>既存から選択</option>
                                        <option value="2" <?php echo $selected = $market_div === "2" ? "selected" : ""; ?>>新規作成</option>
                                    </select>
                                    <select id="market_select" name="market_select">
                                    <?php foreach ($marketList as $val) { ?>
                                        <option value="<?php echo $val["id"]; ?>" <?php echo $selected = $market_select === $val["id"] ? "selected" : ""; ?>><?php echo $val["market_name"]; ?></option>　
                                    <?php } ?>
                                    </select>
                                    <input id="market_text" type="text" name="market_text" maxlength="40" style="width:120px; display: none;" value="<?php echo Func::h($market_text); ?>">
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" id="dl_message" style="height:20px;color:red;"><?php echo nl2br($err_message); ?></td>
                            </tr>
                            <tr>
                                <td colspan="2"><button id="bt_download" class="bt_mini" style="width: 200px;">デモアカウントを発行する</button></td>
                            </tr>
                        </table>
                        </form>
                    </div>
                    <!-- ユニット -->
                </div>
            </div>
            <!-- /パネル2 -->

        </div>
        <!-- /right -->
    </div><!-- /メインパネル -->
</div><!-- /main -->
