var ViewTest = function(){
	ViewBase.call(this,null);
	this.super = ViewBase;
}
ViewTest.prototype = new ViewBase();
ViewTest.prototype.constructor = ViewTest;

ViewTest.prototype.render = function(){
    this.component = new ComponentCheckBox("CheckBox");
    var el = document.createElement('div');
    el.innerHTML = 'This view contains component CheckBox.<br><br>';
    var body = document.getElementsByTagName('body')[0];
    body.insertBefore(el, body.firstChild);
    this.component.render();

    var witzDiv = document.createElement('div');
    witzDiv.id = "witz-div"
    witzDiv.innerHTML = '<br/><h2>Witz\'s view</h2>';

    body.appendChild(witzDiv);

    var component = new ComponentFilter([{'': [{value: "ahoj", id: 1},{value:"dobre", id: 2},{value: "terry", id: 3}]},
        {'1': [{value: "svete", id: 1}, {value: "lidi", id: 2}], '2': [{value: "rano", id: 3}, {value: "pivo", id: 4}], '3': [{value: "pratchett", id: 5}]}]);

    var component2 = new ComponentFilter([{'': [{value: "ahoj", id: 1},{value:"dobre", id: 2},{value: "terry", id: 3}]},
        {'1': [{value: "svete", id: 1}, {value: "lidi", id: 2}], '2': [{value: "rano", id: 3}, {value: "pivo", id: 4}], '3': [{value: "pratchett", id: 5}]},
        {'global-global': [{value: 'default1', id: 20}], '2-3': [{value:"lidi"}]}]);

    component.render(witzDiv);
    component2.render(witzDiv);


	var mainWrapper = document.getElementById(this.super.mainWrapper);

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

};