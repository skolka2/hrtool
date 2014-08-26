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
};