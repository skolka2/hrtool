var ViewTestCheckBox = function(){
    ViewBase.call(this,null);
    this.super = ViewBase;
    this.component = new ComponentCheckBox("CheckBox");
};

ViewTestCheckBox.prototype.render = function(){
    var el = document.createElement('div');
    el.innerHTML = 'This view contains component CheckBox.<br><br>';
    var body = document.getElementsByTagName('body')[0];
    body.insertBefore(el, body.firstChild);
    this.component.render();
};