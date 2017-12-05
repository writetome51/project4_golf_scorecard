var weatherobj = '';
var requestObj = {
	url:'http://api.openweathermap.org/data/2.5/weather?q=Provo&appid=cc8ef8e5c209d938ab3801daa42b5e31',
	type:'GET',
	success:function(data, status){
		console.log(data);
		sessionStorage.setItem('base', data.base);
		$('#test').text(sessionStorage.getItem('base'));

	}
};

$.ajax(requestObj);

