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
 
function AssertionConcept(concept, individual)
{
	this.concept = concept ;
	this.individual = individual ;
}

function getConcept()
{ return this.concept ; }

function getIndividual()
{ return this.individual ; }

function toString()
{ return this.concept.getExpr().toString() + "(" + this.individual.toString() + ")" ; }

function equals( assertion )
{
	if (!( assertion instanceof AssertionConcept ) )
		return false ;
	if (!( this.concept instanceof Concept ) ) 
		return false ;
	if (!( this.individual instanceof Individual ) )
		return false ;
	if (!( assertion.getConcept() instanceof Concept ) )
		return false ; 
	if (!( assertion.getIndividual() instanceof Individual ) )
		return false ;

	if ( this.concept.equals( assertion.getConcept() ) && 
		 this.individual.equals( assertion.getIndividual() ) )
		 return true ;
		 
	return false ;
}

AssertionConcept.prototype = new Assertion() ;
AssertionConcept.prototype.getConcept = getConcept ;
AssertionConcept.prototype.getIndividual = getIndividual ;
AssertionConcept.prototype.toString = toString ;
AssertionConcept.prototype.equals = equals ;
