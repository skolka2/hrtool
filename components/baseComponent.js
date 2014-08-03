(function(){
	var base;
	

	//Default constructor
	base = function(){
		this.childs = {};
		this.element = null;
		this.rendered = false;
	}

	//Insert child component
	base.prototype.addChild = function (name, component, wraper){
		if(this.childs[name]){
			console.log("Component with name: " + name + " already exists.");
		}
		else{
			this.childs[name] = {
				'component': component,
				'wraper': wraper
			};
		}
	}

	//Remove child component
	base.prototype.removeChild = function (name){
		if(this.childs[name]){
			delete this.childs[name];
		}
		else {
			console.log("Component with name: " + name + " is not parrent of this component.");
		}
	}

	//Delete elements of component including listeners
	base.prototype.destroy = function (parrent){
		parrent.removeChild(this.element); //Apparently this deletes listeners too.

		/*var child;
		for(name in this.childs){
			child = this.childs[name];
			
			child.component.destroy(child.component);
			if(parrent){
				parrent.removeChild(this.element);
			}
			this.childs[name] = null;
		}*/
	}

	// Prepare element
	base.prototype.createDom = function (){
		this.element = document.createElement("div");
	}

	// Returns element
	base.prototype.getElement = function (){
		return this.element;
	}

	// Renders and insert component into dom (including child)
	base.prototype.render = function (parrent){
		
		element = null;
		if(this.getElement() == null){
			this.createDom();
		}
		element = this.getElement();
		parrent.appendChild(element);
		this.rendered = true;

		if(Object.keys(this.childs).length === 0){
			return;
		}
		var child ,parrentOfChild;
		parrentOfChild = element;
		for(name in this.childs){
			child = this.childs[name];
			var newParrentOfChild = this.element.getElementsByClassName(child.wraper);
			if(newParrentOfChild.length ===1){
				parrentOfChild = newParrentOfChild[0];
			}
			child.component.render(parrentOfChild);
		}		
		
		
	}

}).call(this);