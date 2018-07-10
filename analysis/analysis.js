/* global J$ */
/* global require */

// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

"use strict";

(function (sandbox) {
    function Analysis() {
        sandbox.RuntimeInfo = {
            functions: {}
        };

        sandbox.RuntimeInfoTemp = {
            functionsExecutionStack: new (require("../utils/functionsExecutionStack.js")).FunctionsExecutionStack(),
            mapShadowIds: {},
            mapMethodIdentifierInteractions: {}
        };

        var sMemoryInterface = new (require("../utils/sMemoryInterface.js")).SMemoryInterface(sandbox.smemory);

        var argumentContainerFinder = new (require("../utils/argumentContainerFinder.js")).ArgumentContainerFinder(
            sandbox.RuntimeInfo.functions,
            sandbox.RuntimeInfoTemp.mapShadowIds
        );

        var callbacks = {
            functionEnter: new (require("./callbacks/functionEnter.js")).FunctionEnter(
                sandbox.RuntimeInfo.functions,
                sandbox.RuntimeInfoTemp.functionsExecutionStack
            ),
            functionExit: new (require("./callbacks/functionExit.js")).FunctionExit(
                sandbox.RuntimeInfoTemp.functionsExecutionStack
            ),
            declare: new (require("./callbacks/declare.js")).Declare(
                sandbox.RuntimeInfo.functions,
                sandbox.RuntimeInfoTemp.functionsExecutionStack,
                sandbox.RuntimeInfoTemp.mapShadowIds,
                sMemoryInterface
            ),
            invokeFunPre: new (require("./callbacks/invokeFunPre.js")).InvokeFunPre(
                sandbox.RuntimeInfo.functions,
                sandbox.RuntimeInfoTemp.functionsExecutionStack,
                sandbox.RuntimeInfoTemp.mapMethodIdentifierInteractions,
                sMemoryInterface,
                argumentContainerFinder
            ),
            getFieldPre: new (require("./callbacks/getFieldPre.js")).GetFieldPre(
                sandbox.RuntimeInfoTemp.functionsExecutionStack,
                sandbox.RuntimeInfoTemp.mapMethodIdentifierInteractions,
                sMemoryInterface,
                argumentContainerFinder
            ),
            putFieldPre: new (require("./callbacks/putFieldPre.js")).PutFieldPre(
                sandbox.RuntimeInfoTemp.functionsExecutionStack,
                sMemoryInterface,
                argumentContainerFinder
            ),
            write: new (require("./callbacks/write.js")).Write()
        };

        this.functionEnter = function(iid, f) {
            return callbacks.functionEnter.runCallback(iid, f);
        };

        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            return callbacks.functionExit.runCallback(iid, returnVal, wrappedExceptionVal);
        };

        this.declare = function(iid, name, val, isArgument, argumentIndex) {
            return callbacks.declare.runCallback(iid, name, val, isArgument, argumentIndex);
        };

        this.invokeFunPre = function(
            iid,
            f,
            base,
            args,
            isConstructor,
            isMethod,
            functionIid
        ) {
            return callbacks.invokeFunPre.runCallback(
                iid,
                f,
                base,
                args,
                isConstructor,
                isMethod,
                functionIid
            );
        };

        this.getFieldPre = function(
            iid,
            base,
            offset,
            isComputed,
            isOpAssign,
            isMethodCall
        ) {
            return callbacks.getFieldPre.runCallback(
                iid,
                base,
                offset,
                isComputed,
                isOpAssign,
                isMethodCall
            );
        };

        this.putFieldPre = function(iid, base, offset, val, isComputed, isOpAssign) {
            return callbacks.putFieldPre.runCallback(
                iid,
                base,
                offset,
                val,
                isComputed,
                isOpAssign
            );
        };

        this.write = function (iid, name, val) {
            return callbacks.write.runCallback(val);
        };

        this.endExecution = function() {
            console.log(JSON.stringify(sandbox.RuntimeInfo.functions, null, 4));
        };
    }

    sandbox.analysis = new Analysis();
}(J$));