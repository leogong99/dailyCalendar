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