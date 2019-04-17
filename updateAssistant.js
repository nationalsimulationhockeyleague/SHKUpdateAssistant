function addRow() {
  var numRows = getRowsInUpdateTable();
  var newRow = '<tr>';
  newRow += '<td>' + numRows + '</td>';
  newRow += '<td><input id="' + numRows + 'task" type="Text"></td>';
  newRow += '<td><input id="' + numRows + 'link" type="Text"></td>';
  newRow += '<td><input id="' + numRows + 'cappedTpe" type="Text" onchange="updateTpeAvailable();" value="0"></td>';
  newRow += '<td><input id="' + numRows + 'uncappedTpe" type="Text" onchange="updateTpeAvailable();" value="0"></td>'
  newRow += '</tr>';
  $('#updatesTable tr:last').after(newRow);
}

function removeRow() {
  var numRows = $('#updatesTable tr').length;
  if (numRows <= 2) {
    return;
  }
  $('#updatesTable tr:last').remove();
}

function generateUpdates() {
  var numRows = getRowsInUpdateTable();
  var cappedTotal = 0;
  var uncappedTotal = 0;
  var updateString = "";
  var tpeBeforeUpdate = $('#tpeBeforeUpdate').val();
  var currentSeasonCappedTpe = $('#currentSeasonCappedTpe').val();
  if (!$.isNumeric(tpeBeforeUpdate)) {
    alert("Please give a valid number for TPE Before Update.");
    return;
  }

  if (!$.isNumeric(currentSeasonCappedTpe)) {
    alert("Please give a valid number for Current Season Capped TPE.");
    return;
  }

  for (var i = 1; i < numRows; i++) {
    var cappedTpe = $('#' + i + 'cappedTpe').val();
    var uncappedTpe = $('#' + i + 'uncappedTpe').val();

    if (!$.isNumeric(cappedTpe) || !$.isNumeric(uncappedTpe)) {
      alert("Please give a valid number for Capped TPE Earned and Uncapped TPE Earned.");
      return;
    }


    cappedTotal += parseInt(cappedTpe);
    uncappedTotal += parseInt(uncappedTpe);

	if (cappedTpe != "0") { 
		updateString += "+" + cappedTpe + " Capped TPE, ";
	}
    if (uncappedTpe != "0") {
		updateString += "+" + uncappedTpe + " Uncapped TPE - ";
    }
	if (cappedTpe == "0" && uncappedTpe == "0") {
		continue;
	}
	
	updateString += "[url=" + $('#' + i + 'link').val() + "]" + $('#' + i + 'task').val() + "[/url]\n";
  }

  var totalTpeEarned = parseInt(cappedTotal) + parseInt(uncappedTotal);
  updateString += "\nTotal Points Earned: " + tpeBeforeUpdate + " + " + totalTpeEarned + " = " + (parseInt(tpeBeforeUpdate) + parseInt(totalTpeEarned)) + "\n";
  updateString += "Current Season Capped TPE: " + (parseInt(currentSeasonCappedTpe) + parseInt(cappedTotal)) + "/40\n\n";
  updateString += "Adjusted Attributes:\n";
  updateString += "+X ExampleAttribute (StartingAmount -> NewAmount)"
  $('#outputText').val(updateString);
}

function copyUpdateText() {
  var text = $('#outputText');
  text.select();
  document.execCommand("copy");
}


function updateTpeAvailable() {
  var numRows = getRowsInUpdateTable();
  var totalTpeAvailable = 0;
  for (var i = 1; i < numRows; i++) {
    var cappedTpe = $('#' + i + 'cappedTpe').val();
    var uncappedTpe = $('#' + i + 'uncappedTpe').val();

    if (!$.isNumeric(cappedTpe) || !$.isNumeric(uncappedTpe)) {
      alert("You need to give a valid number for Capped TPE Earned and Uncapped TPE Earned.");
      return;
    }

    totalTpeAvailable += parseInt(cappedTpe) + parseInt(uncappedTpe);
  }

  $('#tpeAvailable').val(totalTpeAvailable);
}

function getRowsInUpdateTable() {
  return $('#updatesTable tr').length;
}
