// Store our API endpoint inside queryUrl
function buildMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map Copyright: <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map Copyright: <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });

    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map Copyright: <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='https://docs.mapbox.com/help/glossary/mapbox-satellite/'>Satellite Map</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>", 
    maxZoom: 19, 
    id:"satellite-v9",
    accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold the base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap, 
      "Satellite": satellite
    };
  
    // Create overlay object to hold the overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create the map and apply layers
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create layer control
    // Pass in the base map and overlay map layers
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
  
function createFeatures(earthquakeData) {

    // Create a function that will run for each feature found in the geoJSON data
    // Function should create a tool tip with the date and time of each earthquake in the JSON data
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing all of the features in the earthquake data
    // Run the function defined above to extract the info from each feature array in the data
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    buildMap(earthquakes);
  }

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Complete get request for government earthquake data
d3.json(queryUrl).then(function(data) {
  createFeatures(data.features);
});



