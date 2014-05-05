// Generated by CoffeeScript 1.6.3
(function() {
  var Validator;

  Validator = (function() {
    function Validator() {
      if (!!this.singleton_instance) {
        return this.singleton_instance;
      }
      this.singleton_instance = this;
    }

    Validator.prototype.test = function(method, input) {
      if (this[method]) {
        return this[method](input);
      } else {
        return this.not_empty(input);
      }
    };

    Validator.prototype.null_selection = "-1";

    Validator.prototype.not_empty = function(input) {
      return input.val().length > 0;
    };

    Validator.prototype.email = function(input) {
      var val;
      val = input.val();
      return val.match(this.patterns.email) && val.length <= 128;
    };

    Validator.prototype.password = function(input) {
      var val;
      val = input.val();
      return val.length >= 4;
    };

    Validator.prototype.name = function(input) {
      return input.val().match(this.patterns.name);
    };

    Validator.prototype.phone = function(input) {
      return input.val().match(this.patterns.phone);
    };

    Validator.prototype.patterns = {
      email: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w0-9a-zA-Z]*\.)+[a-zA-Z]{2,9})$/i,
      name: /^[A-Za-z]([A-Za-z\-\s]{1,24})$/,
      phone: /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/i
    };

    return Validator;

  })();

  this.cs.validator = new Validator();

}).call(this);