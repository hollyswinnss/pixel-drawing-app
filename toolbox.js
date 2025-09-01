//container object for storing the tools. Functions to add new tools and select a tool
function Toolbox() {

	var self = this;

	this.tools = [];
	this.selectedTool = null;

	var toolbarItemClick = function() {
		//remove selected class from all tools
		var items = selectAll(".toolbox-button");
		for (var i = 0; i < items.length; i++) {
			items[i].removeClass('selected');
		}

		var toolName = this.attribute('data-tool');
		self.selectTool(toolName);

		//call loadPixels to make sure most recent changes are saved to pixel array
		loadPixels();
	}

	//add a new tool icon to the html page
	var addToolIcon = function(icon, name) {
		var toolsContainer = select('.tools-container');
		
		var toolButton = createDiv('<img src="' + icon + '" alt="' + name + '">');
		toolButton.addClass('toolbox-button');
		toolButton.attribute('data-tool', name);
		toolButton.attribute('title', name); // Add tooltip with tool name
		
		toolsContainer.child(toolButton);
		toolButton.mouseClicked(toolbarItemClick);
	};

	//add a tool to the tools array
	this.addTool = function(tool) {
		//check that the object tool has an icon and a name
		if (!tool.hasOwnProperty("icon") || !tool.hasOwnProperty("name")) {
			alert("make sure your tool has both a name and an icon");
		}
		this.tools.push(tool);
		addToolIcon(tool.icon, tool.name);
		//if no tool is selected (ie. none have been added so far)
		//make this tool the selected one.
		if (this.selectedTool == null) {
			this.selectTool(tool.name);
		}
	};

	this.selectTool = function(toolName) {
		//search through the tools for one that's name matches toolName
		for (var i = 0; i < this.tools.length; i++) {
			if (this.tools[i].name == toolName) {
				//if the tool has an unselectTool method run it.
				if (this.selectedTool != null && this.selectedTool.hasOwnProperty("unselectTool")) {
					this.selectedTool.unselectTool();
				}
				
				//select the tool and highlight it
				this.selectedTool = this.tools[i];
				
				// Update button selection
				var allButtons = selectAll('.toolbox-button');
				for (var j = 0; j < allButtons.length; j++) {
					allButtons[j].removeClass('selected');
				}
				
				var selectedButton = select('.toolbox-button[data-tool="' + toolName + '"]');
				if (selectedButton) {
					selectedButton.addClass('selected');
				}

				//if the tool has an options area. Populate it now.
				if (this.selectedTool.hasOwnProperty("populateOptions")) {
					this.selectedTool.populateOptions();
				}
			}
		}
	};
}