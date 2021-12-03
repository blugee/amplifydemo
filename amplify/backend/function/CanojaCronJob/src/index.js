const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
const { schedule } = require('./CronJob')

const server = awsServerlessExpress.createServer(app);

exports.handler = async (event, context) => {

  console.log(`EVENT: ${JSON.stringify(event)}`);
  // This will allow us to freeze open connections to a database
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Schedule start")
  // await schedule();
  console.log("Schedule end")
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
