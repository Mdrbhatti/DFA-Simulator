var isStartingStateSet = false;
var stateList = [];
var startStateObj = null;
var finalStateList = []
var allWordsList = []
/* 
 * State Object (stores state information e.g. transitions/name/properties)
 */
function stateObj(){
	this.name = "";
	this.startingState = 0;
	this.finalState = 0;
	this.transitions = {};
	this.reachable = 0;
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
	    	// console.log(stateList[i]);
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
			    	nextStateObj.reachable = 1;
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
		start.reachable = 1;
		var ele = document.getElementById("divDfa");
		ele.style.visibility="hidden";		
		recur(start, start.transitions);
	}
	else
	{
		alert("Please add states/transitions to DFA");
	}
	drawDfaGraph();

}


function drawDfaGraph()
{
	document.getElementById('mynetwork').style.height = "600px"
	// document.getElementById('mynetwork').style.width = "800px"
	document.getElementById('mynetwork').style.visibility = "visible";
	document.getElementById('dfa_create_button').style.visibility = "hidden";
	
	// var nodes = [
	// 	{id: 1, label: 'Node 1', font: '12px arial red', group: 1},
	// 	{id: 2, label: 'Node 2', font: {size:12, color:'lime', face:'arial'}, group: 3},
	// 	{id: 3, label: 'Node 3', font: '18px verdana blue', group: 4},
	// 	{id: 4, label: 'Node 4', font: {size:12, color:'red', face:'sans', background:'white'}, group: 2},
	// 	{id: 5, label: 'Node 5', image: 'final.png', font: {size:15, color:'red', face:'courier', strokeWidth:3, strokeColor:'#ffffff'}, shape: 'circularImage', group: 2}
	// ];

	// get nodes
	var nodes = [];
	dict = {id:'1startingstate', label: 'Start', group: 1};
	nodes.push(dict);
	for (var i = 0; i < stateList.length; i++) {
		dict = {};
		dict['id'] = stateList[i].name;
		dict['label'] = stateList[i].name;
		dict['font'] = '12px arial red';
		dict['group'] = 1;
		dict['shape'] = 'circle';
		if(stateList[i].finalState == 1)
		{
			dict['font'] = {size:15, color:'red', face:'arial', strokeWidth:3, strokeColor:'#ffffff'};
			// dict['image'] = 'final.png';
			dict['group'] = 2;
			
		}
		nodes.push(dict);
	}
	console.log(nodes);

	// get edges
	var edges = [];
	dict = {from:'1startingstate', to: startStateObj.name, arrows: 'to'};
	edges.push(dict);
	for (var i = 0; i < stateList.length; i++) {
		curr_state = stateList[i];
		
	    for (var symbol in curr_state.next){
	    	next_state = curr_state.next[symbol];
	    	dict = {};
	    	dict['from'] = curr_state.name;
	    	dict['to'] = next_state.name;
	    	dict['arrows'] = 'to';
	    	dict['label'] = symbol;
	    	edges.push(dict);
	    }
	}
	console.log(edges);

	// create an array with edges
	// var edges = [
	// 	{from: 1, to: 1, arrows: 'to', label: '131'},
	// 	{from: 3, to: 3, arrows: 'to', label: 'hello'},
	// 	{from: 2, to: 4},
	// 	{from: 2, to: 5},
	// 	{from: 2, to: 1}
	// ];

	// create a network
	var container = document.getElementById('mynetwork');
	var data = {
		nodes: nodes,
		edges: edges
	};
	var options = {
		nodes : {
		  shape: 'dot',
		  size: 10
		}
	};

	// var options = {
	// 	edges: {
	// 	smooth: true,
	// 	arrows: {to : true }
	// 	},
	// 	layout: {
	// 		hierarchical:{
	// 		// direction: 'LR',
	// 		// sortMethod: 'directed'
	// 		}
	// 	}
	// };
	var options = {layout:{randomSeed:2}};
	var network = new vis.Network(container, data, options);
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

function isLanguageEmpty()
{
	var ver_el = document.getElementById("isLanguageEmpty");
	// find unreachable state
	isLangEmpty = true;
	for (var i = 0; i < finalStateList.length; i++) {
	    if(finalStateList[i].reachable == 1 ){
	    	isLangEmpty = false;
	    	break;
	    }
	}
	if(isLangEmpty)
	{
		ver_el.innerHTML ='<font face="verdana" color="green">True!</font>';
	}
	else
	{
		ver_el.innerHTML ='<font face="verdana" color="red">False!</font>';
	}
}
function containsEpsilon()
{
	var ver_el = document.getElementById("isContainingEpsilon");
	if(startStateObj.finalState == 1)
	{
		ver_el.innerHTML ='<font face="verdana" color="green">True!</font>';
	}
	else{
		ver_el.innerHTML ='<font face="verdana" color="red">False!</font>';
	}
}
function recur2(currentStateObject, my_string, current_length)
{
	current_length++;
	if(currentStateObject.finalState == 1){
		allWordsList.push(my_string)
	}
	if(Object.getOwnPropertyNames(currentStateObject.next).length === 0 || current_length > 10){
		return;
	}
	else
	{
		for (var symbol in currentStateObject.next) {
		    var nextStateObj = currentStateObject.next[symbol];
		    new_string = my_string + symbol;

		    if(nextStateObj != null){
	    		recur2(nextStateObj, new_string, current_length);
	    	}		    
		}
	}
}

function generateAllPossibleWords()
{
	var max_length = 10;
	var current_length = 0;
	var my_string = "";
	allWordsList = [];
	// console.log("In recur2\n");
	recur2(startStateObj, my_string, current_length);
	var ver_el = document.getElementById("wordList");
	var quotedAndCommaSeparated = "'" + allWordsList.join("','") + "'";
	ver_el.innerHTML ='<font face="verdana" color="green">' + quotedAndCommaSeparated + '</font>';
	// console.log(allWordsList)
	return allWordsList;

}
/* 
 * Called by the 'Add' button
 */
function dfaCreator(form) {
	var startingState = 0;
	var finalState = 0;
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
	/*
	 * Add to Final state list
	 */
	if(finalState)
	{
		finalStateList.push(currentState);
	}
	
	$('#dfaform')[0].reset();
}