const MAX_ROW = 4;
const MIN_ROW = 1;
const MAX_COLUMN = 4;
const MIN_COLUMN = 1;
const BLANK_TILE = 16;
const TOTAL_TILES = 16;
// Array of tileNumbers in order of last moved
let history_arr=[];
let order_arr=[];
let timeouts = [];

function ClickOnTile(row,column)
{
    // validate if its clickable

    var clickedTile = $("#cell"+row+column);
    var blankTile = $(".tile"+BLANK_TILE);
    var clickedTileClass = clickedTile.attr("class");


    if(clickedTileClass == "tile"+BLANK_TILE)
        return;
    else
    {

        console.log(clickedTileClass);
        
        // validating whether tile9 can be swapped up
        if(row<MAX_ROW)
        {
            console.log("came here::"+$("#cell"+(row+1)+column).attr("class"));
            if($("#cell"+(row+1)+column).attr("class")=="tile"+BLANK_TILE)
            {
                swapTiles(clickedTile,blankTile,row,column,false,false);

                

                return;
            }
        }

        // validating whether tile9 can be swapped left
        if(column<MAX_COLUMN)
        {
            if($("#cell"+row+(column+1)).attr("class")=="tile"+BLANK_TILE)
            {
                swapTiles(clickedTile,blankTile,row,column,false,false);

                
                return;
            }
        }

        // validating whether tile9 can be swapped right
        if(column>MIN_COLUMN)
        {
            if($("#cell"+row+(column-1)).attr("class")=="tile"+BLANK_TILE)
            {
                swapTiles(clickedTile,blankTile,row,column,false,false);

                

                return;
            }
        }

        // validating whether tile9 can be swapped down
        if(row>MIN_ROW)
        {
            if($("#cell"+(row-1)+column).attr("class")=="tile"+BLANK_TILE)
            {
                swapTiles(clickedTile,blankTile,row,column,false,false);
                return;
            }
        }

    }

}

function swapTiles(cell1,blankTile,row,column,fromRandomize,fromAutoSolve)
{
    
    console.log(cell1.attr('class')+"::::"+blankTile.attr('class'));
    
    var temp = cell1.attr('class');
    cell1.removeClass();
    cell1.addClass(blankTile.attr('class'));
    blankTile.removeClass();
    blankTile.addClass(temp);

    if(!fromRandomize)
    {
        printConsole(blankTile,cell1,row,column);
    }

    if(!fromAutoSolve)
    {
        //console.log(blankTile.attr("class").substr("tile".length));
        // Push to history_arr
        history_arr.push(blankTile.attr("class").substr("tile".length));
        localStorage.setItem("history_arr", history_arr);
    }

    if(!fromRandomize)
    {
        var solved = isSolved();
        
        if(solved)
        {
            alert("Congrats!!! You completed the game");
            
            for (var i=0; i<timeouts.length; i++) {
                console.log("clearing timeouts:::"+i+":::"+timeouts[i]);
                clearTimeout(timeouts[i]);
            }

            setTimeout(()=>{
                alert("You are about to start a new game");
                newGame();
            },2000)
        }
    }
}

function printConsole(cell1,blankTile,row,column)
{
    var textMoved = cell1.attr("class").substr("tile".length);
    var destRow = cell1.attr("id").substr("cell".length);
    destRow = destRow.substr(0,1);
    var destCol = cell1.attr("id").substr("cell".length+1);
    $('#moves').html($('#moves').html()+"<br/><b>"+textMoved+"</b> moved from "+row+","+column+" to "+ destRow + "," + destCol );
    localStorage.setItem("moves_div", $('#moves').html());
}

function randomSwap()
{

    var count = 1;
    for(var row=MIN_ROW;row<=MAX_ROW;row++)
    {
        for(var column=MIN_COLUMN;column<=MAX_COLUMN;column++)
        {
            $("#cell"+row+column).removeClass();
            $("#cell"+row+column).addClass("tile"+count);
            count++;
        }
    }

    var random_total_swaps = Math.floor(Math.random() * 50) + 1;

    for(var i=0;i<random_total_swaps;i++)
    {
        var random_direction = Math.floor(Math.random() * 4) + 1;
        var blank_tile = $('.tile'+BLANK_TILE);
        //console.log(blank_tile);
        var blank_row = blank_tile.attr('id').substr("cell".length);
        var blank_column = parseInt(blank_row.substr(1,1));
        blank_row = parseInt(blank_row.substr(0,1));
        //console.log("blank row::"+blank_row+":::::blank column::"+blank_column+":::random dire::"+random_direction);
        switch(random_direction)
        {
            case 1: // swap the blank up
                    if(blank_row>MIN_ROW)
                    {
                        swapTiles($("#cell"+(blank_row-1)+blank_column),blank_tile,(blank_row-1),blank_column,true,false)
                    }
                    break;

            case 2: // swap the blank down
                    if(blank_row<MAX_ROW)
                    {
                        swapTiles($("#cell"+(blank_row+1)+blank_column),blank_tile,(blank_row+1),blank_column,true,false)
                    }
                    break;

            case 3: // swap the blank left
                    if(blank_column>MIN_COLUMN)
                    {
                        swapTiles($("#cell"+blank_row+(blank_column-1)),blank_tile,blank_row,(blank_column-1),true,false)
                    }
                    break;

            case 4: // swap the blank right
                    if(blank_column<MAX_COLUMN)
                    {
                        swapTiles($("#cell"+blank_row+(blank_column+1)),blank_tile,blank_row,(blank_column+1),true,false)
                    }
                    break;
        
        }
    }
}

function isSolved()
{
    var count=0;
    for(var row=MIN_ROW;row<=MAX_ROW;row++)
    {
        for(var column=MIN_COLUMN;column<=MAX_COLUMN;column++)
        {
            count++;
            if($("#cell"+row+column).attr("class")!="tile"+count)
            {
                return false;
            }
        }
    }

    // Clear history_arr if solved
    history_arr = [];
    localStorage.setItem("history_arr",null);
    return true;
}

/* 
Solver algo 
*/

var board;

function solve()
{
    for (let i = history_arr.length-1; i >= 0; i--) {
        
        timeouts.push(setTimeout(()=>{
                
                console.log(i);
                var poppedTile = $(".tile"+history_arr[i]);
                var row = poppedTile.attr('id').substr("cell".length);
                var column = parseInt(row.substr(1,1));
                row = parseInt(row.substr(0,1));
                //console.log(poppedTile.attr('class'));
                swapTiles(poppedTile,$(".tile"+BLANK_TILE),row,column,false,true);

        },((history_arr.length-1)-i)*1000));

    }
}

function shuffle()
{
    history_arr = [];
    localStorage.setItem("history_arr",null);
    clearMovesDiv();

    let count = 1;

    randomSwap();
}

/* 
end solver algo 
*/

$(document).ready(function() {

    console.log(localStorage.getItem('history_arr'))
    console.log(localStorage.getItem('minutes'))
    console.log(localStorage.getItem('seconds'))
    console.log(localStorage.getItem('hours'))
    console.log(localStorage.getItem('order_arr'))
    console.log(localStorage.getItem('moves_div'))

    if(localStorage.getItem('history_arr')=="null")
    {
        //console.log("hi");
        history_arr = [];
        order_arr = [];
        clearMovesDiv();
        randomSwap();
    }
    else
    {
        history_arr = JSON.parse("[" + localStorage.getItem('history_arr') + "]");
        order_arr = JSON.parse("[" + localStorage.getItem('order_arr') + "]");

        if(localStorage.getItem('moves_div')!="null")
            $('#moves').html(localStorage.getItem('moves_div'));
        else
            clearMovesDiv();
        
        //console.log(history_arr);
        let count = 0;
        for(var row=MIN_ROW;row<=MAX_ROW;row++)
        {
            for(var column=MIN_COLUMN;column<=MAX_COLUMN;column++)
            {
                $("#cell"+row+column).removeClass();
                $("#cell"+row+column).addClass("tile"+order_arr[count]);
                count++;
            }
        }

    }
      
});

window.onbeforeunload = function(e) {

    order_arr = [];
    for(var row=MIN_ROW;row<=MAX_ROW;row++)
    {
        for(var column=MIN_COLUMN;column<=MAX_COLUMN;column++)
        {
            order_arr.push($("#cell"+row+column).attr("class").substr("tile".length));
        }
    }

    localStorage.setItem("order_arr", order_arr);

};
