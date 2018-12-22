if(eventjs === undefined) { var eventjs = {}; }

;(function(ns) {
'use strict';

var callbacklist = ns;
if(typeof require === 'function') { callbacklist = require('./callbacklist.js'); }

function _EventDispatcher(params)
{
	this._eventCallbackListMap = {};
	params = params || {};
	this._getEvent = typeof params.getEvent === 'function' ? params.getEvent : null;
}

_EventDispatcher.prototype.appendListener = function(event, callback)
{
	return this._doGetCallbackList(event, true).append(callback);
}

_EventDispatcher.prototype.prependListener = function(event, callback)
{
	return this._doGetCallbackList(event, true).prepend(callback);
}

_EventDispatcher.prototype.insertListener = function(event, callback, before)
{
	return this._doGetCallbackList(event, true).insert(callback, before);
}

_EventDispatcher.prototype.removeListener = function(event, handle)
{
	var cbList = this._doGetCallbackList(event, false);
	if(cbList) {
		return cbList.remove(handle);
	}
	
	return false;
}

_EventDispatcher.prototype.dispatch = function()
{
	if(this._getEvent) {
		var cbList = this._doGetCallbackList(this._getEvent.apply(this, arguments), false);
		if(cbList) {
			var args = Array.prototype.slice.call(arguments, 0);
			cbList.dispatch.apply(cbList, args);
		}
	}
	else {
		var cbList = this._doGetCallbackList(arguments[0], false);
		if(cbList) {
			var args = Array.prototype.slice.call(arguments, 1);
			cbList.dispatch.apply(cbList, args);
		}
	}
}

_EventDispatcher.prototype._doGetCallbackList = function(event, createOnNotFound)
{
	if(this._eventCallbackListMap.hasOwnProperty(event)) {
		return this._eventCallbackListMap[event];
	}
	
	if(createOnNotFound) {
		var cbList = new callbacklist.CallbackList();
		this._eventCallbackListMap[event] = cbList;
		return cbList;
	}
	
	return null;
}

ns.EventDispatcher = _EventDispatcher;

if (typeof define === 'function' && define.amd) {
	define(function () { return ns;	});
}
else if (typeof module === 'object' && module.exports){
	module.exports = ns;
}
else {
}

})(eventjs);
