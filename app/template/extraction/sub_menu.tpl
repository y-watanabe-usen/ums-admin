<div style="float:left;width:200px;height:100%;box-sizing: border-box;-moz-box-sizing: border-box;margin:0;">

<!-- パネル1 -->
<div class="panel-base" style="width:200px;height:100%;float:left;">
<div class="sidemenu-panel">
<div class="sidemenu-title">メニュー</div>
<ul>
<?php
$sub_menu = array(
    array("url" => "/extraction/inited_cust_cd_download/", "name" => "初回認証済顧客抽出", "action" => "inited_cust_cd_download"),
    array("url" => "/extraction/issue_history_download/", "name" => "アカウント証発送履歴抽出", "action" => "issue_history_download"),
    array("url" => "/extraction/id_pw_download/", "name" => "ID/PW抽出（顧客CD指定）", "action" => "id_pw_download"),
    array("url" => "/extraction/mail_address_init_import/", "name" => "メールアドレス初回登録・仮ID/PW抽出", "action" => "mail_address_init_import"),
    array("url" => "/extraction/chain_store_bulk_regist/", "name" => "USEN CART書面契約済顧客用<br>メールアドレス登録・ID/PW抽出", "action" => "chain_store_bulk_regist"),
);
foreach ($sub_menu as $val) {
    if ($this->Acl->check($this->Auth->user("role_id"), $val["url"])) {
        if ($val["action"] == $this->action) {
            echo '<li class="sidemenu-active"><a href="' . $val["url"] . '">' . $val["name"] . '</a></li>';
        } else {
            echo '<li class="sidemenu-item"><a href="' . $val["url"] . '">' . $val["name"] . '</a></li>';
        }
    }
}
?>
</ul>
</div>
</div>
<!-- /パネル1 -->

</div>
