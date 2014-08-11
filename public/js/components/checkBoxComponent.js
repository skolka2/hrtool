var ComponentCheckBox = function(labelText,checked){
	this.super = ComponentBase;
	this.super.prototype.constructor.apply(this);
	this.labelText =  "DefaultText";
	this.checked = false;

	if(labelText != null && typeof labelText != 'undefined'){
		this.labelText = labelText;
	}
	if(checked != null && typeof checked != 'undefined'){
		this.checked = checked;
	}
}

ComponentCheckBox.prototype = new ComponentBase();
ComponentCheckBox.prototype.constructor = ComponentCheckBox;

ComponentCheckBox.prototype.createDom = function(){
	var buddyCheckbox = this.helper.dom.createElement("<div></div>");	
	buddyCheckbox.className =  "buddy-checkbox";

	this.checkChecked = this.helper.dom.createElement("<div></div>");
	if(this.checked){
		this.checkChecked.className = ComponentCheckBox.checkBoxClass.CHECKED;	
	}
	else{
		this.checkChecked.className = ComponentCheckBox.checkBoxClass.NOTCHECKED;
	}
	this.label = this.helper.dom.createElement("<div></div>");
	this.label.className = "label";

	this.label.innerText = this.labelText;

	this.checkChecked.appendChild(this.label);
	buddyCheckbox.appendChild(this.checkChecked);

	this.element = buddyCheckbox;

	this.handleOnClick = this.handleOnClick.bind(this);
	this.setChecked = this.setChecked.bind(this);

	this.element.addEventListener(ComponentBase.EventType.CLICK ,this.handleOnClick,false);
	this.listen(ComponentCheckBox.EventType.CHANGE,this,this,this.setChecked);
	/*<div class=buddy-checkbox>
		<div class=check.Checked/>
			<div class="label">checkbox label
			</div>
		</div>
	</div>*/
}

ComponentCheckBox.prototype.handleOnClick = function(){
	this.fire("CheckBoxChange",!this.checked);
}

ComponentCheckBox.prototype.setCheckBoxTittle = function(tittle){
	this.label.innerText = tittle;
}

ComponentCheckBox.prototype.setChecked = function(checked){
	this.checked = checked;
	if(this.checked){
		this.checkChecked.className = ComponentCheckBox.checkBoxClass.CHECKED;		
	}
	else{
		this.checkChecked.className = ComponentCheckBox.checkBoxClass.NOTCHECKED;
	}
}

ComponentCheckBox.checkBoxClass = {
	CHECKED:"check.Checked",
	NOTCHECKED:"check.notChecked"
}
ComponentCheckBox.EventType = {
	CHANGE:"CheckBoxChange"
}
