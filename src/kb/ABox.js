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
 
function ABox() 
{
	// The ABox is checked for consistency by isConsistent()
	this.consistent = true ;
	this.individualId = 0 ;
	this.assertions = new Array() ;
	// The last added assertion
	this.last = null ;
}

/**
 * The method returns true iff the assertion has been added to the ABox.
 * Assertions are only added if they don't already exist.
 */
function addAssertion( assertion )
{ 
	if ( this.contains( assertion ) )
		return false ;
		
	this.assertions.push( assertion ) ; 
	this.last = assertion ;
	
	return true ;
}

function getAssertions()
{ return this.assertions ; }

function newIndividual()
{ return new Individual( "a" + this.individualId++ ) ; }

/**
 * The method is mainly used to trace the tableau reasoning process
 * which is showed to the user by the GUI, see ALCReasoner.js
 */
function getLastAddedAssertion()
{ return this.last ; }

/**
 * The method checks if for the corresponding role and concept
 * assertions there is no pair <R(x,*), C(*)> where R is the 
 * role name specified by the roleAssertion param and C is
 * the concept specified by the conceptAssertion param.
 * The individual x is specified by the roleAssertion param.
 * * is a wildcard. The method searches for an individual that
 * matches this pair. If no such individual is found in the ABox
 * then both the role and concept assertions given to the method
 * are added to the ABox.
 */
function addExistsExpansion( role, individual, concept )
{	
	// Search for concept assertions
	for ( var i = 0; i < this.assertions.length; i++ )
	{
		var assertion1 = this.assertions[i] ;
		
		// Match the concept with the one of conceptAssertion
		if ( assertion1 instanceof AssertionConcept && 
			 assertion1.getConcept().equals( concept ) ) 
		{
			// If they match get the individual
			var individual2 = assertion1.getIndividual() ;
				
			// Now search for role assertions
			for ( var j = 0; j < this.assertions.length; j++ )
			{
				var assertion2 = this.assertions[j] ;
					
				// We are only interested in matching role assertions
				// That match the role name of roleAssertion
				// And the corresponding individuals
				if ( assertion2 instanceof AssertionRole &&
					 assertion2.getRole().equals( role ) && 
					 assertion2.getIndividual1().equals( individual ) && 
					 assertion2.getIndividual2().equals( individual2 ) )
				{	
					// We have found an individual that matches the 
					// pair <R(x,*), C(*)> for the given role and concept
					// assertions. We DO NOT add the assertions to the ABox
					// and return false, i.e. that the assertions were not added.		 	
					return false ;
				}
			}
		}
	}
	
	// There is no individual in the ABox that matches the requested pair.
	// Hence, add the two assertions to the ABox and return true to say
	// that the two assertions were added.
	var individualN = this.newIndividual() ;
	this.addAssertion( new AssertionRole( role, individual, individualN ) ) ;
	this.addAssertion( new AssertionConcept( concept, individualN ) ) ;
	
	return true ;
}

/**
 * Given a role and and an individual, we search for a role assertion
 * R(x,*) in the ABox for which there is no concept assertion C(*) 
 * for the filler individual in the ABox. If such a filler individual
 * y can be found then C(y) is added to the ABox and the method returns true.
 */
function addForAllExpansion( role, individual, concept )
{	
	for ( var i = 0; i < this.assertions.length; i++ )
	{
		var assertion = this.assertions[i] ;
		
		// We search for a role assertion that matches the role and the
		// given individual. If there is a match we have found a filler
		// individual y and we add C(y) to the ABox
		if ( assertion instanceof AssertionRole &&
			 assertion.getRole().equals( role ) &&
			 assertion.getIndividual1().equals( individual ) )
		{
			var conceptAssertion = new AssertionConcept( concept, assertion.getIndividual2() ) ;
			return this.addAssertion( conceptAssertion ) ;
		}
	}
	
	return false ;
}

function contains( assertion )
{
	for ( var i = 0; i < this.assertions.length; i++ )
	{
		var assertion1 = this.assertions[i] ;
		
		if ( assertion.equals( assertion1 ) )
			return true ;
	}
	
	return false ;
}

function isConsistent()
{	
	// An Abox is consistent iff there are no contraddictory atomic concept assertions
	// e.g. {C(a),  not C(a)}. Both concept names and individual names have to be equal.
	for ( var i = 0; i < this.assertions.length; i++ )
	{
		var assertion1 = this.assertions[i] ;
	
		// Check only concept assertions
		if ( assertion1 instanceof AssertionConcept )
		{
			var concept1 = assertion1.getConcept() ;
			var individual1 = assertion1.getIndividual() ;
			
			var expr1 = concept1.getExpr() ;
		
			// Ceck ony atomic expression
			if ( expr1 instanceof ExprAtomic )
			{
				for ( var j = 0; j < this.assertions.length; j++ )
				{
					var assertion2 = this.assertions[j] ;

					if ( assertion2 instanceof AssertionConcept )
					{
						var concept2 = assertion2.getConcept() ;
						var individual2 = assertion2.getIndividual() ;
						var expr2 = concept2.getExpr() ;

						if ( expr2 instanceof ExprAtomic )
						{
							// Now check if the two atomic concept names and individual names are equal
							if ( expr1.getName() == expr2.getName() && individual1.getName() == individual2.getName() )
							{
								// If one of the two atomic concepts is negated
								// then the ABox is inconsistent
								if ( ( expr1.isNegated() == true && expr2.isNegated() == false ) ||
									 ( expr1.isNegated() == false && expr2.isNegated() == true) )
								{
									this.consistent = false ;
								}
							}
						}
					}
				}
			}
		}
	}
	
	return this.consistent ;
}

function copy()
{
	var abox = new ABox() ;
	
	for ( var i = 0; i < this.assertions.length; i++ )
		abox.addAssertion( this.assertions[i] ) ;
	
	return abox ;
}

function toString()
{
	var list = new Array() ;
	
	for ( var i = 0; i < this.assertions.length; i++ )
		list.push( this.assertions[i].toString() ) ;
	
	return "{ " + list.join(", ") + " } " ;
}

function equals( abox )
{	
	// We have to perform both direction
	// Check assertions of this with those of abox
	// Check assertions of abox with those of this
	if ( equals2( this, abox) )
		if ( equals2( abox, this ) )
			return true ;

	return false ;
}

function equals2( abox1, abox2 )
{
	for ( var i = 0; i < abox1.getAssertions().length; i++ )
	{
		var assertion1 = abox1.getAssertions()[i] ;
		// We assume there is no corresponding equal assertion
		var equals = false ;
		
		for ( var j = 0; j < abox2.getAssertions().length; j++ )
		{
			var assertion2 = abox2.getAssertions()[j] ;
			
			// If we find one, OK
			if ( assertion1.equals( assertion2 ) )
				equals = true ;
		}
		
		// If we didn't find a corresponding assertion, then the ABoxes are not equal
		if ( equals == false )
			return false ;
	}
	
	return true ;
}

ABox.prototype.addAssertion = addAssertion ;
ABox.prototype.isConsistent = isConsistent ;
ABox.prototype.getAssertions = getAssertions ;
ABox.prototype.copy = copy ;
ABox.prototype.equals = equals ;
ABox.prototype.toString = toString ;
ABox.prototype.addForAllExpansion = addForAllExpansion ;
ABox.prototype.contains = contains ;
ABox.prototype.addExistsExpansion = addExistsExpansion ;
ABox.prototype.newIndividual = newIndividual ;
ABox.prototype.getLastAddedAssertion = getLastAddedAssertion ;

