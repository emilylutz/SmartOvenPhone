//@module
var CONTROL = require('mobile/control');
var KEYBOARD = require('mobile/keyboard');
var BUTTONS = require('controls/buttons');
var SCROLLER = require('mobile/scroller');
var NUMKEYBOARD = require("numKeyboard.js");

/*STYLES*/
var labelStyle = new Style({ font:"bold 16px Heiti SC", color:"#4d4d4d", horizontal:"center", vertical:"middle" });
var errorStyle = new Style({ font:"11px Heiti SC", color:"red", horizontal:"center", vertical:"middle" });
var whiteLabelStyle = new Style({ font:"16px Heiti SC", color:"white", horizontal:"center", vertical:"middle" });
var menuStyle = new Style({ font:"15px Heiti SC", color:"white", horizontal:"center", vertical:"top" });
var titleStyle = new Style({ font:"bold 24px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var fieldStyle = new Style({ color: '#4d4d4d', font: '15px Heiti SC', horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var fieldHintStyle = new Style({ color: '#aaa', font: "15px Heiti SC", horizontal: 'left', vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5, });
var backStyle = new Style({ font:"20px Heiti SC", color:"White", horizontal:"center", vertical:"top" });
var touchBackStyle = new Style({ font:"20px Heiti SC", color:"#545e5d", horizontal:"center", vertical:"top" });

/*SKINS*/
var menuBackgroundSkin = new Skin({ fill: "#00FFFF" } );
var menuButtonSkin = new Skin({fill: "#CCCCCC" });
var dropDownSkin = new Skin({borders: { left:2, right:2, top:2, bottom:2 }, fill: "white", stroke: 'gray'});
var nameInputSkin = new Skin({ borders: { left:2, right:2, top:2, bottom:2 }, fill: "white", stroke: 'gray', left: 5, right: 5, top: 5, bottom: 5});
var whiteSkin = new Skin({fill:"white"});
var greenS = new Skin({fill:"#6ebab5"});
var greenSBottom = new Skin({stroke:"#777777",borders: { left:0, right:0, top:0, bottom:2} , fill:"#6ebab5"});
var greenSTop = new Skin({stroke:"#777777",borders: { left:0, right:0, top:2, bottom:0} , fill:"#6ebab5"});
var greenBorderS = new Skin({borders: { left:1, right:1, top:1, bottom:1 }, fill: "white", stroke: '#6ebab5', left: 5, right: 5, top: 5, bottom: 5});
var greyS = new Skin({fill:"gray"});
var buttonPressedS = new Skin({fill:"7d9694"});
var keyboardButtonStyle = new Style({font:"20px Heiti SC", color:"black", align:"left"});
var doneMessage = ""
var clearS = new Skin({fill:""});

var DMAdded = 0;
var info = new Object();
info.action = 'Bake';
info.temperature = 0;
info.hour = 0;
info.minutes = 0;
info.menu = false;
finalSchedName = ""
var schedSteps = new Object();
schedSteps.steps = [];
schedSteps.hrs = [];
schedSteps.mins = [];
schedSteps.temps = [];
schedSteps.size = 0;
schedSteps.normSize = 0;
function schedStepsRemove(stepNum){
/**
	x = stepNum - 1;
	for (i =0;i<=x;i++) {
		if (i ==x) {
		 for (j = i; j<schedSteps.normSize-1;j++) {
		 	schedSteps.hrs[j] = schedSteps.hrs[j+1]
		 	schedSteps.hrs[j] = schedSteps.mins[j+1]
		 	schedSteps. **/
			 
		
}
Handler.bind("/getNewSchedInfo", Object.create(Behavior.prototype, {
//@line 27
	onInvoke: { value: function( handler, message ){
			message.responseText = JSON.stringify({steps:schedSteps,name:finalSchedName,temperature:info.temperature,hrs: info.hour, min: info.minutes});
			message.status = 200;
			}}
}));

var step = 1;

/******** Input name field ******/
var nameFieldBG = new Picture({top:0, url:"buttons/schedule_inputField.png"});      
var nameField = Container.template(function($) { return { 
  width: 220, height:29, contents: [
    Scroller($, { 
      left: 4, right: 4, top: 4, bottom: 4, active: true, name:"scroller", 
      behavior: Object.create(CONTROL.FieldScrollerBehavior.prototype), clip: true, contents: [
        Label($, { 
          left: 0, top: 0, bottom: 0, skin: THEME.fieldLabelSkin, style: fieldStyle, anchor: 'NAME',
          editable: true, string: $.name, name:"nameLabel",
         	behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
         		onEdited: { value: function(label){
         			var data = this.data;
              data.name = label.string;
              finalSchedName = data.name
              label.container.hint.visible = ( data.name.length == 0 );	
         		}},
            onKeyDown: { value:  function(label, key, repeat, ticks) {
                    if (key) {
                        var code = key.charCodeAt(0);
                        if (code == 3 /* enter */ || code == 13 /* return */) {
                            KEYBOARD.hide();
                            subContainer.focus()
							
                        } else {
                            CONTROL.FieldLabelBehavior.prototype.onKeyDown.call(this, label, key, repeat, ticks);
                        }
                    }
                }   
            }
         	}),
         }),
         Label($, {
   			 	left:4, right:4, top:4, bottom:4, style:fieldHintStyle, string:"Schedule name", name:"hint",
   			behavior: Object.create( CONTROL.FieldLabelBehavior.prototype, {
         		onTouchEnded: {value: function(label) {
         			KEYBOARD.hide()
         			subContainer.focus()
         			
         		}}})
         })
      ]
    })
  ]
}});

/******** Drop down action field ******/
var actionField = Container.template(function($) { return { 
  top:0, width: 113, active:true, contents: [
        Label($, { 
          skin: THEME.fieldLabelSkin, style: fieldStyle, anchor: 'NAME', left:16, width:113, 
          string: $.name, active:true, name: "lbl",
         	behavior: Object.create(Behavior.prototype, {
         		onTouchBegan: {value: function(label) {
         			KEYBOARD.hide()
         			subContainer.focus()}},
         		onTouchEnded: { value: function(container, id, x,  y, ticks) {
	        	    if (info.menu == false) {
	        	    	actionContainer.add(dropDownMenu);
	        	    	aFieldArrow.url = "buttons/schedule_uparrow.png";
	        	    	info.menu = true;
	        	    } else {
	        	    	actionContainer.remove(dropDownMenu);
	        	    	aFieldArrow.url = "buttons/schedule_downarrow.png";
	        	    	info.menu = false;
	        	    }
	        	}}
         	}),
         })
  ]
}});

var DropDownMenu = Container.template(function($) { return {
	width: 100, top:8, active: true,
	contents: [
	           Column($, {left: 5, right: 5, top: 5, bottom: 5, 
	        	   contents: [
			           Label($, {style:menuStyle, active: true, string:'Bake',
			        	    behavior: Object.create(Behavior.prototype, {
			        	    	onTouchEnded: { value: function(container, id, x,  y, ticks) {
				        	    	   actionContainer.remove(dropDownMenu);
				        	    	   aFieldArrow.url = "buttons/schedule_downarrow.png";
				        	    	   aField.lbl.string = "Bake";
				        	    	   info.action = "Bake";
			        				   info.menu = false;
			        	    	}}
			        	    })     	    	
			           }),
			           Label($, {style:menuStyle, active: true, string:'Broil', 
			        	    behavior: Object.create(Behavior.prototype, {
			        	    	onTouchEnded: { value: function(container, id, x,  y, ticks) {		        			   	   
			        			   	   actionContainer.remove(dropDownMenu);
			        			   	   aFieldArrow.url = "buttons/schedule_downarrow.png";
			        			   	   aField.lbl.string = "Broil";
			        			   	   info.action = "Broil";
			        			   	   info.menu = false;
			        	    	}}
			        	    })   
			           }),			           
		           ]
	           })
          ]

}});

/* name */
var nField = new nameField({name: ""});
var nameContainer = new Container({left:10, top:15, contents:[nField, nameFieldBG]});

/* action */
var aField = new actionField({ name: "Action" });
var aFieldBG = new Picture({top:0, url:"buttons/schedule_actiondropdown.png"});
var aFieldArrow = new Picture({top:8, left: 94, url:"buttons/schedule_downarrow.png"});
var dropDownBG = new Picture({top:0, url:"buttons/schedule_dropdown.png"});
var dropDownMenu = new Container({left:0, right:0, top:28, contents:[dropDownBG, new DropDownMenu()]});
var actionContainer = new Container({top:10, height:65, contents:[aFieldBG, aField, aFieldArrow]});

/* temperature */
var temperatureField = new Label({top:0, style: fieldStyle, string: ""});
var tFieldNameLabel = new Label({style: labelStyle, string:"Temp"});
var tFieldDegreeLabel = new Label({style: labelStyle, string:"°F"});
var tFieldBG = new Picture({top:0, url:"buttons/schedule_tinyField.png"});
var tField = new Container({top:0, left:5, contents:[tFieldBG, temperatureField]});
var tFieldContainer = new Line({top:0, contents:[tFieldNameLabel, tField, tFieldDegreeLabel]});
var tempButton = new NUMKEYBOARD.openKeyboardTemplate({top:0,bottom:0,height:23,width:100,label:temperatureField, max:3, scroller:mainScroller, fieldHint: "Temperature",
	contents:[]});
var temperatureContainer = new Container({top:10, left:12, contents:[tempButton, tFieldContainer]});

tempActionContainer = new Line({left:0, top:10, contents:[actionContainer, temperatureContainer]});

/* hour */
var hourLabel = new Label({ left:2, style: fieldStyle, string: "Hours"});
var hourField = new Label({ style: fieldStyle, string: "00"});
var hourFieldBG = new Picture({top:0, url:"buttons/schedule_timeField.png"});
var hourFieldContainer = new Container({contents:[hourFieldBG, hourField]});	
var hourButton = new NUMKEYBOARD.openKeyboardTemplate({action:"/addSched",top:0,bottom:0,height:23,width:40, label:hourField, max:2, scroller:mainScroller, 
	contents:[]});
var hContainer = new Container({left: 6,contents:[hourButton, hourFieldContainer]});
var hourContainer = new Line({left:0,top:0, right:2, contents:[hContainer, hourLabel]});

/* minutes */
var minuteLabel = new Label({ left:0,style: fieldStyle, string: "Minutes"});
var minuteField = new Label({ style: fieldStyle, string: "00"});
var minuteFieldBG = new Picture({top:0, url:"buttons/schedule_timeField.png"});
var minuteFieldContainer = new Container({contents:[minuteFieldBG, minuteField]});	
var minuteButton = new NUMKEYBOARD.openKeyboardTemplate({action:"/addSched",top:0,bottom:0,height:23,width:40, label:minuteField, max:2, scroller:mainScroller, 
	contents:[]});
var minContainer = new Container({left:0, contents:[minuteButton, minuteFieldContainer]});
var minuteContainer = new Line({top:0, left:0, contents:[minContainer, minuteLabel]});

/* time */
var timeLabel = new Label({ left:3, style: labelStyle, string: "Time"});
var timeContainer = new Line({left:0, top:62, bottom:10, contents:[timeLabel, hourContainer, minuteContainer]});

/* addButton */
function updateInfo() {
	info.temperature = temperatureField.string;
	info.hour = hourField.string;
	info.minutes = minuteField.string;
};
function reinitialize() {
	info.action = 'Bake';
	info.temperature = 0;
	info.hour = 0;
	info.minutes = 0;
    info.menu = false;
    stepLabel.string = "Step " + step;
    aField.lbl.string = "Action";
    temperatureField.string = "";
    hourField.string = "00";
    minuteField.string = "00";
};
function checkError() {
	if (aField.lbl.string == "Action" | temperatureField.string == "0" | hourField.string > 12 | minuteField.string > 60 | (hourField.string == "00" & minuteField.string == "00")) {
		return false;
	} else return true;
};
var errorMessage = new Label({top:10, string:"**Please make sure all fields are filled correctly.**", style:errorStyle});
var hasError = false;
var info1 = "";
var stepBox = Container.template(function($) { return {
	contents: [
		new Line({left:0, bottom:10, width:291, 
			contents:[
				new Container({ left:0,
					contents:[
						new Picture({top:0, url:"buttons/schedule_stepbox.png"}),
						new Line({top:0, left:8, height:57,
							contents:[
								new Label({left:6, string:$.step, style:titleStyle}),
								new Column({left:20, contents: [$.label1, $.label2]})
							]
						})
					]
				})
			]
		})
	]
}});
var addButtonTemplate = BUTTONS.Button.template(function($){ return{
        skin:greenS, width:74, height: 27, contents: [
                new Label({string:"Add", name:"addLabel", style: whiteLabelStyle})
        ],
        behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
                onTouchBegan: { value:  function(button){
					addButtonBG.url = "buttons/schedule_addbutton2.png";
					button.skin = buttonPressedS;
				}},
				onTouchEnded: { value:  function(button){
					addButtonBG.url = "buttons/schedule_addbutton.png";
					button.skin = greenS;
					if (checkError()) {
						if (hasError) {
							mainFieldContainer.remove(errorMessage);
						}
						updateInfo();
                    	info1 = "Step " + step + ": " + info.action + " at " + info.temperature + "°F";
                    	info1Label = new Label({top:5, left:0, bottom:0, height:20, string:info1, style: fieldStyle});
                    	var info2 = "for " + info.hour + " hours and " + info.minutes + " minutes";
                    	info2Label = new Label({top:0, left:0, bottom:5, height:20, string:info2, style: fieldStyle});
                    	var data = {
      						label1: info1Label,
      						label2: info2Label,
      						step: step
   						};
                     	schedSteps.steps[schedSteps.size] = info1;
                    	schedSteps.temps[schedSteps.normSize] = info.temperature
                    	schedSteps.hrs[schedSteps.normSize] = info.hour
                    	schedSteps.mins[schedSteps.normSize] = info.minutes
                    	schedSteps.normSize += 1
                    	schedSteps.size += 1;
                    	schedSteps.steps[schedSteps.size] = info2;
                    	schedSteps.size += 1;
                    	instructionContainer.col.add(new stepBox(data));
                    	mainFieldContainer.remove(fieldContainer);
                    	step++;
                    	reinitialize();
    					mainFieldContainer.add(fieldContainer);
    				} else {
    					if (!hasError) {
    						mainFieldContainer.add(errorMessage);
    						hasError = true;
    					}
    				}
				}}
        })
}});
var addButtonBG = new Picture({top:0, url:"buttons/schedule_addbutton.png"});
var addButton = new addButtonTemplate();
var addButtonContainer = new Container({top:0, contents:[addButtonBG, new addButtonTemplate()]});
var addButtonContainerTemplate = Container.template(function($) { return {
	top:7, contents:[addButtonContainer]
}});

/* field container template */
var stepLabel = new Label({top:-3, string:"Step 1", style:whiteLabelStyle});
var tempActionTimeContainer = new Container({top:0, contents:[timeContainer, tempActionContainer]});
var fieldContainerTemplate = Container.template(function($) { return {
	name:"fieldContainer", top:10, active: true,
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
					onTouchBegan: { value:  function(button) {
						KEYBOARD.hide()
						subContainer.focus()
						}}}),
	contents: [
		new Column({top:0, contents:[stepLabel, tempActionTimeContainer, new addButtonContainerTemplate()]})
	]
}});
var fieldContainerBG = new Picture({top:0, url:"buttons/schedule_addstepbox.png"});
var fieldContainer = new Container({top:10, contents:[fieldContainerBG, new fieldContainerTemplate()]});

/* instruction container*/
var instructionContainerTemplate = Container.template(function($) { return {
	top:10, contents:[new Column({name:"col"})]
}});
var instructionContainer = new instructionContainerTemplate();

/* doneButton */
var noStepsErrorMessage = new Label({top:10, string:"**Please add a step to your schedule before saving.", style:errorStyle});
var noNameErrorMessage = new Label({top:10, string:"**Please name your schedule before saving.", style:errorStyle});
var hasDoneError = false;
var doneButtonTemplate = BUTTONS.Button.template(function($){ return{
        height: 40,left:0,right:0,top:420, skin:greenSTop,
        contents: [
                new Label({string:"Done", name:"doneLabel", style: backStyle})
        ],
        behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
                onTouchBegan: { value:  function(button){
					button.skin = greyS;
				}},
				onTouchEnded: { value:  function(button){
					button.skin = greenS;
					if (step == 1) {
						if (!hasDoneError) {
							subContainer.add(noStepsErrorMessage);
							hasDoneError = true;
						}
					} else {
						if (hasDoneError) {
							subContainer.remove(doneErrorMessage);
						}
						doneMessage = new Label({top:20, string:"Your schedule has been saved!", style: labelStyle});
                		subContainer.add(doneMessage);
                		DMAdded = 1;
					
					}
					application.invoke(new Message("/receiveNewSchedInfo"));
					application.invoke(new Message("/addToSaved"));
					
				}}
        })
}});

var doneButton = new doneButtonTemplate();
var doneButtonContainerTemplate = Container.template(function($) { return {
	top:10, left:0, right:0,skin:greenS, contents:[doneButton]
}});
var mainFieldContainer = new Column({name:"subCol", contents:[fieldContainer, instructionContainer], active:true});

var scroller = SCROLLER.VerticalScroller.template(function($){ return{
	contents:$.contents
}});

var subContainer = new Column({top:60,left:0, right:0, skin:clearS, active:true,
	behavior: Behavior({
		onTouchEnded: function(content){
			KEYBOARD.hide();
			content.focus();
		}
	}),
	contents:[
		nameContainer,
		mainFieldContainer,
	]
});

Handler.bind("/cleanAddSched", Object.create(Behavior.prototype, {
//@line 27
	onInvoke: { value: function( handler, message ){
		nameContainer.remove(nField);
		nField = nameField({name: ""});
		nameContainer.add(nField);
		stepLabel.string = "Step 1"
				if (DMAdded) {
			subContainer.remove(doneMessage);
			}
		mainFieldContainer.remove(instructionContainer);
		instructionContainer = new instructionContainerTemplate();
		mainFieldContainer.add(instructionContainer);
		schedSteps = new Object();
		schedSteps.steps = [];
		schedSteps.size = 0;
		schedSteps.normSize = 0;
		step = 1;
		info = new Object();
		info.action = 'Bake';
		info.temperature = 0;
		info.hour = 0;
		info.minutes = 0;
		info.menu = false;
		//AddNeedClean = 0;
			}}
}));

Handler.bind("/addSchedOpen", Behavior({
	onInvoke: function(handler, message){
		mainScroller.coordinates = {right:0, left:0,top:-50};
	},
}));
Handler.bind("/addSched", Behavior({
	onInvoke: function(handler, message){
		mainScroller.coordinates = {right:0,left:0,top:0};
	},
}));
var mainScroller = new scroller({contents:[subContainer]});
var mainScrollerCon = new Container({contents:[mainScroller],top:0,left:0,right:0,bottom:40,clip:true});
exports.mainContainer = new Container.template(function($) { return {top:0, left:0, right:0, bottom:0, skin:whiteSkin, 
	contents:[	new doneButtonTemplate({}),	mainScrollerCon, new Container({height: 60, left:0, right:0, skin:greenSBottom, top:0,
			contents: [ new Label({ left:5, string: "❮ Back", active:true,editable:true,style: backStyle,
				behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
					onTap: { value:  function(button) {
						application.invoke(new Message("/backToSchedMain"));
						button.style= backStyle
						}},
					onTouchBegan: { value: function(button) {
							button.style = touchBackStyle
							}}
					})}), new Label({left:80,string: "New Schedule", style: titleStyle}) ]
		}) ]}});
	
