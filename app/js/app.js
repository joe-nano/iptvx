/*

   Copyright 2018   Jan Kammerath

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

var app = {
	componentList: [],

	/*
		Initialises the app and loads components
		@param 		componentList 	array with components to load
	*/
	init: function(newComponentList){
		/* store the intialised list locally for further use */
		app.componentList = newComponentList;

		for(var c=0;c<app.componentList.length;c++){
			app.loadComponent(app.componentList[c]);
		}

		/*
			Attach generic key handler
		*/
		$(window).keydown(function(event){
			app.handleKey(event.keyCode);
		});
	},

	/*
		Handles keyboard key down events
	*/
	handleKey: function(keyCode){
		/* check if the key toggles a component */
		var toggleComponent = app.getComponentByToggleKey(keyCode);
		if(toggleComponent != null){
			/* toggle this component */
			if(app.isFunction(toggleComponent.toggle)){
				/* this component supports toggle */
				toggleComponent.toggle();
			}
		}
	},

	/*
		Get the component by its toggle key
		@param 		keyCode 	toggle key code to get component for
		@return 				returns component or null if none matches
	*/
	getComponentByToggleKey: function(keyCode){
		var result = null;

		for(var c=0; c<app.componentList.length; c++){
			var componentObject = window[app.componentList[c]];
			if('toggleKey' in componentObject){
				if(componentObject.toggleKey == keyCode){
					/* this component matches the key code */
					result = componentObject;
				}
			}
		}

		return result;
	},

	/*
		Loads and initialises a component of the app
		@param 		appName 		name of the component to load
	*/
	loadComponent: function(componentName){
		/* define the name of the component */
		var componentUrl = "js/" + componentName + ".js";

		/* load the script for the component */
		var script = document.createElement('script');
		script.src = componentUrl;

		/* add initialiser for the script */
		script.onload = function(){
			/* check if an initialiser is present */
			if(app.isFunction(window[componentName].init)){
				/* call the initialiser */
				window[componentName].init();
			}
		};

		/* append script to body */
		document.body.appendChild(script);
	},

	/*
		Determines whether the parameter is a function or not
		@param 		functionReference 	reference to test if a function
		@return 						true when ref a function, otherwise false
	*/
	isFunction: function(functionReference){
		var result = false;

		if(Object.prototype.toString.call(functionReference) == '[object Function]'){
			result = true;
		}

		return result;
	}
}