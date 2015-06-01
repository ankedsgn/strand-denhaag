$(function () {

    // Use --> $.getJSON('/bolt/googlemap/json?name=<INSERT_NAME_HERE>';
    // $.getJSON('/bolt/googlemap/json?name=example', function(data){
    $.getJSON('/app/extensions/GoogleMap/assets/example/example.json', function(data){

        $("#example").gmap3({

            map: {
                options: {
                    center: [46.578498, 2.457275],
                    zoom: 5,
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                }
            },

            marker: {
                values: data,
                cluster: {
                    radius: 100,
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
                    }
                },

                options: {
                    draggable: false
                    // icon: new google.maps.MarkerImage("http://maps.gstatic.com/mapfiles/icon_green.png")
                },

                events: {
                    click: function (marker, event, context) {

                        var map = $(this).gmap3("get"),
                            infowindow = $(this).gmap3({get:{name:"infowindow"}});

                        context.data.html = "<div class='noscrollbar'>" + context.data.city + " (" + context.data.zip + ")<br/><a href='"+"/"+"'>go to page</a></div>"; // context.data.url

                        if (infowindow){
                            infowindow.open(map, marker);
                            infowindow.setContent(context.data.html);
                        } else {
                            $(this).gmap3({
                                infowindow:{
                                    anchor:marker, 
                                    options:{content: context.data.html}
                                }
                            });
                        }

                    } /* end click */
                }

            }

        }); // $('#').gmap3({ ... });

    }); // $.getJSON( url, { }, function(){ ... } );

}); // $(function () { ... });