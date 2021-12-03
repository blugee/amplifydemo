import React, { PureComponent } from 'react';
import {
    Button,
    Card,
    Form,
    message, Spin
} from "antd";
import AddEnvSettings from './AddEnvSettings';
import { ArrowLeftOutlined } from '@ant-design/icons';
import * as urlConfig from '../../../../../constants/URLConstant'
import { getEnvVariables, searchEnvVariables } from '../../../../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import { createEnvVariables, updateEnvVariables } from '../../../../../graphql/mutations';

const FormItem = Form.Item;

class EnvSettingsDetails extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            loadingData: false,
            spinLoading: false,
            fileData: [],
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
            await API.graphql(graphqlOperation(getEnvVariables, body))
                .then(result => {
                    result = result.data.getEnvVariables
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
                updateEnvVariablesInput: data
            }
            await API.graphql(graphqlOperation(updateEnvVariables, body))
                .then(result => {
                    message.success('Env variable updated successfully')
                    setTimeout(() => {
                        this.props.history.push({ pathname: urlConfig.ADMIN_ENV_SETTINGS_PAGE_LIST, });
                    }, 1000);
                })
                .catch(err => {
                    console.log(err)
                    message.error('Something wrong happened');

                });
        } else {
            let envData = {
                createEnvVariablesInput: data
            }

            let envQuery = `SELECT * FROM EnvVariables WHERE name in ('${data.name}')`
            let envVariable = {
                EnvVariablesListQuery: {
                    query: envQuery
                }
            }
            let result = await API.graphql(graphqlOperation(searchEnvVariables, envVariable))
            if (result.data && !result.data.searchEnvVariables.items.length > 0) {
                await API.graphql(graphqlOperation(createEnvVariables, envData))
                    .then(result => {
                        message.success('Env variable added successfully')
                        setTimeout(() => {
                            this.props.history.push({ pathname: urlConfig.ADMIN_ENV_SETTINGS_PAGE_LIST, });
                        }, 1000);
                    })
                    .catch(err => {
                        console.log(err)
                        message.error('Something wrong happened');
                    });
                    
            } else {
                message.error("Env variable already exist")
            }

            this.setState({ loadingData: false });
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
                        <AddEnvSettings form={form} spinLoading={e => this.setState({ spinLoading: false })} />
                    </Form>
                </Spin>
            </Card>
        );
    }
}

const WrappedLocalAuthForm = (EnvSettingsDetails);

export default WrappedLocalAuthForm;