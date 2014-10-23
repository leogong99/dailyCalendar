describe("Set up one overlaping dailyEvent block which contains one event {start: 50, end: 80}", function() {
	'use strict'
	var eventsBlock = {};
	eventsBlock = new dayCal.overlapEventsBlock();
	var dailyEvent = new dayCal.dailyEvent();
	dailyEvent.setDailyEvent({
		start: 50,
		end: 80
	});
	eventsBlock.addEvent(dailyEvent);
	beforeEach(function() {

	});

	//Normal case
	it("Add second overlap dailyEvent as {start: 60, end: 180}", function() {
		var dailyEvent = new dayCal.dailyEvent();
		dailyEvent.setDailyEvent({
			start: 60,
			end: 180
		});
		eventsBlock.addEvent(dailyEvent);
		expect(eventsBlock.overlaps.events[0].start).toEqual(60);
		expect(eventsBlock.overlaps.events[0].end).toEqual(180);
	});

	it("Add third overlap dailyEvent as {start: 100, end: 180}", function() {
		var dailyEvent = new dayCal.dailyEvent();
		dailyEvent.setDailyEvent({
			start: 60,
			end: 180
		});
		eventsBlock.addEvent(dailyEvent);
		dailyEvent.setDailyEvent({
			start: 100,
			end: 180
		});
		eventsBlock.addEvent(dailyEvent);
		expect(eventsBlock.events[1].start).toEqual(100);
		expect(eventsBlock.events[1].end).toEqual(180);
	});
});

/* more testing */