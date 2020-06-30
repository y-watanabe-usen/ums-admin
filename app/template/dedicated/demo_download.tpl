<?php include(TPL_DIR . DS . "common" . DS . "header.tpl"); ?>
<?php include(TPL_DIR . DS . "common" . DS . "menu.tpl"); ?>
<script type="text/javascript">
//<![CDATA[
(function($) {
    $(function() {
        $('#grid1').usengrid({
            width:"100%",
            height:"100%",
            resize:false,
            hcolor:"blue",
            column:[{"name":"name"},{"name":"time"},{"name":"size","style":"text-align:right;"},{"name":"","style":"text-align:center;"}],
            data:<?php echo json_encode($file_list); ?>,
            custom: function(v, l, i, j) {
                if (j == 3) {
                    return '<button class="bt_mini bt_dl" name="' + i + '">ダウンロード</button>';
                }
                return v;
            }
        });
        //ダウンロードボタン
        $("#grid1").on("click", ".bt_dl", function() {
            $('#fr_dl input[name="type"]').val("publish");
            $('#fr_dl input[name="id"]').val($(this).attr("name"));
            $("#fr_dl").submit();
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
<div class="main-title" style="left:210px;">デモアカウントダウンロード</div>

<!-- パネル2 -->
<div class="panel-base" style="height:100%;width:100%;overflow:hidden;">
<div class="panel">
<table style="padding:0;margin:0;position:absolute;top:0;">
    <tr>
        <td id="dl_message" style="height:20px;color:red;"><?php echo $err_message; ?></td>
    </tr>
</table>

<!-- ユニット -->
<div class="unit" style="padding:5px 20px 10px 20px;height:100%;">
<table id="grid1">
<thead>
    <tr>
        <th width="250px">ファイル名</th>
        <th width="180px">出力日時</th>
        <th width="150px">サイズ</th>
        <th width="150px"></th>
    </tr>
</thead>
<tbody>
</tbody>
</table>

</div>
<!-- /ユニット -->

<form id="fr_dl" action="/dedicated/demo_download" method="POST">
    <input type="hidden" name="type" value="" />
    <input type="hidden" name="id" value="" />
</form>

</div>
</div>
<!-- /パネル2 -->

</div>
<!-- /right -->

</div><!-- /メインパネル -->

</div><!-- /main -->
