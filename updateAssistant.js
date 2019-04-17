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
    var prevCappedTotal = cappedTotal;

    if (!$.isNumeric(cappedTpe) || !$.isNumeric(uncappedTpe)) {
      alert("Please give a valid number for Capped TPE Earned and Uncapped TPE Earned.");
      return;
    }
    cappedTpe = parseInt(cappedTpe);
    uncappedTpe = parseInt(uncappedTpe);

    cappedTotal += cappedTpe;
    uncappedTotal += uncappedTpe;

    // if the player exceeds the cap
    if (cappedTotal + parseInt(currentSeasonCappedTpe) >= 40) {
      cappedTotal = 40 - parseInt(currentSeasonCappedTpe);
      cappedTpe = cappedTotal - prevCappedTotal;
    }

    if (cappedTpe > 0 && uncappedTpe > 0) {
      updateString += '+' + cappedTpe + ' Capped TPE, ';
      updateString += '+' + uncappedTpe + ' Uncapped TPE - ';
    } else if (cappedTpe > 0) {
      updateString += "+" + cappedTpe + ' Capped TPE -';
    } else if (uncappedTpe > 0) {
      updateString += "+" + uncappedTpe + ' Uncapped TPE - ';
    } else {
      // if the capped and uncapped tpe for this link are 0 or negative move on.
      continue;
    }
    updateString += "[url=" + $('#' + i + 'link').val() + "]" + $('#' + i + 'task').val() + "[/url]\n";
  }

  var totalTpeEarned = cappedTotal + uncappedTotal;
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
  var cappedTotal = 0;
  var currentSeasonCappedTpe = $('#currentSeasonCappedTpe').val();
  for (var i = 1; i < numRows; i++) {
    var cappedTpe = $('#' + i + 'cappedTpe').val();
    var uncappedTpe = $('#' + i + 'uncappedTpe').val();
    var prevCappedTotal = cappedTotal;
    if (!$.isNumeric(cappedTpe) || !$.isNumeric(uncappedTpe)) {
      alert("You need to give a valid number for Capped TPE Earned and Uncapped TPE Earned.");
      return;
    }
    cappedTpe = parseInt(cappedTpe);
    uncappedTpe = parseInt(uncappedTpe);

    cappedTotal += cappedTpe;


    // if the player exceeds the cap
    if (cappedTotal + parseInt(currentSeasonCappedTpe) > 40) { // this makes sure that it doesn't spam you
      alert("You've reached the 40 TPE cap for capped TPE. " + ((cappedTotal + parseInt(currentSeasonCappedTpe)) - 40) + " TPE has been removed from your update to keep you from going over the cap. Check the information panel to the right for information on capped TPE.")
    }
    if (cappedTotal + parseInt(currentSeasonCappedTpe) >= 40) {
      cappedTotal = 40 - parseInt(currentSeasonCappedTpe);
      cappedTpe = cappedTotal - prevCappedTotal;
      // change tpe that brought us over the cap to the new value
      $('#' + i + 'cappedTpe').val(cappedTpe);
    }

    totalTpeAvailable += cappedTpe + uncappedTpe;
  }

  $('#tpeAvailable').val(totalTpeAvailable);
}

function verifyCurrentCappedTpe() {
  var prevCappedTpe = $('#currentSeasonCappedTpe').val();

  if (!$.isNumeric(prevCappedTpe)) {
    alert("You need to give a valid number for Current Season Capped TPE");
    return;
  } else if (parseInt(prevCappedTpe) > 40) {
    $('#currentSeasonCappedTpe').val(40)
    alert("You cannot have more than 40 capped TPE.")
  } else if (parseInt(prevCappedTpe) < 0) {
    $('#currentSeasonCappedTpe').val(0)
    alert("You cannot have negative TPE.")
  }
}

function getRowsInUpdateTable() {
  return $('#updatesTable tr').length;
}
