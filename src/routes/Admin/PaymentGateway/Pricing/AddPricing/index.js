import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  Form,
  message, Spin
} from "antd";
import AddPricing from './AddPricing';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { API, graphqlOperation } from 'aws-amplify';
import * as urlConfig from '../../../../../constants/URLConstant';
import { getPricing, listPricingByProductAndUsageType, listProducts } from '../../../../../graphql/queries';
import { getProductTypesOptions } from '../../../../service/GeneralService';
import { createPricing } from '../../../../../graphql/mutations';

const FormItem = Form.Item;

class PriceDetails extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loadingData: false,
      spinLoading: false,
      productList: []
    };

  }

  formRef = React.createRef();

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    this.setState({ spinLoading: true })
    let res = await API.graphql(graphqlOperation(listProducts, {}))
    res = res.data.listProducts
    if (!res.errors) {
      res = await this.formetData(res)
      this.setState({ productList: res, })
    }
    if (this.props.location.state !== undefined && this.props.location.state.data) {
      let body = {
        id: this.props.location.state.data
      }
      await API.graphql(graphqlOperation(getPricing, body))
        .then(result => {
          result = result.data.getPricing
          if (result) {
            this.formRef.current.setFieldsValue({
              ...result,
            })
          }
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
        });
    }
    this.setState({ spinLoading: false })
  }

  formetData = async (data) => {
    let products = []
    if (data && data.length > 0) {
      let productTypes = await getProductTypesOptions()
      for (let i = 0; i < data.length; i++) {
        let selectType = await productTypes.filter(product => product.id === Number(data[i].name))
        if (selectType && selectType.length > 0) {
          data[i].name = selectType[0].name
          data[i].id = selectType[0].id
        }
        products.push(data[i])
      }
    }
    return products

  }

  onFinish = async (data) => {
    this.setState({ loadingData: true })
    let isMatchPriceExist = false

    if (data.usageType === 'metered') {
      let searchPriceBody = {
        usageType: data.usageType,
        currency: data.currency,
        intervalTime: data.intervalTime,
        productId: data.productId,
        active: 'true'
      }
      let result = await API.graphql(graphqlOperation(listPricingByProductAndUsageType, searchPriceBody))
      if (result && result.data && !result.data.listPricingByProductAndUsageType.items.length > 0) {
        isMatchPriceExist = false
      } else {
        message.error("This Price with product already available")
        isMatchPriceExist = true
      }
    }

    if (!isMatchPriceExist) {
      let pricingData = {
        createPricingInput: data
      }
      await API.graphql(graphqlOperation(createPricing, pricingData))
        .then(result => {
          message.success('Price created successfuly')
          setTimeout(() => {
            this.props.history.push({ pathname: urlConfig.ADMIN_PRICING_LIST, });
          }, 1000);
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
        });
    }
    this.setState({ loadingData: false })
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
      <Card title='Price Details'>
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
            <AddPricing form={form} spinLoading={e => this.setState({ spinLoading: false })} productList={this.state.productList} />
          </Form>
        </Spin>
      </Card>
    );
  }
}

const WrappedLocalAuthForm = (PriceDetails);

export default WrappedLocalAuthForm;
