/* 
	------------------------------------------------------------------------------------------------------
	------------------------------------------------------------------------------------------------------
	Fichier Javascript permettant de gérer les recherches d'entités ainsi que l'affichage des résultats
	------------------------------------------------------------------------------------------------------
	------------------------------------------------------------------------------------------------------
*/



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

// Fonction qui récupère la liste des natures juridiques
function getSelectedNatjurListe() {
    return listeNatjur;
}

var listeTaille = [];

// Fonction de gestion des différentes tailles d'entreprises (ajout et suppresion dans la div)
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

// Fonction qui récupère la liste des tailles
function getSelectedTailleListe() {
    return listeTaille;
}



var inputSearch = document.getElementById("adressValue");

// EventListener sur l'input de filtrage des resultats
inputSearch.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("adressSearch").click();
    }
});

// Fonction qui verifie les latitudes et longitudes 
function checkLatLong(list, coord) {
    var res = false;
    list.forEach(item => {
        if (item[0] == coord[0] && item[1] == coord[1]) {
            res = true;
        }
    });
    return res;
}

// Fonction qui vide la liste de résultats
function clearResultsListe() {
    var node = document.getElementById("liste-resultats");
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

// Fonction qui vide la map de tous les résultats
function clearResultsMap() {
	listeLatLong.forEach(function(value, key) {
		map.getLayers().getArray()
			.filter(layer => layer.get('name') === key)
			.forEach(layer => map.removeLayer(layer));
	});
	listeLatLong = new Map();
}

// fonction qui recupere les informations des entites pour créer les div et permettre la gestion de ces derniers
function getInfoEntreprise(infoEntrepriseLocal, compare) {

    deleteCircleOnMap();

    /**
     * Pour chaque entités :
     * DIV PARENT 	: Contient toute l'entité 
     * DIV 1 		: Nom de l'entreprise
     * DIV 2		: Branche de l'entreprise
     * DIV 3		: Taille de l'entreprise
     * DIV 4 		: Site web de l'entreprise
     * DIV 5		: Option permettant de supprimer l'entité de la liste
     */

    for (var i = 0; i < infoEntrepriseLocal.length; i++) {
        if (infoEntrepriseLocal[i] == null) {
            continue;
        }
        var parent = document.createElement("div");
        parent.classList.add("entites");
        if (compare) {
            parent.setAttribute("id", infoEntrepriseLocal[i].id);
        } else {
            parent.setAttribute("id", i);
        }


        var div1 = document.createElement("div");
        div1.classList.add("div1");
        div1.appendChild(document.createTextNode(infoEntrepriseLocal[i].nom));

        //Fonction rajout infos popup sur la carte on click
        infoMapsClick(div1, infoEntreprise);

        var div2 = document.createElement("div");
        div2.classList.add("div2");
        div2.appendChild(document.createTextNode(infoEntrepriseLocal[i].branche));

        var div3 = document.createElement("div");
        div3.classList.add("div3");

        if (infoEntrepriseLocal[i].taille !== null) {
            div3.appendChild(document.createTextNode(infoEntrepriseLocal[i].taille));
        } else {
            div3.appendChild(document.createTextNode("Taille non renseignée"));
        }

        var div4 = document.createElement("div");
        div4.classList.add("div4");
        if (infoEntrepriseLocal[i].siteInternet !== null) {
            var a = document.createElement("a");
            var link = document.createTextNode(infoEntrepriseLocal[i].siteInternet);
            a.appendChild(link);
            a.href = infoEntrepriseLocal[i].siteInternet.toString();
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

        //Fonction delete on click (logo corbeille)
        deleteClick(div5, infoEntrepriseLocal, compare);

        // Ajout des div enfants dans la div parent
        parent.appendChild(div1);
        parent.appendChild(div2);
        parent.appendChild(div3);
        parent.appendChild(div4);
        parent.appendChild(div5);

        document.getElementById("liste-resultats").appendChild(parent);

        var pointCoords = [infoEntrepriseLocal[i].longitude, infoEntrepriseLocal[i].latitude]
        var pointComparaison = infoEntrepriseLocal[i].longitude.toString() + "," + infoEntrepriseLocal[i].latitude.toString();

        if (listeLatLong.has(pointComparaison)) {
            listeLatLong.set(pointComparaison, listeLatLong.get(pointComparaison) + 1);
        } else {
            listeLatLong.set(pointComparaison, 1);
            placePointsOnMap(pointCoords);
        }
    }

    //Fonctions permettant d'ajuster la map et l'affichage des entités lorsque la recherche prend fin
    if (infoEntrepriseLocal.length > 1) {
        zoomOnSearchedPlace(pointCoords, 15);
    }
    //zoomOnSearchedPlace(pointCoords, 15);
    replaceParamsByResults();
    switchInfosWhenResults();
}

//Fonction utilisé pour rajouter l'événement servant à afficher l'entitée sur la carte
function infoMapsClick(div, infoEntreprise) {
    div.addEventListener('click', (event) => {
        var coordSurbrillance;
        console.log(event.target.parentElement.id);
        console.log(infoEntreprise);
        console.log(infoEntreprise[event.target.parentElement.id])
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
        placeSurbrillancePointsOnMap(coordSurbrillance, event.target.parentElement.id, nom, npa, adresse, telPrincipal, telSecondaire, email);

    });
}

// Fonction qui permet la suppresion d'une entité
function deleteClick(div, newInfoEntreprise, compare) {
    div.addEventListener('click', function(event) {

        this.parentNode.remove();
        var id;

        if (event.target.parentElement.id == "") {
            id = event.target.parentElement.parentElement.id;
        } else {
            id = event.target.parentElement.id;
        }


        var entityCoords


        if (compare) {

            for (var i = 0; i < newInfoEntreprise.length; i++) {
                if (newInfoEntreprise[i].id == id) {
                    entityCoords = newInfoEntreprise[i].longitude.toString() + "," + newInfoEntreprise[i].latitude.toString();
                    infoEntreprise[newInfoEntreprise[i].id] = null;
                }
            }

        } else {
            entityCoords = newInfoEntreprise[id].longitude.toString() + "," + newInfoEntreprise[id].latitude.toString();
        }

        newInfoEntreprise[id] = null;
        if (listeLatLong.has(entityCoords)) {
            if (listeLatLong.get(entityCoords) <= 1) {
                listeLatLong.delete(entityCoords);
                overlay.setPosition(undefined);
                map.getLayers().getArray()
                    .filter(layer => layer.get('name') === entityCoords)
                    .forEach(layer => map.removeLayer(layer));
            } else {
                listeLatLong.set(entityCoords, listeLatLong.get(entityCoords) - 1);
            }
        } else {
            console.log("yousk2");
        }
    })
}

// Fonction de gestion du remplacement des paramètres par les résultats
function replaceParamsByResults() {
    var divParam = document.getElementById("formsid");
    var divResults = document.getElementById("liste-resultats");
    var divExport = document.getElementById("exportDiv");

    divParam.style.display = "none";
    divResults.style.display = "block";
    divExport.style.display = "block";

    switchInfosWhenResults();
}

// Fonction de gestion du remplacement des résultats par les paramètres
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

// Fonction qui intervertit certaines informations selon si les résultats sont affichés ou non
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

// Bar de recherche pour les résultats
function searchEntreprises() {

    var input = document.getElementById('searchResults').value
    input = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    if (!input) {
        clearResultsListe();
        clearResultsMap();
        //Comparer listes et effectuer changement si nécessaire
        getInfoEntreprise(infoEntreprise, false);
    } else {
        var newInfoEntreprise = []

        for (i = 0; i < infoEntreprise.length; i++) {
            if (infoEntreprise[i] == null) {
                continue;
            }
            var obj = infoEntreprise[i];
            obj.id = i;

            //Formatter les valeurs des recherches ainsi que l'input pour gérer les accents et caractères spéciaux
            if (obj.nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(input)) {
                newInfoEntreprise.push(obj);
            }
        }
        clearResultsListe();
        clearResultsMap();
        getInfoEntreprise(newInfoEntreprise, true);
    }
}