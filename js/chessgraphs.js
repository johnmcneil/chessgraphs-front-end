// contents-
// 0. variables
// 1. chart-multiple-players.js
// 2. make-data-table.js
// 3. make-chart.js
// 4. process-get-request-result
// 5. browser-targeting.js

// 0. variables

// show/hide elements
var showHowManyPlayersForm = false; 
var showLastFirstMessage = true;
var showShareButtons = false;
var showAddOneRemoveLastButtons = false;

$(document).ready(function() {
    if ( showHowManyPlayersForm ) {} else { $("#choose-number-of-players-form").hide(); }
    if ( showLastFirstMessage ) {} else { $("#last-first-message").hide(); }
    if ( showAddOneRemoveLastButtons ) {} else { $("#add-player-button, #remove-last-player-button").hide(); }
});

var plusButton = "<input class=\"add-next-input-button\" name=\"add-next-input\" value=\"+\" onclick=\"addNextInput(this)\" type=\"button\" />";
var minusButton = "<input class=\"remove-this-input-button\" name=\"remove-this-input\" value=\"-\" onclick=\"removeThisInput(this)\" type=\"button\" />";

// graph
var numberOfPlayersToGraph = 2;
var today = new Date();
var thisMonth = today.getMonth();
var lastYear = today.getFullYear() - 1;
var yearAgo = new Date(lastYear, thisMonth);
var threeYearsAgo = today.getFullYear() - 3;
var threeYearsAgoMonth = new Date(threeYearsAgo, thisMonth);
var colors = ["red","green","blue","black","brown","blueviolet","cadetblue","coral","darkgreen","orange","grey","goldenrod","maroon","seagreen","yellow","yellowgreen", "fuchsia", "purple", "teal", "navy"];

// colors
// text
var textHighlightColor = "white";
var textNonHighlightColor = "black";

// input section heading
var sectionHighlightColor = "teal";
var sectionNonHighlightColor = "#a6a6a6";
var sectionHoverColor = "#4d4d4d";

// toggle speeds
var sectionToggleSpeed = 10;
var moreFewerToggleSpeed = 0;
var caretToggleSpeed = 0;
var rankingFormatToggleSpeed = 0;

// buttons
var buttonHoverColor = "#4d4d4d";
// var radioButtonActiveColor = "#415555";
var radioButtonActiveColor = "#4d4d4d";
var radioButtonInactiveColor = "#e6e6e6";

// tables
var tableHighlightColor = "#4d4d4d";

// html color chocolate with saturation 35%, lightness 35%
// var tableCheckedColor = "#78543a";
// var tableCheckedColor = "#415555";
var tableCheckedColor = "#4d4d4d";


var tableStripedRow = "#e6e6e6";
var tableNonStripedRow = "white";

// datatable
var scrollIntoViewSpeed = "instant"; /* other options: "smooth", "auto" */
var scrollIntoViewBlock = "nearest"; /* other options: "start", "center", "end" */


function stripeRows(uncheckedRows) {
    for ( i = 0; i<uncheckedRows.length; i++ ) {
        // if rowIndex is even, make it striped; if rowIndex is odd, make it white
        if ( uncheckedRows[i].rowIndex % 2 == 0 ) { 
            uncheckedRows[i].style.backgroundColor = tableStripedRow;
        } else { 
            uncheckedRows[i].style.backgroundColor = tableNonStripedRow; 
        }
    }
}

// 1. chart-multiple-players.js 
topThisMonthData = JSON.parse(topThisMonthJSON);

// ajax request to load world champions data
$.ajax({
    type: "POST",
    url : "json/w_champs_standard.json",
    dataType: "JSON",
    success: function(data) {
        wChampsData = data;
    },
    error:function() {
    },
    complete:function() {
    }
});

// ajax request to load uscf top this month rating histories
$.ajax({
    type: "POST",
    url: "json/uscf_top_twenty_rating_histories.json",
    dataType: "JSON",
    success: function(data) {
        uscfTopTwenty = data;
        // console.log("success for ajax request for uscf top twenty json.");
        // console.log("uscfTopTwenty", uscfTopTwenty);
    },
    error: function() {
        // console.log("problem with ajax request for uscf top twenty json");
    },
    complete: function() {
    }
});

function slideSection(sectionToSlide) {
    // show the div with the arrows in it
    $(".section-title-carets").show();

    sections = $("section");

    // get an array of the section ids
    sectionIds = [];
    for ( i = 0; i < sections.length; i++ ) {
        sectionIds.push(sections[i].id);
    }

    // check whether the parameter sectionToSlide is one of those ids
    validInput = false;
    for ( i = 0; i < sectionIds.length; i++ ) {
        if ( sectionIds[i] === sectionToSlide ) { 
            validInput = true;
        }
    }
    if ( validInput !== true ) { 
        
    } else { 
        for ( i = 0; i < sectionIds.length; i++ ) {
            if ( sectionIds[i] === sectionToSlide ) { 
                
                $("#" + sectionIds[i] + " .section-content").show();
                $("#" + sectionIds[i] + " .fa-caret-down").hide();
            } else {
                $("#" + sectionIds[i] + " .section-content").hide();
                $("#" + sectionIds[i] + " .fa-caret-up").hide();
            }
        }
    }
}


function hideAllSections() {
    sections = $("section");
    var sectionIds = [];
    for ( i = 0; i < sections.length; i++ ) {
        sectionIds.push(sections[i].id);
    }

    for ( i = 0; i<sectionIds.length; i++ ) {
        $("#" + sectionIds[i] + " .section-content").hide();
        $("#" + sectionIds[i] + " .fa-caret-up").hide();
        $("#" + sectionIds[i] + " .fa-caret-down").show();
    }
}

// radios to pick which format under top this month section

// first show fide and hide uscf
$("#top-this-month-fide").show();
$("#top-format-option-fide").css({"background-color": radioButtonActiveColor, "color": textHighlightColor});
$("#top-this-month-uscf").hide();
$("#top-format-option-uscf").css({"background-color": radioButtonInactiveColor, "color": textNonHighlightColor});


// on hover, highlight them
$("div.top-format-option").hover(function() {
    $(this).css({"background-color": buttonHoverColor, "color": textHighlightColor});
    }, function(){
        if ( this.children[0].children[0].checked ) { 
            $(this).css({"background-color": radioButtonActiveColor, "color": textHighlightColor}); 
        } else { 
            $(this).css({"background-color": radioButtonInactiveColor, "color": textNonHighlightColor}); 
        }
});


// when a radio is clicked, toggle both uscf and fide.
$("#ranking-format-radios input[name=format]").click(function() {
    // console.log("this", this);
    var selectedFormatValue = this.value;
    // console.log("selectedFormatValue", selectedFormatValue);

    var nameListSelector = "#top-this-month-" + selectedFormatValue;

   //  console.log("$(nameListSelector)[0].style.display)", $(nameListSelector)[0].style.display);


    if ( $(nameListSelector)[0].style.display == "none" ) {
        var radioAlreadySelected = false;        
    } else { var radioAlreadySelected = true; }

    // if the radio that got clicked is already displayed, do nothing. else, toggle
    if ( radioAlreadySelected ) { 
    } else { 
        $("#top-this-month-uscf, #top-this-month-fide").toggle(rankingFormatToggleSpeed);

        
        // color the one that is checked
        if ( $("#uscf-radio").is(":checked") ) {
            // console.log("you just checked #top-this-month-uscf");
            $("#top-format-option-uscf").css({"background-color": radioButtonActiveColor, "color": textHighlightColor});
            $("#top-format-option-fide").css({"background-color": radioButtonInactiveColor, "color": textNonHighlightColor});
        }

        if ( $("#fide-radio").is(":checked") ) {
            $("#top-format-option-fide").css({"background-color": radioButtonActiveColor, "color": textHighlightColor});
            $("#top-format-option-uscf").css({"background-color": radioButtonInactiveColor, "color": textNonHighlightColor});
        }

        // see how many are checked
        if ( $("#fide-radio").is(":checked") ) {
            howManyChecked = 0;
            var checked = $("#top-this-month-fide input[type=checkbox]");
            for (i = 0; i < checked.length; i++ ) {
                if ( checked[i].checked ) {
                    howManyChecked = howManyChecked + 1;
                } else {}
            }
            // console.log("variable checked after loop", checked);
            
        } else {
            if ( $("#uscf-radio").is(":checked")  ) {
                howManyChecked = 0;
                var checked = $("#top-this-month-uscf input[type=checkbox]");
                for (i = 0; i < checked.length; i++ ) {
                    if ( checked[i].checked ) {
                        howManyChecked = howManyChecked + 1;
                    } else {}
                }
                // console.log("variable checked after loop", checked);
                
            }            
        }

        // if none are checked, check the first n
        if ( howManyChecked == 0 ) {
            if ( $("#fide-radio").is(":checked") ) {               
                visibleCheckBoxes = $("#top-this-month-fide .top-this-month-cbox");
            } else {
                if ( $("#uscf-radio").is(":checked") ) {
                    visibleCheckBoxes = $("#top-this-month-uscf .top-this-month-cbox");
                }
            }
          
            
            for ( i = 0; i < numberOfPlayersToGraph; i++ ) {
                checkThis = visibleCheckBoxes[i];
               
                checkThis.checked = true;
            }

            // highlight the rows we checked 
            $("input.top-this-month-cbox:checked").parent().parent().css({"background-color": tableCheckedColor });
            $("input.top-this-month-cbox:checked").parent().parent().children().children().css("color", textHighlightColor);
        }

        // graph what's checked for fide
        if ( $("#top-this-month-fide").is(":visible") ) {
            var topThisMonthTitle = "This Month's Top Players - FIDE Standard Ratings";
            var names = [];
            var checked = $("#top-this-month-form-fide input[type=checkbox]");
            for (i = 0; i < checked.length; i++ ) {
                if ( $(checked[i]).prop('checked') ) {
                    var thisName = checked[i].value;
                    names.push(thisName);
                } else {}
            }



            // this prepares the data for the players checked     
            var selectedData = [];
            for ( i = 0; i < topThisMonthData.length; i++ ) {
                fullName = topThisMonthData[i].lastName + ", " + topThisMonthData[i].firstName;
                for ( j = 0; j < names.length; j++ ) {
                    if ( fullName === names[j] ) { 
                        selectedData.push(topThisMonthData[i]);
                    } else {}
                }
            }
            makeChart(selectedData, threeYearsAgoMonth, null, 2700, null, topThisMonthTitle);
        }

        // graph what's checked for uscf
        if ( $("#top-this-month-uscf").is(":visible") ) {
            var topThisMonthTitle = "This Month's Top Players - USCF Regular Ratings";
            var nameInput = $("#top-this-month-form-uscf").serialize();
            var formURL = $("#top-this-month-form-uscf").attr("action");

            var ids = [];
            var checked = $("#top-this-month-form-uscf input[type=checkbox]");
            for (i = 0; i < checked.length; i++ ) {
                if ( $(checked[i]).prop('checked') ) {
                    var thisId = checked[i].value;
                    ids.push(thisId);
                } else {}
            }
            // console.log("ids", ids);
            // console.log("uscfTopTwenty", uscfTopTwenty);



            var selectedData = [];
            for ( i = 0; i < uscfTopTwenty.length; i++ ) {
                for ( j = 0; j < ids.length; j++ ) {
                    if ( uscfTopTwenty[i].uscfId == ids[j] ) { 
                        selectedData.push(uscfTopTwenty[i]);
                    } else {}
                }

            }

            // console.log("selectedData", selectedData);

            makeChart(selectedData, threeYearsAgoMonth, null, 2700, null, topThisMonthTitle);
        }
    }
});

// when a section heading is hovered, set hover color and background color
$(".section-title-container").hover(function(){
        $(this).css("background-color", sectionHoverColor);
        $(this).children().css("color", textHighlightColor);
    },
    function() {
        var sectionSelected = true;
        if ( $(this).siblings(".section-content").css("display") == "none" ) { sectionSelected = false; }

        if ( sectionSelected ) {
            $(this).css("background-color", sectionHighlightColor);
            $(this).children().css("color", textHighlightColor);
        } else {
            $(this).css("background-color", sectionNonHighlightColor);
            $(this).children().css("color", textNonHighlightColor);
        }
    });

// click on section titles to toggle hiding or showing the contents of that section
$("#rankings .section-title-container").click(function() {
    // remove div#disambig-container if it's there
    $("#disambig-container").remove();

    // toggle the contents of the section
    if ( $("#rankings .section-content").is(":visible") && $(window).width() < 401 ) {
    } else {
       
        $("#rankings .section-content").toggle(sectionToggleSpeed, function() {
            // console.log("inside jquery to toggle the ranking section content.")
            // this callback function graphs the checked top players this month

            fideChecked = false;
            uscfChecked = false;

            if ( $("#fide-radio").prop("checked")  ) {
                fideChecked = true;
                var topThisMonthTitle = "This Month's Top Players - FIDE Standard Ratings";    
            } else if( $("#uscf-radio").prop("checked")  ) {
                uscfChecked = true; 
                var topThisMonthTitle = "This Month's Top Players - USCF Regular Ratings";   
            }

            
            howManyChecked = 0;
            if ( fideChecked ) { var checked = $("#top-this-month-form-fide input[type=checkbox]"); }
            if ( uscfChecked ) { var checked = $("#top-this-month-form-uscf input[type=checkbox]"); }

            // console.log("variable checked before loop", checked);

            for (i = 0; i < checked.length; i++ ) {
                if ( $(checked[i]).prop("checked") ) {
                    howManyChecked = howManyChecked + 1;
                } else {}
            // console.log("variable checked after loop", checked);
            }
            
            // if none are checked, check the first n
            if ( howManyChecked == 0 ) {
                // check the first n
                // like this kind of  $(".w-champ-cbox").first().prop("checked", "true");
                for ( i = 0; i < numberOfPlayersToGraph; i++ ) {
                    if ( fideChecked ) { checkThis = $("#top-this-month-fide .top-this-month-cbox")[i]; }
                    if ( uscfChecked ) { checkThis = $("#top-this-month-uscf .top-this-month-cbox")[i]; }
                    $(checkThis).prop("checked","true");
                }

                // highlight the rows we checked 
                $("input.top-this-month-cbox:checked").parent().parent().css({"background-color": tableCheckedColor });         
                $("input.top-this-month-cbox:checked").parent().parent().children().children().css({"color": textHighlightColor });
            }

            var names = [];
            for (i = 0; i < checked.length; i++ ) {
                if ( $(checked[i]).prop('checked') ) {
                    var thisName = checked[i].value;
                    names.push(thisName);
                } else {}
            }
              
            // this prepares the data for the players checked     
            var selectedData = [];
            if ( fideChecked ) {
                for ( i = 0; i < topThisMonthData.length; i++ ) {
                    fullName = topThisMonthData[i].lastName + ", " + topThisMonthData[i].firstName;
                    for ( j = 0; j < names.length; j++ ) {
                        if ( fullName === names[j] ) { 
                            selectedData.push(topThisMonthData[i]);
                        } else {}
                    }
                }
            }
            if ( uscfChecked ) {
                for ( i = 0; i < uscfTopTwenty.length; i++ ) {

                    for ( j = 0; j < names.length; j++ ) {
                        if ( uscfTopTwenty[i].uscfId === parseInt(names[j]) ) {
                            selectedData.push(uscfTopTwenty[i]);
                        } 
                    }
                }
            }            
        makeChart(selectedData, threeYearsAgoMonth, null, 2700, null, topThisMonthTitle);
        });
    }

    $("#world-champions .section-content").hide(sectionToggleSpeed);
    $("#text-input .section-content").hide(sectionToggleSpeed);
    $("#about .section-content").hide(sectionToggleSpeed);
    $("#donate .section-content").hide(sectionToggleSpeed);

    // highlight the color of the section title, un-highlight the other sections
    $("#rankings .section-title-container").css({"background-color": sectionHighlightColor, "color" : textHighlightColor } );
    $("#rankings h1, #rankings .section-title-carets").css({"color" : textHighlightColor } );
    
    $("#world-champions .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
    $("#world-champions h1, #world-champions .section-title-carets").css({"color": textNonHighlightColor});

    $("#text-input .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
    $("#text-input h1, #text-input .section-title-carets").css({"color": textNonHighlightColor });

    $("#about .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
    $("#about h1, #about .section-title-carets").css({"color": textNonHighlightColor });

    $("#donate .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
    $("#donate h1, #about .section-title-carets").css({"color": textNonHighlightColor });

});

$("#world-champions .section-title-container").click(function() {
    // remove div#disambig-container if it's there
    $("#disambig-container").remove();

    // toggle the contents of the section
    if ( $("#world-champions .section-content").is(":visible") && $(window).width() < 401 ) {
    } else {
        
        // toggle the contents of the section
        $("#rankings .section-content").hide(sectionToggleSpeed);
        $("#world-champions .section-content").toggle(sectionToggleSpeed, function() {
            // this callback function graphs the checked world champions

            // this checks the current world champion
            $(".w-champ-cbox").first().prop("checked", "true");

            // rows with checked boxes should be highlighted
            $("input.w-champ-cbox:checked").parent().parent().css({"background-color": tableCheckedColor });           
            $("input.w-champ-cbox:checked").parent().parent().children().children().css("color", textHighlightColor);

            wChampName = $(".w-champ-cbox").first()[0].value;

            var wChampTitle = "World Champion Standard Rating History";
            var names = [];

            var checked = $("#w-champ-form input[type=checkbox]");
            for (i = 0; i < checked.length; i++ ) {
                if ( $(checked[i]).prop('checked') ) {
                    var thisName = checked[i].value;
                    names.push(thisName);
                } else {}
            }

            var selectedData = [];
            for ( i = 0; i < wChampsData.length; i++ ) {
                fullName = wChampsData[i].lastName + ", " + wChampsData[i].firstName;
                for ( j = 0; j < names.length; j++ ) {
                    if ( fullName === names[j] ) { 
                        selectedData.push(wChampsData[i]);
                    } else {}
                }
            }
            makeChart(selectedData, null, null, null, null, wChampTitle);
            $("#share-ask").html("Please share chessgraphs.com to keep it going strong.");                      
                
        });
    }
    $("#text-input .section-content").hide(sectionToggleSpeed);
    $("#about .section-content").hide(sectionToggleSpeed);
    $("#donate .section-content").hide(sectionToggleSpeed);



    // highlight the color of the section title, un-highlight the other sections
    $("#rankings .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
    $("#rankings h1, #rankings .section-title-carets").css({"color" : textNonHighlightColor } );

    $("#world-champions .section-title-container").css({"background-color": sectionHighlightColor, "color": textHighlightColor});
    $("#world-champions h1, #world-champions .section-title-carets").css({"color" : textHighlightColor } );

    $("#text-input .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
    $("#text-input h1, #text-input .section-title-carets").css({"color" : textNonHighlightColor } );

    $("#about .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
    $("#about h1, #about .section-title-carets").css({"color" : textNonHighlightColor } );

    $("#donate .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
    $("#donate h1, #about .section-title-carets").css({"color" : textNonHighlightColor } );
});

$("#text-input .section-title-container").click(function() {

    // toggle the contents of the section
    if ( $("#text-input .section-content").is(":visible")  && $(window).width() < 401 ) {
    } else {

        // toggle the contents of this section
        $("#rankings .section-content").hide(sectionToggleSpeed);
        $("#world-champions .section-content").hide(sectionToggleSpeed);
        $("#text-input .section-content").toggle(sectionToggleSpeed);
        $("#about .section-content").hide(sectionToggleSpeed);
        $("#donate .section-content").hide(sectionToggleSpeed);

        // highlight the color of the section title, un-highlight the other sections
        $("#rankings .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
        $("#rankings h1, #rankings .section-title-carets").css({"color" : textNonHighlightColor } );

        $("#world-champions .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
        $("#world-champions h1, #world-champions .section-title-carets").css({"color" : textNonHighlightColor } );

        $("#text-input .section-title-container").css({"background-color": sectionHighlightColor, "color": textHighlightColor });
        $("#text-input h1, #text-input .section-title-carets").css({"color" : textHighlightColor } );

        $("#about .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
        $("#about h1, #about .section-title-carets").css({"color" : textNonHighlightColor } );

        $("#donate .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
        $("#donate h1, #about .section-title-carets").css({"color" : textNonHighlightColor } );
    }        
});

$("#about .section-title-container").click(function() {

    // toggle the contents of the section
    if ( $("#about .section-content").is(":visible")  && $(window).width() < 401 ) {
    } else {
        
        // toggle the contents of this section
        $("#rankings .section-content").hide(sectionToggleSpeed);
        $("#world-champions .section-content").hide(sectionToggleSpeed);
        $("#text-input .section-content").hide(sectionToggleSpeed);
        $("#donate .section-content").hide(sectionToggleSpeed);
        $("#about .section-content").toggle(sectionToggleSpeed);

        // highlight the color of the section title, un-highlight the other sections
        $("#rankings .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
        $("#rankings h1, #rankings .section-title-carets").css({"color" : textNonHighlightColor } );

        $("#world-champions .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
        $("#world-champions h1, #world-champions .section-title-carets").css({"color" : textNonHighlightColor } );

        $("#text-input .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
        $("#text-input h1, #text-input .section-title-carets").css({"color" : textNonHighlightColor } );

        $("#donate .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
        $("#donate h1, #text-input .section-title-carets").css({"color" : textNonHighlightColor } );


        $("#about .section-title-container").css({"background-color": sectionHighlightColor, "color": textHighlightColor});
        $("#about h1, #about .section-title-carets").css({"color" : textHighlightColor } );
    }
});

$("#donate .section-title-container").click(function() {

    // toggle the contents of the section
    if ( $("#donate .section-content").is(":visible")  && $(window).width() < 401 ) {
    } else {
        
        // toggle the contents of this section
        $("#rankings .section-content").hide(sectionToggleSpeed);
        $("#world-champions .section-content").hide(sectionToggleSpeed);
        $("#text-input .section-content").hide(sectionToggleSpeed);
        $("#about .section-content").hide(sectionToggleSpeed);
        $("#donate .section-content").toggle(sectionToggleSpeed);

        // highlight the color of the section title, un-highlight the other sections
        $("#rankings .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
        $("#rankings h1, #rankings .section-title-carets").css({"color" : textNonHighlightColor } );

        $("#world-champions .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
        $("#world-champions h1, #world-champions .section-title-carets").css({"color" : textNonHighlightColor } );

        $("#text-input .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
        $("#text-input h1, #text-input .section-title-carets").css({"color" : textNonHighlightColor } );

        $("#about .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
        $("#about h1, #text-input .section-title-carets").css({"color" : textNonHighlightColor } );

        $("#donate .section-title-container").css({"background-color": sectionHighlightColor, "color": textHighlightColor});
        $("#donate h1, #about .section-title-carets").css({"color" : textHighlightColor } );
    }
});

// these functions add or remove the data list. use when switching between fide and uscf radio options
function removeFideDataList() {
    // console.log("removeFideDataList fired");
    $(".name-input-p input").removeAttr("list");
}

function attachFideDataList() {
    // console.log("attachFideDataList fired");
    $(".name-input-p input").attr("list", "players-list");
}

function autocompleteFix() {
    formatSelected = document.getElementById("format-select").value;
    console.log(formatSelected, "formatSelected");
    if ( formatSelected == "fide-standard" || formatSelected == "fide-rapid" || formatSelected == "fide-blitz" || formatSelected == "urs") {
        attachFideDataList();
    } else { removeFideDataList(); }
}

// this function creates the asked for number of name input fields
function numberOfNameInputs(n) {

    $("#enter-player-names").html("");
    $("#enter-player-names").append("<div id=\"name-inputs\"></div>");

    for (var i = 0; i < n; i++) {
        iDisplayed = i + 1;
        if ( i == 0 ) { 
            // var autocompleteMessage = "<p id=\"auto-complete-message\">Autocomplete for all titled players.</p>";
            // $("#name-inputs").append(autocompleteMessage);
            var lastFirstMessage = "<p id=\"last-first-message\">FIDE#, USCF#, or \"Last, First\":</p>";
            $("#name-inputs").append(lastFirstMessage);
        }

        var nameInput = "<p class=\"name-input-p\" id=\"name-input-p-" + i + "\">";
        var nameInput = nameInput + "<input name=\"name[" + i +"]\" list=\"players-list\" type=\"text\" size=\"1\"";
        
        // this adds autofocus to the first name input
        // stopped doing this once checkboxes added
        if ( i == 0 ) { nameInput = nameInput + " autofocus"; }

        // if there's one name input, make it required for submitting the form
        if ( n == 1 ) { var nameInput = nameInput + " required";}

        // this closes the <input> attribute and adds the plus and minus buttons
        var nameInput = nameInput + " />" + plusButton + minusButton;

        // close the paragraph holding a name input
        var nameInput = nameInput + "</p>";
       
        $("#name-inputs").append(nameInput);
    }

    

    var pickFormatDiv = "<div id=\"pick-format\"></div>";
    $("#enter-player-names").append(pickFormatDiv);


    // another way to pick format - with a dropdown box instead of radio options
    var pickFormatSelectBox = "<p>Rating format:</p><select id=\"format-select\" name=\"format\" form=\"input-form\" onchange=\"autocompleteFix()\"><option value=\"fide-standard\">FIDE Standard</option>";
    var pickFormatSelectBox = pickFormatSelectBox + "<option value=\"fide-rapid\">FIDE Rapid</option>";
    var pickFormatSelectBox = pickFormatSelectBox + "<option value=\"fide-blitz\">FIDE Blitz</option>";
    var pickFormatSelectBox = pickFormatSelectBox + "<option value=\"uscf-regular\">USCF Regular</option>";
    var pickFormatSelectBox = pickFormatSelectBox + "<option value=\"uscf-regular-tourn\">USCF Regular by tournament</option>";
    var pickFormatSelectBox = pickFormatSelectBox + "<option value=\"uscf-quick\">USCF Quick</option>";
    var pickFormatSelectBox = pickFormatSelectBox + "<option value=\"uscf-quick-tourn\">USCF Quick by tournament</option>";
    var pickFormatSelectBox = pickFormatSelectBox + "<option value=\"uscf-blitz\">USCF Blitz</option>";
    var pickFormatSelectBox = pickFormatSelectBox + "<option value=\"uscf-blitz-tourn\">USCF Blitz by tournament</option>";
    var pickFormatSelectBox = pickFormatSelectBox + "<option value=\"uscf-corresp\">USCF Correspondence</option>";
    var pickFormatSelectBox = pickFormatSelectBox + "<option value=\"urs\">URS</option>";
    var pickFormatSelectBox = pickFormatSelectBox + "</select>"; 

    $("#pick-format").append(pickFormatSelectBox);

    // this handles the toggling of the rater choice (FIDE or USCF).
    // the format options for the selected rater should be displayed
    $("#pick-rater input[type=radio]").change(function() {
        if ( this.value == "fide" ) {
            $("#fide-radios").show();
            $("#uscf-radios").hide();

            if ( formatFirstFour == "fide" || formatFirstFour == "urs" ) {
                // console.log("you clicked fide and the format graphed starts with fide");
                // if format starts with fide, check the radio for format
                formatOptions = $("#pick-format input"); 
                //console.log("formatOptions", formatOptions);
                for ( i = 0; i < formatOptions.length; i++ ) {
                    if ( formatOptions[i].value == format ) {
                        // console.log("here's the input to check: ", formatOptions[i]);
                        formatOptions[i].checked = true;
                    } else {}
                }
            } else {
                // otherwise check fide-standard as a default
                $("#format-radio-fide-standard").prop("checked", true);
            }
        }

        if ( this.value == "uscf" ) {
            $("#fide-radios").hide();
            $("#uscf-radios").show();

            if ( formatFirstFour == "uscf" ) {
                // if format starts with uscf, check the radio for format
                formatOptions = $("#pick-format input"); 
                for ( i = 0; i < formatOptions.length; i++ ) {
                    if ( formatOptions[i].value == format ) {
                        // console.log("here's the input to check: ", formatOptions[i]);
                        formatOptions[i].checked = true;
                    } else {}
                }
            } else {
                // otherwise check uscf-regular as a default
                $("#format-radio-uscf-regular").prop("checked", true);

            }
        }
    });

    // check the correct rater radio when the page loads
    // console.log("format", format);
    var formatFirstFour = format.substr(0, 4);
    //console.log("here's formatFirstFour", formatFirstFour);
    
    if ( formatFirstFour == "fide" || formatFirstFour == "urs" ) { 
        $("#fide-radios").show(); 
        $("#uscf-radios").hide();
        $("#rater-radio-fide").prop("checked", true);
    } 
    if ( formatFirstFour == "uscf" ) {
        $("#fide-radios").hide();
        $("#uscf-radios").show();
        $("#rater-radio-uscf").prop("checked", true);
    }


    // use this for format selection with the dropdown box
    formatOptions = $("div#pick-format select option");
    for ( i = 0; i < formatOptions.length; i++ ) {
        if ( formatOptions[i].value == format ) {
            selector = "div#pick-format select option:eq(" + i + ")";
            selectThis = $(selector);
            selectThis.prop("selected", "true");
            if ( formatFirstFour == "fide" || format == "urs") { attachFideDataList(); }
            if ( formatFirstFour == "uscf" ) { removeFideDataList(); }
        } else {}
    }

    // prepend the "Remove Last Player" button to remove the last name input in the form
    var removePlayer = "<input type=\"button\" id=\"remove-last-player-button\" name=\"remove-last-player\" value=\"Remove Last Player\" onclick=\"removeLastNameInput()\" />";
    $("#enter-player-names").prepend(removePlayer);


    // prepend the "Add One Player" button to add one name input to the form
    var addPlayer = "<input type=\"button\" id=\"add-player-button\" name=\"add-player\" value=\"Add One Player\" onclick=\"addOneNameInput()\" />";
    $("#enter-player-names").prepend(addPlayer);

    // append the submit button
    $("#enter-player-names").append("<p id=\"submit-multi-p\"><input type=\"submit\" id=\"submit-multi\" value=\"Submit\" /></p>");    

} // numberOfNameInputs function ends here


// this fires when "go" is clicked on the number of players input. 
// it calls the numberOfNameInputs function to create the right number of inputs
$("#choose-number-of-players-form").submit(function(e) {
    e.preventDefault();

    // get the format that's currently checked
    // we need that to keep it checked and determine whether to use the fide player names data list
    var formatChecked = "";
    var formatRadios = $("#pick-format input");
    // console.log("formatRadios", formatRadios);

    for ( var f = 0; f < formatRadios.length; f++ ) {
        // console.log("formatRadios[f]", formatRadios[f]);
        if ( formatRadios[f].checked == true ) {
            formatChecked = formatRadios[f].value;
            // console.log("this format radio is checked", formatRadios[i]);
        }
    }

    // console.log("formatChecked", formatChecked);

    var n = $("#input-number-of-players").val();
    numberOfNameInputs(n);

    // check the format radio that was checked prior to "go" being clicked
    for ( f = 0; f < formatRadios.length; f++ ) {
        if ( formatRadios[f].value == formatChecked ) {
            id = "format-radio-" + formatChecked;
            elem = document.getElementById(id);
            elem.checked = true;
            // console.log("this should be checked", formatRadios[f]);
        }
    }

    if ( formatChecked == "uscf-regular" || formatChecked == "uscf-regular-tourn" ||
         formatChecked == "uscf-quick" || formatChecked == "uscf-quick-tourn" ||
         formatChecked == "uscf-blitz" || formatChecked == "uscf-blitz-tourn" ||
         formatChecked == "uscf-corresp" ) {
        removeFideDataList();
    } else { 
        attachFideDataList(); 
    }

});

// this function adds one name input. Fires when "Add One Player" button clicked
function addOneNameInput() {
    // this finds the number of name inputs currently. 
    var n = $(".name-input-p").length;

    // you can't have more than 10, so check for that
    if ( n >= 10 ) { } else {
        // this adds one to get the displayed player number
        var nDisplayed = n + 1
        
        var anotherNameInput = "<p class=\"name-input-p\" id=\"name-input-p-" + n + "\">";
        var anotherNameInput = anotherNameInput + "<input name=\"name[" + n +"]\" list=\"players-list\" type=\"text\" size=\"1\" />" + plusButton + minusButton + "</p>";
        
        $("#name-inputs").append(anotherNameInput);
    }
}

function addNextInput(thisInput) {
    // find the number of name inputs currently. 
    var n = $(".name-input-p").length;

    // you can't have more than 10, so check for that
    if ( n >= 10 ) { } else {       
        var anotherNameInput = "<p class=\"name-input-p\">";
        var anotherNameInput = anotherNameInput + "<input name=\"name[" + n +"]\" list=\"players-list\" type=\"text\" size=\"1\" />" + plusButton + minusButton + "</p>";

        $(thisInput).parent().after(anotherNameInput);        
    }
}

function removeThisInput(thisInput) {
    // find the number of name inputs currently. 
    var n = $(".name-input-p").length;

    // check if there's only one input now, and if so do nothing
    if ( n == 1 ) {} else {
        $(thisInput).parent().remove();
    }
}

// this function removes the last name input. It fires when "Remove Last Player" button is clicked
function removeLastNameInput () {   
    // this finds the number of name inputs currently
    var n = $(".name-input-p").length;
    if ( n > 1 ) {  
        // subtract one because the number in the id is based on a zero-based array
        var nLessOne = n-1;
        // elliminate the nth .name-input-p
        var nToBeRemovedID = "#name-input-p-" + nLessOne;
        $(nToBeRemovedID).remove();
    } 
    // do nothing if there's only one input
    else {}
}

// handle a click on the world champion checkboxes
$(".w-champ-cbox").click(function() { 
    // rows with checked boxes should be highlighted
    $("input.w-champ-cbox:checked").parent().parent().css({"background-color": tableCheckedColor }); 
    $("input.w-champ-cbox:checked").parent().parent().children().children().css("color", textHighlightColor);

    // rows with unchecked boxes should not be highlighted
    notCheckedRow = $("input.w-champ-cbox:not(:checked)").parent().parent();
    for ( i = 0; i<notCheckedRow.length; i++ ) {
        if ( ( notCheckedRow[i].rowIndex % 2 ) == 0 ) {
            notCheckedRow[i].style.backgroundColor = tableNonStripedRow;
        } else {
            notCheckedRow[i].style.backgroundColor = tableNonStripedRow;
        }
    } 

    $("input.w-champ-cbox:not(:checked)").parent().parent().children().children().css({"color": textNonHighlightColor});

    var wChampTitle = "World Champion Rating History";
    var formURL = $("#w-champ-form").attr("action");
  
    var names = [];
    var checked = $("#w-champ-form input[type=checkbox]");
    for (i = 0; i < checked.length; i++ ) {
        if ( $(checked[i]).prop('checked') ) {
            var thisName = checked[i].value;
            names.push(thisName);
        } else {}
    }
    
    var selectedData = [];
    for ( i = 0; i < wChampsData.length; i++ ) {
        fullName = wChampsData[i].lastName + ", " + wChampsData[i].firstName;
        for ( j = 0; j < names.length; j++ ) {
            if ( fullName === names[j] ) { 
                selectedData.push(wChampsData[i]);
            } else {}
        }
    }
    makeChart(selectedData, null, null, null, null, wChampTitle);
    $("#share-ask").html("Please share chessgraphs.com to keep it going strong."); 


});


// this handles the checking of a top player this month check box (fide)
$("#top-this-month-fide .top-this-month-cbox").click(function() {
    
    // this colors the table rows that are checked
    $("#top-this-month-fide input.top-this-month-cbox:checked").parent().parent().css({"background-color": tableCheckedColor });
    $("#top-this-month-fide input.top-this-month-cbox:checked").parent().parent().children().children().css("color", textHighlightColor);

    // this makes text dark in unchecked rows
    $("#top-this-month-fide input.top-this-month-cbox:not(:checked)").parent().parent().children().children().css({"color": textNonHighlightColor});

    // this stripes rows that aren't checked        
    uncheckedRows = $("#top-this-month-fide input.top-this-month-cbox:not(:checked)").parent().parent();
    // stripeRows(uncheckedRows);
    for ( i = 0; i < uncheckedRows.length; i++ ) {
        uncheckedRows[i].style.backgroundColor = tableNonStripedRow; 
    }

    var topThisMonthTitle = "This Month's Top Players - FIDE Standard Ratings";
    var nameInput = $("#top-this-month-form-fide").serialize();
    var formURL = $("#top-this-month-form-fide").attr("action");

    var names = [];
    var checked = $("#top-this-month-form-fide input[type=checkbox]");
    for (i = 0; i < checked.length; i++ ) {
        if ( $(checked[i]).prop('checked') ) {
            var thisName = checked[i].value;
            names.push(thisName);
        } else {}
    }
    
    var selectedData = [];
    for ( i = 0; i < topThisMonthData.length; i++ ) {
        fullName = topThisMonthData[i].lastName + ", " + topThisMonthData[i].firstName;
        for ( j = 0; j < names.length; j++ ) {
            if ( fullName === names[j] ) { 
                selectedData.push(topThisMonthData[i]);
            } else {}
        }
    }
    makeChart(selectedData, threeYearsAgoMonth, null, 2700, null, topThisMonthTitle); 
});

// this handles the checking of a top player this month check box (uscf)
$("#top-this-month-uscf .top-this-month-cbox").click(function() {
    
    // this colors the table rows that are checked
    $("#top-this-month-uscf input.top-this-month-cbox:checked").parent().parent().css({"background-color": tableCheckedColor });            
    $("#top-this-month-uscf input.top-this-month-cbox:checked").parent().parent().children().children().css("color", textHighlightColor);
    // this stripes rows that aren't checked        
    uncheckedRows = $("#top-this-month-uscf input.top-this-month-cbox:not(:checked)").parent().parent();

    // this makes text dark in unchecked rows
    $("#top-this-month-uscf input.top-this-month-cbox:not(:checked)").parent().parent().children().children().css({"color": textNonHighlightColor});
    
    for ( i=0; i<uncheckedRows.length; i++) {
        uncheckedRows[i].style.backgroundColor = tableNonStripedRow;
    }

    var topThisMonthTitle = "This Month's Top Players - USCF Regular Ratings";
    var nameInput = $("#top-this-month-form-uscf").serialize();
    var formURL = $("#top-this-month-form-uscf").attr("action");

    var ids = [];
    var checked = $("#top-this-month-form-uscf input[type=checkbox]");
    for (i = 0; i < checked.length; i++ ) {
        if ( $(checked[i]).prop('checked') ) {
            var thisId = checked[i].value;
            ids.push(thisId);
        } else {}
    }
    // console.log("ids", ids);
    // console.log("uscfTopTwenty", uscfTopTwenty);
    
    var selectedData = [];
    for ( i = 0; i < uscfTopTwenty.length; i++ ) {
        for ( j = 0; j < ids.length; j++ ) {
//            console.log("uscfTopTwenty[i].uscfId", uscfTopTwenty[i].uscfId);
            if ( uscfTopTwenty[i].uscfId == ids[j] ) { 
                selectedData.push(uscfTopTwenty[i]);
            } else {}
        }
    }

    // console.log("selectedData", selectedData);

    makeChart(selectedData, threeYearsAgoMonth, null, 2700, null, topThisMonthTitle); 
});

// styles for the top this month table
// hover over a table row and the background color changes
$(".top-this-month-row").hover(
    // mouseover
    function() {
        $(this).css({"background-color": tableHighlightColor });
        $(this).children().children().css({ "color": textHighlightColor });
    },
    // mouseleave
    function() {
        trs = $(".top-this-month-row")[0];

        // this colors the table rows that are checked
        $("input.top-this-month-cbox:checked").parent().parent().css({"background-color": tableCheckedColor}); 
        $("input.top-this-month-cbox:checked").parent().parent().children().children().css({"color": textHighlightColor});
        $("input.top-this-month-cbox:not(:checked)").parent().parent().children().children().css({"color": textNonHighlightColor});

        // this fixes the background color of rows
        uncheckedRows = $("input.top-this-month-cbox:not(:checked)").parent().parent();
        
        // this would stripe the rows, if we wanted that
        // stripeRows(uncheckedRows);

        // this makes all rows unstriped
        for ( i = 0; i < uncheckedRows.length; i++ ) {
            uncheckedRows[i].style.backgroundColor = tableNonStripedRow; 
        }
    }
);

// styles for the w champ table
// hover over a table row and the background color changes
$(".w-champ-row").hover(
    // mouseover
    function() {
        $(this).css({"background-color": tableHighlightColor });
        $(this).children().children().css({ "color": textHighlightColor });
    },
    //mouseleave
    function() {
        // this colors the table rows that are checked
        $("input.w-champ-cbox:checked").parent().parent().css({"background-color": tableCheckedColor});
        $("input.w-champ-cbox:checked").parent().parent().children().children().css({"color": textHighlightColor});
        $("input.w-champ-cbox:not(:checked)").parent().parent().children().children().css({"color": textNonHighlightColor});

        // this stripes rows that aren't checked        
        uncheckedRows = $("input.w-champ-cbox:not(:checked)").parent().parent();
        // stripeRows(uncheckedRows);
        for ( i = 0; i < uncheckedRows.length; i++ ) {
            uncheckedRows[i].style.backgroundColor = tableNonStripedRow; 
        }
        
    }
);

// this function clears the checkboxes when button clicked
function clearCheckboxes(section) {
    if ( section == "wChamp" ) { var cboxClass = ".w-champ-cbox"; }
    if ( section == "topThisMonth" ) { var cboxClass = ".top-this-month-cbox"; }
    else {}

    $(cboxClass).prop("checked", false);
    uncheckedRows = $(cboxClass + ":not(:checked)").parent().parent();
    stripeRows(uncheckedRows);
    $(cboxClass).parent().parent().children().children().css("color", textNonHighlightColor);

    document.getElementById("result").innerHTML="";
}

// show more show less links
$("#top-this-month-show-more").click(function() {
    $(".ten-through-twenty").toggle(moreFewerToggleSpeed);
    $("#top-this-month-show-more").hide();
    $("#top-this-month-show-fewer").show();
});

$("#top-this-month-show-fewer").click(function() {
    $(".ten-through-twenty").toggle(moreFewerToggleSpeed);
    $("#top-this-month-show-more").show();
    $("#top-this-month-show-fewer").hide();
});

// ajax request for datalist of players for the input field
$.ajax({
    type:"POST",
    url:"json/player_list_gm_im_fm_wgm_wim_wfm.json",
    dataType:"JSON",
    success: function(result) {
        playerList = result;
        addPlayerList = function() {
            var text = "";
            for (i = 0; i < result.length; i++) {
                text = text + "<option value=\"" + playerList[i] + "\">";
            }
            
            // append datalist, one for all inputs
            var datalist = "<datalist id=\"players-list\"></datalist>";
            $("#input").append(datalist);
            $("#players-list").html(text);    
        }
        addPlayerList();
    },
    error:function(e) {
    },
    complete:function() {}
});

// 2. make-data-table.js
function makeDataTable(data, xMin, xMax, ratingFormat) {

    $("#data-table-container table").remove();
    var xMinString = dateString(xMin);
    var xMaxString = dateString(xMax);
    var lengthLessOne = data.length - 1;

    dataTable = "<div id=\"thead-container\"><table id=\"header-table\"><thead>";

    // add a row of dummy rating values in case the header table columns are narrower than the data table columns
    dataTable = dataTable + "<tr id=\"dummy-ratings-row\"><th></th>";
    for ( var i = 0; i < data.length; i++ ) {
        //dataTable = dataTable + "<th>" + data[i][ratingFormat][0].RATING + "</th>";
        dataTable = dataTable + "<th><pre>0000</pre></th>";
        // if we're on the last player, close this row
        if ( i == lengthLessOne ) { dataTable = dataTable + "</tr>"; }
    }

    // add the row of names in the table header
    dataTable = dataTable + "<tr><th></th>";
    for ( var i = 0; i < data.length; i++ ) {
        // console.log("here's i", i);
        duplicateName = false;

        // check if this player has the same last name as another player being graphed
        for ( j = 0; j < data.length; j++ ) {
            if ( data[i].lastName == data[j].lastName && i != j ) {
                duplicateName = true;
                console.log("duplicate")
            } 

            
            // if they're the same except for Jr / Sr, count that as a duplicate
            if ( data[i].lastName.substr(-2, 2) == "Jr" || data[i].lastName.substr(-2, 2) == "Sr" ) {
                console.log("Jr or Sr detected");
                if ( data[i].lastName.slice(-2, 2) == data[j].lastName.slice(-2, 2) && i != j ) {
                    duplicateName = true;
                    console.log("Jr Sr duplicate");
                }
            }
            
        }
        // console.log("duplicateName", duplicateName);
        if ( duplicateName ) {
            // console.log(data[i].lastName + " has a duplicate");
            dataTable = dataTable + "<th><pre>" + data[i].firstName + "</pre><pre>" + data[i].lastName + "</pre></th>";
        } else {
            dataTable = dataTable + "<th><pre>" + data[i].lastName + "</pre></th>";
        }

        // if we're on the last player, close this row in the table header
        if ( i == lengthLessOne ) { dataTable = dataTable + "</tr>"; }
    }

    dateFormat = "";
    if ( ratingFormat == "uscfRegularRatingHistoryTourn" || ratingFormat == "uscfQuickRatingHistoryTourn" || ratingFormat == "uscfBlitzRatingHistoryTourn" || ratingFormat == "uscfCorrespRatingHistory") {
        dateFormat = "yyyy-mm-dd";
    } else { dateFormat = "yyyy-mm"; }
    // console.log("dateFormat", dateFormat);

    // add a row for the colors of each player in the table header
    dataTable = dataTable + "<tr><th class=\"dummy-cell\"><pre>" + dateFormat + "</pre></th>";
    for ( var i = 0; i < data.length; i++ ) {
        dataTable = dataTable + "<th><div class=\"player-color-in-table\" style=\"background-color:" + colors[i] + "\"></div></th>";
        // if we're on the last player, close this row in the table header
        if ( i == lengthLessOne ) { dataTable = dataTable + "</tr>"; }
    }

    // close the table header
    dataTable = dataTable + "</thead></table></div>";

    // make an array of all dates we have rating data for in order
    dates = [];

    if ( ratingFormat == "uscfCorrespRatingHistory" ) {
        // for some reason correspondence rating histories can change more than once per day.
        // so need to deal with that separately to get that in the data table
       
        if ( data.length == 1 ) {
            ratings = [];
            
            // this loops through the rating history of a player
            for ( j = 0; j < data[0][ratingFormat].length; j++ ) {
                
                // this tests whether we're in the date range
                if ( data[0][ratingFormat][j].DATE >= xMinString && data[0][ratingFormat][j].DATE <= xMaxString ) {
                        dates.push(data[0][ratingFormat][j].DATE);
                        ratings.push(data[0][ratingFormat][j].RATING);
                }        
            }

            ratingsDescendingOrder = [];
            for ( i = ( ratings.length - 1); i >= 0; i -- ) {
                ratingsDescendingOrder.push(ratings[i]);
            }

        } else {
            correspPlayers = [];
            for ( i = 0; i < data.length; i++ ) {
                playerDateAndRatingList = [];
                for ( j = 0; j < data[i][ratingFormat].length; j++ ) {
                    // test if we're in the date range
                      if ( data[i][ratingFormat][j].DATE >= xMinString && data[i][ratingFormat][j].DATE <= xMaxString ) {
                        playerDateAndRatingList.push( data[i][ratingFormat][j] );
                    }
                }

                correspPlayers.push(playerDateAndRatingList);
            }


            // find the dates that have duplicates for each player.
            datesScratch = [];
            for ( i = 0; i < correspPlayers.length; i++ ) {
                for ( j = 0; j < correspPlayers[i].length; j++ ) {
                    for ( k = 0; k < correspPlayers[i].length; k++ ) {
                        if ( correspPlayers[i][j].DATE == correspPlayers[i][k].DATE && j != k ) {
                            datesScratch.push( correspPlayers[i][j].DATE );
                        }
                    }
                }
            }
            datesScratch.sort();
            datesWithDuplicates = [];

            for ( i = 0; i < datesScratch.length; i++ ) {
                if ( i == 0 || datesScratch[i] != datesScratch[i-1] ) {
                    dup = { date: datesScratch[i] };
                    datesWithDuplicates.push(dup);
                }
            }


            for ( h = 0; h < datesWithDuplicates.length; h++ ) {

                for ( i = 0; i < correspPlayers.length; i++ ) {
                    propName = "player_" + i + "_ratings";
                    datesWithDuplicates[h][propName] = [];
                }
            }

            for ( i = 0; i < correspPlayers.length; i++ ) {
                for ( j = 0; j < correspPlayers[i].length; j++ ) {
                    for ( k = 0; k < datesWithDuplicates.length; k++ ) {
                        if ( correspPlayers[i][j].DATE == datesWithDuplicates[k].date) {
                            player_x_ratings = "player_" + i + "_ratings";
                            datesWithDuplicates[k][player_x_ratings].push(correspPlayers[i][j].RATING);
                        }
                    }
                }
            }
        
            // get all dates not duplicated in descending order
            for ( var i = 0; i < data.length; i++ ) {
                for ( j = 0; j < data[i][ratingFormat].length; j++ ) {
                    
                    // this tests whether we're in the date range
                    if ( data[i][ratingFormat][j].DATE >= xMinString && data[i][ratingFormat][j].DATE <= xMaxString ) {
                        alreadyThere = false;
                        
                        // loop through the dates for one player. for each date, if it's already in the dates array, don't add it again.                
                        for ( k = 0; k < dates.length; k++ ) {
                            if ( dates[k] == data[i][ratingFormat][j].DATE ) {
                                alreadyThere = true;

                            }
                        }

                        if ( !alreadyThere ) {
                            dates.push(data[i][ratingFormat][j].DATE);
                        }
                    }
                }
            }
        }

    } else {
        // for rating formats which don't have more than one rating update on a single day
        // this loops through the players
        for ( var i = 0; i < data.length; i++ ) {
            
            // this loops through the rating history of a player
            for ( j = 0; j < data[i][ratingFormat].length; j++ ) {
                
                // this tests whether we're in the date range
                if ( data[i][ratingFormat][j].DATE >= xMinString && data[i][ratingFormat][j].DATE <= xMaxString ) {
                    alreadyThere = false;
                    
                    // loop through the dates for one player. for each date, if it's already in the dates array, don't add it again.                
                    for ( k = 0; k < dates.length; k++ ) {
                        if ( dates[k] == data[i][ratingFormat][j].DATE ) {
                            alreadyThere = true;
                            // console.log("alreadyThere", alreadyThere);
                            // console.log("data[i][ratingFormat][j].DATE", data[i][ratingFormat][j].DATE);
                        }
                    }

                    if ( !alreadyThere ) {
                        dates.push(data[i][ratingFormat][j].DATE);
                    }
                }
            }
        }
    }

    dates.sort();

    datesDescendingOrder = [];
    for ( i = ( dates.length - 1); i >= 0; i-- ) {
        datesDescendingOrder.push(dates[i]);
    }

    // add the table body
    dataTable = dataTable + "<div id=\"tbody-container\"><table id=\"data-table\"><tbody>";

    // this finishes up the data table unless we're dealing with corresp ratings and multiple players
    if ( ratingFormat != "uscfCorrespRatingHistory" || data.length == 1 ) {
        // add data rows and dates to the table
        for ( var i = 0; i < datesDescendingOrder.length; i++ ) {
            dataTable = dataTable + "<tr class=\"tb-row\" id=\"tb-row-" + i + "\"><td class=\"date-cell\"><pre>" + datesDescendingOrder[i] + "</pre></td>";
            for ( j = 0; j < data.length; j++ ) {
                dataTable = dataTable + "<td id=\"row-" + i + "-cell-" + (j + 1) + "\"></td>";
            }
            dataTable = dataTable + "</tr>";
        }

        // close tbody and open thead
        dataTable = dataTable + "</tbody><thead>";

        // add row with player names to even out the column spacing with the header
        dataTable = dataTable + "<tr id=\"dummy-names-row\"><th><pre>" + dateFormat + "</pre></th>";
        for ( var i = 0; i<data.length; i++ ) {
            dataTable = dataTable + "<th><pre>" + data[i].lastName + "</pre></th>";

            // if we're on the last player, close this row in the table header
            if ( i == lengthLessOne ) { dataTable = dataTable + "</tr>"; }
        }

        dataTable = dataTable + "</thead>";
        dataTable = dataTable + "</table></div>";

        $("#data-table-container").append(dataTable);
    }

    if ( ratingFormat == "uscfCorrespRatingHistory" ) {
        if ( data.length == 1 ) {
            for ( k = 0; k < datesDescendingOrder.length; k++ ) {
                cellNumber = 1;
                selector = "#row-" + k + "-cell-" + cellNumber;
                $(selector).html(ratingsDescendingOrder[k]);
            }
        } else {
            allDates = datesDescendingOrder;
            // console.log("allDates", allDates);
            
            rows = [];

            for ( i = 0; i < allDates.length; i++ ) {
                row = {};
                duplicate = false;

                // check if this date is a date with duplicate ratings and if so put that in the row instead
                for ( j = 0; j < datesWithDuplicates.length; j++ ) {
                    if ( allDates[i] == datesWithDuplicates[j]['date'] ) {
                        row = datesWithDuplicates[j];
                        duplicate = true;
                    } 
                }

                if ( duplicate == false ) {
                    
                    row['date'] = allDates[i];

                    for ( h = 0; h < correspPlayers.length; h++ ) {
                        for ( g = 0; g < correspPlayers[h].length; g++ ) {
                            if ( correspPlayers[h][g].DATE == allDates[i] ) {
                                prop = "player_" + h + "_ratings";
                                row_prop_array = [];
                                row_prop_array.push(correspPlayers[h][g].RATING);
                                row[prop] = row_prop_array;
                            }
                        }
                    }
                }

                rows.push(row);
            }

            // console.log("rows before dup_count", rows);

            // add a property to show the dup count for each date
            for ( r = 0; r < rows.length; r++ ) {
                dup_counts = [];
                for ( p = 0; p < correspPlayers.length; p++ ) {
                    prop = "player_" + p + "_ratings";
                    // console.log(prop);
                    if ( rows[r][prop] === undefined || rows[r][prop] === null) {
                        rows[r][prop] = [];
                    }
                    dup_count_player = rows[r][prop].length;
                    dup_counts.push(dup_count_player);
                }

                // console.log("dup_counts", dup_counts);

                max_dups = Math.max(...dup_counts);

                // console.log("max_dups", max_dups);
                rows[r]['dup_count'] = max_dups;
            }


            // console.log("rows", rows);

            // add data rows and dates to the table

            // this makes rows
            for ( var i = 0; i < rows.length; i++ ) {
                // check the duplicate count for the date
                dup_rows = rows[i].dup_count;
                for ( d = 0; d < dup_rows; d++ ) {
                    dataTable = dataTable + "<tr class=\"tb-row\"><td class=\"date-cell\"><pre>" + rows[i].date + "</pre></td>";
                
                    // this makes enough columns for however many players there are
                    for ( j = 0; j < data.length; j++ ) {
                        dataTable = dataTable + "<td class=\"rating-cell\"></td>";
                    }
                    dataTable = dataTable + "</tr>";
                }
            }


            // close tbody and open thead
            dataTable = dataTable + "</tbody><thead>";

            // add row with player names to even out the column spacing with the header
            dataTable = dataTable + "<tr id=\"dummy-names-row\"><th><pre>" + dateFormat + "</pre></th>";
            for ( var i = 0; i<data.length; i++ ) {
                dataTable = dataTable + "<th><pre>" + data[i].lastName + "</pre></th>";

                // if we're on the last player, close this row in the table header
                if ( i == lengthLessOne ) { dataTable = dataTable + "</tr>"; }
            }

            dataTable = dataTable + "</thead>";
            dataTable = dataTable + "</table></div>";

            $("#data-table-container").append(dataTable);

            // add ids to the rows and columns
            trs = document.getElementsByClassName("tb-row");
            for ( i = 0; i < trs.length; i++ ) {
                id = "tb-row-" + i;
                trs[i].id = id;

                // give ids to the rating cells
                tds = trs[i].getElementsByClassName("rating-cell");
                for ( d = 0; d < tds.length; d++ ) {
                    cell_num = d + 1;
                    id = "row-" + i + "-cell-" + cell_num;
                    tds[d].id = id;
                }

            }

            trs = document.getElementsByClassName("tb-row");
            
            // add ratings
            for ( r = 0; r < rows.length; r++ ) {
                //console.log("here's r", r);
                //console.log("here's the date we're dealing with", rows[r].date);

                matching_trs = [];
                for ( t = 0; t < trs.length; t++ ) {
                    tr_date = trs[t].firstChild.firstChild.innerHTML;
                    if ( rows[r].date == tr_date ) {
                        matching_trs.push(trs[t]);
                    }
                }
                //console.log("matching_trs", matching_trs);

                // something's wrong. it's not cycling through the players or ratings for a date.
                for ( m = 0; m < matching_trs.length; m++ ) {
                    //console.log("here's m", m);

                    tds = matching_trs[m].children;
                    //console.log("tds", tds);

                    // loop through players
                    for ( p = 0; p < data.length; p++ ) {
                        //console.log("here's p", p);

                        prop = "player_" + p + "_ratings";
                        //console.log("prop", prop);
                        dup_list = rows[r][prop];
                        dup_list_reversed = [];
                        dup_list_length_less_one = dup_list.length - 1;

                        for ( q = dup_list_length_less_one; q >= 0; q-- ) {
                            dup_list_reversed.push(dup_list[q]);
                        }
                        
                        //console.log("dup_list", dup_list);
                        //console.log("dup_list_reversed", dup_list_reversed);


                        // loop through dup list
                        for ( c = 1; c < tds.length; c++ ) {   
                            //console.log("c", c);
                            //console.log("here's the td we're on - tds[c]", tds[c]);

                            // test if we're in the right cell for that player
                            if ( p + 1 == c ) {                            

                                // if the player has no rating for that date, write a space
                                if ( dup_list.length == 0 ) {
                                    rating = " ";
                                    //console.log("rating", rating);
                                    tds[c].innerHTML = rating;
                                } else {
                                    for ( z = 0; z < dup_list_reversed.length; z++ ) {
                                        // test for the correct duplicate to go in this row
                                        if ( z == m ) {
                                            rating = dup_list_reversed[z];
                                            //console.log("rating", rating);
                                            tds[c].innerHTML = rating;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
        }

    } else {
        for ( var i = 0; i < data.length; i++ ) {
            for ( j = 0; j < data[i][ratingFormat].length; j++ ) {
                for ( k = 0; k < datesDescendingOrder.length; k++ ) {
                    if ( data[i][ratingFormat][j].DATE == datesDescendingOrder[k] ) {
                        cellNumber = i + 1;
                        selector = "#row-" + k + "-cell-" + cellNumber;
                        $(selector).html(data[i][ratingFormat][j].RATING);
                    } else {}
                }
            }
        }
    }
}

// 3. make-chart.js

function dateString(date) {
    year = date.getFullYear();
    month = date.getMonth();
    month = month + 1;
    if ( month < 10 ) { month = "0" + month; } else {}

    stringedDate = year + "-" + month;
    return stringedDate;
}


function makeChart(data, xMin, xMax, yMin, yMax, chartTitle, textInput) {
    // empty chart-container and user-message and disambig-container if any
    $("#chart-container").remove();
    $(".user-message").remove();
   
    // console.log("data", data);

    // this array will hold the data that isn't bad
    var goodData = [];


    var allBadInput = true;
    for ( var i = 0; i < data.length; i++ ) {
        if ( data[i].badInput !== true ) { allBadInput = false; }
    }
   
    var searchHints = ""; 
    if ( allBadInput ) {
        var searchHints = "<p class=\"user-message overall-problem\">There was a problem completing your search. <br />Search by FIDE or USCF ID#, or \"Lastname, Firstname\".</p>";
        $("#result").prepend(searchHints);
        // console.log("searchHints", searchHints);
    }
    
    var userMessage = "";
    // check for bad input
    for ( var i = 0; i < data.length; i++ ) {
        // if one of the names was reported as bad input
        if ( data[i].badInput ) {
            if ( formatFirstFour == "uscf" ) {
                var disambigHref = "http://www.uschess.org/datapage/player-search.php";                
            } else { var disambigHref = "http://ratings.fide.com/"; }

            var userMessage = "<p class=\"user-message\">Input " + (i + 1) + ": \"" + data[i].searchValue + "\" not found in the selected format. <a class=\"check-spelling-link\" href=\"" + disambigHref +"\">Check spelling here.</a></p>";

            // prepend user message to the relevant input field
            // var inputId = "#name-input-p-" + i;
            // $(inputId).prepend(userMessage);

            // append user message to result area
            $("#result").append(userMessage);

        } else {
            goodData.push(data[i]);
        }
    }

    // console.log("goodData", goodData);

    // this tests what format of rating history we have
    if ( goodData[0].standardRatingHistory.length !== 0 ) { var ratingFormat = "standardRatingHistory"; }
    else if ( goodData[0].rapidRatingHistory.length !== 0 ) { var ratingFormat = "rapidRatingHistory"; }
    else if ( goodData[0].blitzRatingHistory.length !== 0 ) { var ratingFormat = "blitzRatingHistory"; }
    else if ( goodData[0].ursRatingHistory.length !== 0) { var ratingFormat = "ursRatingHistory"; }
    else if ( goodData[0].uscfRegularRatingHistoryTourn.length !== 0 ) { var ratingFormat = "uscfRegularRatingHistoryTourn"; }
    else if ( goodData[0].uscfRegularRatingHistory.length !== 0 ) { var ratingFormat = "uscfRegularRatingHistory"; }
    else if ( goodData[0].uscfQuickRatingHistoryTourn.length !== 0 ) { var ratingFormat = "uscfQuickRatingHistoryTourn"; }
    else if ( goodData[0].uscfQuickRatingHistory.length !== 0 ) { var ratingFormat = "uscfQuickRatingHistory"; }
    else if ( goodData[0].uscfBlitzRatingHistoryTourn.length !== 0 ) { var ratingFormat = "uscfBlitzRatingHistoryTourn"; }
    else if ( goodData[0].uscfBlitzRatingHistory.length !== 0 ) { var ratingFormat = "uscfBlitzRatingHistory"; }
    else if ( goodData[0].uscfCorrespRatingHistory.length !== 0 ) { var ratingFormat = "uscfCorrespRatingHistory"; }


    // console.log("ratingFormat", ratingFormat);
    // this parses the strings to javascript dates
    if (ratingFormat == "uscfRegularRatingHistoryTourn" || ratingFormat == "uscfQuickRatingHistoryTourn" || ratingFormat == "uscfBlitzRatingHistoryTourn" || ratingFormat == "uscfCorrespRatingHistory") {                
        // tournament histories have days in the dates too
        var parseDate = d3.time.format("%Y-%m-%d").parse;
        var parseDateText = "d3.time.format(\"%Y-%m-%d\").parse";
    } else {
        var parseDate = d3.time.format("%Y-%m").parse;
        var parseDateText = "d3.time.format(\"%Y-%m\").parse";
    }
    // console.log("parseDateText", parseDateText);    

    // console.log("ratingFormat", ratingFormat);

    // this is the vanilla javascript way of finding lowest, highest dates and ratings
    // these arrays will hold the earliest and latest dates and ratings for all players
    earliestDates = [];
    latestDates = [];

    lowestRatings = [];
    highestRatings = [];

    // this loop gets at the number of goodData points for each player, 
    // highest and lowest ratings, and earliest and latest dates in the goodData
    for (var i = 0; i < goodData.length; i++) {
        // number of goodData points for each player
        numberOfDataPoints = goodData[i][ratingFormat].length;
        // console.log("numberOfDataPoints", numberOfDataPoints);

        // number of goodData points minus one for finding last item in array

        // earliest date for each player
        earliestDate = goodData[i][ratingFormat][0]['DATE'];

        // push to the array of earliest dates for all players
        earliestDates.push(earliestDate);

        // latest date for each player
        latestDate = goodData[i][ratingFormat][numberOfDataPoints - 1]['DATE'];

        // push to the array of latest dates for all players
        latestDates.push(latestDate);

        // find lowest rating for each player
        allRatings = [];

        for (var j = 0; j < numberOfDataPoints; j++) {
            allRatings.push(goodData[i][ratingFormat][j]['RATING']);
        }

        // console.log("allRatings", allRatings);
        
        playerLowestRating = Math.min.apply(null, allRatings);
        // console.log("playerLowestRating", playerLowestRating);

        // push to array of lowest ratings
        lowestRatings.push(playerLowestRating);

        // highest rating for each player
        playerHighestRating = Math.max.apply(null, allRatings);
        // console.log("playerHighestRating", playerHighestRating);

        // push to array of highest ratings
        highestRatings.push(playerHighestRating);
    }

    // find minimum date by taking minimum of earliestDates array
    // console.log("earliestDates", earliestDates);
    earliestDates.sort();
    // console.log("sorted earliestDates", earliestDates);
    minDate = parseDate(earliestDates[0]);
    // console.log("minDate", minDate);

    // find maximum date by taking maximum of latestDates array
    latestDates.sort();
    maxDate = parseDate(latestDates[latestDates.length - 1]);
    // console.log("maxDate", maxDate);

    // find minimum rating by taking minimum of earliestRatings array
    minRating = Math.min.apply(null, lowestRatings);
    // console.log("minRating", minRating);

    // find maximum date by taking maximum of latestDates array
    maxRating = Math.max.apply(null, highestRatings);
    // console.log("maxRating", maxRating);

    // round minRating down to the nearest hunderd and maxRating up to the nearest hundred
    var minRating = Math.floor(minRating/100) * 100;
    var maxRating = Math.ceil(maxRating/100) * 100;

    // if the rating format has days in the dates, "round up" the max date to the next month
    maxDateDate = maxDate.getUTCDate();
    // console.log("xMaxDate", maxDate);

    if ( format == "uscf-regular-tourn" || format == "uscf-blitz-tourn" || format == "uscf-quick-tourn" || format == "uscf-corresp" ) {
        if ( maxDateDate != 0 ) {
            maxDateMonth = maxDate.getMonth();
            // console.log("maxDateMonth", maxDateMonth);

            if ( maxDateMonth != 11 ) {
                maxDateMonth = maxDateMonth + 1;
                // console.log("maxDateMonth plus one", maxDateMonth);

                maxDate.setMonth(maxDateMonth);

                maxDate.setDate(1);

                // console.log("maxDate adjusted", maxDate);

            } else {
                maxDateMonth = 0;
                maxDateYear = maxDate.getUTCFullYear();
                // console.log("maxDateYear", maxDateYear);

                maxDateYear = maxDateYear + 1;
                // console.log("maxDateYear plus one", maxDateYear);

                maxDate.setFullYear(maxDateYear);
                maxDate.setMonth(maxDateMonth);

                maxDate.setDate(1);

                // console.log("maxDate adjusted", maxDate);
            }
        }
    }

    // if there were arguments for xMin, xMax, yMin, and yMax, they override the mins and maxes from the data
    if ( yMin === undefined || yMin === null || yMin === "") { yMin = minRating; }
        else { 
            // console.log("yMin", yMin);
            yMin = yMin * 1;
            // console.log("yMin", yMin);
        }

    if ( yMax === undefined || yMax === null || yMax === "") { yMax = maxRating; }
        else { 
            // console.log("yMax", yMax);
            yMax = yMax * 1;
            // console.log("yMax", yMax);
        }

    if ( xMin === undefined || xMin === null || xMin === "") { xMin = minDate; }
        else { }

    if ( xMax === undefined || xMax === null || xMax === "") { xMax = maxDate; }
        else { }


    // console.log("yMin", yMin);
    // console.log("yMax", yMax);
    // console.log("xMin", xMin);
    // console.log("xMax", xMax);

    // svg variables
    var margin = {left:50, right:20, top:10, bottom:20};
    var height = 400;
    var width = 400;
    var svgHeight = height + margin.top + margin.bottom;
    var svgWidth = width + margin.left + margin.right; 

    // legend variables
    var xLegend = margin.left + width;
    var yLegend = margin.top;
    var legendBoxMargin = 10;
    var legendBoxHeight = 15;
    var legendBoxWidth = 20;
    var xLegendLabel = xLegend + (2 * legendBoxMargin) + legendBoxWidth; 

    // extent variables
    var xExtent = d3.extent([xMin, xMax]);
    var yExtent = d3.extent([yMin, yMax]);

    var xScale = d3.time.scale().domain(xExtent).range([0, width]);
    var yScale = d3.scale.linear().domain(yExtent).range([height, 0]);

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(5).ticks(5);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(5).ticks(5).tickFormat(d3.format(".0f"));

    // line variable
    var valueLine = d3.svg.line()
        .x(function(d) { return xScale(parseDate(d.DATE)); })
        .y(function(d) { return yScale(d.RATING); });

    if (chartTitle === undefined || chartTitle === null || chartTitle === "") {
        var chartTitle;
        var formatForTitle;

        if ( ratingFormat === "standardRatingHistory" ) { 
            formatForTitle = "FIDE Standard"; 
        } else if ( ratingFormat === "rapidRatingHistory" ) { 
            formatForTitle = "FIDE Rapid"; 
        } else if ( ratingFormat === "blitzRatingHistory" ) { 
            formatForTitle = "FIDE Blitz"; 
        } else if ( ratingFormat === "ursRatingHistory" ) {
            formatForTitle = "URS";
        } else if ( ratingFormat === "uscfRegularRatingHistory" || ratingFormat === "uscfRegularRatingHistoryTourn") {
            formatForTitle = "USCF Regular";
        } else if ( ratingFormat === "uscfQuickRatingHistory" || ratingFormat === "uscfQuickRatingHistoryTourn" ) {
            formatForTitle = "USCF Quick";
        } else if ( ratingFormat === "uscfBlitzRatingHistory" || ratingFormat === "uscfBlitzRatingHistoryTourn" ) {
            formatForTitle = "USCF Blitz";
        } else if ( ratingFormat === "uscfCorrespRatingHistory" ) {
            formatForTitle = "USCF Correspondence";
        }
        // console.log("formatForTitle", formatForTitle);

        // capitalize first letter of first and last names
        for ( i = 0; i < goodData.length; i++ ) {
            goodData[i].firstName = goodData[i].firstName.charAt(0).toUpperCase() + goodData[i].firstName.slice(1);
            goodData[i].lastName = goodData[i].lastName.charAt(0).toUpperCase() + goodData[i].lastName.slice(1);
        }

        if ( goodData.length == 1 ) {
            if ( goodData[0].firstName != null && goodData[0].lastName != null ) {
                var chartTitle = goodData[0].firstName + " " + goodData[0].lastName + " - " + formatForTitle + " Ratings";
                var pageTitle = goodData[0].firstName + " " + goodData[0].lastName + " Rating History (" + formatForTitle + ") - ChessGraphs.com";
            } else {}
            if ( goodData[0].firstName == null && goodData[0].lastName != null ) {
                var chartTitle = goodData[0].lastName + " - " + formatForTitle + " Ratings";
                var pageTitle = goodData[0].lastName + " Rating History (" + formatForTitle + ") - ChessGraphs.com";
            } else {}
            if ( goodData[0].firstName != null && goodData[0].lastName == null ) {
                var chartTitle = goodData[0].firstName + " - " + formatForTitle + " Ratings";
                var pageTitle = goodData[0].firstName + " Rating History (" + formatForTitle + ") - ChessGraphs.com"; 
            } else {}
        } else if ( goodData.length == 2 ) { 
            if ( goodData[0].lastName == goodData[1].lastName ) {
                sameLastName = true;
                var chartTitle = goodData[0].firstName + " " + goodData[0].lastName + " and " + goodData[1].firstName + " " + goodData[1].lastName + " - " + formatForTitle + " Ratings";            
                var pageTitle = goodData[0].firstName + " " + goodData[0].lastName + " and " + goodData[1].firstName + " " + goodData[1].lastName + " - Rating History (" + formatForTitle + ") - ChessGraphs.com"; 
            } else {
                var chartTitle = goodData[0].lastName + " and " + goodData[1].lastName + " - " + formatForTitle + " Ratings";            
                var pageTitle = goodData[0].lastName + " and " + goodData[1].lastName + " - Rating History (" + formatForTitle + ") - ChessGraphs.com"; 
            }
        } else if ( goodData.length == 3 ) { 
            if ( goodData[0].lastName == goodData[1].lastName || goodData[0].lastName == goodData[2].lastName || goodData[1].lastName == goodData[2].lastName ) {
                var chartTitle = goodData[0].firstName + " " + goodData[0].lastName + ", " + goodData[1].firstName + " " + goodData[1].lastName + ", and " + goodData[2].firstName + " " + goodData[2].lastName + " - " + formatForTitle + " Ratings";
                var pageTitle = goodData[0].lastName + ", " + goodData[1].lastName + ", and " + goodData[2].lastName + " - Rating History (" + formatForTitle + ") - ChessGraphs.com";  
            } else {
                var chartTitle = goodData[0].lastName + ", " + goodData[1].lastName + ", and " + goodData[2].lastName + " - " + formatForTitle + " Ratings"; 
                var pageTitle = goodData[0].lastName + ", " + goodData[1].lastName + ", and " + goodData[2].lastName + " - Rating History (" + formatForTitle + ") - ChessGraphs.com"; 
            }
        } else if ( goodData.length == 4 ) { 
            if ( goodData[0].lastName == goodData[1].lastName || goodData[0].lastName == goodData[2].lastName || goodData[0].lastName == goodData[3].lastName 
                || goodData[1].lastName == goodData[2].lastName || goodData[1].lastName == goodData[3].lastName
                || goodData[2].lastName == goodData[3].lastName ) {
                var chartTitle = formatForTitle + " Rating History for " + goodData.length + " Players"; 
                var pageTitle = goodData[0].lastName + ", " + goodData[1].lastName + ", " + goodData[2].lastName + ", and " + goodData[3].lastName + " - Rating History (" + formatForTitle + ") - ChessGraphs.com"; 
            } else {                
                var chartTitle = goodData[0].lastName + ", " + goodData[1].lastName + ", " + goodData[2].lastName + ", and " + goodData[3].lastName + " - " + formatForTitle + " Ratings";
                var pageTitle = goodData[0].lastName + ", " + goodData[1].lastName + ", " + goodData[2].lastName + ", and " + goodData[3].lastName + " - Rating History (" + formatForTitle + ") - ChessGraphs.com"; 
            }
        } else { 
            var chartTitle = formatForTitle + " Rating History for " + goodData.length + " Players"; 
            var pageTitle = "";
            for ( i = 0; i < goodData.length; i++ ) {
                if ( i != ( goodData.length - 1 ) ) { 
                    var pageTitle = pageTitle + goodData[i].lastName + ", ";
                } else {
                    var pageTitle = pageTitle + " and " + goodData[i].lastName + " - Rating History (" + formatForTitle + ") - ChessGraphs.com";
                }
            }
        }
    } else {}

    // set the page title
    if ( textInput ) { 
    } else { 
        var pageTitle = "ChessGraphs.com - Lookup, graph and compare chess ratings - FIDE, USCF, or URS - for any player";     
    }

    $("title").html(pageTitle);

    // these variables store the min and max date in the yyyy-mm-dd format needed for the min and max attributes of the input element in the form below
    var minYear = minDate.getFullYear();

    var minMonth = minDate.getMonth();
    // this is necessary because getMonth returns one digit numbers e.g. 1 instead of 01 for January. Same with getDate
    if ( minMonth < 10 ) { minMonth = "0" + minMonth; }

    var minDay = minDate.getDate();
    if ( minDay < 10 ) { minDay = "0" + minDay; }

    var maxYear = maxDate.getFullYear();

    var maxMonth = maxDate.getMonth();

    // add one month if we've got day-specific tournament histories
    if ( ratingFormat == "uscfRegularRatingHistoryTourn" || ratingFormat == "uscfQuickRatingHistoryTourn" || ratingFormat == "uscfBlitzRatingHistoryTourn" ) {
         if ( maxMonth == 12 ) { maxMonth = 1; maxYear = maxYear + 1; }
        maxMonth = maxMonth + 1;
    }

    if ( maxMonth < 10 ) { maxMonth = "0" + maxMonth; }
    
    var maxDate = maxDate.getDate();
    if ( maxDate < 10 ) { maxDate = "0" + maxDate; }

    var minDateForm = minYear + "-" + minMonth + "-" + minDay;
    var maxDateForm = maxYear + "-" + maxMonth + "-" + maxDate;

    // this creates the dropdown selection elements for new axes mins and maxes
    var modifyAxes = "";

    var currentYear = new Date().getFullYear();
    var selectMinYear = [];

    selectMinYear.push("<div id=\"control-x-axis\"> <div class=\"control-axes\" id=\"control-min-date\"><p class=\"longer\">Earliest date:</p><p class=\"shorter\">Start:</p> <select id=\"select-min-year\" class=\"change-axes-dropdown\">");

    for ( var i = minYear; i <= maxYear; i++ ) {
        selectMinYear.push("<option class=\"dropdown-min-year\" value=\"" + i + "\"");
        if ( i == xMin.getFullYear() ) { selectMinYear.push(" selected=\"selected\""); }
        selectMinYear.push(">" + i + "</option>");    
    }
    selectMinYear.push("</select>");

    var selectMinMonth = [];
    selectMinMonth.push("<select id=\"select-min-month\" class=\"change-axes-dropdown\">");
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    for (var i = 0; i < months.length; i++) {
        selectMinMonth.push("<option class=\"dropdown-min-month\" value=\"" + i + "\"");
        if ( i == xMin.getMonth() ) { selectMinMonth.push(" selected=\"selected\""); }
        selectMinMonth.push(">" + months[i] + "</option>");
    }
    selectMinMonth.push("</select></div>");

    var selectMaxYear = [];
    selectMaxYear.push("<div class=\"control-axes\" id=\"control-max-date\"><p class=\"longer\">Latest date:</p><p class=\"shorter\">End:</p> <select id=\"select-max-year\" class=\"change-axes-dropdown\">");

    // console.log("minYear", minYear);
    // console.log("minMonth", minMonth);
    // console.log("maxYear", maxYear);
    // console.log("maxMonth", maxMonth);

    for ( var i = minYear; i <= maxYear; i++ ) {
        selectMaxYear.push("<option class=\"dropdown-max-year\" value=\"" + i + "\""); 
        if ( i == xMax.getFullYear() ) { selectMaxYear.push(" selected=\"selected\""); }
        selectMaxYear.push(">" + i + "</option>");
    }

    selectMaxYear.push("</select>");

    var selectMaxMonth = [];
    selectMaxMonth.push("<select id=\"select-max-month\" class=\"change-axes-dropdown\">");

    for ( var i = 0; i < months.length; i++ ) {
        selectMaxMonth.push("<option class=\"dropdown-max-month\" value=\"" + i + "\"");
        if ( i == xMax.getMonth() ) { selectMaxMonth.push(" selected=\"selected\""); }
        selectMaxMonth.push(">" + months[i] + "</option>");
    }

    selectMaxMonth.push("</select></div></div>");

    var selectMaxRating = [];
    selectMaxRating.push("<div id=\"control-y-axis\"><div class=\"control-axes\" id=\"control-max-rating\"><p class=\"longer\">High rating:</p><p class=\"shorter\">High:</p> <select id=\"select-max-rating\" class=\"change-axes-dropdown\">");

    for (var i = minRating; i <= maxRating; i+=50 ) {
        selectMaxRating.push("<option class=\"dropdown-max-rating\" value=\"" + i + "\"");
        if ( i == yMax ) { selectMaxRating.push(" selected=\"selected\""); }
        selectMaxRating.push(">" + i + "</option>");
    }

    selectMaxRating.push("</select></div>");


    var selectMinRating = [];
    selectMinRating.push("<div class=\"control-axes\" id=\"control-min-rating\"><p class=\"longer\">Low rating:</p><p class=\"shorter\">Low:</p> <select id=\"select-min-rating\" class=\"change-axes-dropdown\">");

    for (var i = minRating; i <= maxRating; i+=50 ) {
        selectMinRating.push("<option class=\"dropdown-min-rating\" value=\"" + i + "\"");
        if ( i == yMin ) { selectMinRating.push(" selected=\"selected\""); }
        selectMinRating.push(">" + i + "</option>");
    }

    selectMinRating.push("</select></div></div>");

    // append a div to contain the chart
    chartContainer = "<div id=\"chart-container\"></div>";
    $("#result").prepend(chartContainer);

    // now it's time to append/prepend things to the #chart-container
    // append the title
    d3.select("#chart-container")
        .append("h2")
            .html(chartTitle)
            .attr("class", "title")
            .attr("id", "chart-title");

    // append share container
    shareHTML = "<div id=\"share-container\"><div id=\"share\"></div></div>";
    $("#chart-container").append(shareHTML);
    $("#share").jsSocials({
        text: pageTitle,
        showLabel: false,
        showCount: false,
        shares: [ 
            "facebook",
            "twitter", 
            "email"
        ]
    });
    
    // append y axis controls
    var yControl = [];
    yControl.push(selectMaxRating.join(""), selectMinRating.join(""));
    var yControlString = yControl.join("");
    $("#chart-container").append(yControlString);

    // append container for svg and x axis controls
    d3.select("#chart-container")
        .append("div")
            .attr("id", "svg-xcontrols-container");

    viewBoxValueDataTable = "0,0," + svgWidth + ",0";

    maxWidthDataTable = svgWidth + "px";
    
    // append a container for the data table
    d3.select("#chart-container")
        .append("div")
            .attr("id", "data-table-container")
            .attr("viewBox", viewBoxValueDataTable);

    viewBoxValueSvg = "0,0," + svgWidth + "," + svgHeight;


    d3.select("#svg-xcontrols-container")
        .append("svg")
            .attr("viewBox", viewBoxValueSvg)
        .append("defs")
            .append("clipPath")
                .attr("id", "body-clip")
                .append("rect")
                    .attr("x", -2)
                    .attr("y", -2)
                    .attr("height", height + 2)
                    .attr("width", width + 2);

    d3.select("svg")
        .append("g")
            .attr("class", "chart")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // here's a g to contain the legend
    d3.select("svg")
        .append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + xLegend + "," + yLegend + ")");

    // call axes
    d3.select(".chart")
        .append("g")
        .attr("id", "xAxisG")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    d3.select(".chart")
        .append("g")
        .attr("id", "yAxisG")
        .call(yAxis);

    var watermarkVertical = 20;
    var watermarkHorizontal = 5;

    // add watermark
    d3.select(".chart")
        .append("g")
        .attr("transform", "translate(" + watermarkHorizontal + "," + watermarkVertical + ")") 
        .attr("id", "watermarkG");

    d3.select("#watermarkG")
        .append("text")
        .attr("id", "watermark")
        .text("ChessGraphs.com");

    // add box to contain rating values
    d3.select(".chart")
        .append("g")
        .attr("transform", "translate(0, 0)")
        .attr("id", "ratingValuesG");


    xMinString = dateString(xMin);

    xMaxString = dateString(xMax);

    // make an array of all dates we have rating data for in order
    datesOnChart = [];
    for ( var i = 0; i < goodData.length; i++ ) {
        for ( j = 0; j < goodData[i][ratingFormat].length; j++ ) {
            if ( goodData[i][ratingFormat][j].DATE >= xMinString && goodData[i][ratingFormat][j].DATE <= xMaxString ) {
                alreadyThere = false;
                for ( k = 0; k < datesOnChart.length; k++ ) {
                    if ( datesOnChart[k] == goodData[i][ratingFormat][j].DATE ) {
                        alreadyThere = true;
                    }
                }
                if ( !alreadyThere ) {
                    datesOnChart.push(goodData[i][ratingFormat][j].DATE);
                }
            }
        }
    }
    datesOnChart.sort();
    for ( i = 0; i < datesOnChart.length; i++ ) {
        datesOnChart[i] = parseDate(datesOnChart[i]);
    }
    // console.log("datesOnChart", datesOnChart);

    // this is a g for the mouse focus
    var focus = d3.select(".chart").append("g").style("display", "none");

    // this is a circle to go in the focus g. one for each data series
    for ( i = 0; i < goodData.length; i++ ) {
        id = "y" + i;
        focus.append("circle")
            .attr("class", "y")
            .attr("id", id)
            .style("fill", "none")
            .style("stroke", "blue")
            .attr("r", 4);  
    }

    // append a rectangle to capture the mouse
    d3.select("svg").append("rect")
        .attr("width", width + 15)
        .attr("height", height)
        .attr("transform", "translate(50,10)")
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { 
            focus.style("display", "none"); 
            // reset colors of table rows
            dateCells = $(".date-cell");
            for ( i = 0; i < dateCells.length; i++ ) {
                selector = "#" + dateCells[i].parentElement.id;
                if ( (i % 2) == 0 ) {  
                    $(selector).css({"background-color": tableStripedRow, "color": textNonHighlightColor });
                } else { 
                    $(selector).css({"background-color": tableNonStripedRow, "color": textNonHighlightColor });
                }
            }
        })
        .on("mousemove", mousemove);

    bisectDate = d3.bisector(function(d) { return d; }).left;

    function mousemove(date) {
        if ( date === undefined ) {
            var x0 = xScale.invert(d3.mouse(this)[0]);

            var i = bisectDate(datesOnChart, x0, 1);

            var d0 = datesOnChart[i - 1];

            if ( i == datesOnChart.length ) { d1 = datesOnChart[datesOnChart.length-1]; 
            }   else { var d1 = datesOnChart[i];  }

            var d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        } else { d = parseDate(date); }


        // this loop makes a circle on each path for the point nearest the mouse
        for ( i = 0; i < goodData.length; i++ ) {
            var rating = null;
            for ( j = 0; j < goodData[i][ratingFormat].length; j++ ) {
                parsedDate = parseDate(goodData[i][ratingFormat][j].DATE);

                if ( d.getFullYear() == parsedDate.getFullYear() && d.getMonth() == parsedDate.getMonth() && d.getDate() == parsedDate.getDate() ) { 
                    var ratingAtDate = goodData[i][ratingFormat][j].RATING; 
                    var dateToScale  = goodData[i][ratingFormat][j].DATE;
                } else {}
            }

            selector = "#y" + i;
            
            if ( ratingAtDate === undefined ) { 
                focus.select(selector)
                    .style("display", "none");                
            } else {
                focus.select(selector).style("display", null);
                focus.select(selector)
                    .attr("transform","translate(" + xScale(d) + "," + yScale(ratingAtDate) + ")");
            }
        }

        // code to highlight the right row of data table goes here
        dateCells = $(".date-cell");

        // these are possibilities for where we scroll to the top of when the data table scrolls
        bodyOffsetTop = document.getElementById("body").offsetTop;
        resultOffsetTop = document.getElementById("result").offsetTop - 7;
        chartContainerOffsetTop = document.getElementById("chart-container").offsetTop;
        dataTableContainerOffsetTop = document.getElementById("data-table-container").offsetTop;
        svgContainerOffsetTop = document.getElementById("svg-xcontrols-container").offsetTop;

        function scrolltop() {
            if ( $(window).width() > 400 ) {
                scroll(0, resultOffsetTop);
            } else { }
        }

        for ( i = 0; i < dateCells.length; i++ ) {
            selector = "#" + dateCells[i].parentElement.id;
            parsedDate = parseDate(dateCells[i].firstChild.innerHTML);

            // match year, month (and day if the format is uscf correspondence or a uscf tournament history)
            if ( parsedDate.getFullYear() == d.getFullYear() && parsedDate.getMonth() == d.getMonth() && parsedDate.getDate() == d.getDate() ) {             
                $(selector).css({"background-color": tableHighlightColor, "color": textHighlightColor});

                var elem = document.getElementById(dateCells[i].parentElement.id);
                elem.scrollIntoView({block: scrollIntoViewBlock, behavior: scrollIntoViewSpeed });
                scrolltop();
            } else {
                if ( (i % 2) == 0 ) {
                    $(selector).css({"background-color": tableStripedRow, "color": textNonHighlightColor });
                    $(selector).hover(
                        function() { $(this).css({"background-color": tableHighlightColor, "color": textHighlightColor }) },
                        function() { $(this).css({"background-color": tableStripedRow, "color": textNonHighlightColor }) }
                    );
                } else { 
                    $(selector).css({"background-color": tableNonStripedRow, "color": textNonHighlightColor }); 
                    $(selector).hover(
                        function() { $(this).css({"background-color": tableHighlightColor, "color": textHighlightColor }) },
                        function() { $(this).css({"background-color": tableNonStripedRow, "color": textNonHighlightColor }) }
                    );
                }
            }
        }

    }

    // this loop makes the paths for the goodData series
    for (var i = 0; i < goodData.length; i++) {
        // this gets the data with the correct rating format 
        var dataToChart = []; 

        // console.log("ratingFormat", ratingFormat);

        if ( ratingFormat === "standardRatingHistory" ) { dataToChart = goodData[i].standardRatingHistory; }
        else if ( ratingFormat === "rapidRatingHistory" ) { dataToChart = goodData[i].rapidRatingHistory; }
        else if ( ratingFormat === "blitzRatingHistory" ) { dataToChart = goodData[i].blitzRatingHistory; }
        else if ( ratingFormat === "ursRatingHistory" ) { dataToChart = goodData[i].ursRatingHistory; }
        else if ( ratingFormat === "uscfRegularRatingHistory" ) { dataToChart = goodData[i].uscfRegularRatingHistory; }
        else if ( ratingFormat === "uscfRegularRatingHistoryTourn" ) { dataToChart = goodData[i].uscfRegularRatingHistoryTourn; }
        else if ( ratingFormat === "uscfQuickRatingHistory" ) { dataToChart = goodData[i].uscfQuickRatingHistory; }
        else if ( ratingFormat === "uscfQuickRatingHistoryTourn" ) { dataToChart = goodData[i].uscfQuickRatingHistoryTourn; }
        else if ( ratingFormat === "uscfBlitzRatingHistory" ) { dataToChart = goodData[i].uscfBlitzRatingHistory; }
        else if ( ratingFormat === "uscfBlitzRatingHistoryTourn" ) { dataToChart = goodData[i].uscfBlitzRatingHistoryTourn; }
        else if ( ratingFormat === "uscfCorrespRatingHistory" ) { dataToChart = goodData[i].uscfCorrespRatingHistory; }

        // console.log("dataToChart", dataToChart);
        // exclude data not in the xMin to xMax range
        var clippedDataToChart = [];
        for ( j = 0; j < dataToChart.length; j++ ) {
            if ( 
                parseDate(dataToChart[j].DATE) >= xMin 
                && parseDate(dataToChart[j].DATE) <= xMax 
                )
            { clippedDataToChart.push(dataToChart[j]); }
        }

        // this runs the data through valueLine to get the d value for the path created below    
        var dValue = valueLine(clippedDataToChart);

        d3.select(".chart")
            .append("g")
                .attr("id", function(d) { return "player" + i + "G"; })
                .attr("class", "playerG")
            .append("path")
                .attr("class", "player-path")
                .attr("id", "player" + i)
                .attr("d", dValue)
                .attr("stroke", colors[i])
                .attr("stroke-dashoffset", svgWidth)
                .attr("clip-path", "url(#body-clip)");

        // find length of path for stroke-dashoffset and stroke-dasharray
        length = $("#player" + i)[0].getTotalLength();

        d3.select("#player" + i)
            .attr("stroke-dasharray", length)
            .attr("stroke-dashoffset", length);

            d3.select(".legend")
                .append("rect")
                    .attr("style", "fill:" + colors[i] + "; stroke-width:.25; stroke: black;")
                    .attr("width", legendBoxWidth)
                    .attr("height", legendBoxHeight)
                    .attr("x", legendBoxMargin)
                    .attr("y", legendBoxMargin + (i * (legendBoxMargin + legendBoxHeight)) );
            d3.select(".legend")
                .append("text")
                    .attr("transform",
                        "translate(" + ((2 * legendBoxMargin) + legendBoxWidth) + "," 
                        + (2 + (2 * legendBoxMargin) + (i * (legendBoxHeight + legendBoxMargin))) + ")") 
                    .attr("class", "legend-label")
                    .text(goodData[i].lastName);

            ratingValueHeight = 15 * i;

            d3.select("#ratingValuesG")
                .append("text")
                    .attr("transform",
                        "translate(0," + ratingValueHeight + ")")
                    .attr("class", "ratingValue")
                    .text(goodData[i].firstName + " " + goodData[i].lastName + ": ");
    };

    var xControl = [];
    xControl.push(selectMinYear.join(""), selectMinMonth.join(""), selectMaxYear.join(""), selectMaxMonth.join(""));
    var xControlString = xControl.join("");
    $("#svg-xcontrols-container").append(xControlString);


    $(".change-axes-dropdown").change(function() {
        var xMinYearSelected = $("#select-min-year").val();
        var xMinMonthSelected = $("#select-min-month").val();
        var xMaxYearSelected = $("#select-max-year").val();
        var xMaxMonthSelected = $("#select-max-month").val();
        var yMinRatingSelected = $("#select-min-rating").val();
        var yMaxRatingSelected = $("#select-max-rating").val();

        var xMinDateSelected = new Date(xMinYearSelected, xMinMonthSelected);
        var xMaxDateSelected = new Date(xMaxYearSelected, xMaxMonthSelected);

        
        makeChart(goodData, xMinDateSelected, xMaxDateSelected, yMinRatingSelected, yMaxRatingSelected);
    });

// console.log("ratingFormat", ratingFormat);
// call the makeDataTable function with the parameters used for this chart
makeDataTable(goodData, xMin, xMax, ratingFormat);

/*
// append books
$("#book-container").remove();
books = [];        

books.push({"lastName":"Carlsen", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/carlsen-move-by-move-9781781942079?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781781942079.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Kasparov", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/garry-kasparov-on-my-great-predecessors-part-1-9781857443301?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781857443301.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Karpov", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/endgame-virtuoso-anatoly-karpov-the-exceptional-endgame-skills-of-the-12th-world-champion-9789056912024?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9789056912024.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Kramnik", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/kramnik-move-by-move-9781857449914?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781857449914.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Botvinnik", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/botvinnik-move-by-move-9781781941027?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781781941027.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Korchnoi", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/korchnoi-9781781941393?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781781941393.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Petrosian", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/petrosian-move-by-move-9781781941805?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781781941805.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Anand", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/anand-move-by-move-9781781941867?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781781941867.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Larsen", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/larsen-move-by-move-9781781942017?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781781942017.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Karpov", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/karpov-move-by-move-9781781942291?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781781942291.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Spassky", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/spassky-move-by-move-9781781942666?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781781942666.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Fischer", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/fischer-move-by-move-9781781942727?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781781942727.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Tal", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/tal-move-by-move-9781781943236?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781781943236.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/100-endgames-you-must-know-vital-lessons-for-every-chess-player-9789056916176?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9789056916176.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Flores Rios", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/chess-structures-a-grandmaster-guide-standard-patterns-and-plans-explained-9781784830007?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781784830007.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Benjamin", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/liquidation-on-the-chess-board-mastering-the-transition-into-the-pawn-ending-9789056915537?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9789056915537.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Panchenko", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/mastering-chess-middlegames-lectures-from-the-all-russian-school-of-grandmasters-9789056916091?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9789056916091.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Dvoretsky", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/recognizing-your-opponents-resources-developing-preventive-thinking-9781941270004?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781941270004.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Soltis", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/your-kingdom-for-my-horse-when-to-exchange-in-chess-9781849942775?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781849942775.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Soltis", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/new-art-of-defence-in-chess-9781849941600?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781849941600.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Soltis", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/100-chess-master-trade-secrets-from-sacrifices-to-endgames-9781849941082?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781849941082.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Albert", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/chess-tactics-for-the-tournament-player-9781889323275?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781889323275.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Aagaard", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/grandmaster-preparation-strategic-play-9781907982286?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781907982286.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Bronznik", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/techniques-of-positional-play-45-practical-methods-to-gain-the-upper-hand-in-chess-9789056914349?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9789056914349.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Hawkins", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/amateur-to-im-proven-ideas-and-training-methods-9781936277407?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781936277407.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Gulko", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/lessons-with-a-grandmaster-ii-improve-your-tactical-vision-and-dynamic-play-with-boris-gulko-9781857446975?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781857446975.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Naroditsky", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/mastering-complex-endgames-practical-lessons-on-critical-ideas-plans-9789056914059?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9789056914059.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Hellsten", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/mastering-opening-strategy-9781857446920?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781857446920.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Soltis", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/what-it-takes-to-become-a-chess-master-9781849940269?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781849940269.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Henken", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/1000-checkmate-combinations-9781906388706?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781906388706.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Andersson", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/grandmaster-chess-strategy-what-amateurs-can-learn-from-ulf-anderssons-positional-masterpieces-9789056913465?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9789056913465.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Nunn", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/understanding-chess-middlegames-9781906454272?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781906454272.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Nunn", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/nunns-chess-endings-volume-1-9781906454210?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9781906454210.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Hertan", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/forcing-chess-moves-the-key-to-better-calculation-9789056912437?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9789056912437.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});
books.push({"lastName":"Carlsen", "HTML":"<div class=\"bookimage\"><a href=\"https://www.powells.com/book/how-magnus-carlsen-became-the-youngest-chess-grandmaster-in-the-world-the-story-and-the-games-9789056914370?partnerid=44461&p_cv\" ><img class=\"bookcover left\" src=\"https://powells-covers-2.s3.amazonaws.com/9789056914370.jpg\"style=\"border: none;\" title=\"More info about this book at powells.com (new window)\"></a></div>"});

    
booksHTML = "<div id=\"book-container\">";
book1i = null, book2i = null, book3i = null;

var matches = [];
for ( j = 0; j < books.length; j++ ) {
    if ( goodData[0].lastName == books[j].lastName ) {  
       matches.push(j);
    } else {}
}

if ( matches.length > 1 ) {
    book1i = matches[Math.floor(Math.random()*matches.length)];
} else {
    if ( matches.length == 1 ) { 
        book1i = matches[0]; 
    } else {
        // pick a random first book.
        book1i = Math.floor( Math.random() * books.length ); 
    }
}

booksRemaining1 = [];
for ( i = 0; i < books.length; i++ ) {
    if ( i != book1i ) { booksRemaining1.push(i); }
}

// pick random book and add to booksHTML from booksRemaining
book2i = booksRemaining1[Math.floor(Math.random()*booksRemaining1.length)];

booksRemaining2 = [];
for ( i = 0; i < books.length; i++ ) {
    if ( i != book1i && i != book2i ) { booksRemaining2.push(i); }
}

// pick the 3rd book
book3i = booksRemaining2[Math.floor(Math.random()*booksRemaining2.length)];

booksTitle = "<h1 id=\"books-title\">Chess Books!</h1>"

booksHTML = booksHTML + books[book1i].HTML + books[book2i].HTML + books[book3i].HTML + "</div>";

$("#result").append(booksHTML);
$("#book-container").prepend(booksTitle);

for ( i = 0; i < 3; i++ ) {
    element = $(".bookimage")[i];
    bookNumber = i + 1;
    id = "book" + bookNumber;
    element.setAttribute("id", id);
}
*/

// if there's nothing to the left of the data table, it should be shorter
if ( $("#data-table-container").position().left < 10 ) {
    // unless we're on a device with screen width < 400 px
    if ( $(window).width() < 401 ) {
        $("#tbody-container").css("max-height", "125px");
    } else {
        $("#data-table-container").css("max-height", "95px");
        $("#data-table-container").css("margin", "10px 0 0 0");
        $("#tbody-container").css("max-height", "25px");

        /* no more books
        // code to make the books to the right of the graph vertically stacked goes here
        $("#result").css("position", "relative");
        $("#book-container").css("position", "absolute");
        $("#book-container").css("left", "540px");
        $("#book-container").css("min-width", "none");
        $("#share-container").css("position", "absolute");
        $("#share-container").css("left", "460px");
        $("#share-container").css("top", "60px");
        $(".jssocials-share").css("display", "block");
        $(".jssocials-share").css("clear", "left");
        */
    }
} else {
    /* no more books
    // if there's nothing to the left of the books, they should be horizontal
    bookPositionLeft = $(".bookimage").position().left - $("#result").position().left;
    if ( bookPositionLeft < 20 ) {
        $(".bookimage").css("display", "inline");
        $(".bookimage").css("float", "left");
        $(".bookimage").css("margin", "0 1% 0 0");
        $("#book-container").css("margin", "1% 0 0 0");
        $("#book-container").css("min-width", "600px");
    } else {}
    */
}

// max width of the data table should be a little less than width of #result
element = document.getElementById("result");
cs = getComputedStyle(element);
paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
resultWidth = element.offsetWidth - paddingX;

$("#data-table-container").css("max-width", resultWidth);

// if result is less than 700px wide, the books should be below the graph
if ( resultWidth < 700 ) {
    $("#book-container").css("position", "static");
    $("#book-container").css("left", "unset");
    $("#book-container").css("clear", "left");
    $(".bookimage").css("display", "inline");
    $(".bookimage").css("float", "left");
    $(".bookimage").css("margin", "0 1% 0 0");
    $("#book-container").css("margin", "1% 0 0 0");
    $("#book-container").css("min-width", resultWidth);
}

if ( resultWidth < 520 ) {
    $("#share-container").css("position", "absolute");
    $("#share-container").css("left", "330px");
    $("#share-container").css("top", "40px");
    $(".jssocials-share").css("display", "inline");
    $(".jssocials-share").css("clear", "none");
    $("i.jssocials-share-logo").css("font-size", "0.7em");
}

if ( resultWidth < 410 ) {
    $("#share-container").css("position", "absolute");
    $("#share-container").css("left", "200px");
    $("#share-container").css("top", "30px");
    $(".jssocials-share").css("display", "inline");
    $(".jssocials-share").css("clear", "none");
    $("i.jssocials-share-logo").css("font-size", "0.6em");
}

if ( resultWidth < 500 ) {
    $("#book3").css("display", "none");
}

if ( resultWidth < 330 ) {
    $("#book3").css("display", "none");
    $("#book2").css("display", "none");
}

}


/* this function highlights a point on the graph when you hover over
// a row of the data table. but it might be more trouble that it's worth
$("#data-table-container tbody tr").hover(
    function() {
        dateHovered = $(this).children().children().html();
        focus.style("display", null);
        mousemove(dateHovered);    
    },
    function() {
        focus.style("display", "none");
        rows = $("#data-table-container tbody tr");
        for ( i = 0; i < rows.length; i++ ) {
            if ( (i % 2) == 0 ) {
                $(rows[i]).css("background-color", tableStripedRow);
            } else { 
                $(rows[i]).css("background-color", tableNonStripedRow); 
            }    
        }
    }
);
*/

// 4. process-get-request-result
function disambigRowClick(rowYouClicked, playerNumber) {
    indexOfLastColumn = rowYouClicked.childNodes.length - 1;
    // console.log("indexOfLastColumn", indexOfLastColumn);

    id = rowYouClicked.childNodes[indexOfLastColumn].innerHTML;
    // console.log("id", id);

    // put the uscf id in the text input box
    textInputSelector = "#name-input-p-" + playerNumber + " input[type=text]";
    // console.log("textInputSelector", textInputSelector);

    // console.log("$(textInputSelector)", $(textInputSelector));
    
    $(textInputSelector)[0].value = id;

    // console.log("input innerhtml", $(textInputSelector));

    // submit the form again
    $("#input-form").submit();

}


function processGetRequestResult(resultOfGetRequest, format, formatFirstFour) {
    slideSection("text-input");
    // highlight the color of the section title, un-highlight the other sections
    $("#rankings .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
    $("#world-champions .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });
    $("#text-input .section-title-container").css({"background-color": sectionHighlightColor, "color": textHighlightColor});
    $("#about .section-title-container").css({"background-color": sectionNonHighlightColor, "color": textNonHighlightColor });

    // console.log("format", format);
    // console.log("format first four", formatFirstFour);
    
    resultLengthLessOne = resultOfGetRequest.length - 1;

    n = resultOfGetRequest.length;
    numberOfNameInputs(n);  

    // array to hold data that's good to chart
    chartThis = [];

    for ( i=0; i<resultOfGetRequest.length; i++ ) {
        // console.log("here's i inside the loop of the javascript to process the get request result: " + i);

        // onclick text for a row of the disambig table
        onClickText = "onclick='disambigRowClick(this, " + i + ")'";
        // console.log("onClickText", onClickText);

        // put the name of each player in the correct text input field
        $(".name-input-p input[type=text]")[i].value = resultOfGetRequest[i].searchValue;
        
        /* this tries to put it in lastname, firstname format
        if ( resultOfGetRequest[i].lastName != null && resultOfGetRequest[i].firstName != null ) {
            $(".name-input-p input")[i].value = resultOfGetRequest[i].lastName + ", " + resultOfGetRequest[i].firstName;
        } else {
            if ( resultOfGetRequest[i].lastName != null && resultOfGetRequest[i].firstName == null ) {
                $(".name-input-p input")[i].value = resultOfGetRequest[i].lastName;
            } else {
                if ( resultOfGetRequest[i].lastName == null && resultOfGetRequest[i].firstName != null ) {
                    $(".name-input-p input")[i].value = resultOfGetRequest[i].firstName;
                }
            }
        }
        */

        // if there are uscf disambig options put them in a table
        if ( resultOfGetRequest[i].uscfDisambigOptions.length != 0 ) {    
            inputNumber = i + 1;      
            
            var disambigTable = "<div id=\"disambig-container\"><p>Input " + inputNumber + ": <strong>" + resultOfGetRequest[i].searchValue + "</strong></p><p>Did you mean...</p><table class=\"disambig-table\"><tbody><tr><td>Name</td><td>Rating</td><td>State</td><td>USCF ID</td></tr>";
            
            for ( j = 0; j < resultOfGetRequest[i].uscfDisambigOptions.length; j++) {
                disambigTable = disambigTable + "<tr class=\"disambig-row\"" + onClickText + ">";
                disambigTable = disambigTable + "<td>" + resultOfGetRequest[i].uscfDisambigOptions[j].uscfName + "</td>";
                disambigTable = disambigTable + "<td>" + resultOfGetRequest[i].uscfDisambigOptions[j].uscfLatestRegularRating + "</td>";
                disambigTable = disambigTable + "<td>" + resultOfGetRequest[i].uscfDisambigOptions[j].uscfState + "</td>";
                disambigTable = disambigTable + "<td>" + resultOfGetRequest[i].uscfDisambigOptions[j].uscfID + "</td>";
            
                disambigTable = disambigTable + "</tr>";
            }

            disambigTable = disambigTable + "</tbody></table></div>";
            $("#result").append(disambigTable);

        } else {
            // if there are fide disambig options put them in a table
            if ( resultOfGetRequest[i].fideDisambigOptions.length != 0 ) {
                inputNumber = i + 1;
                var disambigTable = "<div id=\"disambig-container\"><p>Input " + inputNumber + ": <strong>" + resultOfGetRequest[i].searchValue + "</strong></p><p>Did you mean...</p><table class=\"disambig-table\"><tbody><tr><td>Name</td><td>Title</td><td>Rating</td><td>Federation</td><td>Birth</td><td>FIDE ID</td></tr>";

                for ( j = 0; j < resultOfGetRequest[i].fideDisambigOptions.length; j++ ) {
                    if ( resultOfGetRequest[i].fideDisambigOptions[j].title == false ) { resultOfGetRequest[i].fideDisambigOptions[j].title = ""; }

                    disambigTable = disambigTable + "<tr class=\"disambig-row\"" + onClickText + ">";
                    disambigTable = disambigTable + "<td>" + resultOfGetRequest[i].fideDisambigOptions[j].fideName + "</td>";
                    disambigTable = disambigTable + "<td>" + resultOfGetRequest[i].fideDisambigOptions[j].title + "</td>";
                    disambigTable = disambigTable + "<td>" + resultOfGetRequest[i].fideDisambigOptions[j].fideLatestStandardRating + "</td>";
                    disambigTable = disambigTable + "<td>" + resultOfGetRequest[i].fideDisambigOptions[j].federation + "</td>";
                    
                    disambigTable = disambigTable + "<td>" + resultOfGetRequest[i].fideDisambigOptions[j].birthYear + "</td>";                
                    disambigTable = disambigTable + "<td>" + resultOfGetRequest[i].fideDisambigOptions[j].fideID + "</td>";                

                    disambigTable = disambigTable + "</tr>";
                }

                disambigTable = disambigTable + "</tbody></table></div>";
                $("#result").append(disambigTable);

            } else {
                // go ahead and try to chart if there were no disambig options
                chartThis.push(resultOfGetRequest[i]);
            }
        }
    }    

    // console.log("chartThis", chartThis);
    makeChart(chartThis, null, null, null, null, null, true);

    chartContainerOffsetTop = document.getElementById("chart-container").offsetTop;
    if ( $(window).width() > 400 ) {
        scroll(0,chartContainerOffsetTop);
        console.log("scrolling to chartContainerOffsetTop", chartContainerOffsetTop);
    }

    /*
    if ( formatFirstFour == "fide" ) { 
        // console.log("fide - code to fix the rater slection when a get request was returned here");
        
        $("#rater-radio-fide").prop("checked", true); 
        $("#rater-radio-fide").change();
    }
    if ( formatFirstFour == "uscf" ) { 
        // console.log("uscf - code to fix the rater slection when a get request was returned here");
        $("#rater-radio-uscf").change();
        $("#rater-radio-uscf").prop("checked", true); 
        
    }  
    */  
}

// 5. browser-targeting.js
var userAgent = navigator.userAgent;

// example of userAgent string for IE
// Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; rv:11.0) like Gecko

var classIE = "internet-explorer";

matchIE = userAgent.match(/Trident/i);

if ( matchIE != null) {
    $("body").addClass(classIE);
}