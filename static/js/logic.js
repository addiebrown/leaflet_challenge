var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function color(mag){
    if (mag > 5){
        return '#FF0000'
    }
    else if (mag >= 4){
        return '#FF8C00'
    }
    else if (mag >= 3){
        return '#FFA500'
    }
    else if (mag >= 2){
        return '#FFD700'
    }
    else if (mag >= 1){
        return '#9ACD32'
    }
    else{
        return '#ADFF2F'
    }
}

function size(mag){
    if (mag > 5){
        return 14
    }
    else if (mag >= 4){
        return 12
    }
    else if (mag >= 3){
        return 10
    }
    else if (mag >= 2){
        return 8
    }
    else if (mag >= 1){
        return 6
    }
    else {
        return 4
    }
}

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + "<h3>Magnitude: "+ feature.properties.mag+"</h3>"+"<p>"+ new Date(feature.properties.time) + "</p>");
}

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, location) {
            return L.circleMarker(location, 
            {radius: size(feature.properties.mag), 
            fillOpacity: 2, 
            color: 'black', 
            fillColor: color(feature.properties.mag), 
            weight: 0.6,});
    }
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var map = L.map("map", {
      center: [39.550053, -105.782066],
      zoom: 5,
      layers: [lightmap, earthquakes]
    });

function getColor(d) {
    return d > 5 ? '#FF0000' :
           d > 4 ? '#FF8C00' :
           d > 3 ? '#FFA500' :
           d > 2 ? '#FFD700' :
           d > 1 ? '#9ACD32' :
                   '#ADFF2F';
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
legend.addTo(map);
}
