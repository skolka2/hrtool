var ComponentLoginBar = function () {
    this.super = ComponentBase;
    this.super.call(this);
    this.helper = helper;
}
ComponentLoginBar.prototype = new ComponentBase();
ComponentLoginBar.prototype.constructor = ComponentLoginBar;

ComponentLoginBar.prototype.getUserData = function (userID) {
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

ComponentLoginBar.prototype.createDom = function () {
    var div = document.createElement("div");
    var userData = this.getUserData('012345');
    var elem;
    div.id = "LoginBar";
    
    //create ahref buddy 
    elem = helper.elementsFunctions.getElement('<a id="loginBar_buddy" href="' + window.location + "User/user=" + userData.buddyId + '">' + userData.buddyFirstName + " " + userData.buddySurName + '</a>');
    div.appendChild(elem);
    //create ahref Login name
    elem = helper.elementsFunctions.getElement('<a id="loginBar_name" href="' + window.location + "User/user=" + userData.id + '">' + userData.firstName + " " + userData.surName + '</a>');
    div.appendChild(elem);
    //create logout button
    elem = helper.elementsFunctions.getElement('<button id="login_btn" type="button">Logout</button>');
    div.appendChild(elem);
    this.element = div;
}