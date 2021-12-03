import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  Form,
  message, Spin
} from "antd";

import moment from 'moment'
import { ArrowLeftOutlined } from '@ant-design/icons';
import { API } from 'aws-amplify';
import AddPromotionCode from './AddPromotionCode';
import { getCoupons } from '../../../../service/ReportService';

const FormItem = Form.Item;

class PromotionCodeDetails extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loadingData: false,
      spinLoading: false,
      coupontype: true,
      couponList: null
    };

  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    this.setState({ spinLoading: true })
    let coupons = await getCoupons()
    if (coupons !== false) {
      coupons = await this.formatData(coupons)
    } else {
      coupons = null
    }
    // getCoupons
    // var res = await API.get('PaymentGatewayAPI', '/paymentgateway/couponcode',)
    // if (res.success) {
    //   res = await this.formatData(res.coupons.data)
    // } else {
    //   res = null
    // }
    this.setState({ couponList: coupons, spinLoading: false })
  }

  formatData(data) {
    return data.map((item, i) => {
      if (item.redeem_by) {
        var t = new Date(item.redeem_by * 1000);
        item.redeem_by = moment(t).format('MM/DD/YYYY');
        item.name = item.name + ' ( Expires at - ' + item.redeem_by + ' ) '
      }
      return {
        ...item,
      };
    });
  }


  onFinish = async (values) => {
    this.setState({ loadingData: true })
    values.expires_at = new Date(values.expires_at).getTime() / 1000
    values.expires_at = Math.round(values.expires_at)
    const body = values

    var response = await API.post('PaymentGatewayAPI', `/paymentgateway/promotioncode`, { body })
    console.log(response)

    this.setState({ loadingData: false })
    if (response.success) {
      message.success(response.success)
      setTimeout(() => {
        this.props.history.push({ pathname: `/admin/promotioncode`, });
      }, 2000);
    } else {
      console.log(response.err)
      if (response.err.raw.message === 'An active promotion code with `code: DEF07815` already exists.') {
        message.error('Promotion Code already exist');
      } else {
        message.error('Something wrong happened');
      }
      this.setState({
        selectedRowKeys: [],
        selectedRows: '',
        loadingData: false
      });
      this.setState({ loadingData: false })
    }
  };

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
      <Card title='Promotion Code Details'>
        <Spin tip="Loading..." spinning={this.state.spinLoading}>

          <Form form={form} onFinish={this.onFinish} {...formItemLayout}>
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
            <AddPromotionCode form={form} couponList={this.state.couponList} spinLoading={e => this.setState({ spinLoading: false })} />
          </Form>
        </Spin>
      </Card>
    );
  }
}

const WrappedLocalAuthForm = (PromotionCodeDetails);

export default WrappedLocalAuthForm;
