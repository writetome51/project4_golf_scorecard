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

var fetchedDataForEachHole = {
	yards:[],
	par:[],
	hcp:[]
};

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
	loadFetchedDataForEachHole();
	fillRowsRepresentingFetchedData();
}


function fillRowsRepresentingFetchedData(){
	for (var p in fetchedDataForEachHole){
		fillHoleCells(p + '-row', fetchedDataForEachHole[p]);
		fillTotalCells(p);
	}
}


function loadCurrentTee(){
	loadCurrentTeeIndex();
	loadCurrentTeeName();
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


function fillTotalCells(rowName){
	fillTotalCell(rowName + '-cell-out',  fetchedDataForEachHole[rowName], [0,9]);
	fillTotalCell(rowName + '-cell-in',  fetchedDataForEachHole[rowName], [0,9]);
	var arr = [
		Number($('#' + rowName + '-cell-out').text()),
		Number($('#' + rowName + '-cell-in').text())
	];
	fillTotalCell(rowName + '-cell-total', arr, [0, arr.length]);
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



function loadFetchedDataForEachHole(){
	clearFetchedData();
	fillFetchedData();
}



function fillFetchedData(){
	for (var hole=0, thisHole;  hole < course.holes.length;  ++hole){
		thisHole = course.holes[hole];

		findCorrectTeeBoxAndGetDataFor(thisHole);
		ifNoDataForThisHole_FillWithDash(hole);
	}

	appendDashesToFetchedDataUntilAllHave18Items();
}


function findCorrectTeeBoxAndGetDataFor(thisHole){
	for (var tee_box=0, currentTee; tee_box < thisHole.tee_boxes.length; ++tee_box){
		currentTee = thisHole.tee_boxes[tee_box];
		if (currentTee.tee_type === currentTeeName){
			for(var p in fetchedDataForEachHole){
				fetchedDataForEachHole[p].push(currentTee[p]);
			}

			break;
		}
	}
}



function clearFetchedData() {
	for (var p in fetchedDataForEachHole){
		fetchedDataForEachHole[p] = [];
	}
}


function ifNoDataForThisHole_FillWithDash(item){
	for (var p in fetchedDataForEachHole){
		if ( ! fetchedDataForEachHole[p][item]){
			fetchedDataForEachHole[p][item] = ' - ';
		}
	}
}


function appendDashesToFetchedDataUntilAllHave18Items() {
	for (var p in fetchedDataForEachHole){
		while (fetchedDataForEachHole[p].length < 18){
			fetchedDataForEachHole[p].push(' - ');
		}
	}
}


function updateStrokeTotals(player){
	loadPlayerStrokes(player);
	fillTotalCell(player + '-cell-out', playerStrokes[player], [0,9]);
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
}


function loadEvents(){

	$('.strokes-input').keyup(function(){
		var value = $(this).val();
		if (isNaN(value)) {
			$(this).val(0);
		}

		var player = getPlayer($(this));
		updateStrokeTotals(player);
	});
}


function getPlayer(obj){
	var id = getCellID(obj);
	return playerNameInID(id);
}


function getCellID(obj){
	var parent = obj.closest('.strokes-input-cell');
	return parent.attr('id');
}


function playerNameInID(id){
	var parts = id.split('-');
	var player = parts[0];
	return player;
}