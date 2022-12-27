import { orchestrator } from "durable-functions";

export default orchestrator( function* (context) {
    const outputs = [];
    const urlsForCategories = yield context.df.callActivity("get-categories-urls-activity", "Tokyo");
    const urlsForSubCategories = yield context.df.callActivity("get-sub-categories-url-activity", urlsForCategories);
    const products = yield context.df.callActivity("get-products-activity", urlsForSubCategories);
    const result = yield context.df.callActivity("create-sqlite-activity", products);
    const uploadResult = yield context.df.callActivity("sftp-connection-activity", result);
    context.log('uploadResult', uploadResult);
    return outputs;
});