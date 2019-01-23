/* global J$ */

"use strict";

(function (sandbox) {
	function Stack() {
		this.s = [];

		this.push = function(data) {
			this.s.push(data);
		};

		this.pop = function() {
			return this.s.pop();
		};

		this.top = function() {
			if (this.s.length === 0) {
				return null;
			}

			return this.s[this.s.length - 1];
		};

		this.isEmpty = function() {
			return (this.s.length === 0);
		};
	}

	function FunctionsExecutionStack() {
		this.stack = new Stack();
		this.bufferLastStopped = null;

		let counter = 1;

		this.addExecution = function(iid) {
			var execution = {
				fid: iid,
				traceId: "trace_" + counter
			};

			counter++;

			this.stack.push(execution);
		};

		this.getLastStopped = function() {
			return this.bufferLastStopped;
		}

		this.stopExecution = function() {
			this.bufferLastStopped = this.stack.pop();
		};

		this.getCurrentExecutingFunction = function() {
			var currentExecution = this.getCurrentExecution();

			if (currentExecution) {
				return currentExecution.fid;
			} else {
				return currentExecution;
			}
		};

		this.getCurrentExecution = function () {
			return this.stack.top();
		};

		this.isThereAFunctionExecuting = function() {
			return !this.stack.isEmpty();
		};
	}

	if (sandbox.utils === undefined) {
		sandbox.utils = {};
	}

	sandbox.utils.functionsExecutionStack = new FunctionsExecutionStack();
}(J$));