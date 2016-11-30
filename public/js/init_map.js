mapboxgl.accessToken = 'pk.eyJ1IjoidHJlaWZmIiwiYSI6ImNpdnpqa2FzajAyZGcydXBkaGlzNGlyejYifQ.Zcyt_3PNuYoG3v_5MypsgQ';

var map = new mapboxgl.Map({
  container: 'map',
  center: [-71.41, 41.70],
  zoom: 8.64,
  style: 'mapbox://styles/treiff/ciw0r94y5003a2kr3o6dcll81'
});

// Fetch route info.
function jsonCallback(json){
  window.routes = json;
}

$.ajax({
  url: "https://firebasestorage.googleapis.com/v0/b/ri-realtime-transit.appspot.com/o/routes.json?alt=media&token=246b3d59-6758-4f94-9ec0-9e1ef72ec636",
  dataType: "jsonp"
});

// Set markers
firebaseRef.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val(),
        latLng = [childData.position.longitude, childData.position.latitude],
        contentString = 'StopId:' + childData.stop_id +
                        'RouteId:' + childData.trip.route_id +
                        'Speed:' + childData.position.speed;

       buildLocationList(childData);

        var el = document.createElement('div');
            el.className = 'marker';
            el.style.left= '-28px';
            el.style.top= '-46px';

        var marker = new mapboxgl.Marker(el)
          .setLngLat(latLng)
          .addTo(map);
      });
    });

// Setup sidebar
function buildLocationList(childData) {
  var buses = document.getElementById('buses');
  var bus = buses.appendChild(document.createElement('div'));
  bus.className = 'item';
  bus.id = 'listing-' + childData.vehicle.id;

  var link = bus.appendChild(document.createElement('a'));
  link.href = '#';
  link.className = 'title';
  link.dataPosition = childData.vehicle.id;
  link.innerHTML = childData.trip.route_id + ': ' + window.routes[parseInt(childData.trip.route_id)].route_long_name;

  // TODO Add next stop data...
  //
  var speed = bus.appendChild(document.createElement('div'));
  var speedVal = childData.position.speed ? parseFloat(childData.position.speed).toFixed(1) : 'n/a';
  speed.innerHTML = 'speed: ' + speedVal;

  // Sidebar link event listener
  link.addEventListener('click', function(e) {
    var currentBusPosition = [childData.position.longitude, childData.position.latitude];
    flyToBus(currentBusPosition);
    createPopUp(currentBusPosition, childData);

    var activeItem = document.getElementsByClassName('active');
    if (activeItem[0]) {
      activeItem[0].classList.remove('active');
    }
    this.parentNode.classList.add('active');
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
function createPopUp(currentBusPosition, childData) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();

  var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentBusPosition)
    .setHTML('<h4>' + childData.trip.route_id + ': ' + window.routes[parseInt(childData.trip.route_id)].route_long_name + '</h4>' +
      '<h5>yup</h5>')
    .addTo(map);
}
