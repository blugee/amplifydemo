import React, { PureComponent } from 'react';
import { Col, Row, Button } from "antd";
import { withRouter } from 'react-router-dom';
import MultipleSelect from '../../../../components/InputControl/MultipleSelect/MultipleSelect'
import InputText from '../../../../components/InputControl/InputText/InputText';
import InputSelect from '../../../../components/InputControl/InputSelect/InputSelect';
import InputTextarea from '../../../../components/InputControl/InputTextarea/InputTextarea';


class MapPerameter extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleChange = (e, name) => {
        this.props.onChange(this.props.arrayNumber, name, e)
    }

    handleStateChange = (e, name) => {
        this.props.handleStateChange(this.props.arrayNumber, name, e)
    }

    render() {
        const { statusList, stateOptionsList } = this.props
        return (
            <React.Fragment>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24} push={6}>
                        <MultipleSelect
                            // field={this.props.form}
                            label='State'
                            name={"id" + this.props.arrayNumber}
                            validationMessage='Please input correct details'
                            requiredMessage='Please select state'
                            display={true}
                            required={true}
                            defaultValue={this.state.defaultColumns}
                            list={stateOptionsList}
                            onChange={(e) => this.handleStateChange(e, 'id')}
                        />
                    </Col>
                    <Col sm={12} xs={24} push={6}>
                        {this.props.arrayNumber > 1 ? <Button onClick={() => this.props.onDelete(this.props.arrayNumber)}>Delete</Button> :
                            <Button onClick={() => this.props.onAddparameter(this.props.arrayNumber)}>Add Options</Button>}
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24} >
                        <InputSelect
                            defaultValue={true}
                            field={this.props.form}
                            label='Status'
                            name={"status" + this.props.arrayNumber}
                            validationMessage='Please input correct status'
                            requiredMessage='Please select status'
                            display={true}
                            required={true}
                            list={statusList}
                            onChange={(e) => this.handleChange(e, 'status')}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24} >
                        <InputTextarea
                            rows={4}
                            field={this.props.form}
                            label='Hover text'
                            name={"hoverText" + this.props.arrayNumber}
                            validationMessage='Please input correct text'
                            requiredMessage='Please input text'
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={12} xs={24} >
                        <InputText
                            label='Color'
                            name={"color" + this.props.arrayNumber}
                            placeholder={"#5FA30F"}
                            onChange={(e) => this.handleChange(e, 'color')}
                            validationMessage='Please input correct color'
                            requiredMessage='Please input color'
                            field={this.props.form}
                            display={true}
                            required={true}
                        />
                    </Col>
                </Row>


            </React.Fragment >
        );
    }
}

export default withRouter(MapPerameter);
