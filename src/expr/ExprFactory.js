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
 
function ExprFactory() 
{}

/**
 * The function guesses the type of expression.
 * For instance, it checks if there is a subsumption symbol
 * and handles the expr as a subsumption expression.
 */
function createByGuessingExpr( expr )
{
	if ( isSubsumption( expr ) )
		return createBySubsumptionExpr( expr ) ;
	
	return createBySimpleExpr( expr ) ;
}

/**
 * The function normalizes the expr and executes create().
 */
function createBySimpleExpr( expr )
{ return create( normalize( expr) ) ; }

/**
 * The function takes a subsumption expression and
 * converts it to a simple expr according to
 * A subsumes B, A and not B
 */
function createBySubsumptionExpr( expr )
{
	expr = removeWhiteSpaces( expr ) ;	
	// Create the new expression (intersection and negate the subsumer
	expr = "((" + getSubsumee( expr ) + ")" + SQUARE_CAP + NEG + "(" + getSubsumer( expr ) + "))" ;

	return create( normalize( expr ) ) ;
}

/**
 * This function does not normalize and expression. 
 * Hence, when this function is used directly, 
 * the ExprFactory.prototype.normalize() should be executed
 * first.
 */
function create( expr ) 
{
	if ( ( expr.indexOf( SQUARE_CAP ) >= 0 || 
		   expr.indexOf( SQUARE_CUP ) >= 0 ) &&
		 expr.charAt( 0 ) == LEFT_PARENTHESIS )
		 // If the expression has and AND or OR then it is a complex expression
		return new ExprComplex( expr ) ;
	
	if ( expr.indexOf( FOR_ALL ) >= 0 || 
		 expr.indexOf( EXISTS ) >= 0 )
		/* If the expression doesn't have an AND or an OR but a FOR_ALL or EXISTS
		 * then it is a restriction expression */
		return new ExprRestriction( expr ) ;

	return new ExprAtomic( expr ) ;
}

// This is a normalization step for white spaces and parenthesis
function normalize( expr )
{ 
	// Remove white spaces
	expr = removeWhiteSpaces( expr ) ; 

	/**
	// Next we have to check that concept pairs are always enclosed by parenthesis
	// especially in the case where more than one operator of the same time is used
	var prevOP = 0 ;
	var nextOP = nextOpPos( expr, prevOP ) ;

	while ( nextOP >= 0 )
	{		
		if ( expr.charAt( prevOP ) == expr.charAt( nextOP ) )
		{
			// If there are two consecutive equal operators
			// Now we need to find the corresponding left and right sub expressions
			var left = expr.substr( 0, prevOP + 1 ) ;
			var right = expr.substr( left.length, expr.length ) ;
			expr = left + "(" + right + ")" ;
		}
		
		prevOP = nextOP ;
		nextOP = nextOpPos( expr, prevOP ) ;
	}
	*/
	
	// Transform expression to negation normal form
	expr = toNNF( expr ) ;
	
	// Add leading and closing parenthesis if not already set
	if (!( expr.charAt( 0 ) == LEFT_PARENTHESIS && 
		   expr.charAt( expr.length - 1 ) == RIGHT_PARENTHESIS ) )
		expr = "(" + expr + ")" ;
	
	return expr ;
}

function getSubsumee( expr )
{ return expr.split( SQUARE_IMAGE_OF_OR_EQUAL_TO )[0] ; }

function getSubsumer( expr )
{ return expr.split( SQUARE_IMAGE_OF_OR_EQUAL_TO )[1] ; }

function isSubsumption( expr )
{ 
	if ( expr.indexOf( SQUARE_IMAGE_OF_OR_EQUAL_TO ) >= 0 ) 
		return true ;

	return false ;
}

// -- PRIVATE FUNCTIONS --

function removeWhiteSpaces( expr )
{ return expr.replace( /\s/g, "" ) ; }

/**
function nextOpPos( expr, pos )
{
	while ( pos < expr.length )
	{
		var ch = expr.charAt( ++pos ) ;
		
		// We have a ( and need to jump over the sub expression
		if ( ch == LEFT_PARENTHESIS )
		{
			// Search for the position of the corresponding closing parenthesis
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
			
			pos = chIndex ;
		}
		else if ( ch == SQUARE_CAP || ch == SQUARE_CUP )
			return pos ;
	}
	
	return -1 ;
}
*/

function toNNF( expr )
{
	// Mark if a rule has fired. If true, execute toNNF() again
	var fired = true ;

	while ( fired )
	{
		fired = false ;
		
		// R1: not not C
		if ( expr.indexOf( NEG + NEG ) >= 0 )
		{
			expr = processNegNeg( expr ) ;
			fired = true ;
		}
		// R2: not(
		else if ( expr.indexOf( NEG + LEFT_PARENTHESIS ) >= 0 )
		{
			expr = processNegLeftPar( expr ) ;	
			fired = true ;
		}
		// R3: not forAll R.C
		else if ( expr.indexOf( NEG + FOR_ALL ) >= 0 )
		{
			expr = processNegForAll( expr ) ;
			fired = true ;
		}
		// R4: not exists R.C
		else if ( expr.indexOf( NEG + EXISTS ) >= 0 )
		{
			expr = processNegExists( expr ) ;	
			fired = true ;
		}
	}
	
	return expr ;
}

function processNegNeg( expr )
{ return expr.replace( NEG + NEG, "" ) ; }

function processNegLeftPar( expr )
{
	// Position of the negation with left parenthesis (NLP)
	var posNLP = expr.indexOf( NEG + LEFT_PARENTHESIS ) ;

	while ( posNLP >= 0 )
	{
		// The left side of the expression to the identified not(
		var leftExpr = expr.substr( 0, posNLP ) ;
		// The negated expression from ( to the corresponding closing )
		var negExpr = expr.substr( posNLP, getExprLength( expr.substr( posNLP, expr.length ) ) + 1 ) ;
		// The remainder of the expression from the 
		var rightExpr = expr.substr( leftExpr.length + negExpr.length, expr.length ) ; 
		expr = leftExpr + transformNegExpr( negExpr ) + rightExpr ;
		posNLP = expr.indexOf( NEG + LEFT_PARENTHESIS ) ;
	}
	
	return expr ;
}

function processNegForAll( expr )
{
	var posNF = expr.indexOf( NEG + FOR_ALL ) ;
			
	while ( posNF >= 0 )
	{
		var leftExpr = expr.substr( 0, posNF ) ;
		// posNF + 2 to skip the negation and quantifier chars (2)
		var restExpr = expr.substr( posNF + 2, expr.length ) ;
		var roleExpr = restExpr.substr( 0, restExpr.indexOf(".") ) ;
		var rightExpr = restExpr.substr( roleExpr.length + 1, restExpr.length ) ;
		expr = leftExpr + EXISTS + roleExpr + "." + NEG + rightExpr ;
		posNF = expr.indexOf( NEG + FOR_ALL ) ;
	}
	
	return expr ;
}

function processNegExists( expr )
{
	var posNE = expr.indexOf( NEG + EXISTS ) ;
			
	while ( posNE >= 0 )
	{
		var leftExpr = expr.substr( 0, posNE ) ;
		var restExpr = expr.substr( posNE + 2, expr.length ) ;
		var roleExpr = restExpr.substr( 0, restExpr.indexOf(".") ) ;
		var rightExpr = restExpr.substr( roleExpr.length + 1, restExpr.length ) ;
		expr = leftExpr + FOR_ALL + roleExpr + "." + NEG + rightExpr ;
		posNE = expr.indexOf( NEG + EXISTS ) ;	
	}
	
	return expr ;
}

function transformNegExpr( expr )
{
	// Remove the neg 
	expr = expr.substr( 1, expr.length ) ;

	// Remove the enclosing parenthesis
	if ( expr.charAt( 0 ) == LEFT_PARENTHESIS && expr.charAt( expr.length - 1 ) == RIGHT_PARENTHESIS )
		expr = expr.substr( 1, expr.length - 2 ) ;

	// Find the position of the middle operator, if there is one
	var pos = posOfOperator( expr ) ;
	
	if ( pos > 0 )
	{
		// We have a complex expression e.g. not(A and B)
		var leftExpr = expr.substr( 0, pos ) ;
		var operator = expr.charAt( pos ) ;
		var rightExpr = expr.substr( pos + 1, expr.length ) ;
	
		// Transformed expression
		if ( operator == SQUARE_CAP )
			expr = NEG + leftExpr + SQUARE_CUP + NEG + rightExpr ;
		else 
			expr = NEG + leftExpr + SQUARE_CAP + NEG + rightExpr ;
			
		expr = "(" + expr + ")" ;	
	}
	else
		// We have a simple expression which is enclosed by parenthesis, e.g. not(for all R.C)
		expr = NEG + expr ;
	
	return expr ;
}

function posOfOperator( expr )
{
	if ( expr.indexOf( LEFT_PARENTHESIS ) == 0 )
		return getExprLength( expr ) ;
	else if ( expr.indexOf( FOR_ALL ) == 0 )
		return -1 ;
	else if ( expr.indexOf( EXISTS ) == 0 )
		return -1 ;
	else if ( expr.indexOf( SQUARE_CUP ) >= 0 )
		return expr.indexOf( SQUARE_CUP ) ;
	else if ( expr.indexOf( SQUARE_CAP ) >= 0 )
		return expr.indexOf( SQUARE_CAP ) ;
	
	return -1 ;
}

function getExprLength( expr )
{
	var numOfOpPar = 1 ;
	var chIndex = 0 ;

	if ( expr.charAt( 0 ) == NEG )
		chIndex++ ;

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

ExprFactory.prototype.create = create ;
ExprFactory.prototype.getSubsumee = getSubsumee ;
ExprFactory.prototype.getSubsumer = getSubsumer ;
ExprFactory.prototype.isSubsumption = isSubsumption ;
ExprFactory.prototype.createByGuessingExpr = createByGuessingExpr ;
ExprFactory.prototype.createBySimpleExpr = createBySimpleExpr ;
ExprFactory.prototype.createBySubsumptionExpr = createBySubsumptionExpr ;
ExprFactory.prototype.normalize = normalize ;
