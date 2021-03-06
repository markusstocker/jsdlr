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
 
function Assertion() 
{ 
	// Mark assertions that have been processed as expanded. 
	// Assertions are expanded if the corresponding rule has been fired. 
	// Do not mark as processed assertions *per default* as expanded as the 
	// corresponding rule may fire at a subsequent step. Hence, mark assertions
	// as expanded only if the ABox.addAssertion() function returned true.
	this.expanded = false ;
}

function isExpanded()
{ return this.expanded ; }

function setExpanded( expanded ) 
{ this.expanded = expanded ; }

function toString() {}

function equals( assertion ) 
{ return false ; }

Assertion.prototype.isExpanded = isExpanded ;
Assertion.prototype.setExpanded = setExpanded ;
Assertion.prototype.toString = toString ;
Assertion.prototype.equals = equals ;

