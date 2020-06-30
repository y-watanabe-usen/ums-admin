<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "no_menu.tpl"); ?>
<script type="text/javascript">
//<![CDATA[
(function($) {
    $(function() {
        $("#bt_login").click(function() {
            $("#fr_login").submit();
        });
    });
})(jQuery);
//]]>
</script>

<!-- メイン -->
<div class="main">

    <!-- メインパネル -->
    <div class="main-panel">
        <div class="main-title" style="margin: auto; width:180px;">ログイン</div>

        <form id="fr_login" action="/login" method="POST">

        <!-- パネル -->
        <div class="panel-base" style="margin: auto; width:180px;height:210px;">
            <div id="p0" class="panel">

                <div id="p1" class="unit" style="padding:5px 20px 10px 20px;">
                    <table style="width:120px;">
                        <tr>
                            <td style="width: 120px; text-align: left;">社員番号</td>
                        </tr>
                        <tr>
                            <td style="text-align: left;"><input type="text" name="code" style="width:120px;"></td>
                        </tr>
                        <tr>
                            <td style="width: 120px; text-align: left;">パスワード</td>
                        </tr>
                        <tr>
                            <td style="text-align: left;"><input type="password" name="password" style="width:120px;"></td>
                        </tr>
                        <tr>
                            <td style="text-align: center; padding-top: 10px;"><button id="bt_login" class="detail">ログイン</button></td>
                        </tr>
                        <tr>
                            <td style="text-align: center; color: red;"><?php echo $errorMessage; ?></td>
                        </tr>
                    </table>
                </div>

            </div>
        </div>
        <!-- /パネル -->
        
        </form>

    </div><!-- /メインパネル -->

</div><!-- /main -->

<?php include(TPL_DIR . DS . "common" . DS . "footer.tpl"); ?>
