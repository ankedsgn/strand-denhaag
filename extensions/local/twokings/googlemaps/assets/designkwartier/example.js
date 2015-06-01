$(function () {

    if (!window.location.origin) {
        window.location.origin = window.location.protocol+"//"+window.location.host;
    }

    /*-- enterprise quality function names --*/
    function convertLocationTypeToColor(locationType) {
        var color = 'blauw';

        switch (locationType) {
            case "Pop-up store":
                color = 'roze';
                break;
            case "Tentoonstelling":
                color = 'blauw';
                break;
            case "Food":
                color = 'groen';
                break;
            case "Winkel":
                color = 'roze'; // Voor nu althans..
                break;
            case "Infopunt":
                color = 'grijs';  
                break;
            default:
                console.log("Warning: undefined type:"+locationType);
        }

        return color;
    }

    // no slugify function in js :p
    function convertLocationTypeToClassName(locationType) {
        var className = 'type-undefined';

        switch (locationType) {
            case "Pop-up store":
                className = 'type-pop-up-store';
                break;
            case "Tentoonstelling":
                className = 'type-tentoonstelling';
                break;
            case "Food":
                className = 'type-food';
                break;
            case "Winkel":
                className = 'type-winkel';
                break;
            case "Infopunt":
                className = 'type-infopunt';
                break;
            default:
                console.log("Warning: undefined type:"+locationType);
        }

        return className;
    }

    $.getJSON('/bolt/googlemap/json?name=designkwartier', function(data){

        // Pre handle the data!
        var color  = 'blauw';
        var number = 0;
        var image  = {
            url: "http://maps.google.com/mapfiles/marker_green.png",
        };

        for (index = 0, max = data.length; index < max; ++index) {
            console.log(data[index]);
            // console.log(data[index].data.number);
            // console.log(data[index].data.type);

            color = convertLocationTypeToColor(data[index].data.type);

            number = data[index].data.number;
            number = (0 <= number && number <= 45) ? number : 0;

            image = {
                url: window.location.origin + "/theme/designkwartier/img/markers/" + color + "[" + number + "]" + ".png",
                size: new google.maps.Size(24, 24),
                scaledSize: new google.maps.Size(24, 24)
            };

            data[index]['options'] = {
                icon: image
            }
        }

        $("#designkwartier").gmap3({

            map: {
                options: {
                    center: [52.081361, 4.296819], // The Netherlands!
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.MAP
                }
            },

            marker: {
                values: data,

                options: {
                    draggable: false
                    // icon: new google.maps.MarkerImage("http://maps.gstatic.com/mapfiles/icon_green.png")
                },

                events: {
                    click: function (marker, event, context) {

                        var map = $(this).gmap3("get"),
                            infowindow = $(this).gmap3({get:{name:"infowindow"}});

                        var css = convertLocationTypeToClassName(context.data.type);

                        if (context.data.type=="Infopunt") {
                            return false; // do nothing on infopunten
                        }

                        var deelnemers = '<li class="first"><span>Deelnemers op deze locatie:</span></li>';
                        if ((typeof context.data.relations != 'undefined') && (typeof context.data.relations.deelnemers != 'undefined')) {
                            $.each( context.data.relations.deelnemers, function(index, value){
                                deelnemers += '<li><a href="/deelnemers#' + value.slug + '">' + value.title + '</a></li>';
                            });
                        }

                        if (deelnemers.length > 0) {
                            deelnemers = '<ul class="infowindow-deelnemers">'+deelnemers+'</ul>'
                        }

                        context.data.html = "<div class='noscrollbar'>"
                                          + "<h3 class='infowindow-titel'><span class='"+css+"'><i>#</i>" + context.data.number + "</span> " + context.data.title + "</h3>"
                                          + "<p class='infowindow-adres'>" + context.data.adres.formatted_address + "</p>" /* used to be: context.data.adres.address */
                                          + deelnemers
                                          + "<p class='infowindow-teaser'>" + $(context.data.teaser).text() + "</p>" // stripping html shizzle from data.teaser
                                          + "<p class='infowindow-readmore'><a href='/locaties#"+context.data.slug+"'>Lees meer &raquo;</a></p>"
                                          + "</div>";

                        if (infowindow){

                            infowindow.open(map, marker);
                            infowindow.setContent(context.data.html);
                            infowindow.setOptions({width:500, maxWidth:500}); // not working

                        } else {
                            $(this).gmap3({

                                infowindow:{
                                    anchor:marker, 
                                    options:{content: context.data.html},
                                    maxWidth: 500,
                                    width: 500
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