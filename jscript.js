var isStartingStateSet = false;
var stateList = [];
var startStateObj = null;
function stateObj(){
	this.name = "";
	this.startingState = false;
	this.finalState = false;
	this.transitions = {};
	this.next = {};
	this.initialize = function(startingState, finalState, name, transitions)
	{
		this.startingState = startingState;
		this.finalState = finalState;
		this.name = name;
		this.transitions = transitions;
	}

}

function findStateObject(name)
{
	for (var i = 0; i < stateList.length; i++) {
	    //Do something
	    //find onject with this state name from stateList and return it
	    if(stateList[i].name === name ){
	    	console.log(stateList[i]);
	    	return stateList[i];
	    }
	}
	return null;
}

function recur(currentStateObject, transitions)
{
	if (transitions.length <= 0)
		return;
	else
	{
		for (var symbol in transitions) {
		    var nextState = transitions[symbol];
		    // find obj in statelist
		    var nextStateObj = findStateObject(nextState);
		    if(nextStateObj != null){
			    currentStateObject.next[symbol] = nextStateObj;
			    recur(nextStateObj, nextStateObj.transitions);
			}
		    // console.log(value);
		}
	}


}


function createLinkedList()
{
	var start = startStateObj;
	recur(start, start.transitions);


}

function verifyString(form)
{
	var stringToCheck = form.inputString.value;

}

function dfaCreator(form) {
	// Form values
	var startingState = 0;
	var finalStae = 0;
	if($("#startingState").is(':checked'))
	{
		startingState = 1;
	}
	if($("#finalState").is(':checked'))
	{
		finalState = 1;
	}
	var stateName = form.stateName.value;
	var transitionsString = form.transitions.value;
	var currentState = new stateObj();

	if(!isStartingStateSet && startingState == 1){
		var ele = document.getElementById("startingStateLabel");
		ele.style.visibility="hidden";
		isStartingStateSet = true;
		startStateObj = currentState;
	}

	var transitions = {};
	if(transitionsString != ""){
		token = transitionsString.split(',');
		for (i = 0; i < token.length; i+=2) { 
	    	var symbol = token[i].substring(1);
	    	var nextState = token[i+1].substring(0, token[i+1].length-1);
	    	transitions[symbol] = nextState;
	    	// transitions[i] = symbol;
	    	// transitions[i+1] = nextState;
		}
	}
	else
	{
		alert("empty");
	}
	alert(JSON.stringify(transitions));

	
	currentState.initialize(startingState,finalState,stateName,transitions);
	stateList.push(currentState);
	alert(JSON.stringify(stateList));
	
	$('#dfaform')[0].reset();
}