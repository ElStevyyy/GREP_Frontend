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

	nogaDelete.addEventListener('click', function(event) {
		this.parentNode.remove();

		var collection = document.getElementById("select-code-noga").children;
		for (let i = 0; i < collection.length; i++) {
			var id;
			if (event.target.id == "") {
				id = event.target.firstChild.id
			} else {
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

	natjurDelete.addEventListener('click', function(event) {
		this.parentNode.remove();

		var collection = document.getElementById("select-naturejuridique").children;
		for (let i = 0; i < collection.length; i++) {
			var id;
			if (event.target.id == "") {
				id = event.target.firstChild.id
			} else {
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

	tailleDelete.addEventListener('click', function(event) {
		this.parentNode.remove();

		var collection = document.getElementById("select-taille").children;
		for (let i = 0; i < collection.length; i++) {
			var id;
			if (event.target.id == "") {
				id = event.target.firstChild.id
			} else {
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

var inputSearch = document.getElementById("adressValue");

inputSearch.addEventListener("keypress", function(event) {

	if (event.key === "Enter") {
		event.preventDefault();
		document.getElementById("adressSearch").click();
	}
});

function checkLatLong(list, coord) {
	var res = false;
	list.forEach(item => {
		if (item[0] == coord[0] && item[1] == coord[1]) {
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

	listeLatLong.forEach(function(value, key) {
		map.getLayers().getArray()
			.filter(layer => layer.get('name') === key)
			.forEach(layer => map.removeLayer(layer));
	});

	listeLatLong = new Map();
	console.log(listeLatLong);
}

// fonction qui recupere les informations des entites, cree les div et les ajoute
function getInfoEntreprise(infoEntreprise) {

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
			placeSurbrillancePointsOnMap(coordSurbrillance, event.target.parentElement.id, nom, npa, adresse, telPrincipal, telSecondaire, email);
			//console.log(infoEntreprise[event.target.parentElement.id]);

		});

		var div2 = document.createElement("div");
		div2.classList.add("div2");
		div2.appendChild(document.createTextNode(infoEntreprise[i].branche));

		var div3 = document.createElement("div");
		div3.classList.add("div3");

		if (infoEntreprise[i].taille !== null) {
			div3.appendChild(document.createTextNode(infoEntreprise[i].taille));
		} else {
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
		} else {
			div4.appendChild(document.createTextNode("Site web non renseigné"));
		}

		var div5 = document.createElement("div");
		div5.classList.add("div5");
		var iconePoubelle = document.createElement("img");
		iconePoubelle.src = "images/poub.png"
		div5.appendChild(iconePoubelle);

		div5.addEventListener('click', function(event) {
			this.parentNode.remove();
			var id;

			if (event.target.parentElement.id == "") {
				id = event.target.parentElement.parentElement.id;
			} else {
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
				} else {
					console.log("coordonnée - 1");
					listeLatLong.set(entityCoords, listeLatLong.get(entityCoords) - 1);
					console.log(listeLatLong);
				}
			} else {
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

		var pointCoords = [infoEntreprise[i].longitude, infoEntreprise[i].latitude]
		var pointComparaison = infoEntreprise[i].longitude.toString() + "," + infoEntreprise[i].latitude.toString();


		if (listeLatLong.has(pointComparaison)) {
			//console.log("already in array listeLatLong");
			listeLatLong.set(pointComparaison, listeLatLong.get(pointComparaison) + 1);
		} else {
			listeLatLong.set(pointComparaison, 1);
			placePointsOnMap(pointCoords);
		}
	}
	console.log(listeLatLong);

	zoomOnSearchedPlace(pointCoords, 15);
	replaceParamsByResults();
	switchInfosWhenResults();
}

function replaceParamsByResults() {
	var divParam = document.getElementById("formsid");
	var divResults = document.getElementById("liste-resultats");
	var divExport = document.getElementById("exportDiv");

	divParam.style.display = "none";
	divResults.style.display = "block";
	divExport.style.display = "block";

	switchInfosWhenResults();
}

function replaceResultsByParams() {
	var divParam = document.getElementById("formsid");
	var divResults = document.getElementById("liste-resultats");
	var search = document.getElementById("searchResults");
	var remake = document.getElementById("switchbutton");
	var divExport = document.getElementById("exportDiv");

	divParam.style.display = "block";
	divResults.style.display = "none";
	search.style.display = "none";
	remake.style.display = "none";
	divExport.style.display = "none";
}

function switchInfosWhenResults() {
	var search = document.getElementById("searchResults");
	if (search.style.display = "none") {
		search.style.display = "block";
	}

	var remake = document.getElementById("switchbutton");
	if (remake.style.display = "none") {
		remake.style.display = "block";
	}
}

//Bar de recherche pour les résultats
function searchEntreprises() {

	var input = document.getElementById('searchResults').value
	input = input.toLowerCase();
	if (!input) {
		getInfoEntreprise(infoEntreprise);
	}
	var newInfoEntreprise = []

	for (i = 0; i < infoEntreprise.length; i++) {
		var obj = infoEntreprise[i];


		if (obj.nom.toLowerCase().includes(input)) {
			newInfoEntreprise.push(obj);
		}
	}
	clearResultsListe();
	clearResultsMap();
	getInfoEntreprise(newInfoEntreprise);
}