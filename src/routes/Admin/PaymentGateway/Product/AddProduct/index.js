import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  Form,
  message, Spin
} from "antd";

import AddProduct from './AddProduct';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { API, graphqlOperation } from 'aws-amplify';
import * as urlConfig from '../../../../../constants/URLConstant';
import { getProduct, listProductByProductType } from '../../../../../graphql/queries';
import { createProduct, updateProduct, } from '../../../../../graphql/mutations';

const FormItem = Form.Item;

class ProductDetails extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loadingData: false,
      spinLoading: false,
      isUpdate: false
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
      await API.graphql(graphqlOperation(getProduct, body))
        .then(result => {
          result = result.data.getProduct
          if (result) {
            this.formRef.current.setFieldsValue({
              id: result.id,
              name: Number(result.name),
              description: result.description,
              active : result.active
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
    let productData
    if (data.id) {
      productData = {
        updateProductInput: data
      }
      await API.graphql(graphqlOperation(updateProduct, productData))
        .then(result => {
          message.success('Product updated successfully')
          setTimeout(() => {
            this.props.history.push({ pathname: urlConfig.ADMIN_PRODUCT_LIST, });
          }, 1000);
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
        });

    } else {
      productData = {
        createProductInput: data
      }
      let productBody = {
        productType: data.name,
      }
      let result = await API.graphql(graphqlOperation(listProductByProductType, productBody))
      if (result.data && !result.data.listProductByProductType.items.length > 0) {
        if (!data.id) {
          await API.graphql(graphqlOperation(createProduct, productData))
            .then(result => {
              message.success('Product added successfully')
              setTimeout(() => {
                this.props.history.push({ pathname: urlConfig.ADMIN_PRODUCT_LIST, });
              }, 1000);
            })
            .catch(err => {
              console.log(err)
              message.error('Something wrong happened');
            });
        }
      } else {
        message.error("Product already available with this name")
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
      <Card title='Product Details'>
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
            <AddProduct form={form} isUpdate={this.state.isUpdate} spinLoading={e => this.setState({ spinLoading: false })} />
          </Form>
        </Spin>
      </Card>
    );
  }
}

const WrappedLocalAuthForm = (ProductDetails);

export default WrappedLocalAuthForm;
