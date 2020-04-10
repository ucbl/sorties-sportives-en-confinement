/**
 * Gestion du métier de l'application
 * @author Lionel Médini <https://perso.liris.cnrs.fr/lionel.medini/>
 * @license CC-BY-NC
 */

// Rayon de la zone de sortie
const rayon = 1000;

/***** Comportement de la carte *****/

// Initialisation des layers
let marker, circle;

// Mise à jour de la map
function updateMap(coords) {

	// Affichage à la nouvelle position
	mymap.panTo(coords);

	// Placement du marker au point cliqué
	if(marker) {
		marker.remove();
	}
	marker = L.marker(coords).addTo(mymap);

	// Placement du cercle
	if(circle) {
		circle.remove();
	}
	circle = L.circle(coords, {radius: rayon, fill: false}).addTo(mymap);
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
	updateMap(e.latlng);
});

// Abonnement aux événements de changement de coordonnées
$('#lat').change(updateForm);
$('#lon').change(updateForm);

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
