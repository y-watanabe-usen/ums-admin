<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<script type="text/javascript">
//<![CDATA[
(function($) {
    $(function() {
        $("#p0").usenautoheight({
            panel:[
                {"id" : "#p1", "height" : "190"},
                {"id" : "#p2", "height" : "*"}]
        });
        $("#bt_download").click(function() {
            ret = confirm("表示中の内容で登録します。よろしいですか？");
            if (ret == true) {
                $("#bt_download").attr("disabled", "disabled");
                var output_type = $('input[name=output_type]:checked').val();
                $('<input>').attr({
                    type: 'hidden',
                    value: output_type,
                    name: 'output_type'
                }).appendTo("#fr_save");
                $("#fr_save").submit();
            }
        });
        $('#grid1').usengrid({
            width:"100%",
            height:"100%",
            resize:true,
            hcolor:"blue",
            column:[{"name":"chain_cd"},{"name":"chain_name"},{"name":"cust_cd"},{"name":"name"},{"name":"m_account_id"},{"name":"mail_address"},{"name":"login_id"},{"name":"password"},{"name":"authority_div"},{"name":"message"}],
            data:<?php echo (isset($upload_data))? json_encode($upload_data["data"]) : "[]"; ?>,
            custom: function(v, l, i, j) {
                if (j == 9) {
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
    <div id="p1" class="panel-base" style="height:190px;width:100%;overflow:hidden;">
        <div class="panel" style="padding-top:25px;">
            <div class="panel-title">アップロード</div>
            
            <!-- ユニット -->
            <div class="unit" style="padding:10px 10px 10px 10px; height:190px;">
                メールアドレス登録の実施・ID/PWの抽出・チェーン店権限区分を設定する顧客CD/メールアドレス/チェーン店権限のリストをアップロードしてください。5000件以上登録の場合はファイルを分けてご利用ください。<br>
                <span style="color: #FF0000;"> &#8251;複数のアカウントを持つ顧客は、対象アカウントすべてに入力メールアドレス、チェーン店権限が適応されます。</span><br>
                <span style="color: #FF0000;"> &#8251;当機能を2回目以降に使用する顧客に関しては、パスワードはユーザー情報となる為、抽出できません。</span>
                <br>
                <form id="fr_upload" action="/extraction/chain_store_bulk_regist/" method="POST" enctype="multipart/form-data">
                    <table>
                        <tr>
                            <td style="witdh: 120px;"><span class="required">出力形式：</span></td>
                            <td>
                                <?php foreach($this->output_type_div as $value => $label) { 
                                      $checked = ''; 
                                      if (empty($this->RequestPost['output_type'])) {
                                          if ($value == Extraction::OUTPUT_BRANCH_DIV) {
                                              $checked = 'checked';
                                          }
                                      } else if(!empty($this->RequestPost['output_type']) && $this->RequestPost['output_type'] == $value) {
                                        $checked = 'checked';
                                      } ?>
                                <input type="radio" name="output_type" value="<?php echo Func::h($value); ?>" <?php echo Func::h($checked); ?>><?php echo Func::h($label); ?>
                                <?php } ?>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 120px;"><span class="required">CSVファイル：</span></td>
                            <td style="width: 480px;">
                                <input name="file" type="file" style="width:450px;">
                                <input name="type" type="hidden" value="upload">
                            </td>
                            <td>
                                <button id="bt_upload">登録ファイルをアップロードする</button>
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
                            <form id="fr_save" action="/extraction/chain_store_bulk_regist/" method="POST">
                                <input name="type" type="hidden" value="save">
                            </form>
                            <button id="bt_download" style="width: auto;"> 登録実行・結果ファイルダウンロード</button>
                            <?php } else { ?>
                            <button id="bt_download" style="width: auto;" disabled> 登録実行・結果ファイルダウンロード</button>
                            <?php } ?>
                        </td>
                        <td style="width:10px;"></td>
                        <td style="width:300px;"><?php if (isset($upload_data)) echo "アップロード".$upload_data["all_cnt"]."件　エラー".$upload_data["err_cnt"]."件"; ?></td>
                    </tr>
                </table>
                <table id="grid1">
                <thead>
                    <tr>
                        <th width="80px">チェーン店CD</th>
                        <th width="80px">チェーン店名称</th>
                        <th width="80px">顧客CD</th>
                        <th width="140px">設置先名称</th>
                        <th width="80px">アカウントID</th>
                        <th width="160px">メールアドレス</th>
                        <th width="80px">ログインID</th>
                        <th width="80px">パスワード</th>
                        <th width="80px">権限区分</th>
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
<?php include(TPL_DIR . DS . "common" . DS . "footer.tpl"); ?>
