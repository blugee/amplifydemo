import React, { useEffect, useState } from "react";
import { Button, Input, message, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import {
  hideMessage,
  userSignInSuccess,
} from "appRedux/actions/Auth";

import IntlMessages from "util/IntlMessages";
import CircularProgress from "components/CircularProgress/index";
import './SignIn.css'
import * as Amplify from 'aws-amplify';
import notify from '../Notification';
import { GetGroupsOfUser } from "../util/UserService";

const SignIn = (props) => {

  const dispatch = useDispatch();
  const { loader, alertMessage, showMessage, authUser } = useSelector(({ auth }) => auth);
  const history = useHistory();
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

  const onSignInFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const getLoggedIn = async (values) => {
    Amplify.Auth.signIn(values.email, values.password)
      .then(async (success) => {
        let data = await GetGroupsOfUser(success.username)
        if (data.Groups && data.Groups.length > 0) {
          let group = data.Groups[0]
          if (group.RoleArn === process.env.REACT_APP_ADMIN_ROLE_ARN) {
            notify.openNotificationWithIcon('success', 'Success', "Signin has been successfully done");
            dispatch(userSignInSuccess(success))
            window.sessionStorage.setItem("user_token", success.signInUserSession.accessToken.jwtToken);
            window.sessionStorage.setItem("userData", success);
          } else {
            notify.openNotificationWithIcon('error', 'Fail', 'User not authorized');
          }
        } else {
          notify.openNotificationWithIcon('error', 'Fail', 'User not authorized');
        }
        setLoadingData(false)
      })
      .catch(err => {
        notify.openNotificationWithIcon('error', 'Fail', err.message);
        setLoadingData(false)
      })

  }
  
  const onSignIn = values => {
    setLoadingData(true)
    Amplify.Auth.signIn(values.email, values.password)
      .then(async (success) => {

        if (success.challengeName && success.challengeName === "NEW_PASSWORD_REQUIRED") {
          Amplify.Auth.completeNewPassword(
            success,
            values.password,
            {
              email: values.email,
              family_name: "test",
              given_name: "test",
              phone_number: '+11111111111'
            }
          ).then(async user => {
            await getLoggedIn(values);
          }).catch(e => {
            notify.openNotificationWithIcon('error', 'Fail', 'Getting error while  change password');
          });
        } else {
          let data = await GetGroupsOfUser(success.username)
          if (data.Groups && data.Groups.length > 0) {
            let group = data.Groups[0]
            if (group.RoleArn === process.env.REACT_APP_ADMIN_ROLE_ARN) {
              notify.openNotificationWithIcon('success', 'Success', "Signin has been successfully done");
              dispatch(userSignInSuccess(success))
              window.sessionStorage.setItem("user_token", success.signInUserSession.accessToken.jwtToken);
              window.sessionStorage.setItem("userData", success);
            } else {
              notify.openNotificationWithIcon('error', 'Fail', 'User not authorized');
            }
          } else {
            notify.openNotificationWithIcon('error', 'Fail', 'User not authorized');
          }
          setLoadingData(false)
        }
      })
      .catch(err => {
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
            <div className="gx-app-logo" style={{ marginBottom: "auto" }}>
              <img alt="example" src={require("assets/images/logo.png")} />
            </div>
            <div className="gx-app-logo-wid" style={{ marginBottom: 0 }}>
              <h1><IntlMessages id="app.userAuth.signIn" /></h1>
              <p><IntlMessages id="app.userAuth.bySigning" /></p>
              <p><IntlMessages id="app.userAuth.getAccount" /></p>
            </div>
          </div>
          <div className="gx-app-login-content">
            <Form
              initialValues={{ remember: true }}
              name="basic"
              onFinish={onSignIn}
              onFinishFailed={onSignInFailed}
              className="gx-signin-form gx-form-row0">

              <Form.Item
                rules={[{ required: true, message: 'The input is not valid E-mail!' }]} name="email">
                <Input placeholder="Enter Email Address" />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: 'Please input your Password!' }]} name="password">
                <Input.Password placeholder="Enter Password" />
              </Form.Item>
              {/* <Form.Item>
                <Checkbox><IntlMessages id="appModule.iAccept" /></Checkbox>
                <span className="gx-signup-form-forgot gx-link"><IntlMessages
                  id="appModule.termAndCondition" /></span>
              </Form.Item> */}
              <Form.Item>
                <Button type="primary" className="gx-mb-0" htmlType="submit" loading={loadingData} disabled={loadingData}>
                  <IntlMessages id="app.userAuth.signIn" />
                </Button>

              </Form.Item>
              <div className="gx-flex-row gx-justify-content-between">
                <span className="gx-pointer gx-d-block gx-link"><li><Link to="/forgotpassword">or Recover Password</Link></li></span>
              </div>
            </Form>
          </div>

          {loader ?
            <div className="gx-loader-view">
              <CircularProgress />
            </div> : null}
          {showMessage ?
            message.error(alertMessage.toString()) : null}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
