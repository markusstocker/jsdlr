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
 
function Reasoner() 
{
	this.tableau = new Tableau() ;
	// The array of ABoxes that is used to store tableau ABoxes
	aboxes = new Array() ;
	model = null ;
}

function isSatisfiable(concept) 
{ return false ; } 

function getModel()
{ return model ; }

function getTableau()
{ return this.tableau ; }

function isConsistent()
{
 	for ( var i = 0; i < aboxes.length; i++ )
	{
		var abox = aboxes[i] ;
		
		if ( abox.isConsistent() )
		{
			model = abox ;
			return true ;
		}
	}
	
	return false ;
}

/**
function getTableauHTML()
{	
	var root = this.tableau.getRoot() ;
	
	var table = document.createElement( "table" ) ;
	var tr = document.createElement( "tr" ) ;
	var td = document.createElement( "td" ) ;

	processNode( root, td ) ;
	
	tr.appendChild( td ) ;
	table.appendChild( tr ) ;
	
	return table ;
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
	td.appendChild( table1 ) ;
		
	table1.appendChild( tr1 ) ;
	// The table has a first row for the node assertions
	tr1.appendChild( td1 ) ;
		
	for ( var i = 0; i < assertions.length; i++ )
	{
		var assertion = assertions[i] ;
		td1.appendChild( document.createTextNode( assertion ) ) ;
		td1.appendChild( document.createElement( "<br>" ) ) ;
	}
	
	// Then there is a second row for the node children
	table1.appendChild( tr2 ) ; 

	for ( var i = 0; i < children.length; i++ )
	{
		// For each node children there is a new TD with an own table, recurse
		var child = children[i] ;
		var td = document.createElement( "td" ) ;
		td.setAttribute( "valign", "top" ) ;
		processNode( child, td ) ;
		tr2.appendChild( td ) ;
	}
}
*/

Reasoner.prototype.isSatisfiable = isSatisfiable ;
Reasoner.prototype.isConsistent = isConsistent ;
Reasoner.prototype.getModel = getModel ;
Reasoner.prototype.getTableau = getTableau ;
//Reasoner.prototype.getTableauHTML = getTableauHTML ;
