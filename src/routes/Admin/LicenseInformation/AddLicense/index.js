import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  Form,
  message, Spin
} from "antd";
import AddLicense from './AddLicense';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { API, graphqlOperation } from 'aws-amplify';
import { updateLicenseInformation } from '../../../../graphql/mutations';
import { getLicenseInformation } from '../../../../graphql/queries';
import * as urlConfig from '../../../../constants/URLConstant';

const FormItem = Form.Item;

class LicenseDetails extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loadingData: false,
      spinLoading: false,
      fileData: [],
      headerArray: [
        "id", "license_number", "license_category", "license_type", "license_status", "license_issue_date", "license_expire_date", "license_owner", "retail", "medical", "business_legal_name", "business_doing_business_as", "business_address_1", "business_address_2", "business_city", "business_county", "business_state", "business_zipcode", "business_country", "business_phone_number", "business_email_address", "business_structure"
      ],
      graphqlArray: [
        "id", "licenseNumber", "licenseCategory", "licenseType", "licenseStatus", "licenseIssueDate", "licenseExpireDate", "licenseOwner", "retail", "medical", "businessLegalName", "businessDoingBusinessAs", "businessAddress1", "businessAddress2", "businessCity", "businessCounty", "businessState", "businessZipcode", "businessCountry", "businessPhoneNumber", "businessEmailAddress", "businessStructure",
      ]
    };

  }

  formRef = React.createRef();

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ spinLoading: true })
    if (this.props.location.state !== undefined && this.props.location.state.data) {
      let body = {
        id: this.props.location.state.data
      }
      await API.graphql(graphqlOperation(getLicenseInformation, body))
        .then(result => {
          result = result.data.getLicenseInformation
          if (result) {
            this.formRef.current.setFieldsValue({
              ...result
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
    if (data.id) {
      let body = {
        updateLicenseInformationInput : data
      }
      await API.graphql(graphqlOperation(updateLicenseInformation, body))
        .then(result => {
          message.success('License  updated successfully')
          setTimeout(() => {
            this.props.history.push({ pathname: urlConfig.ADMIN_LICENSE_INFORMATION_LIST, });
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
      <Card title='License Details'>
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
            <AddLicense form={form} spinLoading={e => this.setState({ spinLoading: false })} />
          </Form>
        </Spin>
      </Card>
    );
  }
}

const WrappedLocalAuthForm = (LicenseDetails);

export default WrappedLocalAuthForm;
