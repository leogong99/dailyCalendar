describe("Set up dailyEvent object", function() {

	var dailyEventObj = {};

	beforeEach(function() {
		dailyEventObj = new dayCal.dailyEvent();
	});

	//Normal case
	it("return true when giving set dailyEvent as {start: 50, end: 80}", function() {
		expect(dailyEventObj.setDailyEvent({
			start: 50,
			end: 80
		})).toBe(true);
	});

	// Edge case
	it("return true when giving set dailyEvent as {start: 0, end: 80}", function() {
		expect(dailyEventObj.setDailyEvent({
			start: 0,
			end: 80
		})).toBe(true);
	});

	it("return true when giving set dailyEvent as {start: 710, end: 720}", function() {
		expect(dailyEventObj.setDailyEvent({
			start: 710,
			end: 720
		})).toBe(true);
	});

	//Error case
	it("return false when giving set dailyEvent as {start: -10, end: 20}", function() {
		expect(dailyEventObj.setDailyEvent({
			start: -10,
			end: 20
		})).toBe(false);
	});
	it("return false when giving set dailyEvent as {start: 20, end: 721}", function() {
		expect(dailyEventObj.setDailyEvent({
			start: 20,
			end: 721
		})).toBe(false);
	});
	it("return false when giving set dailyEvent as {start: 'ab', end: 20}", function() {
		expect(dailyEventObj.setDailyEvent({
			start: 'ab',
			end: 20
		})).toBe(false);
	});
	it("return false when giving set dailyEvent as {start: null, end: 20}", function() {
		expect(dailyEventObj.setDailyEvent({
			start: null,
			end: 20
		})).toBe(false);
	});
	it("return false when giving set dailyEvent as {start: undefined, end: 20}", function() {
		expect(dailyEventObj.setDailyEvent({
			start: undefined,
			end: 20
		})).toBe(false);
	});
	it("return false when giving set dailyEvent as {start: '', end: 20}", function() {
		expect(dailyEventObj.setDailyEvent({
			start: '',
			end: 20
		})).toBe(false);
	});
	it("return false when giving set dailyEvent as {start: NaN, end: 20}", function() {
		expect(dailyEventObj.setDailyEvent({
			start: NaN,
			end: 20
		})).toBe(false);
	});
	it("return false when giving set dailyEvent as {start: 20, end: 20}", function() {
		expect(dailyEventObj.setDailyEvent({
			start: 20,
			end: 20
		})).toBe(false);
	});
	it("return false when giving set dailyEvent as {start: 720, end: 20}", function() {
		expect(dailyEventObj.setDailyEvent({
			start: 720,
			end: 20
		})).toBe(false);
	});

});

describe("Check if giving dailyEvents overlap current dailyEvent {start: 20, end: 80}", function() {
	var dailyEventObj = {};
	var newdailyEvent = {};
	beforeEach(function() {
		dailyEventObj = new dayCal.dailyEvent();
		newdailyEvent = new dayCal.dailyEvent();
		dailyEventObj.setDailyEvent({
			start: 20,
			end: 80
		});
	});
	//no overlap case
	it("return false when giving dailyEvents {start: 90, end: 150}", function() {
		newdailyEvent.setDailyEvent({
			start: 90,
			end: 150
		});
		expect(dailyEventObj.isOverlap(newdailyEvent)).toBe(false);
	});

	it("return false when giving dailyEvents {start: 0, end: 20}", function() {
		newdailyEvent.setDailyEvent({
			start: 0,
			end: 20
		});
		expect(dailyEventObj.isOverlap(newdailyEvent)).toBe(false);
	});

	//overlap case
	it("return true when giving dailyEvents {start: 0, end: 30}", function() {
		newdailyEvent.setDailyEvent({
			start: 0,
			end: 30
		});
		expect(dailyEventObj.isOverlap(newdailyEvent)).toBe(true);
	});
	it("return true when giving dailyEvents {start: 79, end: 110}", function() {
		newdailyEvent.setDailyEvent({
			start: 0,
			end: 30
		});
		expect(dailyEventObj.isOverlap(newdailyEvent)).toBe(true);
	});
});
/* more testing */