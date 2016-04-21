function TimeDurationDirective() {
    function postLink(scope, element, attr, ngModelCtrl) {
    	scope.TimeText=function(date) {
    		h=date.getHours();
    		m=date.getMinutes();
    		return ((h<10)?'0':'')+h+':'+((m<10)?'0':'')+m;
    	}
        ngModelCtrl.$render = function() {
            scope.time = (ngModelCtrl.$viewValue);
            if (typeof attr.step == 'undefined')
                attr.step = 6e4;
            else
                attr.step = parseFloat(attr.step);
            oldTimeStamp = scope.time.getTime();
            newTimeStamp = Math.round(oldTimeStamp / attr.step) * attr.step
            scope.time = new Date(newTimeStamp)
            scope.initTimeText=scope.TimeText(scope.time)
                //create timesteps
            scope.steps = [];
            for (var ms = 0; ms < 864e5; ms = ms + attr.step) {

                newStep = angular.copy(scope.time)
                h = Math.floor(ms / (36e5));
                m = (ms % (36e5) / (6e4))
                newStep.setHours(h, m)
                scope.steps.push(newStep);
            }
        }
        scope.$watch('time', function(newValue, oldValue, scope) {
            ngModelCtrl.$setViewValue(newValue);
        });
        //end 2way binding
    }
    return {
        restrict: 'E',
        require: 'ngModel',
        template: '<md-select placeholder="{{initTimeText}}" ng-model="time"><md-option ng-value="step" ng-repeat="step in steps">{{TimeText(step)}}</md-option></md-select>',
        link: postLink
    }
}
angular
    .module('timepicker', ['ngMaterial'])
    .directive('timepicker', TimeDurationDirective);
