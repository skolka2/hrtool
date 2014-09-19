var ComponentBase = require('./componentBase');
var Const = require('../helpers/constants');
var app = require('../app');

var ComponentNavBar =  module.exports =  function () {
    this.super.call(this);
    this.super = ComponentBase;
    this.data = {
        hrBuddy: '<a href="mailto:'  + this.helper.bulk.getData(['hrBuddy', 'email']) + '">' + this.helper.bulk.getData(['hrBuddy', 'first_name']) + " " + this.helper.bulk.getData(['hrBuddy', 'last_name']) + '</a>',
        user: '<a href="' + ComponentNavBar.USER_PAGE + this.helper.bulk.getData(['user', 'id_user']) + '">' + this.helper.bulk.getData(['user', 'first_name']) + " " + this.helper.bulk.getData(['user', 'last_name']) + '</a>'
    };
};

ComponentNavBar.prototype = new ComponentBase();
ComponentNavBar.prototype.constructor = ComponentNavBar;

ComponentNavBar.prototype.createDom = function () {
    var div = document.getElementById(ComponentNavBar.ID);
    if(app && app.bulk){
        var div2 = document.createElement("div");
        div2.id = ComponentNavBar.USER_DIV_ID;
        //create ahref buddy
        var elem = this.helper.dom.createElement(this.data.hrBuddy);
        div.appendChild(elem);
        div.appendChild(this.createMenu());
        //create ahref Login name
        elem = this.helper.dom.createElement(this.data.user);
        div2.appendChild(elem);
        //create logout button
        elem = this.helper.dom.createElement('<a href="' + ComponentNavBar.LOGOUT_PAGE + '">Logout</a>');
        div2.appendChild(elem);
        div.appendChild(div2);
    }else{
        var elem = this.helper.dom.createElement('<a href="' + ComponentNavBar.LOGIN_PAGE + '">Login</a>');
        div.appendChild(elem);
    }
    this.element = div;
};


ComponentNavBar.prototype.createMenu = function(){
    var menu = document.createElement('div');
    menu.id = ComponentNavBar.MENU_CLASS;
    if(this.helper.bulk.getData(['user', 'id_user_role']) === Const.TEAM_MANAGER || this.helper.bulk.getData(['user', 'id_user_role']) === Const.ADMINISTRATOR){
        var homeEl = this.helper.dom.createElement('<a href="#"><div class=' + ComponentNavBar.MENU_ITEM_CLASS + '>Home</div></a>');
        menu.appendChild(homeEl);
        var tasksEl = this.helper.dom.createElement('<a href="#taskAdmin"><div class=' + ComponentNavBar.MENU_ITEM_CLASS + '>Tasks</div></a>');
        menu.appendChild(tasksEl);
        var peopleEl = this.helper.dom.createElement('<a href="#poopleAdmin"><div class=' + ComponentNavBar.MENU_ITEM_CLASS + '>People</div></a>');
        menu.appendChild(peopleEl);
        if(this.helper.bulk.getData(['user', 'id_user_role']) === Const.ADMINISTRATOR){
            var depEl = this.helper.dom.createElement('<a href="#departmentAdmin"><div class=' + ComponentNavBar.MENU_ITEM_CLASS + '>Departments</div></a>');
            menu.appendChild(depEl);
        }
    }else{
        var tasksEl = this.helper.dom.createElement('<a href="#taskAdmin"><div class=' + ComponentNavBar.MENU_ITEM_CLASS + '>Tasks</div></a>');
        menu.appendChild(tasksEl);
    }

    return menu;
};


ComponentNavBar.prototype.render = function(){
    if(!this.rendered)
        document.getElementById('navbar').innerHTML = '<a href="/auth/google" id="login-button">Login</a>';
    document.getElementById('login-button').style.display = 'none';
    this.rendered = true;
    this.createDom();
};



ComponentNavBar.USER_PAGE = "/User/user=";
ComponentNavBar.LOGOUT_PAGE = "/logout";
ComponentNavBar.LOGIN_PAGE = "/login";
ComponentNavBar.ID = "navbar";
ComponentNavBar.USER_DIV_ID = 'navbar-user';
ComponentNavBar.MENU_ITEM_CLASS = 'navbar-menu-item';
ComponentNavBar.MENU_CLASS = 'navbar-menu';
