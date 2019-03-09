document.addEventListener("DOMContentLoaded", function(event) { 
    document.getElementById('citySearch').value = '';
    
    var map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.doubleClickZoom.disable();

    var marker = L.marker([0, 0]).addTo(map);
    map.on('click', function (e) {
        document.getElementById('latNumber').innerText = e.latlng.lat;
        document.getElementById('lngNumber').innerText = e.latlng.lng;
        document.getElementById('clipboardHolder').value = e.latlng.lat + ',' + e.latlng.lng;
        marker.setLatLng(e.latlng);
    });

    //Load list of cities
    var cityData = [];
    var httpRequest = new XMLHttpRequest();
    if (httpRequest.overrideMimeType) httpRequest.overrideMimeType('application/json');
    httpRequest.open('GET', 'cities.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                cityData = JSON.parse(httpRequest.responseText);
                var dataList = document.getElementById('cityList');
                cityData.forEach(function (city) {
                    var option = document.createElement('option');
                    option.value = city.name;
                    dataList.appendChild(option);
                });
            }
        }
    }

    document.getElementById('citySearch').addEventListener('input', function () {
        var val = this.value;
        var result = cityData.filter(function(city) { return city.name === val });
        if (result.length > 0) map.setView([result[0].lat, result[0].lng], 12);
    });

    document.getElementById('copyToClipboard').addEventListener('click', function () {
        document.getElementById('clipboardHolder').select();
        document.execCommand('copy');
    })
});