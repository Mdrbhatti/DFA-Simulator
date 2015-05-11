var isStartingStateSet = false;
var stateList = [];
var startStateObj = null;
function stateObj(){
	this.name = "";
	this.startingState = 0;
	this.finalState = 0;
	this.transitions = {};
	this.next = {};
	this.loopedOver = 0;
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
	currentStateObject.loopedOver = 1;
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
			    if(nextStateObj.loopedOver != 1)
			    {
			    	recur(nextStateObj, nextStateObj.transitions);
			    }			    
			}
		    // console.log(value);
		}
	}


}


function createLinkedList()
{
	var start = startStateObj;
	if(start){
		var ele = document.getElementById("divDfa");
		ele.style.visibility="hidden";
		
		recur(start, start.transitions);
	}
	else
	{
		alert("Please add states/transitions to DFA");
	}


}

function verifyString(form)
{
	var stringToCheck = form.inputString.value;
	var tempState = startStateObj;

	if(stringToCheck=="" && tempState.finalState==1)
	{
		console.log("NULL ACCEPTING");
		return 1;
	}
	
	for (var i = 0; i < stringToCheck.length; i++) {
		console.log(tempState);
		
		tempState = tempState.next[stringToCheck.charAt(i)];
		if(!tempState)
		{
			return 0;
		}
	}
	if(tempState.finalState == 1)
	{
		console.log("ACCEPTING");
		return 1;
	}
	return 0;
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
		// currentState.loopedOver = 1;
	}

	var transitions = {};
	transitionsString = transitionsString.replace(/\s+/g, '');
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
		// alert("empty");
	}
	alert(JSON.stringify(transitions));

	
	currentState.initialize(startingState,finalState,stateName,transitions);
	stateList.push(currentState);
	// alert(JSON.stringify(stateList));
	
	$('#dfaform')[0].reset();
}