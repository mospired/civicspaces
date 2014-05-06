(function() {
  if (this.cs == null) {
    this.cs = {};
  }

  this.cs.page = {
    init: function() {
      cs.page.initOptionsForm();
      cs.page.initDescriptionForm();
      cs.page.initLocationForm();
      return cs.page.initMap();
    },
    initOptionsForm: function() {
      var form;
      form = $('.form-options');
      return cs.sharedMethods.initForm(form);
    },
    initDescriptionForm: function() {
      var form;
      form = $('.form-description');
      return cs.sharedMethods.initForm(form);
    },
    initLocationForm: function() {
      var form;
      cs.page.getSelections();
      form = $('.form-location');
      cs.sharedMethods.initForm(form);
      form.bind(cs.events.FORM_FAILURE, cs.page.handleFormFailure);
      return form.bind(cs.events.FORM_SUCCESS, cs.page.handleFormSuccess);
    },
    initMap: function() {
      var addyEl, lat, latEl, lng, lngEl, marker;
      latEl = $('[name="lat"]', '.form-location');
      lngEl = $('[name="lng"]', '.form-location');
      addyEl = $('[name="address"]', '.form-location');
      marker = {
        label: addyEl.val(),
        infoHtml: addyEl.val()
      };
      lat = latEl.val();
      lng = lngEl.val();
      return cs.sharedMethods.initMap('#googlemap', lat, lng, marker);
    },
    getSelections: function() {
      var context;
      if (!cs.page.selections) {
        context = '.form-location';
        return cs.page.selections = {
          id: $('[name="_id"]', context),
          lat: $('[name="lat"]', context),
          lng: $('[name="lng"]', context),
          address: $('[name="address"]', context),
          city: $('[name="city"]', context),
          zip: $('[name="zip"]', context)
        };
      }
    },
    handleFormFailure: function(event) {
      return console.log('form failure', event.target);
    },
    handleFormSuccess: function(event) {
      return cs.page.geocode();
    },
    geocode: function() {
      var address, callback, geocoder;
      geocoder = cs.page.geocoder || new google.maps.Geocoder();
      callback = cs.page.handleGeocode;
      address = cs.page.getCombinedAddress();
      return geocoder.geocode({
        address: address
      }, function(results, status) {
        var data, loc;
        if (status === google.maps.GeocoderStatus.OK) {
          loc = results[0].geometry.location;
          data = {
            lat: loc.k,
            lng: loc.A,
            locality: cs.page.getLocalityFromComponents(results[0].address_components)
          };
          if (results[0].partial_match) {
            data.partial_match = true;
          }
          return callback(null, data);
        } else {
          return callback(status, null);
        }
      });
    },
    handleGeocode: function(err, results) {
      var postData;
      if (err) {
        return console.log(err);
      }
      if (results.partial_match) {
        return console.log('the geocoding returned sketchy results');
      } else {
        postData = {
          id: cs.page.selections.id.val(),
          lat: results.lat,
          lng: results.lng
        };
        return $.post('/api/add-geo', postData, cs.page.handleGeoUpdate, "json");
      }
    },
    handleGeoUpdate: function(results) {
      if (results.err) {
        return console.log(results.err);
      }
      if (results.success) {
        cs.page.selections.lat.val(results.lat);
        cs.page.selections.lng.val(results.lng);
        cs.sharedMethods.drawMap(results.lat, results.lng, cs.page.selections.address.val());
      }
    },
    getCombinedAddress: function() {
      return cs.page.selections.address.val() + ',' + cs.page.selections.zip.val();
    },
    getLocalityFromComponents: function(components) {
      var component, locality, _i, _len;
      for (_i = 0, _len = components.length; _i < _len; _i++) {
        component = components[_i];
        if (component.types[0] === 'locality') {
          locality = cs.page.getLocality(component);
        }
      }
      return locality;
    },
    getLocality: function(component) {
      return component.long_name;
    }
  };

  $(document).ready(function() {
    return google.maps.event.addDomListener(window, 'load', cs.page.init);
  });

}).call(this);