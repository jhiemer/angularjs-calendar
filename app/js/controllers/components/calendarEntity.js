define(function () {
	"use strict";
	//TODO - wofür ist das überhaupt? Hat vorher ein globales Objkect "calendar" angelegt
	function CalendarEntityFactory() {
		return {
			"kind":"calendar#event",
			"etag":"etag",
			"id":"23232323",
			"created":new Date(),
			"updated":new Date(),
			"summary":"This is the summary",
			"description":"This is the description",
			"location":"This is the location",
			"visibility":"default",
			"colorId":"red",
			"creator":{
				"id":"m8doslak",
				"email":"a@b.com",
				"displayName":"Lordnox",
				"self":true
			},
			"organizer":{
				"id":"m8doslak",
				"email":"a@b.com",
				"displayName":"Lordnox",
				"self":true
			},
			"start":{
				"date":new Date(),
				"dateTime":new Date(),
				"timeZone":"CET"
			},
			"end":{
				"date":new Date(),
				"dateTime":new Date(),
				"timeZone":"CET"
			},
			"endTimeUnspecified":false,
			"recurrence":"no",
			"recurringEventId":"",
			"originalStartTime":{
				"date":new Date(),
				"dateTime":new Date(),
				"timeZone":"CET"
			},
			"iCalUID":"282mmn23nc923",
			"sequence":0,
			"attendees":[
				{
					"id":"m8doslak",
					"email":"a@b.com",
					"displayName":"Lordnox",
					"self":true,
					"organizer":true,
					"resource":false,
					"optional":true,
					"responseStatus":"none",
					"comment":"(bow)",
					"additionalGuests":0}
			],
			"attendeesOmitted":false,
			"anyoneCanAddSelf":false,
			"guestsCanInviteOthers":false,
			"guestsCanModify":false,
			"guestsCanSeeOtherGuests":false,
			"locked":true,
			"reminders":{
				"useDefault":true,
				"overrides":[
					{
						"method":"E-Mail",
						"minutes":15
					}
				]
			}
		}


	}

	return CalendarEntityFactory;
});

