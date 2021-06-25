/*
 * The MIT License
 *
 * Copyright (c) 2007 Markus Stocker
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

var reasoner = null ;
var msgBoard = null ;
var tableauElementsIndex = null ;
var tableauElements = null ;

function init()
{
	tableauElementsIndex = 0 ;
	tableauElements = new Array() ;
	reasoner = new ALCReasoner() ;
	msgBoard = document.createElement( "table" ) ;
	document.getElementById( "msg" ).appendChild( msgBoard ) ;		
}

function append()
{
	var cmdEl = document.getElementById( "cmd" ) ;
	var symbEl = document.getElementsByName( "symb" ) ;

	// For-all, exists and negation symbols are added first
	if ( symbEl[2].checked )
		exprAppend( FOR_ALL ) ;
	else if ( symbEl[3].checked )
		exprAppend( EXISTS ) ;
	else if ( symbEl[4].checked )
		exprAppend( NEG ) ;
	
	// The append the string from the input form
	if ( cmdEl.value )
		exprAppend( cmdEl.value + " " ) ;

	// Now append and, or, top, bot
	if ( symbEl[0].checked )
		exprAppend( SQUARE_CAP + " " ) ;
	else if ( symbEl[1].checked )
		exprAppend( SQUARE_CUP + " " ) ; 
	//else if ( symbEl[4].checked )
	//	exprAppend( TOP + " " ) ;
	//else if ( symbEl[5].checked )
	//	exprAppend( BOT + " " ) ;
	else if ( symbEl[5].checked )
		exprAppend( " " + SQUARE_IMAGE_OF_OR_EQUAL_TO + " " ) ; 
	
	document.getElementById( "form" ).reset() ;
}

function reset()
{

	var exprEl = document.getElementById( "expr" ) ;

	if ( exprEl.firstChild )
		exprEl.firstChild.deleteData( 0, exprEl.firstChild.nodeValue.length ) ;
		
 	document.getElementById( "form" ).reset() ;
 	
 	resetMsgBoard() ;
	reasoner = new ALCReasoner() ;
}

function resetMsgBoard()
{
	var msgEl = document.getElementById( "msg" ) ;
			
	if ( msgEl.firstChild )
		document.getElementById( "msg" ).removeChild( msgEl.firstChild ) ;
}

function example1()
{
	reset() ;
	exprAppend( "(A " + SQUARE_CAP + " " + NEG + "A)" ) ;
}

function example2()
{
	reset() ;
	exprAppend( "(A " + SQUARE_CUP + " " + NEG + "A)" ) ;
}

function example3()
{
	reset() ;
	exprAppend( "((" + EXISTS + "R.A " + SQUARE_CAP + " " + EXISTS + "R.B) " + SQUARE_CAP + " " + NEG + EXISTS + "R.(A " + SQUARE_CAP + " B))" ) ;
}

function example4()
{
	reset() ;
	exprAppend( EXISTS + "R.A " + SQUARE_CAP + " " + EXISTS + "R.B " + SQUARE_IMAGE_OF_OR_EQUAL_TO + " " + EXISTS + "R.(A " + SQUARE_CAP + " B)" ) ;
}

function exprAppend( data )
{
	var exprEl = document.getElementById( "expr" ) ;
	
	if ( exprEl.firstChild )
		exprEl.firstChild.appendData( data ) ;
	else
		exprEl.appendChild( document.createTextNode( data ) ) ;
}

function checkSubsumption()
{
	resetMsgBoard() ;
	append() ;
	init() ;
	
	var msg = null ;
	var strExpr = document.getElementById( "expr" ).firstChild.data ;
	
	if (!(ExprFactory.prototype.isSubsumption( strExpr ) ) )
	{
		say( SUBSUMPTION, INVALID_SUBSUMPTION ) ;
		return ;	
	}
	
	var subsumee = ExprFactory.prototype.getSubsumee( strExpr ) ;
	var subsumer = ExprFactory.prototype.getSubsumer( strExpr ) ;
	var expr = ExprFactory.prototype.createByGuessingExpr( strExpr ) ;
	
	if ( perform( expr ) )
		msg = "The concept " + subsumee + " is not subsumed by " + subsumer ;
	else
		msg = "The concept " + subsumee + " is subsumed by " + subsumer ;
		
	say( SUBSUMPTION, msg ) ;
}

function checkSatisfiability()
{	
	resetMsgBoard() ;
	// Append evething, just to make sure
	append() ;
	init() ;
	
	var strExpr = document.getElementById( "expr" ).firstChild.data ;
	var expr = ExprFactory.prototype.createByGuessingExpr( strExpr ) ;
	
	if ( perform( expr ) )
	{	
		say( NNF, expr.toString() ) ;
		say( SATISFIABILITY, CONCEPT_IS_SATISFIABLE ) ;
		say( MODEL, reasoner.getModel() ) ;
	}
	else
	{
		say( SATISFIABILITY, CONCEPT_IS_UNSATISFIABLE ) ;
	}

	displayTableau() ;
}

function perform( expr )
{
	if(!(expr.isValid() ) )
	{
		say( VALIDITY, INVALID_EXPRESSION ) ;
		return false ;
	}

	say( VALIDITY, VALID_EXPRESSION ) ;
		
	// Create a concept object of the expression
	var concept = new Concept( expr ) ;
	var satisfiable = reasoner.isSatisfiable( concept ) ;
	
	if ( satisfiable )
		return true ;
	
	return false ;
}

function say( key, value )
{
	var tr = document.createElement( "tr" ) ;
	var td1 = document.createElement( "td" ) ;
	var td2 = document.createElement( "td" ) ;
	
	td1.setAttribute( "valign", "top" ) ;
	td1.setAttribute( "width", "200" ) ;
	
	td1.appendChild( document.createTextNode( key ) ) ;
	td2.appendChild( document.createTextNode( value ) ) ;
	
	tr.appendChild( td1 ) ;
	tr.appendChild( td2 ) ;

	msgBoard.appendChild( tr ) ;
}

function displayTableau()
{
	var tr = document.createElement( "tr" ) ;
	var td1 = document.createElement( "td" ) ;
	var td2 = document.createElement( "td" ) ;
	var table = document.createElement( "table" ) ;
	
	tr.appendChild( td1 ) ;
	tr.appendChild( td2 ) ;
	msgBoard.appendChild( tr ) ;
	
	td1.setAttribute( "valign", "top" ) ;
	td1.appendChild( document.createTextNode( TABLEAU ) ) ;
	
	tableauElements.push( new Array( td2, table ) ) ;
	
	getTableauHTML( table ) ;
}

function getTableauHTML( table )
{
	var root = reasoner.getTableau().getRoot() ;
	
	var tr = document.createElement( "tr" ) ;
	var td = document.createElement( "td" ) ;

	tableauElements.push( new Array( table, tr) ) ;
	tableauElements.push( new Array( tr, td ) ) ;
	
	processNode( root, td ) ;
	
	tableauElementsIntervalId = setInterval( "processElements()", 500 ) ;
	
	return table ;
}

function processElements()
{
	if ( tableauElementsIndex == tableauElements.length - 1 )
		clearInterval( tableauElementsIntervalId ) ;
	
	var element = tableauElements[tableauElementsIndex] ;
	
	element[0].appendChild( element[1] ) ;
	
	tableauElementsIndex++ ;
}

function processNode( node, td )
{
	var assertions = node.getAssertions() ;
	var children = node.getChildren() ;

	var table1 = document.createElement( "table" ) ;
	var tr1 = document.createElement( "tr" ) ;
	var tr2 = document.createElement( "tr" ) ;
	var td1 = document.createElement( "td" ) ;
	table1.setAttribute( "class", "tableau" ) ;
	table1.setAttribute( "width", "100%" ) ;
	td1.setAttribute( "align", "center" ) ;
	td1.setAttribute( "valign", "top" ) ;
	td1.setAttribute( "colspan", children.length ) ;
	
	// Each node ha a TD with an own TABLE
	tableauElements.push( new Array( td, table1 ) ) ;
	tableauElements.push( new Array( table1, tr1 ) ) ;
	// The table has a first row for the node assertions
	tableauElements.push( new Array( tr1, td1 ) ) ;
		
	for ( var i = 0; i < assertions.length; i++ )
	{
		var assertion = assertions[i] ;
		tableauElements.push( new Array( td1, document.createTextNode( assertion ) ) ) ;
		tableauElements.push( new Array( td1, document.createElement( "br" ) ) ) ;
	}
	
	// Then there is a second row for the node children
	tableauElements.push( new Array( table1, tr2 ) ) ;

	for ( var i = 0; i < children.length; i++ )
	{
		// For each node children there is a new TD with an own table, recurse
		var child = children[i] ;
		var td = document.createElement( "td" ) ;
		td.setAttribute( "valign", "top" ) ;
		tableauElements.push( new Array( tr2, td ) ) ;
		processNode( child, td ) ;
	}
}
