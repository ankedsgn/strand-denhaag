$(document).ready(function(){


	$('.strandtent-filter input').bind('change',function(e){
		update_strandtenten();
	});
	
	$.simpleWeather({
		zipcode: '',
		woeid: '733252',
		location: '',
		unit: 'c',
		success: function(weather) {
		htmlnow = '<img width="38px" src="/theme/strand/images/weather_icons/'+weather.code+'.png">';
		htmlnow += '<p><span class="temp">'+weather.high+'&deg; / '+weather.low+'&deg;</span><br />vandaag</p>';
		htmltom = '<img width="38px" src="/theme/strand/images/weather_icons/'+weather.tomorrow.code+'.png">';
		htmltom += '<p><span class="temp">'+weather.tomorrow.high+'&deg; / '+weather.tomorrow.low+'&deg;</span><br />morgen</p>';
		 
		$("#weather").html(htmlnow);
		$("#weathermorgen").html(htmltom);
		},
		error: function(error) {
		$("#weather").html('<p>'+error+'</p>');
		}
	});

		   
});

function update_strandtenten()
{
	var flags = [];

	jQuery('.strandtent-filter input:checked').each(function(){
		flags[flags.length] = jQuery(this).val();
	});
	
	console.log (flags);
	if (flags.length == 0) {
		jQuery('.strandtenten-grid li.strandtent-item').show();
	}
	else {
		jQuery('.strandtenten-grid li.strandtent-item').each(function(){
			var show = false;

			var found = 0;
			for(var i=0; i < flags.length; i++) {
				if (jQuery(this).hasClass(flags[i])) {
					found++;
				}
			}

			if (found == flags.length) {
				show = true;
			}

			if (show) {
				jQuery(this).show();
			}
			else {
				jQuery(this).hide();
			}

		});
	}
}