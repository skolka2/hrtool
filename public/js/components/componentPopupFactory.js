(function() {
  var ComponentCheckBox, ComponentFilter, ComponentPopup, ComponentPopupFactory;

  ComponentPopup = require('./componentPopup');

  ComponentCheckBox = require('./features/componentCheckBox');

  ComponentFilter = require('./features/componentFilter');

  module.exports = ComponentPopupFactory = {
    getCheckBoxPopup: function(popupTrigger, filter) {
      var popup, popupCheckbox;
      popupCheckbox = new ComponentCheckBox("test", true);
      popup = new ComponentPopup(popupTrigger, popupCheckbox);
      if (filter != null) {
        popup.listen(ComponentFilter.EventType.UPDATED, filter, popup.open);
      }
      return popup;
    }
  };

}).call(this);
