/**
 * DEFAULT VALUES
 **/

var DEBUG             = false,
    SECONDS_OF_A_DAY  = 24*60*60,
    SECONDS_MINIMAL   = 60 * 30,
    SLOT_WIDTH        = 10,
    PLUNKER           = true,
    DEFAULT_TIMEOUT   = 0,
    CALENDAR_HEIGHT   = 1030;

/**
 * HELPER METHODS
 **/

/**
 * Building an array based on the provided size
 **/
var buildArray = function(size) {
  var array = [];
  for(var index = 0; index < size; index ++) {
    array.push(index);
  }    
  return array;
};

/**
 * Definition of the number of hours a day has
 **/
var MOMENT_HOURS = buildArray(24).map(function(index) {
      return moment().hours(index).minutes(0).seconds(0)
});

/**
 * A simple sorting algorithm, which takes care, that all events are
 * ordered in the right way, before they get slotted and colspanified.
 **/
var sortEventByStartAndDuration = function sortEventByStartAndDuration(a, b) {
  return a.start.diff(b.start) || b.end.diff(b.start) - a.end.diff(a.start);
};

/**
 * This filter verifies, whether an event lies between the start and 
 * end date supplied in the function
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
 * colspanify is an function for the whole day event column, which 
 * caculates based on the number of the provided days and events
 * how much tds an event should cover
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
 * Slotfactory creates different slots for events. That is necessary as they may overlap
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
 * method get-start-of-week will return the first day of the week for any given day
 **/
var getStartOfWeek = function startOfWeek(day) {
  // check if we have the monday-sunday problem
  if(day.clone().day(1).diff(date)>0)
    day.add('days', -7);
  return day.day(1);
};

/**
 * method hover-selektor will add and remove a klass for a selector when a given element is hovered
 * This is currently implemented with the jQuery add and removeClass methods, which should be
 * removed in later iterations.
 **/
var hoverSelektor = function(element, selector, klass) {
  return element.hover( function() { angular.element(selector).addClass(klass); }
                      , function() { angular.element(selector).removeClass(klass); }
  );
};

/**
 * filter for verification if an item already exists in a provided 
 * list or not. 
 **/
var uniqueFilter = function(item, index, list) {
  return list.indexOf(item, index + 1) < 0;
};

/**
 * DIRECTIVE SERVICES
 **/

var calendarDirective = angular.module('ui.bootstrap.calendar', []);

/**
 *  eventEmitter
 **/
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
 * eventService
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

/**
 * DISPLAY DIRECTIVES
 **/

/**
 * wholeDayView is the container for wholeDayEvents
 **/
calendarDirective.directive('wholeDayView', ['eventService', function(eventService) {
  return {
    templateUrl: 'template/wholeDayView.html',
    scope: {
      days: '=days'
    },
    link: function(scope, iElement, iAttr) {    
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
 * wholeDayEvents
 **/
calendarDirective.directive('wholeDayEvent', [function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'template/wholeDayEvent.html',
    scope: {
      event: '='
    },
    link: function(scope, iElement, iAttr) {
      if(scope.event !== undefined && scope.event.id)
        hoverSelektor(iElement, '[name=bs-calendar-event-id-' + scope.event.id + ']', 'hovered');
    }
  };
}]);

/**
 * hourViewEventContainer is the container for standard events
 */
calendarDirective.directive('hourViewEventContainer', ['$compile', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'template/hourViewEventContainer.html' ,
    scope: {
      events: '='
    },
    link: function(scope, iElement, iAttr) {                
    }
  };
}]);

/**
 * hourViewEvent displays an normal (not wholeDay) event
 */
calendarDirective.directive('hourViewEvent', [function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'template/hourViewEvent.html',
    link: function postLink(scope, iElement, iAttrs) {
      var day           = scope.$parent.$parent.day,
          start_seconds = Math.max(scope.event.start.diff(day.clone().sod(), 'seconds'), 0),
          end_seconds   = Math.max((Math.min(scope.event.end.diff(day.clone().sod(), 'seconds'), SECONDS_OF_A_DAY) - start_seconds), SECONDS_MINIMAL);
                       
      var height = CALENDAR_HEIGHT / SECONDS_OF_A_DAY;
      iElement.css({
        left    : ((scope.event.slot - 1) * SLOT_WIDTH) + '%',
        top     : start_seconds * height,
        height  : end_seconds   * height
      });
        
      if(scope.event.id)
        hoverSelektor(iElement, '[name=bs-calendar-event-id-' + scope.event.id + ']', 'hovered');
                
    }
  };
}]);

/**
 * hourViewNow displays the timeline of the current time.
 **/
calendarDirective.directive('hourViewNow', ['$compile', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'template/hourViewNow.html',
    link: function(scope, iElement, iAttribute) {
      var day           = scope.$parent.day,
          display       = 'none',
          now           = moment(),
          start_seconds = Math.max(now.diff(day.clone().sod(), 'seconds'), 0);

        var height        = CALENDAR_HEIGHT / SECONDS_OF_A_DAY;
        if (!day.sod().diff(now.sod()))
          display = 'block';

        var nowDiv = angular.element(iElement.children("div.bs-tg-now"));
        nowDiv.css({
            display : display,
            position: 'absolute',
            top     : start_seconds * height
        });          
    }
  };
}]);
   
/**
 * Common day view perspective
 */
calendarDirective.directive('calendarDayView', ['eventService', function(eventService) {
  return {
    templateUrl: 'template/calendarDayView.html',
    link: function postLink(scope, iElement, iAttr) {
      var attributes = scope.$parent.attributes,
          numberOfDays  = parseInt(attributes.days, 10)   || 1,
          offset        = parseInt(attributes.offset, 10) || 0,
          date          = moment(scope.$parent.date),
          now           = scope.$parent.now;
      
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

/**
 * Factory for the creation of days need in the calendar
 **/
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
 * Month view perspective
 */
calendarDirective.directive('calendarMonthView', ['daysOfWeek', function(daysOfWeek) {
  return {
    templateUrl: 'template/calendarMonthView.html',
    link: function(scope, iElement, iAttr) {
      var attributes = scope.$parent.attributes,       
          numberOfDays  = 7,
          numberOfWeeks = 5,
          offset        = parseInt(attributes.offset, 10) || 0,
          date          = moment(scope.$parent.date);
          
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
 * Base calendar directive.
 **/
calendarDirective.directive('calendar', ['eventService', function(eventService) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="calendar table-container" ng-switch on="view">' 
    +           '<div ng-switch-when="day" calendar-day-view></div>'
    +           '<div ng-switch-when="month" calendar-month-view></div>'
    +           '<div ng-switch-when="events" calendar-events-view></div>'
    +         '</div>',
    scope: {
      sourceEvents      : '=eventsource',
      controlDate       : '=date',
      calendarId        : '@calendarId',
      confstartOfWeek   : '@startOfWeek',
      confTimeFormat    : '@timeFormat',
      confNumberOfDays  : '@numberOfDays',
      confNumberOfWeeks : '@numberOfWeeks',
      confDayLabelFormat: '@dayLabelFormat',
    },
    link: function(scope, iElement, iAttrs) {
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