import React from "react";
import { Route, Switch} from "react-router-dom";

import asyncComponent from "util/asyncComponent";


const InBuiltApps = ({match}) => (
  <Switch>
    <Route path={`${match.url}/users`} exact component={asyncComponent(() => import('./Users'))}/>
    <Route path={`${match.url}/users/edit`} exact component={asyncComponent(() => import('./Users/AddUser/index'))}/>
    <Route path={`${match.url}/report/pendingreport`} exact component={asyncComponent(() => import('./Reports/PendingReports'))}/>
    <Route path={`${match.url}/report/purchasedreport`} exact component={asyncComponent(() => import('./Reports/PurchasedReports'))}/>
    <Route path={`${match.url}/billing/yearlysubscription`} exact component={asyncComponent(() => import('./Billing/YearlySubscription'))}/>
    <Route path={`${match.url}/billing/transactions/pendingtransactions`} exact component={asyncComponent(() => import('./Billing/Transactions/PendingTransaction'))}/>
    <Route path={`${match.url}/billing/transactions/settledtransactions`} exact component={asyncComponent(() => import('./Billing/Transactions/SettledTransaction'))}/>
    <Route path={`${match.url}/billing/transactions/settledtransactionsdetails`} exact component={asyncComponent(() => import('./Billing/Transactions/SettledTransactionDetails'))}/>
    <Route path={`${match.url}/billing/transactions/unsettledtransactions`} exact component={asyncComponent(() => import('./Billing/Transactions/UnSettledTransaction'))}/>
    <Route path={`${match.url}/customers`} exact component={asyncComponent(() => import('./Customers'))}/>
    <Route path={`${match.url}/paymentgateway/coupon`} exact component={asyncComponent(() => import('./PaymentGateway/Coupon'))}/>
    <Route path={`${match.url}/paymentgateway/coupon/add`} exact component={asyncComponent(() => import('./PaymentGateway/Coupon/AddCoupon/index'))}/>
    <Route path={`${match.url}/paymentgateway/promotioncode`} exact component={asyncComponent(() => import('./PaymentGateway/PromotionCode'))}/>
    <Route path={`${match.url}/paymentgateway/promotioncode/add`} exact component={asyncComponent(() => import('./PaymentGateway/PromotionCode/AddPromotionCode/index'))}/>
    <Route path={`${match.url}/setting/country`} exact component={asyncComponent(() => import('./Settings/Country'))}/>
    <Route path={`${match.url}/setting/country/add`} exact component={asyncComponent(() => import('./Settings/Country/AddCountry/index'))}/>
    <Route path={`${match.url}/setting/state`} exact component={asyncComponent(() => import('./Settings/State'))}/>
    <Route path={`${match.url}/setting/state/add`} exact component={asyncComponent(() => import('./Settings/State/AddState/index'))}/>
    <Route path={`${match.url}/setting/licensemainfilterlist`} exact component={asyncComponent(() => import('./Settings/LicenseMainFilterList'))}/>
    <Route path={`${match.url}/setting/licensemainfilterlist/add`} exact component={asyncComponent(() => import('./Settings/LicenseMainFilterList/AddFilter/index'))}/>
    <Route path={`${match.url}/licenseinformation`} exact component={asyncComponent(() => import('./LicenseInformation'))}/>
    <Route path={`${match.url}/licenseinformation/add`} exact component={asyncComponent(() => import('./LicenseInformation/AddLicense/index'))}/>
    <Route path={`${match.url}/licenseinformation/upload`} exact component={asyncComponent(() => import('./LicenseInformation/AddLicense/UploadCSV'))}/>
    <Route path={`${match.url}/billing/subscription`} exact component={asyncComponent(() => import('./Billing/Subscription'))}/>
    <Route path={`${match.url}/paymentgateway/product`} exact component={asyncComponent(() => import('./PaymentGateway/Product'))}/>
    <Route path={`${match.url}/paymentgateway/product/add`} exact component={asyncComponent(() => import('./PaymentGateway/Product/AddProduct'))}/>
    <Route path={`${match.url}/paymentgateway/pricing`} exact component={asyncComponent(() => import('./PaymentGateway/Pricing'))}/>
    <Route path={`${match.url}/paymentgateway/pricing/add`} exact component={asyncComponent(() => import('./PaymentGateway/Pricing/AddPricing'))}/>
    <Route path={`${match.url}/paymentgateway/subscriptionplan`} exact component={asyncComponent(() => import('./PaymentGateway/SubscriptionPlan'))}/>
    <Route path={`${match.url}/paymentgateway/subscriptionplan/add`} exact component={asyncComponent(() => import('./PaymentGateway/SubscriptionPlan/AddPlan'))}/>
    <Route path={`${match.url}/paymentgateway/authorizeuser`} exact component={asyncComponent(() => import('./PaymentGateway/AuthorizeUser'))}/>
    <Route path={`${match.url}/paymentgateway/features`} exact component={asyncComponent(() => import('./PaymentGateway/Features'))}/>
    <Route path={`${match.url}/paymentgateway/features/add`} exact component={asyncComponent(() => import('./PaymentGateway/Features/AddFeatures'))}/>
    <Route path={`${match.url}/setting/generalsettings`} exact component={asyncComponent(() => import('./Settings/GeneralSetting'))}/>
    <Route path={`${match.url}/setting/supportsettings`} exact component={asyncComponent(() => import('./Settings/SupportSettings'))}/>
    <Route path={`${match.url}/setting/subscription`} exact component={asyncComponent(() => import('./Settings/SubscriptionSettings'))}/>
    <Route path={`${match.url}/setting/EnvSettings`} exact component={asyncComponent(() => import('./Settings/EnvSettings'))}/>
    <Route path={`${match.url}/setting/EnvSettings/add`} exact component={asyncComponent(() => import('./Settings/EnvSettings/AddEnvSettings'))}/>
    <Route path={`${match.url}/setting/emailtemaplate`} exact component={asyncComponent(() => import('./Settings/EmailTemplate'))}/>
    <Route path={`${match.url}/setting/emailtemaplate/add`} exact component={asyncComponent(() => import('./Settings/EmailTemplate/AddTemplate'))}/>
    <Route path={`${match.url}/setting/alertsettings`} exact component={asyncComponent(() => import('./Settings/AlertSetting'))}/>
    <Route path={`${match.url}/setting/maintenancewindow`} exact component={asyncComponent(() => import('./Settings/MaintenanceWindow'))}/>
    <Route path={`${match.url}/setting/cronjobsettings`} exact component={asyncComponent(() => import('./Settings/Cronjob'))}/>
    {/* <Route path={`${match.url}/userlist`} component={asyncComponent(() => import('./table'))}/> */}

    <Route path={`${match.url}/setting/purchaseorder`} exact component={asyncComponent(() => import('./Settings/PurchaseOrder/index'))} />
  </Switch>
);

export default InBuiltApps;
