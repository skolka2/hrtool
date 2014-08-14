var ViewHome = function(){
    this.helper = helper;
    this.component = new ComponentTest();
}

ViewHome.prototype.render = function(){
    var el = document.createElement('div');
    el.innerHTML = 'first content';
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(el);
    this.component.render(body);

}