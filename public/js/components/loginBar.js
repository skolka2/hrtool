var ComponentLoginBar = function () {
    this.super = ComponentBase;
    this.super.call(this);
    this.type = 'loginBar';
}
ComponentLoginBar.prototype = new ComponentBase();
ComponentLoginBar.prototype.constructor = ComponentLoginBar;

ComponentLoginBar.prototype.addLoginBar = function () {
    var div = document.createElement("div");
    var userData = this.getUserData('012345');
    var ahref;
    div.id = "LoginBar";
    //create ahref Login name
    ahref = ComponentLoginBar.prototype.createAhref("loginBar_name", userData.firstName + " " + userData.surName, window.location + "User/user=" + userData.id);
    div.appendChild(ahref);
    //create ahref buddy 
    ahref = ComponentLoginBar.prototype.createAhref("loginBar_buddy", userData.buddyFirstName + " " + userData.buddySurName, window.location + "User/user=" + userData.buddyId);
    div.appendChild(ahref);
    return div;
}

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
    this.element = ComponentLoginBar.prototype.addLoginBar();
}

//shut be in helper?
ComponentLoginBar.prototype.createAhref = function (id, textNode, href) {
    var a = document.createElement('a');
    var text = document.createTextNode(textNode);
    a.appendChild(text);
    a.title = text.textContent;
    a.id = id;
    a.href = href;
    return a;
}