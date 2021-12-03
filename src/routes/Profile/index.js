import React, {  useEffect } from "react";
import { Input, Form, Select, Checkbox, Card } from "antd";
import Auxiliary from "../../util/Auxiliary";
import Amplify from "aws-amplify";
import MaskedInput from 'antd-mask-input'


const FormItem = Form.Item;
const Option = Select.Option;
const formRef = React.createRef();

const Profile = (props) => {
  // const [info, setInfo] = useState(null);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
      xl: { span: 8 },
      lg: { span: 10 },
      md: { span: 12 }
    },
  };

  useEffect(() => {
    window.sessionStorage.setItem("demo", "demo")
    Amplify.Auth.currentAuthenticatedUser()
      .then(async user => {
        if (user) {
          const { attributes } = user;
          resetFields(attributes)
        }
      }).catch(e => {
        console.log(e)
      })

  }, []);

  const resetFields = (info) => {
    formRef.current.setFieldsValue({
      given_name: info && info.given_name,
      family_name: info && info.family_name,
      email: info && info.email,
      phone_number: info && info.phone_number.slice(2),
      company: info && info["custom:company-name"],
    });
  }


  const prefixSelector = (
    <Select style={{ width: 70 }} value={'+1'}>
      <Option value="+1" id='+1'>+1</Option>
    </Select>
  )

  return (
    <Auxiliary>
      <Card title='Profile'>
        <Form
          ref={formRef}
        >
          <FormItem
            {...formItemLayout}
            label="First / Given Name"
            name='given_name'
          >
            <Input
              placeholder="John"
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Last / Family Name"
            name='family_name'
          >
            <Input
              placeholder="Boss"
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Email Address"
            name='email'
          >
            <Input
              disabled={true}
              placeholder="Email"
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Phone Number"
            name='phone_number'
          >
            <MaskedInput addonBefore={prefixSelector} mask="(111) 111-1111" name="card" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Age Confirmation"
            name='age'
          >
            <Checkbox checked={true} disabled={true}></Checkbox>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Company Name"
            name='company'
          >
            <Input
              placeholder="Company Name"
            />
          </FormItem>
        </Form>
      </Card>
    </Auxiliary>
  );
};

export default Profile;


