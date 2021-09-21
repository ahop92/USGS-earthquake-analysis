# USGS-Earthquake Analysis

## Background 

Using a webpage developed with CSS, HTML, and the mapbox API, the purpose of this repository is to display updating data about earthquakes around the world from the US Geological Survey from the past month. The application manipulates D3.js, leaflet.js and geoJSON libraries in order to extract the desired geoJSON features from the USGS data (magnitude, depth, radius, location, and timestamp). Then the application overlays the information on the user selectable map layers featuring a streetmap, darkmap, or satellite map.

![image](https://raw.github.com/ahop92/USGS-Earthquake-Analysis/main/images/overview.PNG)


## Visualizations and App Functionality

The app functionality is compartmentalized into the following categories/functions: 

1. buildMap(): Function that uses Leaflet.js and the mapbox api to build a streetmap, darkmap, and satellite map. Additionally, the function takes the earthquake data and layout information from extractFeatures() to apply circles to the map according to earthquake location as well as offer a legend in the bottom right hand corner of the page for the user to understand the significance of the color scale.

![image](https://raw.github.com/ahop92/USGS-Earthquake-Analysis/main/images/mapselect.PNG)

![image](https://raw.github.com/ahop92/USGS-Earthquake-Analysis/main/images/legend.PNG)

2. fillCircle(): Function that dictates the color of the circle according to the depth of the earthquake

3. changetoCircle(): Function to change standard map marker to circle that will change size according to mag of earthquake.

4. extractFeatures(): Primary function that pulls the JSON data and extracts the necessary data for a tooltip that contains magnitude, depth, location, and timestamp. Function uses Leaflet.js and GeoJSON to alter the layout of the map markers and apply the geoJSON data by location to the map.

![image](https://raw.github.com/ahop92/USGS-Earthquake-Analysis/main/images/tooltip.PNG)

5. d3.json().then(): D3 query to call geoJSON api from USGS website and send the extracted data as an argument into extractFeatures().

