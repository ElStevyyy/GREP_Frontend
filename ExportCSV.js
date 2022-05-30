

// Export JSON to CSV
async function jsonToCsv() {
	const button = document.getElementById('export')
	button.disabled = true
	var listeEntrepriseRemovedNull = infoEntreprise.filter(function(val) {
		return val !== null;
	});
	if (listeEntrepriseRemovedNull.length != 0) {
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
			siteInternet: "Site internet de l'entreprise",
			distanceCalculated: "Temps entre l'entreprise et le bar le plus proche",
		};

		var itemsFormatted = [];
		for (var i = 0; i < infoEntreprise.length; i++) {
			// recup tous les json dans une seule même liste et dans le bon format
			/*
			var telPrincipalFormatted = item.telPrincipal;
			var telSecondaireFormatted = item.telSecondaire;
			var raisonSocialFormatted = item.raisonSocial;
			var natureJuridiqueFormatted = item.natureJuridique;
			var tailleFormatted = item.taille;
			var typeLocalFormatted = item.typeLocal;
			var codeNogaFormatted = item.codeNoga;
			*/

			if (infoEntreprise[i] == null) {
				continue;
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

			if (infoEntreprise[i].distanceCalculated == undefined) {
				await FindClosestBar(infoEntreprise[i]);
			}
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
				distanceCalculated: infoEntreprise[i].distanceCalculated[0] + " Minutes de " + infoEntreprise[i].distanceCalculated[1]
			});
		};

		var fileTitle = 'resultatsExport'; // or 'my-unique-title'
		exportCSVFile(headers, itemsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
		button.disabled = false
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