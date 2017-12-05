var googleMap = new GoogleMap();

function GoogleMap(){

        var geocoder;
        var map;

        this.initMap = function() {
            geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(-33.9, 151.2);
            var mapOptions = {
                zoom: 5,
                center: latlng,
                mapTypeId:'hybrid'
            };
            map = new google.maps.Map(document.getElementById('map'), mapOptions);
            /***
             var marker = new google.maps.Marker({
        position: sydney,
        map: map
        });
             ***/
        };


        this.codeAddress = function() {
            var address = document.getElementById('address').value;
            geocoder.geocode( { 'address': address},
                function(results, status) {
                    if (status == 'OK') {
                        map.setCenter(results[0].geometry.location);
                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                }
            );
        };

}


