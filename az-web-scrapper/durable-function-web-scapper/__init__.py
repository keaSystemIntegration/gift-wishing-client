import logging
import json

import azure.functions as func
import azure.durable_functions as df


def orchestrator_function(context: df.DurableOrchestrationContext):
    print("orchestrator_function has been called")
    result = yield context.call_activity('get-categories-url', "get-urls")
    print("result: ", result)
    # result2 = yield context.call_activity('Hello', "Seattle")
    # result3 = yield context.call_activity('Hello', "London")
    # return [result1, result2, result3]

main = df.Orchestrator.create(orchestrator_function)