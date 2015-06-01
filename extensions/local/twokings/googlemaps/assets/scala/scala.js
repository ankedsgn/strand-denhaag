$(function () {

    $.getJSON('/bolt/googlemap/json?name=scala', function(data){

        $("#scala").gmap3({

            map: {
                options: {
                    center: [51.8,4.9], // The Netherlands!
                    zoom: 8,
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                }
            },

            marker: {
                values: data,
                cluster: {
                    radius: 25,
                    // This style will be used for clusters with more than 0 markers
                    0: {
                        content: "<div class='cluster cluster-1'>CLUSTER_COUNT</div>",
                        width: 53,
                        height: 52
                    },
                    // This style will be used for clusters with more than 20 markers
                    20: {
                        content: "<div class='cluster cluster-2'>CLUSTER_COUNT</div>",
                        width: 56,
                        height: 55
                    },
                    // This style will be used for clusters with more than 50 markers
                    50: {
                        content: "<div class='cluster cluster-3'>CLUSTER_COUNT</div>",
                        width: 66,
                        height: 65
                    },
                    maxZoom: 14 // some points are just too close to each other!
                },

                options: {
                    draggable: false
                    // icon: new google.maps.MarkerImage("http://maps.gstatic.com/mapfiles/icon_green.png")
                },

                events: {
                    click: function (marker, event, context) {

                        var map = $(this).gmap3("get"),
                            infowindow = $(this).gmap3({get:{name:"infowindow"}});

                        context.data.html = "<div class='noscrollbar'>" + context.data.titel + "<br /><em>" + context.data.locatie + "</em><br /><a href='"+"/projecten/"+context.data.slug+"'>naar project &raquo;</a></div>"; // context.data.url

                        if (infowindow){
                            infowindow.open(map, marker);
                            infowindow.setContent(context.data.html);
                            infowindow.setOptions({maxWidth:500})
                        } else {
                            $(this).gmap3({
                                infowindow:{
                                    anchor:marker, 
                                    options:{content: context.data.html},
                                    maxWidth: 500
                                }
                            });
                        }

                    } /* end click */
                },

                autofit: { }

            }

        }); // $('#').gmap3({ ... });

    }); // $.getJSON( url, { }, function(){ ... } );

}); // $(function () { ... });