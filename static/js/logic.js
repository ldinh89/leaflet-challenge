var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


var earthquakes = L.layerGroup();

var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v11",
    accessToken: API_KEY
});

var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});


var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
});

var baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": grayscaleMap,
    "Outdoors": outdoorsMap

};

var overlayMaps = {
    "Earthquakes": earthquakes
};


var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [satelliteMap, earthquakes]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);


d3.json(queryUrl, function(earthquakeData) {
    function markerSize(magnitude) {
        if (magnitude == 0) {
            return 1;
        }
        else {
            return magnitude * 3;
        }
    }
    function styles(feature) {
        return {
            fillOpacity: 0.7,
            fillColor: color(feature.properties.mag), 
            color: "black", 
            radius: markerSize(feature.properties.mag), 
            stroke: true, 
            weight: 0.1
        };
    }
    function color(magnitude) {
        switch (true) {
            case magnitude > 5: 
                return "red";
            case magnitude > 4: 
                return "darkorange";
            case magnitude > 3: 
                return "tan";
            case magnitude > 2: 
                return "yellow";
            case magnitude > 1:
                return "darkgreen";
            default:
                return "lightgreen";
        }
    }
    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        }
        style: styles,
        onEachFeature: function(feature, layer) {
            layer.bindPopUp("<h3>Location: " + feature.properties.place +
            "</h3><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }

    }).addTo(earthquakes);

    earthquakes.addTo(myMap);

    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        magnitudeLevels = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3>Magnitude</h3>"
        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML += '<i style="background: ' + color(magnitudeLevels[i] + 1) + '"></i> ' +
                                magnitudeLevels[i] + magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i +1] + '<br>' : '+');

        }
        return div;
    };

    legend.addTo(myMap);



});