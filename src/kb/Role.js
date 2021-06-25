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

/* Roles are assumed to be atomic names */

function Role( name ) 
{ 
	this.name = name ; 
	this.valid = false ;
	
	this.checkIsValid() ;
}

function getName()
{ return this.name ; }

function isValid()
{ return this.valid ; }

function equals( role )
{
	if (!( role instanceof Role ) )
		return false ;
	if ( this.name == null )
		return false ;
	if ( this.isValid() == null )
		return false ;
	if ( role.getName() == null )
		return false ;
	if ( role.isValid() == false )
		return false ;
		
	if ( this.name == role.getName() )
		return true ;
		
	return false ;
}

// -- PRIVATE FUNCTIONS --

function checkIsValid()
{
	// Role name are like atomic concept names, only A-Za-z range is allowed
	var reg = new RegExp("^[A-Za-z]+$", "g") ;
	
	if ( reg.exec( this.name ) )
		this.valid = true ;
} 

Role.prototype.getName = getName ;
Role.prototype.isValid = isValid ;
Role.prototype.equals = equals ;
Role.prototype.checkIsValid = checkIsValid ;
