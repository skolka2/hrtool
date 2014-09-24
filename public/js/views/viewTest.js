var ViewBase =  require('./viewBase');
var ComponentBase = require('../components/componentBase');
var ComponentCheckBox = require('../components/features/componentCheckBox');
var ComponentTaskImplicit = require('../components/features/addTask/componentTaskImplicit');
var ComponentHide = require('../components/features/componentHide');
var ComponentBuddyTasksListsInView = require('../components/tasksBuddy/componentBuddyTaskListsInView');
var helper = require('../helpers/helpers');
var ComponentFilter = require('../components/features/componentFilter');
var Model = require('../models/model');
var ComponentListVladLaz = require('../components/componentListVladLaz');
var ComponentNotificationCenter = require('../components/componentNotificationCenter');
var ComponentTable = require('../components/table/componentTable');
var hrtool = require('../models/actions');
var ComponentAddTask = require('../components/features/addTask/newTask/componentAddTask');
var ComponentDropdown = require('../components/features/componentDropdown');
var CoffeeTest = require('../coffee_test/test.js');
var ComponentPopup = require('../components/componentPopup');
var ComponentPopupFactory = require('../components/componentPopupFactory');
var ComponentFilterFormatter = require('../components/features/componentFilterFormatter');
var ComponentTableWrapper = require('../components/table/componentTableWrapper');
var ComponentTextInput = require('../components/features/componentTextInput');
var ComponentStatusBarFactory = require('../components/features/componentStatusBarFactory');

var ViewTest =  module.exports = function(){
    ViewBase.call(this,null);
    this.super = ViewBase;
}

ViewTest.prototype = new ViewBase();
ViewTest.prototype.constructor = ViewTest;

ViewTest.prototype.render = function(){
    this.super.prototype.render.apply(this, arguments);
    var mainWrapper = document.getElementById(this.super.mainWrapper);


    //HONZA VIEW

    var testik = new CoffeeTest('nu info');
    testik.addTrigger(mainWrapper);

    //Neckar view___________________________________________________________________________

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

    var tab = document.createElement("div");
    tab.innerHTML = "<br><br><br><br><br><br><br><br>";

    var divSelector = document.createElement("div");
    divSelector.innerHTML = "<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>ComponentSelect...<br><br>";


    var trigger = document.createElement('span');
    trigger.innerHTML = "<strong>Open popup with select</strong>";
    var selectPopup = ComponentPopupFactory.getSelectDepTeamPopup(trigger);
    selectPopup.render(document.getElementById('popup-wrapper'));
    divSelector.appendChild(trigger);
    fandaDiv.appendChild(divSelector);

    fandaDiv.appendChild(tab);
    mainWrapper.appendChild(fandaDiv);
    //Fanda View END

    //Witz view___________________________________________________________________________

    var witzDiv = document.createElement('div');
    witzDiv.id = "witz-div"
    witzDiv.innerHTML = '<br/><h2>Witz\'s view</h2>';

    mainWrapper.appendChild(witzDiv);

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
    notificationButton1.addEventListener(ComponentBase.CLICK_EVENT, (function(event){
        component.addNotification(event.toString(), 3000, ComponentNotificationCenter.EventType.success);
    }));

    witzDiv.appendChild(notificationButton1);

    var notificationButton2 = document.createElement('button');
    notificationButton2.innerText = "ERR";
    notificationButton2.addEventListener(ComponentBase.CLICK_EVENT, (function(event){
        component.addNotification(event.toString(), 3000, ComponentNotificationCenter.EventType.error);
    }));

    witzDiv.appendChild(notificationButton2);

    var notificationButton3 = document.createElement('button');
    notificationButton3.innerText = "budiž";
    notificationButton3.addEventListener(ComponentBase.CLICK_EVENT, (function(event){
        component.addNotification(event.toString(), 3000, ComponentNotificationCenter.EventType.neutral);
    }));

    witzDiv.appendChild(notificationButton3);

    var popupTrigger = document.createElement('span');
    popupTrigger.innerHTML = "<strong>POPUP</strong>";
    witzDiv.appendChild(document.createElement('br'));
    witzDiv.appendChild(popupTrigger);

    var popup = ComponentPopupFactory.getCheckBoxPopup(popupTrigger, component);
    popup.render(document.getElementById('popup-wrapper'));






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

    var filterData = ComponentFilterFormatter.factory.createTeamDropdownsData(
        this.helper.bulk.getDepartmentData(),
        this.helper.bulk.getTeamData()
    );
    var component = new ComponentTableWrapper(
        ComponentTableFactory.createUsersTable(),
        new ComponentFilter(filterData),
        new ComponentTextInput('Type name'));
    mainWrapper.appendChild(zibbyDiv);
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

    var myStatusBar = ComponentStatusBarFactory.createStatusBar();
    myStatusBar.render(divVladLaz);

    mainWrapper.appendChild(divVladLaz);
    //LAZ END


     //simunek cool view_____________________________________
     //example of jade template
    var marekDiv = document.createElement('div');
    marekDiv.id = 'zibby';
    marekDiv.innerHTML = '<h3>marekDiv div</h3>';
    // mainWrapper.appendChild(helper.tpl.create("templates/example",{label:"testfunguje"}));
   // var table = ComponentTableFactory.implicitTable();
   

   
    //mainWrapper.appendChild(table.element);



    var filterData1 = ComponentFilterFormatter.factory.createTeamDropdownsData(
        this.helper.bulk.getDepartmentData(),
        this.helper.bulk.getTeamData()
    );
    var component1 = new ComponentTableWrapper(
        ComponentTableFactory.implicitTable(),
        new ComponentFilter(filterData1),
        new ComponentTextInput('Type name'));
    mainWrapper.appendChild(marekDiv);
    component1.render(marekDiv);
    marekDiv.appendChild(document.createElement('br'));


   
    //mainWrapper.appendChild(table1.element);
     //simunek view piece out_____________________________________

};