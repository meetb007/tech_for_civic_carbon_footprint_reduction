function initMap() {

    let latitude;
    let longitude;

    // Check if Geolocation is supported by the browser
    if ("geolocation" in navigator) {
        // Request the current position of the user
        navigator.geolocation.getCurrentPosition(function(position) {
        // Get the latitude and longitude from the position object
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    
        // Do something with the latitude and longitude values
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        }, function(error) {
        // Handle any errors that occur while getting the user's location
        console.error("Error getting user's location:", error);
        });
    } else {
        // Geolocation is not supported by the browser
        console.log("Geolocation is not supported by this browser.");
    }

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: { lat: 37.0902, lng: -95.7129 }, // Australia.
    });
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: true,
      map,
      panel: document.getElementById("panel"),
    });
  
    directionsRenderer.addListener("directions_changed", () => {
      const directions = directionsRenderer.getDirections();
  
      if (directions) {
        computeTotalDistance(directions);
      }
    });

    var end = document.getElementById('end').value;

    displayRoute(end,
      directionsService,
      directionsRenderer,
    );
  }
  
  function displayRoute(destination, service, display) {

    var selectedMode = document.getElementById('mode').value;

    service
      .route({
        origin: { lat: latitude, lng: longitude},
        destination: destination,
        travelMode: google.maps.TravelMode[selectedMode],
        avoidTolls: true,
      })
      .then((result) => {
        display.setDirections(result);
      })
      .catch((e) => {
        alert("Could not display directions due to: " + e);
      });
  }
  
  function computeTotalDistance(result) {
    let total = 0;
    const myroute = result.routes[0];
  
    if (!myroute) {
      return;
    }
  
    for (let i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
    }
  
    total = total / 1000;
    document.getElementById("total").innerHTML = total + " km";
  }

// Function to be called when the button is clicked
function onButtonClick() {
    // Call initMap when the button is clicked
    initMap();
}

// Add event listener to the button
document.getElementById('find-path-button').addEventListener('click', onButtonClick);

  
  window.initMap = initMap;