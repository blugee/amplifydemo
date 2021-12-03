var moment = require('moment');

const replaceVariables = (content, data, req, type, sender) => {
    return new Promise(resolve => {
        console.log("req  >> ", req)
        content = content.split("{{GEN_FIRST_NAME}}").join(data.given_name);
        content = content.split("{{GEN_LAST_NAME}}").join(data.family_name);
        content = content.split("{{CREATE_DATE}}").join(moment().format("MM-DD-YYYY HH:MM"));
        content = content.split("{{GEN_CONTACT_EMAIL}}").join(sender);

        if (type === 'invoice' && req.transactionDetails) {
            invoiceNo
            if (req.transactionDetails.order && req.transactionDetails.order.description) {
                content = content.split("{{INV_NUMBER}}").join(req.transactionDetails.order.description);
            } else {
                content = content.split("{{INV_NUMBER}}").join('');
            }
            if (req.transactionDetails.order && req.transactionDetails.order.description) {
                content = content.split("{{BILLING_REASON}}").join(req.transactionDetails.order.description);
            } else {
                content = content.split("{{BILLING_REASON}}").join('');
            }
            if (req.transactionDetails.order && req.transactionDetails.transactionType) {
                content = content.split("{{INV_TYPE}}").join(req.transactionDetails.transactionType);
            } else {
                content = content.split("{{INV_TYPE}}").join('');
            }
            content = content.split("{{STATUS}}").join(req.transactionDetails.transactionStatus);
            if (Number(req.transactionDetails.settleAmount)) {
                content = content.split("{{INVOICE_AMOUNT}}").join(Number(req.transactionDetails.settleAmount));
            } else {
                content = content.split("{{INVOICE_AMOUNT}}").join("");
            }
            if (Number(req.transactionDetails.invoiceNo)) {
                content = content.split("{{INVOICE_NUMBER}}").join(Number(req.transactionDetails.invoiceNo));
            } else {
                content = content.split("{{INVOICE_NUMBER}}").join("");
            }
            if (Number(req.transactionDetails.invoiceNo)) {
                content = content.split("{{INV_CONFORMATION_NUMBER}}").join(Number(req.transactionDetails.transactionId));
            } else {
                content = content.split("{{INV_CONFORMATION_NUMBER}}").join("");
            }
        } else {
            content = content.split("{{INV_NUMBER}}").join('');
            content = content.split("{{INV_TYPE}}").join('');
            content = content.split("{{INV_CONFORMATION_NUMBER}}").join("");
            content = content.split("{{BILLING_REASON}}").join('');
            content = content.split("{{STATUS}}").join('');
            content = content.split("{{INVOICE_AMOUNT}}").join('');
            content = content.split("{{INVOICE_NUMBER}}").join('');
        }

        if (type === 'subscription' && req.subscriptionPaymentSchedule) {
            content = content.split("{{SUB_CURRENT_TYPE}}").join(req.subscriptionPaymentSchedule.subscriptionName);
            content = content.split("{{SUB_CANCEL_DATE}}").join(moment().format("MM-DD-YYYY HH:MM"));
            content = content.split("{{SUB_ID}}").join(req.body.payload.id);
            content = content.split("{{SUB_PERIOD_START_DATE}}").join(req.subscriptionPaymentSchedule.startDate);
            content = content.split("{{SUB_PERIOD_END_DATE}}").join(req.subscriptionPaymentSchedule.totalOccurrences);
            if (Number(req.subscriptionPaymentSchedule.amount)) {
                content = content.split("{{SUB_RECORD_COST}}").join(Number(req.subscriptionPaymentSchedule.amount));
            }
            if (req.subscriptionPaymentSchedule.interval) {
                content = content.split("{{INTERVAL}}").join(req.subscriptionPaymentSchedule.interval.length + " " + req.subscriptionPaymentSchedule.interval.unit);
            } else {
                content = content.split("{{INTERVAL}}").join('');
            }
        } else {
            content = content.split("{{SUB_CURRENT_TYPE}}").join('');
            content = content.split("{{SUB_CANCEL_DATE}}").join(moment().format("MM-DD-YYYY HH:MM"));
            content = content.split("{{SUB_ID}}").join('');
            content = content.split("{{SUB_PERIOD_START_DATE}}").join('');
            content = content.split("{{SUB_PERIOD_END_DATE}}").join('');
            content = content.split("{{SUB_RECORD_COST}}").join('');
            content = content.split("{{INTERVAL}}").join('');
        }
        console.log(content)
        resolve(content)
    })
}

const Connecters = {
    replaceVariables
}


module.exports = Connecters