import React, { PureComponent } from 'react';
import { Col, Row } from "antd";
import InputId from '../../../../../components/InputControl/InputText/InputId';
import InputSelect from '../../../../../components/InputControl/InputSelect/InputSelect';
import EmailEditor from 'react-email-editor';
import InputTextarea from '../../../../../components/InputControl/InputTextarea/InputTextarea';

class AddTemplate extends PureComponent {

    constructor(props) {
        super(props);
        this.emailEditorRef = React.createRef();
        this.state = {
            eventType: 'invoice',
            tags: [],
            eventList: [
                { name: 'customer.subscription.updated', id: "customer.subscription.updated" },
                { name: 'customer.subscription.created', id: "customer.subscription.created" },
                { name: 'invoice.payment_failed', id: "invoice.payment_failed" },
                { name: 'invoice.paid', id: "invoice.paid" },
                {name:'customer.subscription.deleted', id:'customer.subscription.deleted'}



                // { name: 'invoice.created', id: "invoice.created" },
                // { name: 'invoice.upcoming', id: "invoice.upcoming" },                
                // { name: 'invoice.payment_action_required', id: "invoice.payment_action_required" },
                // { name: 'invoice.finalization_failed', id: "invoice.finalization_failed" },                
                // { name: 'customer.subscription.deleted', id: "customer.subscription.deleted" },
                // { name: 'subscription_schedule.canceled', id: "subscription_schedule.canceled" },
                // { name: 'subscription_schedule.created', id: "subscription_schedule.created" },
                // { name: 'subscription_schedule.expiring', id: "subscription_schedule.expiring" },
                // { name: 'checkout.complete', id: "checkout.complete" },

            ],
        }
    }

    componentDidMount() {
        this.props.spinLoading()
    }

    onLoad = () => {
        this.emailEditorRef.current && this.emailEditorRef.current.editor.setMergeTags({
            first_name: {
                name: 'First name (Mailchimp)',
                value: '*|FNAME|*',
                sample: 'John',
            },
            last_name: {
                name: 'Last name (Mailchimp)',
                value: '*|LNAME|*',
                sample: 'Doe',
            },
            email: {
                name: 'Email (Mailchimp)',
                value: '*|EMAIL|*',
                sample: 'jdoe@email.com'
            },
            phone: {
                name: 'Phone (Mailchimp)',
                value: '*|PHONE|*',
                sample: '(502) 555 5555'
            },
            unsub: {
                name: 'Unsubscribe link (Mailchimp)',
                value: '<a href="*|UNSUB|*">Unsubscribe</a> *|EMAIL|* from these emails.',
                sample: 'Unsubscribe jdoe@email.com from these emails.'
            }
        });
        // you can load your template here;
        // const templateJson = {};
        // emailEditorRef.current.editor.loadDesign(templateJson);
    };

    getEditorData = async () => {
        return new Promise(async (resolve) => {
            let obj = { design: '', html: '' }
            await this.emailEditorRef.current.editor.exportHtml((data) => {
                const { design, html } = data;
                obj = { design: design, html: html }
            });
            resolve(obj)
        })
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
                            label='Event'
                            name='event'
                            validationMessage='Please select event'
                            requiredMessage='Please select event'
                            display={true}
                            required={true}
                            list={this.state.eventList}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputTextarea
                            rows={4}
                            field={this.props.form}
                            label='Subject'
                            name='subject'
                            validationMessage='Please input correct subject'
                            requiredMessage='Please input subject'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <EmailEditor
                    ref={this.emailEditorRef}
                    // onLoad={this.onLoad}
                    options={{
                        mergeTags: {
                            firstName: {
                                name: "First Name",
                                value: "{{GEN_FIRST_NAME}}",
                            },
                            lastName: {
                                name: "Last Name",
                                value: "{{GEN_LAST_NAME}}",
                            },
                            createDate: {
                                name: "Create Date",
                                value: "{{CREATE_DATE}}",
                            },
                            contactEmail: {
                                name: "Contact Email",
                                value: "{{GEN_CONTACT_EMAIL}}",
                            },
                            billingReason: {
                                name: "Billing Reason (invoice)",
                                value: "{{BILLING_REASON}}",
                            },
                            status: {
                                name: "Status (invoice, schedule)",
                                value: "{{STATUS}}",
                            },
                            amountDue: {
                                name: "Amount Due (invoice)",
                                value: "{{INV_AMOUNT_DUE}}",
                            },
                            invoiceNumber: {
                                name: "Invoice Number (invoice)",
                                value: "{{INV_NUMBER}}",
                            },
                            invoiceConfirmationNumber: {
                                name: "Invoice Confirmation Number (invoice)",
                                value: "{{INV_CONFIRMATION_NUMBER}}",
                            },
                            invoiceType: {
                                name: "Invoice Type (invoice)",
                                value: "{{INV_TYPE}}",
                            },
                            periodStart: {
                                name: "Subscription Start Date (subscription)",
                                value: "{{SUB_PERIOD_START_DATE}}",
                            },
                            periodEnd: {
                                name: "Subscription End Date (subscription)",
                                value: "{{SUB_PERIOD_END_DATE}}",
                            },
                            cancelDate: {
                                name: "Subscription Cancel Date (subscription)",
                                value: "{{SUB_CANCEL_DATE}}",
                            },
                            renewalDate: {
                                name: "Subscription Renewal Date (subscription)",
                                value: "{{SUB_RENEWAL_DATE}}",
                            },
                            subscriptionId: {
                                name: "Subscription Id (subscription)",
                                value: "{{SUB_ID}}",
                            },
                            subscriptionCurrentType: {
                                name: "Subscription Current Type (subscription)",
                                value: "{{SUB_CURRENT_TYPE}}",
                            },
                            subscriptionPreviousType: {
                                name: "Subscription Previous Type (subscription)",
                                value: "{{SUB_PREVIOUS_TYPE}}",
                            },
                            subscriptionRecordCost: {
                                name: "Subscription Record Cost (subscription)",
                                value: "{{SUB_RECORD_COST}}",
                            },
                            interval: {
                                name: "Interval",
                                value: "{{INTERVAL}}",
                            },
                        }
                    }}
                />

            </React.Fragment>
        );
    }
}

export default AddTemplate;
