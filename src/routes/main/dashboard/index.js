import React from "react";
import { Col, Row } from "antd";
import './index.css'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartCard from "components/dashboard/ChartCard";
import Auxiliary from "util/Auxiliary";
import { listCouponsPagination, listLicenseInformationsPagination, listPendingReportPagination, listPurchaseReportPagination, listUserPagination } from "../../../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import { getSubscriptions } from "../../service/ReportService";
import moment from "moment";

function CustomTooltip({ payload, label, active }) {
  if (active && payload) {
    return (
      <div className="recharts-default-tooltip">
        <p>{payload[0].payload.name}</p>
        <p className="recharts-tooltip-item-list ">{`${payload[0].name} : ${parseInt(payload[0].value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}</p>
      </div>
    );
  }
  return null;
}

function CustomTooltipForAmount({ payload, label, active }) {
  if (active && payload) {
    return (
      <div className="recharts-default-tooltip">
        <p>{payload[0].payload.name}</p>
        <p className="recharts-tooltip-item-list ">{`${payload[0].name} : ${parseInt(payload[0].value / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}</p>
      </div>
    );
  }
  return null;
}

function CustomTooltipForDate({ payload, label, active }) {
  if (active && payload) {
    return (
      <div className="recharts-default-tooltip">
        <p>{payload[0].payload.name}</p>
        <p className="recharts-tooltip-item-list ">{`Current Period Startdate : ${moment(payload[0].value * 1000).format('DD/MM/YYYY')}`}</p>
      </div>
    );
  }
  return null;
}

function AmountOffCustomTooltip({ payload, label, active }) {
  if (active && payload) {
    return (
      <div className="recharts-default-tooltip">
        <p>{payload[0].payload.name}</p>
        <p className="recharts-tooltip-item-list ">{`Amount Off : ${parseInt(payload[0].value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}</p>
      </div>
    );
  }
  return null;
}

function ChargeAmountTooltip({ payload, label, active }) {
  if (active && payload) {
    return (
      <div className="recharts-default-tooltip">
        <p>{payload[0].payload.name}</p>
        <p className="recharts-tooltip-item-list ">{`Charge Amount : ${parseInt(payload[0].value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}</p>
      </div>
    );
  }
  return null;
}
function SettleAmountTooltip({ payload, label, active }) {
  if (active && payload) {
    return (
      <div className="recharts-default-tooltip">
        <p>{payload[0].payload.name}</p>
        <p className="recharts-tooltip-item-list ">{`Settle Amount : ${parseInt(payload[0].value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}</p>
      </div>
    );
  }
  return null;
}

function PrOffCustomTooltip({ payload, label, active }) {
  if (active && payload) {
    return (
      <div className="recharts-default-tooltip">
        <p>{payload[0].payload.name}</p>
        <p className="recharts-tooltip-item-list ">{`Percentage Off : ${payload[0].value} %`}</p>
      </div>
    );
  }
  return null;
}

class Crypto extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      purchsedReport: '--',
      pendingReport: '--',
      amountOffCoupons: '--',
      percentageOffCoupons: '--',
      amountOffpromotioncode: '--',
      pendingTransaction: '--',
      unSettledTransaction: '--',
      monthlySubscription: '--',
      annualSubscription: '--',
      totalRecords: '--',
      totalUsers: '--',
      purchasedReportData: [],
      pendingReportData: [],
      amountCouponData: [],
      prCouponData: [],
      amountPromotioncode: [],
      pendingTransactionData: [],
      unSettledTransactionData: [],
      monthlySubscriptionData: [],
      annualSubscriptionData: [],
      totalRecordsData: [],
      totalUsersData: [],
    }
  }

  componentDidMount() {
    this.getInitialData()
  }

  getInitialData = async () => {
    this.fetchPurchasedReport()
    this.fetchPendingReport()
    this.fetchCouponsData()
    this.fetchPendingTransaction()
    this.fetchUnsettledtransaction()
    this.fetchSubscription()
    this.fetchTotalRecords()
    this.fetchTotalUsers()
  }

  fetchPurchasedReport = async () => {
    let purchsedReport = this.state.purchsedReport
    let purchasedReportbody = {
      page: 1,
      size: 500,
    }

    await API.graphql(graphqlOperation(listPurchaseReportPagination, purchasedReportbody))
      .then(async (result) => {
        result = result.data.listPurchaseReportPagination
        if (result.items) {
          let purchasedData = this.formatData(result.items, 'reportname')
          let totalRecords = result.items.length
          if (purchsedReport !== '--') {
            totalRecords = result.items.length + purchsedReport
          }
          let totalData = purchasedData
          totalData = this.state.purchasedReportData.concat(purchasedData)
          this.setState({ purchsedReport: totalRecords, purchasedReportData: totalData })
          if (result.total > purchsedReport) {
            this.fetchPurchasedReport()
          }
        }
      })
  }

  fetchPendingReport = async () => {
    let pendingReport = this.state.pendingReport
    let pendingReportBody = {
      page: 1,
      size: 500,
      filter: `downloadStatus = 'false'`,
    }

    await API.graphql(graphqlOperation(listPendingReportPagination, pendingReportBody))
      .then(async (result) => {
        result = result.data.listPendingReportPagination
        if (result.items) {
          let pendingData = this.formatData(result.items, 'reportName')
          let totalRecords = result.items.length
          if (pendingReport !== '--') {
            totalRecords = result.items.length + pendingReport
          }
          let totalData = pendingData
          totalData = this.state.pendingReportData.concat(pendingData)
          this.setState({ pendingReport: totalRecords, pendingReportData: totalData })
          if (result.total > pendingReport) {
            this.fetchPendingReport()
          }
        }
      })
  }

  fetchCouponsData = async () => {
    let amountOffCoupons = this.state.amountOffCoupons
    let percentageOffCoupons = this.state.percentageOffCoupons
    let length = 1
    let size = 100
    for (let i = 0; i < length; i++) {
      let data = {
        page: i + 1,
        size: size,
      }
      let response = await API.graphql(graphqlOperation(listCouponsPagination, data))
      if (response) {
        let couponData = response.data.listCouponsPagination
        let total = couponData.total
        let totalPage = Math.ceil(total / size)
        length = totalPage

        let amountOffItems = couponData.items.filter(item => item.amountOff !== null);
        let percentageOffItems = couponData.items.filter(item => item.percentageOff !== null);
        let amountOffData = this.formatCouponData(amountOffItems, 'amountOff')
        let percentageOffData = this.formatCouponData(percentageOffItems, 'percentageOff')

        let totalAmountoffRecords = amountOffItems.length
        if (amountOffCoupons !== "--") {
          totalAmountoffRecords = amountOffItems.length + amountOffCoupons
        }

        let totalPercentageoffRecords = percentageOffItems.length
        if (percentageOffCoupons !== "--") {
          totalPercentageoffRecords = percentageOffItems.length + percentageOffCoupons
        }

        let totalAmountoffData = amountOffData
        totalAmountoffData = this.state.amountCouponData.concat(amountOffData)

        let totalPercentageoffData = percentageOffData
        totalPercentageoffData = this.state.prCouponData.concat(percentageOffData)

        this.setState({ amountOffCoupons: totalAmountoffRecords, percentageOffCoupons: totalPercentageoffRecords, amountCouponData: totalAmountoffData, prCouponData: totalPercentageoffData })

      } else {
        console.log(response.err)
      }
    }
  }

  fetchPendingTransaction = async () => {
    let pendingTransaction = this.state.pendingTransaction
    let length = 1
    let size = 100
    for (let i = 0; i < length; i++) {
      let body = {
        page: i + 1,
        size: size,
      }
      let response = await API.post('PaymentGatewayAPI', '/paymentgateway/pagination/charge', { body })
      if (response.success) {
        let totalPage = response.Charge.totalPage
        length = totalPage
        if (response.Charge && response.Charge.data.length > 0) {
          let pendingData = this.formatPendingData(response.Charge.data)
          let totalRecords = response.Charge.data.length
          if (pendingTransaction !== '--') {
            totalRecords = response.Charge.data.length + pendingTransaction
          }
          let totalData = pendingData
          totalData = this.state.pendingTransactionData.concat(pendingData)
          this.setState({ pendingTransaction: totalRecords, pendingTransactionData: totalData })
        }
      }
    }
  }

  fetchUnsettledtransaction = async () => {
    let unSettledTransaction = this.state.unSettledTransaction
    let length = 1
    let size = 100
    for (let i = 0; i < length; i++) {
      let body = {
        page: i + 1,
        size: size,
      }
      let response = await API.post('PaymentGatewayAPI', '/paymentgateway/unsettledtransaction', { body })
      if (response.success) {
        let total = response.transactions.total
        let totalPage = Math.ceil(total / size)
        length = totalPage
        
        if (response.transactions && response.transactions.transactions.length > 0 && response.transactions.transactions !=='No records found.') {
          let unSettledData = this.formatUnSettledData(response.transactions.transactions)
          let totalRecords = response.transactions.transactions.length
          if (unSettledTransaction !== '--') {
            totalRecords = response.transactions.transactions.length + unSettledTransaction
          }
          let totalData = unSettledData
          totalData = this.state.unSettledTransactionData.concat(unSettledData)
          this.setState({ unSettledTransaction: totalRecords, unSettledTransactionData: totalData })
        }
      } else {
        (console.error(response.err))
      }
    }
  }

  fetchSubscription = async () => {
    let monthlySubscriptionData = []
    let annualSubscriptionData = []
    var response = await getSubscriptions()
    if (response && response.length > 0) {
      let monthlySubscription = []
      // let annualSubscription = []
      for (let i = 0; i < response.length; i++) {
        const element = response[i];
        monthlySubscription.push(element)
      }
      monthlySubscriptionData = monthlySubscription;
      // annualSubscriptionData = annualSubscription;
    }
    this.setState({ annualSubscription: annualSubscriptionData.length, annualSubscriptionData: annualSubscriptionData, monthlySubscription: monthlySubscriptionData.length, monthlySubscriptionData: monthlySubscriptionData })
  }


  fetchTotalRecords = async () => {
    let recordsReportbody = {
      page: 1,
      size: 500,
    }

    await API.graphql(graphqlOperation(listLicenseInformationsPagination, recordsReportbody))
      .then(async (result) => {
        result = result.data.listLicenseInformationsPagination
        if (result.items) {
          let paginationData = this.formatData(result.items, 'reportname')
          let totalRecords = result.total
          if (totalRecords !== '--') {
            totalRecords = result.total + totalRecords
          }
          let totalData = paginationData
          totalData = this.state.totalRecordsData.concat(paginationData)
          this.setState({ totalRecords: result.total, totalRecordsData: totalData })

        }
      })
  }

  fetchTotalUsers = async () => {
    let totalUsers = this.state.totalUsers
    let usersReportbody = {
      page: 1,
      size: 500,
    }
    await API.graphql(graphqlOperation(listUserPagination, usersReportbody))
      .then(async (result) => {
        result = result.data.listUserPagination
        if (result.items) {
          let usersData = this.formatData(result.items, 'reportname')
          let totalRecords = result.items.length
          if (totalUsers !== '--') {
            totalRecords = result.items.length + totalUsers
          }
          let totalData = usersData
          totalData = this.state.totalUsersData.concat(usersData)
          this.setState({ totalUsers: totalRecords, totalUsersData: totalData })
        }
      })
  }

  formatData = (data, dataName) => {
    return data && data.map((item, i) => {
      let reportName = item[dataName]
      return {
        name: reportName,
        price: parseInt(item.totalAmount)
      };
    });
  }

  formatPendingData = (data) => {
    return data && data.map((item, i) => {
      let productName = item.productName
      return {
        name: productName,
        chargeAmount: parseInt(item.chargeAmount)
      };
    });
  }

  formatUnSettledData = (data) => {
    return data && data.map((item, i) => {
      let firstName = item.firstName
      return {
        name: firstName,
        settleAmount: parseInt(item.settleAmount)
      };
    });
  }

  formatCouponData = (data, value) => {
    return data && data.map((item, i) => {
      let dataAmount = item[value]
      if (value === 'amountOff') {
        dataAmount = dataAmount / 100
      }
      return {
        name: item.name,
        price: parseInt(dataAmount)
      };
    });
  }


  render() {
    const { pendingTransaction, pendingTransactionData, unSettledTransaction, unSettledTransactionData, purchsedReport, purchasedReportData, pendingReport, pendingReportData, amountOffCoupons, amountCouponData, percentageOffCoupons, prCouponData, monthlySubscription, monthlySubscriptionData, annualSubscription, annualSubscriptionData, totalRecords, totalRecordsData, totalUsers, totalUsersData } = this.state
    return (
      <Auxiliary>
        <Row>
          <Col xl={6} lg={12} md={12} sm={12} xs={24}>
            <ChartCard prize={purchsedReport} title="23"
              children={<ResponsiveContainer width="100%" height={75}>
                <AreaChart data={purchasedReportData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="color3" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#163469" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#FE9E15" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                  <Area dataKey='price' strokeWidth={0} stackId="2" stroke='#4D95F3' fill="url(#color3)"
                    fillOpacity={1} />
                </AreaChart>
              </ResponsiveContainer>}
              styleName="up" desc="Purchased Reports" />
          </Col>
          <Col xl={6} lg={12} md={12} sm={12} xs={24}>
            <ChartCard prize={pendingReport} title="07"
              children={<ResponsiveContainer width="100%" height={75}>
                <AreaChart data={pendingReportData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="color4" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#4ECDE4" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#06BB8A" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                  <Area dataKey='price' type='monotone' strokeWidth={0} stackId="2" stroke='#4D95F3'
                    fill="url(#color4)"
                    fillOpacity={1} />
                </AreaChart>
              </ResponsiveContainer>}
              styleName="up" desc="Pending Reports" />
          </Col>
          <Col xl={6} lg={12} md={12} sm={12} xs={24}>
            <ChartCard prize={amountOffCoupons} title="08"
              children={<ResponsiveContainer width="100%" height={75}>
                <AreaChart data={amountCouponData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<AmountOffCustomTooltip />} />
                  <defs>
                    <linearGradient id="color5" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e81a24" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FEEADA" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <Area dataKey='price' strokeWidth={0} stackId="2" stroke='#FEEADA' fill="url(#color5)"
                    fillOpacity={1} />
                </AreaChart>
              </ResponsiveContainer>}
              styleName="down" desc="Coupons -- Amount off" />
          </Col>
          <Col xl={6} lg={12} md={12} sm={12} xs={24}>
            <ChartCard prize={percentageOffCoupons} title="08"
              children={<ResponsiveContainer width="100%" height={75}>
                <AreaChart data={prCouponData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<PrOffCustomTooltip />} />
                  <defs>
                    <linearGradient id="color5" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e81a24" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FEEADA" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <Area dataKey='price' strokeWidth={0} stackId="2" stroke='#FEEADA' fill="url(#color5)"
                    fillOpacity={1} />
                </AreaChart>
              </ResponsiveContainer>}
              styleName="down" desc="Coupons -- Percentage off  " />
          </Col>
          <Col xl={6} lg={12} md={12} sm={12} xs={24}>
            <ChartCard prize={pendingTransaction} title="08"
              children={<ResponsiveContainer width="100%" height={75}>
                <AreaChart data={pendingTransactionData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<ChargeAmountTooltip />} />
                  <defs>
                    <linearGradient id="color5" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e81a24" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FEEADA" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <Area dataKey='chargeAmount' strokeWidth={0} stackId="2" stroke='#FEEADA' fill="url(#color5)"
                    fillOpacity={1} />
                </AreaChart>
              </ResponsiveContainer>}
              styleName="down" desc="Pending Transaction -- Charge Amount  " />
          </Col>
          <Col xl={6} lg={12} md={12} sm={12} xs={24}>
            <ChartCard prize={unSettledTransaction} title="08"
              children={<ResponsiveContainer width="100%" height={75}>
                <AreaChart data={unSettledTransactionData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<SettleAmountTooltip />} />
                  <defs>
                    <linearGradient id="color5" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e81a24" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FEEADA" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <Area dataKey='settleAmount' strokeWidth={0} stackId="2" stroke='#FEEADA' fill="url(#color5)"
                    fillOpacity={1} />
                </AreaChart>
              </ResponsiveContainer>}
              styleName="down" desc="Unsettled Transaction -- settle Amount  " />
          </Col>
          <Col xl={6} lg={12} md={12} sm={12} xs={24}>
            <ChartCard prize={monthlySubscription} title="23"
              children={<ResponsiveContainer width="100%" height={75}>
                <AreaChart data={monthlySubscriptionData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<CustomTooltipForAmount />} />
                  <defs>
                    <linearGradient id="color3" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#163469" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#FE9E15" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                  <Area dataKey='amount' strokeWidth={0} stackId="2" stroke='#4D95F3' fill="url(#color3)"
                    fillOpacity={1} />
                </AreaChart>
              </ResponsiveContainer>}
              styleName="up" desc="Monthly Subscription" />
          </Col>
          <Col xl={6} lg={12} md={12} sm={12} xs={24}>
            <ChartCard prize={annualSubscription} title="23"
              children={<ResponsiveContainer width="100%" height={75}>
                <AreaChart data={annualSubscriptionData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<CustomTooltipForDate />} />
                  <defs>
                    <linearGradient id="color3" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#163469" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#FE9E15" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                  <Area dataKey='current_period_start' strokeWidth={0} stackId="2" stroke='#4D95F3' fill="url(#color3)"
                    fillOpacity={1} />
                </AreaChart>
              </ResponsiveContainer>}
              styleName="up" desc="Annual Subscription" />
          </Col>
          <Col xl={6} lg={12} md={12} sm={12} xs={24}>
            <ChartCard prize={totalRecords} title="23"
              children={<ResponsiveContainer width="100%" height={75}>
                <AreaChart data={totalRecordsData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<CustomTooltip />} />
                </AreaChart>
              </ResponsiveContainer>}
              styleName="up" desc="Total Records" />
          </Col>
          <Col xl={6} lg={12} md={12} sm={12} xs={24}>
            <ChartCard prize={totalUsers} title="23"
              children={<ResponsiveContainer width="100%" height={75}>
                <AreaChart data={totalUsersData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<CustomTooltip />} />
                </AreaChart>
              </ResponsiveContainer>}
              styleName="up" desc="Total Users" />
          </Col>

        </Row>

      </Auxiliary>
    );
  }

}

export default Crypto;
