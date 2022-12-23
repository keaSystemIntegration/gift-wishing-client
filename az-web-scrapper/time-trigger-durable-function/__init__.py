import datetime
import logging

import azure.functions as func
import azure.durable_functions as df


async def main(mytimer: func.TimerRequest, starter: str) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()

    if mytimer.past_due:
        logging.info('The timer is past due!')

    logging.info('Python timer trigger function ran at %s', utc_timestamp)

    client = df.DurableOrchestrationClient(starter)
    print("client has been created")
    instance_id = await client.start_new("durable-function-web-scapper")

