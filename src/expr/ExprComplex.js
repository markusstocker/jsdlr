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
 
function ExprComplex( expr )
{
	Expr.call( this, expr ) ;
	this.left = null ;
	this.right = null ;
	this.operator = null ;
	this.complex = true ;
	
	if ( this.expr )
	{
		this.parse( this.normalize() ) ;
		this.checkIsValid() ;
	}
}

function getLeft()
{ return this.left ; }

function getRight()
{ return this.right ; }

function getOperator()
{ return this.operator ; }

function equals( expr )
{
	if (!( expr instanceof ExprComplex ) )
		return false ;
	if ( this.left == null )
		return false ;
	if ( this.right == null )
		return false ;
	if ( this.operator == null )
		return false ;
	if ( expr.getLeft() == null )
		return false ;
	if ( expr.getRight() == null )
		return false ;
	if ( expr.getOperator() == null )
		return false ;
		
	if ( this.left.equals( expr.getLeft() ) &&
		 this.right.equals( expr.getRight() ) &&
		 this.operator == expr.getOperator() )
		return true ;
	
	return false ;
}

// -- PRIVATE FUNCTIONS --

function parse( expr )
{
	// We assume that a complex expressions is enclosed by parenthesis
	if (!( expr.charAt( 0 ) == LEFT_PARENTHESIS &&
		   expr.charAt( expr.length - 1 ) == RIGHT_PARENTHESIS ) )
		return ;
		
	// First strip the both external parenthesis
	expr = expr.substr( 1, expr.length - 2 ) ;

	if ( expr.charAt(0) == LEFT_PARENTHESIS )
	{
		// There are complex sub expressions, e.g. (A and B) or (C and D)		
		var operatorIndex = this.getExprLength( expr ) + 1 ;
		this.operator = expr.charAt( operatorIndex ) ;
		this.left = ExprFactory.prototype.create( expr.substr( 0, operatorIndex ) ) ;
		this.right = ExprFactory.prototype.create( expr.substr( operatorIndex + 1, expr.length ) ) ;
 	}
 	else if ( expr.indexOf( FOR_ALL ) >= 0 || expr.indexOf( EXISTS ) >= 0 )
 		this.matchQt( expr ) ;
	else if ( expr.indexOf( SQUARE_CAP ) >= 0 )
	{
		// The expression is of type A and B (possibly negated)
		this.operator = SQUARE_CAP ;
		this.matchOp( expr ) ;
	}
	else if ( expr.indexOf( SQUARE_CUP ) >= 0 )
	{
		// The expression is of type A or B (possibily negated)
		this.operator = SQUARE_CUP ;
		this.matchOp( expr ) ;
	}
}

function checkIsValid() 
{
	if ( this.operator == null ||
		 this.left == null ||
		 this.right == null )
		return ;
		
	if ( ( this.operator == SQUARE_CAP || this.operator == SQUARE_CUP )
		 && this.left.isValid()
		 && this.right.isValid() )
		this.valid = true ;
}

function matchOp( expr )
{
	var reg = new RegExp( "^(.+?)(" + this.operator + ")(.+)$", "g" ) ;
	var subExprs  = reg.exec( expr ) ;
	
	if ( subExprs )
	{
		this.left = ExprFactory.prototype.create( subExprs[1] ) ;
		this.right = ExprFactory.prototype.create( subExprs[3] ) ;
	}
}

/**
 * The method essentially finds the position of the operator of the 
 * complex expression expr. Then it splits the complex expression
 * in two left and right sub expressions.
 * We have to consider that the quantifier (either exists or forAll)
 * may be on the left side of the operator, on the right side of the
 * operator or on both sides.
 */
function matchQt( expr )
{
	var operatorIndex = null ;
	
	// Regular expression to match the quantifier on the left side of the complex expression
	// LQ, left quantifier
	var regLQ = new RegExp( "^([" + FOR_ALL + EXISTS + "].+?\\.)(.*)$", "g" ) ;
	var matchesLQ = regLQ.exec( expr ) ;
	
	if ( matchesLQ )
	{
		// The left side of the complex expression contains a quantifier
		// The right side of the expression may contain a quantifier too, this is 
		// handled automatically
		var leftOfDot = matchesLQ[1] ;
		var rightOfDot = matchesLQ[2] ;

		if ( rightOfDot.charAt( 0 ) == LEFT_PARENTHESIS )
			// e.g. forAll R. + (A and B).length + 1
			operatorIndex = leftOfDot.length + this.getExprLength( rightOfDot ) + 1 ;
		else
		{
			// The role filler is a simple concept name
			// e.g. forAll R. + C
			var regRN = new RegExp( "^(.+?)([" + SQUARE_CAP + SQUARE_CUP + "].*)$", "g") ;
			var matchesRN = regRN.exec( rightOfDot ) ;
			operatorIndex = leftOfDot.length + matchesRN[1].length ;
		}
	}
	else
	{
		// The quantifier does not match the left side, it has to match the right side
		// The left side of the expression is necessarily either an atomic expression
		// or a complex expression. The case of a complex expression with opening 
		// parenthesis is handled earlier by parse()
		// We handle here, hence, only atomic expression. 
		// Read the atomic concept name until the next operator
		// e.g. A or forAll R.(C and D)
		var regRQ = new RegExp( "^(.+?)([" + SQUARE_CAP + SQUARE_CUP + "].*)$", "g" ) ; 
		var matchesRQ = regRQ.exec( expr ) ;
		// No +1 as in parse() because this expr has no leading parenthesis
		operatorIndex = matchesRQ[1].length ;
	}
	
	var exprLeft = expr.substr( 0, operatorIndex ) ;
	var exprRight = expr.substr( operatorIndex + 1, expr.length ) ;
	this.operator = expr.charAt( operatorIndex ) ;
	this.left = ExprFactory.prototype.create( exprLeft ) ;
	this.right = ExprFactory.prototype.create( exprRight ) ;
}

// Given a complex expression, the method returns the length of the next complete complex expression
// i.e. the position of the correct corresponding closing parenthesis of a complex expression
// e.g. for expr = (AaB)aB, the method returns 5 (a = and, one char length 1
function getExprLength( expr )
{
	var numOfOpPar = 1 ;
	var chIndex = 0 ;
		
	while ( numOfOpPar > 0 )
	{
		var ch = expr.charAt( ++chIndex ) ;

		if ( ch == LEFT_PARENTHESIS )
			numOfOpPar++ ;
		else if ( ch == RIGHT_PARENTHESIS )
			numOfOpPar-- ;
	}
			
	return chIndex ;
}


ExprComplex.prototype = new Expr() ;
ExprComplex.prototype.getLeft = getLeft ;
ExprComplex.prototype.getRight = getRight ;
ExprComplex.prototype.getOperator = getOperator ;
ExprComplex.prototype.equals = equals ;
ExprComplex.prototype.parse = parse ;
ExprComplex.prototype.checkIsValid = checkIsValid ;
ExprComplex.prototype.matchOp = matchOp ;
ExprComplex.prototype.matchQt = matchQt ;
ExprComplex.prototype.getExprLength = getExprLength ;




