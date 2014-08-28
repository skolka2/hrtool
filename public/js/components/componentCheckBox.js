var ComponentCheckBox = function(labelText,checked){
	ComponentBase.apply(this);
	this.super = ComponentBase;
	this.labelText =  "";
	

	if(!!labelText){
		this.labelText = labelText;
	}
	this.checked = !!checked;
}

ComponentCheckBox.prototype = new ComponentBase();
ComponentCheckBox.prototype.constructor = ComponentCheckBox;

ComponentCheckBox.prototype.createDom = function(){
	var buddyCheckbox = document.createElement("div");	
	buddyCheckbox.className =  "buddy-checkbox";
	buddyCheckbox.id = "buddy-checkbox" + this.componentId;

	this.checkChecked = document.createElement("div");
	
	this._setCheckClass();

	this.label = document.createElement("div");
	this.label.className = "checkbox-label";

	this.label.innerText = this.labelText;

	buddyCheckbox.appendChild(this.checkChecked);
	buddyCheckbox.appendChild(this.label);

	this.element = buddyCheckbox;

	this.element.addEventListener(ComponentBase.EventType.CLICK ,this.handleOnClick.bind(this),false);
	/*<div class=buddy-checkbox1>
		<div class=check.Checked/>
		</div>
		<div class="label">checkbox label
		</div>
	</div>*/
}

ComponentCheckBox.prototype._setCheckClass = function(){
	if(this.checked){
		this.checkChecked.className = ComponentCheckBox.checkBoxClass.CHECKED;	
	}
	else{
		this.checkChecked.className = ComponentCheckBox.checkBoxClass.NOTCHECKED;
	}
}

//Tells what happens when we click on CheckBox
ComponentCheckBox.prototype.handleOnClick = function(){
	this.setChecked(!this.checked);

}

// Sets CheckBox tittle
ComponentCheckBox.prototype.setCheckBoxTittle = function(tittle){
	this.labelText = tittle;
	this.label.innerText = tittle;
}

// Changes CheckBox 
ComponentCheckBox.prototype.setChecked = function(checked){
	this.getElement();
	this.checked = checked;
	this._setCheckClass();
	this.fire(ComponentBase.EventType.CHANGE,this.checked);
}

ComponentCheckBox.checkBoxClass = {
	CHECKED:"checkbox checked",
	NOTCHECKED:"checkbox"
}