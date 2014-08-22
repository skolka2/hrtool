var ComponentNavBar = function () {
    this.super.call(this);
    this.super = ComponentBase;
    
    
}
ComponentNavBar.prototype = new ComponentBase();
ComponentNavBar.prototype.constructor = ComponentNavBar;

ComponentNavBar.prototype.createDom = function () {
    var div = document.createElement("div");
    div.id = ComponentNavBar.ID;
    //create ahref buddy 
    var elem = this.helper.dom.createElement('<a id="NavBar_buddy" href="' + ComponentNavBar.USER_PAGE  + app.bulk.user.id_buddy + '">' + app.bulk.hrBuddy.first_name + " " + app.bulk.hrBuddy.last_name + '</a>');
    div.appendChild(elem);
    //create ahref Login name
    elem = this.helper.dom.createElement('<a id="NavBar_name" href="' + ComponentNavBar.USER_PAGE + app.bulk.user.id_user + '">' + app.bulk.user.first_name + " " + app.bulk.user.last_name + '</a>');
    div.appendChild(elem);
    //create logout button
    elem = this.helper.dom.createElement('<button id="login_btn"">Logout</button>');
    elem.addEventListener(ComponentBase.EventType.CLICK , this.logout.bind(this));
    div.appendChild(elem);
    this.element = div;
}

ComponentNavBar.prototype.logout = function() {
    window.location.href = ComponentNavBar.LOGOUT_PAGE;
}
ComponentNavBar.USER_PAGE = "/User/user=";
ComponentNavBar.LOGOUT_PAGE = "/logout";
ComponentNavBar.ID = "NavBar";
