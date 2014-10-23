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