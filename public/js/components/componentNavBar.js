var ComponentNavBar = function () {
    this.super = ComponentBase;
    this.super.call(this);
    this.helper = helper;
    this.LOGOUT_PAGE = "/logout";
}
ComponentNavBar.prototype = new ComponentBase();
ComponentNavBar.prototype.constructor = ComponentNavBar;

ComponentNavBar.prototype.getUserData = function (userID) {
    var data = {
        id      : userID,
        firstName: "Jmeno",
        surName: "Prijmeni",
        buddy: "Your Buddy",
        buddyId : "54321",
        buddyFirstName: "BuddyJmeno",
        buddySurName: "BuddyPrijmeni"
    }
    return data;
}

ComponentNavBar.prototype.createDom = function () {
    var div = document.createElement("div");
    var userData = this.getUserData('012345');
    var elem;
    div.id = "NavBar";
    
    //create ahref buddy 
    elem = this.helper.dom.createElement('<a id="NavBar_buddy" href="' + window.location + "User/user=" + app.bulk.user.id_buddy + '">' + app.bulk.hrBuddy.first_name + " " + app.bulk.hrBuddy.last_name + '</a>');
    div.appendChild(elem);
    //create ahref Login name
    elem = this.helper.dom.createElement('<a id="NavBar_name" href="' + window.location + "User/user=" + app.bulk.user.id_user + '">' + app.bulk.user.first_name + " " + app.bulk.user.last_name + '</a>');
    div.appendChild(elem);
    //create logout button
    elem = this.helper.dom.createElement('<button id="login_btn" type="button" ">Logout</button>');
    elem.addEventListener('click', this.logout.bind(this));
    div.appendChild(elem);
    this.element = div;
}

ComponentNavBar.prototype.logout = function() {
    window.location.href = this.LOGOUT_PAGE;
}

