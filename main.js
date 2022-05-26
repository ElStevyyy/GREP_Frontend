
// test GET avec VueJs3 et Axios

const apiBars = "http://172.105.245.5/api/bars"
const urlNoga = "http://172.105.245.5/api/nogas"
const urlJuridique = "http://172.105.245.5/api/juridiques"
const urlParams = "http://172.105.245.5/api/search"
const apiTaille = "http://172.105.245.5/api/tailles"
var infoEntreprise = [];
var listeBars = [];
var listeLatLong = new Map();

const myVueComponent = {
  data() {},

  methods : {

      // test avec une requete POST
      testPost() {
        axios({
          method: 'post',
          url: apiBars,
          data: {
            Latitude: 66.666,
            Longitude: 77.777
          },
        });
      },

      // fonction d'envoi des parametres
      envoieParametres() {

        // bons parametres, ne pas supprimer
        
        var taille = getSelectedTailleListe().join(",");
        //var zoneexclu = document.getElementById("value-zoneexclu").innerHTML;
        var codenoga = getSelectedNogaListe().join(",");
        var natjur = getSelectedNatjurListe().join(",");
        var longitude = getLocaLong();
        var latitude = getLocaLat();
        var radius = getRadiusInMeter();
        var distinct = document.getElementById("distinct");
        var distinctValue;
        var onlyMails = document.getElementById("onlyMails");
        var onlyMailsValue;

        if (distinct.checked) {
          distinctValue = "true";
        } 

        if (onlyMails.checked) {
          onlyMailsValue = "true";
        } 

        console.log(distinctValue);

        //console.log(codenoga);

        //var taille = "2";
        /*
        var zoneexclu = "200";
        var codenoga = "9496";
        var natjur = "4";
        var longitude = 6.140833290040641;
        var latitude = 46.2005701220817;
        var radius = 6913.282075607314;
        */
        
        axios.get(urlParams, {
          params: {
            taille: taille,
            //zoneExclusion: zoneexclu,
            noga: codenoga,
            natureJuridique: natjur,
            longitude: longitude,
            latitude: latitude,
            radius: radius,
            distinct: distinctValue,
            onlyMails: onlyMailsValue
          }
        })
        .then((response) => {
        
          if (response.data.length != 0) {
            infoEntreprise = response.data;
            clearResultsListe();
            clearResultsMap();
            console.log(infoEntreprise.length);
            getInfoEntreprise();
            // document.querySelector("#resultsScroll").scrollIntoView();
          } else {
            alert("Aucun resultat trouvé avec ces paramètres...\nVeuillez modifier vos critères de recherche");
          }
        })

      },

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

      afficherListeBars() {

        for (var i = 0; i < listeBars.length; i++) {
          console.log(listeBars[i].adress.adresse);

          var label = document.createElement("label");
          label.classList.add("labelBars");
          label.htmlFor = i;
          label.appendChild(document.createTextNode(listeBars[i].adress.adresse));

          var parent = document.getElementById("listeBars");
          var child = document.createElement("INPUT");
          child.setAttribute("type", "checkbox");
          child.setAttribute("id", i);

          parent.appendChild(label);
          parent.appendChild(child);

        }
      }
  },
  mounted() {

    // recuperation des bars avec une requete GET
    axios.get(apiBars)
    .then((response) => {
      for (var i = 0; i < response.data.length; i++) {
        //console.log(response.data[i]);
        var barCoords = [response.data[i].adress.longitude,response.data[i].adress.latitude]
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
      //console.log(response);
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
      //console.log(response);
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


// local variables
var cercleOnMap;
var allowToPlaceZone = true;

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const overlay = new ol.Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

closer.onclick = function () {
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



function scrollTo(hash) {
  location.hash = "#" + hash;
}

var listeCodeNoga = [];

// function de creation du panier de code noga (mutiple selections)
function getSelectedNoga() {

  var selectNoga = document.getElementById("select-code-noga");
  var selectedValue = selectNoga.options[selectNoga.selectedIndex].value;
  var selectedText = selectNoga.options[selectNoga.selectedIndex].text;
  var substring = selectedText.substring(0, 34);

  listeCodeNoga.push(selectedValue);
  console.log(listeCodeNoga.join(","));

  var parent = document.createElement("div");
  parent.classList.add("noga-parent");

  var nogaName = document.createElement("div");
  nogaName.classList.add("noga-name");
  nogaName.appendChild(document.createTextNode(substring));

  var nogaDelete = document.createElement("div");
  nogaDelete.classList.add("noga-delete");
  var iconeCroix = document.createElement("img");
  iconeCroix.id = selectedValue;
  iconeCroix.src = "images/croix.png"
  nogaDelete.appendChild(iconeCroix);

  nogaDelete.addEventListener('click', function (event) {
    this.parentNode.remove();

    var collection = document.getElementById("select-code-noga").children;
      for (let i = 0; i < collection.length; i++) {
        var id;
        if(event.target.id == "") {
          id = event.target.firstChild.id
        }else{
          id = event.target.id;
        }
        if (collection[i].value == id) {
          collection[i].removeAttribute('disabled')
          document.getElementById("select-code-noga").selectedIndex = "-1";
          listeCodeNoga.splice(listeCodeNoga.indexOf(id), 1);
          console.log(listeCodeNoga.join(","));
        }
      }
  })

  parent.appendChild(nogaName);
  parent.appendChild(nogaDelete);

  document.getElementById("nogaBucket").appendChild(parent);

  document.getElementById("select-code-noga").options[document.getElementById("select-code-noga").selectedIndex].disabled = true;

}

function getSelectedNogaListe() {
  return listeCodeNoga;
}


var listeNatjur = [];

// function de creation du panier de nature juridique (mutiple selections)
function getSelectedNatjur() {

  var selectNatjur = document.getElementById("select-naturejuridique");
  var selectedValue = selectNatjur.options[selectNatjur.selectedIndex].value;
  var selectedText = selectNatjur.options[selectNatjur.selectedIndex].text;
  var substring = selectedText.substring(0, 34);

  listeNatjur.push(selectedValue);
  console.log(listeNatjur.join(","));

  var parent = document.createElement("div");
  parent.classList.add("natjur-parent");

  var natjurName = document.createElement("div");
  natjurName.classList.add("natjur-name");
  natjurName.appendChild(document.createTextNode(substring));

  var natjurDelete = document.createElement("div");
  natjurDelete.classList.add("natjur-delete");
  natjurDelete.setAttribute('id', selectNatjur.options[selectNatjur.selectedIndex].value);
  var iconeCroix = document.createElement("img");
  iconeCroix.id = selectedValue;
  iconeCroix.src = "images/croix.png";
  natjurDelete.appendChild(iconeCroix);

  natjurDelete.addEventListener('click', function (event) {
    this.parentNode.remove();

    var collection = document.getElementById("select-naturejuridique").children;
      for (let i = 0; i < collection.length; i++) {
        var id;
        if(event.target.id == "") {
          id = event.target.firstChild.id
        }else{
          id = event.target.id;
        }
        if (collection[i].value == id) {
          collection[i].removeAttribute('disabled')
          document.getElementById("select-naturejuridique").selectedIndex = "-1";
          listeNatjur.splice(listeNatjur.indexOf(id), 1);
          console.log(listeNatjur.join(","));
        }
      }
  })

  parent.appendChild(natjurName);
  parent.appendChild(natjurDelete);

  document.getElementById("natjurBucket").appendChild(parent);

  document.getElementById("select-naturejuridique").options[document.getElementById("select-naturejuridique").selectedIndex].disabled = true;

}

function getSelectedNatjurListe() {
  return listeNatjur;
}

var listeTaille = [];

function getSelectedTaille() {

  var selectTaille = document.getElementById("select-taille");
  var selectedValue = selectTaille.options[selectTaille.selectedIndex].value;
  var selectedText = selectTaille.options[selectTaille.selectedIndex].text;
  var substring = selectedText.substring(0, 34);

  listeTaille.push(selectedValue);
  console.log(listeTaille.join(","));

  var parent = document.createElement("div");
  parent.classList.add("taille-parent");

  var tailleName = document.createElement("div");
  tailleName.classList.add("taille-name");
  tailleName.appendChild(document.createTextNode(substring));

  var tailleDelete = document.createElement("div");
  tailleDelete.classList.add("taille-delete");
  tailleDelete.setAttribute('id', selectTaille.options[selectTaille.selectedIndex].value);
  var iconeCroix = document.createElement("img");
  iconeCroix.id = selectedValue;
  iconeCroix.src = "images/croix.png";
  tailleDelete.appendChild(iconeCroix);

  tailleDelete.addEventListener('click', function (event) {
    this.parentNode.remove();

    var collection = document.getElementById("select-taille").children;
      for (let i = 0; i < collection.length; i++) {
        var id;
        if(event.target.id == "") {
          id = event.target.firstChild.id
        }else{
          id = event.target.id;
        }
        if (collection[i].value == id) {
          collection[i].removeAttribute('disabled')
          document.getElementById("select-taille").selectedIndex = "-1";
          listeTaille.splice(listeTaille.indexOf(id), 1);
          console.log(listeTaille.join(","));
        }
      }
  })

  parent.appendChild(tailleName);
  parent.appendChild(tailleDelete);

  document.getElementById("tailleBucket").appendChild(parent);

  document.getElementById("select-taille").options[document.getElementById("select-taille").selectedIndex].disabled = true;

}

function getSelectedTailleListe() {
  return listeTaille;
}

function afficherListeBars() {

  for (var i = 0; i < listeBars.length; i++) {
    console.log(listeBars[i]);
  }

}

function checkLatLong(list, coord){
  var res = false;
  list.forEach(item => {
    if(item[0]==coord[0] && item[1]==coord[1]){
      res = true;
    }
  });
  return res;
}

function clearResultsListe() {
  var node = document.getElementById("liste-resultats");
  while (node.hasChildNodes()) { 
    node.removeChild(node.lastChild); 
  }
}

function clearResultsMap() {

  listeLatLong.forEach (function(value, key) { 
    map.getLayers().getArray()
      .filter(layer => layer.get('name') === key)
      .forEach(layer => map.removeLayer(layer));
  });

  listeLatLong = new Map();
  console.log(listeLatLong);
}



// fonction qui recupere les informations des entites, cree les div et les ajoute
function getInfoEntreprise() {

  deleteCircleOnMap();

  //var infoToExtract = infoEntreprise;

  for (var i = 0; i < infoEntreprise.length; i++) {

    var parent = document.createElement("div");
    parent.classList.add("entites");
    parent.setAttribute("id", i);

    var div1 = document.createElement("div");
    div1.classList.add("div1");
    div1.appendChild(document.createTextNode(infoEntreprise[i].nom));

    var coordSurbrillance;

    div1.addEventListener('click', (event) => {
      coordSurbrillance = [infoEntreprise[event.target.parentElement.id].longitude, infoEntreprise[event.target.parentElement.id].latitude];
      var nom = infoEntreprise[event.target.parentElement.id].nom;
      var npa = infoEntreprise[event.target.parentElement.id].npa;
      var adresse = infoEntreprise[event.target.parentElement.id].adresse;
      var telPrincipal = parseInt(infoEntreprise[event.target.parentElement.id].telPrincipal);
      var telSecondaire = parseInt(infoEntreprise[event.target.parentElement.id].telSecondaire);
      var email = infoEntreprise[event.target.parentElement.id].email;

      if (isNaN(telPrincipal)) {
        telPrincipal = "Non renseigné";
      } else {
        telPrincipal = "+" + telPrincipal.toString().substring(0, 2) + " " + telPrincipal.toString().substring(2, 4) + " " + telPrincipal.toString().substring(4, 7) + " " + telPrincipal.toString().substring(7, 9) + " " + telPrincipal.toString().substring(9, 11);
      }

      if (isNaN(telSecondaire)) {
        telSecondaire = "Non renseigné";
      } else {
        telSecondaire = "+" + telSecondaire.toString().substring(0, 2) + " " + telSecondaire.toString().substring(2, 4) + " " + telSecondaire.toString().substring(4, 7) + " " + telSecondaire.toString().substring(7, 9) + " " + telSecondaire.toString().substring(9, 11);
      }

      if (email == null) {
        email = "Non renseigné";
      }
      
      //console.log("type of tel = " + typeof telPrincipal);
      placeSurbrillancePointsOnMap(coordSurbrillance, nom, npa, adresse, telPrincipal, telSecondaire, email);
      //console.log(infoEntreprise[event.target.parentElement.id]);
      
    });

    var div2 = document.createElement("div");
    div2.classList.add("div2");
    div2.appendChild(document.createTextNode(infoEntreprise[i].branche));

    var div3 = document.createElement("div");
    div3.classList.add("div3");

    if (infoEntreprise[i].taille !== null) {
      div3.appendChild(document.createTextNode(infoEntreprise[i].taille));
    }
    else {
      div3.appendChild(document.createTextNode("Taille non renseignée"));
    }

    var div4 = document.createElement("div");
    div4.classList.add("div4");
    if (infoEntreprise[i].siteInternet !== null) {
      var a = document.createElement("a");
      var link = document.createTextNode(infoEntreprise[i].siteInternet);
      a.appendChild(link);
      a.href = infoEntreprise[i].siteInternet.toString();
      a.target = "_blank";
      div4.appendChild(a);
    }
    else {
      div4.appendChild(document.createTextNode("Site web non renseigné"));
    }

    var div5 = document.createElement("div");
    div5.classList.add("div5");
    var iconePoubelle = document.createElement("img");
    iconePoubelle.src = "images/poub.png"
    div5.appendChild(iconePoubelle);

    div5.addEventListener('click', function (event) {
      this.parentNode.remove();
      var id;
      
      if (event.target.parentElement.id == "") {
        id = event.target.parentElement.parentElement.id;
      }
      else {
        id = event.target.parentElement.id;
      }
      
      var entityCoords = infoEntreprise[id].longitude.toString() + "," + infoEntreprise[id].latitude.toString();
      infoEntreprise[id] = null;

      console.log(entityCoords);

      if (listeLatLong.has(entityCoords)) {
        if (listeLatLong.get(entityCoords) <= 1) {
          console.log("suppression du point sur la carte");
          listeLatLong.delete(entityCoords);
          overlay.setPosition(undefined);
          
          map.getLayers().getArray()
          .filter(layer => layer.get('name') === entityCoords)
          .forEach(layer => map.removeLayer(layer));

          console.log(listeLatLong);
        }
        else {
          console.log("coordonnée - 1");
          listeLatLong.set(entityCoords, listeLatLong.get(entityCoords) - 1);
          console.log(listeLatLong);
        }
      }
      else {
        console.log("yousk2");
      }
    })

    parent.appendChild(div1);
    parent.appendChild(div2);
    parent.appendChild(div3);
    parent.appendChild(div4);
    parent.appendChild(div5);

    //parent.appendChild(document.createTextNode(infoEntreprise[i].nom));
    document.getElementById("liste-resultats").appendChild(parent);

    var pointCoords = [infoEntreprise[i].longitude,infoEntreprise[i].latitude]
    var pointComparaison = infoEntreprise[i].longitude.toString() + "," + infoEntreprise[i].latitude.toString();
    

    if (listeLatLong.has(pointComparaison)) {
      //console.log("already in array listeLatLong");
      listeLatLong.set(pointComparaison, listeLatLong.get(pointComparaison) + 1);
    }
    else {
      listeLatLong.set(pointComparaison, 1);
      placePointsOnMap(pointCoords);
    } 
  }
  console.log(listeLatLong);

  replaceParamsByResults();
}

function replaceParamsByResults() {
  var divParam = document.getElementById("formsid");
  var divResults = document.getElementById("liste-resultats");

  divParam.style.display = "none";
  divResults.style.display = "block";
  
}

function replaceResultsByParans() {
  var divParam = document.getElementById("formsid");
  var divResults = document.getElementById("liste-resultats");

  divParam.style.display = "block";
  divResults.style.display = "none";
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
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({color: 'red'})
          })
      })
  });
  layerPoint.set('name', name);
  map.addLayer(layerPoint);

}

var pointSurbrillance = null;

// function qui place un point d'une autre couleur sur la carte (surbrillance)
function placeSurbrillancePointsOnMap(entityCoords, nom, npa, adresse, telPrincipal, telSecondaire, email) {

  var centerLongitudeLatitudePoint = ol.proj.fromLonLat(entityCoords);

  if (pointSurbrillance != null) {
    map.getLayers().forEach(layer => {if (layer.get('name') === pointSurbrillance) {layer.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({color: 'red'})
      })
    }));}});
  }

  pointSurbrillance = entityCoords[0].toString() + "," + entityCoords[1].toString();
  map.getLayers().forEach(layer => {if (layer.get('name') === pointSurbrillance) {layer.setStyle(new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({color: 'yellow'})
    })
  }));}});

  map.getLayers().get(pointSurbrillance);

  overlay.setPosition(centerLongitudeLatitudePoint);
  content.innerHTML = "<b>" + nom + "</b>" + "<br>" + adresse + ", " + npa + "<br>" + "Tél. princip. : "
                      + telPrincipal + "<br>" + "Tél. Second. : " + telSecondaire + "<br>" + "Email : " + email;

}

// fonction qui placent les bars existants sur la carte
function placeBarOnMap(barCoords) {

  var centerLongitudeLatitudeBars = ol.proj.fromLonLat(barCoords);
  barOnMap = new ol.geom.Point(centerLongitudeLatitudeBars);

  var layerBar = new ol.layer.Vector({
    source: new ol.source.Vector({
      projection: 'EPSG:4326',
      features: [new ol.Feature(barOnMap)]
    }),
    style: new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({color: 'black'})
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
  // console.log("yousk2");
}

//  fonction pour placer un cercle sur la carte après avoir appuyer sur le bouton
function clickOnMapON() {

  deleteCircleOnMap();
  allowToPlaceZone = true;

  map.on('click', function(event) {

    if (allowToPlaceZone) {

      var coordsOnMap = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
      //console.log(coordsOnMap);
      var centerLongitudeLatitude2 = ol.proj.fromLonLat(coordsOnMap);
      //console.log(centerLongitudeLatitude2);
      var radius = document.getElementById("sliderCircleOnMap").value;
      cercleOnMap = new ol.geom.Circle(centerLongitudeLatitude2, parseInt(radius));
      //console.log(cercleOnMap);
      //console.log(coords);

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
function moveZoneDeRecherche() {
}

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

/* parametre non pris en compte pour le moment
var slider_zoneexclu = document.getElementById("range-zoneexclu");
var value_zoneexclu = document.getElementById("value-zoneexclu");
slider_zoneexclu.onchange = function() {value_zoneexclu.innerHTML = this.value;}
*/

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

// Export JSON to CSV
  function jsonToCsv(){
    var listeEntrepriseRemovedNull = infoEntreprise.filter(function(val) { return val !== null; });
    if(listeEntrepriseRemovedNull.length != 0){
      //infoEntreprise.forEach(element => console.log(element));
      console.log("export debut");
      var headers = {
        nom: "Nom de l'entreprise",
        raisonSocial: "Raison social",
        raisonSocialParent: "Raison social parent",
        branche: "Domaine de l'entreprise",
        natureJuridique: "Nature juridique",
        taille: "Taille (en nombre de personnes)",
        typeLocal: "Type de local",
        codeNoga: "code noga",
        immaDt: "Date de création de l'entreprise",
        adresse: "Adresse",
        npa: "Npa",
        latitude: "latitude",
        longitude: "longitude",
        email: "email de contact",
        telPrincipal: "Numero de téléphone",
        telSecondaire: "Numero de téléphone secondaire",
        siteInternet: "Site internet de l'entreprise"
      };

      var itemsFormatted = [];

      // recup tous les json dans une seule même liste et dans le bon format
      infoEntreprise.forEach((item) => {
        console.log(item);
        /*
        var telPrincipalFormatted = item.telPrincipal;
        var telSecondaireFormatted = item.telSecondaire;
        var raisonSocialFormatted = item.raisonSocial;
        var natureJuridiqueFormatted = item.natureJuridique;
        var tailleFormatted = item.taille;
        var typeLocalFormatted = item.typeLocal;
        var codeNogaFormatted = item.codeNoga;
        */

        if (item == null) {
          return;
        }

        /*
        if (item.telPrincipal != null) {
          telPrincipalFormatted = "+" + item.telPrincipal.toString().substring(0, 2) + " " + item.telPrincipal.toString().substring(2, 4) + " " + item.telPrincipal.toString().substring(4, 7) + " " + item.telPrincipal.toString().substring(7, 9) + " " + item.telPrincipal.toString().substring(9, 11);
        } else {
          telPrincipalFormatted = "Non renseigné";
        }

        if (item.telSecondaire != null) {
          telSecondaireFormatted = "+" + item.telSecondaire.toString().substring(0, 2) + " " + item.telSecondaire.toString().substring(2, 4) + " " + item.telSecondaire.toString().substring(4, 7) + " " + item.telSecondaire.toString().substring(7, 9) + " " + item.telSecondaire.toString().substring(9, 11);
        } else {
          telSecondaireFormatted = "Non renseigné";
        }
        */

          itemsFormatted.push({
              nom: item.nom.replace(/;/g, ''),
              raisonSocial: item.raisonSocial.replace(/;/g, ''),
              raisonSocialParent: item.raisonSocialParent.replace(/;/g, ''),
              branche: item.branche.replace(/;/g, ','),
              natureJuridique: item.natureJuridique.replace(/;/g, ''),
              taille: item.taille,
              typeLocal: item.typeLocal.replace(/;/g, ''),
              codeNoga: item.codeNoga,
              immaDt: item.immaDt,
              adresse: item.adresse,
              npa: item.npa,
              latitude: item.latitude,
              longitude: item.longitude,
              email: item.email,
              telPrincipal: item.telPrincipal,              
              telSecondaire: item.telSecondaire,
              siteInternet: item.siteInternet
          });
      });

      var fileTitle = 'resultatsExport'; // or 'my-unique-title'
      exportCSVFile(headers, itemsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
    } else {
      alert("Aucune donnée à exporter");
    }
  }

  function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = "\uFEFF";

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ';'

            line += array[i][index];
            }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
      items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = this.convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilenmae);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }
}

