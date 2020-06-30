<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<?php
$inputedFrom = isset($this->RequestPost['from']) ? $this->RequestPost['from'] : '';
$inputedTo = isset($this->RequestPost['to']) ? $this->RequestPost['to'] : '';
$selectedService = isset($this->RequestPost['service']) ? $this->RequestPost['service'] : '100';
?>
<script type="text/javascript">
//<![CDATA[
(function($) {
    $(function() {
        $(".datepicker").datepicker();

        $("#bt_last_month").click(function() {
            var date = new Date();
            var from = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            var to = new Date(date.getFullYear(), date.getMonth(), 0);
            $("#from").val(dateFormat(from));
            $("#to").val(dateFormat(to));
            return false;
        });

        $("#bt_this_month").click(function() {
            var date = new Date();
            var from = new Date(date.getFullYear(), date.getMonth(), 1);
            var to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            $("#from").val(dateFormat(from));
            $("#to").val(dateFormat(to));
            return false;
        });

        $("#bt_download").click(function() {
            $("#dl_message").text("");
        });

        function dateFormat(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            if (month < 10) { month = '0' + month; }
            if (day < 10) { day = '0' + day; }
            return year + '/' + (month) + '/' + day;
        }

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
<div style="width:auto;height:100%;box-sizing: border-box;-moz-box-sizing: border-box;margin:0;padding-top:28px;overflow:hidden;">
<div class="main-title" style="left:210px;">初回認証済顧客抽出</div>

<!-- パネル2 -->
<div class="panel-base" style="height:250px;width:100%;overflow:hidden;">
<div class="panel">

<!-- ユニット -->
<div class="unit" style="padding:53px 20px 10px 20px;height:100%;">
<form id="fr_dl" action="/extraction/inited_cust_cd_download" method="POST">
<input type="hidden" name="type" value="download" />
<table style="padding:0;margin:0;position:absolute;top:0;">
    <tr>
        <td colspan="2" style="height: 40px; vertical-align: top;">初回認証日のFrom~Toとサービスを入力してダウンロードしてください。</td>
    </tr>
    <tr>
        <td style="width: 130px; height: 30px;">初回認証日</td>
        <td>
            <input id="from" type="text" name="from" class="datepicker" style="width:120px;" value="<?php echo $inputedFrom; ?>">&nbsp;～&nbsp;
            <input id="to" type="text" name="to" class="datepicker" style="width:120px;" value="<?php echo $inputedTo; ?>">
            <button id="bt_last_month" class="bt_mini" style="width: 70px;">先月</button>
            <button id="bt_this_month" class="bt_mini" style="width: 70px;">今月</button>
        </td>
    </tr>
    <tr>
        <td style="width: 130px; height: 30px;"><span class="required">サービス</span></td>
        <td>
            <select name="service">
            <?php foreach ($serviceList as $val) { ?>
                <option value="<?php echo $val["service_cd"]; ?>" <?php echo $selectedService === $val["service_cd"] ? "selected" : ""; ?>><?php echo $val["service_name"]; ?></option>　
            <?php } ?>
            </select>
        </td>
    </tr>
    <tr>
        <td colspan="2" id="dl_message" style="height:20px;color:red;"><?php echo nl2br($err_message); ?></td>
    </tr>
    <tr>
        <td><button id="bt_download" class="bt_mini" style="width: 70px;">ダウンロード</button></td>
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
