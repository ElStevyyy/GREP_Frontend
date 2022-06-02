/* 
	------------------------------------------------------------------------------------------------------
	------------------------------------------------------------------------------------------------------
	Fichier Javascript permettant de transformer les données sous un format CSV et de les récupérer
	------------------------------------------------------------------------------------------------------
	------------------------------------------------------------------------------------------------------
*/

// Export JSON to CSV - Permettre l'export des entités recherchées sous un format Excel convenable
async function jsonToCsv() {
	const button = document.getElementById('export')
	button.disabled = true
	var listeEntrepriseRemovedNull = infoEntreprise.filter(function(val) {
		return val !== null;
	});
	// Définition des en-têtes pour chaque valeur  
	if (listeEntrepriseRemovedNull.length != 0) {
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
			siteInternet: "Site internet de l'entreprise",
		};

		var itemsFormatted = [];
		for (var i = 0; i < infoEntreprise.length; i++) {
			
			// Sert à passer à l'entité suivante dans le cas ou celle-ci a été supprimé avec le logo corbeille
			if (infoEntreprise[i] == null) {
				continue;
			}

			// Récupérer les valeurs de l'entité en cours et les placer dans la liste temporaire et formatée (on gère les ";" avec la fonction "replace")
			itemsFormatted.push({
				nom: String(infoEntreprise[i].nom).replace(/;/g, ''),
				raisonSocial: String(infoEntreprise[i].raisonSocial).replace(/;/g, ''),
				raisonSocialParent: String(infoEntreprise[i].raisonSocialParent).replace(/;/g, ''),
				branche: String(infoEntreprise[i].branche).replace(/;/g, ','),
				natureJuridique: String(infoEntreprise[i].natureJuridique).replace(/;/g, ''),
				taille: infoEntreprise[i].taille,
				typeLocal: String(infoEntreprise[i].typeLocal).replace(/;/g, ''),
				codeNoga: infoEntreprise[i].codeNoga,
				immaDt: infoEntreprise[i].immaDt,
				adresse: infoEntreprise[i].adresse,
				npa: infoEntreprise[i].npa,
				latitude: infoEntreprise[i].latitude,
				longitude: infoEntreprise[i].longitude,
				email: infoEntreprise[i].email,
				telPrincipal: infoEntreprise[i].telPrincipal,
				telSecondaire: infoEntreprise[i].telSecondaire,
				siteInternet: infoEntreprise[i].siteInternet,
			});
		};

		// Nom du fichier exporté
		var fileTitle = 'resultatsExport'; 
		// appelle la fonction exportCSVFile() pour convertir les valeurs JSON et démarrer le téléchargement pour l'utilisateur
		exportCSVFile(headers, itemsFormatted, fileTitle); 
		button.disabled = false
	} else {
		alert("Aucune donnée à exporter");
	}
}

// Fonction permettant de convertir les valeurs JSON et lancer l'export
function exportCSVFile(headers, items, fileTitle) {
	if (headers) {
		items.unshift(headers);
	}

	// Convert Object to JSON
	var jsonObject = JSON.stringify(items);

	var csv = this.convertToCSV(jsonObject);

	var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

	// Lancement de l'export selon le naviguateur
	var blob = new Blob([csv], {
		type: 'text/csv;charset=utf-8;'
	});
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

// Fonction permettant de récupérer la liste des entités et de convertir le tout sous un format CSV
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