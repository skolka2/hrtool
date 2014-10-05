ComponentPopup = require './componentPopup'
ComponentCheckBox = require './features/componentCheckBox';

module.exports = ComponentPopupFactory =
  getCheckBoxPopup:(popupTrigger, specialOpenClose) ->
    popupCheckbox = new ComponentCheckBox "test", true
    popup = new ComponentPopup(popupTrigger, popupCheckbox, specialOpenClose);

    handleOpenClose = (type) ->
      if specialOpenClose? and specialOpenClose[type]? and specialOpenClose[type].src? and specialOpenClose[type].type?
        popup.listen specialOpenClose[type].type, specialOpenClose[type].src, popup[type].bind(popup)

    handleOpenClose 'open'
    handleOpenClose 'close'
    return popup