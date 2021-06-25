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

/*
 * We assume that expressions are already in negation normal form.
 * This is an abstract class, a super class of ExprAtomic, ExprComplex
 * and ExprRestriction that should not be instantiated
 * 
 * Author: Markus Stocker
 * Version: $Id$
 */
 
function Expr( expr ) 
{
	this.expr = expr ;
	this.atomic = false ;
	this.complex = false ;
	this.restriction = false ;
	this.valid = false ;
}

function normalize()
{ return this.expr.replace( /\s/g, "" ) ; }

function isValid()
{ return this.valid ; }

function isAtomic()
{ return this.atomic ; }

function isComplex()
{ return this.complex ; }

function isRestriction()
{ return this.restriction ; }

function toString() 
{ return this.expr ; }

function getExpr()
{ return this.expr ; }

// This is a static method that can be called with Expr.normalize
Expr.prototype.normalize = normalize ;
Expr.prototype.isValid = isValid ;
Expr.prototype.isAtomic = isAtomic ;
Expr.prototype.isComplex = isComplex ;
Expr.prototype.isRestriction = isRestriction 
Expr.prototype.toString = toString ;
Expr.prototype.getExpr = getExpr ;
