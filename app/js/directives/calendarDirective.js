/**
 * Changes:
 *  - Added a relative div tag, because Firefox did not display grid properly.
 *  - Removed spacing in line 615.
 *  - Added debug flags to all elements.
 *
 * buildArray(size)
 * Helper method for array creation. Needs to be checked regarding
 * functionality in IE.
 * @TODO optimize for speed?
 */
var buildArray = function(size) {
  var array = [];
  for(var index = 0; index < size; index ++) {
    array.push(index);
  }    
  return array;
};

/**
 *  This is an angularJS Calendar directive
 *
 *  Possible parameters:
 *
 *  <calendar
 *    events      what events should be visible in this calendar
 *    view        "hour", "day", "week", "month", "events"
 *    date        date of the calendar, if week or month - view is
 *                used, it will be changed to the first day of the week
 *    format-day  format of the labels for each day [default: 'dddd' or 'dddd, t\\he Do of MMMM']
 *    format-time format of the time label in the hour or events view [default: 'H a']
 *    format-week format of the weeknumber for the week view [default: 'wo']
 *    format ???
 *
 */
var DEBUG             = false
  , SECONDS_OF_A_DAY  = 24*60*60
  , SECONDS_MINIMAL   = 60 * 30
  , SLOT_WIDTH        = 10
  , PLUNKER           = true
  , DEFAULT_TIMEOUT   = 0
  , CALENDAR_HEIGHT   = 1030
  , MOMENT_HOURS      = buildArray(24).map(function(index) {
      return moment().hours(index).minutes(0).seconds(0)
    });

/**
 * sortEventByStartAndDuration(a, b)
 * Simple Sorting function, which sort the values a and b by start time,
 */
var sortEventByStartAndDuration = function sortEventByStartAndDuration(a, b) {
  return a.start.diff(b.start) || b.end.diff(b.start) - a.end.diff(a.start);
};

/**
 * filterEventDuringDateRangeFactory(start, end) [function(event)]
 * The filter addresses four different case:
 * - event starts after item but item ends after event starts
 * - item starts after event but also item start after event ends
 * - item starts before event ends and also item ends after event start
 * - the item-event does not take place during the event-event
 */
var filterEventDuringDateRangeFactory = function(start, end) {
  return function(event) {
    if(event.start.diff(start) < 0 && event.end.diff(start) > 0)
      return true;
    if(event.start.diff(start) > 0 && event.end.diff(start) < 0)
      return true;
    if(event.end.diff(start) > 0 && event.start.diff(end) < 0)
      return true;
    return false;
  };
};

/**
 * Verify if event is longer than 24hours.
 */
var isWholeDayEvent = function(event) {    
  return event.end.diff(event.start, 'seconds') >= SECONDS_OF_A_DAY;
};

/**
 * colspanFactory()
 * 
 */
var colspanify = function colspanify(days, events) {
  // return empty array if no days or events were given
  if((!days.length) || (!events.length)) return;
  var result    = []
    , slots     = []
    , length    = days.length
    , slot      = 0
    , firstDay  = days[0].clone().sod()
    
  events.map(function(event) {
    var eventStart  = event.start.clone().sod()
      , eventEnd    = event.end.clone().sod()
      , slot        = event.slot - 1
        
    current = slots[slot] = (slot in result ? slots[slot] : 0);

    result[slot] = result[slot] || []

    var start  = Math.min(length, Math.max(0, eventStart.diff(firstDay, 'days')))
      , colspan = Math.max(1, Math.min(length - start, eventEnd.diff(eventStart, 'days') + 1))

    if(slots[slot] < start) {
      result[slot][result[slot].length] = {
        colspan: start - slots[slot]
      }
    }
    
    if (DEBUG)
      console.log('Calendar-Colspanify: ', colspan);
      
    slots[slot]   = start + colspan
    result[slot][result[slot].length]  = {
      colspan : colspan
    , event   : event
    }
  });
    
  return result.map(function(list, index) {
    if(slots[index] < length)
      list[list.length] = {
        colspan: length - slots[index]
      }
    return list;
  })
};


/**
 * slotFactory()
 * Slotfactory creates different slots for events. That is necessary as they may overlapp
 * regarding start and end time. Before using slotFactory it is necessary to order the
 * list of events regarding time and length.
 */
var slotFactory = function(property) {
  return function slotify(item, index, list) {
    var slots = list.slice(0, index)
      .filter(filterEventDuringDateRangeFactory(item.start, item.end))
      .map(function(event) {
        return event[property];
      })
      .filter(uniqueFilter)
      .sort();
    var slot = slots
      .reduce(function(result, item, index) {
        return !result && (item !== index + 1) ? index + 1 : result;
      }, undefined);
    item[property] = slot || slots.length + 1;
    return item;
  };
};

var timeout = function(scope, fn, timeout) {
  // check if scope is set
  if(typeof scope === "function") {
    timeout = fn;
    fn      = scope;
    scope   = null;
  }
  var apply = (function(scope) {
    if(scope) return function(fn, args) {
      scope.$apply(function() {
        fn.apply(self, args);
      });
    }
    return function(fn, args) {
      fn.apply(self, args);
    }
  })(scope)

  return (function(timeout) {
    var triggered = null;
    return function() {
      var args = Array.prototype.slice.call(arguments)
        , self = this;
      if(triggered)
        clearTimeout(triggered);
      triggered = setTimeout(function() {
        triggered = null;
        apply(fn, args);
      }, timeout);
    };
  })(timeout || DEFAULT_TIMEOUT);
};

/**
 *  method get-start-of-week will return the first day of the week for any given day
 *
 *  @param date day
 *  @return date
 **/
var getStartOfWeek = function startOfWeek(day) {
  // check if we have the monday-sunday problem
  if(day.clone().day(1).diff(date)>0)
    day.add('days', -7);
  return day.day(1);
};

/**
 *  method hover-selektor will add and remove a klass for a selector when a given element is hovered
 *
 *  @param DOM-elment element
 *  @param string selector
 *  @param string css-class
 *  @return element
 **/
var hoverSelektor = function(element, selector, klass) {
  return element.hover( function() { angular.element(selector).addClass(klass); }
                      , function() { angular.element(selector).removeClass(klass); }
  );
};

/**
 *  unique-filter function to be applied with Array::filter
 **/
var uniqueFilter = function(item, index, list) {
  return list.indexOf(item, index + 1) < 0;
};

var calendarDirective = angular.module('directive.calendar', []);

calendarDirective.factory('eventEmitter', function() {
  var events    = {}
    , seperator = '::'

  var getEvent = function(event) {
    return events[event] || (events[event] = [])
  }

  var Event = function(event) { this.event = event; }

  var eventEmitter = {
    create      : function(event) {
      return new Event(event || 'event');
    }
  , publish     : function(event) {
      var args  = Array.prototype.slice.call(arguments, 1)
        , Event = getEvent(event)
        , self  = this;
      Event.map(function(handler) {
        setTimeout(function() {
          handler.apply(self, args);
        }, DEFAULT_TIMEOUT);
      });
    }
  , subscribe   : function(event, handler) {
      var Event = getEvent(event);
      Event[Event.length] = handler;
    }
  , unsubscribe : function(event, handler) {
      var Event = getEvent(event);
      Event.filter(function(item) {
        return item !== handler;
      });
    }
  , clear       : function(event) {
      events[event] = [];
    }
  }

  var curry = function(method) {
    return function(event) {
      var args = [[this.event, seperator, event].join('')].concat(Array.prototype.slice.call(arguments, 1));
      eventEmitter[method].apply(this, args);
    };
  };

  Object.keys(eventEmitter).map(function(method) {
    Event.prototype[method] = curry(method);
  });

  return eventEmitter;
});

/**
 * Calendar Event Service
 */
calendarDirective.factory('eventService', ['eventEmitter', function(eventEmitter) {
    var rawDayEvents    = []
      , dayEvents       = {}
      , wholeDayEvents  = []
      , slotter         = slotFactory('slot')

    var addItemToList   = function(item, list) {
    if (list.indexOf(item) !== -1)
      return true;
      
		if (!eventExists(item, list)) {
      var length = list.length;
      //slotter(item, length, list)
      list[length] = item;
		}
  };
		
	var eventExists = function(item, list) {
		var result = false;
		angular.forEach(list, function(event) {
			if (item.id === event.id)
				result = true;
		});    
		return result;
	};
  var EventEmitter = eventEmitter.create('eventService');

  var eventService = {
    storeEvents : function(events) {
      if(!events) return;
      dayEvents = {};
      events.map(function (event) {
        addItemToList(event, isWholeDayEvent(event) ?
          wholeDayEvents : rawDayEvents);
      });
      [rawDayEvents, wholeDayEvents].map(eventService.sortEvents);
      [rawDayEvents, wholeDayEvents].map(function(list) { list.map(slotter); });
      EventEmitter.publish('stored', events.length);
    }
  , appendEvents : function(events) {
      EventEmitter.publish('store', events);
    }
  , sortEvents : function(events) {
      return events.sort(sortEventByStartAndDuration);
    }
  , getDayEvents : function(day) {
      var index = day.clone().sod()
      if(!dayEvents[index]) {
        var filter = filterEventDuringDateRangeFactory(day.clone().sod(), day.clone().eod())
        dayEvents[index] = rawDayEvents.filter(filter);
      }
      return dayEvents[index];
    }
  , getWholeDayEvents : function(days) {
      return wholeDayEvents;
    }
  };

  EventEmitter.subscribe('store', eventService.storeEvents)

  return eventService;
}]);

calendarDirective.directive('wholeDayEvent', [function() {
  return {
    restrict: 'E'
  , replace: true
  , template: '<div name="bs-calendar-event-id-{{event.id}}" class="bs-calendar-whole-day-event-container evt-{{event.id}}">'
    +           '<div class="bs-calendar-whole-day-event-container-inner color-{{event.colorId}}">'
    +             '<div class="bs-calendar-whole-day-event-content">{{event.summary}}</div>'
    +           '</div>'
    +         '</div>'
  , scope: {
      event: '='
    }
  , link: function(scope, iElement, iAttr) {
      if(scope.event !== undefined && scope.event.id)
        hoverSelektor(iElement, '[name=bs-calendar-event-id-' + scope.event.id + ']', 'hovered');
    }
  };
}]);

calendarDirective.directive('hourViewNow', ['$compile', function($compile) {
  return {
    restrict: 'E'
  , replace: true
  , template: '<div>' +
                '<div class="bs-tg-now"></div>' +
              '</div>'
  , link: function(scope, iElement, iAttribute) {
      var day           = scope.$parent.day
        , display       = 'none'
        , now           = moment()
        , start_seconds = Math.max(now.diff(day.clone().sod(), 'seconds'), 0);

        var height        = CALENDAR_HEIGHT / SECONDS_OF_A_DAY;
        if (!day.sod().diff(now.sod()))
          display = 'block';

        var nowDiv = angular.element(iElement.children("div.bs-tg-now"));
        nowDiv.css({
            display : display
          , position: 'absolute'
          , top     : start_seconds * height
        });          
    }
  };
}]);

/**
 *
 */
calendarDirective.directive('hourViewEvent', [function() {
  return {
    restrict: 'E'
  , replace: true
  , template: '<div name="bs-calendar-event-id-{{event.id}}" class="bs-calendar-event-container">'
    +           '<div class="bs-calendar-event-content color-{{event.colorId}}">'
    +             '<div class="bs-calendar-event-header">{{event.summary}}</div>'
    +             '<div class="bs-calendar-event-body">{{event.description}}</div>'
    +           '</div>'
    +         '</div>'
  , link: function postLink(scope, iElement, iAttrs) {
      var day           = scope.$parent.$parent.day
        , start_seconds = Math.max(scope.event.start.diff(day.clone().sod(), 'seconds'), 0)
        , end_seconds   = Math.max((Math.min(scope.event.end.diff(day.clone().sod(), 'seconds'), SECONDS_OF_A_DAY) - start_seconds), SECONDS_MINIMAL)
      ;
                       
      var height = CALENDAR_HEIGHT / SECONDS_OF_A_DAY;
      iElement.css({
        left    : ((scope.event.slot - 1) * SLOT_WIDTH) + '%'
      , top     : start_seconds * height
      , height  : end_seconds   * height
      });
        
      if(scope.event.id)
        hoverSelektor(iElement, '[name=bs-calendar-event-id-' + scope.event.id + ']', 'hovered');
                
    }
  };
}]);

/**
 * dayViewCalendarDay is responsible for the creation of the basic table layout. It allows
 * to create dynamic day-ranges to create calendars with ranges between 1 and 7 days.
 */
calendarDirective.directive('hourViewEventContainer', ['$compile', function($compile) {
  return {
    restrict: 'E'
  , replace: true
  , template: '<div class="bs-calendar-tg-day">'
    +           '<hour-view-now></hour-view-now>'
    +           '<hour-view-event ng-repeat="event in events"></hour-view-event>'
    +         '</div>'
  , scope: {
    events: '='
  }
  , link: function(scope, iElement, iAttr) {                
    }
  };
}]);

calendarDirective.directive('wholeDayView', ['eventService', function(eventService) {
  return {
    template: '<tr class="bs-calendar-header">'
    +           '<td class="bs-calendar-weeknumber">'
    +             '<div>{{days[0].format($parent.labelFormat)}}</div>'
    +           '</td>'
    +           '<td ng-repeat="day in days">'
    +             '<div class="bs-calendar-daylabel">{{day.format($parent.$parent.dayLabelFormat)}}</div>'
    +           '</td>'
    +         '</tr>'
    +         '<tr class="bs-calendar-whole-day-event-list" ng-repeat="wholeDayEvent in eventlist">'
    +           '<td class="bs-calendar-whole-day-space">&nbsp;</td>'
    +           '<td ng-repeat="event in wholeDayEvent" colspan="{{event.colspan}}">'
    +             '<whole-day-event event="event.event"></whole-day-event>'
    +           '</td>'
    +         '</tr>'
  , scope: {
      days: '=days'
    }
  , link: function(scope, iElement, iAttr) {    
      scope.$watch('days', function() {
        scope.events = eventService.getWholeDayEvents(scope.days);
        scope.eventlist = colspanify(scope.days, scope.events);
        
        if (DEBUG)
          console.log('Calendar-Whole-Days: ', scope.days);
        
        if (DEBUG)
          console.log('Calendar-Whole-Day-Events: ', scope.eventlist);
      })
    }
  };
  }]);
   
/**
 *
 */
calendarDirective.directive('calendarDayView', ['eventService', function(eventService) {
  return {
    template: '<table class="table bs-calendar day-view">'
    +           '<tbody whole-day-view days="days"></tbody>' 
    +           '<tbody>'
    +             '<tr>'
    +              '<td colspan="{{days.length + 1}}" class="bs-calendar-colwrapper">'
    +               '<div style="position: relative;">'
    +                 '<div class="bs-calendar-spanningwrapper">'
    +                   '<div class="bs-calendar-tg-hourmarkers">'
    +                     '<div class="bs-calendar-tg-markercell" ng-repeat="hour in hours">'
    +                       '<div class="bs-calendar-tg-dualmarker"></div>'
    +                     '</div>'
    +                   '</div>'
    +                 '</div>'
    +                '</div>'
    +              '</td>'
    +             '</tr>'
    +             '<tr>'
    +               '<td class="bs-calendar-tg-hours">'
    +                 '<div class="bs-calendar-tg-hour-inner" ng-repeat="hour in hours">'
    +                   '<div class="bs-calendar-tg-hour-clock">'
    +                     '{{hour.format(timeFormat)}}'
    +                   '</div>'
    +                 '</div>'
    +               '</td>'      
    +               '<td ng-repeat="day in days" class="bs-calendar-tg-day-container" ng-class="{today: ((day.sod().diff(now.sod())!=0) + (numberOfDays > 1)  == 1)}">'  
    +                 '<hour-view-event-container events="day.events"></hour-view-event-container>'
    +               '</td>'
    +             '</tr>'
    +           '</tbody>'
    +         '</table>'
  , link: function postLink(scope, iElement, iAttr) {
      var attributes = scope.$parent.attributes
        , numberOfDays  = parseInt(attributes.days, 10)   || 1
        , offset        = parseInt(attributes.offset, 10) || 0
        , date          = moment(scope.$parent.date)
        , now           = scope.$parent.now;
      
      if (DEBUG)
        console.log('Calendar-Days: ', numberOfDays);
      
      scope.days  = [];
      scope.timeFormat  = attributes.timeFormat           || 'H a';
      scope.hours = MOMENT_HOURS;
        
      var update = timeout(scope, function() {
        var date = scope.$parent.date.clone().add('days', offset);
        scope.days = buildArray(numberOfDays).map(function(index) {
          var day     = date.clone().add('days', index);
          var events  = eventService.getDayEvents(day);
          day.events = events;
          return day;
        });
      });
      scope.$on('calendar-update', update);        
    }
  };
}]);

calendarDirective.factory('daysOfWeek', function() {
  return function(day) {
    var base = day.clone(),
          
        result = [];
    for (var i = 0;i<7; i++) 
      result.push(base.add('days', i).clone());
     
   return result;     
  };
});
/**
 *
 */
calendarDirective.directive('calendarMonthView', ['daysOfWeek', function(daysOfWeek) {
  return {
    template: '<table class="table table-bordered table-striped bs-calendar">' 
    +           '<thead>' 
    +             '<th style="width: 15px">#</th>' 
    +             '<th ng-repeat="day in days">{{day.format("dddd")}}</th>' 
    +           '</thead>' 
    +           '<tbody>'
    +             '<tr ng-repeat="week in weeks">'
    +               '<td class="bs-calendar-month-row">{{week[1]}}</td>' 
    +               '<td ng-repeat="day in daysOfWeek[week[0]]" class="bs-calendar-month-row">{{day.format("DD")}}</td>'
    +             '</tr>' 
    +           '</tbody>'
    +         '</table>'
  , link: function(scope, iElement, iAttr) {
      var attributes = scope.$parent.attributes        
        , numberOfDays  = 7
        , numberOfWeeks = 5
        , offset        = parseInt(attributes.offset, 10) || 0
        , date          = moment(scope.$parent.date);
          
      scope.daysOfWeek = {};
      scope.days = buildArray(numberOfDays).map(function(index) {
          return date.clone().add('days', index);            
      });        
        
      scope.weeks = buildArray(numberOfWeeks).map(function(index) {
        var day = date.clone().add('weeks', index);             
            scope.daysOfWeek[index] = scope.daysOfWeek[index] || daysOfWeek(day);
            return [index, day.format('w')];
      });
    }
  };
}]);
  
/**
 * This is the head of the calendar directive, it will determine
 * what type of calendar is show.
 * The possible views are: day, week, month, events
 * 
 * day-view:
 *  This will show a vertical list of events a specific day
 * week-view:
 *  This is an stretched day view with more than one day
 * month-view: 
 *  This is an stretched view accross n tables under each other
 * events-view:
 *  This is an view, show all upcoming events in an ordered list
 */
calendarDirective.directive('calendar', ['eventService', function(eventService) {
  return {
    restrict: 'E'   
  , replace: true
  , template: '<div class="calendar table-container" ng-switch on="view">' 
    +           '<div ng-switch-when="day" calendar-day-view></div>'
    +           '<div ng-switch-when="month" calendar-month-view></div>'
    +           '<div ng-switch-when="events" calendar-events-view></div>'
    +         '</div>'
  , scope: {
      sourceEvents      : '=eventsource'
    , controlDate       : '=date'
    , calendarId        : '@calendarId'
    , confstartOfWeek   : '@startOfWeek'
    , confTimeFormat    : '@timeFormat'
    , confNumberOfDays  : '@numberOfDays'
    , confNumberOfWeeks : '@numberOfWeeks'
    , confDayLabelFormat: '@dayLabelFormat'
    }
  , link: function(scope, iElement, iAttrs) {
      scope.attributes    = iAttrs;
      scope.timeFormat    = iAttrs.timeFormat                   || 'H a';
      scope.dayLabelFormat= iAttrs.dayLabelFormat               || (scope.startOfWeek ? 'dddd' : 'dddd, t\\he Do');
      scope.labelFormat   = iAttrs.labelFormat                  || 'wo';
      scope.offset        = parseInt(iAttrs.offset, 10)         || 0;
      scope.now           = moment();
      scope.showHours     = scope.numberOfWeeks === 1;
      scope.date          = moment(scope.controlDate);
      scope.weeks         = [];
      scope.timeFormat    = 'HH:mm DD.MM.YYYY';
      scope.view          = iAttrs.view;
        
      setTimeout(function() {
        scope.$broadcast('calendar-update');
      }, 30)
    }
  };
}]);