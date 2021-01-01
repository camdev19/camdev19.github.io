let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 49.396657, lng: -123.204358 },
    zoom: 8,
  });
}