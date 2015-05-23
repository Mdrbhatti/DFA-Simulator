var isStartingStateSet = false;
var stateList = [];
var startStateObj = null;

/* 
 * State Object (stores state information e.g. transitions/name/properties)
 */
function stateObj(){
	this.name = "";
	this.startingState = 0;
	this.finalState = 0;
	this.transitions = {};
	/* 
	 * Similar to transitions, but it holds the OBJECT reference to the next state, instead of just its STRING NAME
	 * 		Key: Symbol
	 *		Value: stateObj
	 */
	this.next = {};
	this.loopedOver = 0;
	/* 
	 * Constructor
	 */
	this.initialize = function(startingState, finalState, name, transitions)
	{
		this.startingState = startingState;
		this.finalState = finalState;
		this.name = name;
		this.transitions = transitions;
	}

}

/* 
 * Iterates over the stateList and returns the state with name = name!
 * Return type = NULL or stateObj
 */
function findStateObject(name)
{

	for (var i = 0; i < stateList.length; i++) {
	    if(stateList[i].name === name ){
	    	console.log(stateList[i]);
	    	return stateList[i];
	    }
	}
	return null;
}

/* 
 * Called by createLinkedList
 * Its a recursive function
 * Base case:
 *    No transitions exist from current state to ANY other state
 *
 * Recursive case:
 *    Transitions exist from current state to AT LEAST one other state
 * 	  DO:
 *       Get nextState
 * 		 Find its stateObject from the stateList
 * 		 Use the stateObject and store its reference in currentStateObjects.next
 *       Make sure to take care of cycles so we dont keep recursing over the same two states 
 */
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
			    if(nextStateObj.loopedOver != 1)
			    {
			    	currentStateObject.loopedOver = 1;
			    	recur(nextStateObj, nextStateObj.transitions);
			    }			    
			}
		}
	}
}

/*
 * When user clicks the 'Create DFA' button, this function is invoked
 * Its primary purpose is to create a linked list of obects, 
 *		so that each state can be accessed through the starting state (if it is reachable)
 * 
 * If starting state exists in our DFA, we call the recur function and create a linkedlist by
 *	populating the stateObj.next dictionaries with next state references
 */ 

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

/* 
 * Checks if given string in form is a valid string in DFA or not
 */
function verifyString(form)
{
	var stringToCheck = form.inputString.value;
	var tempState = startStateObj;
	var ver_el = document.getElementById("stringValidationText");

	/* 
	 * If starting state is also a final state, DFA accepts epsilon/empty string
	 */
	if(stringToCheck=="" && tempState.finalState==1)
	{
		ver_el.innerHTML ='<font face="verdana" color="green">Valid!</font>';
		return 1;
	}
	
	/* 
	 * If no state found corresponding to input string
	 */
	for (var i = 0; i < stringToCheck.length; i++) {
		console.log(tempState);
		
		tempState = tempState.next[stringToCheck.charAt(i)];
		if(!tempState)
		{
			ver_el.innerHTML ='<font face="verdana" color="red">Invalid!</font>';
			return 0;
		}
	}
	/* 
	 * If state is final, its accepting
	 */
	if(tempState.finalState == 1)
	{
		ver_el.innerHTML ='<font face="verdana" color="green">Valid!</font>';
		return 1;
	}
	ver_el.innerHTML ='<font face="verdana" color="red">Invalid!</font>';
	return 0;
}

/* 
 * Called by the 'Add' button
 */
function dfaCreator(form) {
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
	/* 
	 * Create new stateObj
	 */
	var currentState = new stateObj();

	/* 
	 * There can only be ONE starting state
	 */
	if(!isStartingStateSet && startingState == 1){
		var ele = document.getElementById("startingStateLabel");
		ele.style.visibility="hidden";
		isStartingStateSet = true;
		startStateObj = currentState;
	}

	var transitions = {};
	transitionsString = transitionsString.replace(/\s+/g, '');
	/*
	 * If tranisitons exist for this state, add transitions to a dictionary
	 * Format:     
	 *       KEY = Input Symbol
	 		 VALUE = Next state
	 */
	if(transitionsString != ""){
		token = transitionsString.split(',');
		for (i = 0; i < token.length; i+=2) { 
			/*
			 * Tokenize tranition infromation from string 
			*/
	    	var symbol = token[i].substring(1);
	    	var nextState = token[i+1].substring(0, token[i+1].length-1);
	    	transitions[symbol] = nextState;
		}
	}

	/* 
	 * Initialize new stateObj (works as a constructor, adding information for a single state)
	 */
	currentState.initialize(startingState,finalState,stateName,transitions);
	/*
	 * Append the currentState to the GLOBAL stateList (so all *added* states can be viewed outside this function)  
	 */
	stateList.push(currentState);
	
	$('#dfaform')[0].reset();
}