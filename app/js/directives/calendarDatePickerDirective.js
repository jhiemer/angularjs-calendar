var datePickerDirective = angular.module('directive.datePicker', []);

var buildArray = function(size) {
	var array = [];
	for(var index = 0; index < size; index ++) {
		array.push(index);
	}
	return array;
};

datePickerDirective.factory('daysOfWeek', function() {
	return function(day) {
		var base = day.clone();
		return [
			base.clone(),
			base.add('days', 1).clone(),
			base.add('days', 1).clone(),
			base.add('days', 1).clone(),
			base.add('days', 1).clone(),
			base.add('days', 1).clone(),
			base.add('days', 1).clone()
		];
	};
});

datePickerDirective.directive('ngDatePicker', ['daysOfWeek', function(daysOfWeek) {
	return {
		restrict: 'E',
		scope: {},
		template: '<table class="table table-bordered table-striped bs-calendar-popup-month">' 
		+           '<thead>'
		+             '<tr>'
		+               '<th><a href="" ng-click="pageClick(-1)"><i class="icon-arrow-left"></i></a></th>'
		+               '<th colspan="6">{{month.format(monthLabelFormat)}}</th>'
		+               '<th><a href="" ng-click="pageClick(1)"><i class="icon-arrow-right"></i></a></th>'
		+             '</tr>'
		+             '<tr>'
		+               '<th style="width: 15px">#</th>' 
		+               '<th ng-repeat="day in days">{{day.format(dayLabelFormat)}}</th>' 
		+             '</tr>'
		+           '</thead>' 
		+           '<tbody>'
		+             '<tr ng-repeat="week in weeks">'
		+               '<td class="weeks">{{week[1]}}</td>' 
		+               '<td ng-repeat="day in daysOfWeek[week[0]]">'
		+                 '<a href="" ng-click="selectDateClick(day)">{{day.format(dayFormat)}}</a>'
		+               '</td>'
		+             '</tr>' 
		+           '</tbody>'
		+         '</table>',
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				post: function postLink(scope, iElement, iAttrs, controller) { 
					var numberOfDays  = 7,
							date          = moment();
					scope.monthLabelFormat = 'MMMM - YYYY';
					scope.dayLabelFormat = 'ddd';
					scope.dayFormat = 'DD';
					scope.rows = 4;
					scope.moment = moment;
					scope.startingDay = moment().day(1);
					scope.daysOfWeek    = {};
					
					scope.selectDateClick = function(day) { 
						console.log('selectDateClick', day); 
					};
					
					scope.pageClick = function(index) {
						scope.startingDay.add('weeks', index * 4);
						updateWeeks();
					};
					
					var cleanDaysOfWeek = function() {
						Object.keys(scope.daysOfWeek);
					};
					
					var updateWeeks = function() {
						scope.month = scope.startingDay;
						scope.weeks = buildArray(scope.rows).map(function(index) {
							var day     = scope.startingDay.clone().add('weeks', index),
									current = parseInt(day.format('YYYYww'));
							scope.daysOfWeek[current] = scope.daysOfWeek[current] || daysOfWeek(day);
							cleanDaysOfWeek();
							return [current, day.format('w')];
						});
					};

					$(iElement).bind('mousewheel', function(event) {
						var delta = event.originalEvent.wheelDelta / 120;
						if(delta > 0) 
							scope.startingDay.add('weeks', -1);
						else 
							scope.startingDay.add('weeks', 1);
						updateWeeks();
						scope.$digest();
					});
					
					scope.$watch(scope.startingDay, updateWeeks);
					scope.days = buildArray(numberOfDays).map(function(index) {
						return date.clone().add('days', index);            
					});
				}
			};
		}
	};
}]);