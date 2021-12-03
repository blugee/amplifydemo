import React, { useEffect, useState } from "react";
import { Button,  Form, Input, Tooltip } from "antd";
import Icon from '@ant-design/icons';
import { Link, useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
    hideMessage,
} from "appRedux/actions/Auth";

import { message } from "antd/lib/index";
import CircularProgress from "components/CircularProgress/index";
import * as Amplify from 'aws-amplify';
import notify from '../Notification';

const ResetPassword = (props) => {


    const dispatch = useDispatch();
    const history = useHistory();
    const { loader, alertMessage, showMessage, authUser } = useSelector(({ auth }) => auth);
    const [password, setPassword] = useState('')
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



    const compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== password) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = values => {
        setLoadingData(true)
        const email  = window.sessionStorage.getItem("email");
        Amplify.Auth.forgotPasswordSubmit(email, values.code, values.password)
            .then(success => {
                notify.openNotificationWithIcon('success', 'Success', 'Password was changed');
                setLoadingData(false)
                props.history.push({ pathname: `/signin`, });
            })
            .catch(err => {
                console.log(err)
                notify.openNotificationWithIcon('error', 'Fail', err.message);
                setLoadingData(false)
            })
    };

    const handleChange = (e) => {
        setPassword(e.target.value)
    }

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
                            <h1>Reset Password  </h1>
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
                                label={<span>
                                    Enter code&nbsp;
                                   <Tooltip title="Enter Code From Email">
                                        <Icon type="question-circle" />
                                    </Tooltip>
                                </span>
                                }
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[{ required: true, message: 'The input is not valid' }]} name="code">
                                <Input placeholder="Code" />
                            </Form.Item>

                            <Form.Item
                                label={<span>
                                    New Password&nbsp;
                                     <Tooltip title="Enter New Password">
                                        <Icon type="question-circle" />
                                    </Tooltip>
                                </span>
                                }
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                initialValue="demo#123"
                                rules={[{
                                    required: true, message: 'Please input your Password!'
                                
                                }]} name="password">
                                <Input type="password" placeholder="Password" onChange={(e) => handleChange(e)} />
                            </Form.Item>

                            <Form.Item
                                label={<span>
                                    Confirm Password&nbsp;
                                    <Tooltip title="Re-Enter New Password">
                                        <Icon type="question-circle" />
                                    </Tooltip>
                                </span>
                                }
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                initialValue="demo#123"
                                rules={[{
                                    required: true, message: 'Please confirm your password!',
                                }, {
                                    validator: compareToFirstPassword,
                                }]} name="confirm">
                                <Input placeholder="Retype New Password" type="password" />
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


export default ResetPassword;
