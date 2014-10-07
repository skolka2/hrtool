ComponentBase = require '../components/componentBase'

class Testik extends ComponentBase
  constructor: (@textContent) ->
    super
    return

  addTrigger: (parentEl) ->
    but = document.createElement 'button'
    but.innerHTML = Testik.BUTTON_LABEL
    but.addEventListener ComponentBase.EventType.CLICK, @alertInfo
    parentEl.appendChild but
    return

  alertInfo: (ev) =>
    alert @textContent
    console.log @textContent
    return

Testik.BUTTON_LABEL = 'click me'

module.exports = Testik