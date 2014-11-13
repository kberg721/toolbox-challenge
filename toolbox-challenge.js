/*
	Kyle Bergman
	Assignment: Javascript and Lo-Dash
	Section D with Jacob Morris
*/

'use strict';

var started = false; //whether the game has started
var turn = 0; //how many flips have occurred in a single turn
var unsuccess = 0; //how many unsuccessful matches have been attempted
var matchesMade = 0; //how many successful matches have been made
var remaining = 8; //how many matches remain to be found
var time = _.now(); //time elapsed
var prevWinner = false;


//when the page loads, create the tiles and regularly update statistics for the
//user.
function onReady() {
	createTiles();
	$('.start').click(startNew);
	$("#winner").hide();
	$('#help').popover('toggle');
	$('#help').popover('hide');
}

//keeps the main four statistics up to date for the user
function displayStats() {
	$("#unsuccess")[0].innerHTML = "Unsuccessful Matches: " + unsuccess;
	$("#unsuccess").removeClass("bold");
	$("#matchesMade")[0].innerHTML = "Matches Made: " + matchesMade;
	$("#matchesMade").removeClass("bold");
	$("#remaining")[0].innerHTML = "Matches Remaining: " + remaining;
	$("#time")[0].innerHTML = "Time Elapsed: " + Math.round(((_.now() - time) / 1000)) + " seconds";
}

//when the user clicks "start", it will reset the board and reset the statistics
function startNew(){
	$("#puzzlearea")[0].innerHTML = "";
	createTiles();
	time = _.now();
	setInterval(displayStats, 1000);
	turn = 0;
	started = true;
	unsuccess = 0;
	matchesMade = 0;
	remaining = 8;
	if(prevWinner) {
		$("header").show();
		$("#winner").fadeOut();
		$("#playArea").fadeIn();
		prevWinner = false;
	}
	
}

//creates a random selection of pictures to be used in the new gameboard
function randomPics() {
	var arr = [];
	for(var i = 1; i <= 32; i++) {
		arr[i-1] = i;
	}
	var shuffled = _.shuffle(arr);
	var subset = [];
	for(var j = 0; j < 8; j++) {
		subset.push(shuffled[j]);
		subset.push(shuffled[j]);
	}
	return _.shuffle(subset);
}

//creates the tiles to be flipped
function createTiles() {
	var pics = randomPics();
	for(var i = 0; i < 16; i++) {
		var tile = document.createElement("div");
		var image = document.createElement("img");
		$(image).data("to-flip", "img/tile" + pics[i] + ".jpg");
		image.className = "tile clickable";
		$(image).click(flip);
		tile.appendChild(image);
		tile.style.position = "relative";
		$("#puzzlearea").append($(tile));
	}
	shuffle($('img'));
}

//shuffles the tiles and sets them into position
function shuffle(arr) {
	var count = 0;
	for(var i = 1; i <= 4; i++) {
		for(var j = 1; j <= 4; j++) {
			var xPos = (j - 1) * 145;
			var yPos = (i - 1) * 145; 
			arr[count].style.left = xPos +'px';
			arr[count].style.top = yPos +'px';
			arr[count].src = "img/tile-back.png";
			$(arr[count]).data("flipped", false);
			$(arr[count]).data("matched", false);
			count+=1;
		}
	}
}

//flips the tile over if possible and determines whether there has been a new
//match.
function flip() {
	if(started == true && turn != 2 && $(this).data("flipped") == false) {
		var tiles = $("img");
		turn++;
		this.src = $(this).data("to-flip");
		if(turn == 2) {
			for(var i = 0; i < 16; i++) {
				if($(tiles[i]).data("to-flip") == $(this).data("to-flip")
					&& $(tiles[i]).data("flipped") == true) {
					$(this).data("matched", true);
					$(tiles[i]).data("matched", true);
					$("#matchesMade").addClass("bold");
					$(this).removeClass("clickable");
					$(tiles[i]).removeClass("clickable");
					matchesMade+=1;
					remaining -= 1;
				}
			}
		}
		$(this).data("flipped", true);
		if(turn == 2) {
			setTimeout(checkTiles, 1000);
			turn = 0;
		}
	}
}

//how to act if the game has been won.
function winner() {
	$("header").hide();
	$("#playArea").fadeOut();
	$("#winner").fadeIn().delay(300);
	prevWinner = true;
}

//determines whether there are tiles to be flipped back over
//and whether the game has been won.
function checkTiles() {
	var tiles = $("img");
	for(var i = 0; i < 16; i++) {
		if($(tiles[i]).data("flipped") == true
		    && $(tiles[i]).data("matched") == false) {
			tiles[i].src = "img/tile-back.png";
			$(tiles[i]).data("flipped", false);
			$("#unsuccess").addClass("bold");
			unsuccess+=0.5;
			win = false;
		}
	}
	if (remaining == 0) {
		clearInterval(displayStats);
		winner();
	}
}


$(onReady);