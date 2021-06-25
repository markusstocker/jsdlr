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
 
function Concept( expr )
{ this.expr = expr ; }

function getExpr() 
{ return this.expr ; }

function isValid()
{ return this.expr.isValid() ; }

function isAtomic()
{ return this.expr.isAtomic() ; }

function isComplex()
{ return this.expr.isComplex() ; }

function isNegated()
{
	// Only atomic expressions implement the isAtomic() function: machinery assumes NNF
	if ( this.isAtomic() )
		return this.expr.isNegated() ;
	
	return false ;
}

function toString()
{ return this.expr.toString() ; }

function equals( concept ) 
{
	if ( this.expr.equals( concept.getExpr() ) )
		return true ;
		
	return false ;
}

Concept.prototype.getExpr = getExpr ;
Concept.prototype.isValid = isValid ;
Concept.prototype.isAtomic = isAtomic ;
Concept.prototype.isComplex = isComplex ;
Concept.prototype.isNegated = isNegated ;
Concept.prototype.toString = toString ;
Concept.prototype.equals = equals ;
