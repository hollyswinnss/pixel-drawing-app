//Displays and handles the colour palette.
function ColourPalette() {
	// Expanded list of cute pastel colors
	this.colours = [
		"#000000", // black
		"#FFFFFF", // white
		"#FFB3BA", // light pink
		"#FFDFBA", // light peach
		"#FFFFBA", // light yellow
		"#BAFFC9", // light green
		"#BAE1FF", // light blue
		"#E1BAFF", // light purple
		"#FFB3E6", // light magenta
		"#C9C9C9", // light gray
		"#FF6B6B", // coral
		"#4ECDC4", // turquoise
		"#45B7D1", // sky blue
		"#96CEB4", // mint green
		"#FECA57", // warm yellow
		"#FF9FF3", // bright pink
		"#54A0FF", // royal blue
		"#5F27CD"  // deep purple
	];
	
	//make the start colour be black
	this.selectedColour = this.colours[0];

	var self = this;

	var colourClick = function() {
		//remove the old selected class from all swatches
		var allSwatches = selectAll('.color-swatch');
		for (var i = 0; i < allSwatches.length; i++) {
			allSwatches[i].removeClass('selected');
		}

		//get the new colour from the data attribute
		var c = this.attribute('data-color');

		//set the selected colour and fill and stroke
		self.selectedColour = c;
		fill(c);
		stroke(c);

		//add selected class to clicked swatch
		this.addClass('selected');
	}

	//load in the colours
	this.loadColours = function() {
		//set the fill and stroke properties to be black at the start
		fill(this.colours[0]);
		stroke(this.colours[0]);

		//get the color grid container
		var colorGrid = select('.color-grid');

		//for each colour create a new div for the color swatch
		for (var i = 0; i < this.colours.length; i++) {
			var colorValue = this.colours[i];

			//create color swatch element
			var colourSwatch = createDiv('');
			colourSwatch.addClass('color-swatch');
			colourSwatch.attribute('data-color', colorValue);
			colourSwatch.style('background-color', colorValue);
			
			//add to color grid
			colorGrid.child(colourSwatch);
			
			//add click handler
			colourSwatch.mouseClicked(colourClick);
		}

		//select the first swatch by default
		var firstSwatch = select('.color-swatch');
		if (firstSwatch) {
			firstSwatch.addClass('selected');
		}
	};
	
	//call the loadColours function now it is declared
	this.loadColours();
}