
async function FindClosestBar(entity) {
	var closer = [];
	const promise = new Promise((resolve, reject) => {
		listeBars.forEach(bar => {
			//calulate the closest bar by lattitude and longitude
			//if closer is undefined, set it to the first bar
			if (closer.length == 0) {
				var distance = calculateDistance(entity.latitude, entity.longitude, bar.adress.latitude, bar.adress.longitude);
				closer = [distance, bar.adress.adresse, bar.adress.latitude, bar.adress.longitude];
				console.log(distance);
			} else {
				var distance = calculateDistance(entity.latitude, entity.longitude, bar.adress.latitude, bar.adress.longitude);
				if (closer[0] > distance) {
					closer = [distance, bar.adress.adresse, bar.adress.latitude, bar.adress.longitude];
				}
			}
		});
		$.ajax({
			url: apiCalculerDistance,
			data: {
				depart: entity.latitude + "," + entity.longitude,
				arriver: closer[2] + "," + closer[3],
			}
		}).done(function(data) {
			//transorm the time in seconds to minutes
			//round the time to 2 decimals
            var seconds = data.travelDuration.resourceSets[0].resources[0].travelDuration % 60;
            if(seconds < 10){
                seconds = "0" + seconds;
            }
			time = Math.floor(data.travelDuration.resourceSets[0].resources[0].travelDuration / 60) + ":" + seconds;
			entity.distanceCalculated = [time, closer[1]];
			resolve(entity.distanceCalculated);
		})
	});
	await promise;
	return promise;

}
//calculate the distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
	var R = 6371; // km
	var dLat = (lat2 - lat1) * Math.PI / 180;
	var dLon = (lon2 - lon1) * Math.PI / 180;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;

	return d;
}