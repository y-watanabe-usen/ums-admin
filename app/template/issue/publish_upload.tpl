<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<?php
$issue_type = isset($this->RequestPost["issue_type"]) ? $this->RequestPost["issue_type"] : "1";
$issue_div_default = "1";
if ($this->Acl->check($this->Auth->user("role_id"), "Issue/publish_output")) {
    $issue_div_default = "2";
}
$issue_div = isset($this->RequestPost["issue_div"]) ? $this->RequestPost["issue_div"] : $issue_div_default;
?>
<script type="text/javascript">
//<![CDATA[
(function($) {
    $(function() {
        $("#p0").usenautoheight({
            panel:[
                {"id" : "#p1", "height" : "170"},
                {"id" : "#p2", "height" : "*"}]
        });

        $('#grid1').usengrid({
            width:"100%",
            height:"100%",
            resize:true,
            hcolor:"blue",
            column:[{"name":"cust_cd"},{"name":"name"},{"name":"zip_cd"},{"name":"address1"},{"name":"address2"},{"name":"address3"},{"name":"message"}],
            data:<?php echo (isset($upload_data))? json_encode($upload_data["data"]) : "[]"; ?>,
            custom: function(v, l, i, j) {
                if (j == 6) {
                    if (l.result == 0) l._class[j] = "color_blue";
                    if (l.result == 1) l._class[j] = "color_red";
                } else if (j != 0) {
                    if (l.type == 1) {
                        l._class[j] = "upload_unis";
                    }
                }
                return v;
            }
        });

        //アップロード
        $("#bt_upload").click(function() {
            $("#fr_upload").submit();
        });

        //内容を反映する
        $("#bt_save").click(function() {
            $("#fr_save").submit();
        });
        $("#bt_output").click(function() {
            $.blockUI({message: '発送データを作成しています。<BR>時間がかかる場合があります。'});
            $("#err_message").text("");
            $("#fr_output").submit();
        });

        // 発送先「顧客CD毎に出力」は発送区分「今すぐPDF出力する」でのみ使える
        $(".issue_div").click(function() {
            if ($(".issue_div:checked").val() == "1") {
                $("#issue_type3").prop("disabled", true);
                $("#issue_type_string3").css("color", "#aaa");
                if ($(".issue_type:checked").val() == "3") {
                    $("#issue_type1").prop("checked", true);
                }
            } else {
                $("#issue_type3").prop("disabled", false);
                $("#issue_type_string3").css("color", "#333");
            }
        });
        $(".issue_div:checked").trigger("click");
    });
})(jQuery);
//]]>
</script>

<!-- メイン -->
<div class="main">

<!-- メインパネル -->
<div class="main-panel" style="padding-top:22px">

<!-- left -->
<?php include(TPL_DIR . DS . "issue" . DS . "sub_menu.tpl"); ?>
<!-- /left -->


<!-- right -->
<div id="p0" style="width:auto;height:100%;box-sizing: border-box;-moz-box-sizing: border-box;margin:0;padding-top:28px;overflow:hidden;">
<div class="main-title" style="left:210px;"><?php echo $titleName; ?></div>

<!-- パネル2 -->
<div id="p1" class="panel-base" style="height:120px;width:100%;overflow:hidden;">
<div class="panel" style="padding-top:25px;">
<div class="panel-title">アップロード</div>

<!-- ユニット -->
<div class="unit" style="padding:10px 10px 10px 10px;">
アカウント証再発送データをアップロードしてください。<br>
<br>
<form id="fr_upload" action="/issue/publish_upload/" method="POST" enctype="multipart/form-data">
<table>
    <tr>
        <td style="width: 120px;">発送ファイル：</td>
        <td style="width: 500px;">
            <input name="file" type="file" style="width:450px;">
            <input name="type" type="hidden" value="upload">
        </td>
    </tr>
    <tr>
        <td style="width: 120px;">発送先：</td>
        <td style="width: 600px;">
            <input id="issue_type1" class="issue_type" type="radio" name="issue_type" value="1" <?php echo ($issue_type === "1") ? "checked" : ""; ?>><span id="issue_type_string1" style="color: #333;">一括出力</span></input>&nbsp;&nbsp;
            <input id="issue_type2" class="issue_type" type="radio" name="issue_type" value="2" <?php echo ($issue_type === "2") ? "checked" : ""; ?>><span id="issue_type_string2" style="color: #333;">支店CD毎に出力</span></input>
            <input id="issue_type3" class="issue_type" type="radio" name="issue_type" value="3" <?php echo ($issue_type === "3") ? "checked" : ""; ?>><span id="issue_type_string3" style="color: #333;">顧客CD毎に出力</span></input>
            <span style="margin-left: 60px; width: 80px;">オプション：</span>
            <span style="width: 300px;"><input type="checkbox" name="except_init_cust" value="1" <?php echo ($except_init_cust === "1")? "checked" : ""; ?>>初回登録済み顧客を除く</span>
        </td>
    </tr>
    <tr>
        <td style="width: 120px;">発送区分：</td>
        <td style="width: 500px;">
            <input class="issue_div" type="radio" name="issue_div" value="1" <?php echo ($issue_div === "1") ? "checked" : ""; ?>>次回の発送データダウンロードに含める</input>&nbsp;&nbsp;
            <?php if ($this->Acl->check($this->Auth->user("role_id"), "Issue/publish_output")) { ?>
            <input class="issue_div" type="radio" name="issue_div" value="2" <?php echo ($issue_div === "2") ? "checked" : ""; ?>>今すぐPDF出力する</input>
            <?php } else { ?>
            <input class="issue_div" type="radio" name="issue_div" value="" disabled="disabled"><span style="color: #aaa;">今すぐPDF出力する</span></input>
            <?php } ?>
        </td>
        <td>
            <button id="bt_upload">アップロード</button>
        </td>
    </tr>
    <tr>
        <td></td>
        <td id="err_message" colspan=2 style="color:red;"><?php echo $err_message; ?></td>
    </tr>
</table>
</form>

</div>
<!-- /ユニット -->


</div>
</div>
<!-- /パネル2 -->

<!-- パネル3 -->
<div id="p2" class="panel-base" style="height:150px;width:100%;overflow:hidden;">
<div class="panel" style="padding-top:25px;">
<div class="panel-title">アップロード確認</div>

<!-- ユニット -->
<div class="unit" style="padding:35px 10px 10px 10px;height:100%;">
<table style="padding:0;margin:0;position:absolute;top:6px;">
    <tr>
        <td style="width:300px;">
            <?php if (!empty($button_id)) { ?>
            <form id="fr_save" action="/issue/publish_upload/" method="POST">
                <input name="type" type="hidden" value="save">
                <input name="issue_type" type="hidden" value="<?php echo $issue_type; ?>">
                <input name="issue_div" type="hidden" value="<?php echo $issue_div; ?>">
                <input name="except_init_cust" type="hidden"  value="<?php echo $except_init_cust; ?>">
            </form>
            <form id="fr_output" action="/issue/publish_output/" method="POST">
                <input name="type" type="hidden" value="output">
                <input name="issue_type" type="hidden" value="<?php echo $issue_type; ?>">
                <input name="issue_div" type="hidden" value="<?php echo $issue_div; ?>">
                <input name="except_init_cust" type="hidden"  value="<?php echo $except_init_cust; ?>">
            </form>
            <button id="<?php echo $button_id; ?>" class="bt_mini_blue" style="width: auto;"><?php echo $button_name; ?></button>
            <?php } ?>
        </td>
        <td style="width:10px;"></td>
        <td style="width:300px;"><?php if (isset($upload_data)) echo "アップロード".$upload_data["all_cnt"]."件　エラー".$upload_data["err_cnt"]."件"; ?></td>
    </tr>
</table>

<table id="grid1">
<thead>
    <tr>
        <th width="80px">顧客CD</th>
        <th width="100px">設置先名称</th>
        <th width="80px">設置先郵便番号</th>
        <th width="120px">設置先住所1</th>
        <th width="120px">設置先住所2</th>
        <th width="120px">設置先住所3</th>
        <th width="250px">メッセージ</th>
    </tr>
</thead>
<tbody>
</tbody>
</table>

</div>
<!-- /ユニット -->


</div>
</div>
<!-- /パネル3 -->

</div>
<!-- /right -->

</div><!-- /メインパネル -->

</div><!-- /main -->
