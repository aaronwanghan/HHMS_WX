var SERVER_PATH = '//192.168.0.76'

var app = angular.module("myApp",['chart.js','ngRoute'],function($httpProvider){
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
});

app.config(function($routeProvider,$locationProvider,ChartJsProvider){
	/*$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});*/
	
	/*$routeProvider.when('/items/:tid/:uid',{
		templateUrl: '/views/items.html',
		controller: 'itemsController'
	});*/
	
	$routeProvider.when('/login/:v',{
		templateUrl:'/views/login.html',
		controller: 'LoginController'
	}).when('/tests/:v',{
		templateUrl:'/views/tests.html',
		controller: 'TestsListController'
	}).when('/test/:v',{
		templateUrl:'/views/test.html',
		controller: 'TestController'
	}).when('/item/:uid/:tid',{
		templateUrl:'/views/item.html',
		controller: 'ItemController'
	}).otherwise({redirectTo:'/tests/:v'});
	
	
	ChartJsProvider.setOptions({
		colours: ['#CCCCCC','#CC0000','#00CCFF']
	});
	
	ChartJsProvider.setOptions('Line',{
		datasetFill: false
	});
});

app.controller("LoginController",function($scope,$http,$location,$routeParams){
	//$scope.showLoginPanel = true;
	$scope.email = "";
	$scope.password = "";
	$scope.login = function(){
		var v = $routeParams.v;
		var params = {v:v,
				email:$scope.email,
				password:$scope.password};
		$http({
			method: 'GET',
			url: SERVER_PATH+'/hhms/wx/r/nodejs/login',
			params: params
		}).then(function successCallback(response){
			//alert(response.data.ret);
				if(response.data.ret == 1)
				{
					//$scope.showLoginPanel = false;
					var path = "/tests/" + response.data.v;
					$location.path(path);
					//$scope.message = "绑定成功！";
				}	
				else
					$scope.message = response.data.error;
		},function errorCallback(response){
			$scope.message = "操作失败请重新绑定！";
		});
	};
	
	//window.localName.replace('/test?v='+v);
});

app.controller("TestsListController",function($scope,$http,$routeParams){
	var v = $routeParams.v;
	$http.get(SERVER_PATH+'/hhms/wx/r/nodejs/tests/'+v)
	.success(function(data){
		if(data.ret == 1){
			$scope.tests = data.tests
		}else {
			$scope.message = data.error;
		}
	});
});

app.controller("TestController",function($scope,$http,$routeParams){
	var v = $routeParams.v;
	$http.get(SERVER_PATH+'/hhms/wx/r/nodejs/test/'+v)
	.success(function(data){
		if(data.ret == 1){
			$scope.test = data.test;
			$scope.id = data.uid;
		}else {
			$scope.message = data.error;
		}
	});
});

app.controller("ItemController",function($scope,$http,$routeParams){
	$scope.tid = $routeParams.tid;
	$scope.uid = $routeParams.uid;
	
	$scope.exit = function(){
		window.history.go(-1);
	};
	
	$http.get(SERVER_PATH+'/hhms/wx/r/nodejs/test/item/'+$scope.tid+'/'+$scope.uid)
	.success(function(data){
		if(data.ret == 1)
		{
			$scope.testitem = data.testitem;
			$scope.chartitems = data.chartitems;
			
			if('D' == $scope.testitem.type)
			{
				//alert($scope.chartitems.length);
				chartInit($scope);
				$scope.showChart = true;
			}	
		}
	});
});
/*app.controller("testController",function($scope,$http,$location){
	$scope.showTestPanel = false;
	var v = $location.search()['v'];
	$http.get(SERVER_PATH+'/hhms/wx/r/nodejs/test/'+v)
	.success(function(data){

		testInit($scope,data);
	});

	$scope.$on('showTestPanel',function(event,msg){
		$scope.showTestPanel = ('T' == msg);
	});
});

app.controller("itemsController",function($scope,$http,$routeParams){
	//$scope.$route = $route;
	$scope.showChartItems = true;
	$scope.showChart = false;
	$scope.tid = $routeParams.tid;
	$scope.uid = $routeParams.uid;
	$scope.$emit('showTestPanel','F');
	
	$scope.exit = function(){
		$scope.showChartItems = false;
		$scope.$emit('showTestPanel','T');
	};
	
	$http.get(SERVER_PATH+'/hhms/wx/r/nodejs/test/item/'+$scope.tid+'/'+$scope.uid)
	.success(function(data){
		if(data.ret == 1)
		{
			$scope.testitem = data.testitem;
			$scope.chartitems = data.chartitems;
			
			if('D' == $scope.testitem.type)
			{
				//alert($scope.chartitems.length);
				chartInit($scope);
				$scope.showChart = true;
			}	
		}
	});
});

function testInit(scope,data){
	if(data.ret == 1){
		scope.test = data.test;
		scope.id = data.uid;
		scope.showTestPanel = true;
		
	}else {
		scope.message = data.error;
	}
}*/

function chartInit(scope){
	var labels = new Array();
	var min = new Array();
	var max = new Array();
	var data = new Array();
	scope.series = [scope.testitem.name,'正常范围上限','正常范围下限'];
	
	//scope.colors = ['#00FF00','#00FF00','#00FF00'];
	
	scope.datasetOverride = [
		{yAxisID: 'y-1',borderColor:'rgba(0,0,0,1)'}];
		
	scope.options = { 
		scales: {
			yAxes: [
			{id: 'y-1',type: 'linear',display: true,position: 'left'},]
		}
	};
	
	for(var i=0;i<scope.chartitems.length;i++)
	{
		var item = scope.chartitems[i];
		labels.push(item.date);
		data.push(item.value);
		
		if(item.low != -9999 && item.high != -1){
			min.push(item.low);
			max.push(item.high);
		}
	}
	
	scope.labels = labels;
	scope.data = [data,max,min];
}