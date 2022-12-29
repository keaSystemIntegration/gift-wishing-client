const getClient = require('durable-functions').getClient;

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp); 
    const client = getClient(context);
    const instanceId = await client.startNew('durable-functions-orchestrator', undefined, {input: 'Hello'});
};