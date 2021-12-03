import React from "react";
import { Button, Card, Table, Input, Dropdown, Pagination, DatePicker, Space } from "antd";
import Form from "antd/lib/form/Form";
import { CaretDownOutlined, PlusOutlined, ReloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import UserDropdown from "../InputControl/UserDropdown/UserDropdown";
import './DataTable.css'
import moment from "moment";
import CronJobDropdown from "../InputControl/CronjobOptionDropdown";

const { Search } = Input;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const layout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 16,
    },
};

class DataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredInfo: null,
            sortedInfo: null,
            selectedRowKeys: [],
            selectedRows: '',
        };
    }

    onSearchStringChange = event => {
        if (event.target.value === '') {
            this.setState({ searchText: null, filterData: null })
            return;
        }
        const value = event.target.value.toLowerCase();
        const newData = this.filteredData(this.props.dataSource, value);
        this.setState({ searchText: event.target.value, filterData: newData })

    };

    filteredData = (data, value) => data && data.filter(elem => (
        Object.keys(elem).some(key => elem[key] != null ? elem[key].toString().toLowerCase().includes(value) : "")
    ));


    onSearch = value => {
        if (value === '') {
            this.setState({ filterData: null })
            return;
        }
        const newData = this.filteredData(this.props.dataSource, value);
        this.setState({ searchText: value, filterData: newData })
    };

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    onSelectionChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
        this.props.data.onSelectionChange(selectedRowKeys, selectedRows)
    };

    onUserSelect = (e) => {
        this.props.data.onUserSelect(e)
    }
    onSelect = (e) => {
        this.props.data.onSelect(e)
    }
    onDateSelect = (e) => {
        this.props.data.onDateSelect(e)
    }


    dateFormate = (date) => {
        var t = new Date(date * 1000);
        date = ("0" + t.getDate()).slice(-2) + '/' + ("0" + (t.getMonth() + 1)).slice(-2) + '/' + (t.getFullYear());
        return date
    }

    currancyFormate = (data) => {
        data = data / 100
        data = parseInt(data).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        return data
    }


    expandedRowData = (data) => {

        return (
            <Form
                {...layout}
                name="basic"
            >
                <Form.Item label="Name" className='form-item-margin'  >
                    {data.coupon.name}
                </Form.Item>

                {data.coupon.percent_off &&
                    <Form.Item label="Percent off " className='form-item-margin' >
                        {data.coupon.percent_off}
                    </Form.Item>
                }

                {data.coupon.amount_off &&
                    <Form.Item label="Amount off " className='form-item-margin' >
                        {this.currancyFormate(data.coupon.amount_off)}
                    </Form.Item>
                }

                <Form.Item label="Duration" className='form-item-margin' >
                    {data.coupon.duration}
                </Form.Item>

                {data.coupon.redeem_by &&
                    <Form.Item label="Redeem by" className='form-item-margin' >
                        {this.dateFormate(data.coupon.redeem_by)}
                    </Form.Item>
                }

                {data.coupon.duration_in_months &&
                    <Form.Item label="Duration (in months) " className='form-item-margin' >
                        {data.coupon.duration_in_months}
                    </Form.Item>
                }

                {data.coupon.currency &&
                    <Form.Item label="Currency " className='form-item-margin' >
                        {data.coupon.currency}
                    </Form.Item>
                }
            </Form>
        )

    }

    datemaker = (date) => {
        if (date) {
            var t = new Date(date * 1000);
            date = ("0" + t.getDate()).slice(-2) + '/' + ("0" + (t.getMonth() + 1)).slice(-2) + '/' + (t.getFullYear());
        }
        return date
    }


    render() {
        const { selectedRowKeys } = this.props;

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.onSelectionChange(selectedRowKeys, selectedRows);
            }
        };
        if (this.state.buttonAction) {

            this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);

        }


        return (
            <Card title={this.props.data.title}>
                <div className="components-table-demo-control-bar">
                    <Form layout="inline" initialValues={{ userSelect: 'all' }}>

                        {this.props.menu ?
                            <FormItem>
                                <Dropdown
                                    overlay={this.props.menu}
                                    trigger={['click']}
                                    disabled={selectedRowKeys.length === 0}
                                >
                                    <Button style={{ marginBottom: 0 }} >
                                        Action <CaretDownOutlined />
                                    </Button>
                                </Dropdown>
                            </FormItem> :
                            null}

                        {this.props.data.search ?
                            <FormItem>
                                <Search
                                    placeholder={'Search'}
                                    onChange={this.onSearchStringChange}
                                    onSearch={this.onSearch}
                                    value={this.state.searchPending}
                                    allowClear
                                    style={{ width: 400, marginRight: 10, verticalAlign: 'middle' }}
                                />
                            </FormItem>
                            : null}

                        {this.props.data.isUserSelect ?
                            <UserDropdown
                                showSearch={true}
                                defaultValue={'AllUsers'}
                                placeholder={'Select User'}
                                field={this.props.form}
                                display={true}
                                list={this.props.userList}
                                onChange={this.onUserSelect}
                            />
                            : null}

                        {this.props.data.isDropdown ?
                            <CronJobDropdown
                                showSearch={true}
                                defaultValue={'All'}
                                placeholder={'Select Cronjob'}
                                field={this.props.form}
                                display={true}
                                list={this.props.cronjobList}
                                onChange={this.onSelect}
                            />
                            : null}

                        {this.props.data.DatePicker ?
                            <FormItem>
                                <Space direction="vertical" size={12}>
                                    <RangePicker
                                        onChange={this.onDateSelect}
                                        disabledDate={(current) => {
                                            return moment().add(0, 'days') <= current;
                                        }}
                                    />
                                </Space>
                            </FormItem>
                            : null}

                        <FormItem>
                            <Button
                                type='primary'
                                icon={<ReloadOutlined />}
                                onClick={this.props.data.handleRefresh}
                                style={{ marginBottom: 0 }}
                            >
                                Refresh
                            </Button>
                        </FormItem>


                        {this.props.data.addNewDataUrl ?
                            <FormItem>
                                <Button
                                    type='primary'
                                    icon={<PlusOutlined />}
                                    onClick={() => this.props.history.push(this.props.data.addNewDataUrl)}
                                >
                                    {this.props.data.button}
                                </Button>
                            </FormItem>
                            : null}
                        {this.props.data.deleteButton ?
                            <FormItem>
                                <Button
                                    type='primary'
                                    icon={<DeleteOutlined />}
                                    onClick={this.props.data.handleDelete}
                                >
                                    {this.props.data.deleteButton}
                                </Button>
                            </FormItem>
                            : null}
                        {this.props.data.deleteButtonByFilter ?
                            <FormItem>
                                <Button
                                    type='primary'
                                    icon={<DeleteOutlined />}
                                    onClick={this.props.data.handleDeleteByFilter}
                                >
                                    {this.props.data.deleteButtonByFilter}
                                </Button>
                            </FormItem>
                            : null}

                    </Form>
                </div>
                {this.props.data.expandable ?
                    <Table
                        className="gx-table-responsive"
                        columns={this.props.data.columns}
                        dataSource={this.state.filterData || this.props.dataSource}
                        loading={this.props.loadingData}
                        pagination={false}
                        expandable={{
                            expandedRowRender: record => <p style={{ margin: 0 }}>{this.expandedRowData(record)}</p>,
                        }}
                        onChange={this.props.handleTableDataChange}
                        rowKey='id'
                        rowSelection={{
                            type: 'radio',
                            ...rowSelection,
                        }}
                    />
                    :
                    this.props.data.isNoneSelectable ?
                        <Table
                            className="gx-table-responsive"
                            columns={this.props.data.columns}
                            dataSource={this.state.filterData || this.props.dataSource}
                            loading={this.props.loadingData}
                            pagination={false}
                            onChange={this.props.handleTableDataChange}
                            rowKey='id'

                        />
                        : <Table
                            className="gx-table-responsive"
                            columns={this.props.data.columns}
                            scroll={{ x: this.props.data.xScroll, }}
                            dataSource={this.state.filterData || this.props.dataSource}
                            loading={this.props.loadingData}
                            pagination={false}
                            onChange={this.props.handleTableDataChange}
                            rowKey='id'
                            rowSelection={{
                                type: this.props.data.selectionType ? this.props.data.selectionType : 'radio',
                                ...rowSelection,
                            }}
                        />
                }
                {this.props.dataSource && this.props.dataSource.length > 0 &&
                    < Pagination
                        className='table-pagination'
                        defaultCurrent={1}
                        total={this.props.pageTotal}
                        onChange={(e) => this.props.setPageNumber(e)}
                        showSizeChanger
                        onShowSizeChange={(currentSize, pageSize) => this.props.setPageSize(currentSize, pageSize)}
                        pageSizeOptions={['10', '15', '50', '100']}
                    />
                }
            </Card>
        );
    }
}

export default withRouter(DataTable);
