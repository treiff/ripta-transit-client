mapboxgl.accessToken = 'pk.eyJ1IjoidHJlaWZmIiwiYSI6ImNpdnpqa2FzajAyZGcydXBkaGlzNGlyejYifQ.Zcyt_3PNuYoG3v_5MypsgQ';

var map = new mapboxgl.Map({
  container: 'map',
  center: [-71.41, 41.70],
  zoom: 8.64,
  style: 'mapbox://styles/treiff/ciw0r94y5003a2kr3o6dcll81'
});

var posjson = {"type": "FeatureCollection", "features": []};

firebasePositionRef.once("value").then(function(snapshot) {
  snapshot.forEach(function(child) {
    var bus = child.val(),
        feature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [bus.longitude, bus.latitude]
          },
          properties: {
            busId: child.key,
            speed: bus.speed
          }
        };
    posjson.features.push(feature);
  });
});

map.on('load', function() {
  map.addSource('buspos', {
    type: 'geojson',
    data: posjson
  });

  map.addLayer({
    "id": "buspos",
    "type": "symbol",
    "source": "buspos",
    "layout": {
      "icon-image": "bus-15"
    }
  });
});

// Setup sidebar
function buildLocationList(posjson) {
  posjson.features.forEach(function(marker) {
    var buses = document.getElementById('buses');
    var bus = buses.appendChild(document.createElement('div'));
    bus.className = 'item';
    bus.id = 'listing-' + marker.properties.busId;

    var link = bus.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.dataPosition = marker.properties.busId;
    link.innerHTML = marker.properties.routeId + ': ' + routes[parseInt(marker.properties.routeId)].route_long_name;

    // TODO Add next stop data...
    //
    var speed = bus.appendChild(document.createElement('div'));
    var speedVal = marker.properties.speed ? parseFloat(marker.properties.speed).toFixed(1) : 'n/a';
    speed.innerHTML = 'speed: ' + speedVal;

    // Sidebar link event listener
    link.addEventListener('click', function(e) {
      var currentBusPosition = marker.geometry.coordinates;
      flyToBus(currentBusPosition);
      createPopUp(currentBusPosition, marker);

      var activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');
    });
  });
}

// Fly to bus
function flyToBus(currentBusPosition) {
  map.flyTo({
    center: currentBusPosition,
    zoom: 15
  });
}

// Marker popup
function createPopUp(currentBusPosition, marker) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();

  var popup = new mapboxgl.Popup({ closeOnClick: true })
    .setLngLat(currentBusPosition)
    .setHTML('<h4>' + marker.properties.routeId + ': ' + routes[parseInt(marker.properties.routeId)].route_long_name + '</h4>' +
      '<h5>yup</h5>')
    .addTo(map);
}

updatedposjson = {"type": "FeatureCollection", "features": []};

firebasePositionRef.on('child_changed', function(childSnapshot, prevChildKey) {
  var bus = childSnapshot.val();
  updatedposjson.features.push(
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [bus.longitude, bus.latitude]
      },
      properties: {
        busId: prevChildKey,
        speed: bus.speed || 'n/a',
      }
    }
  );
  map.getSource('buspos').setData(updatedposjson);
});
