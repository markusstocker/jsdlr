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
 
function ExprAtomic( expr )
{
	Expr.call( this, expr ) ;
	this.name = null ;
	this.negated = false ;
	this.atomic = true ;
	
	if ( this.expr )
	{
		this.parse( this.normalize() ) ;
		this.checkIsValid() ;
	}
}

function getName()
{ return this.name ; }

function isNegated()
{ return this.negated ; }

function equals( expr )
{
	if (!( expr instanceof ExprAtomic) )
		return false ;
	if ( this.valid == false )
		return false ;
	if ( this.name == null ) 
		return false ;
	if ( expr.isValid() == false )
		return false ;
	if ( expr.getName() == null )
		return false ;

	if ( this.name == expr.getName() && this.negated == expr.isNegated() )
		return true ;
		
	return false ;
}

// --- PRIVATE FUNCTIONS ---

// IN: String
function parse( expr )
{
	if ( expr.charAt( 0 ) == LEFT_PARENTHESIS )
	{
		if ( expr.charAt( expr.length - 1 ) == RIGHT_PARENTHESIS )
			// We have something like (A) or (notA); strip the start and stop parenthesis
			expr = expr.substr( 1, expr.length - 2 ) ;
		else
			// Invalid syntax
			return ;
	}
		 
	// An atomic expression may be either A or notA (i.e. negated or not)
	if ( expr.charAt( 0 ) == NEG )
	{
		this.negated = true ;
		// Strip the negation from the expression to get the name
		this.name = expr.substr( 1, expr.length ) ;
	}
	else
		this.name = expr ;
}

function checkIsValid()
{
	var reg = new RegExp("^[A-Za-z]+$", "g") ;
	
	if ( reg.exec( this.name ) )
		this.valid = true ;
} 

ExprAtomic.prototype = new Expr() ;
ExprAtomic.prototype.getName = getName ;
ExprAtomic.prototype.isNegated = isNegated ;
ExprAtomic.prototype.equals = equals ;
ExprAtomic.prototype.parse = parse ;
ExprAtomic.prototype.checkIsValid = checkIsValid ;
