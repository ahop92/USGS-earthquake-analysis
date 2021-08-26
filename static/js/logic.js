//Function that uses Leaflet.js and the mapbox api to build a streetmap, darkmap, and satellite map
//Additionally, the function takes the earthquake data and layout information from extractFeatures() to apply circles to the map 
//According to earthquake location.
function buildMap(earthquakes) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "Map Copyright: <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY,
    }
  );

  var darkmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map Copyright: <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY,
    }
  );

  var satellite = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "Map Copyright: <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='https://docs.mapbox.com/help/glossary/mapbox-satellite/'>Satellite Map</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      maxZoom: 19,
      id: "satellite-v9",
      accessToken: API_KEY,
    }
  );

  // Define a baseMaps object to hold the base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    Satellite: satellite,
  };

  // Create overlay object to hold the overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  // Create the map and apply default layers
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes],
  });

  // Create layer control
  // Pass in the selectable base maps and selectable earthquake overlay data
  // Add the map layer control feature to the map
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);

  // Set up the legend
  //Reference: https://leafletjs.com/examples/choropleth/
  // https://gis.stackexchange.com/questions/133630/adding-leaflet-legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var colors = [
      "CornflowerBlue",
      "DeepSkyBlue",
      "DodgerBlue",
      "DarkSlateBlue",
      "DarkViolet",
      "Indigo",
    ];
    var magnitudes = [
      "-10 - 10",
      "10 - 30",
      "30 - 50",
      "50 - 70",
      "70 - 90",
      "90+",
    ];

    var labels = ['<h4>Earthquake<br>Depth (km)</h4>'];

    // Add min & max
    var legendInfo = "";

    // div.innerHTML = legendInfo;


    colors.forEach(function (color, index) {
      div.innerHTML +=
      labels.push(
        `<i style="background:${colors[index]}"></i>` + `${magnitudes[index]}`);
    });

    div.innerHTML = labels.join("<br>");
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
}

//Function that dictates the color of the circle according to the depth of the earthquake
function fillCircle(feature) {
  var depth = feature.geometry.coordinates[2];
  var color = "";
  // console.log(depth);

  if (depth >= -10 && depth < 10) {
    color = "CornflowerBlue";
    // console.log("ENTER CB");
  } else if (depth >= 10 && depth < 30) {
    color = "DeepSkyBlue";
    // console.log("DSB");
  } else if (depth >= 30 && depth < 50) {
    color = "DodgerBlue";
    // console.log("DB");
  } else if (depth >= 50 && depth < 70) {
    color = "DarkSlateBlue";
    // console.log("ENTER DarkSlate");
  } else if (depth >= 70 && depth < 90) {
    color = "DarkViolet";
    // console.log("ENTER DV");
  } else {
    color = "Indigo";
    // console.log("ENTER I");
  }

  //console.log(`The final color for this location is ${color}`)
  return color;
}

//Function to change standard map marker to circle that will change size according to mag of earthquake
function changeToCircle(features, location) {
  return L.circleMarker(location, {
    color: fillCircle(features),
    fillOpacity: 0.85,
    radius: (features.properties.mag + 0.5) * 4,
  });
}


//Primary function that pulls the JSON data and extracts the necessary data for a tooltip that contains magnitude, depth, location, and timestamp
//Function uses Leaflet.js and GeoJSON to alter the layout of the map markers and apply the geoJSON data by location to the map.
function extractFeatures(earthquakeData) {
  // Create a function that will run for each feature found in the geoJSON data
  // Function should create a tool tip with the date and time of each earthquake in the JSON data
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      "<h3>" +
        feature.properties.place +
        "</h3><h3>Magnitude: " + feature.properties.mag + " " + feature.properties.magType + ".</h3><p>" +
        "</h3><h3>Depth: " + feature.geometry.coordinates[2] + " km.</h3><hr><p>" +
        new Date(feature.properties.time) +
        "</p>"
    );
  }

  // Create a GeoJSON layer containing all of the features in the earthquake data
  // Run the function defined above to extract the info from each feature array in the data
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: changeToCircle,
    // style: Style,
    onEachFeature: onEachFeature,
  });

  buildMap(earthquakes);
}

//Establish query url to pull all earthquake data from the last month
var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//Complete get request for government earthquake data
d3.json(queryUrl).then(function (data) {
  extractFeatures(data.features);
});
