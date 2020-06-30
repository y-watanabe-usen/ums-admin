<div style="float:left;width:200px;height:100%;box-sizing: border-box;-moz-box-sizing: border-box;margin:0;">

<!-- パネル1 -->
<div class="panel-base" style="width:200px;height:100%;float:left;">
<div class="sidemenu-panel">
<div class="sidemenu-title">メニュー</div>
<ul>
<?php
$sub_menu = array(
     array("url" => "/dedicated/trial_search/", "name" => "お試しアカウント検索", "action" => "trial_search")
    ,array("url" => "/dedicated/trial_create/", "name" => "お試しアカウント発行", "action" => "trial_create")
    ,array("url" => "/dedicated/trial_download/", "name" => "お試しアカウントダウンロード", "action" => "trial_download")
    ,array("url" => "/dedicated/demo_search/", "name" => "デモアカウント検索", "action" => "demo_search")
    ,array("url" => "/dedicated/demo_create/", "name" => "デモアカウント発行", "action" => "demo_create")
    ,array("url" => "/dedicated/demo_download/", "name" => "デモアカウントダウンロード", "action" => "demo_download")
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
