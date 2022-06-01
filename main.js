/* 
	------------------------------------------------------------------------------------------------------
	------------------------------------------------------------------------------------------------------
	Fichier Javascript permettant de gérer les vues liées autour de la map ainsi que la naviguation du site
	------------------------------------------------------------------------------------------------------
	------------------------------------------------------------------------------------------------------
*/

// variables constantes qui contiennent les liens des APIs utilisées
const apiBars = "http://172.105.245.5/api/bars"
const urlNoga = "http://172.105.245.5/api/nogas"
const urlJuridique = "http://172.105.245.5/api/juridiques"
const urlParams = "http://172.105.245.5/api/search"
const apiTaille = "http://172.105.245.5/api/tailles"
const apiCalculerDistance = "http://172.105.245.5/api/calculerDistance"

// Variables globales

var cercleOnMap;

var allowToPlaceZone = true;

// Contiendra les informations sous format de JSON de toutes les entités recherchées
var infoEntreprise = [];

// Contiendra la liste des bars chez miaetnoa
var listeBars = [];

// Contiendra la liste des coordonnées pour chaque point qui devra être présent sur la carte
var listeLatLong = new Map();

// Initialisation de la Vue

const myVueComponent = {
	data() {},
	methods: {

		/*
			Cette fonction permet de récupérer tous les paramètres requis afin de les
			envoyer au backend qui nous enverra une réponse contenant les résultats
			de la recherche effectuée
		*/
		envoieParametres() {

			// Récupération des différents paramètres

			var taille = getSelectedTailleListe().join(",");
			var limites = document.getElementById("limits-input").value;
			var codenoga = getSelectedNogaListe().join(",");
			var natjur = getSelectedNatjurListe().join(",");
			var longitude = getLocaLong();
			var latitude = getLocaLat();
			var radius = getRadiusInMeter();
			var distinct = document.getElementById("distinct");
			var distinctValue;
			var emailNotNull = document.getElementById("onlyMails");
			var emailNotNullValue;

			if (distinct.checked) {distinctValue = "true";}
			if (emailNotNull.checked) {emailNotNullValue = "true";}

			// envoi des paramètres
			axios.get(urlParams, {
					params: {
						taille: taille,
						noga: codenoga,
						natureJuridique: natjur,
						longitude: longitude,
						latitude: latitude,
						radius: radius,
						distinct: distinctValue,
						emailNotNull: emailNotNullValue,
						limit: limites
					}
				})
				// récupération de la réponse du backend
				.then((response) => {
					if (response.data.length != 0) {
						infoEntreprise = response.data;
						clearResultsListe();
						clearResultsMap();
						console.log(infoEntreprise.length);
						getInfoEntreprise(infoEntreprise, false);
					} else {
						alert("Aucun resultat trouvé avec ces paramètres...\nVeuillez modifier vos critères de recherche");
					}
				})
		},

		// Fonction qui récupère les tailles des entreprises stockées dans la base de données
		getTaille() {
			axios.get(apiTaille)
				.then((response) => {
					for (var i = 0; i < response.data.length; i++) {
						console.log(response.data[i]);
					}
				})
				.catch((error) => {
					console.log("taille error" + error);
				})
		},
	},
	mounted() {

		// recuperation des bars dans la base de données afin de les afficher sur la carte
		axios.get(apiBars)
			.then((response) => {
				for (var i = 0; i < response.data.length; i++) {
					var barCoords = [response.data[i].adress.longitude, response.data[i].adress.latitude]
					listeBars.push(response.data[i]);
					placeBarOnMap(barCoords);
				}
			})
			.catch((error) => {
				console.log("bars error" + error);
			}),

			// recupere les natures juridiques pour les mettre dans une liste deroulante
			axios.get(urlJuridique)
			.then((response) => {
				naturejuridique = "";
				for (var i = 1; i < response.data.length; i++) {
					naturejuridique += "<option value=" + response.data[i].idJuridique + ">" + response.data[i].natureJuridique + "</option>"
				}
				document.getElementById("select-naturejuridique").innerHTML = naturejuridique;
				document.getElementById("select-naturejuridique").selectedIndex = "-1";
			})
			.catch((error) => {
				console.log("erreur code noga" + error);
			}),

			// recupere les code noga pour les mettre dans une liste deroulante
			axios.get(urlNoga)
			.then((response) => {
				noga = "";
				for (var i = 0; i < response.data.length; i++) {
					noga += "<option value=" + response.data[i].code + ">" + response.data[i].nom + "</option>"
				}
				document.getElementById("select-code-noga").innerHTML = noga;
				document.getElementById("select-code-noga").selectedIndex = "-1";
			})
			.catch((error) => {
				console.log("erreur code noga" + error);
			}),

			// recupere les tailles pour les mettre dans une liste deroulante
			axios.get(apiTaille)
			.then((response) => {
				taille = "";
				for (var i = 1; i < response.data.length; i++) {
					taille += "<option value=" + response.data[i].idTaille + ">" + response.data[i].taille + "</option>"
				}
				document.getElementById("select-taille").innerHTML = taille;
				document.getElementById("select-taille").selectedIndex = "-1";
			})
	}
}

const myApp = Vue.createApp(myVueComponent).mount("#appVue")

// Recherche d'une adresse précise pour la map
var adressPositions = []

function searchAdress(adress) {
	console.log(adress)
	$.ajax({
		url: 'http://api.positionstack.com/v1/forward',
		data: {
			access_key: '126f753997e754bae2f5b143c053b9ac',
			query: adress.toString(),
			region: 'Geneva',
			fields: 'results.longitude, results.latitude',
			output: 'json',
			limit: 1
		}
	}).done(function(data) {
		adressPositions = []
		console.log(data);
		adressPositions.push(data['data'][0]['longitude'])
		adressPositions.push(data['data'][0]['latitude'])
		console.log(adressPositions);
		zoomOnSearchedPlace(adressPositions, 16);
	});
}

// Gestion des popups sur la carte
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

// création de l'overlay
const overlay = new ol.Overlay({
	element: container,
	autoPan: {
		animation: {
			duration: 250,
		},
	},
});

// fonction qui définit la position du popup
closer.onclick = function() {
	overlay.setPosition(undefined);
	closer.blur();
	return false;
};

// creation de la premiere carte au niveau des parametres
var map = new ol.Map({
	layers: [
		new ol.layer.Tile({
			source: new ol.source.OSM()
		})
	],
	overlays: [overlay],
	target: 'map',
	view: new ol.View({
		center: ol.proj.fromLonLat([6.14234, 46.207]),
		zoom: 12
	})
});

// Fonction qui permet de faire défiler la page jusqu'à l'emplacement définit
function scrollTo(hash) {
	location.hash = "#" + hash;
}

// fonction qui va zoomer sur l'adresse recherchee par l'utilisateur
function zoomOnSearchedPlace(placeCoords, zoom) {

	map.getLayers().forEach(layer => {
		if (layer && layer.get('name') === 'placeToZoom') {
			map.removeLayer(layer);
		}
	});

	var point = ol.proj.fromLonLat(placeCoords);
	var pointOnMap = new ol.geom.Point(point);

	var layerZoom = new ol.layer.Vector({
		source: new ol.source.Vector({
			projection: 'EPSG:4326',
			features: [new ol.Feature(pointOnMap)]
		}),
	});

	layerZoom.set('name', "placeToZoom");
	map.addLayer(layerZoom);

	map.getView().fit(layerZoom.getSource().getExtent(), {
		size: map.getSize(),
		maxZoom: zoom
	});

	map.getLayers().forEach(layer => {
		if (layer && layer.get('name') === 'placeToZoom') {
			map.removeLayer(layer);
		}
	});
}

// fonction qui place un point sur la carte en fonction des coordonnees de l'entite
function placePointsOnMap(entityCoords) {

	var name = entityCoords[0].toString() + "," + entityCoords[1].toString();

	var centerLongitudeLatitudePoint = ol.proj.fromLonLat(entityCoords);
	pointOnMap = new ol.geom.Point(centerLongitudeLatitudePoint);

	var layerPoint = new ol.layer.Vector({
		source: new ol.source.Vector({
			projection: 'EPSG:4326',
			features: [new ol.Feature(pointOnMap)]
		}),
		style: new ol.style.Style({
			image: new ol.style.Icon({
				src: 'images/loca5.png',
			})
		})
	});
	layerPoint.set('name', name);
	map.addLayer(layerPoint);
}

var pointSurbrillance = null;

// function qui place un point d'une autre couleur sur la carte (surbrillance)
async function placeSurbrillancePointsOnMap(entityCoords, id, nom, npa, adresse, telPrincipal, telSecondaire, email) {

	var centerLongitudeLatitudePoint = ol.proj.fromLonLat(entityCoords);

	if (pointSurbrillance != null) {
		map.getLayers().forEach(layer => {
			if (layer.get('name') === pointSurbrillance) {
				layer.setStyle(new ol.style.Style({
					image: new ol.style.Icon({
						src: 'images/loca5.png',
					})
				}));
			}
		});
	}

	pointSurbrillance = entityCoords[0].toString() + "," + entityCoords[1].toString();

	map.getLayers().forEach(layer => {

		if (layer.get('name') === pointSurbrillance) {

			layer.setStyle(
				new ol.style.Style({
					image: new ol.style.Icon({
						src: 'images/loca6.png',
					})
				})
			);
		}
	});

	map.getLayers().get(pointSurbrillance);

	if (infoEntreprise[id] != null && infoEntreprise[id].distanceCalculated == undefined) {
		await FindClosestBar(infoEntreprise[id]);
	}

	overlay.setPosition(centerLongitudeLatitudePoint);
	content.innerHTML = "<b>" + nom + "</b>" + "<br>" + adresse + ", " + npa + "<br>" + "Tél. princip. : " +
		telPrincipal + "<br>" + "Tél. Second. : " + telSecondaire + "<br>" + "Email : " + email +
		"<br> <br>" + "L'entité se trouve à " + infoEntreprise[id].distanceCalculated[0] +
		" minutes en voiture du bar placé " + infoEntreprise[id].distanceCalculated[1];

}

// fonction qui place les bars existants sur la carte
function placeBarOnMap(barCoords) {

	var centerLongitudeLatitudeBars = ol.proj.fromLonLat(barCoords);
	barOnMap = new ol.geom.Point(centerLongitudeLatitudeBars);

	var layerBar = new ol.layer.Vector({
		source: new ol.source.Vector({
			projection: 'EPSG:4326',
			features: [new ol.Feature(barOnMap)]
		}),
		style: new ol.style.Style({
			image: new ol.style.Icon({
				src: 'images/barcafe15.png',
			})
		})
	});

	layerBar.set('name', 'bar');
	map.addLayer(layerBar);
}

// fonction qui supprime le cercle place sur la carte
function deleteCircleOnMap() {
	map.getLayers().forEach(layer => {
		if (layer && layer.get('name') === 'circle') {
			map.removeLayer(layer);
		}
	});
}

// fonction pour placer un cercle sur la carte après avoir appuyer sur le bouton
function clickOnMapON() {

	deleteCircleOnMap();
	allowToPlaceZone = true;

	map.on('click', function(event) {

		if (allowToPlaceZone) {

			var coordsOnMap = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
			var centerLongitudeLatitude2 = ol.proj.fromLonLat(coordsOnMap);
			var radius = document.getElementById("sliderCircleOnMap").value;
			cercleOnMap = new ol.geom.Circle(centerLongitudeLatitude2, parseInt(radius));

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

// systeme de fleches pour deplacer le cercle ?
function moveZoneDeRecherche() {}

function getLocaLat() {
	var centerCircle = cercleOnMap.getCenter();
	var coordCenter = ol.proj.transform(centerCircle, 'EPSG:3857', 'EPSG:4326');
	var latitude = coordCenter[1];
	//console.log(latitude);
	return latitude;
}

function getLocaLong() {
	var centerCircle = cercleOnMap.getCenter();
	var coordCenter = ol.proj.transform(centerCircle, 'EPSG:3857', 'EPSG:4326');
	var longitude = coordCenter[0];
	//console.log(longitude);
	return longitude;
}

// fonction qui recupere le rayon du cercle
function getRadiusInMeter() {
	var centerCircle = cercleOnMap.getCenter();
	var coordCenter = ol.proj.transform(centerCircle, 'EPSG:3857', 'EPSG:4326');
	var coordExte = ol.proj.transform(cercleOnMap.getLastCoordinate(), 'EPSG:3857', 'EPSG:4326');
	var radius = getDistanceInMeters(coordCenter[1], coordCenter[0], coordExte[1], coordExte[0], "K")
	//console.log(radius);
	return radius;
}

// fonction qui translate le rayon en metre
function getDistanceInMeters(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	} else {
		var radlat1 = Math.PI * lat1 / 180;
		var radlat2 = Math.PI * lat2 / 180;
		var theta = lon1 - lon2;
		var radtheta = Math.PI * theta / 180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180 / Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit == "K") {
			dist = dist * 1.609344 * 1000
		}
		if (unit == "N") {
			dist = dist * 0.8684
		}
		return dist;
	}
}

// Modal Image Gallery
function onClick(element) {
	document.getElementById("img01").src = element.src;
	document.getElementById("modal01").style.display = "block";
	var captionText = document.getElementById("caption");
	captionText.innerHTML = element.alt;
}

// Change style of navbar on scroll
window.onscroll = function() {
	myFunction()
};

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