var ComponentCheckBox, ComponentPopup, ComponentPopupFactory;

ComponentPopup = require('./componentPopup');

ComponentCheckBox = require('./features/componentCheckBox');

module.exports = ComponentPopupFactory = {
    getCheckBoxPopup: function(popupTrigger, specialOpenClose) {
        var handleOpenClose, popup, popupCheckbox;
        popupCheckbox = new ComponentCheckBox("test", true);
        popup = new ComponentPopup(popupTrigger, popupCheckbox, specialOpenClose);
        handleOpenClose = function(type) {
            if ((specialOpenClose != null) && (specialOpenClose[type] != null) && (specialOpenClose[type].src != null) && (specialOpenClose[type].type != null)) {
                popup.listen(specialOpenClose[type].type, specialOpenClose[type].src, popup[type].bind(popup));
            }
        };
        handleOpenClose('open');
        handleOpenClose('close');
        return popup;
    }
};