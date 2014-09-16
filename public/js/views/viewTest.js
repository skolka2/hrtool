var ViewBase =  require('./viewBase');
var ComponentCheckBox = require('../components/features/componentCheckBox');
var ComponentTaskImplicit = require('../components/features/addTask/componentTaskImplicit');
var ComponentHide = require('../components/features/componentHide');
var ComponentBuddyTasksListsInView = require('../components/tasksBuddy/componentBuddyTaskListsInView');
var helper = require('../helpers/helpers');
var ComponentFilter = require('../components/features/componentFilter');
var Model = require('../models/model');
var ComponentListVladLaz = require('../components/componentListVladLaz');
var ComponentNotificationCenter = require('../components/features/componentNotificationCenter');
var ComponentTemplateList = require('../components/templateList/componentTemplateList');
var ComponentTemplateListFactory = require('../components/templateList/componentTemplateListFactory');
var hrtool = require('../models/actions');
var ComponentAddTask = require('../components/features/addTask/newTask/componentAddTask');

var ViewTest =  module.exports = function(){
    ViewBase.call(this,null);
    this.super = ViewBase;
}

ViewTest.prototype = new ViewBase();
ViewTest.prototype.constructor = ViewTest;

ViewTest.prototype.render = function(){
    var mainWrapper = document.getElementById(this.super.mainWrapper);

    //Neckar view___________________________________________________________________________
    this.componentTemplateList = new ComponentTemplateListFactory.createAll();
    var neckarWrapper = document.createElement('div');
    var bodyN = document.getElementsByTagName('body')[0];
    var NWrapper = document.getElementById(this.super.mainWrapper);
    neckarWrapper.className = "neckar-wraper";
    neckarWrapper.innerHTML = "Neckar view";
    bodyN.appendChild(neckarWrapper);
    this.componentTemplateList.render(neckarWrapper);

    
    //Fanda View START
    
    var fandaDiv = document.createElement('div');
    fandaDiv.id = "fanda-div";
    var nadpisF = document.createElement('h2');
    nadpisF.innerHTML ='Fanda\'s view<br/>';
    fandaDiv.appendChild(nadpisF);
    var componentCh = new ComponentCheckBox("CheckBox");
    var el = document.createElement('div');
    el.innerHTML = 'CheckBox...<br><br>';
    fandaDiv.appendChild(el);
    el.appendChild(componentCh.getElement());
    
    var viewWrapper = document.createElement('div');
    viewWrapper.innerHTML = "<br/><br/>ComponentHide...<br><br>";

    fandaDiv.appendChild(viewWrapper);
    var div = document.createElement("div");
    var c = new ComponentCheckBox("CheckBox");
    var d = new ComponentCheckBox("CheckBox");

    div.appendChild(c.getElement());
    div.appendChild(d.getElement());

    var b = new ComponentHide(helper.dom.createElement("<div>Tittel</div>"),div,false);
    b.render(viewWrapper);

    mainWrapper.appendChild(fandaDiv);
    //Fanda View END

    //Witz view___________________________________________________________________________

    this.super.prototype.render.apply(this, arguments);
    var mainWrapper = document.getElementById(this.super.mainWrapper);

    this.component = new ComponentCheckBox("CheckBox");
    var el = document.createElement('div');
    el.innerHTML = 'This view contains component CheckBox.<br><br>';
    var body = document.getElementsByTagName('body')[0];
    var witzDiv = document.createElement('div');
    witzDiv.id = "witz-div"
    witzDiv.innerHTML = '<br/><h2>Witz\'s view</h2>';

    body.appendChild(witzDiv);

    var component = new ComponentFilter([{'': [{value: "ahoj", id: 1},{value:"dobre", id: 2},{value: "terry", id: 3}]},
        {'1': [{value: "svete", id: 1}, {value: "lidi", id: 2}], '2': [{value: "rano", id: 3}, {value: "pivo", id: 4}], '3': [{value: "pratchett", id: 5}]}]);

    var component2 = new ComponentFilter([{'': [{value: "ahoj", id: 1},{value:"dobre", id: 2},{value: "terry", id: 3}]},
        {'1': [{value: "svete", id: 1}, {value: "lidi", id: 2}], '2': [{value: "rano", id: 3}, {value: "pivo", id: 4}], '3': [{value: "pratchett", id: 5}]},
        {'global-global': [{value: 'default1', id: 20}], '2-3': [{value:"lidi"}]}]);

    var component3 = new ComponentFilter([{'': [{value: "ahoj", id: 1},{value:"dobre", id: 2},{value: "terry", id: 3}]},
        {'1': [{value: "svete", id: 1}, {value: "lidi", id: 2}], '2': [{value: "rano", id: 3}, {value: "pivo", id: 4}], '3': [{value: "pratchett", id: 5}]},
        {'global': [{value: 'default1', id: 20}], '2': [{value:"lidi"}]}]);

    component.render(witzDiv);
    component2.render(witzDiv);
    component3.render(witzDiv);

    var notificationButton1 = document.createElement('button');
    notificationButton1.innerText = "OK";
    notificationButton1.addEventListener('click', (function(event){
        var newDiv = document.createElement('div');
        newDiv.innerHTML = event.toString();
        component.addNotification(newDiv, 3000, ComponentNotificationCenter.EventType.success);
    }));

    witzDiv.appendChild(notificationButton1);

    var notificationButton2 = document.createElement('button');
    notificationButton2.innerText = "ERR";
    notificationButton2.addEventListener('click', (function(event){
        var newDiv = document.createElement('div');
        newDiv.innerHTML = event.toString();
        component.addNotification(newDiv, 3000, ComponentNotificationCenter.EventType.error);
    }));

    witzDiv.appendChild(notificationButton2);

    var notificationButton3 = document.createElement('button');
    notificationButton3.innerText = "budiž";
    notificationButton3.addEventListener('click', (function(event){
        var newDiv = document.createElement('div');
        newDiv.innerHTML = event.toString();
        component.addNotification(newDiv, 3000, ComponentNotificationCenter.EventType.neutral);
    }));

    witzDiv.appendChild(notificationButton3);








	var viewWrapper = document.createElement('div');
	viewWrapper.className = "view-wraper";
	viewWrapper.innerHTML = "Test view to see how componentHide works...<br><br>";

	mainWrapper.appendChild(viewWrapper);
	var div = document.createElement("div");
	var c = new ComponentCheckBox("CheckBox");
    var d = new ComponentCheckBox("CheckBox");

    div.appendChild(c.getElement());
    div.appendChild(d.getElement());

	var b = new ComponentHide(helper.dom.createElement("<div>Tittel</div>"),div,false);
    b.render(viewWrapper);
    //___________________________________________________________________________

//Zibby:
    var zibbyDiv = document.createElement('div');
    zibbyDiv.id = 'zibby';
    zibbyDiv.innerHTML = '<h3>Zibby div</h3>';

    var component = new ComponentAddTask();
    body.insertBefore(zibbyDiv, mainWrapper);
    component.render(zibbyDiv);
    zibbyDiv.appendChild(document.createElement('br'));

//Zibby END

    //LAZ START
    var divVladLaz = document.createElement("div");
    divVladLaz.id = "VladLaz";

    var titleVladLaz = document.createElement("h2");
    titleVladLaz.id = "VladLazTitle";
    titleVladLaz.innerText = "Testovaci pisecek Vladimira Laznicky:";
    divVladLaz.appendChild(titleVladLaz);

    var list = new ComponentListVladLaz();
    list.render(divVladLaz);

    mainWrapper.appendChild(divVladLaz);
    //LAZ END


     //simunek cool view_____________________________________
     //example of jade template 
     mainWrapper.appendChild(helper.tpl.create("templates/example",{label:"testfunguje"}));

     //simunek view piece out_____________________________________

};