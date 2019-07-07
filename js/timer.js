/* timer */

var seconds = 0, 
    minutes = 0, 
    hours = 0;

function add() {
    var timerDiv = $('#timer');
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    timerDiv.text((hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds));
    localStorage.setItem("seconds", seconds);
    localStorage.setItem("minutes", minutes);
    localStorage.setItem("hours", hours);
    timer();
}
function timer() {
    setTimeout(add, 1000);
}
/* end timer */

function reset_timer()
{
    seconds = 0;
    minutes = 0;
    hours = 0;
}

function clearMovesDiv()
{
    $("#moves").html("");
}

function newGame()
{
    reset_timer();
    clearMovesDiv();
    localStorage.setItem("seconds", 0);
    localStorage.setItem("minutes", 0);
    localStorage.setItem("hours", 0);
    localStorage.setItem("history_arr",null);
    localStorage.setItem("order_arr",null);
    localStorage.setItem("moves_div",null);

    seconds=0;
    minutes=0;
    hours=0;
    order_arr=[];
    history_arr=[];

    randomSwap();
}

$(document).ready(function() {
    timer();
    seconds = localStorage.getItem("seconds");
    hours = localStorage.getItem("hours");
    minutes = localStorage.getItem("minutes");
});