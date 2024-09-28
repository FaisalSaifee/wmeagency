<?php
global $base_url;
unset($form['title']['#title']);
$cat_id = $_SESSION['field_music_category_tid'];
$default_color = $form['field_region_color']['und'][0]['rgb']['#value'];
$default_color_arr = array(
    "#F28258" => "Apricot",
    "#9D9D5F" => "Avocado",
    "#1A6EBA" => "Azure",
    "#1E152A" => "Blackcurrant",
    "#1C739D" => "Blue",
    "#E25656" => "Cherry",
    "#3D8AD0" => "Curious Blue",
    "#198b19" => "Dark Green",
    "#660000" => "Dark Red",
    "#FF007E" => "Deep Pink",
    "#C13377" => "Fuscia",
    "#FFC45C" => "Gold",
    "#73519B" => "Indigo",
    "#AED4F5" => "Light Blue",
    "#829AD8" => "Lilac",
    "#9AA899" => "Mantle",
    "#D9ACF7" => "Mauve",
    "#90D591" => "Mint",
    "#667B7C" => "Nevada",
    "#666600" => "Olive",
    "#EA5E82" => "Rose",
    "#0C5587" => "Royal Blue",
    "#FFC0EB" => "Pink",
    "#0FBCBC" => "Teal",
    "#FFFF9A" => "Yellow",
    // New Colors
    "#FFA500" => "Orange",
    "#800080" => "Purple",
    "#00FFFF" => "Cyan",
    "#FF6347" => "Tomato",
    "#4682B4" => "Steel Blue",
    "#2E8B57" => "Sea Green",
    "#A52A2A" => "Brown",
    "#8B4513" => "Saddle Brown",
    "#FFD700" => "Goldenrod",
    "#B22222" => "Firebrick",
    "#8A2BE2" => "Blue Violet",
    "#00FA9A" => "Medium Spring Green",
    "#DC143C" => "Crimson",
    "#7FFF00" => "Chartreuse",
    "#FF4500" => "Orange Red",
    "#DA70D6" => "Orchid",
    "#EE82EE" => "Violet",
    "#98FB98" => "Pale Green",
    "#AFEEEE" => "Pale Turquoise",
    "#DB7093" => "Pale Violet Red",
    "#FFE4B5" => "Moccasin",
    "#FFDAB9" => "Peach Puff",
    "#FF69B4" => "Hot Pink",
    "#8B008B" => "Dark Magenta",
    "#556B2F" => "Dark Olive Green",
    "#FF8C00" => "Dark Orange",
    "#9932CC" => "Dark Orchid",
    "#8FBC8F" => "Dark Sea Green",
    "#483D8B" => "Dark Slate Blue",
    "#2F4F4F" => "Dark Slate Gray",
    "#00CED1" => "Dark Turquoise",
    "#9400D3" => "Dark Violet",
    "#FF1493" => "Deep Pink",
    "#00BFFF" => "Deep Sky Blue",
    "#696969" => "Dim Gray",
);
if (!empty($form['nid']['#value'])) {
    $nid = $form['nid']['#value'];
    $query = "SELECT rc.field_region_color_rgb FROM field_data_field_region_color rc INNER JOIN field_data_field_music_category mc ON mc.entity_id = rc.entity_id INNER JOIN node n ON n.nid = rc.entity_id WHERE n.nid != $nid AND mc.field_music_category_tid = $cat_id";
    $delete_region = l("Delete", "Music/delete-region/nojs/$nid", array("attributes" => array("class" => "ctools-use-modal btn-success modal-btn btn btn btn-default")));
    $url = url("Music/delete-region/nojs/$nid");
    $query2 = "SELECT zz.field_music_zoom_zones_tid FROM field_data_field_music_zoom_zones zz INNER JOIN field_data_field_music_category mc ON mc.entity_id = zz.entity_id WHERE zz.bundle= 'music_regions' AND zz.entity_id != $nid AND mc.field_music_category_tid = $cat_id";
    $used_regions = db_query($query2)->fetchCol();     
} else {
    $nid="new";
    $query = "SELECT rc.field_region_color_rgb FROM field_data_field_region_color rc INNER JOIN field_data_field_music_category mc ON mc.entity_id = rc.entity_id INNER JOIN node n ON n.nid = rc.entity_id WHERE mc.field_music_category_tid = $cat_id";
    $delete_region = "";
    $url = "";
    $query2 = "SELECT zz.field_music_zoom_zones_tid FROM field_data_field_music_zoom_zones zz INNER JOIN field_data_field_music_category mc ON mc.entity_id = zz.entity_id WHERE zz.bundle= 'music_regions' AND mc.field_music_category_tid = $cat_id";
    $used_regions = db_query($query2)->fetchCol(); 
}
print "<div class='hide current-region-nid'>$nid</div>";
$nid  = $form['nid']['#value'];
$node = node_load($nid);
?>
<div class="add-agent-form">
    <div class="form-content">
        <div class="field-wrapper">            
            <div class="field-name">Region name</div>
            <?php print render($form['title']); ?>     
            <div class="custom-error red-label region-name hide">Region name is required.</div>
            <div class="custom-error red-label region-duplicate-name hide">Duplicate region name not allowed.</div>
        </div>
        <div class="field-wrapper">
            <div class="field-name">Color</div>
            <div class="select-colors">
                <div class="select-dropdown-head">
                    <?php if (!empty($default_color)): ?>
                        <span class='selected-color'><span class='color-sqr' style='background-color:<?php print $default_color; ?>'></span><span class='color-name'><?php print $default_color_arr[$default_color]; ?></span></span>
                    <?php else: ?>
                        <span class='selected-color'>Select a color</span> 
                    <?php endif; ?>
                    <span class="icon-Arrow-Down"></span>
                </div>
                <ul class="select-dropdown-list">
                    <?php
                    $used_colors = db_query($query)->fetchCol(); 
                    foreach ($default_color_arr as $color_code => $color) {
                        if (!in_array($color_code, $used_colors) || ($default_color == $color_code)) {
                            ?>
                            <li class="each-select-item" id="<?php print $color_code; ?>"><span class='color-sqr' style='background-color:<?php print $color_code; ?>'></span><span class='color-name'><?php print $color; ?></span></li>
                            <?php
                        }
                    }
                    ?>
                </ul>
            </div>           
            <!-- same as other dropdowns-->
            <div class="custom-error red-label region-clr hide">Region color is required.</div>
        </div>
        <div class="agent-details">
            <div class="form-section-head">
                <div class="form-section-title">AGENTS</div>
                <?php
                if (!empty($form['nid']['#value'])) {
                    $link1 = l("", "Music/edit-agents-for-region/nojs/$nid", array('attributes' => array('class' => 'icon-pen ctools-use-modal edit-agent-link')));
                    $link2 = l("Edit Agents", "Music/edit-agents-for-region/nojs/$nid", array('attributes' => array('class' => 'ctools-use-modal edit-agent-link')));
                } else {
                    $link1 = l("", "Music/edit-agents-for-region/nojs/new", array('attributes' => array('class' => 'icon-pen ctools-use-modal edit-agent-link')));
                    $link2 = l("Edit Agents", "Music/edit-agents-for-region/nojs/new", array('attributes' => array('class' => 'ctools-use-modal edit-agent-link')));
                } 
                
                if (!empty($form['nid']['#value'])) {
                    if(empty($node->field_music_agents['und'])) {
                        $link1 = l("", "Music/add-agents-to-region/nojs/$nid", array('attributes' => array('class' => 'icon-pen ctools-use-modal edit-agent-link')));
                        $link2 = l("Edit Agents", "Music/add-agents-to-region/nojs/$nid", array('attributes' => array('class' => 'ctools-use-modal edit-agent-link')));
                    } 
                } else {
                    if(empty($node->field_music_agents['und'])) {
                        $link1 = l("", "Music/add-agents-to-region/nojs/new", array('attributes' => array('class' => 'icon-pen ctools-use-modal edit-agent-link')));
                        $link2 = l("Edit Agents", "Music/add-agents-to-region/nojs/new", array('attributes' => array('class' => 'ctools-use-modal edit-agent-link')));
                    }  
                }                
                ?>
                <div id="custom_agent_link" class="form-section-actions"><?php print $link1.$link2; ?></div>
            </div>
            <div class="custom-error red-label region-agent hide">Please add Agent before saving Region.</div>
            <div class="form-section">
                <?php
                $_SESSION['agent_lists'] = array();
                if (!empty($form['nid']['#value'])) {
                    foreach ($node->field_music_agents['und'] as $agent_id) {
                        $_SESSION['agent_lists'][] = $agent_id['nid'];
                        $agent = node_load($agent_id['nid']);
                        $agent_name = $agent->title;
                        $agent_email = $agent->field_email_id['und']['0']['value'];
                        $agent_phone = $agent->field_phone_no['und']['0']['value'];
                        $agent_phone = ($agent_phone == '+1')?'':$agent_phone;
                        print "<div class='agent-info'>";
                        print "<div class='agent-name'>$agent_name</div>";
                        print "<div class='agent-phone'>$agent_email</div>";
                        print "<div class='agent-email'>$agent_phone</div>";
                        print "</div>";
                    }
                }
                ?>                
            </div>
        </div>
        <div class="region-accordian-list">
            <div class="form-section-head">
                <div class="form-section-title">Region Select</div>
                <div class="form-section-actions">                   
                    <?php 
                      print l("Uncheck all", "Music/uncheck-locations/nojs/all", array('attributes' => array('class' => 'ctools-use-modal')));
                    ?>
                </div>
            </div>
            <div class="region-accordian">                                    
                    <?php
                    $zoom_zone_arr = array();
                    $zoom_zone_arr = $form['field_music_zoom_zones']['und']['#value'];                         
                    $i=0;
                    foreach ($form['field_music_zoom_zones']['und']['#options'] as $key => $title) {
                        $childrens = taxonomy_get_children($key);
                        $childrens_arr = array();
                        foreach($childrens as $children) {
                            $childrens_arr[] = $children->tid;
                        }
                        $count_children = count($childrens_arr); 
                        $count_common   = count(array_intersect($childrens_arr, $zoom_zone_arr));
                        $count_used     = count(array_intersect($childrens_arr, $used_regions));
                                                
                        if(in_array($key, $zoom_zone_arr) || (count(array_intersect($childrens_arr, $zoom_zone_arr)) > 0)){ 
                            if($count_children == $count_common) {
                               $active = "active"; 
                            } else {
                               $active = "semi-active"; 
                            }                             
                        } else {
                           $active = "";  
                        }
                        
                        if(in_array($key, $used_regions)) {
                            $used       = "in-used";
                            $used_label = "In Use";
                        } else {
                            $used = "";
                            $used_label = "";
                        }
                        
                        if($count_used == $count_children) {
                            $head_used       = "in-used";
                            $head_used_label      = "In Use";
                        } else {
                            $head_used = "";
                            $head_used_label = "";
                        }
                        
                        if (strpos($title, '-') === false) {                           
                            if($i == 0) {
                                print "<div class='each-accordian'><div class='accordian-head'>";                                    
                                    print l("", "Music/uncheck-locations/nojs/$key", array('attributes' => array('class' => 'ctools-use-modal hide uncheck-it')));
                                    print "<div id='zz-$key' class='custom-chk-wrapper $active $head_used'>";
                                        print "<span class='custom-chk'></span>";
                                        print "<span class='chk-label'>$title</span>";
                                    print "</div><span class='icon-add_talent_plus accordion-icon'></span>";
                                print "</div>";
                                print "<div class='accordian-content-wrapper'>"; 
                            } else {
                                print "</div></div>";
                                print "<div class='each-accordian'><div class='accordian-head'>";
                                    print l("", "Music/uncheck-locations/nojs/$key", array('attributes' => array('class' => 'ctools-use-modal hide uncheck-it')));
                                    print "<div id='zz-$key'  class='custom-chk-wrapper $active $head_used'>";
                                        print "<span class='custom-chk'></span>";
                                        print "<span class='chk-label'>$title</span>";
                                    print "</div><span class='icon-add_talent_plus accordion-icon'></span>";
                                print "</div>";
                                print "<div class='accordian-content-wrapper'>";  
                            }
                        } else {
                            $term = taxonomy_term_load($key);
                            $key_name = $term->field_key['und'][0]['value'];
                            $title = str_replace("-", "", $title);
                            print "<div class='accordian-content'>";
                            print "<div class='sub-region-list'>";
                            print "<div id='zz-$key' data-key='$key_name' class='custom-chk-wrapper $active $used'>";
                            print "<span class='custom-chk'></span>";
                            print "<span class='chk-label'>$title</span>";
                            print "</div><span class='status-txt'>$used_label</span>";
                            print "</div>";
                            print "</div>";
                        }
                        $i++;
                    }
                    ?>                
            </div>
            <div class="custom-error red-label regions hide">Regions are required.</div>
        </div>
    </div>
</div>

<div class="modal-footer">    
    <?php 
    $cancel_html = '';
    if (!empty($delete_region)){
        $cancel_html .= $delete_region;
    }
    $cancel_html .= '<a class="btn-success modal-btn btn btn btn-default form-submit cancel">Cancel</a>';
    $form['actions']['submit']['#prefix'] = $cancel_html;
    $form['actions']['submit']['#value'] = "Save";
    $form['actions']['submit']['#attributes'] = array("class" => array("success-btn btn-success modal-btn btn form-submit"));
    print render($form['actions']);
    ?>
</div>   
<div class="hide">    
    <?php print render($form['field_music_zoom_zones']); ?>
    <?php print render($form['field_region_color']); ?>
    <?php print render($form['field_music_agents']); ?>
    <?php print render($form['field_music_category']); ?>
    <?php print drupal_render_children($form); ?>
</div>


