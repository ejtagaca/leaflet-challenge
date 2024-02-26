let earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

let baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


let myMap = L.map("map", {
    center: [37.807246697771554, -122.43170695660642],
    zoom: 6,
    layers: [baseLayer]
});

var legend = L.control({position: 'bottomright'});


function getMarkers(){
    // calling the server
    d3.json(`${earthquakeURL}`).then(function (data) {
        renderMarkers(data); // displaying the markers
    }).catch((e) => {
        console.log(e)
    });
}

function renderMarkers(data){
    points = data.features
    console.log(points)
    for (i=0; i < points.length; i++) {
        let lon = points[i].geometry.coordinates[0];
        let lat = points[i].geometry.coordinates[1];
        let depth = points[i].geometry.coordinates[2];
        let magnitude = points[i].properties.mag;
        let circle = L.circle([lat, lon], {
            weight:1,
            color: 'black',
            fillOpacity:1,
            fillColor: getColor(depth),
            radius: points[i].properties.mag*10000
        });

        circle.bindPopup(`Latitude: ${lat}<br>Longitude: ${lon}<br>Depth: ${depth} km<br>Magnitude: ${magnitude}`).addTo(myMap);
    }
}

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90], // The range of your data
        labels = [];
    // Loop through our intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        var from = grades[i];
        var to = grades[i + 1];
        labels.push(
            '<i style="background:' + getColor(from) + '"></i> ' + // Adjusted to use `from` for color
            from + (to ? '&ndash;' + to : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

function getColor(d) {
    return d >= 90 ? '#ff0000' :
           d >= 70 ? '#ff4800':
           d >= 50 ? '#ffae00' :
           d >= 30 ? '#ffbb00' :
           d >= 10 ? '#fffb00' :
                    '#5eff00' ; // Adjust colors as needed
}


getMarkers();
legend.addTo(myMap);
