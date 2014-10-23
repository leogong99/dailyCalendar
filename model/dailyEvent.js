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