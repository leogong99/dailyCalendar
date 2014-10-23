/* global dayCal, $:false, */
/**
 * Jing Gong
 * Dairly Event Calendar
 * leogong99@gmail.com
 */
"use strict";

var dayCal = dayCal || {};

dayCal.calendar = function() {
	// Tree object
	this.dailyEventsBlock = [];
};

dayCal.calendar.prototype = {
	/**
	 * Set up meeting tree object.
	 * @param {array} events: meeting object array.
	 * @return {bollean} return true if all the events are valid, otherwise, return false.
	 */
	dailyEventFactory: function(events) {
		if (!$.isArray(events)) {
			return false;
		}

		var i = 0,
			setResult = true,
			newEvent = {},
			eventLength = events.length;

		//Sort events by start time !important
		events.sort(function(event1, event2) {
			return event1.start - event2.start;
		});

		//Loop through events array. Break loop if anyinvalid input.
		for (i = 0; i < eventLength && setResult; i++) {
			newEvent = new dayCal.dailyEvent();
			setResult = newEvent.setDailyEvent(events[i]);
			if (setResult) {
				this.addEvent(newEvent);
			}
		}

		//return result.
		return setResult;
	},
	/**
	 * Find busy block end line.
	 * @param {array} busyBlock : overlapEventsBlock that contains current event objects.
	 * @return {int} busyEnd : latest time of this block.
	 */
	findBusyBlockEnd: function(busyBlock) {
		var busyEnd = busyBlock.end;
		var block = busyBlock;
		while (block !== null) {
			busyEnd = busyEnd > block.end ? busyEnd : block.end;
			block = block.overlaps;
		}
		return busyEnd;
	},
	/**
	 * Add event to the daily meeting object tree.
	 * @param {object} newMeeting: meeting object.
	 */
	addEvent: function(newEvent) {
		var blockLength = this.dailyEventsBlock.length;

		if (blockLength === 0) {
			this.dailyEventsBlock[0] = new dayCal.overlapEventsBlock();
			this.dailyEventsBlock[0].addEvent(newEvent);
			return;
		}

		var busyEnd = this.findBusyBlockEnd(this.dailyEventsBlock[blockLength - 1]);
		// No overlapping, add new block.
		if (newEvent.start >= busyEnd) {
			var newBlock = new dayCal.overlapEventsBlock();
			newBlock.addEvent(newEvent);
			this.dailyEventsBlock.push(newBlock);
		} else {
			//overlapping, add to this block
			this.dailyEventsBlock[blockLength - 1].addEvent(newEvent);
		}
	}
};
/* global dayCal, $:false */

"use strict";
var dayCal = dayCal || {};
/**
 * daily event constructor.
 */
dayCal.dailyEvent = function() {
	//dailyEvent proproties
	//Start time and end time.
	//Each number reprsent a minute.
	this.start = 0;
	this.end = 0;
	this.size = 1;
};

dayCal.dailyEvent.prototype = {
	/**
	 * Set time dailyEvent.
	 * @param {object} evt: dailyEvent object has start time and end time as properties.
	 * @return {bollean} if the evt is not valid return false, otherwise, return true;
	 */
	setDailyEvent: function(evt) {
		// invalid start or end time.
		if (!$.isNumeric(evt.start) || !$.isNumeric(evt.end)) {
			return false;
		}

		// start time is same or bigger than end time
		if (evt.start >= evt.end) {
			return false;
		}

		// if evt end time is between 9 am to 9 pm, return false
		if (evt.start < 0 || evt.end > dayCal.SETTINGS.WORKINGHOUR * 60) {
			return false;
		}

		this.start = evt.start;
		this.end = evt.end;

		return true;
	},

	/**
	 * check if two dailyEvents overlap.
	 * @param {object} evt: dailyEvent object.
	 * @return {bollean} return total dailyEvent time, if the evt is overlap, otherwise, return false.
	 */
	isOverlap: function(evt) {
		//dailyEvent 1 start before dailyEvent 2 but end after evnet 2 start. Overlap
		if (this.start <= evt.start && this.end > evt.start) {
			return true;
		} else if (this.start > evt.start && evt.end > this.start) {
			return true;
		}
		return false;
	}
}
var dayCal = dayCal || {};
dayCal.SETTINGS = new function() {
	"use strict";
	return {
		/** @const */
		STARTTIME: 9,
		/** @const */
		WORKINGHOUR: 12
	};
};
/* global dayCal*/
/**
 * Jing Gong
 * Dairly Event Calendar
 * leogong99@gmail.com
 */

"use strict";

var dayCal = dayCal || {};
/**
 * daily events block constructor.
 */
dayCal.overlapEventsBlock = function() {
	this.start = 0;
	this.end = 0;
	this.events = [];
	this.overSizeEvents = [];
	this.overlaps = null;
};

dayCal.overlapEventsBlock.prototype = {
	/**
	 * get this block event depth
	 * @return {int} depth: number of levels of this block
	 */
	getDepth: function() {
		var block = this;
		var depth = 0;

		// Find block depth.
		while (block !== null) {
			block = block.overlaps;
			depth++;
		}
		return depth;
	},
	/**
	 * Add event to this block. This event has to be overlap at least with one event of this block
	 * @param {object} newEvent: new meeting object.
	 * @param {boolean} isAdded: for event size. After add this event, keep loop and increase the event size.
	 */
	addEvent: function(newEvent, isAdded, root) {
		var busyEvent = new dayCal.dailyEvent();
		var root = root === undefined ? this : root;
		// Busy event.
		busyEvent.setDailyEvent({
			start: this.start,
			end: this.end
		});

		//if this events array is empty, add new event.
		if (this.events.length === 0) {
			this.start = newEvent.start;
			this.end = newEvent.end;
			this.events.push(newEvent);
			return;
		}

		// After add new events, keep looping to find event size.
		if (isAdded) {
			if (!busyEvent.isOverlap(newEvent)) {
				//More space, this event going to be wider
				newEvent.size++;

				if (this.overlaps) {
					this.overlaps.addEvent(newEvent, true, root);
				} else {
					root.overSizeEvents.push(newEvent);
				}
			}
		} else if (busyEvent.isOverlap(newEvent)) {
			//overlap, recursion call to process with next level.
			if (this.overlaps === null) {
				this.overlaps = new dayCal.overlapEventsBlock();
			}
			this.overlaps.addEvent(newEvent, false, root);
		} else {
			// no overlap, find free space, add event in this level.
			this.events.push(newEvent);
			this.end = this.end < newEvent.end ? newEvent.end : this.end;
			this.overlaps.addEvent(newEvent, true, root);
		}
	},

	findOverSizeEventsWidth: function(dayEvent) {
		var i = 0;
		var overlaps = 0;
		var overSizeEventsLength = this.overSizeEvents.length;
		var start = dayEvent.start;
		var end = dayEvent.end;
		var busyEvent = new dayCal.dailyEvent();

		for (i = 0; i < overSizeEventsLength; i++) {
			busyEvent.setDailyEvent({
				start: start,
				end: end
			});
			if (this.overSizeEvents[i].isOverlap(busyEvent)) {
				start = this.overSizeEvents[i].start < start ? this.overSizeEvents[i].start : start;
				end = this.overSizeEvents[i].end > end ? this.overSizeEvents[i].end : end;
				overlaps++;
			}
		}
		return overlaps;
	}
};
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