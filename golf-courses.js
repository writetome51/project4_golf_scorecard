var courses;
var course;
var local_obj = {latitude:40.4426135, longitude:-111.8631116, radius:100};
var courseNames=[];
var currentCourse;
var courseNameOptions='';
var currentCourseName;
var teeNameOptions= '';
var teeNames=[];
var currentTeeName;
var courseHrefs = [];
var currentCourseHref;
var teeYardages;


loadCourses();


function loadCourses(){
	$.post('https://golf-courses-api.herokuapp.com/courses',
		local_obj,
		function(data){
			courses = JSON.parse(data);

			console.log(courses);

			loadCourseNames();
			loadCourseNameOptions();
			loadCurrentCourseName();
			console.log(currentCourseName);

			// loadCourseHrefs();
			loadCurrentCourseHref();
			loadCourse(currentCourseHref);



			loadTeeNameOptions();

		}
	);
}


function loadCourseNames(){
	for (var p in courses.courses){
		courseNames.push(courses.courses[p].name);
	}
}



function loadCourseNameOptions(){
	for (var i=0;  i < courseNames.length;  ++i){
		courseNameOptions += '<option value="' + i  +  '" >' +
			courseNames[i] + '</option>';
	}
	$('#course-name-options').html(courseNameOptions);
}



function loadCurrentCourseName(){
	currentCourseName =  $('#course-name-options').val();
}



function loadCourseHrefs(){
	for (var p in courses.courses){
		courseHrefs.push(courses.courses[p].href);
	}
}


function loadCurrentCourseHref(){
	currentCourse = courses.courses[currentCourseName];
	currentCourseHref = currentCourse.href;
}


function loadCourse(href){
	$.get(href, function(data){
		course = JSON.parse(data);
	});
}



function loadTeeNameOptions(){

}