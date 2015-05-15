[[php]]// <?php 


/* 


Scheveningen: 733252
http://weather.yahoo.com/netherlands/south-holland/scheveningen-733252/
http://weather.yahooapis.com/forecastrss%3Fp=NLXX0016%26u=c


Het midden van Nederland: NLXX0018
http://weather.yahoo.com/netherlands/utrecht/utrecht-734047/
http://weather.yahooapis.com/forecastrss?p=NLXX0018&u=c

Het midden van Belgie: BEXX0005
http://weather.yahoo.com/belgium/capital-region-of-brussels/bruxelles-968019/
http://weather.yahooapis.com/forecastrss?p=BEXX0005&u=c

Lang leve de Yahoo weather API.
http://developer.yahoo.com/weather/ 

// En de duitser die er een script voor maakte:
http://www2.voegeli.li/no_cache/code-tutorials/php-scripts/class-weather-v2.html

*/


global $PIVOTX;

require_once($PIVOTX['paths']['templates_path']."strand/weather/class.xml.parser.inc");
require_once($PIVOTX['paths']['templates_path']."strand/weather/class.weather.inc");





// LocationCode, seconds cachelifetime, TempUnit (F or C), Cache Directory
$weer = new weather("NLXX0016", 300, "c", $PIVOTX['paths']['cache_path']);
 
// Parse the weather data with caching
$weer->parsecached(); 


$timestamp = strtotime($weer->forecast['CURRENT']['DATE']);


echo "<!-- het weerbericht, met Jan Pelleboer -->";

//echo "<div class='weather-day'><img src='http://strand-denhaag.nl/pivotx/templates/strand/img/weather_icons/".$weer->forecast['CURRENT']['CODE'].".png' width='38' height='38' alt='' />";
//printf("<p><span class='temp'>%s&deg;</span><br />Nu (%s)</p></div>", $weer->forecast['CURRENT']['TEMP'],date('H:i', $timestamp) );

echo "<div class='weather-day weather-day-last'><img src='http://strand-denhaag.nl/pivotx/templates/strand/img/weather_icons/".$weer->forecast[1]['CODE'].".png' width='38' height='38' alt='' />";
printf("<p><span class='temp'>%s&deg; / %s&deg;</span><br />Morgen</p></div>", $weer->forecast[1]['HIGH'], $weer->forecast[1]['LOW']  );

echo "<div class='weather-day'><img src='http://strand-denhaag.nl/pivotx/templates/strand/img/weather_icons/".$weer->forecast['CURRENT']['CODE'].".png' width='38' height='38' alt='' />";
printf("<p><span class='temp'>%s&deg; / %s&deg;</span><br />Vandaag</p></div>", $weer->forecast[0]['HIGH'], $weer->forecast[0]['LOW'] );



echo "<!-- einde van dit bulletin. -->"

[[/php]]