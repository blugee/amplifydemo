import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  Form,
  message, Spin
} from "antd";

import AddCountry from './AddCountry';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { API, graphqlOperation } from 'aws-amplify';
import { createCountry, updateCountry } from '../../../../../graphql/mutations';
import { getCountry } from '../../../../../graphql/queries';
import * as urlConfig from '../../../../../constants/URLConstant';

const FormItem = Form.Item;

class CountryDetails extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loadingData: false,
      spinLoading: false,
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
      await API.graphql(graphqlOperation(getCountry, body))
        .then(result => {
          result = result.data.getCountry
          if (result) {
            this.formRef.current.setFieldsValue({
              id: result.id,
              name: result.name,
              code: result.code,
              active: result.active,
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
    let countryData
    if (data.id) {
      countryData = {
        updateCountryInput: data
      }
      await API.graphql(graphqlOperation(updateCountry, countryData))
        .then(result => {
          message.success('Country updated successfully')
          setTimeout(() => {
            this.props.history.push({ pathname: urlConfig.ADMIN_COUNTRY_LIST, });
          }, 1000);
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');

        });
    } else {
      countryData = {
        createCountryInput: data
      }
      await API.graphql(graphqlOperation(createCountry, countryData))
        .then(result => {
          message.success('Country added successfully')
          setTimeout(() => {
            this.props.history.push({ pathname: urlConfig.ADMIN_COUNTRY_LIST, });
          }, 1000);
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
        });
    }
    this.setState({
      loadingData: false
    });

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
      <Card title='Country Details'>
        <Spin tip="Loading..." spinning={this.state.spinLoading}>

          <Form ref={this.formRef} form={form}  onFinish={this.onFinish} {...formItemLayout}>
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
            <AddCountry form={form} spinLoading={e => this.setState({ spinLoading: false })} />
          </Form>
        </Spin>
      </Card>
    );
  }
}

const WrappedLocalAuthForm = (CountryDetails);

export default WrappedLocalAuthForm;
