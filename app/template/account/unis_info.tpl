        <!-- パネル -->
        <div class="panel-base" style="width:100%;height:auto;">
            <div class="panel" style="padding-top:25px;">
                <div class="panel-title">UNIS情報</div>

                <div class="unit" style="width:50%;padding:10px 10px 10px 10px;float:left;">
                    <table id="grid_unis1">
                        <thead>
                            <tr>
                                <th width="130px">項目</th>
                                <th width="422px">値</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>顧客CD</td>
                                <td><?php echo Func::h($unis_info["cust_cd"]); ?></td>
                            </tr>
                            <tr>
                                <td>設置先名称</td>
                                <td><?php echo !empty($unis_info["name"]) ? Func::h($unis_info["name"]) . "(" . Func::h($unis_info["name_kana"]) . ")" : ""; ?></td>
                            </tr>
                            <tr>
                                <td>顧客ステータス</td>
                                <td><?php echo Func::h($unis_info["status_flag_name"]); ?></td>
                            </tr>
                            <tr>
                                <td>設置先住所</td>
                                <td><?php echo Func::h("〒" . $unis_info["zip_cd"] . " " . $unis_info["address1"] . $unis_info["address2"] . $unis_info["address3"]); ?></td>
                            </tr>
                            <tr>
                                <td>設置先電話番号</td>
                                <td><?php echo Func::h($unis_info["tel"]); ?></td>
                            </tr>
                            <tr>
                                <td>管轄支店</td>
                                <td><?php echo !empty($unis_info["branch_name"]) ? Func::h($unis_info["branch_name"] . "(" . $unis_info["branch_cd"] . ")") : ""; ?></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- /ユニット -->

                <div class="unit" style="width:47%;padding:10px 10px 10px 10px;float:left;">
                    <table id="grid_unis2">
                        <thead>
                            <tr>
                                <th width="130px">項目</th>
                                <th width="422px">値</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>チェーン店</td>
                                <td><?php echo !empty($unis_info["chain_name"]) ? Func::h($unis_info["chain_name"] . "(" . $unis_info["chain_cd"] . ")") : ""; ?></td>
                            </tr>
                            <tr>
                                <td>業種</td>
                                <td><?php echo !empty($unis_info["industry_name"]) ? Func::h($unis_info["industry_name"] . "(" . $unis_info["industry_cd"] . ")") : ""; ?></td>
                            </tr>
                            <tr>
                                <td>新設年月日</td>
                                <td><?php echo Func::h($unis_info["start_date"]); ?></td>
                            </tr>
                            <tr>
                                <td>解約日</td>
                                <td><?php echo Func::h($unis_info["end_date"]); ?></td>
                            </tr>
                            <tr>
                                <td>キャンセル日</td>
                                <td><?php echo Func::h($unis_info["cancel_date"]); ?></td>
                            </tr>
                            <tr>
                                <td>最終更新日</td>
                                <td><?php echo Func::h($unis_info["updated"]); ?></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- /ユニット -->

            </div>
        </div>
        <!-- /パネル -->
