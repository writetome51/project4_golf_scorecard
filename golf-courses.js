var courses;
var local_obj = {latitude:40.4426135, longitude:-111.8631116, radius:100};
var courseNames=[];
var courseOptions='';
var teeOptions= '';
var courseHref = '';
var teeYardages;


loadCourses();


function loadCourses(){
	$.post('https://golf-courses-api.herokuapp.com/courses',
		local_obj,
		function(data){
			courses = JSON.parse(data);

			for (var p in courses.courses){
				console.log(courses.courses[p].name);
			}

			loadCourseNames();
			loadCourseChoiceOptions();
			loadTeeChoiceOptions();

		}
	);
}



function loadCourseNames(){
	for (var p in courses.courses){
		courseNames.push(courses.courses[p].name);
	}
}



function loadCourseChoiceOptions(){
	for (var name in courseNames){
		courseOptions += '<option value="' +
			courseNames[name]  +  '" >' +
			courseNames[name] + '</option>';
	}
	$('#course-name-selection').html(courseOptions);
}



function loadTeeChoiceOptions(){

}