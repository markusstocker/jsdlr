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
 
function ALCReasoner() 
{
	Reasoner.call() ;
}

function isSatisfiable( concept )
{
	var abox = new ABox() ;
	// First we create an individual 
	// and set the constrain that this individual satisfies the concept
	var assertion = new AssertionConcept( concept, abox.newIndividual() ) ;
	abox.addAssertion( assertion ) ;
	// Add the ABox to the set of ABoxes of tableau reasoning
	aboxes.push( abox ) ;
	// Create a root node to trace the tableau process
	var root = new Node() ;
	// Add the root node to the tableau
	this.getTableau().setRoot( root ) ;
	root.addAssertion( assertion ) ;
	
	// Now we process the ALC tableau expansion rules on the ABox
	processRules( abox, root ) ;

	// There is a model iff there is at least one ABox that is consistent	
	return isConsistent() ;
}

function processRules( abox, node )
{
	// Get the assertions from the ABox (we first care about concept assertions
	var assertions = abox.getAssertions() ;
	// And first we assume only one rule and a concept as A and B or A and not A (for simplicity)

	for ( var i = 0; i < assertions.length; i++ )
	{
		var assertion = assertions[i] ;
		// We have to process only concept assertions
		// Check if the assertion is already expanded, do nothing if true
		if ( assertion instanceof AssertionConcept && !assertion.isExpanded() )
			processAssertion( abox, node, assertion ) ;
	}
}

function processAssertion( abox, node, assertion )
{
	var concept = assertion.getConcept() ;
	var individual = assertion.getIndividual() ;
	var expr = concept.getExpr() ;

	// Do nothing for ExprAtomic; check the operator for ExprComplex
	if ( expr.isComplex() )
	{
		var assertion1 = new AssertionConcept( new Concept( expr.getLeft() ), individual ) ;
		var assertion2 = new AssertionConcept( new Concept( expr.getRight() ), individual ) ;
		
		if ( expr.getOperator() == SQUARE_CAP )
		{
			// We have something like (A and B)
			// Make sure to .getExpr() to not get instances of Expr but either ExprComplex or ExprAtomic
			// And add the new assertions to the SAME ABox if the ABox does not contain them already
			// And process the expansion rules on the abox again, if at least one new assertion has been added
			if ( abox.addAssertion( assertion1 ) && 
			 	 abox.addAssertion( assertion2 ) )
			{
				// This is a data structure of nodes that traces the tableau process
				var node1 = new Node() ;
				node1.addAssertion( assertion1 ) ;
				node1.addAssertion( assertion2 ) ;
				node.addChild( node1 ) ;
				// Mark original assertion as expanded
				assertion.setExpanded( true ) ;
				processRules( abox, node1 ) ;
			}
		}
		else if ( expr.getOperator() == SQUARE_CUP )
		{
			// We have something like (A or B)
			// Make a copy of the abox
			var abox1 = abox.copy() ;
			// Add the new abox to the list of aboxes
			aboxes.push( abox1 ) ;
			// And add the new assertions to one of EACH ABox
			// Recurse only if the assertion has been added
			if ( abox.addAssertion( assertion1 ) && 
				 abox1.addAssertion( assertion2 ) )
			{
				var node1 = new Node() ;
				var node2 = new Node() ;
				node1.addAssertion( assertion1 ) ;
				node2.addAssertion( assertion2 ) ;
				node.addChild( node1 ) ;
				node.addChild( node2 ) ;
				// Mark original assertion as expanded
				assertion.setExpanded( true ) ;
				processRules( abox, node1 ) ;
				processRules( abox1, node2 ) ;
			}
		}
	}
	else if ( expr.isRestriction() )
	{
		var role = new Role( expr.getRoleName() ) ;
		var conceptF = new Concept( expr.getFillerExpr() ) ;
		
		if ( expr.getQuantifier() == EXISTS )
		{
			// We have something like exists R.C(a0)
			// Added the two assertions to the ABox and recurse if they have been added
			if ( abox.addExistsExpansion( role, individual, conceptF ) )
			{
				var node1 = new Node() ;
				node1.addAssertion( abox.getLastAddedAssertion() ) ;
				node.addChild( node1 ) ;
				// Mark original assertion as expanded
				assertion.setExpanded( true ) ;
				processRules( abox, node1 ) ;
			}
		}
		else if ( expr.getQuantifier() == FOR_ALL )
		{
			// We have something like forAll R.C(a0)
			if ( abox.addForAllExpansion( role, individual, conceptF ) )
			{
				var node1 = new Node() ;
				node1.addAssertion( abox.getLastAddedAssertion() ) ;
				node.addChild( node1 ) ;
				// Mark original assertion as expanded
				assertion.setExpanded( true ) ;
				processRules( abox, node1 ) ;
			}
		}
	}
}

ALCReasoner.prototype = new Reasoner() ;
ALCReasoner.prototype.isSatisfiable = isSatisfiable ;
