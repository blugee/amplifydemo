const { ChargesCronjob } = require('./ChargesCronjob');
const { CancelSubscription } = require('./CancelSubscription');

const schedule = async function () {
    await ChargesCronjob();
    await CancelSubscription();
}

const CronJobs = {
    schedule
}


module.exports = CronJobs
