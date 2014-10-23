/* global dayCal, $:false, setUpCal:false */

/**
 * Jing Gong
 * Dairly Event Calendar
 * leogong99@gmail.com
 */

var setUpCal = (function() {
	"use strict";
	var _cal = {
		eventBlockHeight: 0,
		times: [],
		events: []
	};

	// compile our template
	var template = JST['index'];
	Handlebars.registerPartial('eventBlockContainer', JST['eventBlockContainer']);
	Handlebars.registerPartial('timeLineList', JST['timeLineList']);

	/**
	 * Initialize the app. Display time column and event column.
	 */
	var _init = function() {
		// Build new UI
		_buildTimeColumn();

	};

	/**
	 * Display time column, depends on constant variable defined in dayCalSetting.js
	 * Default day start time is 9am and end time is 9pm.
	 */
	var _buildTimeColumn = function() {
		var i = 0;
		var timeSlots = [];
		var time = 0;
		//AM or PM
		var hourSuffix = 'AM';

		//Loop through the working hour.
		for (i = 0; i <= dayCal.SETTINGS.WORKINGHOUR; i++) {

			time = i + dayCal.SETTINGS.STARTTIME;
			if (time >= 12) {
				hourSuffix = 'PM';
			}

			//Morning or afternoon
			time = time > 12 ? time - 12 : time;
			_cal.times.push({
				time: time + ':00 ',
				ampm: hourSuffix
			});

			// Don't add time off half hour slot.
			if (i != dayCal.SETTINGS.WORKINGHOUR) {
				_cal.times.push({
					time: time + ':30 ',
					ampm: ''
				});
			}
		}
	};

	/**
	 * build one block html string.
	 * @param {tree} eventBlock: event block contains all events overlap each other.
	 * @return {string} event block html string.
	 */
	var _buildBlockHTML = function(eventBlock) {
		var blockHtml = '';
		var block = eventBlock;
		var i = 0;
		var length = 0;
		var blockDepth = 0;
		var currentDepth = 0;
		var eventWidth = 0;
		var oversizeWidth = 1;
		var oversizeOverlap = 1;

		blockDepth = block.getDepth();

		// Each event width.
		eventWidth = 1 / blockDepth;

		//for each level of block
		while (block !== null) {
			currentDepth++;
			length = block.events.length;

			//loop through all the nodes at this level.
			for (i = 0; i < length; i++) {
				oversizeWidth = block.events[i].size;
				if (oversizeWidth > 1) {
					oversizeOverlap = eventBlock.findOverSizeEventsWidth(block.events[i]);
					if (oversizeOverlap > 1) {
						oversizeWidth = oversizeWidth / oversizeOverlap;
					}

				}
				_cal.events.push({
					top: block.events[i].start + 'px',
					left: (currentDepth - 1) * eventWidth * 100 + '%',
					width: eventWidth * 100 * oversizeWidth + '%',
					height: block.events[i].end - block.events[i].start + 'px',
					title: 'Sample Event',
					location: 'Sample Location'
				})

			}
			//go deeper.
			block = block.overlaps;
		}
		_cal.eventBlockHeight = dayCal.SETTINGS.WORKINGHOUR * 60 + 'px';
	};

	/**
	 * Initialize the app. Display time column, event column and events.
	 * @param {array} events: event array.
	 */
	var _redrawEvents = function(events) {
		_cal.datas = new dayCal.calendar();
		// Set meeting object
		_cal.datas.dailyEventFactory(events);

		//Display meetings.
		_displayEvents();
	};

	/**
	 * Display all events.
	 */
	var _displayEvents = function() {
		var i = 0;
		var length = _cal.datas.dailyEventsBlock.length;
		var block = {};
		var blockHtml = '';

		// display all blocks.
		for (i = 0; i < length; i++) {
			block = _cal.datas.dailyEventsBlock[i];
			blockHtml += _buildBlockHTML(block);
		}
	};
	//public open API call.
	return function(events) {
		_cal = {
			eventBlockHeight: 0,
			times: [],
			events: []
		};
		_buildTimeColumn();
		_redrawEvents(events);
		$('#content').empty().html(template(_cal))
	};

	//Setup time column and event column.
	_init();
})();


//crazy testing
/*layOutDay([{
	start: 50,
	end: 100
}, {
	start: 60,
	end: 120
}, {
	start: 60,
	end: 120
}, {
	start: 80,
	end: 160
}, {
	start: 90,
	end: 170
}, {
	start: 100,
	end: 180
}, {
	start: 150,
	end: 160
}, {
	start: 170,
	end: 300
}, {
	start: 470,
	end: 500
}]);
*/
//Default input
setUpCal([{
	start: 30,
	end: 150
}, {
	start: 540,
	end: 600
}, {
	start: 560,
	end: 620
}, {
	start: 610,
	end: 670
}]);