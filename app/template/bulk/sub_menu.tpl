<div style="float:left;width:200px;height:100%;box-sizing: border-box;-moz-box-sizing: border-box;margin:0;">

<!-- パネル1 -->
<div class="panel-base" style="width:200px;height:100%;float:left;">
<div class="sidemenu-panel">
<div class="sidemenu-title">メニュー</div>
<ul>
<?php
$sub_menu = array(
    array("url" => "/bulk/services/", "name" => "サービス一括強制施錠／開錠", "action" => "services"),
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
