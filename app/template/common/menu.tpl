<script type="text/javascript">
//<![CDATA[
(function($) {
    $(function() {
        $('#header_icon_logout').click(function() {
            if (!confirm("ログアウトしますか？")) {
                return false;
            } else {
                window.location.href = "/logout";
            }
        });
    });
})(jQuery);
//]]>
</script>
<div class="csstitle">
    <h3 style="text-align:left;padding-left:10px;"><?php echo Configure::read('WEB_NAME'); ?></h3>
    <div style="position: absolute; top: 5px; right: 170px;"><?php echo $this->Auth->user("organization_name"); ?>　<font style="font-size:14px;"><?php echo $this->Auth->user("last_name") . " " . $this->Auth->user("first_name"); ?></font></div>
    <div style="position: absolute; top: 5px; right: 15px;">
        <table>
            <tr>
                <td style="width:108px;">
                    <div id="header_icon_logout"><button>ログアウト</button></div>
                </td>
            </tr>
        </table>
    </div>

    <div class="cssmenu">
        <ul>
        <?php
        $menu = array(
            array("url" => "/account/search/", "name" => "アカウント管理", "controller" => "Account"),
            array("url" => "/issue/", "name" => "発送管理", "controller" => "Issue"),
            array("url" => "/extraction/", "name" => "データ抽出", "controller" => "Extraction"),
            array("url" => "/dedicated/", "name" => "お試し/デモ管理", "controller" => "Dedicated"),
            array("url" => "/branch/", "name" => "支店別顧客管理", "controller" => "Branch"),
            array("url" => "/bulk/", "name" => "一括処理", "controller" => "Bulk"),
            array("url" => "/role/", "name" => "権限管理", "controller" => "Role"),
        );
        foreach ($menu as $val) {
            if ($this->Acl->check($this->Auth->user("role_id"), $val["url"])) {
                if ($val["controller"] == $this->controller) {
                    echo '<li class="active"><a href="' . $val["url"] . '">' . $val["name"] . '</a></li>';
                } else {
                    echo '<li><a href="' . $val["url"] . '">' . $val["name"] . '</a></li>';
                }
            }
        }
        ?>
        </ul>
    </div>
</div>
