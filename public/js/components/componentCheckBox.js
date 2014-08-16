var ComponentCheckBox = function(labelText,checked){
	this.super = ComponentBase;
	this.super.apply(this);
	this.labelText =  "DefaultText";
	

	if(!!labelText){
		this.labelText = labelText;
	}
	this.checked = !!checked;
}

ComponentCheckBox.prototype = new ComponentBase();
ComponentCheckBox.prototype.constructor = ComponentCheckBox;

ComponentCheckBox.prototype.createDom = function(){
	var buddyCheckbox = document.createElement("div");	
	buddyCheckbox.className =  "buddy-checkbox" + this.componentId;

	this.checkChecked = document.createElement("div");
	if(this.checked){
		this.checkChecked.className = ComponentCheckBox._checkBoxClass.CHECKED;	
	}
	else{
		this.checkChecked.className = ComponentCheckBox._checkBoxClass.NOTCHECKED;
	}

	this.label = document.createElement("div");
	this.label.className = "label";

	this.label.innerText = this.labelText;

	this.checkChecked.appendChild(this.label);
	buddyCheckbox.appendChild(this.checkChecked);

	this.element = buddyCheckbox;

	this.element.addEventListener(ComponentBase.EventType.CLICK ,this.handleOnClick.bind(this),false);
	/*<div class=buddy-checkbox1>
		<div class=check.Checked/>
			<div class="label">checkbox label
			</div>
		</div>
	</div>*/
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
	this.checked = checked;
	if(this.checked){
		this.checkChecked.className = ComponentCheckBox._checkBoxClass.CHECKED;		
	}
	else{
		this.checkChecked.className = ComponentCheckBox._checkBoxClass.NOTCHECKED;
	}
	this.fire(ComponentCheckBox.EventType.CHANGE,this.checked);
}

ComponentCheckBox._checkBoxClass = {
	CHECKED:"check.Checked",
	NOTCHECKED:"check.notChecked"
}

ComponentCheckBox.EventType = {
	CHANGE: "CheckBoxChange"
}