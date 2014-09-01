var ViewWitzTest = function(){
    ViewBase.call(this);
    this.super = ViewBase;
};

ViewWitzTest.prototype.render = function(){
    this.super.prototype.render.apply(this, arguments);
    var mainWrapper = document.getElementById(this.super.mainWrapper);

    var viewWrapper = document.createElement('div');
    viewWrapper.className = "view-wraper";

    mainWrapper.appendChild(viewWrapper);

    var component = new ComponentFiltrableTask([{'': [{value: "ahoj", id: 1},{value:"dobre", id: 2},{value: "terry", id: 3}]},
        {'1': [{value: "svete", id: 1}, {value: "lidi", id: 2}], '2': [{value: "rano", id: 3}, {value: "pivo", id: 4}], '3': [{value: "pratchett", id: 5}]}]);

     var component2 = new ComponentFiltrableTask([{'': [{value: "ahoj", id: 1},{value:"dobre", id: 2},{value: "terry", id: 3}]},
        {'1': [{value: "svete", id: 1}, {value: "lidi", id: 2}], '2': [{value: "rano", id: 3}, {value: "pivo", id: 4}], '3': [{value: "pratchett", id: 5}]},
        {'global-global': [{value: 'default1', id: 20}], '2-3': [{value:"lidi"}]}]);

    component.render();
    component2.render();
};