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
 
function AssertionRole(role, individual1, individual2)
{
	this.role = role ;
	this.individual1 = individual1 ;
	this.individual2 = individual2 ;
}

function getRole()
{ return this.role ; }

function getIndividual1()
{ return this.individual1; }

function getIndividual2()
{ return this.individual2; }

function equals( assertion )
{
	if (!( assertion instanceof AssertionRole ) )
		return false ;
	if (!( this.role instanceof Role ) )
		return false ;
	if (!( this.individual1 instanceof Individual ) )
		return false ;
	if (!( this.individual2 instanceof Individual ) )
		return false ;
	if (!( assertion.getRole() instanceof Role ) )
		return false ;
	if (!( assertion.getIndividual1() instanceof Individual ) )
		return false ;
	if (!( assertion.getIndividual2() instanceof Individual ) )
		return false ;
	
	if ( this.role.equals( assertion.getRole() ) &&
		 this.individual1.equals( assertion.getIndividual1() ) && 
		 this.individual2.equals( assertion.getIndividual2() ) )
		return true ;
		
	return false ;
}

function toString()
{ return this.role.getName() + "(" + this.individual1.toString() + ", " + this.individual2.toString() + ")" ; }

AssertionRole.prototype = new Assertion() ;
AssertionRole.prototype.getRole = getRole ;
AssertionRole.prototype.getIndividual1 = getIndividual1 ;
AssertionRole.prototype.getIndividual2 = getIndividual2 ;
AssertionRole.prototype.toString = toString ;
AssertionRole.prototype.equals = equals ;
