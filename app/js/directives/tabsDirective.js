var tabsDirective = angular.module('directive.tabs', []);

tabsDirective.directive('tabs', function() {
    return {
      restrict: 'E',
      transclude: true,
      controller: function($scope, $element, $timeout) {
        var panes = $scope.panes = [];
        var current = null;

        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;      
          current = pane;
          $timeout(function() {
            $scope.$broadcast('update');
          }, 1);
        };
 
        this.addPane = function(pane) {
          if (panes.length === 0) $scope.select(pane);
          if (pane.paneDefault) $scope.select(pane);
          panes.push(pane);
        };
        
        $scope.prev = function() {
          current.prev();
        }
        $scope.next = function() {
          current.next();
        }
      },
      template:
      '<div class="row">' +
        '<div class="span12" style="padding-bottom: 20px;">' +
          '<div class="span4 btn-group">' +
           '<button class="btn btn-primary" ng-click="prev()">Prev</button>' +
           '<button class="btn btn-primary" ng-click="next()">Next</button>' +
          '</div>' +
          '<div class="span2">' +
            '<h4>{{date.format("MMMM YYYY")}}</h4>' +
          '</div>' +
          '<div class="span5 btn-group" style="text-align: right">' +
            '<button ng-repeat="pane in panes" class="btn" ng-class="{active:pane.selected}" ng-click="select(pane)">{{pane.paneTitle}}</button>' +            
          '</div>' +     
        '</div>' +
        '<div class="span12">' + 
          '<div class="tab-content" ng-transclude></div>' +
        '</div>' +
      '</div>',
      replace: true
    };
  }).
  directive('pane', [function() {
    return {
      require: '^tabs',
      restrict: 'E',
      transclude: true,
      template:
        '<div class="tab-pane" style="height: {{paneHeight}}px" ng-class="{active: selected}" ng-transclude>' +
        '</div>',
      replace: true,
      scope: {
        paneTitle: '@',
        paneDefault: '@',
        panePrev: '@',
        paneNext: '@'        
      },
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
        var docHeight,
            panePos,
            paneHeight;
        panePos = angular.element('.tab-content').position();
        docHeight = $(window).height();
        paneHeight = docHeight - panePos.top - 20;
        scope.paneHeight = paneHeight;
        
        $scope = scope.$parent;
        
        scope.prev = attrs.panePrev ? function() {
          $scope.$eval(attrs.panePrev);
        } : angular.noop;
        scope.next = attrs.paneNext ? function() {
          $scope.$eval(attrs.paneNext);
        } : angular.noop;
        
        angular.element(window).bind('resize', function() {
          panePos = angular.element('.tab-content').position();
          docHeight = $(window).height();
          
          paneHeight = docHeight - panePos.top - 20;
          scope.paneHeight = paneHeight;   
          
          console.log(panePos, docHeight, paneHeight);
          scope.$digest();
        });
      }
    };
  }]);
  