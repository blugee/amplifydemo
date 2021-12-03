import React, { PureComponent } from 'react';
import { Col, Row } from "antd";
import InputSelect from '../../../../../components/InputControl/InputSelect/InputSelect';
import InputText from '../../../../../components/InputControl/InputText/InputText';
import InputId from '../../../../../components/InputControl/InputText/InputId';

class AddEnvSettings extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            eventType: 'invoice',
            tags: [],
            envList: [
                { name: 'REACT_APP_SES_REGION', id: "REACT_APP_SES_REGION" },
                { name: 'REACT_APP_ABOUT_PAGE_URL', id: "REACT_APP_ABOUT_PAGE_URL" },
                { name: 'REACT_APP_SES_ENDPOINT', id: 'REACT_APP_SES_ENDPOINT' },
                { name: 'REACT_APP_INVOICE_SUBJECT', id: "REACT_APP_INVOICE_SUBJECT" },
                { name: 'REACT_APP_SES_API_VERSION', id: "REACT_APP_SES_API_VERSION" },
                { name: 'REACT_APP_SES_ACCESS_KEY_ID', id: 'REACT_APP_SES_ACCESS_KEY_ID' },
                { name: 'REACT_APP_SES_SECRET_ACCESS_KEY', id: 'REACT_APP_SES_SECRET_ACCESS_KEY' },
                { name: 'REACT_APP_CONTACT_EMAIL_SUBJECT', id: "REACT_APP_CONTACT_EMAIL_SUBJECT" },
                { name: 'REACT_APP_CONTACT_COMPANY_EMAIL', id: "REACT_APP_CONTACT_COMPANY_EMAIL" },
                { name: 'REACT_APP_CONTACT_COMPANY_EMAIL_RECEIVER', id: "REACT_APP_CONTACT_COMPANY_EMAIL_RECEIVER" },
                { name: 'REACT_APP_AGE_RESTRICTION', id: "REACT_APP_AGE_RESTRICTION" },
                { name: 'REACT_APP_CHECKOUT_MINIMUM_PRICE', id: "REACT_APP_CHECKOUT_MINIMUM_PRICE" },
                { name: 'REACT_APP_PRICE_PER_RECORD', id: "REACT_APP_PRICE_PER_RECORD" },
                { name: 'REACT_APP_REST_API_DOCUMENTATION', id: "REACT_APP_REST_API_DOCUMENTATION" },
                { name: 'REACT_APP_END_USER_AGREEMENT_URL', id: "REACT_APP_END_USER_AGREEMENT_URL" },
                { name: 'REACT_APP_CANCEL_SUBSCRIPTION_SUBJECT', id: "REACT_APP_CANCEL_SUBSCRIPTION_SUBJECT" },
                { name: 'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET', id: "REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET" },
                { name: 'REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET', id: "REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET" },
                { name: 'REACT_APP_GOOGLE_ADDRESS_API_KEY', id: "REACT_APP_GOOGLE_ADDRESS_API_KEY" },
                { name: 'REACT_APP_AUTHORIZE_NET_ANS_CUSTOMER_ID', id: "REACT_APP_AUTHORIZE_NET_ANS_CUSTOMER_ID" },
                { name: 'RECAPTCHA_SECRET_KEY', id: "RECAPTCHA_SECRET_KEY" },
                { name: 'RECAPTCHA_SITE_KEY', id: "RECAPTCHA_SITE_KEY" },
                { name: 'REACT_APP_ACCESS_KEY_ID', id: "REACT_APP_ACCESS_KEY_ID" },
                { name: 'REACT_APP_REGION', id: "REACT_APP_REGION" },
                { name: 'REACT_APP_SECRET_ACCESS_KEY', id: "REACT_APP_SECRET_ACCESS_KEY" },
                { name: 'REACT_APP_USER_POOL_ID', id: "REACT_APP_USER_POOL_ID" },

            ],
        }
    }

    componentDidMount() {
        this.props.spinLoading()
    }

    render() {
        return (
            <React.Fragment>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputId
                            field={this.props.form}
                            label='form.label.id'
                            name="id"
                            display={false}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            defaultValue={true}
                            field={this.props.form}
                            label='Env Name'
                            name='name'
                            validationMessage='Please select Env'
                            requiredMessage='Please select Env'
                            display={true}
                            required={true}
                            list={this.state.envList}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Env Value'
                            name='value'
                            validationMessage='Please input correct value'
                            requiredMessage='Please input value'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>

            </React.Fragment>
        );
    }
}

export default AddEnvSettings;
