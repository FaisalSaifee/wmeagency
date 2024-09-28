<?php
/**
 * @file
 * Template to display a view as a table.
 *
 * - $title : The title of this group of rows.  May be empty.
 * - $header: An array of header labels keyed by field id.
 * - $caption: The caption for this table. May be empty.
 * - $header_classes: An array of header classes keyed by field id.
 * - $fields: An array of CSS IDs to use for each field id.
 * - $classes: A class or classes to apply to the table, based on settings.
 * - $row_classes: An array of classes to apply to each row, indexed by row
 *   number. This matches the index in $rows.
 * - $rows: An array of row items. Each row is an array of content.
 *   $rows are keyed by row number, fields within rows are keyed by field ID.
 * - $field_classes: An array of classes to apply to each field, indexed by
 *   field id, then row number. This matches the index in $rows.
 * @ingroup views_templates
 */
global $base_url, $engagement_college_tid, $engagement_corp_private_events_tid, $engagement_fairs_tid, $engagement_festivals_tid, $engagement_podcasts_tid;
if (isset($_REQUEST['field_music_engagement_types_tid']) && ($_REQUEST['field_music_engagement_types_tid'] != "All")) {
    $selling_point = 1;
    $grid_hide = "";
} else {
    $selling_point = 0;
    $grid_hide = "hide";
}
if (trim($title) == "#") {
    $layout_class = "layout-container-2";
} else {
    $layout_class = "layout-container";
}
$i = 0;
$j = 0;
?>
<div class="<?php print $layout_class; ?>">
    <div class="view-wrapper list-view hide">
        <!-- repeat each-list -->
        <div class="each-list">
            <div class="character-lable <?php print trim(ucfirst($title)); ?>"><?php print $title; ?></div>
            <div class="list-row row <?php print trim(ucfirst($title)); ?>">
                <!-- repeat each-items -->
                <?php foreach ($rows as $row_count => $row): ?>
                    <?php
                    $uid = $row['uid'];
                    $music_user = user_load($uid);
                    $connect_id = $music_user->field_azure_connect_id['und'][0]['value'];
                    //$href = url("Music/" . variable_get( 'mpid_' . $connect_id ), array("query" => array("layout" => "list","width"=>"1230","height"=>"100%")));
                    $href = url("Music/" . variable_get('mpid_' . $connect_id), array(
                        "query" => array(
                            "layout" => "list",
                            "width" => "1230",
                            "height" => "100%",
                            "client_profile" => "true"
                        )
                    ));
                    $name = ($row['field_profile_display_name'])?$row['field_profile_display_name']:$row['title'];
                    ?>
                    <div id="profile-list-<?php print $connect_id ?>" class="each-items col-lg-2 col-md-3 col-sm-6 col-xs-12"><a href='<?php print $href; ?>' class="each-name" rel="lightframe" title="<?php echo $name; ?>"><?php print $name; ?></a></div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <div class="view-wrapper grid-view <?php print $grid_hide; ?>">
        <!-- repeat each-list -->
        <div class='each-list'>
            <div class='character-lable <?php print trim(ucfirst($title)); ?>'><?php print strtoupper($title); ?></div>
            <div class='list-row row <?php print trim(ucfirst($title)); ?>'>
                <!-- repeat each-items -->
                <?php foreach ($rows as $row_count => $row): ?>
                    <?php
                    if ($_SESSION['screen_width'] >= 1200) {
                        if ($i%5 == 0) {
                            $j++;
                        }
                    } else {
                        if ($i%4 == 0) {
                            $j++;
                        }
                    }
                    $i++;
                    //print_r($row);
                    //die();
                    $uid = $row['uid'];
                    $music_user = user_load($uid);
                    $connect_id = $music_user->field_azure_connect_id['und'][0]['value'];
                    $href = url("Music/" . variable_get( 'mpid_' . $connect_id ), array("query" => array("layout" => "grid","width"=>"1230","height"=>"100%","client_profile"=>"true")));
                    $profile_pic_from = $row['field_profile_pic_from'];
                    if(!empty($music_user->picture)) {
                        $pic_url = image_style_url("image_profile_custom", $music_user->picture->uri);
                    } else {
                        $pic_url = $base_url . "/sites/all/themes/talento_theme/images/user_pic-225x225.png";
                    }
                    $name = ($row['field_profile_display_name'])?$row['field_profile_display_name']:$row['title'];
                    ?>
                    <div id='profile-grid-<?php print $connect_id ?>' class='each-items each-preload-<?php print $j; ?> col-lg-2 col-md-3 col-sm-3 col-xs-4'>
                        <!-- Visible in large screens starts -->
                        <div class='each-grid visible-md visible-lg'>
                            <a href='<?php print $href; ?>' rel="lightframe" class="popout-link">
                                <div class='grid-img'>
                                    <img class='img-responsive' src='<?php print htmlspecialchars($pic_url, ENT_QUOTES); ?>' alt='<?php print $name; ?>'>
                                </div>
                                <div class='grid-title' title="<?php print $name; ?>" display_name="<?php print $row['field_profile_display_name']; ?>"><?php print $name; ?></div>
                            </a>
                            <?php if ($selling_point == 1): ?>
                                <?php
                                $grid_desc = "";
                                switch ($_REQUEST['field_music_engagement_types_tid']) {
                                    case $engagement_college_tid:
                                        if(strtotime($row['field_college_sp_expires'])>strtotime(date('Y-m-d'))){
                                            $grid_desc = $row['field_college_selling_point'];
                                        }
                                        break;
                                    case $engagement_corp_private_events_tid:
                                        if(strtotime($row['field_corp_pvt_events_sp_expires'])>strtotime(date('Y-m-d'))){
                                            $grid_desc = $row['field_corp_private_events_sellin'];
                                        }
                                        break;
                                    case $engagement_fairs_tid:
                                        if(strtotime($row['field_fairs_sp_expires'])>strtotime(date('Y-m-d'))){
                                            $grid_desc = $row['field_fairs_selling_point'];
                                        }
                                        break;
                                    case $engagement_festivals_tid:
                                        if(strtotime($row['field_festivals_sp_expires'])>strtotime(date('Y-m-d'))){
                                            $grid_desc = $row['field_festivals_selling_point'];
                                        }
                                        break;
                                    case $engagement_podcasts_tid:
                                        if(strtotime($row['field_podcasts_sp_expires'])>strtotime(date('Y-m-d'))){
                                            $grid_desc = $row['field_podcasts_selling_point'];
                                        }
                                        break;
                                    default:
                                }
                                ?>
                            <?php endif; ?>
                        </div>
                        <!-- Visible in large screens ends -->
                        <?php
                        //Visible in tab/small screens starts
                        print "<a href='$href' class='' rel='lightmodal' ><div class='list-img  visible-xs visible-sm'><img class='img-responsive' src='$pic_url' alt='$name'></div>";
                        print "<div class='list-content visible-xs visible-sm'><div class='list-title'>$name</div><div class='list-desc'>$grid_desc</div></div></a>";
                        //Visible in tab/small screens ends
                        ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>
