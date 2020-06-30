<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<script type="text/javascript">
//<![CDATA[
(function($) {
    $(function() {
        $("#p0").usenautoheight({
            panel:[
                {"id" : "#p1", "height" : "170"},
                {"id" : "#p2", "height" : "*"}]
        });
        $("#bt_download").click(function() {
            ret = confirm("表示中の内容で登録します。よろしいですか？");
            if (ret == true) {
                $("#bt_download").attr("disabled", "disabled");
                $("#fr_save").submit();
            }
        });
        $('#grid1').usengrid({
            width:"100%",
            height:"100%",
            resize:true,
            hcolor:"blue",
            column:[{"name":"cust_cd"},{"name":"name"},{"name":"m_account_id"},{"name":"mail_address"},{"name":"login_id"},{"name":"password"},{"name":"message"}],
            data:<?php echo (isset($upload_data))? json_encode($upload_data["data"]) : "[]"; ?>,
            custom: function(v, l, i, j) {
                if (j == 6) {
                    if (l.result == 1) l._class[j] = "color_red";
                }
                return v;
            }
        });
        //アップロード
        $("#bt_upload").click(function() {
            $("#fr_upload").submit();
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
メールアドレスの初回登録を実施し、仮ID/PWを抽出する顧客CD/メールアドレスのリストをアップロードしてください。5000件以上登録の場合はファイルを分けてご利用ください。<br>
<span style="color: #FF0000;"> &#8251;複数の初回登録が済んでいないアカウントを持つ顧客は、対象アカウントすべてに入力メールアドレスが適応されます。</span>
<br>
<form id="fr_upload" action="/extraction/mail_address_init_import/" method="POST" enctype="multipart/form-data">
<table>
    <tr>
        <td style="width: 120px;"><span class="required">CSVファイル：</span></td>
        <td style="width: 480px;">
            <input name="file" type="file" style="width:450px;">
            <input name="type" type="hidden" value="upload">
        </td>
        <td>
            <button id="bt_upload">メールアドレス登録ファイルをアップロードする</button>
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

<!-- パネル3 -->
<div id="p2" class="panel-base" style="height:150px;width:100%;overflow:hidden;">
    <div class="panel" style="padding-top:25px;">
        <div class="panel-title">アップロード確認</div>
        <!-- ユニット -->
        <div class="unit" style="padding:35px 10px 10px 10px;height:100%;">
            <table style="padding:0;margin:0;position:absolute;top:6px;">
                <tr>
                    <td style="width:300px;">
                        <?php if (isset($save_button) && $save_button) { ?>
                        <form id="fr_save" action="/extraction/mail_address_init_import/" method="POST">
                            <input name="type" type="hidden" value="save">
                        </form>
                        <button id="bt_download" style="width: auto;"> メールアドレス登録・結果ファイルダウンロード</button>
                        <?php } else { ?>
                        <button id="bt_download" style="width: auto;" disabled> メールアドレス登録・結果ファイルダウンロード</button>
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
                    <th width="140px">設置先名称</th>
                    <th width="80px">アカウントID</th>
                    <th width="160px">メールアドレス</th>
                    <th width="80px">ログインID</th>
                    <th width="80px">パスワード</th>
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
<!-- パネル3 -->

</div>
<!-- /right -->

</div><!-- /メインパネル -->

</div><!-- /main -->
<?php include(TPL_DIR . DS . "common" . DS . "footer.tpl"); ?>
