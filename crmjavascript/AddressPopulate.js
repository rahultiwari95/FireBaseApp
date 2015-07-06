function PopulateAddresses() {

    //If google library not loaded then settime
    if (google == null) {
        google.load("maps", "3", { other_params: "libraries=places&sensor=false", "callback": PopulateAddresses });
        setTimeout(PopulateAddresses, 2000);
        return;
    }
    //If google library loaded but google maps libray not loaded then add those and settime to recall same function again
    if (google != null && google.maps == null) {
        google.load("maps", "3", { other_params: "libraries=places&sensor=false", "callback": PopulateAddresses });
        setTimeout(PopulateAddresses, 2000);
        return;
    }
    //if google map places is undefined then recall function after some time.. 

    if (google.maps.places == null) {
        setTimeout(PopulateAddresses, 2000);
        return;
    }

    //Get input control for Google places    
    var autocomplete;
  
    var CompositeAddrss = Xrm.Page.getAttribute('address1_composite');
    var OnlyAddress = Xrm.Page.getAttribute('address1_line1');
    var CompositeBillAddrss = Xrm.Page.getAttribute('address2_composite');

    if (CompositeAddrss != null) {

        var el = document.getElementById("address1_composite");
        el.addEventListener("click", function () {

            var  input = document.getElementById("address1_composite_compositionLinkControl_address1_line1_i");
            input.addEventListener("keypress", function () {
                $('.pac-container').css('z-index', '9999');
                $('.pac-container').css('min-width', '400px');
                $('.pac-item').css('width', '400px');
                //add input to google autocomplete
                autocomplete = new google.maps.places.Autocomplete(input);
                BindListner(autocomplete, "address1")
            });
           
        }

         ,false );
      
    }
    // this is for Billing address
    if (CompositeBillAddrss != null) {

       var el = document.getElementById("address2_composite");
        el.addEventListener("click", function () {

            var input = document.getElementById("address2_composite_compositionLinkControl_address2_line1_i");
            input.addEventListener("keypress", function () {
                $('.pac-container').css('z-index', '9999');
                $('.pac-container').css('min-width', '400px');
                $('.pac-item').css('width', '400px');
                //add input to google autocomplete
                autocomplete = new google.maps.places.Autocomplete(input);
                BindListner(autocomplete, "address2")
            });
          

        }

         , false);

    }
   else if (OnlyAddress != null) {

        var input = $("#address1_line1_i");

        /*Sometimes google places list is not showing thats why need to add this style*/
        var pacContainerInitialized = false;
        input.keypress(function () {

            if (!pacContainerInitialized) {
                $('.pac-container').css('width', '400px');
                $('.pac-container').css('z-index', '9999');
                pacContainerInitialized = false;
            }
        });
      
        //add input to google autocomplete
        autocomplete = new google.maps.places.Autocomplete(document.getElementById('address1_line1_i'));
        BindListner(autocomplete, "address1")
    }

    /* Set up event listener for place selection */
    //controlName is for the name of control
    function BindListner(autocomplete, controlName) {

        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            /* Get place details */
          
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            /* Loop through the address components for the selected place and fill
             the corresponding input fields in CRM */

            var houseNumber, StreetName, city, state, Zip, Country;

            for (i = 0; i < place.address_components.length; i++) {

                var type = place.address_components[i].types[0];
                if (type == 'street_number') {
                    houseNumber = place.address_components[i].long_name + "";
                }
                if (type == 'route') {
                    StreetName = place.address_components[i].long_name;
                }
                if (type == 'locality' || type == 'administrative_area_level_3') {
                    city = place.address_components[i].long_name;
                }
                if (type == 'postal_code') {
                    Zip = place.address_components[i].long_name;
                }
                if (type == 'administrative_area_level_1') {
                    state = place.address_components[i].short_name;
                }
                if (type == 'country') {
                    Country = place.address_components[i].long_name;
                }
            }

            
            Xrm.Page.getAttribute(controlName + '_line1').setValue(houseNumber + " " + StreetName);
            // Xrm.Page.getAttribute('address1_line2').setValue(StreetName);
            Xrm.Page.getAttribute(controlName + '_city').setValue(city);
            Xrm.Page.getAttribute(controlName + '_postalcode').setValue(Zip);
            Xrm.Page.getAttribute(controlName + '_stateorprovince').setValue(state);
            Xrm.Page.getAttribute(controlName + '_country').setValue(Country);


        });

    }

}

