
// test avec VueJs3 et Axios

const api = "https://api.coindesk.com/v1/bpi/currentprice.json"
const api2 = "https://randomuser.me/api/?results=10"
const apiBars = "http://172.105.245.5:8000/api/bars"

const myVueComponent = {
  data() {
    return {
      bars : ""
    }
  },
  methods : {
      testApiRequest() {
        axios.get(apiBars)
        .then((response) => {

          for (var i = 0; i < response.data.length; i++) {
            console.log(response.data[i]);
            var barCoords = [response.data[i].Longitude,response.data[i].Latitude]
            placeBarOnMap(barCoords);
          }
        })
        .catch((error) => {
          console.log("yousk2");
        })
      }
  }
}

const myApp = Vue.createApp(myVueComponent).mount("#appVue")


// local variables
var cercleOnMap;
var allowToPlaceZone = true;

var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([6.14234, 46.207]),
    zoom: 12
  })
});

// fonction qui placent les bars existants sur la carte
function placeBarOnMap(barCoords) {

  var centerLongitudeLatitudeBars = ol.proj.fromLonLat(barCoords);
  barOnMap = new ol.geom.Circle(centerLongitudeLatitudeBars, 50000);

  var layerBar = new ol.layer.Vector({
    source: new ol.source.Vector({
      projection: 'EPSG:4326',
      features: [new ol.Feature(barOnMap)]
    }),
    style: [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'black',
          width: 2
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 0, 0, 0.1)'
        })
      })
    ]
  });
  layerBar.set('name', 'bar');
  map.addLayer(layerBar);

}

//  fonction pour placer un cercle sur la carte après avoir appuyer sur le bouton
function clickOnMapON() {

  map.on('click', function(event) {

    if (allowToPlaceZone) {

      var coordsOnMap = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
      console.log(coordsOnMap);
      var centerLongitudeLatitude2 = ol.proj.fromLonLat(coordsOnMap);
      console.log(centerLongitudeLatitude2);
      cercleOnMap = new ol.geom.Circle(centerLongitudeLatitude2, 500);
      console.log(cercleOnMap);
      // console.log(coords);

      var layer3 = new ol.layer.Vector({
        source: new ol.source.Vector({
          projection: 'EPSG:4326',
          features: [new ol.Feature(cercleOnMap)]
        }),
        style: [
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: 'red',
              width: 2
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255, 0, 0, 0.1)'
            })
          })
        ]
      });
      layer3.set('name', 'circle');
      map.addLayer(layer3);
      increaseCircleSize();
      allowToPlaceZone = false;
    }
  })
}

function increaseCircleSize() {
  // slider qui controle le radius du cercle
  var sliderCircle = document.getElementById("sliderCircleOnMap");
  // Update le slider
  sliderCircle.oninput = function() {
    cercleOnMap.setRadius(parseInt(this.value));
  }
}

// fonction qui supprime le cercle place sur la carte
function deleteCircleOnMap() {
  map.getLayers().forEach(layer => {
    if (layer && layer.get('name') === 'circle') {
      map.removeLayer(layer);
    }
  });
  console.log("yousk2");
  allowToPlaceZone = true;
}

// systeme de fleches pour deplacer le cercle ?
function moveZoneDeRecherche() {
  getRadiusInMeter();
}

// fonction qui recupere le rayon du cercle
function getRadiusInMeter() {
  var centerCircle = cercleOnMap.getCenter();
  var coordCenter = ol.proj.transform(centerCircle, 'EPSG:3857', 'EPSG:4326');
  var coordExte = ol.proj.transform(cercleOnMap.getLastCoordinate(), 'EPSG:3857', 'EPSG:4326');
  console.log(getDistanceInMeters(coordCenter[1], coordCenter[0], coordExte[1], coordExte[0], "K"));
}

// fonction qui translate le rayon en metre
function getDistanceInMeters(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 * 1000 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

var slider1 = document.getElementById("myRange1");
var slider2 = document.getElementById("myRange2");
var slider3 = document.getElementById("myRange3");
var slider4 = document.getElementById("myRange4");
var value1 = document.getElementById("valueemploye1");
var value2 = document.getElementById("valueemploye2");
var value3 = document.getElementById("valueage");
var value4 = document.getElementById("valueloyer");
slider1.onchange = function() {value1.innerHTML = this.value;}
slider2.onchange = function() {value2.innerHTML = this.value;}
slider3.onchange = function() {value3.innerHTML = this.value;}
slider4.onchange = function() {value4.innerHTML = this.value;}

// Modal Image Gallery
function onClick(element) {
  document.getElementById("img01").src = element.src;
  document.getElementById("modal01").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = element.alt;
}

// Change style of navbar on scroll
window.onscroll = function() {myFunction()};
function myFunction() {
    var navbar = document.getElementById("myNavbar");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        navbar.className = "w3-bar" + " w3-card" + " w3-animate-top" + " w3-white";
    } else {
        navbar.className = navbar.className.replace(" w3-card w3-animate-top w3-white", "");
    }
}

// Used to toggle the menu on small screens when clicking on the menu button
function toggleFunction() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}




// test api fetch
