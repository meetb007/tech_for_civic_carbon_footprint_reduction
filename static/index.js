let latitude = 0;
let longitude = 0;
let selectedMode;
let end;

function initMap() {
    selectedMode = document.getElementById('mode').value;
    end = document.getElementById('end').value;
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
      zoom: 10,
      center: { lat: 42.3601, lng: -71.0589 }, // Boston
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
        computeTotalDistance(directions, );
      }
    });

    displayRoute(end,
      directionsService,
      directionsRenderer,
    );
  }
  
function displayRoute(destination, service, display) {

    if (destination === "") return;

    service
      .route({
        origin: { lat: latitude, lng: longitude},
        destination: destination,
        travelMode: google.maps.TravelMode[selectedMode],
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
  
    total = total * 0.62 / 1000;
    total = total.toFixed(2);

    console.log(selectedMode);

    const credits = calculateCredits(selectedMode, total);
    const carbonEmission = calculateCO2Emission(selectedMode, total);
    document.getElementById("total").innerHTML = "Total Distance is <u>"+ total + " mi</u>";
    document.getElementById("credits").innerHTML = "You will earn <u>" + credits + " credits</u>";
    document.getElementById("emission").innerHTML = "<u>" + carbonEmission + " KgCO2</u> of Carbon will be Emitted";
    
  }

// Function to be called when the button is clicked
function onButtonClick() {
    // Call initMap when the button is clicked
    initMap();
}

function calculateCredits(mode, miles) {
    let credits = 0;
    switch(mode) {
        case "DRIVING":
            credits = miles*1;
            break;
        case "BICYCLING":
        case "WALKING":
            credits = miles*10;
            break;
        case("TRANSIT"):
            credits = miles*5;
            break;
    }

    return credits;
}

function calculateCO2Emission(mode, miles) {
  let credits = 0;
  switch(mode) {
      case "DRIVING":
          credits = miles*0.44;
          break;
      case "BICYCLING":
          credits = miles*0.008;
          break;
      case "WALKING":
          credits = miles*0.019;
          break;
      case("TRANSIT"):
          credits = miles*0.1;
          break;
  }

  return credits;
}

// Add event listener to the button
document.getElementById('find-path-button').addEventListener('click', onButtonClick);

window.initMap = initMap;