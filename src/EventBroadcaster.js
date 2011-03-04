/*
 The MIT License
 
 Copyright (c) 2010 Jesse MacFadyen, Nitobi Software 
 jesse.macfadyen@nitobi.com
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation the 
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit 
 persons to whom the Software is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the 
 Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
 WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
 OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

function EventBroadcaster(){ this._eventMap = {}; };

// Adds a listener to the queue, 
EventBroadcaster.prototype = 
{
    on:function( eventName, responder, callback, params)
    {
    	// eventnames are stored case insensitively
    	var evtName = eventName.toLowerCase(); 
    	if(this._eventMap[evtName] == null)
    	{
    		this._eventMap[evtName] = [];
    	}
	
    	var evtObj = {rsp:responder,cb:callback};
    	if(params)
    	{
    		evtObj.params = params;
    	}
	
    	this._eventMap[evtName].push(evtObj);
    },
    

    fire:function(eventName)
    {
    	var evtName = arguments[0];
	
    	var evtArgs = [];
    	for(var n = 1; n < arguments.length; n++)
    	{
    		evtArgs.push(arguments[n]);
    	}
	
    	var eventObj = {name:evtName,target:this,args:evtArgs};
	
    	var listeners = this._eventMap[evtName.toLowerCase()];
    	if(listeners == null)
    		return;
	
    	// iterate in reverse order
    	for(var v = listeners.length - 1; v > -1; v--)
    	{
    		var lob = listeners[v];
    		// if we don't have a scope to callback from ... just callback
    		if(lob.rsp == undefined)
    		{
    			lob.cb(eventObj,lob.params);
    		}
    		else // responder is valid
    		{
    			// is callback defined ?
    			if(lob.cb != undefined)
    			{
    				if(typeof lob.cb == "function")
    				{
    					lob.cb.apply(lob.rsp,[eventObj,lob.params]);
    				}
    				else if(typeof lob.responder[lob.callback] == "function")
    				{
    					lob.rsp[lob.cb].apply(lob.rsp,[eventObj,lob.params]);
    				}
    				else
    				{
    					// wtf now ?
    				}
    			}
    			else // responder is valid, but listener was not supplied ...
    			{
    				// search for a method, of the pattern responder.onEventName
    				// note we use the Mixed case version of EventName
    				var eName = "on" + evtName;
    				if(typeof lob.rsp[eName] == "function")
    				{
    					lob.rsp[eName].apply(lob.rsp,[eventObj,lob.params]);
    				}
    			}
    		}
    	}
    },

    has:function(eventName, responder)
    {
    	var evtName = eventName.toLowerCase();
    	if(this._eventMap[evtName] == null || this._eventMap[evtName].length < 1 )
    	{
    		return false;
    	}
    	return true;
    },
    

    un:function(eventName,responder)
    {
    	var evtName = eventName.toLowerCase();
    	var responders = this._eventMap[evtName];
    	if(responders != null)
    	{
    		for(var n = responders.length; n > 0; n--)
    		{
    			if(responders[n-1].responder == responder)
    			{
    				return responders.splice(n-1,1);
    			}
    		}
    	}
    	return null;
    },

    will:function(eventName)
    {
    	return this._eventMap[eventName.toLowerCase()] != null;
    }
}


// Static method for attaching this functionality to another object
// install EB Methods on an instance:
// var myEB = {}; EventBroadcaster.initialize(myEB);
// or to a class :: EventBroadcaster.initialize(MyObj.prototype);
EventBroadcaster.init = function(targ)
{
	targ._eventMap = {};
	targ.on    = this.prototype.on;
	targ.fire = this.prototype.fire;
	targ.has    = this.prototype.has;
	targ.un = this.prototype.un;
	targ.will    = this.prototype.will;
}



