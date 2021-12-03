import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  Form,
  message, Spin
} from "antd";

import AddCoupon from './AddCoupon';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { API, graphqlOperation } from 'aws-amplify';
import * as urlConfig from '../../../../../constants/URLConstant';
import { getCoupon, listCouponByCode } from '../../../../../graphql/queries';
import { createCoupon, updateCoupon } from '../../../../../graphql/mutations';
import moment from 'moment';

const FormItem = Form.Item;

class CouponDetails extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loadingData: false,
      spinLoading: false,
      isRepetation: false,
      couponType: '',
      couponAttachTo: ''
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
      await API.graphql(graphqlOperation(getCoupon, body))
        .then(result => {
          result = result.data.getCoupon
          if (result) {
            this.setState({ couponType: result.couponType })
            this.setState({ couponAttachTo: result.couponAttachTo })
            this.setState({ isRepetation: result.duration })

            this.formRef.current.setFieldsValue({
              id: result.id,
              couponType: result.couponType,
              couponAttachTo: result.couponAttachTo,
              redeemBy: moment(result.redeemBy),
              name: result.name,
              percentageOff: result.percentageOff,
              amountOff: result.amountOff,
              code: result.code,
              duration: result.duration,
              durationInMonth: result.durationInMonth,
              currency: result.currency,
              couponApplyFor: result.couponApplyFor,
              active: result.active
            });

          }
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
        });
    }
    this.setState({ spinLoading: false })
  }

  onFinish = async (data) => {
    this.setState({ loadingData: true })
    let couponData
    if (data.id) {
      couponData = {
        updateCouponInput: data
      }
      await API.graphql(graphqlOperation(updateCoupon, couponData))
        .then(result => {
          message.success('Coupon updated successfully')
          setTimeout(() => {
            this.props.history.push({ pathname: urlConfig.ADMIN_COUPON_LIST, });
          }, 1000);
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
        });

    } else {
      couponData = {
        createCouponInput: data
      }
      let couponBody = {
        code: data.code,
        active: 'true'
      }
      let result = await API.graphql(graphqlOperation(listCouponByCode, couponBody))
      if (result.data && !result.data.listCouponByCode.items.length > 0) {
        if (!data.id) {
          await API.graphql(graphqlOperation(createCoupon, couponData))
            .then(result => {
              message.success('Coupon added successfully')
              setTimeout(() => {
                this.props.history.push({ pathname: urlConfig.ADMIN_COUPON_LIST, });
              }, 1000);
            })
            .catch(err => {
              console.log(err)
              message.error('Something wrong happened');
            });
        }
      } else {
        message.error("Coupon already available with this code")
      }
      this.setState({ loadingData: false })
    };
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
      <Card title='Coupon Details'>
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
            <AddCoupon
              form={form}
              spinLoading={e => this.setState({ spinLoading: false })}
              handleTypeChange={(e) => { this.setState({ couponType: e }) }}
              handleAttachToChange={(e) => { this.setState({ couponAttachTo: e }) }}
              handleDurationChange={(e) => { this.setState({ isRepetation: e }) }}
              couponType={this.state.couponType}
              couponAttachTo={this.state.couponAttachTo}
              isRepetation={this.state.isRepetation}
              data={this.state.data} />
          </Form>
        </Spin>
      </Card>
    );
  }
}

const WrappedLocalAuthForm = (CouponDetails);

export default WrappedLocalAuthForm;
