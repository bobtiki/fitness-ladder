/*
*
* Helper functions
*
*/

var RUNG_MAX = 48;
var STEP_ITERATION_LENGTH = 75;

function set_rung(rung_number) {
    //alert("set_rung(" + rung_number + ")");  // function debug
    try {
        Cookies.set('rung', rung_number, { expires: 365 });
    }
    catch(err) {
        console.log(err.message);
        alert(err.message);
    }
    try {
        return rung_number;
    }
    catch(err) {
        console.log(err.message);
        alert(err.message);
    }
    
};

function current_rung() {
    //alert("current_rung()");  // function debug
    var rung_number;
    
    // Check to make sure the cookie is set. If not, reset it to '1'.
    if (typeof Cookies.get('rung') == 'undefined') {
        console.log("Cookie 'rung' was not set.");
        set_rung(1);
    }
    
    try {
        rung_number = parseInt(Cookies.get('rung'));
    }
    catch(err) {
        console.log(err.message);
        alert(err.message);
    }
    return rung_number;
};

function get_rung_data(rung_number) {
    //alert("get_rung_data(" + rung_number + ")");  // function debug
    try {
        // $.getJSON() is asynchronous
        $.getJSON('fitness_ladder.json', function (data) {
            //console.log(data)
            //console.log("rung_number: " + rung_number);
            
            // This returns an array with (hopefully) one object, so we return just that one.
            // TODO: check to make sure there's one object here, and that it's valid
            var rung_data = $.grep(data.rungs, function(e){
                //console.log(e.rung);
                return e.rung == rung_number;
            })[0];
            
            // Callback to do something with the data
            show_data(rung_data);
        });
    }
    catch(err) {
        console.log(err.message);
        alert(err.message);
    }
};

function get_current_rung_data() {
    //alert("get_current_rung_data()");  // function debug
    get_rung_data(current_rung());
};

function show_data(rung_data) {
    //alert("show_data(" + rung_data + ")");  // function debug
    // Asynchronous callback when the JSON parsing is done.
    var showData = $('#show-data');
    var showRung = $('#rung-data');
    var showBend = $('#bend-data');
    var showSitup = $('#situp-data');
    var showLeglift = $('#leglift-data');
    var showPushup = $('#pushup-data');
    var showSteps = $('#steps-data');
    
    if (typeof rung_data != 'undefined') {
        showData.text('Rung Loaded.');
        showRung.text(rung_data.rung);
        showBend.text(rung_data.bend);
        showSitup.text(rung_data.situp);
        showLeglift.text(rung_data.leglift);
        showPushup.text(rung_data.pushup);
        var step_iterations = Math.floor(rung_data.steps / STEP_ITERATION_LENGTH);
        var step_remainder = rung_data.steps % STEP_ITERATION_LENGTH;
        var step_text = step_iterations + "×" + STEP_ITERATION_LENGTH;
        if (0 != step_remainder) {
            step_text = step_text + "+" + step_remainder
        }
        showSteps.text(step_text);
    } else {
        console.log("Error loading data.");
        alert("Error loading data.");
    };
}



/*
*
* JQuery button functions
*
*/

$(document).ready(function () {
    //alert("$(document).ready");  // function debug
    get_current_rung_data();
   
    $('#delete-cookie').click(function () {
        var showCookie = $('#show-cookie');
        showCookie.empty();
        
        try {
            Cookies.remove('rung');
            showCookie.text('Deleting the cookie.');
        }
        catch(err) {
            console.log(err.message);
        }
        
    });
   
    $('#increment-rung').click(function () {
        
        var rung = current_rung();
        // TODO: disable button if we're already at last rung
        if (RUNG_MAX == rung) {
            rung = RUNG_MAX;
        } else {
            rung = rung + 1;
        };
        
        set_rung(rung);
        get_current_rung_data();
    });
    
    
   
    $('#decrement-rung').click(function () {
        
        var rung = current_rung();
        // TODO: disable button if we're already at first rung
        if (1 == rung) {
            rung = 1;
        } else {
            rung = rung - 1;
        };
        
        set_rung(rung);
        get_current_rung_data();
    });
 
});
