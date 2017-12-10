var courses;
var course;
var local_obj = {latitude:40.4426135, longitude:-111.8631116, radius:100};
var courseNames=[];
var courseNameOptions='';
var currentCourseIndex;
var teeNameOptions= '';
var teeNames=[];
var currentTeeName;
var currentTeeIndex;
var currentCourseHref;
var teeTypes=[];
var teeYardages;
var yardagesOfCurrentTeeForEachHole = [];


$(document).ready(function(){

	loadEverything();

});




function loadEverything(){
	$.post('https://golf-courses-api.herokuapp.com/courses',
		local_obj,
		function(data){
			loadAllCourseData(data);

			loadEvents();
		}
	);
}


function loadAllCourseData(data){
	loadCourses(data);
	loadCourseNames();
	loadCourseNameOptions();
	updateTeesAndCells();
}


function loadCourses(data){
	courses = JSON.parse(data);
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



function updateTeesAndCells(){
	loadCurrentCourseIndex();
	loadCurrentCourseHref();
	loadCourse(currentCourseHref);
}

// $("div:not(:has(h1))")


function loadCurrentCourseIndex(){
	currentCourseIndex =  $('#course-name-options').val();
}



function loadCurrentCourseHref(){
	var currentCourse = courses.courses[currentCourseIndex];
	currentCourseHref = currentCourse.href;
}


function loadCourse(href){
	$.get(href, function(data){
		course = data.course;
		console.log(course);

		loadTeeTypes();
		loadTeeNames();
		loadTeeNameOptions();
		updateCells();
	});
}



function loadTeeTypes(){
	teeTypes = course.tee_types;
}


function loadTeeNames(){
	teeNames=[];
	for (var i=0; i < teeTypes.length;  ++i){
		teeNames.push(teeTypes[i].tee_type);
	}
}


function loadTeeNameOptions(){
	teeNameOptions='';
	for (var i=0;  i < teeNames.length;  ++i){
		teeNameOptions += '<option value="' + i  +  '" >' +
			teeNames[i] + '</option>';
	}
	$('#tee-name-options').html(teeNameOptions);
}



function updateCells(){
	fillTeeRow();

}


function fillTeeRow(){
	loadCurrentTeeIndex();
	loadCurrentTeeName();
	fillEveryTeeCellWithYardage();
	//fillTotalCells();
}


function loadCurrentTeeIndex(){
	currentTeeIndex =  $('#tee-name-options').val();
}


function loadCurrentTeeName(){
	currentTeeName = teeNames[currentTeeIndex];
}


function fillEveryTeeCellWithYardage(){
	loadYardagesOfCurrentTeeForEachHole();
	fillHoleCells('tee-row', yardagesOfCurrentTeeForEachHole);
	fillAllTeeTotals();
}


function fillAllTeeTotals(){
	fillTotalCell('tee-cell-out', yardagesOfCurrentTeeForEachHole, [0,9]);
	fillTotalCell('tee-cell-in', yardagesOfCurrentTeeForEachHole, [0,9]);
	var arr = [ Number($('#tee-cell-out').text()) , Number($('#tee-cell-in').text()) ];
	fillTotalCell('tee-cell-total', arr, [0, arr.length]);
}


function fillHoleCells(rowClass, dataForCells){
	var selector = '.' + rowClass + ':not(.total-cell):not(.label-cell)';
	var cells = $(selector);
	for (var i=0;  i < cells.length;  ++i){
		cells[i].innerText = (dataForCells[i]);
	}
}


function fillTotalCell(cellID, arrayToTally, range){
	var selector = '#' + cellID;
	arrayToTally = arrayToTally.splice(range[0], range[1]);
	var total = getTally(arrayToTally);
	$(selector).text(total);
}


function getTally(arrayToTally){
	for (var i=0,sum=0; i < arrayToTally.length; ++i){
		if (isNaN(arrayToTally[i])){
			arrayToTally[i] = 0;
		}
		sum += arrayToTally[i];
	}
	return sum;
}


function loadYardagesOfCurrentTeeForEachHole(){

	yardagesOfCurrentTeeForEachHole = [];
	for (var hole=0, thisHole;  hole < course.holes.length;  ++hole){
		thisHole = course.holes[hole];

		for (var tee_box=0, currentTee; tee_box < thisHole.tee_boxes.length; ++tee_box){
			currentTee = thisHole.tee_boxes[tee_box];
			if (currentTee.tee_type === currentTeeName){
				yardagesOfCurrentTeeForEachHole.push(currentTee.yards);
				break;
			}
		}
		if ( ! yardagesOfCurrentTeeForEachHole[hole]){
			yardagesOfCurrentTeeForEachHole.push(' - ');
		}
	}

	while (yardagesOfCurrentTeeForEachHole.length < 18){
		yardagesOfCurrentTeeForEachHole.push(' - ');
	}
}


function fillTotalCells(){

}


function loadEvents(){
	$('.player-name-input').blur(function(){
		var name = $(this).val();
		if (name !== ''){
			var cell = $(this).closest('.player-name-input-container')
				.next('.player-name-cell');

			$(this).closest('.player-name-input-container').addClass('collapsed');
			cell.removeClass('collapsed');
			cell.text(name);
		}
	});

}