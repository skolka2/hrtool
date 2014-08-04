(function(){
	var baseView;
	//TODO get elements from helper, inherit from observableComponent
	baseView = (function(){
		function baseView(){
			this.mainWrapper = "main-wrapper";
		}

		baseView.prototype.render = function(){
			this.base = document.getElementById(this.mainWrapper);
			if(typeof this.base != 'undefined'){ //checks if, in body, exists main-wrapper
				while(true){
					child = this.base.childNodes[0];
					if(typeof child != 'undefined'){
						this.base.removeChild(child);	//Delete all content from main-wrapper
					}
					else {
						break;
					}
				}
			}
			else{	//Adds main-wrapper
				var body = document.getElementsByTagName("body")[0];
				var div = document.createElement("div");
				div.id = this.mainWrapper;
				body.appendChild(div);
			}
		};
		return baseView;
	})(/*observableComp*/);

}.call(this);