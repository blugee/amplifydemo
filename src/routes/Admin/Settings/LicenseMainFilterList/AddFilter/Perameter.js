import React, { PureComponent } from 'react';
import { Col, Row, Button } from "antd";
import { withRouter } from 'react-router-dom';
import InputText from '../../../../../components/InputControl/InputText/InputText';
import InputSelect from '../../../../../components/InputControl/InputSelect/InputSelect';


class Perameter extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleChange = (e, name) => {
        this.props.onChange(this.props.arrayNumber, name, e)
    }

    render() {
        return (
            <React.Fragment>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24} push={6}>

                        <InputSelect
                            defaultValue={this.props.data.filtertype}
                            field={this.props.form}
                            label='Filter Type'
                            name={"filtertype" + this.props.arrayNumber}
                            onChange={(e) => this.handleChange(e, 'filtertype')}
                            validationMessage='Please input correct filter type'
                            requiredMessage='Please select filter type'
                            display={true}
                            required={true}
                            showSearch={true}
                            list={this.props.filterList}
                        />
                    </Col>
                    <Col sm={12} xs={24} push={6}>
                        {this.props.arrayNumber > 1 ? <Button onClick={() => this.props.onDelete(this.props.arrayNumber)}>Delete</Button> :
                            <Button onClick={() => this.props.onAddparameter(this.props.arrayNumber)}>Add Filter</Button>}
                    </Col>
                </Row>

                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputSelect
                            defaultValue={this.props.data.operator}
                            field={this.props.form}
                            label='Operator'
                            name={"operator" + this.props.arrayNumber}
                            onChange={(e) => this.handleChange(e, 'operator')}
                            validationMessage='Please enter Correct filter operator'
                            requiredMessage='Please enter filter operator'
                            display={true}
                            required={true}
                            showSearch={true}
                            list={this.props.operatorList}
                        />
                    </Col>
                </Row>

                <Row type="flex" justify="center">
                    <Col sm={12} xs={24}>
                        <InputText
                            field={this.props.form}
                            label='Filter Value'
                            name={"filtervalue" + this.props.arrayNumber}
                            inputNumber={true}
                            onChange={(e) => this.handleChange(e, 'filtervalue')}
                            defaultValue={this.props.data.filtervalue}
                            validationMessage='Please enter Correct filter value'
                            requiredMessage='Please enter filter value'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>

            </React.Fragment >
        );
    }
}

export default withRouter(Perameter);
