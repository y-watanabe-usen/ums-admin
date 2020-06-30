<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<script type="text/javascript">
//<![CDATA[
(function($) {
    $(function() {
        $("#bt_download").click(function() {
            $("#err_message").text("");
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
<?php include(TPL_DIR . DS . "extraction" . DS . "sub_menu.tpl"); ?>
<!-- /left -->


<!-- right -->
<div id="p0" style="width:auto;height:100%;box-sizing: border-box;-moz-box-sizing: border-box;margin:0;padding-top:28px;overflow:hidden;">
<div class="main-title" style="left:210px;"><?php echo $titleName; ?></div>

<!-- パネル2 -->
<div id="p1" class="panel-base" style="height:170px;width:100%;overflow:hidden;">
<div class="panel" style="padding-top:25px;">
<div class="panel-title">アップロード</div>

<!-- ユニット -->
<div class="unit" style="padding:10px 10px 10px 10px;">
ID/PWを抽出する顧客CDをアップロードしてください。<br>
<br>
<form id="fr_upload" action="/extraction/id_pw_download/" method="POST" enctype="multipart/form-data">
<table>
    <tr>
        <td style="width: 120px;"><span class="required">サービス：</span></td>
        <td style="width: 480px;"><select name="service_cd">
        <?php foreach($service as $key => $row): ?>
        <?php   $selected = ""; ?>
        <?php   if($selected_service == $row['service_cd']): ?>
        <?php     $selected = 'selected'; ?>
        <?php   endif; ?>
        <option value="<?php echo($row['service_cd']); ?>"  <?php echo $selected; ?>><?php echo ($row['service_name']); ?></option>
        <?php endforeach; ?>
        </select>
        </td>
    </tr>
    <tr>
        <td style="width: 120px;"><span class="required">CSVファイル：</span></td>
        <td style="width: 480px;">
            <input name="file" type="file" style="width:450px;">
            <input name="type" type="hidden" value="download">
        </td>
        <td>
            <button id="bt_download">ID/PWリストをダウンロードする</button>
        </td>
    </tr>
    <tr>
        <td></td>
        <td id="err_message" colspan=2 style="color:red;"><?php echo nl2br($err_message); ?></td>
    </tr>
</table>
</form>

</div>
<!-- /ユニット -->


</div>
</div>
<!-- /パネル2 -->

</div>
<!-- /right -->

</div><!-- /メインパネル -->

</div><!-- /main -->
<?php include(TPL_DIR . DS . "common" . DS . "footer.tpl"); ?>
