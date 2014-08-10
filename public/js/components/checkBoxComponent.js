var ComponentCheckBox = function(){
	this.super = ComponentBase;
	this.super.prototype.constructor.apply(this);
	this.helper = helper;

	this.checked = false;

	this.createDom();

	//this.element.onclick = this.onClickFunction;

	//this.listen("CheckBoxChange",this,this,this.changeCheck);
}

ComponentCheckBox.prototype = new ComponentBase();
ComponentCheckBox.prototype.constructor = ComponentCheckBox;

ComponentCheckBox.prototype.createDom = function(){
	var buddyCheckbox = this.helper.elementsFunctions.createElement("<div></div>");	
	buddyCheckbox.className =  "buddy-checkbox";

	var checkChecked = this.helper.elementsFunctions.createElement("<div></div>");
	checkChecked.className =  "check checked";
	this.label = this.helper.elementsFunctions.createElement("<div></div>");
	this.label.className = "label";

	this.label.innerText = "Ahoj";

	checkChecked.appendChild(this.label);
	buddyCheckbox.appendChild(checkChecked);

	this.element = buddyCheckbox;

	/*<div class=buddy-checkbox>
		<div class=check checked/>
			<div class="label">checkbox label
			</div>
		</div>
	</div>*/
}

ComponentCheckBox.prototype.setCheckBoxTittle = function(tittle){
	this.label.innerText = tittle;
}

ComponentCheckBox.prototype.onClickFunction = function(){
	//this.fire("CheckBoxChange",!this.checked);  //Bad scope, cant see fire function from OBS
}


ComponentCheckBox.prototype.changeCheck = function(checked){
	this.checked = checked;
}
