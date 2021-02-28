// Initialize map
let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 49.396657, lng: -123.204358 },
    zoom: 8,
  });
}

// Add search box
function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.19088407298247, lng: -106.8175506485181 },
    zoom: 12,
    mapTypeId: "roadmap",
  });
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });
  let markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}



// Loading event listerner for search button
document.getElementById('searchButton').addEventListener('click', getInputValue);

// Get the search box element
let detectEnter = document.getElementById('pac-input');
// Search button is clicked by user pressing enter
detectEnter.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    document.getElementById("searchButton").click();
  }
});

// function is called when user clicks the search button and passes text entered into search box to the API
function getInputValue() {
  // Selecting the search box element and get the value entered
  let inputVal = document.getElementById('pac-input').value;
  // Clearing the info boxes
  let infoDisplay = document.getElementsByClassName('infoDisplay');
  infoDisplay.innerHTML = '';
  if (inputVal > '0') {
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + inputVal + '&units=metric&appid=c0f295a712f014bc4bd69cd98fa32663')
    .then(response => response.json())
    .then(data => {
      console.log(data)

      let temperature = document.getElementById('temp');
      temperature.innerHTML = data.main.temp;

      let feelsLike = document.getElementById('feels')
      feelsLike.innerHTML = data.main.feels_like;
      
      let minTemp = document.getElementById('low');
      minTemp.innerHTML = data.main.temp_min;

      let maxTemp = document.getElementById('high');
      maxTemp.innerHTML = data.main.temp_max;

      let windSpeed = document.getElementById('wind-speed');
      windSpeed.innerHTML = data.wind.speed;

      let windDirection = document.getElementById('wind-direction');
      windDirection.innerHTML = data.wind.deg;

      let cloudCoverage = document.getElementById('clouds');
      cloudCoverage.innerHTML = data.clouds.all;

      // let snowfall = document.getElementById('snow');
      // snowfall.innerHTML(data.snow);
      });
  } else if (inputVal === '') {
    alert('Please search for a location using the map search box, then hit enter or click search to display the forcast');
  }
}