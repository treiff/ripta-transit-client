function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.700, lng: -71.412},
    zoom: 10,
    styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]  // Turn off points of interest.
    }, {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
    }],
    disableDoubleClickZoom: true
  });

  firebaseRef.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val(),
            latLng = {lat: childData.position.latitude, lng: childData.position.longitude },
            contentString = 'StopId: ' + childData.stop_id +
                            ' RouteId: ' + childData.trip.route_id +
                            ' Speed: ' + childData.position.speed;

        var marker = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          position: latLng,
          map: map
        });

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      });
    });
}
