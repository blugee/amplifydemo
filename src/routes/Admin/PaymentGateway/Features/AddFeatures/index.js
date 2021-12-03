import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  Form,
  message, Spin
} from "antd";

import AddFeatures from './AddFeatures';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { API, graphqlOperation } from 'aws-amplify';
import { createFeature, updateFeature } from '../../../../../graphql/mutations';
import { listSubscriptionPlans, getFeature, listFeatureByPlanTypeAndActive } from '../../../../../graphql/queries';
import * as urlConfig from '../../../../../constants/URLConstant';

const FormItem = Form.Item;

class FeatureDetails extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loadingData: false,
      spinLoading: false,
      defaultValues: null,
      initialData: null
    };
  }

  formRef = React.createRef();

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    this.setState({ spinLoading: true })
    let defaultValues = {
      doasall: null,
      isAllowNameSearch: 'false',
      isAllowLicenseNumberSearch: 'false',
      isAllowLicenseCategorySearch: 'false',
      isAllowCitySearch: 'false',
      isAllowStateSearch: 'false',
      isAllowCountrySearch: 'false',
      isAllowLicenseTypeSearch: 'false',
      isAllowLicenseStatusSearch: 'false',
      isAllowLicenseOwnerSearch: 'false',
      isAllowLicenseIssueDateSearch: 'false',
      isAllowLicenseExpireDateSearch: 'false',
      isAllowDBASearch: 'false',
      isAllowCountySearch: 'false',
      isAllowPostalCodeSearch: 'false',
      isAllowPhoneNumberSearch: 'false',
      isAllowEmailSearch: 'false',
      isAllowLastUpdatedDateSearch: 'false'
    }

    if (this.props.location.state !== undefined && this.props.location.state.data) {
      let body = {
        id: this.props.location.state.data
      }
      await API.graphql(graphqlOperation(getFeature, body))
        .then(result => {
          result = result.data.getFeature
          if (result) {
            this.formRef.current.setFieldsValue({
              id: result.id,
              subscriptionPlanId: result.subscriptionPlanId,
              isAllowNameSearch: result.isAllowNameSearch,
              isAllowLastUpdatedDateSearch: result.isAllowLastUpdatedDateSearch,
              isAllowLicenseNumberSearch: result.isAllowLicenseNumberSearch,
              isAllowLicenseCategorySearch: result.isAllowLicenseCategorySearch,
              isAllowCitySearch: result.isAllowCitySearch,
              isAllowStateSearch: result.isAllowStateSearch,
              isAllowCountrySearch: result.isAllowCountrySearch,
              isAllowLicenseTypeSearch: result.isAllowLicenseTypeSearch,
              isAllowLicenseStatusSearch: result.isAllowLicenseStatusSearch,
              isAllowLicenseOwnerSearch: result.isAllowLicenseOwnerSearch,
              isAllowLicenseIssueDateSearch: result.isAllowLicenseIssueDateSearch,
              isAllowLicenseExpireDateSearch: result.isAllowLicenseExpireDateSearch,
              isAllowDBASearch: result.isAllowDBASearch,
              isAllowCountySearch: result.isAllowCountySearch,
              isAllowPostalCodeSearch: result.isAllowPostalCodeSearch,
              isAllowPhoneNumberSearch: result.isAllowPhoneNumberSearch,
              isAllowEmailSearch: result.isAllowEmailSearch,
              active: result.active,
            });
            this.setState({ initialData: result })
            defaultValues = result

          }
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
        });
    }

    let res = await API.graphql(graphqlOperation(listSubscriptionPlans, {}))
    res = res.data.listSubscriptionPlans
    if (res.errors) {
      message.error('Something wrong happen')
    } else {
      this.setState({ subPlanList: res })
    }

    this.setState({ defaultValues: defaultValues, spinLoading: false })

  }


  getValue = (data) => {
    if (data) {
      return data.toString()
    } else {
      return 'false'
    }
  }

  onFinish = async (data) => {

    let body = {
      id: data.id,
      name: 'demo',
      subscriptionPlanId: this.getValue(data.subscriptionPlanId),
      isAllowNameSearch: this.getValue(data.isAllowNameSearch),
      isAllowLicenseNumberSearch: this.getValue(data.isAllowLicenseNumberSearch),
      isAllowLicenseCategorySearch: this.getValue(data.isAllowLicenseCategorySearch),
      isAllowCitySearch: this.getValue(data.isAllowCitySearch),
      isAllowStateSearch: this.getValue(data.isAllowStateSearch),
      isAllowCountrySearch: this.getValue(data.isAllowCountrySearch),
      isAllowLicenseTypeSearch: this.getValue(data.isAllowLicenseTypeSearch),
      isAllowLicenseStatusSearch: this.getValue(data.isAllowLicenseStatusSearch),
      isAllowLicenseOwnerSearch: this.getValue(data.isAllowLicenseOwnerSearch),
      isAllowLicenseIssueDateSearch: this.getValue(data.isAllowLicenseIssueDateSearch),
      isAllowLicenseExpireDateSearch: this.getValue(data.isAllowLicenseExpireDateSearch),
      isAllowDBASearch: this.getValue(data.isAllowDBASearch),
      isAllowCountySearch: this.getValue(data.isAllowCountySearch),
      isAllowPostalCodeSearch: this.getValue(data.isAllowPostalCodeSearch),
      isAllowPhoneNumberSearch: this.getValue(data.isAllowPhoneNumberSearch),
      isAllowEmailSearch: this.getValue(data.isAllowEmailSearch),
      isAllowLastUpdatedDateSearch: this.getValue(data.isAllowLastUpdatedDateSearch),
      active: data.active
    }

    this.setState({ loadingData: true })
    let initialData = this.state.initialData
    let filterBody = {
      active: true,
      subscriptionPlanId: data.subscriptionPlanId
    }

    await API.graphql(graphqlOperation(listFeatureByPlanTypeAndActive, filterBody))
      .then(async (res) => {
        res = res.data.listFeatureByPlanTypeAndActive.items
        if (res && res.length > 0 && (initialData === null || (initialData && data.subscriptionPlanId !== initialData.subscriptionPlanId))) {
          message.error("Selected feature's subscription plan is already active")
        } else {
          if (data.id) {
            let updateFeatureBody = {
              updateFeatureInput: body
            }
            await API.graphql(graphqlOperation(updateFeature, updateFeatureBody))
              .then(result => {
                message.success('Feature updated successfully')
                setTimeout(() => {
                  this.props.history.push({ pathname: urlConfig.ADMIN_FEATURES_LIST, });
                }, 1000);
              })
              .catch(err => {
                console.log(err)
                message.error('Something wrong happened');

              });
          } else {
            let createFeatureBody = {
              createFeatureInput: body
            }
            await API.graphql(graphqlOperation(createFeature, createFeatureBody))
              .then(result => {
                message.success('Feature added successfully')
                setTimeout(() => {
                  this.props.history.push({ pathname: urlConfig.ADMIN_FEATURES_LIST, });
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
      selectedRowKeys: [],
      selectedRows: '',
      loadingData: false
    });

  };

  setAll = (e) => {
    let defaultValues = {
      doasall: e,
      isAllowNameSearch: e,
      isAllowLicenseNumberSearch: e,
      isAllowLicenseCategorySearch: e,
      isAllowCitySearch: e,
      isAllowStateSearch: e,
      isAllowCountrySearch: e,
      isAllowLicenseTypeSearch: e,
      isAllowLicenseStatusSearch: e,
      isAllowLicenseOwnerSearch: e,
      isAllowLicenseIssueDateSearch: e,
      isAllowLicenseExpireDateSearch: e,
      isAllowDBASearch: e,
      isAllowCountySearch: e,
      isAllowPostalCodeSearch: e,
      isAllowPhoneNumberSearch: e,
      isAllowEmailSearch: e,
      isAllowLastUpdatedDateSearch: e
    }
    this.setState({ defaultValues: defaultValues })
  }


  onChnage = (name, e) => {
    let data = this.state.defaultValues
    data[name] = e
    this.setState({ defaultValues: data })
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
      <Card title='Feature Details'>
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
            <AddFeatures form={form} spinLoading={e => this.setState({ spinLoading: false })} subPlanList={this.state.subPlanList} setAll={(e) => this.setAll(e)} defaultValues={this.state.defaultValues} onChange={(name, e) => this.onChnage(name, e)} />
          </Form>
        </Spin>
      </Card>
    );
  }
}

const WrappedLocalAuthForm = (FeatureDetails);

export default WrappedLocalAuthForm;
