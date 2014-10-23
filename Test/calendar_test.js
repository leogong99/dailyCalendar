describe("Set up daily event tree", function() {

	var myDayCal = {};

	beforeEach(function() {
		myDayCal = new dayCal.calendar();
	});
	//Normal case 
	//Add first event
	it("When give first event as {start: 50, end: 100}", function() {
		myDayCal.dailyEventFactory([{
			start: 50,
			end: 100
		}]);

		expect(myDayCal.dailyEventsBlock[0].events[0].start).toBe(50);
		expect(myDayCal.dailyEventsBlock[0].events[0].end).toBe(100);
	});

	it("When give events as [{start: 50, end: 100}, {start: 150, end: 180}]", function() {
		myDayCal.dailyEventFactory([{
			start: 50,
			end: 100
		}, {
			start: 150,
			end: 180
		}]);

		expect(myDayCal.dailyEventsBlock[0].events[0].start).toBe(50);
		expect(myDayCal.dailyEventsBlock[0].events[0].end).toBe(100);
		expect(myDayCal.dailyEventsBlock[1].events[0].start).toBe(150);
		expect(myDayCal.dailyEventsBlock[1].events[0].end).toBe(180);
	});

	it("When give events as [{start: 50, end: 100}, {start: 60, end: 120}, {start: 150, end: 180}]", function() {

		myDayCal.dailyEventFactory([{
			start: 50,
			end: 100
		}, {
			start: 60,
			end: 120
		}, {
			start: 150,
			end: 180
		}]);

		expect(myDayCal.dailyEventsBlock[0].events[0].start).toBe(50);
		expect(myDayCal.dailyEventsBlock[0].events[0].end).toBe(100);
		expect(myDayCal.dailyEventsBlock[0].overlaps.events[0].start).toBe(60);
		expect(myDayCal.dailyEventsBlock[0].overlaps.events[0].end).toBe(120);
		expect(myDayCal.dailyEventsBlock[1].events[0].start).toBe(150);
		expect(myDayCal.dailyEventsBlock[1].events[0].end).toBe(180);
	});

	it("When give events as [{start: 50, end: 100}, {start: 60, end: 120}, {start: 80, end: 160}, {start: 150, end: 180}]", function() {
		myDayCal.dailyEventFactory([{
			start: 50,
			end: 100
		}, {
			start: 60,
			end: 120
		}, {
			start: 80,
			end: 160
		}, {
			start: 150,
			end: 180
		}]);

		expect(myDayCal.dailyEventsBlock[0].events[0].start).toBe(50);
		expect(myDayCal.dailyEventsBlock[0].events[0].end).toBe(100);
		expect(myDayCal.dailyEventsBlock[0].overlaps.events[0].start).toBe(60);
		expect(myDayCal.dailyEventsBlock[0].overlaps.events[0].end).toBe(120);
		expect(myDayCal.dailyEventsBlock[0].overlaps.overlaps.events[0].start).toBe(80);
		expect(myDayCal.dailyEventsBlock[0].overlaps.overlaps.events[0].end).toBe(160);
		expect(myDayCal.dailyEventsBlock[0].events[1].start).toBe(150);
		expect(myDayCal.dailyEventsBlock[0].events[1].end).toBe(180);
		expect(myDayCal.dailyEventsBlock[0].events[1].size).toBe(2);
	});

	it("When give events as [{start: 50, end: 100}, {start: 60, end: 120}, {start: 80, end: 160}, {start: 100, end: 180}, {start: 170, end: 300}]", function() {
		myDayCal.dailyEventFactory([{
			start: 50,
			end: 100
		}, {
			start: 60,
			end: 120
		}, {
			start: 80,
			end: 160
		}, {
			start: 100,
			end: 180
		}, {
			start: 170,
			end: 300
		}]);
		expect(myDayCal.dailyEventsBlock[0].overlaps.events[1].start).toBe(170);
		expect(myDayCal.dailyEventsBlock[0].overlaps.events[1].end).toBe(300);
		expect(myDayCal.dailyEventsBlock[0].overlaps.events[1].size).toBe(2);
	});
	it("When give events as [{start: 50, end: 100}, {start: 60, end: 120}, {start: 80, end: 160}, {start: 90, end: 170}, {start: 100, end: 180}, {start: 170, end: 300}]", function() {
		myDayCal.dailyEventFactory([{
			start: 50,
			end: 100
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
			start: 170,
			end: 300
		}]);
		expect(myDayCal.dailyEventsBlock[0].overlaps.events[1].start).toBe(170);
		expect(myDayCal.dailyEventsBlock[0].overlaps.events[1].end).toBe(300);
		expect(myDayCal.dailyEventsBlock[0].overlaps.events[1].size).toBe(3);
	});
	it("When give events as [{start: 50, end: 100}, {start: 60, end: 120}, {start: 80, end: 160}, {start: 90, end: 170}, {start: 100, end: 180}, {start: 170, end: 300}, {start: 190, end: 210}]", function() {
		myDayCal.dailyEventFactory([{
			start: 60,
			end: 120
		}, {
			start: 50,
			end: 100
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
			start: 170,
			end: 300
		}, {
			start: 190,
			end: 210
		}]);
		expect(myDayCal.dailyEventsBlock[0].overlaps.events[1].start).toBe(170);
		expect(myDayCal.dailyEventsBlock[0].overlaps.events[1].end).toBe(300);
		expect(myDayCal.dailyEventsBlock[0].overlaps.events[1].size).toBe(3);
		expect(myDayCal.dailyEventsBlock[0].events[2].start).toBe(190);
		expect(myDayCal.dailyEventsBlock[0].events[2].end).toBe(210);
		expect(myDayCal.dailyEventsBlock[0].events[2].size).toBe(1);
	});
});
/* more testing */