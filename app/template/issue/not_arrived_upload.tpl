<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<script type="text/javascript">
//<![CDATA[
(function($) {
    $(function() {
        $("#p0").usenautoheight({
            panel:[
                {"id" : "#p1", "height" : "130"},
                {"id" : "#p2", "height" : "*"}]
        });

        $('#grid1').usengrid({
            width:"100%",
            height:"100%",
            resize:true,
            hcolor:"blue",
            column:[{"name":"cust_cd"},{"name":"branch_name"},{"name":"message"}],
            data:<?php echo (isset($upload_data))? json_encode($upload_data["data"]) : "[]"; ?>,
            custom: function(v, l, i, j) {
                if (j == 2) {
                    if (l.result == 0) l._class[j] = "color_blue";
                    if (l.result == 1) l._class[j] = "color_red";
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
<div class="main-title" style="left:210px;">未着データアップロード</div>

<!-- パネル2 -->
<div id="p1" class="panel-base" style="height:120px;width:100%;overflow:hidden;">
<div class="panel" style="padding-top:25px;">
<div class="panel-title">アップロード</div>

<!-- ユニット -->
<div class="unit" style="padding:10px 10px 10px 10px;">
アカウント証未着データをアップロードしてください。<br>
<br>
<table>
    <tr>
        <td style="width: 120px;">未着ファイル：</td>
        <td style="width: 500px;">
            <form id="fr_upload" action="/issue/not_arrived_upload/" method="POST" enctype="multipart/form-data">
                <input name="file" type="file" style="width:450px;">
                <input name="type" type="hidden" value="upload">
            </form>
        </td>
        <td>
            <button id="bt_upload">アップロード</button>
        </td>
    </tr>
    <tr>
        <td></td>
        <td colspan=2 style="color:red;"><?php echo $err_message; ?></td>
    </tr>
</table>

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
        <td style="width:150px;">
            <?php if (isset($save_button) && $save_button) { ?>
            <form id="fr_save" action="/issue/not_arrived_upload/" method="POST">
                <input name="type" type="hidden" value="save">
            </form>
            <button id="bt_save" class="bt_mini_blue" style="width:130px;">更新</button>
            <?php } else { ?>
            <button class="bt_noactive_mini" disabled style="width:130px;">更新</button>
            <?php } ?>
        </td>
        <td style="width:10px;"></td>
        <td style="width:300px;"><?php if (isset($upload_data)) echo "アップロード".$upload_data["all_cnt"]."件　エラー".$upload_data["err_cnt"]."件"; ?></td>
    </tr>
</table>

<table id="grid1">
<thead>
    <tr>
        <th width="100px">顧客CD</th>
        <th width="150px">管轄支店</th>
        <th width="650px">メッセージ</th>
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
