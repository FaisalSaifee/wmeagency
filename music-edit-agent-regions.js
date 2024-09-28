(function ($) {
    Drupal.behaviors.music_custom = {
        attach: function (context, settings) {
            $(".view-filters").addClass("map-filters");
            $(".ctools-close-modal").html("<span class='icon-lightbox_x'></span>");
            $("#modalContent").addClass("modal");
            if (Drupal.settings.arg1 == "delete-region" || Drupal.settings.arg1 == "remove-agent" || Drupal.settings.arg1 == "uncheck-locations") {
                $(".modal-header").addClass("header-hidden");
            }

            $(".alert .close").off('click').on('click', function () {
                $(".alert").remove();
            });

            //Show full list starts here
            $(".show-full-list").off('click').on('click', function () {
                $(".show-full-list").not(this).removeClass("active");
                $(".show-full-list").not(this).html("Show full list");
                $(".show-full-list").not(this).parent().prev().prev().removeClass("hide");
                $(".show-full-list").not(this).parent().prev().addClass("hide");
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    $(this).parent().prev().prev().removeClass("hide");
                    $(this).parent().prev().addClass("hide");
                    $(this).html("Show full list");
                } else {
                    $(this).addClass("active");
                    $(this).parent().prev().prev().addClass("hide");
                    $(this).parent().prev().removeClass("hide");
                    $(this).html("Hide full list");
                }
            });
            //Show full list ends here

            //Add region starts here
            $("#edit-region-name").keyup(function () {
                if ($(this).val() !== '' && $(this).val().length > 0) {
                    $("#music-add-region-form .sbmt-btn").removeClass("disabled-btn");
                    $("#music-add-region-form .sbmt-btn").addClass("success-btn");
                    $("#music-add-region-form .sbmt-btn").prop('disabled', false);
                } else {
                    $("#music-add-region-form .sbmt-btn").removeClass("success-btn");
                    $("#music-add-region-form .sbmt-btn").addClass("disabled-btn");
                    $("#music-add-region-form .sbmt-btn").prop('disabled', true);
                }
            });

            $(document).off('click').on('click', "#music-add-agents-to-region-form .success-btn, #music-delete-agent-form .success-btn", function () {
                $(".red-label.region-agent").addClass("hide");
                setTimeout(function() {
                    var rid = Drupal.settings.rid;
                    $.get(Drupal.settings.base_url + '/Music/region/ajax-agents', function (data) {
                        var data = JSON.parse(data);
                        $(".agent-details .form-section").html(data['result']);
                        if ($(".agent-details .form-section").html() == "") {
                            if (typeof rid == "undefined") {
                                $("#custom_agent_link").html('<a href="' + Drupal.settings.base_url + '/Music/add-agents-to-region/nojs/new" class="ctools-use-modal edit-agent-link icon-pen"></a><a href="' + Drupal.settings.base_url + '/Music/add-agents-to-region/nojs/new" class="ctools-use-modal edit-agent-link">Edit Agents</a>');
                            } else {
                                $("#custom_agent_link").html('<a href="' + Drupal.settings.base_url + '/Music/add-agents-to-region/nojs/' + rid + '" class="ctools-use-modal edit-agent-link icon-pen"></a><a href="' + Drupal.settings.base_url + '/Music/edit-agents-for-region/nojs/' + rid + '" class="ctools-use-modal edit-agent-link">Edit Agents</a>');
                            }
                        } else {
                            if (typeof rid == "undefined") {
                                $("#custom_agent_link").html('<a href="' + Drupal.settings.base_url + '/Music/edit-agents-for-region/nojs/new" class="ctools-use-modal edit-agent-link icon-pen"></a><a href="' + Drupal.settings.base_url + '/Music/edit-agents-for-region/nojs/new" class="ctools-use-modal edit-agent-link">Edit Agents</a>');
                            } else {
                                $("#custom_agent_link").html('<a href="' + Drupal.settings.base_url + '/Music/edit-agents-for-region/nojs/' + rid + '" class="ctools-use-modal edit-agent-link icon-pen"></a><a href="' + Drupal.settings.base_url + '/Music/edit-agents-for-region/nojs/' + rid + '" class="ctools-use-modal edit-agent-link">Edit Agents</a>');
                            }
                        }
                        Drupal.attachBehaviors();
                        setTimeout(function () {
                            $("#custom_agent_link a").trigger("click");
                        }, 1000);
                    });
                }, 1500);
            });

// // group email start
if ($('#music-add-group-email-form').length > 0) {
            $(document).off('click').on('click', "#music-add-group-email-form .success-btn", function () {
                $(".red-label.group-email").addClass("hide");
                setTimeout(function() {
                    $.get(Drupal.settings.base_url + '/Music/region/get-group-email', function (data) {
                        var data = JSON.parse(data);
                        $(".tabbed-functionality .form-section").html(data['result']);
                        Drupal.attachBehaviors();
                        setTimeout(function () {
                        }, 1000);
                    });
                }, 1500);
            });
}
// // group email stop





            $(document).on('click', "#music-edit-agents-for-region-form .success-btn", function () {
                setTimeout(function () {
                    $.get(Drupal.settings.base_url + '/Music/region/ajax-agents', function (data) {
                        var data = JSON.parse(data);
                        $(".agent-details .form-section").html(data['result']);
                    });
                }, 1500);
            });



            $(document).on('click', "#music-delete-region-form .success-btn", function () {
                setTimeout(function () {
                    var catid = $("#edit-field-music-category-und option:selected").val();
                    location.replace(Drupal.settings.base_url + "/Music/edit-agent-regions?field_music_category_tid="+catid+"&map_capture=delete");
                }, 1500);
            });

            //Map image creation starts here
            //console.log(simplemaps_worldmap_mapdata);
            var map_capture = getUrlVars()["map_capture"];
            if ($.type(map_capture) !== "undefined") {
                setTimeout(function () {
                    $("#canvas").css("width", $('#map_inner svg').width());
                    $("#canvas").css("height", $('#map_inner svg').height());
                    var map = $("#full-width-map_inner svg")[0];
                    var image = Pablo(map);
                    image.dataUrl('png', function (dataUrl) {
                        // Split the base64 string in data and contentType
                        var block = dataUrl.split(";");
                        // get the real base64 content of the file
                        // if (block.length < 2) {
                        //     console.log("Data URL is not in the expected format.");
                        // } else {
                        //     var realData = block[1].split(",")[1];
                        //     console.log("Real Data: ", realData);
                        // }
                        var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."
                        // The path where the file will be created
                        // The name of your file, note that you need to know if is .png,.jpeg etc
                        if ($(".map-image-content").val() == "") {
                            $(".map-image-content").val(realData);
                            setTimeout(function () {
                                $(".create-pdf", context).trigger('click');
                            }, 200);
                        }
                    });
                }, 1000);
            }
            //Map image creation ends here

            $(document).on('click', "#music-uncheck-locations-form .success-btn", function () {
                setTimeout(function () {
                    if (Drupal.settings.arg3 == "all") {
                        $(".custom-chk-wrapper").removeClass("active");
                        $(".custom-chk-wrapper").removeClass("semi-active");
                        $(".field-name-field-music-zoom-zones .form-checkbox").prop("checked", false);
                        $(".accordian-content-wrapper").find(".custom-chk-wrapper").each(function () {
                            if (!$(this).hasClass("in-use")) {
                                var idd = $(this).attr('id').split("-")[1];
                                var key = $(this).attr('data-key');
                                $(this).removeClass("active");
                                $(this).removeClass("semi-active");
                                $("#edit-field-music-zoom-zones-und-" + idd).prop("checked", false);
                                simplemaps_worldmap_mapdata.state_specific[key].color = "#CCCCCC";
                                simplemaps_worldmap_mapdata.state_specific[key].hover_color = "#96A7AA";
                                simplemaps_worldmap_mapdata.state_specific[key].url = "javascript:add_to_selection('" + idd + "', '" + key + "')";
                                simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>Add to selection</div>";
                            }
                        });
                        simplemaps_worldmap.refresh();
                    } else {
                        var tid = Drupal.settings.arg3;
                        $("#zz-" + tid).removeClass("active");
                        $("#zz-" + tid).removeClass("semi-active");
                        $("#edit-field-music-zoom-zones-und-" + tid).prop("checked", false);
                        $("#zz-" + tid).parent(".accordian-head").next(".accordian-content-wrapper").find(".custom-chk-wrapper").each(function () {
                            if (!$(this).hasClass("in-use")) {
                                var idd = $(this).attr('id').split("-")[1];
                                var key = $(this).attr('data-key');
                                $(this).removeClass("active");
                                $(this).removeClass("semi-active");
                                $("#edit-field-music-zoom-zones-und-" + idd).prop("checked", false);
                                simplemaps_worldmap_mapdata.state_specific[key].color = "#CCCCCC";
                                simplemaps_worldmap_mapdata.state_specific[key].hover_color = "#96A7AA";
                                simplemaps_worldmap_mapdata.state_specific[key].url = "javascript:add_to_selection('" + idd + "', '" + key + "')";
                                simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>Add to selection</div>";
                            }
                        });
                        simplemaps_worldmap.refresh();
                    }
                }, 700);
            });

            $(document).on('click', "#music-add-region-form .success-btn", function () {
                setTimeout(function () {
                    $('#music-region-agents').html('');
                    var rid = Drupal.settings.region_id;
                    if ($("#music-regions-node-form").length == 0) {
                        $('#music-region-agents').load('/Music/load-music-region/' + rid, function (response, status, xhr) {
                            Drupal.attachBehaviors();
                        });
                        Drupal.attachBehaviors();
                    }
                }, 800);
            });
            //Add region ends here

            //Add category starts here
            $(".category-name").keyup(function () {
                if ($(this).val() !== '' && $(this).val().length > 0) {
                    $(".category-form .sbmt-btn").removeClass("disabled-btn");
                    $(".category-form .sbmt-btn").addClass("success-btn");
                    $(".category-form .sbmt-btn").prop('disabled', false);
                } else {
                    $(".category-form .sbmt-btn").removeClass("success-btn");
                    $(".category-form .sbmt-btn").addClass("disabled-btn");
                    $(".category-form .sbmt-btn").prop('disabled', true);
                }
            });
            //Add category ends here

            //Search blur starts
            if ($(".search-agent").val() != "") {
                $(".search-bar").addClass("in-focus");
            }

            $(".search-agent").on("focusin", function () {
                $(".search-bar").addClass("in-focus");
                $(this).attr("placeholder", "");
            });

            $(".search-agent").on("blur", function () {
                if ($(this).val() == "") {
                    $(".search-bar").removeClass("in-focus");
                    $(this).attr("placeholder", "Search for Agents");
                }
            });

            $(document).on('click', '.music-agents-name-list .agent-info', function () {
                var idd = $(this).attr("id").split("-")[1];
                $(".agent-id").val(idd);
                $(".search-agent").val($(this).children(".agent-name").html());
                $(".search-agent").addClass("active");
                $(".music-agents-name-list").html('');
                $('#music-add-agents-to-region-form .search-agent').focus();
                $('#music-add-agents-to-region-form .success-btn').removeAttr("disabled");
            });
            //Search blur ends

            //Select color for region starts here
            $(".select-colors .each-select-item").off('click').on('click', function () {
                $("#edit-field-region-color-und-0--rgb").val($(this).attr("id"));
                $(".select-colors .select-dropdown-head").removeClass("active");
                $(".select-dropdown-head .selected-color").html($(this).html());
                $(".region-clr").addClass("hide");
                var clr = $(".selected-color").children(".color-sqr").css("backgroundColor");
                hexc(clr);
                $(".accordian-content-wrapper .custom-chk-wrapper.active").each(function () {
                    var idd = $(this).attr('id').split("-")[1];
                    var key = $(this).attr("data-key");
                    simplemaps_worldmap_mapdata.state_specific[key].color = color;
                    simplemaps_worldmap_mapdata.state_specific[key].hover_color = color;
                    simplemaps_worldmap_mapdata.state_specific[key].url = "javascript:remove_from_selection('" + idd + "', '" + key + "')";
                    simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>Remove from selection</div>";
                });
                simplemaps_worldmap.refresh();
            });
            //Select color for region ends here

            //Zoom zones accordian starts here
            $(".region-accordian-list .accordian-head").off('click').on('click', function () {
                $(".region-accordian-list .accordian-head").not(this).removeClass("active");
                $(".region-accordian-list .accordian-head").not(this).children(".accordion-icon").removeClass("icon-lightbox_x");
                $(".region-accordian-list .accordian-head").not(this).children(".accordion-icon").addClass("icon-add_talent_plus");
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    $(this).children(".accordion-icon").addClass("icon-add_talent_plus");
                    $(this).children(".accordion-icon").removeClass("icon-lightbox_x");
                } else {
                    $(this).addClass("active");
                    $(this).children(".accordion-icon").removeClass("icon-add_talent_plus");
                    $(this).children(".accordion-icon").addClass("icon-lightbox_x");
                }
            });
            //Zoom zones accordian ends here

            //Select music category starts
            $(".select-dropdown-head").off('click').on('click', function () {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                } else {
                    if ($(".select-dropdown-list li").length != 0) {
                        $(this).addClass("active");
                    }
                }
            });

            var field_music_category_tid = getUrlVars()["field_music_category_tid"];
            if ($.type(field_music_category_tid) !== "undefined") {
                setTimeout(function () {
                    if ($(".add-region-wrapper").length == 0) {
                        $(".view-content").prepend("<div class='add-region-wrapper'><a id='mr-new' class='add-region'>ADD NEW REGION</a></div>");
                    }
                }, 400);
            }

            $(document).on('click', '.select-music-category .each-select-item', function () {
                $(".select-dropdown-head").removeClass("active");
                $(".select-dropdown-head span:first").html($(this).html());
                var idd = $(this).attr("id").split('-')[1];
                $('#edit-tid option:selected').removeAttr('selected')
                $('#edit-tid option[value="'+idd+'"]').attr('selected',true);
                $(".regions-listing").each(function () {
                    if (!$(this).hasClass("hide")) {
                        $(this).addClass("hide");
                    }
                });
                if ($(".add-region-wrapper").length == 0) {
                    $(".view-content").prepend("<div class='add-region-wrapper'><a id='mr-new' class='add-region'>ADD NEW REGION</a></div>");
                }
                $(".add-region-wrapper").removeClass("hide");
                $("#toggle-" + idd).removeClass("hide");
                // if($("#toggle-" + idd).length == 0) {
                //    $("#toggle-empty").removeClass("hide");
                // }
                var login = Drupal.settings.login;
                if (login == "super_admin" && ($(".pdf").length == 0)) {
                    $("<div class='container'><div class='row'><div class='col-md-12'><ul class='nav navbar-nav navbar-right map-actions'><li><a target='_blank' href='" + Drupal.settings.base_url + "/Music/agent-regions/pdf' class='pdf'><span class='icon-download'></span>pdf<span class='tooltiptext'>Download color-coded map of all regions</span></a></li><li><a target='_blank' href='javascript:void(0)' onclick='javascript:shareModal(event);' class='share'><span class='icon-share'></span>Share<span class='tooltiptext'>Share color-coded map of all regions</span></a></li><li><a href='javascript:void(0)' class='dropdown-toggle more' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>...</a><ul class='dropdown-menu'><li><a class='sub' onclick='javascript:downloadAll()' href='javascript:void(0)'>Download All</a></li><li><a class='sub' href='javascript:shareAllModal()'>Share All</a></li></ul></li></ul></div></div></div>").prependTo("#full-width-map");
                    jQuery(".dropdown-toggle").dropdown();
                }
                $.get(Drupal.settings.base_url + '/Music/agent-load-map/' + idd, function (data) {
                    var original_mapdata = JSON.parse(data).simplemaps_worldmap_mapdata;
                    $.each(original_mapdata, function (index, value) {
                        if (index == "main_settings") {
                            simplemaps_worldmap_mapdata.main_settings = value;
                        } else if (index == "state_specific") {
                            simplemaps_worldmap_mapdata.state_specific = value;
                        } else if (index == "regions") {
                            simplemaps_worldmap_mapdata.regions = value;
                        }
                    });
                    simplemaps_worldmap.load();
                });
            });
            //Select music category ends
            //Append map and Music region agents form starts
            $("<div id='music-region-agents'></div>").insertBefore("#full-width-map");
            // if ($(".pdf").length == 0) {
            //     $("<div class='container'><div class='row'><div class='col-md-12'><a target='_blank' href='" + Drupal.settings.base_url + "/Music/agent-regions/pdf' class='pdf hide'><span class='icon-download'></span>pdf<span class='tooltiptext'>Download color-coded map of all regions</span></a></div></div></div>").prependTo("#full-width-map");
            // }

            if (($.type(getUrlVars()["field_music_category_tid"]) !== "undefined")) {
                 $(".pdf").removeClass("hide");
            }

            setTimeout(function () {
                $('div.map-wrapper').css('display', 'inline-block');
                $(".add-search-wrapper").appendTo("#map-category-container");
                $(".full-width-map_outer").appendTo("#map-category-container");
            }, 500);

            //Append map and Music region agents form starts
            $(document).on('click touchstart', ".modify-region", function () {
                $(".header-container").addClass("hide");
                $('html, body').animate({
                    scrollTop: $("#skip-link").offset().top
                }, 500);
                $("body").addClass("side-drawer-open");
                var nid = $(this).attr("id").split("-")[1];
                $('#music-region-agents').load('/Music/load-music-region/' + nid, function (response, status, xhr) {
                    Drupal.attachBehaviors();
                });
                Drupal.attachBehaviors();
                $.get(Drupal.settings.base_url + '/Music/region/available-states/' + nid, function (data) {
                    var data = JSON.parse(data);
                    $.each(data['outcome'], function (index, value) {
                        simplemaps_worldmap_mapdata.state_specific[value].inactive = 'no';
                    });
                    simplemaps_worldmap.refresh();
                });
                $.get(Drupal.settings.base_url + '/Music/region/current-states/' + nid, function (data) {
                    var data = JSON.parse(data);
                    $.each(data['outcome'], function (index, value) {
                        var tid = value.tid;
                        var key = value.key;
                        var state_name = value.state_name;
                        simplemaps_worldmap_mapdata.state_specific[key].name = state_name;
                        simplemaps_worldmap_mapdata.state_specific[key].url = "javascript:remove_from_selection('" + tid + "', '" + key + "')";
                        simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>Remove from selection</div>";
                    });
                    simplemaps_worldmap.refresh();
                });
                $.get(Drupal.settings.base_url + '/Music/region/used-states/' + nid, function (data) {
                    var data = JSON.parse(data);
                    $.each(data['outcome'], function (index, value) {
                        var key = value.key;
                        var region_name = value.region_name;
                        var state_name = value.state_name;
                        simplemaps_worldmap_mapdata.state_specific[key].name = state_name;
                        simplemaps_worldmap_mapdata.state_specific[key].url = "";
                        simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>In Use ('" + region_name + "')</div>";
                    });
                    simplemaps_worldmap.refresh();
                });
            });
            //For Add region starts
            $(document).on('click touchstart', ".add-region", function () {
                $(".header-container").addClass("hide");
                $('html, body').animate({
                    scrollTop: $("#skip-link").offset().top
                }, 500);
                $("body").addClass("side-drawer-open");
                var nid = $(this).attr("id").split("-")[1];
                $('#music-region-agents').load('/Music/load-music-region/' + nid, function (response, status, xhr) {
                    Drupal.attachBehaviors();
                });
                Drupal.attachBehaviors();

                $.get(Drupal.settings.base_url + '/Music/region/category-used-states', function (data) {
                    var data = JSON.parse(data);
                    $.each(data['outcome'], function (index, value) {
                        var key = value.key;
                        var region_name = value.region_name;
                        var state_name = value.state_name;
                        simplemaps_worldmap_mapdata.state_specific[key].name = state_name;
                        simplemaps_worldmap_mapdata.state_specific[key].url = "";
                        simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>In Use ('" + region_name + "')</div>";
                    });
                    simplemaps_worldmap.refresh();

                    $.each(data['available_states'], function (idd, key) {
                        simplemaps_worldmap_mapdata.state_specific[key].color = "#CCCCCC";
                        simplemaps_worldmap_mapdata.state_specific[key].hover_color = "#96A7AA";
                        simplemaps_worldmap_mapdata.state_specific[key].inactive = 'no';
                        simplemaps_worldmap_mapdata.state_specific[key].url = "javascript:add_to_selection('" + idd + "', '" + key + "')";
                        simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>Add to selection</div>";
                    });
                    simplemaps_worldmap.refresh();
                });
            });
            //For Add region ends

            $('#music-regions-node-form .cancel').off('click').on('click', function () {
                var catid = $("#edit-field-music-category-und option:selected").val();
                location.replace(Drupal.settings.base_url + "/Music/edit-agent-regions?field_music_category_tid=" + catid);
            });
            //For music zoom zones accordian starts
            $('.zoom-zone').off('click').on('click', function () {
                $('.zoom-zone').not(this).removeClass("active");
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                } else {
                    $(this).addClass("active");
                }
            });
            //For music zoom zones accordian ends

            //Music zoom zones checkbox starts
            $(".uncheck-all").off('click').on('click', function () {
                $('.custom-chk-wrapper').removeClass("semi-active");
                $('.custom-chk-wrapper').removeClass("active");
                $(".field-name-field-music-zoom-zones .form-checkbox").prop("checked", false);
            });

            $('.accordian-content .custom-chk-wrapper').off('click').on('click', function () {
                if ($(this).hasClass("in-use")) {
                    return false;
                }
                var clr = $(".selected-color").children(".color-sqr").css("backgroundColor");
                if (typeof clr === "undefined") {
                    $(".region-clr").removeClass("hide");
                    return false;
                }
                var idd = $(this).attr("id").split("-")[1];
                var key = $(this).attr("data-key");
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    $("#edit-field-music-zoom-zones-und-" + idd).prop("checked", false);
                    simplemaps_worldmap_mapdata.state_specific[key].color = "#CCCCCC";
                    simplemaps_worldmap_mapdata.state_specific[key].hover_color = "#96A7AA";
                    simplemaps_worldmap_mapdata.state_specific[key].url = "javascript:add_to_selection('" + idd + "', '" + key + "')";
                    simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>Add to selection</div>";
                    simplemaps_worldmap.refresh();
                } else {
                    $(this).addClass("active");
                    $("#edit-field-music-zoom-zones-und-" + idd).prop("checked", true);
                    var clr = $(".selected-color").children(".color-sqr").css("backgroundColor");
                    hexc(clr);
                    simplemaps_worldmap_mapdata.state_specific[key].color = color;
                    simplemaps_worldmap_mapdata.state_specific[key].hover_color = color;
                    simplemaps_worldmap_mapdata.state_specific[key].url = "javascript:remove_from_selection('" + idd + "', '" + key + "')";
                    simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>Remove from selection</div>";
                    simplemaps_worldmap.refresh();

                }
                var lnth = $(this).parent().parent().parent(".accordian-content-wrapper").find(".custom-chk-wrapper.active").length;
                if (lnth > 0) {
                    if (!$(this).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children('.custom-chk-wrapper').hasClass("active")) {
                        if (lnth == $(this).parent().parent().parent(".accordian-content-wrapper").children(".accordian-content").length) {
                            $(this).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head.active").children(".custom-chk-wrapper").addClass("active");
                        } else {
                            $(this).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children(".custom-chk-wrapper").removeClass("active");
                            $(this).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children(".custom-chk-wrapper").addClass("semi-active");
                        }
                        var idd = $(this).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head.active").children(".custom-chk-wrapper").attr("id").split("-")[1];
                        $("#edit-field-music-zoom-zones-und-" + idd).prop("checked", true);
                    } else {
                        if (lnth == $(this).parent().parent().parent(".accordian-content-wrapper").children(".accordian-content").length) {
                            $(this).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head.active").children(".custom-chk-wrapper").addClass("active");
                        } else {
                            $(this).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children(".custom-chk-wrapper").removeClass("active");
                            $(this).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children(".custom-chk-wrapper").addClass("semi-active");
                        }
                    }
                } else {
                    $(this).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children('.custom-chk-wrapper').removeClass("active");
                    $(this).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children('.custom-chk-wrapper').removeClass("semi-active");
                    var idd = $(this).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head.active").children(".custom-chk-wrapper").attr("id").split("-")[1];
                    $("#edit-field-music-zoom-zones-und-" + idd).prop("checked", false);
                }
            });

            $('.accordian-head .custom-chk').off('click').on('click', function () {
                if ($(this).parent(".custom-chk-wrapper").hasClass("in-use")) {
                    return false;
                }

                var clr = $(".selected-color").children(".color-sqr").css("backgroundColor");
                if (typeof clr === "undefined") {
                    $(".region-clr").removeClass("hide");
                    return false;
                }
                var idd = $(this).parent(".custom-chk-wrapper").attr("id").split("-")[1];
                if ($(this).parent(".custom-chk-wrapper").hasClass("semi-active")) {
                    var avail_lnth = $(this).parent(".custom-chk-wrapper").parent(".accordian-head").next(".accordian-content-wrapper").find(".custom-chk-wrapper").length;
                    var active_lnth = $(this).parent(".custom-chk-wrapper").parent(".accordian-head").next(".accordian-content-wrapper").find(".custom-chk-wrapper.active").length;
                    var in_use_lnth = $(this).parent(".custom-chk-wrapper").parent(".accordian-head").next(".accordian-content-wrapper").find(".custom-chk-wrapper.in-use").length;
                    if ((avail_lnth - in_use_lnth) == active_lnth) {
                        $(this).parent(".custom-chk-wrapper").prev(".uncheck-it").trigger("click");
                    } else {
                        if (in_use_lnth > 0) {
                            $(this).parent(".custom-chk-wrapper").addClass("semi-active");
                        } else {
                            $(this).parent(".custom-chk-wrapper").addClass("active");
                        }
                        $("#edit-field-music-zoom-zones-und-" + idd).prop("checked", true);
                        $(this).parent(".custom-chk-wrapper").parent().next(".accordian-content-wrapper").find(".custom-chk-wrapper").each(function () {
                            if (!$(this).hasClass("in-use")) {
                                var idd = $(this).attr('id').split("-")[1];
                                var key = $(this).attr("data-key");
                                $(this).addClass("active");
                                $("#edit-field-music-zoom-zones-und-" + idd).prop("checked", true);
                                var clr = $(".selected-color").children(".color-sqr").css("backgroundColor");
                                hexc(clr);
                                simplemaps_worldmap_mapdata.state_specific[key].color = color;
                                simplemaps_worldmap_mapdata.state_specific[key].hover_color = color;
                                simplemaps_worldmap_mapdata.state_specific[key].url = "javascript:remove_from_selection('" + idd + "', '" + key + "')";
                                simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>Remove from selection</div>";
                            }
                        });
                        simplemaps_worldmap.refresh();
                    }
                } else if ($(this).parent(".custom-chk-wrapper").hasClass("active")) {
                    $(this).parent(".custom-chk-wrapper").prev(".uncheck-it").trigger("click");
                } else {
                    var lnth = $(this).parent(".custom-chk-wrapper").parent(".accordian-head").next(".accordian-content-wrapper").find(".custom-chk-wrapper.in-use").length;
                    if (lnth > 0) {
                        $(this).parent(".custom-chk-wrapper").addClass("semi-active");
                    } else {
                        $(this).parent(".custom-chk-wrapper").addClass("active");
                    }

                    $("#edit-field-music-zoom-zones-und-" + idd).prop("checked", true);
                    $(this).parent(".custom-chk-wrapper").parent().next(".accordian-content-wrapper").find(".custom-chk-wrapper").each(function () {
                        if (!$(this).hasClass("in-use")) {
                            var idd = $(this).attr('id').split("-")[1];
                            var key = $(this).attr("data-key");
                            $(this).addClass("active");
                            $("#edit-field-music-zoom-zones-und-" + idd).prop("checked", true);
                            var clr = $(".selected-color").children(".color-sqr").css("backgroundColor");
                            hexc(clr);
                            simplemaps_worldmap_mapdata.state_specific[key].color = color;
                            simplemaps_worldmap_mapdata.state_specific[key].hover_color = color;
                            simplemaps_worldmap_mapdata.state_specific[key].url = "javascript:remove_from_selection('" + idd + "', '" + key + "')";
                            simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>Remove from selection</div>";
                        }
                    });
                    simplemaps_worldmap.refresh();
                }
                return false;
            });
            //Music zoom zones checkbox ends

            $(".edit-agent-list").dragsort({dragSelector: ".agent-drag-icon", dragEnd: saveOrder, placeHolderTemplate: "<div class='each-agent agent-sort'><div class='poster-image'></div></div>"});



            $('.search-bar .icon-lightbox_x').off('click touchstart').on('click touchstart', function () {
                $(this).addClass("hide");
                $(".search-agent").val('');
                $('.search-agent').keyup();
            });

            //Autocomplete related functionality for Search Agent starts
            $(".search-agent").keyup(function () {
                if ($(this).val() !== '' && $(this).val().length > 0) {
                    $('.search-bar .icon-lightbox_x').removeClass("hide");
                    var title = $(this).val();
                    var query_string;
                    if (!($.type(title) === "undefined")) {
                        query_string = '?title=' + title;
                    } else {
                        query_string = '?title=';
                    }
                    var region_id = $("#region-id").val();
                    $.get(Drupal.settings.base_url + '/Music/talents/auto-suggest/music-agents/' + region_id + query_string, function (data) {
                        var data = JSON.parse(data);
                        if (data['count'] >= 1) {
                            $('#music-add-agents-to-region-form .music-agents-name-list').html(data['result']);
                        } else if (data['count'] == 0) {
                            $('#music-add-agents-to-region-form .music-agents-name-list').html('<div class="custom-msg">No results found.</div>');
                        }

                        if (data['count'] == 1) {
                            var idd = $(".talent-name").attr("id").split("-")[1];
                            $(".talent-id").val(idd);
                            $("#music-add-agents-to-region-form .in-active").prop('disabled', false);
                            $("#music-add-agents-to-region-form .in-active").addClass("success-btn");
                        } else {
                            $(".talent-id").val('');
                            $("#music-add-agents-to-region-form .in-active").prop('disabled', true);
                            $("#music-add-agents-to-region-form .in-active").removeClass("success-btn");
                        }
                    });
                } else {
                    $('#music-add-agents-to-region-form .success-btn').attr("disabled", "disabled");
                    $('.search-bar .icon-lightbox_x').addClass("hide");
                    $('.music-agents-name-list').html('');
                }
            });

            $(".search-agent").bind({
                paste: function () {
                    setTimeout(function () {
                        $('.search-agent').keyup();
                    }, 100);
                }
            });
            //Autocomplete related functionality for Search Agents ends

            $("#edit-title").keyup(function () {
                var region_id = $(".current-region-nid").html();
                //Validation for region name starts here
                $.get(Drupal.settings.base_url + '/Music/region/validate-name/' + $("#edit-title").val() + '/' + region_id, function (data) {
                    var data = JSON.parse(data);
                    if (data['error'] == "yes") {
                        $(".region-duplicate-name").removeClass("hide");
                        $(".success-btn").attr('disabled', 'disabled');
                    } else {
                        $(".region-duplicate-name").addClass("hide");
                        $(".success-btn").removeAttr("disabled");
                    }
                });
                //Validation for region name ends here
            });

            $("#music-regions-node-form #edit-title").blur(function () {
                var region_name = $(this).val();
                $("#music-regions-node-form #edit-title").val(region_name.toUpperCase());
            });

            $("#music-regions-node-form .success-btn").off('click').on('click', function () {
                if ($("#edit-title").val() == "") {
                    $("#music-region-agents").animate({scrollTop: 0}, "fast");
                    $(".custom-error.region-name").removeClass("hide");
                    this.disabled = false;
                    return false;
                } else {
                    $(".custom-error.region-name").addClass("hide");
                }

                var clr = $(".selected-color").children(".color-sqr").css("backgroundColor");
                if (typeof clr === "undefined") {
                    $("#music-region-agents").animate({scrollTop: 0}, "fast");
                    $(".custom-error.region-clr").removeClass("hide");
                    this.disabled = false;
                    return false;
                } else {
                    $(".custom-error.region-clr").addClass("hide");
                }

                if (($(".agent-details .agent-info").length == 0) && ($(".tabbed-functionality .group-info").length == 0) ) {
                    $("#music-region-agents").animate({scrollTop: 0}, "fast");
                    $(".custom-error.region-agent").removeClass("hide");
                    $(".custom-error.group-email").removeClass("hide");
                    this.disabled = false;
                    return false;
                } else {
                    $(".custom-error.region-agent").addClass("hide");
                    $(".custom-error.group-email").addClass("hide");
                }

                if ($(".custom-chk-wrapper.active").length == 0) {
                    $(".custom-error.regions").removeClass("hide");
                    $("#music-region-agents").animate({scrollTop: $("#music-region-agents").height()}, "fast");
                    this.disabled = false;
                    return false;
                } else {
                    $(".custom-error.regions").addClass("hide");
                }
                this.disabled = true;
                $('#music-regions-node-form').submit();
            });

            $(document).mouseup(function (e) {
                var container = $(".select-music-category");
                // if the target of the click isn't the container nor a descendant of the container
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    //$(".select-dropdown-head").removeClass("active");
                }
            });

            $("#music-add-category-form .category-name").keyup(function (event) {
                var title = $(this).val().trim();
                if (title !== '' && title.length >= 1) {
                    $("#music-add-category-form .sbmt-btn").addClass("success-btn");
                    $("#music-add-category-form .sbmt-btn").removeAttr("disabled");
                } else {
                    $("#music-add-category-form .sbmt-btn").removeClass("success-btn");
                    $("#music-add-category-form .sbmt-btn").attr("disabled", true);
                }
            });
        }
    }
}(jQuery));

jQuery(document).ready(function () {
    setTimeout(function () {
        jQuery("#full-width-map").removeClass("hide");
    }, 100);
});

//Popup on click starts here
simplemaps_worldmap.hooks.zoomable_click_region = function (id) {
    jQuery(".header-container, .select-music-category, .add-search-wrapper").addClass("hide");
}

simplemaps_worldmap.hooks.back = function (id) {
    jQuery(".header-container, .select-music-category, .add-search-wrapper").removeClass("hide");
}

function add_to_selection(tid, key) {
    var clr = jQuery(".selected-color").children(".color-sqr").css("backgroundColor");
    if (typeof clr === "undefined") {
        jQuery(".region-clr").removeClass("hide");
        //return false;
    }else{
        jQuery("#zz-" + tid).addClass("active");
        jQuery("#edit-field-music-zoom-zones-und-" + tid).prop("checked", true);
        custom_chk_status(tid);
        var clr = jQuery(".selected-color").children(".color-sqr").css("backgroundColor");
        hexc(clr);
        simplemaps_worldmap_mapdata.state_specific[key].color = color;
        simplemaps_worldmap_mapdata.state_specific[key].hover_color = color;
        simplemaps_worldmap_mapdata.state_specific[key].url = "javascript:remove_from_selection('" + tid + "', '" + key + "')";
        simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>Remove from selection</div>";
        simplemaps_worldmap.refresh();
    }
}

function remove_from_selection(tid, key) {
    jQuery("#zz-" + tid).removeClass("active");
    jQuery("#edit-field-music-zoom-zones-und-" + tid).prop("checked", false);
    custom_chk_status(tid);
    simplemaps_worldmap_mapdata.state_specific[key].color = "#CCCCCC";
    simplemaps_worldmap_mapdata.state_specific[key].hover_color = "#96A7AA";
    simplemaps_worldmap_mapdata.state_specific[key].url = "javascript:add_to_selection('" + tid + "', '" + key + "')";
    simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>Add to selection</div>";
    simplemaps_worldmap.refresh();
}

function custom_chk_status(tid) {
    var lnth = jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").find(".custom-chk-wrapper.active").length;
    if (lnth > 0) {
        if (!jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children('.custom-chk-wrapper').hasClass("active")) {
            if (lnth == jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").children(".accordian-content").length) {
                jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children(".custom-chk-wrapper").addClass("active");
            } else {
                jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children(".custom-chk-wrapper").removeClass("active");
                jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children(".custom-chk-wrapper").addClass("semi-active");
            }
            var idd = jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children(".custom-chk-wrapper").attr("id").split("-")[1];
            jQuery("#edit-field-music-zoom-zones-und-" + idd).prop("checked", true);
        } else {
            if (lnth == jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").children(".accordian-content").length) {
                jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children(".custom-chk-wrapper").addClass("active");
            } else {
                jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children(".custom-chk-wrapper").removeClass("active");
                jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children(".custom-chk-wrapper").addClass("semi-active");
            }
        }
    } else {
        jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children('.custom-chk-wrapper').removeClass("active");
        jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children('.custom-chk-wrapper').removeClass("semi-active");
        var idd = jQuery("#zz-" + tid).parent().parent().parent(".accordian-content-wrapper").prev(".accordian-head").children(".custom-chk-wrapper").attr("id").split("-")[1];
        jQuery("#edit-field-music-zoom-zones-und-" + idd).prop("checked", false);
    }
}

function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1)
            parts[i] = '0' + parts[i];
    }
    color = '#' + parts.join('');
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function edit_region(nid) {
    jQuery(".header-container").addClass("hide");
    jQuery.get(Drupal.settings.base_url + '/Music/region/available-states/' + nid, function (data) {
        var data = JSON.parse(data);
        jQuery.each(data['outcome'], function (index, value) {
            simplemaps_worldmap_mapdata.state_specific[value].inactive = 'no';
        });
        simplemaps_worldmap.refresh();
    });
    jQuery.get(Drupal.settings.base_url + '/Music/region/current-states/' + nid, function (data) {
        var data = JSON.parse(data);
        jQuery.each(data['outcome'], function (index, value) {
            var tid = value.tid;
            var key = value.key;
            var state_name = value.state_name;
            simplemaps_worldmap_mapdata.state_specific[key].name = state_name;
            simplemaps_worldmap_mapdata.state_specific[key].url = "javascript:remove_from_selection('" + tid + "', '" + key + "')";
            simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>Remove from selection</div>";
        });
        simplemaps_worldmap.refresh();
    });
    jQuery.get(Drupal.settings.base_url + '/Music/region/used-states/' + nid, function (data) {
        var data = JSON.parse(data);
        jQuery.each(data['outcome'], function (index, value) {
            var key = value.key;
            var region_name = value.region_name;
            var state_name = value.state_name;
            simplemaps_worldmap_mapdata.state_specific[key].name = state_name;
            simplemaps_worldmap_mapdata.state_specific[key].url = "";
            simplemaps_worldmap_mapdata.state_specific[key].description = "<div class='click-to-modify'>In Use ('" + region_name + "')</div>";
        });
        simplemaps_worldmap.refresh();
    });
    jQuery("#mr-" + nid).trigger("click");
}

function GetKeyCodeOnUpdateOfCategory(evt) {
    var keyCode;
    if (evt.keyCode > 0) {
        keyCode = evt.keyCode;
    } else if (typeof (evt.charCode) != "undefined") {
        keyCode = evt.charCode;
    }
    if (keyCode == '13') {
        jQuery('#music-update-category-form .sbmt-btn').trigger("click");
    }
}

function GetKeyCode2(evt) {
    var keyCode;
    if (evt.keyCode > 0) {
        keyCode = evt.keyCode;
    } else if (typeof (evt.charCode) != "undefined") {
        keyCode = evt.charCode;
    }
    if (keyCode == '13') {
        jQuery('#music-add-category-form .sbmt-btn').trigger("click");
    }
}

function GetKeyCode3(evt) {
    var keyCode;
    if (evt.keyCode > 0) {
        keyCode = evt.keyCode;
    } else if (typeof (evt.charCode) != "undefined") {
        keyCode = evt.charCode;
    }
    if (keyCode == '13') {
        if(!jQuery("#music-add-agents-to-region-form .success-btn").is(":disabled")) {
            jQuery('#music-add-agents-to-region-form .success-btn').trigger("click");
        }
    }
}

function rename_category() {
    if (jQuery("#music-update-category-form .is_selected").val() == "yes") {
        jQuery(".select-dropdown-head .slt-cat").html(jQuery("#music-update-category-form .category-name").val());
    }
}

function delete_category() {
    if (jQuery("#music-remove-category-form .is_selected").val() == "yes") {
        jQuery(".select-dropdown-head .slt-cat").html("Pick a category");
        var cat_id = jQuery(".category_id").val();
        jQuery("#toggle-" + cat_id).addClass("hide");
        jQuery(".select-dropdown-head").removeClass("selected");
        jQuery.get(Drupal.settings.base_url + '/Music/reset-map', function (data) {
            var original_mapdata = JSON.parse(data).simplemaps_worldmap_mapdata;
            jQuery.each(original_mapdata, function (index, value) {
                if (index == "main_settings") {
                    simplemaps_worldmap_mapdata.main_settings = value;
                } else if (index == "state_specific") {
                    simplemaps_worldmap_mapdata.state_specific = value;
                } else if (index == "regions") {
                    simplemaps_worldmap_mapdata.regions = value;
                }
            });
            simplemaps_worldmap.load();
        });
        jQuery(".add-region-wrapper").addClass("hide");
    }
}

function removeDragNotice(){
    if(jQuery('.draggableviews-changed-notice').length){
        jQuery('.draggableviews-changed-notice').remove();
    }
}

function saveOrder() {
    removeDragNotice();
    jQuery("#agent-list-wrapper").prepend('<div class="draggableviews-changed-notice messages warning">Order of this view has been changed.</div>');
    var data = jQuery(".edit-agent-list .agent-sort").map(function () {
        return jQuery(this).data("itemid");
    }).get();
    jQuery("#agent-order").val(data);
}

function shareModal(e){
    jQuery('#modalShare').modal('show');
    e.preventDefault();
}
function checkPopEmail(e){
    e.preventDefault();
    if (e.keyCode === 13) {
        sharePdf();
    }
}
function checkAllPopEmail(e){
    e.preventDefault();
    if (e.keyCode === 13) {
        shareAllPdf();
    }
}
function sharePdf(){
    jQuery('#modalShare .form-group').removeClass('has-error');
    jQuery('#modalShare .alert.share').remove();
    if(validateShare()){
        var postData = {};
        postData.tid = jQuery('#edit-tid option:selected').val();
        postData.tname = jQuery('#edit-tid option:selected').text();
        postData.emails = jQuery('#shareEmail').val();
        jQuery('#modalShare').modal('hide');
        jQuery('#processShare').modal('show');
        jQuery.post(Drupal.settings.base_url + '/Music/agent-regions/share', postData, function (data) {
            jQuery('#shareEmail').val('');
            jQuery('#processShare').modal('hide');
            jQuery('#completeShare').modal('show');
        });
    }else{
        jQuery('#modalShare .form-group').addClass('has-error');
        jQuery('#modalShare .modal-col').append('<div class="alert alert-danger share" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span>Please enter valid email address(es)</div>');
        jQuery('#modalShare .form-group input').focus();
    }
}

function validateShare(){
    var emails = jQuery('#shareEmail').val();
    var response = false;
    if(/^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},?)+$/.test(emails)){
        response = true;
    }
    return response;
}

function downloadAll() {
    jQuery('#processDownload .load-message').html('Your request is currently being processed...');
    jQuery('#processDownload').modal('show');
    var promises = [];
    var categories = {};
    jQuery.each(jQuery('#edit-tid option'),function(index,elem){
        if(!isNaN(jQuery(elem).val())){
            categories[jQuery(elem).val()] = jQuery(elem).text();
        }
    });
    jQuery.each(categories,function(tid,name){
        var promise = new Promise(function(resolve, reject){createPdf(tid, name, resolve, reject);});
        promises.push(promise);
    });
    Promise.all(promises).then(function() {
        createZip();
    });
}
function createPdf(tid, name, resolve, reject) {
    jQuery.ajax({
        url: Drupal.settings.base_url + '/Music/agent-regions/create-pdf',
        type: "POST",
        data: {"tid": tid, "name":name},
        success: function (data, textStatus, jqXHR) {
            return resolve();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Could not update item: ' + tid + ', due to: ' + textStatus + ' | ' + errorThrown);
            return reject();
        }
    });
}

function createZip(){
    jQuery('#processDownload .load-message').html('Creating Zip Archive ...');
    jQuery.ajax({
        url: Drupal.settings.base_url + '/Music/agent-regions/pdf-all',
        type: "POST",
        success: function (data, textStatus, jqXHR) {
            jQuery('#processDownload').modal('hide');
            location.href = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Zip Created failed');
        }
    });
}

function createZipAndShare(resolve, reject){
    jQuery('#processDownload .load-message').html('Creating Zip Archive ...');
    jQuery.ajax({
        url: Drupal.settings.base_url + '/Music/agent-regions/pdf-all',
        type: "POST",
        success: function (data, textStatus, jqXHR) {
            resolve();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Zip Created failed');
        }
    });
}

function sendShareAllEmail(){
   jQuery('#processDownload .load-message').html('Sharing Zip with requested users...');
    var postData = {};
    postData.emails = jQuery('#shareAllEmail').val();
    jQuery.ajax({
        url: Drupal.settings.base_url + '/Music/agent-regions/share-all',
        type: "POST",
        data: postData,
        success: function (data, textStatus, jqXHR) {
            jQuery('#shareAllEmail').val('');
            jQuery('#processDownload').modal('hide');
            jQuery('#completeShare').modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Zip Created failed');
        }
    });
}

function shareAllModal(){
    jQuery('#modalShareAll').modal('show');
}

function shareAllPdf(){
    jQuery('#modalShareAll .form-group').removeClass('has-error');
    jQuery('#modalShareAll .alert.share').remove();
    if(validateAllShare()){
        jQuery('#modalShareAll').modal('hide');
        jQuery('#processDownload .load-message').html('Your request is currently being processed...');
        jQuery('#processDownload').modal('show');
        var promises = [];
        var categories = {};
        jQuery.each(jQuery('#edit-tid option'),function(index,elem){
            if(!isNaN(jQuery(elem).val())){
                categories[jQuery(elem).val()] = jQuery(elem).text();
            }
        });
        jQuery.each(categories,function(tid,name){
            var promise = new Promise(function(resolve, reject){createPdf(tid, name, resolve, reject);});
            promises.push(promise);
        });
        Promise.all(promises).then(function() {
            var promiseZip = new Promise(function(resolve, reject){
                createZipAndShare(resolve, reject);
            });
            promiseZip.then(function(){
                sendShareAllEmail();
            });
        });
    }else{
        jQuery('#modalShareAll .form-group').addClass('has-error');
        jQuery('#modalShareAll .modal-col').append('<div class="alert alert-danger share" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span>Please enter valid email address(es)</div>');
        jQuery('#modalShareAll .form-group input').focus();
    }
}

function validateAllShare(){
    var emails = jQuery('#shareAllEmail').val();
    var response = false;
    if(/^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},?)+$/.test(emails)){
        response = true;
    }
    return response;
}
