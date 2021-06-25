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
 
function ExprRestriction( expr )
{
	Expr.call( this, expr ) ;
	this.restriction = true ;
	this.quantifier = null ;
	this.role = null ;
	this.filler = null ;
	
	if ( this.expr )
	{
		this.parse( this.normalize() ) ;
		this.checkIsValid() ;
	}
}

function getQuantifier()
{ return this.quantifier ; }

function getRoleName()
{ return this.role ; }

function getFillerExpr()
{ return this.filler ; }

function equals( expr )
{
	if (!( expr instanceof ExprRestriction ) )
		return false ;
	if ( this.valid == false )
		return false ;
	if ( this.quantifier == null ) 
		return false ;
	if ( this.role == null )
		return false ;
	if ( this.filler == null )
		return false ;
	if ( expr.isValid() == false )
		return false ;
	if ( expr.getQuantifier() == null )
		return false ;
	if ( expr.getRoleName() == null )
		return false ;
	if ( expr.getFillerExpr() == null )
		return false ;
		
	if ( this.quantifier == expr.getQuantifier() &&
		 this.role == expr.getRoleName() &&
		 this.filler.equals( expr.getFillerExpr() ) )
		return true ;
		
	return false ;
}

// -- PRIVATE FUNCTIONS --

// IN: String
function parse( expr )
{
	if ( expr.charAt(0) == LEFT_PARENTHESIS )
	{
		if ( expr.charAt( expr.length - 1 ) == RIGHT_PARENTHESIS )
			expr = expr.substr( 1, expr.length - 2 ) ;
		else
			return ;
	}
	
	var indexOfDot = expr.indexOf(".") ;
	
	this.quantifier = expr.charAt(0) ;
	this.role = expr.substr( 1, indexOfDot - 1 ) ;
	this.filler = ExprFactory.prototype.create( expr.substr( indexOfDot + 1, expr.length ) ) ;
}

function checkIsValid()
{
	var reg = new RegExp("^[A-Za-z]+$", "g") ;
	
	if ( ( this.quantifier == FOR_ALL ||
		   this.quantifier == EXISTS ) &&
		 reg.exec( this.role ) &&  
		 this.filler.isValid() )
		this.valid = true ;
}

ExprRestriction.prototype = new Expr() ;
ExprRestriction.prototype.getQuantifier = getQuantifier ;
ExprRestriction.prototype.getRoleName = getRoleName ;
ExprRestriction.prototype.getFillerExpr = getFillerExpr ;
ExprRestriction.prototype.equals = equals ;
ExprRestriction.prototype.parse = parse ;
ExprRestriction.prototype.checkIsValid = checkIsValid ;
