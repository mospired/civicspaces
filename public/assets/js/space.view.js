// Generated by CoffeeScript 1.6.3
(function() {
  if (this.cs == null) {
    this.cs = {};
  }

  this.cs.page = {
    init: function() {
      var lat, lng, marker;
      marker = null;
      lat = 33.7811643;
      lng = -84.38362970000003;
      if (cs.page_space) {
        marker = {
          label: cs.page_space.address,
          infoHtml: cs.page_space.address
        };
        if (cs.page_space.lat && cs.page_space.lng) {
          lat = cs.page_space.lat;
          lng = cs.page_space.lng;
        }
      }
      return cs.map.init('#googlemap', lat, lng, marker);
    }
  };

  google.maps.event.addDomListener(window, 'load', cs.page.init);

}).call(this);