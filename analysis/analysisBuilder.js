/* global module */
/* global require */

"use strict";

(function(exp) {
	function AnalysisBuilder(sandbox, runTimeInfo) {
		this.sandbox = sandbox;
		this.runTimeInfo = runTimeInfo;

		this.buildCallbacks = function() {
			var functionsExecutionStack = new (require("../utils/functionsExecutionStack.js")).FunctionsExecutionStack();
			var mapShadowIds = {};
			var mapMethodIdentifierInteractions = {};
			var sMemoryInterface = new (require("../utils/sMemoryInterface.js")).SMemoryInterface(sandbox.smemory);

			var argumentContainerFinder = new (require("../utils/argumentContainerFinder.js")).ArgumentContainerFinder(
				runTimeInfo,
				mapShadowIds
			);

			return {
				functionEnter: new (require("./callbacks/functionEnter.js")).FunctionEnter(
					runTimeInfo,
					functionsExecutionStack
				),
				functionExit: new (require("./callbacks/functionExit.js")).FunctionExit(
					functionsExecutionStack
				),
				declare: new (require("./callbacks/declare.js")).Declare(
					runTimeInfo,
					functionsExecutionStack,
					mapShadowIds,
					sMemoryInterface
				),
				invokeFunPre: new (require("./callbacks/invokeFunPre.js")).InvokeFunPre(
					runTimeInfo,
					functionsExecutionStack,
					mapMethodIdentifierInteractions,
					sMemoryInterface,
					argumentContainerFinder
				),
				getFieldPre: new (require("./callbacks/getFieldPre.js")).GetFieldPre(
					functionsExecutionStack,
					mapMethodIdentifierInteractions,
					sMemoryInterface,
					argumentContainerFinder
				),
				putFieldPre: new (require("./callbacks/putFieldPre.js")).PutFieldPre(
					functionsExecutionStack,
					sMemoryInterface,
					argumentContainerFinder
				),
				write: new (require("./callbacks/write.js")).Write(functionsExecutionStack)
			};
		};
	}

	exp.AnalysisBuilder = AnalysisBuilder;

})(module.exports);