var express = require('express')
const route = express.Router()
const Customer = require('./Customer')
const Subscription = require('./Subscription')
const Webhook = require('./Webhook')
const LicenseInformation = require('./LicenseInformation')
const LicenseMainFilter = require('./LicenseMainFilter')
const GeneralSettings = require('./GeneralSettings')
const Transections = require('./Transections')
const DemoData = require('./DemoData')
const SubscriptionSettings = require('./SubscriptionSettings')
const EmailTemplate = require('./EmailTemplate')
const SupportSettings = require('./SupportSettings')
const AlertSettings = require('./AlertSettings')
const GuestUserControl = require('./GuestUserControl')
const MaintenanceWindow = require('./MaintenanceWindow')
const DeleteUser = require('./DeleteUser')
const Charge = require('./Charge')
const User = require('./User')
const SubscriptionRequest = require('./SubscriptionRequest');
const PurchaseOrderSettings = require('./PurchaseOrderSettings');
const CronJob = require('./CronJobApi');


route.use(
    '/',
    Customer,
    Subscription,
    Webhook,
    LicenseInformation,
    LicenseMainFilter,
    GeneralSettings,
    Transections,
    DemoData,
    SubscriptionSettings,
    EmailTemplate,
    SupportSettings,
    AlertSettings,
    DeleteUser,
    GuestUserControl,
    MaintenanceWindow,
    Charge,
    User,
    SubscriptionRequest,
    PurchaseOrderSettings,
    CronJob
)


module.exports = route