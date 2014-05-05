// Generated by CoffeeScript 1.6.3
(function() {
  if (this.cs == null) {
    this.cs = {};
  }

  this.cs.sharedMethods = {
    initForm: function(formId) {
      return new Form($(formId));
    },
    initMap: function(mapId, lat, lng, marker, zoom) {
      if (lat == null) {
        lat = Map.defaultLat;
      }
      if (lng == null) {
        lng = Map.defaultLng;
      }
      if (marker == null) {
        marker = null;
      }
      if (zoom == null) {
        zoom = 12;
      }
      return cs.map = new Map($(mapId), lat, lng, marker, zoom);
    },
    setBoundsUpdate: function(callback) {
      return google.maps.event.addListener(cs.map.googlemap, 'bounds_changed', callback);
    }
  };

  this.cs.events = {
    VALIDATION_ERROR: 'validation_error',
    FORM_SUCCESS: 'form_success',
    FORM_FAILURE: 'form_failure'
  };

}).call(this);