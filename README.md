handlebarApp
============

Project seed with Handlebarjs, sass and grunt.

## Install
- Install Node
- Setup Ruby and sass
- Run command 'npm install' under project folder.
- If you have any problems for installation, you can still view result. there is zip file for output folder. unzip it under project folder.

## Build
- Run command 'grunt' under project folder.

## Unit Test
- Run command 'grunt' or 'grunt jasmine'

## Project Requirement
	Puzzle Materials
	Given a set of events, render the events on a single day calendar (similar to Outlook, Calendar.app, and Google Calendar). There are several properties of the layout:

	1. No events may visually overlap.
	2. If two events collide in time, they must have the same width.
	3. An event should utilize the maximum width available, but constraint 2) takes precedence over this constraint.

	Each event is represented by a JS object with a start and end attribute. The value of these attributes is the number of minutes since 9am. So {start:30, end:90) represents an event from 9:30am to 10:30am. The events should be rendered in a container that is 620px wide (600px + 10px padding on the left/right) and 720px (the day will end at 9pm). The styling of the events should match the attached screenshot.

	You may structure your code however you like, but you must implement the following function in the global namespace. The function takes in an array of events and will lay out the events according to the above description.

	function layOutDay(events) {}
	This function will be invoked from the console for testing purposes. If it cannot be invoked, the submission will be rejected.

	In your submission, please implement the calendar with the following input:

	[ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];

	A screenshot of the expected output is attached.

## Overview
This project is built with MVC Design pattern. There is a public function layOutDay(events) can be invoked from outside.

## Browser compatibility:
	Test with browerstack
	IE 8+,
	Firefox 3.6+
	Safari 4.0+
	Chrome 14+
	Opera 10.6+
	iOS 3.0+
	Android 2.2+

## library:
	jQuery.1.11.1.js //for IE8.

## Settings:
	DayCalSetting.js
	In this file, user could reset day start time and working hours. default set to 9am and 12 working hours.

## Models:
	All models are defined as module design pattern.
	All Methods are defined as prototype so when a new object created, they are smaller. This will save some memory, but it may be slower to access those methods than defined as internal methods.


	DailyEvent is the event object. OverlapEventsBlock is block that contains all the events those overlap with each other. There is no other meeting will be overlap with any meeting within this block. Calendar has array of overlap event blocks.

	Keys:
	1. Sort input events first.
	2. All events are separated by block.
	3. In each block, events are arranged by levels. All the events in one level will be displayed in one column. Some of events may be wider, if other event has more overlap event then those events. This information is store as size of event.

## Controller and View:
	This project using handlebar for html templates. There is only one page which contains two components. Those templates are pre-compiled during the build. Each component could contain handlebar template, sass file and custom helper.

Limitation and improvements:
	1. Can't add a single new meeting without repainting all the events again.
	2. More Unit testing cases can be added. ex: error input.
	3. No error messages when there is invalid input. Invalid input will not cause js error.
	4. Bootstrap, handlebar.js, requireJS, SASS or Angularjs can be used for further development.
	5. Responsive design for mobile devices.
	6. Web accessibility.
	7. Add app.json for project structure setup so grunt.js can read this json file to precompile template.


