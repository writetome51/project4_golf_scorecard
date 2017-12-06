var courses;
var course;
var local_obj = {latitude:40.4426135, longitude:-111.8631116, radius:100};
var courseNames=[];
var courseNameOptions='';
var currentCourseIndex;
var teeNameOptions= '';
var teeNames=[];
var currentTeeName;
var courseHrefs = [];
var currentCourseHref;
var teeTypes=[];
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
			loadcurrentCourseIndex();

			// loadCourseHrefs();
			loadCurrentCourseHref();
			loadCourse(currentCourseHref);

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



function loadcurrentCourseIndex(){
	currentCourseIndex =  $('#course-name-options').val();
}



function loadCourseHrefs(){
	for (var p in courses.courses){
		courseHrefs.push(courses.courses[p].href);
	}
}


function loadCurrentCourseHref(){
	var currentCourse = courses.courses[currentCourseIndex];
	currentCourseHref = currentCourse.href;
}


function loadCourse(href){
	$.get(href, function(data){
		course = data.course;
		loadTeeTypes();
		loadTeeNames();
		loadTeeNameOptions();
	});
}


function loadTeeTypes(){
	teeTypes = course.tee_types;
	console.log(teeTypes);
}


function loadTeeNames(){
	for (var i=0; i < teeTypes.length;  ++i){
		teeNames.push(teeTypes[i].tee_type);
	}
}


function loadTeeNameOptions(){
	for (var i=0;  i < teeNames.length;  ++i){
		teeNameOptions += '<option value="' + i  +  '" >' +
			teeNames[i] + '</option>';
	}
	$('#tee-name-options').html(teeNameOptions);
}