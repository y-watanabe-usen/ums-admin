<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<script type="text/javascript">
//<![CDATA[
$(function () {
    //一覧へ戻る
    $("#bt_back").click(function () {
        $("#fr_back").submit();
    });

<?php
    // 初回認証日時がNULLの場合、視聴履歴をダウンロードボタンは非活性
    if (empty($account["init_auth_datetime"])) { 
?>
        $("#bt_download").prop("disabled", true);
<?php 
    } 
?>
    //視聴履歴をダウンロード
    $("#bt_download").click(function() {
        $("#fr_download").submit();
    });

});
//]]>
</script>

<!-- メイン -->
<div class="main">

    <!-- メインパネル -->
    <div class="main-panel">
        <div class="main-title"><?php echo Func::h($titleName); ?>
            <button id="bt_back" style="bottom:3px;right:0;position:absolute;">一覧へ戻る</button>
        </div>

        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:auto;">
            <div class="panel" style="padding-top:25px;">
                <div class="panel-title">アカウント情報</div>
                <div class="unit" style="padding:10px 10px 10px 10px;">
                    <table id="grid" class="nogrid_table" style="width:100%;table-layout:auto;">
                        <thead>
                            <tr>
                                <th width="100px">アカウントID</th>
                                <th width="100px">ログインID</th>
                                <th width="100px">パスワード</th>
                                <th width="100px">販路</th>
                                <th width="100px">発行日</th>
                                <th width="100px">初回認証日時</th>
                                <th width="100px">失効日</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="s_info_center"><?php echo Func::h($account["id"]); ?></td>
                                <td class="s_info_center"><?php echo Func::h($account["decripted_login_id"]); ?></td>
                                <td class="s_info_center"><?php echo Func::h($account["decripted_password"]); ?></td>
                                <td class="s_info_center"><?php echo Func::h($account["market_name"]); ?></td>
                                <td class="s_info_center"><?php echo Func::h($account["start_date"]); ?></td>
                                <td class="s_info_center"><?php echo Func::h($account["init_auth_datetime"]); ?></td>
                                <td class="s_info_center"><?php echo Func::h($account["end_date"]); ?></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
        <!-- /パネル -->

        <?php if(!empty($listened_time)): ?>
        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:auto;">
            <div class="panel" style="padding-top:25px;">
                <div class="panel-title">視聴履歴　<button id="bt_download" class="bt_mini" style="margin: 10px 0 1px;">視聴履歴をダウンロードする</button></div>
                <div class="unit" style="margin: 10px 0 0 0 ;padding:0 10px 10px 10px;">
                <?php if (!empty($listened_time['error'])): ?>
                    <?php echo '<span class="color_red" style="margin-left:20px; font-weight:bold;">&#8251;' . Func::h($listened_time['error']) . '</span>'; ?>
                <?php else: ?>
                    <?php foreach ($listened_time as $month): ?>
                    <table id="grid3" class="nogrid_table" style="width:15%;table-layout:auto;float:left;margin-left: 10px; ">
                        <thead>
                            <tr>
                                <th width="35px"><?php echo Func::h($month['date_view']); ?></th>
                                <th width="35px">ご利用時間</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="underline">
                                <th>Total</th>
                                <td style="font-weight:bold;text-align:right;"><?php echo Func::h($month['total_view']); ?></td>
                            </tr>
                            <?php foreach($month['days'] as $day): ?>
                            <tr>
                                <th><?php echo Func::h($day['day_view']); ?></th>
                                <td style="text-align:right;"><?php echo Func::h($day['total_view']); ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <?php endforeach; ?>
                <?php endif; ?>
                </div>
            </div>
        </div>
        <!-- /パネル -->
        <?php endif; ?>

        <form id="fr_back" action="/dedicated/trial_search" method="POST">
            <input type="hidden" name="type" value="search" />
            <input type="hidden" name="login_id" value="<?php echo Func::h($this->RequestPost["login_id"]); ?>" />
            <input type="hidden" name="market_id" value="<?php echo Func::h($this->RequestPost["market_id"]); ?>" />
            <input type="hidden" name="start_from" value="<?php echo Func::h($this->RequestPost["start_from"]); ?>" />
            <input type="hidden" name="start_to" value="<?php echo Func::h($this->RequestPost["start_to"]); ?>" />
            <input type="hidden" name="init_from" value="<?php echo Func::h($this->RequestPost["init_from"]); ?>" />
            <input type="hidden" name="init_to" value="<?php echo Func::h($this->RequestPost["init_to"]); ?>" />
        </form>

        <form id="fr_download" action="/dedicated/trial_listened_time_download" method="POST">
            <input type="hidden" name="account_id" value="<?php echo Func::h($account["id"]); ?>" />
        </form>

    </div><!-- /メインパネル -->

</div><!-- /メイン -->
<?php
include(TPL_DIR . DS . "common" . DS . "footer.tpl");
