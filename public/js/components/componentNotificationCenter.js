var ComponentNotificationCenter = module.exports = function() {

    this._countOfNotifications = 0;
    this.render(document.getElementById('navbar'));
};

ComponentNotificationCenter.prototype.addNewNotification = function(element, duration, type) {
    if(typeof element === "string") {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = element;
        element = wrapper;
    }

    var newDiv = document.createElement('div');
    newDiv.className = type ? type : ComponentNotificationCenter.EventType.neutral;
    newDiv.appendChild(element);
    this._countOfNotifications++;


    if (this._countOfNotifications === 1) {
        setTimeout(function(){
            this.element.classList.remove('deactivated')
        }.bind(this),0);
    }

    this.element.appendChild(newDiv);

    setTimeout(this._hide.bind(this, newDiv), duration);
};

ComponentNotificationCenter.prototype._hide = function(newDiv) {
    this._countOfNotifications--;

    if(!this._countOfNotifications) {
        this.element.classList.add("deactivated");
    }
    this.element.removeChild(newDiv);
};

ComponentNotificationCenter.prototype.createDom = function() {
    var wrapper = document.createElement('div');
    wrapper.className = "notification-center deactivated";
    this.element = wrapper;
};

ComponentNotificationCenter.prototype.render = function(wrapper) {
    if(!this.element) {
        this.createDom();
    }
    wrapper.appendChild(this.element);
};

ComponentNotificationCenter.prototype.isOpened = function() {
    return !!this._countOfNotifications;
};

ComponentNotificationCenter.EventType = {
    success: 'notification-success',
    neutral: 'notification-neutral',
    error: 'notification-error'
};

ComponentNotificationCenter.DEFAULT_TIME = 3000;