import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { Link, useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  hideMessage,
} from "appRedux/actions/Auth";

import { message } from "antd/lib/index";
import CircularProgress from "components/CircularProgress/index";
import * as Amplify from 'aws-amplify';
import notify from '../Notification';

const ForgotPassword = (props) => {


  const dispatch = useDispatch();
  const history = useHistory();
  const { loader, alertMessage, showMessage, authUser } = useSelector(({ auth }) => auth);
  const [loadingData, setLoadingData] = useState(false)


  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        dispatch(hideMessage());
      }, 100);
    }
    if (authUser !== null) {
      history.push('/');
    }
  });



  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = values => {
    setLoadingData(true)
    Amplify.Auth.forgotPassword(values.email, {})
      .then(success => {
        notify.openNotificationWithIcon('success', 'Success', 'Code was sent');
        window.sessionStorage.setItem("email", values.email);
        setLoadingData(false)
        props.history.push({ pathname: `/resetpassword`, });
      })
      .catch(err => {
        console.log(err)
        notify.openNotificationWithIcon('error', 'Fail', err.message);
        setLoadingData(false)

      })
  };

  return (
    <div className="gx-app-login-wrap">
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <div className="gx-app-logo-content">
            <div className="gx-app-logo-content-bg">
            </div>
            <div
              className="gx-app-logo"
              style={{ marginBottom: "auto" }}
            >
              <img alt="example" src={require("assets/images/logo.png")} />
            </div>
            <div className="gx-app-logo-wid">
              <h1>Forgot Password</h1>
            </div>
          </div>

          <div className="gx-app-login-content">
            <Form
              initialValues={{ remember: true }}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0">

              <Form.Item
                label="Email"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[{ required: true, message: 'The input is not valid E-mail!' }]} name="email">
                <Input placeholder="Enter Email Address" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" className="gx-mb-0" htmlType="submit" loading={loadingData} disabled={loadingData}>
                  Submit
                </Button>

              </Form.Item>


              <div className="gx-flex-row gx-justify-content-between">
                <span className="gx-pointer gx-d-block gx-link"><li><Link to="/signin">or Sign In</Link></li></span>
              </div>
            </Form>
          </div>
          {loader &&
            <div className="gx-loader-view">
              <CircularProgress />
            </div>
          }
          {showMessage &&
            message.error(alertMessage)}
        </div>
      </div>
    </div>
  );
};


export default ForgotPassword;
