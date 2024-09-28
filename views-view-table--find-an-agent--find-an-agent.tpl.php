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

?>
<div id="toggle-<?php print $title; ?>" class='mobile-region-lists hide'>
    <div class='map-mobile-btn visible-xs visible-sm'>
        <div class='icon-map_reset map-reset-btn hide'></div>
        <div class='mobile-text'>Pinch to zoom</div>
        <div class='icon-List-View region-list-btn'></div>
    </div>
    <div class="regions-listing-slider no-add-region">
        <?php foreach ($rows as $row_count => $row):?>
            <div class="each-region">
                <div class="region-title">
                    <div class="region-color"><?php print $row['field_region_color']; ?></div>
                    <div class="region-name"><?php print $row['title']; ?></div>
                </div>
                <div class="region-locations">
                    <?php
                    $region_arr = explode(", ", $row['field_music_zoom_zones']);
                    $exclude_zoom_zones = array('United States', 'Canada', 'South America', 'Caribbean', 'Central America/Mexico', 'Europe', 'Africa', 'Middle East', 'Asia', 'Oceania');
                    $regions = array();
                    $regionChildCount = array();
                    $oldregion = 0;
                    foreach($region_arr as $region){
                        $regionData = explode('-', $region);
                        if(in_array($regionData[1],$exclude_zoom_zones)){
                            $oldregion = $region;
                            $regionChildCount[$oldregion] = count(taxonomy_get_children($regionData[0]));
                        }else{
                            $regions[$oldregion][] = $regionData[1];
                        }
                    }
                    $regionParent = array();
                    $regionChild = array();
                    foreach($regions as $key=>$childRegion){
                        if(count($childRegion) == $regionChildCount[$key]){
                            $keyData = explode('-', $key);
                            $regionParent[] = $keyData[1];
                        }else{
                            $regionChild = array_merge($regionChild,$childRegion);
                        }
                    }
                    $region_arr = $full_region_arr = array_merge($regionParent,$regionChild);
                    sort($region_arr);
                    sort($full_region_arr);
                    $count = count($region_arr) - 4;
                    $more_left = count($region_arr) - 3;
                    $region_arr = array_slice($region_arr, 0, 3);
                    $more_regions = '';
                    if ($count > 0) {
                        $more_regions = ', +' . $more_left . 'more';
                    }
                    ?>
                    <?php if ($count > 0): ?>
                        <div id="striplist-<?php print $row['nid']; ?>" class="location-names"><?php print implode(", ", $region_arr) . $more_regions; ?></div>
                    <?php elseif ($count == 0): ?>
                        <div id="striplist-<?php print $row['nid']; ?>" class="location-names"><?php print implode(", ", $full_region_arr); ?></div>
                    <?php else: ?>
                        <div id="striplist-<?php print $row['nid']; ?>" class="location-names"><?php print implode(", ", $region_arr); ?></div>
                    <?php endif; ?>

                    <?php if (!empty(trim($row['field_music_zoom_zones']))) :?>
                        <div id="showlist-<?php print $row['nid']; ?>" class="location-names hide"><?php print implode(', ', $full_region_arr); ?></div>
                        <?php if ($count > 0): ?>
                            <div class="location-list"><a id="regionlist-<?php print $row['nid']; ?>" class="show-full-list">Show full list</a></div>
                        <?php endif; ?>
                    <?php endif; ?>
                </div>
                <div class="agent-info-wrapper">
                    <div class='co-ordinates hide'></div>
                    <?php
                    $bcc_mail = variable_get('bcc_mail_region');
                    $agents = explode(",", $row['field_music_agents']);
                    $group_email = $row['field_group_email'];
                    foreach ($agents as $agent_id) {
                        $agent = node_load($agent_id);
                        $agent_email = $agent->field_email_id['und']['0']['value'];
                        $agent_phone = $agent->field_phone_no['und']['0']['value'];
                        $agent_phone = ($agent_phone == '+1')?'':$agent_phone;
                        $status = $agent->field_agent_status['und'][0]['value'];
                        $region= $row['title'];
                        $region = rawurlencode(str_replace("&#039;", "'",htmlspecialchars_decode($region)));
                        $term = taxonomy_term_load($title);
                        $name = $term->name;
                        $name = rawurlencode(str_replace("&#039;", "'",htmlspecialchars_decode($name)));
                        print '<div class="agent-info">';
                        if ($status == 2) {
                            print "<div class='each-name'><span>$agent->title</span><span class='inactive-status'>Inactive Agent</span></div>";
                        } else {
                            print "<div class='each-name'>$agent->title</div>";
                        }
                        print "<div class='each-info'>";
                        print "<div class='agent-email'><a href='mailto:$agent_email?subject=$region | $name&bcc=$bcc_mail'>$agent_email</a></div>";
                        print "<div class='agent-phone'><a href='tel:$agent_phone'>$agent_phone</a></div>";
                        print "</div>";
                        print "</div>";
                    }
                    if(!empty($group_email)) {
                        print "<div class='view-group-info'>";
                        print "<div class='group-label'>Group email</div>";
                        print "<div class='group-email'><a href='mailto:$group_email'>$group_email</a></div>";
                        print "</div>";
                    }
                    ?>
                </div>
                <div id="pop-<?php print $row['nid']; ?>" class="custom-popup">
                    <div class='co-ordinates hide'></div>
                    <?php
                    $bgcolor = $row['field_region_color_1'];
                    print "<div class='tt_name_sm hidden-xs hidden-sm'>" . $row['title'] . "<span class='icon-lightbox_x close-custom-popup'></span></div>";
                    print "<div class='tt_name_sm visible-xs visible-sm' style='background-color:$bgcolor;'>" . $row['title'] . "</div>";
                    print "<span class='icon-small_x visible-xs visible-sm'></span>";
                    print "<div class='map-popup-content'>";
                    print "<div class='state-name'></div>";
                    $agents = explode(",", $row['field_music_agents']);
                    $group_email = $row['field_group_email'];
                    foreach ($agents as $agent_id) {
                        $agent = node_load($agent_id);
                        $agent_email = $agent->field_email_id['und']['0']['value'];
                        $agent_phone = $agent->field_phone_no['und']['0']['value'];
                        $agent_phone = ($agent_phone == '+1')?'':$agent_phone;
                        $status = $agent->field_agent_status['und'][0]['value'];

                        $region= $row['title'];
                        $region = rawurlencode(str_replace("&#039;", "'",htmlspecialchars_decode($region)));
                        $term = taxonomy_term_load($title);
                        $name = $term->name;
                        $name = rawurlencode(str_replace("&#039;", "'",htmlspecialchars_decode($name)));


                        print "<div class='each-agent'>";
                        print "<div class='each-name'>$agent->title</div>";
                        print "<div class='agent-phone'><a href='tel:$agent_phone'> 456$agent_phone</a></div>";
                        print "<div class='agent-email'><a href='mailto:$agent_email?subject=$region | $name&bcc=$bcc_mail'>$agent_email</a></div>";
                        print "</div>";
                    }
                    if(!empty($group_email)) {
                        print "<div class='view-group-info'>";
                        print "<div class='group-email'><a href='mailto:$group_email'>Group email: $group_email</a></div>";
                        print "</div>";
                    }
                    print "</div>";
                    ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>






