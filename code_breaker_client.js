var NUM_BALLS = 8; // num of balls for selection, it must be in range of CODE_LENGTH..8
var CODE_LENGTH = 5; // set this number in the range of 1..5
var NUM_ATTEMPTS = 8; // change this number to have less or more attempts in range of 1..8
var MAX_NUM_ATTEMPTS = 8; // do not change this number

var peg_selected = 0;
var attempt_code;
var current_attempt_id;
var start = new Date();
var btn_initial_top;

var url = "http://localhost:3000/post";

var myName;


//ON LOAD FUNCTION
window.onload = function()
{
    createGameBoard(); //draw the game board
    
    //read CSS to define the button initial position
    var step = parseInt($(".attempt").css("margin-top")) 
                + parseInt($(".attempt").css("height"));
    var attemptHeight = parseInt($(".attempt").css("height"));
    btn_initial_top = parseInt($("#acceptcode").css("top")) 
                      - (MAX_NUM_ATTEMPTS - NUM_ATTEMPTS) * step;
    
    //set game board height. 
    $("#gameboard").css("height", NUM_ATTEMPTS * step + attemptHeight+"px");
    
    //game player will enter their name here
    myName = prompt("Please enter your name", "");
    $('#name').text(myName);
    
    initGameBoard();
    
    // start the timer
    setInterval(function() 
    {$("#timer").text(parseInt((new Date() - start) / 1000) + "s");}, 1000);
    
}

/* 
 * Create the game board, includes 
 * one line to display the code images - "coderow"
 * 8 attempts
 * 1 accept button
 * 8 peg selections
 */
function createGameBoard(){
    
    //add code images (dummy code)
    for (var i = 1; i <= CODE_LENGTH; i++){
        var newImg = document.createElement("img");
        $(newImg).attr("id", "code" + i);
        //add a dummy image
        $(newImg).attr("src", "./images/hole.png");
        $("#coderow").append(newImg);
    }
 
    //add attempts
    for (var i = NUM_ATTEMPTS; i > 0; i--){
        
		//for each attempt, we create a div
        var newDiv = document.createElement("div");
		// set its id and class
        $(newDiv).attr("id", "attempt" + i);
        $(newDiv).attr("class", "attempt");
        
		// create a span, and set its id and class
		var newSpan = document.createElement("span");
        $(newSpan).attr("id", "attempt"+i+"pegs");
        $(newSpan).attr("class", "futureattempt");
		// then add 5 images including ids and classes. The img source could be empty or could be the hole.png
        for (var j = 1; j <= CODE_LENGTH; j++){
           var newImg = document.createElement("img");
            $(newImg).attr("src","./images/hole.png");
            $(newImg).attr("id", "attempt" + i + "_" + j);
            $(newImg).attr("class", "imgAttempt");
            $(newSpan).append(newImg);
        }
		//append the span to the div
        $(newDiv).append(newSpan);
        
        // create a new span for displaying result of the end-user attempt, set id and append it to the div
        var newSpan = document.createElement("span");
        $(newSpan).attr("id", "attempt" + i + "result");
        $(newDiv).append(newSpan);

		// append each div to the game board		
		$("#gameboard").append(newDiv);
    }
   
    //add Accept button inside a <div>
    var newDiv = document.createElement("div");
    $(newDiv).attr("id", "acceptcode");
    var newInput = document.createElement("input");
    $(newInput).attr("type", "button");
    $(newInput).attr("name", "Accept");
    $(newInput).attr("value", "Accept");
    $(newInput).click(process_attempt); // set onclick event handler
    $(newDiv).append(newInput);
    // add this button div to the game board
    $("#gameboard").append(newDiv);

    // add peg selection	
	// create 8 img elements and 
	// show each of the 8 marbles images with shadow from the images folder, also set their id and event handler 
    for (var i = 1; i <= NUM_BALLS; i++){
        var newImg = document.createElement("img");
        $(newImg).attr("src", "./images/shadow_ball_" + i + ".png");
        $(newImg).attr("id", "shadow" + i);
        // set onclick event handler and pass event.data.id as a parameter
        $(newImg).click({id: i}, select_peg); 
        $("#pegselection").append(newImg);
    }
    
}

/* 
 * Initiate the game board
 * Reset all the holds
 * Reset the btn position and its visibility
 * Send a "generate code" request to the server
 */
function initGameBoard(){
    //reset holds
    for (var i = NUM_ATTEMPTS; i > 0; i--){
        for (var j = 1; j <= CODE_LENGTH; j++){
            //reset the image on each hole
            $("#attempt" + i + "_" + j).attr("src", "./images/hole.png");
            $("#attempt" + i + "_" + j).css({'opacity' : 0.3});
        }
        //reset the "attempt#result" to empty
        $("#attempt" + i + "result").empty();
    }
    
    //reset the button's position and visibility
    current_attempt_id = 0;
    var step = parseInt($(".attempt").css("margin-top")) 
	         + parseInt($(".attempt").css("height"));
    $("#acceptcode").css({'top' : btn_initial_top + 'px'});
    $("#acceptcode").css({'visibility' : 'visible'});
    
    // show the cover to hide code 
    $("#cover").css({'visibility' : 'visible'});
    
    //send request to server to start a new game.
    $.post(url+'?data='+JSON.stringify({
                            'name':myName, //client's identity on the server
                            'action':'generateCode'}),
           response);
    
}

