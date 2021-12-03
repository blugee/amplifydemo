import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  Form,
  message, Spin
} from "antd";

import AddPlan from './AddPlan';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { API, graphqlOperation } from 'aws-amplify';
import { updateSubscriptionPlan, createSubscriptionPlan } from '../../../../../graphql/mutations';
import { getPricing, getSubscriptionPlan, listSubscriptionPlanByPlanTypeAndActive } from '../../../../../graphql/queries';
import * as urlConfig from '../../../../../constants/URLConstant';
import { getPriceList } from '../../../../service/ReportService';

const FormItem = Form.Item;

class PlanDetails extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loadingData: false,
      spinLoading: false,
      planInterval: 'month',
      filteredArray: [{
        key: 1,
        plandetails: '',
      }],
      initialData: null
    };

  }

  formRef = React.createRef();

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    this.setState({ spinLoading: true })
    if (this.props.location.state !== undefined && this.props.location.state.data) {
      let body = {
        id: this.props.location.state.data
      }
      await API.graphql(graphqlOperation(getSubscriptionPlan, body))
        .then(async (result) => {
          result = result.data.getSubscriptionPlan
          if (result) {
            let filterArray = await this.createArray(result.planDetails)
            this.setState({ filteredArray: filterArray, planInterval: result.planInterval, initialData: result })
            let initialValueObj = {
              id: result.id,
              name: result.name,
              active: result.active,
              priceIdMonth: Number(result.priceIdMonth),
              priceIdYear: Number(result.priceIdYear),
              interval: result.planInterval,
              description1: result.description1,
              description2: result.description2,
              amountPerRecord: result.amountPerRecord,
              planOrder: result.planOrder,
              planType: result.planType
            }
            for (let i = 0; i < filterArray.length; i++) {
              initialValueObj = {
                ...initialValueObj,
                ["plandetails" + filterArray[i].key]: filterArray[i].plandetails,
              }
            }
            this.formRef.current.setFieldsValue(initialValueObj);
          }
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
        });
    } else {
      let obj = {
        interval: 'month'
      }
      this.formRef.current.setFieldsValue(obj);
    }
    var res = await getPriceList()

    if (res !== false && res.length > 0) {
      res = await this.formatPriceData(res)
      let monthPrice = res.filter(item => item.interval === 'month' && item.usageType !== 'metered');
      let obj = {
        id: "NULL",
        name: '-----'
      }
      monthPrice.push(obj)
      let yearPrice = res.filter(item => item.interval === 'year' && item.usageType !== 'metered');
      yearPrice.push(obj)
      this.setState({ priceListMonth: monthPrice, priceListYear: yearPrice })
    } else {
      res = []
    }
    this.setState({ spinLoading: false, })
  }

  formatPriceData(data) {
    return data.map((item, i) => {
      let byValue = item.usageType === 'metered' ? 'record' : item.intervalTime
      let amount = Number(item.pricePerUnit)
      let planName = amount ? `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) + ' /' + byValue} ` : amount.toString()
      if (item && item.description) {
        planName = `${planName}  ( ${item.description.length > 20 ? item.description.substring(0, 19) + "..." : item.description} )`
      }
      return {
        ...item,
        name: planName,
        interval: item.intervalTime
      };
    });
  }

  createArray = async (data) => {
    data = data.replace("(", "")
    data = data.replace(")", "")
    data = data.split("@@, ")
    return data.map((item, i) => {
      return {
        key: i + 1,
        plandetails: item.replace("@@", ""),
      };
    });
  }

  onFinish = async (data) => {
    this.setState({ loadingData: true })
    let initialData = this.state.initialData
    let filterBody = {
      active: true,
      planType: data.planType
    }
    
    await API.graphql(graphqlOperation(listSubscriptionPlanByPlanTypeAndActive, filterBody))
      .then(async (res) => {
        res = res.data.listSubscriptionPlanByPlanTypeAndActive.items
        if (res && res.length > 0 && (initialData === null || (initialData && data.planType !== initialData.planType))) {
          message.error('Selected Plan Type active in another plan')
        } else {

          let planDetails = await this.formatData(this.state.filteredArray)

          if (data.priceIdMonth && data.priceIdMonth !== 'NULL') {
            let body = {
              id: data.priceIdMonth
            }
            await API.graphql(graphqlOperation(getPricing, body))
              .then(result => {
                result = result.data.getPricing
                if (result) {
                  data.amountPerMonth = Number(result.pricePerUnit)
                }
              })
              .catch(err => {
                console.log(err)
                message.error('Something wrong happened');
                return
              });
          }

          if (data.priceIdYear && data.priceIdYear !== 'NULL') {
            let body = {
              id: data.priceIdYear
            }
            await API.graphql(graphqlOperation(getPricing, body))
              .then(result => {
                result = result.data.getPricing
                if (result) {
                  data.amountPerYear = Number(result.pricePerUnit)
                }
              })
              .catch(err => {
                console.log(err)
                message.error('Something wrong happened');
                return
              });
          }

          let body = {
            id: data.id,
            name: data.name,
            planDetails: planDetails,
            active: data.active,
            priceIdMonth: data.priceIdMonth === 'NULL' ? null : data.priceIdMonth,
            priceIdYear: data.priceIdYear === 'NULL' ? null : data.priceIdYear,
            amountPerMonth: data.amountPerMonth,
            amountPerYear: data.amountPerYear,
            description1: data.description1,
            description2: data.description2,
            planInterval: data.interval,
            amountPerRecord: data.amountPerRecord,
            planOrder: data.planOrder,
            planType: data.planType
          }

          Object.keys(body).forEach((key) => (body[key] == null) && delete body[key]);



          let subscriptionPlanBody
          if (data.id) {
            subscriptionPlanBody = {
              updateSubscriptionPlanInput: body
            }
            await API.graphql(graphqlOperation(updateSubscriptionPlan, subscriptionPlanBody))
              .then(result => {
                message.success('Plan updated successfully')
                setTimeout(() => {
                  this.props.history.push({ pathname: urlConfig.ADMIN_SUBSCRIPTION_PLAN_LIST, });
                }, 1000);
              })
              .catch(err => {
                console.log(err)
                message.error('Something wrong happened');

              });
          } else {
            subscriptionPlanBody = {
              createSubscriptionPlanInput: body
            }
            await API.graphql(graphqlOperation(createSubscriptionPlan, subscriptionPlanBody))
              .then(result => {
                message.success('Plan added successfully')
                setTimeout(() => {
                  this.props.history.push({ pathname: urlConfig.ADMIN_SUBSCRIPTION_PLAN_LIST, });
                }, 1000);
              })
              .catch(err => {
                console.log(err)
                message.error('Something wrong happened');
              });
          }
        }
      })
      .catch(err => {
        console.log(err)
        message.error('something bad happen')
      })
    this.setState({
      loadingData: false
    });
  };

  formatData = (data) => {
    return data.map((item, i) => {
      return item['plandetails'] + '@@'
    });
  }



  handleFilteredArray = (e) => {
    this.setState({ filteredArray: e })
  }

  changeInterval = (e) => {
    this.setState({ planInterval: e })
  }

  render() {
    const { form } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };

    return (
      <Card title='Subscription Plan Details'>
        <Spin tip="Loading..." spinning={this.state.spinLoading}>

          <Form ref={this.formRef} form={form} onFinish={this.onFinish} {...formItemLayout}>
            <div className="components-table-demo-control-bar">
              <FormItem
                className='header-button-content'>
                <Button
                  type='primary'
                  icon={<ArrowLeftOutlined />}
                  onClick={() => this.props.history.goBack()}
                  style={{ marginBottom: 0 }}
                >
                  Back
                </Button>
              </FormItem>
              <FormItem
                className='header-button-content'>
                <Button
                  type='primary'
                  htmlType="submit"
                  loading={this.state.loadingData}
                  style={{ marginBottom: 0 }}
                >
                  Save Details
                </Button>
              </FormItem>
            </div>
            <AddPlan form={form} priceListMonth={this.state.priceListMonth} changeInterval={(e) => this.changeInterval(e)} priceListYear={this.state.priceListYear} interval={this.state.planInterval} filteredArray={this.state.filteredArray} handleFilter={(e) => this.handleFilteredArray(e)} spinLoading={e => this.setState({ spinLoading: false })} />
          </Form>
        </Spin>
      </Card>
    );
  }
}

const WrappedLocalAuthForm = (PlanDetails);

export default WrappedLocalAuthForm;
