// Initialize Firebase
var config = {
  apiKey: "AIzaSyCfO-_m33XvSdZ1QXN6aE4cxZVh_MK9K4M",
  authDomain: "ri-realtime-transit.firebaseapp.com",
  databaseURL: "https://ri-realtime-transit.firebaseio.com",
  storageBucket: "ri-realtime-transit.appspot.com",
  messagingSenderId: "963209676335"
};

firebase.initializeApp(config);

var firebasePositionRef = firebase.database().ref("busposition");
