// inlets and outlets
inlets = 4;
outlets = 1;


api = new LiveAPI(path)

api.call("get_notes", 0, 0, 256, 128);
// log("notes:", api.call("get_notes", "-1", 0, 256, 128) );


// automatically reload the script when the js file is modified.
autowatch = 1;

var scales = [
  [2,2,1,2,2,2,1],  // major
  [2,1,2,2,1,2,2] // minor
 
]

var keyof=0;
var scale=0;
var minOctave=0;
var maxOctave=1;

function msg_int(v) { // if defined, this function is called when receiving an int value
	post("got the message", v, "on inlet", inlet,"\n");
	
	if (inlet == 0) {
		keyof=v;
    } else if (inlet == 1) {
		scale=v
	} else if (inlet == 2) {
		minOctave = v
	} else if (inlet == 3) {
		maxOctave = v
	}
		
}	
	
	

	
var path =  "live_set tracks 0 clip_slots 0 clip"

function bang() {
	set_notes();
}
	
function set_notes() {
  var cm = scales[scale]; // set cm to the current scale selected

  api = new LiveAPI(path)

  // remove all the notes to begin with
  api.call("remove_notes", "-0.25", 0, "0.25", 128);


  // log("notes:", api.call("get_notes", "-1", 0, 256, 128) );

  var startKey = (minOctave * 12) + keyof
  var endKey   = (maxOctave * 12) + keyof
  var total=startKey; // which note to start on

  // log("startKey:", startKey, "endKey:", endKey, "\n");

  api.call("set_notes");
  //api.call("notes", cm.length * loopSize);
  var noteCount = scales[0].length * (maxOctave - minOctave) + 1;

  api.call("notes", noteCount);
  //log("Number of notes:",  noteCount, "\n");

  var i = 0;
  while (total <= endKey) {
	api.call("note", total, "-0.25", "0.25", 100.0, 0);
	total+=cm[ i % 7];
	// log("total:", total, "i:", i % 9, "\n");
	i++;
  }
	
/*
  for (var l=0; l < loopSize; l++) {
  	  for (var i=0; i < cm.length; i++) {
  	  	  //log( major.length, total);
		  api.call("note", total, "-0.25", "0.25", 100.0, 0);
		  total+=cm[i];
	  }
  }	
	*/
	
  api.call("done");

}







function log() {
  for(var i=0,len=arguments.length; i<len; i++) {
    var message = arguments[i];
    if(message && message.toString) {
      var s = message.toString();
      if(s.indexOf("[object ") >= 0) {
        s = JSON.stringify(message);
      }
      post(s);
    }
    else if(message === null) {
      post("<null>");
    }
    else {
      post(message);
    }
  }
  post("\n");
}
 
log("___________________________________________________");
log("Reload:", new Date);