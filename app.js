// A map of all winning space combinations
var wins = [['0 0', '0 1', '0 2'],
			['1 0', '1 1', '1 2'],
			['2 0', '2 1', '2 2'],
			['0 0', '1 0', '2 0'],
			['0 1', '1 1', '2 1'],
			['0 2', '1 2', '2 2'],
			['0 0', '1 1', '2 2'],
			['0 2', '1 1', '2 0']];

// Define the game board
var data_board = [["", "", ""], ["", "", ""], ["", "", ""]];

// Set the game to active
var game_active = true;

/**
 *
 */
var inialize_board = () => {
	$('.square').each(function(){
		$(this).click(function(event){
			// Handle player interaction
			var row = $(this).closest(".row").attr("data-row");
			var column = $(this).attr("data-column");
			take_turn(row, column, "x");
		});
	});	
}

/**
 *
 */
var computer_turn = () => {
	var move = rate_moves();
	var move_coords = move.split(' ');

	take_turn(move_coords[0], move_coords[1], 'o');
}

/**
 *
 */
var take_turn = (row, column, marker) => {
	var space = $("#"+row+''+column);

	if(game_active)
	{
		if(data_board[row][column] == "")
		{
			space.html(marker);
			space.attr("data-value", marker);
			data_board[row][column] = marker;

			//check for win / tie
			if(is_board_full() || check_for_win())
			{
				game_active = false
				$('#reset-game-wrapper').show();
			}

			if(game_active)
			{
				// Clear the Message
				display_message('');

				// If the player just took their turn the computer takes it's turn.
				if(marker == 'x')
				{
					computer_turn();
				}
			}
		} else {
			// The player has selectes a space that has already been taken.
			display_message('That square is taken. Please choose another square.')
		}
	}
}

/**
 *
 */
var rate_moves = () => {
	var moves = {}

	// Loop through the predefined winning space combinations
    for (var row = 0; row < wins.length; row++)
    {
    	var row_x = 0; 		// number of spaces controlled by X, aka the Player, in this row
		var row_o = 0; 		// number of spaces controlled by O, aka the Computer, in this row
		var row_empty = []; // An array of all the empty spaces in this space combination

		// Loop through the spaces of the predefined win
    	for (var space = 0; space < wins[row].length; space++) 
    	{
    		var win_row_column = wins[row][space].split(' ');
    		var board_row = win_row_column[0];
    		var board_space = win_row_column[1];
    		var space_value = data_board[board_row][board_space];

    		if (space_value == 'x')
    		{
				row_x = row_x + 1
    		} else if(space_value == 'o')
    		{
				row_o = row_o + 1
    		} else
			{
				row_empty.push(board_row+" "+board_space);
			}

			if(row_empty.length > 0)
			{
				//determine the row value
				if (row_o == 2) {
					row_value = 1000; 	// for the win
				}
				else if (row_x == 2) {
					row_value = 100 	// for the block
				}
				else if (row_o == 1 && row_x == 0) {
					row_value = 10 		// a row the computer has a square in and the player doesn't
				} else {
					row_value = 1 		// empty row or oppent has one sqaure
				}

				for (var f = 0; f < row_empty.length; f++)
    			{
    				var space = row_empty[f];
    				if(moves[space])
    				{
    					moves[space] = moves[space] + row_value;
    				} else {
    					moves[space] = row_value;
    				}
    			}
			}

    	}
    }

	var highest_move_value = 0;
	var highest_move = '';

	for (var move in moves) {
	    var move_value = moves[move];
	    if (move_value > highest_move_value)
	    {
	    	highest_move = move;
			highest_move_value = moves[move];
	    }
	}

	return highest_move;
}

/**
 *
 */
var check_for_win = () => {

	// Loop through every winning space combination
	for (var row = 0; row < wins.length; row++)
    {
    	var player_count = 0; 
		var computer_count = 0;

		// Check the value of each space in the combination with the 
		// corresponding space in the active game board.
		for (var space = 0; space < wins[row].length; space++) 
    	{
    		var win_row_column = wins[row][space].split(' ');
    		var board_row = win_row_column[0];
    		var board_space = win_row_column[1];
    		var space_value = data_board[board_row][board_space];

    		if (space_value == 'x')
    		{
				player_count = player_count + 1
    		}

    		if(space_value == 'o')
    		{
				computer_count = computer_count + 1
    		}
    	}

    	// After each space combination check to see if either the player or
    	// computer has won.
    	if(player_count == 3)
    	{
    		display_message('You Won!');
    		game_active = false;
    		return true;
    	}

    	if(computer_count == 3)
    	{
    		display_message('I Won!');
    		game_active = false;
    		return true;
    	}

    }
	return false;
}

/**
 *
 */
var is_board_full = () => {
	var free_spaces = 0;
	for (var row = 0; row < data_board.length; row++)
    {
    	for (var space = 0; space < data_board[row].length; space++) 
    	{
    		if(data_board[row][space] == "")
    		{
    			free_spaces++;
    		}	
    	}
    }

    if(free_spaces == 0) {
    	display_message("It's a Tie!");
    	return true;
    }

    return false;
}

/**
 *
 */
var display_message = (message) => {
	$("#message").html(message);
}

/**
 *
 */
var reset_game = () => {
	data_board = [["", "", ""], ["", "", ""], ["", "", ""]];
	game_active = true;

	// clear the message 
	display_message('');

	// clear display board
	$('.square').each(function() {
		$(this).html('');
	})

	// hide reset button
	$('#reset-game-wrapper').hide();
}

$(function(){
	inialize_board();

	$("#reset-game").click(function(){
		reset_game();
	});
});