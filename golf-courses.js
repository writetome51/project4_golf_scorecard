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
var parOfCurrentTeeForEachHole=[];
var hcpOfCurrentTeeForEachHole=[];
var playerStrokes = {
	player1:[],
	player2:[],
	player3:[],
	player4:[]
};



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
	//	console.log(course);

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
	loadCurrentTee();
	loadDataOfCurrentTeeForEachHole();
	fillTeeRow();
	fillParRow();
	fillHandicapRow();
}


function loadCurrentTee(){
	loadCurrentTeeIndex();
	loadCurrentTeeName();
}


function fillTeeRow(){
	fillHoleCells('tee-row', yardagesOfCurrentTeeForEachHole);
	fillAllTeeTotals();
}


function fillParRow(){
	fillHoleCells('par-row', parOfCurrentTeeForEachHole);
	fillAllParTotals();
}


function fillHandicapRow(){
	fillHoleCells('handicap-row', hcpOfCurrentTeeForEachHole);
	fillAllHandicapTotals();
}


function loadCurrentTeeIndex(){
	currentTeeIndex =  $('#tee-name-options').val();
}


function loadCurrentTeeName(){
	currentTeeName = teeNames[currentTeeIndex];
}



function fillHoleCells(rowClass, dataForCells){
	var selector = '.' + rowClass + ':not(.total-cell):not(.label-cell)';
	var cells = $(selector);
	for (var i=0;  i < cells.length;  ++i){
		cells[i].innerText = (dataForCells[i]);
	}
}



function fillAllParTotals(){
	fillTotalCell('par-cell-out', parOfCurrentTeeForEachHole, [0,9]);
	fillTotalCell('par-cell-in', parOfCurrentTeeForEachHole, [0,9]);
	var arr = [ Number($('#par-cell-out').text()) , Number($('#par-cell-in').text()) ];
	fillTotalCell('par-cell-total', arr, [0, arr.length]);
}


function fillAllTeeTotals(){
	fillTotalCell('tee-cell-out', yardagesOfCurrentTeeForEachHole, [0,9]);
	fillTotalCell('tee-cell-in', yardagesOfCurrentTeeForEachHole, [0,9]);
	var arr = [ Number($('#tee-cell-out').text()) , Number($('#tee-cell-in').text()) ];
	fillTotalCell('tee-cell-total', arr, [0, arr.length]);
}


function fillAllHandicapTotals(){
	fillTotalCell('handicap-cell-out', hcpOfCurrentTeeForEachHole, [0,9]);
	fillTotalCell('handicap-cell-in', hcpOfCurrentTeeForEachHole, [0,9]);
	var arr = [ Number($('#handicap-cell-out').text()) , Number($('#handicap-cell-in').text()) ];
	fillTotalCell('handicap-cell-total', arr, [0, arr.length]);
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



function loadDataOfCurrentTeeForEachHole(){

	yardagesOfCurrentTeeForEachHole = [];
	parOfCurrentTeeForEachHole=[];
	hcpOfCurrentTeeForEachHole=[];

	for (var hole=0, thisHole;  hole < course.holes.length;  ++hole){
		thisHole = course.holes[hole];

		for (var tee_box=0, currentTee; tee_box < thisHole.tee_boxes.length; ++tee_box){
			currentTee = thisHole.tee_boxes[tee_box];
			if (currentTee.tee_type === currentTeeName){
				yardagesOfCurrentTeeForEachHole.push(currentTee.yards);
				parOfCurrentTeeForEachHole.push(currentTee.par);
				hcpOfCurrentTeeForEachHole.push(currentTee.hcp);
				break;
			}
		}
		if ( ! yardagesOfCurrentTeeForEachHole[hole]){
			yardagesOfCurrentTeeForEachHole[hole] = ' - ';
		}
		if ( ! parOfCurrentTeeForEachHole[hole]){
			parOfCurrentTeeForEachHole[hole] = ' - ';
		}
		if ( ! hcpOfCurrentTeeForEachHole[hole]){
			hcpOfCurrentTeeForEachHole[hole] = ' - ';
		}
	}

	while (yardagesOfCurrentTeeForEachHole.length < 18){
		yardagesOfCurrentTeeForEachHole.push(' - ');
	}
	while (parOfCurrentTeeForEachHole.length < 18){
		parOfCurrentTeeForEachHole.push(' - ');
	}
	while (hcpOfCurrentTeeForEachHole.length < 18){
		hcpOfCurrentTeeForEachHole.push(' - ');
	}
}


function updateStrokeTotals(player){
	loadPlayerStrokes(player);
	fillTotalCell(player + '-cell-out', playerStrokes[player], [0,9]);
	console.log(playerStrokes[player]);
	fillTotalCell(player + '-cell-in', playerStrokes[player], [0,9]);
	var arr = [ Number($('#' + player  + '-cell-out').text()) ,
		Number($('#' + player + '-cell-in').text()) ];
	fillTotalCell(player + '-cell-total', arr, [0, arr.length]);
}


function loadPlayerStrokes(player){
	var selector = '.' + player + '-row' + ':not(.total-cell):not(.label-cell)';
	var cells = $(selector).children('.strokes-input');

	for (var i=0; i < cells.length; ++i){
		if (cells[i].value === ''){
			playerStrokes[player].push(0);
		}
		else{
			playerStrokes[player].push( Number(cells[i].value) );
		}
	}
	//console.log(playerStrokes[player]);
}


function loadEvents(){
	$('.player1-row .strokes-input').blur(function(){
		var value = $(this).val();
		if (isNaN(value)){
			$(this).val(0);
		}
		else{
			updateStrokeTotals('player1');
		}
	});
	$('.player2-row .strokes-input').blur(function(){
		var value = $(this).val();
		if (isNaN(value)){
			$(this).val(0);
		}
		else{
			updateStrokeTotals('player2');
		}
	});
	$('.player3-row .strokes-input').blur(function(){
		var value = $(this).val();
		if (isNaN(value)){
			$(this).val(0);
		}
		else{
			updateStrokeTotals('player3');
		}
	});
	$('.player4-row .strokes-input').blur(function(){
		var value = $(this).val();
		if (isNaN(value)){
			$(this).val(0);
		}
		else{
			updateStrokeTotals('player4');
		}
	});

}