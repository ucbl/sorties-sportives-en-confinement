/**
 * Gestion du métier de l'application
 * @author Lionel Médini <https://perso.liris.cnrs.fr/lionel.medini/>
 * @license CC-BY-NC
 */

/***** Comportement de la carte *****/

// Initialisation des layers
let circles = [];

// Mise à jour de la map à la nouvelle position
function updateMap(coords) {
	mymap.panTo(coords);
}

// Affichage d'un cercle
function drawCircle(coords, radius, id) {
	const circle = L.circle(coords, {radius: radius, fill: false}).addTo(mymap);
	// Si on clique sur le marker, on fait disparaître le cercle & le marker
	const marker = L.marker(coords).addTo(mymap).on("click", () => {
		circle.remove();
		marker.remove();
		// Suppression dans le tableau
		circles.splice(id, 1);
		// Synchronisation du tableau avec LocalStorage
		updateLS();
	});
	return {circle : circle, marker : marker};
}

// Ajout d'un cercle
function addCircle(coords, radius) {
	updateMap(coords);
	drawCircle(coords, radius, circles.length);
	circles.push({coords: coords, radius: radius});
	updateLS();
}

// MàJ du LocalStorage
function updateLS() {
	localStorage.circles = JSON.stringify(circles);
}

// MàJ de la map si màj du formulaire
function updateForm() {
updateMap(L.latLng($('#lat').val(), $('#lon').val()));
}

/***** Evénements liés à la carte *****/

// Abonnement à l'événement click -> cercle
mymap.on('click', e => {
	$('#lat').val(e.latlng.lat);
	$('#lon').val(e.latlng.lng);
	addCircle(e.latlng, $('input[type=radio][name=dist][checked]').val() * 1000);
});

// Abonnement aux événements de changement de coordonnées
$('#lat').change(updateForm);
$('#lon').change(updateForm);

// Abonnement aux événements du bouton radio de changement des distances
$('input[type=radio][name=dist]').change(function() {
	if(circle) {
		updateMap(L.latLng($('#lat').val(), $('#lon').val()));
	}
});

// Abonnement aux événements de l'input nombre de km spécifiés par l'utilisateur
$('#nkm').change(function() {
	$('#_nkm').val($('#nkm').val());
	if($('#_nkm').prop("checked")) {
		updateMap(L.latLng($('#lat').val(), $('#lon').val()));
	}
	$('#_nkm').click();
});

/***** Comportement de l'interface *****/

// Gestion des modales
function toggleMenu(target) {
	if(target==="donnees") {
		$("#principes").css("visibility", "hidden");
	} else {
		$("#donnees").css("visibility", "hidden");
	}

	togglejQueryElementVisibility($("#" + target));
}

// Gestion du menu hamburger
function toggleHMenu() {
	togglejQueryElementVisibility($('aside'));
}

// Fonction générique qui affiche et fait disparaître un objet jQuery
function togglejQueryElementVisibility(jqe) {
	jqe.css("visibility", jqe.css("visibility") === "visible"?"hidden":"visible");
}

// Pour le cas où on resize avec le hmenu ouvert
window.onresize = () => {
	if(window.matchMedia('(min-width: 601px)')) {
		$("aside").css("visibility", "hidden");
	}
};

// Affichage des cercles mémorisés
if(localStorage.hasOwnProperty('circles')) {
	console.log('Restoring circles from LocalStorage');
	circles = JSON.parse(localStorage.getItem('circles'));
	for(const circle of circles) {
		drawCircle(circle.coords, circle.radius);
	}
}