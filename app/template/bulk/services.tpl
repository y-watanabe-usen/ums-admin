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
            if(document.getElementById('fr_save').length > 0) {
                ret = confirm("表示中の内容で登録します。よろしいですか？");
                if (ret == true ) {
                    $("#bt_download").attr("disabled", "disabled");
                    $("#fr_save").submit();
                }
            }
            return;
        });
        $('#grid1').usengrid({
            width:"100%",
            height:"100%",
            resize:true,
            hcolor:"blue",
            column:[{"name":"cust_cd"},{"name":"name"},{"name":"m_account_id"},{"name":"status"},{"name":"message"}],
            data:<?php echo (isset($upload_data))? json_encode($upload_data["data"]) : "[]"; ?>,
            custom: function(v, l, i, j) {
                if (j == 4) {
                    if (l.result == 1) l._class[j] = "color_red";
                }
                return v;
            }
        });
        //アップロード
        $("#bt_upload").click(function() {
            $("#fr_upload").submit();
        });
        //更新完了時のメッセージ表示
        <?php if($type === "save") { ?>
        $(".pop_message", "#pop_release").html("");
        $(".bt_pop_save", "#pop_release").show();
        $("#pop_release").show();
        $("#msg_release").html('サービスステータスを更新しました。');
                var l = ($(".main-panel").width() - 400) / 2;
                $.blockUI({
                    message: $("#pop_release"),
                    css: {
                        width: "400px",
                        height: "130px",
                        top: "100px",
                        left: l,
                        textAlign: "left",
                        border: "0",
                        background: "none",
                        cursor: "default",
                        borderRadius: "3px"}
                });
        <?php } ?>
        $("#bt_close_pop").click(function() {
            var l = ($(".main-panel").width() - 400) / 2;
            $.blockUI({
                message: $("#pop_cancel"),
                css: {
                    width: "400px",
                    height: "130px",
                    top: "100px",
                    left: l,
                    textAlign: "left",
                    border: "0",
                    background: "none",
                    cursor: "default",
                    display: "none",
                    borderRadius: "3px"}
            });
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
<?php include(TPL_DIR . DS . "bulk" . DS . "sub_menu.tpl"); ?>
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
サービスを一括強制施錠・開錠を行う顧客CDのリストをアップロードしてください。5000件以上登録の場合はファイルを分けてご利用ください。(更新ステータス → 1 : 開錠、2 : 施錠)<br>
<span style="color: #FF0000;"> &#8251;既に休店・強制施錠中の顧客の強制施錠、開錠中のサービスの開錠要求はエラーとなります。</span><br>
<span style="color: #FF0000;"> &#8251;複数のアカウント間で開錠・施錠のステータスが異なる顧客はこの画面では取り扱えません。アカウント毎のサービス詳細画面より個別に施錠開錠ください。</span>
<br>
<form id="fr_upload" action="/bulk/services/" method="POST" enctype="multipart/form-data">
<table>
    <tr>
      <td style="width: 120px;"><span class="required">サービス：</span></td>
        <td style="width: 480px;"><select name="service_cd">
        <?php foreach($serviceList as $key => $row): ?>
        <?php   $selected = ""; ?>
        <?php   if($selected_service == $row['service_cd']): ?>
        <?php     $selected = 'selected'; ?>
        <?php   endif; ?>
        <option value="<?php echo($row['service_cd']); ?>"  <?php echo $selected; ?>><?php echo ($row['service_name']); ?>
        <?php endforeach; ?>
        </td>
      <td></td>
    </tr>
    <tr>
        <td style="width: 120px;"><span class="required">CSVファイル：</span></td>
        <td style="width: 480px;">
            <input name="file" type="file" style="width:450px;">
            <input name="type" type="hidden" value="upload">
        </td>
        <td>
            <button id="bt_upload">一括強制施錠／開錠登録ファイルをアップロードする</button>
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
                        <form id="fr_save" action="/bulk/services/" method="POST">
                            <input name="type" type="hidden" value="save">
                            <input name="service_cd" type="hidden" value="<?php echo ($service_cd); ?>">
                        </form>
                        <button id="bt_download" style="width: auto;"> 登録実行</button>
                        <?php } else { ?>
                        <button id="bt_download" style="width: auto;" disabled>登録実行</button>
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
                    <th width="80px">更新ステータス</th>
                    <th width="250px">メッセージ</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
            </table>
        </div>
        <!-- /ユニット -->
        <!-- ポップアップ -->
        <div id="pop_release" class="panel-pop" style="padding-top:25px;">
            <div class="panel-title">強制解除</div>
            <!-- ユニット -->
            <div class="unit" style="padding:10px 20px 10px 20px;">
                <div id="msg_release" style="font-size:14px;text-align:center;"></div>
                <div class="pop_message" style="text-align:center;margin:2px 0;height:20px;color:red;"></div>
                <div style="text-align:center;">
                    <button id="bt_close_pop" style="margin:0 10px;">OK</button>
                </div>
            </div>
            <!-- /ユニット -->
        </div>
        <!-- ポップアップ -->
    </div>
</div>

<!-- /right -->

</div><!-- /メインパネル -->

</div><!-- /main -->
