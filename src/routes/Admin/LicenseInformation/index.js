import React, { Component } from "react";
import Auxiliary from "../../../util/Auxiliary";
import { Menu, message, Modal, Form, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined, CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { ConfirmModel } from "../../../components/ConfirmModel";
import { withRouter } from "react-router-dom";
import { API, graphqlOperation } from 'aws-amplify';
import { listCountrys, listLicenseInformationsPagination, listStates } from "../../../graphql/queries";
import { updateLicenseInformation, deleteLicenseInformation, deleteAllLicenseInformation } from "../../../graphql/mutations";
import * as urlConfig from '../../../constants/URLConstant';
import DataTable from "../../../components/DataTable/DataTable";
import InputSelect from "../../../components/InputControl/InputSelect/InputSelect";
import { getFilters, getFiltersForColumns } from "../../service/GeneralService";

const title = 'License List';

class LicenseInformation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedRowKeys: [],
      selectedRows: '',
      visible_confirm_model: false,
      visiblemodel: false,
      currantPage: 1,
      currantSize: 10,
      pageTotal: 1,
      actionData: {
        message: '',
        action: ''
      },
      country: null,
      state: null,
      isVisible: false,
      totalCounts: 0,
      sorter: null,
      countryList: [],
      mainFilter: [{ active: { eq: "true" } }],
      stateList: [],
      filter: [],
      columns: [],
      isFilters: false,
      categoryFilterByTable: null,
      stateFilterByTable: null,
      countryFilterByTable: null,
      retailFilterByTable: null,
      medicalFilterByTable: null,
      structureFilterByTable: null,
      typeFilterByTable: null,
      statusFilterByTable: null,
      createdAtFilterByTable: null,
      updatedAtFilterByTable: null,
    }

    this.sorter = (v1, v2) => {
      return (v1 === null) - (v2 === null) || (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
    }
    this.columns = [
      { title: 'License Number', dataIndex: 'licenseNumber', key: 'licenseNumber', sorter: (a, b) => this.sorter(a.licenseNumber, b.licenseNumber), width: 40, },
      { title: 'License Category', dataIndex: 'licenseCategory', key: 'licenseCategory', sorter: (a, b) => this.sorter(a.licenseCategory, b.licenseCategory), width: 150, },
      { title: 'License Type', dataIndex: 'licenseType', key: 'licenseType', sorter: (a, b) => this.sorter(a.licenseType, b.licenseType), width: 200, },
      { title: 'License Status', dataIndex: 'licenseStatus', key: 'licenseStatus', sorter: (a, b) => this.sorter(a.licenseStatus, b.licenseStatus), width: 150, },
      { title: 'License Issue Date', dataIndex: 'licenseIssueDate', key: 'licenseIssueDate', sorter: (a, b) => this.sorter(a.licenseIssueDate, b.licenseIssueDate), width: 100, },
      { title: 'License Expire Date', dataIndex: 'licenseExpireDate', key: 'licenseExpireDate', sorter: (a, b) => this.sorter(a.licenseExpireDate, b.licenseExpireDate), width: 100, },
      { title: 'License Owner', dataIndex: 'licenseOwner', key: 'licenseOwner', sorter: (a, b) => this.sorter(a.licenseOwner, b.licenseOwner), width: 100, },
      { title: 'Retail', dataIndex: 'retail', key: 'retail', render: (text, index) => index.retail === 'true' ? 'True' : 'False', sorter: (a, b) => this.sorter(a.retail, b.retail), width: 70, },
      { title: 'Medical', dataIndex: 'medical', key: 'medical', render: (text, index) => index.medical === 'true' ? 'True' : 'False', sorter: (a, b) => this.sorter(a.medical, b.medical), width: 70, },
      { title: 'Bussiness Legal name', dataIndex: 'businessLegalName', key: 'businessLegalName', sorter: (a, b) => this.sorter(a.businessLegalName, b.businessLegalName), width: 150, },
      { title: 'Business Doing as', dataIndex: 'businessDoingBusinessAs', key: 'businessDoingBusinessAs', sorter: (a, b) => this.sorter(a.businessDoingBusinessAs, b.businessDoingBusinessAs), width: 150, },
      { title: 'Business Address 1', dataIndex: 'businessAddress1', key: 'businessAddress1', sorter: (a, b) => this.sorter(a.businessAddress1, b.businessAddress1), width: 100, },
      { title: 'Business Address 2', dataIndex: 'businessAddress2', key: 'businessAddress2', sorter: (a, b) => this.sorter(a.businessAddress2, b.businessAddress2), width: 100, },
      { title: 'Business City', dataIndex: 'businessCity', key: 'businessCity', sorter: (a, b) => this.sorter(a.businessCity, b.businessCity), width: 100, },
      { title: 'Business County', dataIndex: 'businessCounty', key: 'businessCounty', sorter: (a, b) => this.sorter(a.businessCounty, b.businessCounty), width: 100, },
      { title: 'Business State', dataIndex: 'businessState', key: 'businessState', sorter: (a, b) => this.sorter(a.businessState, b.businessState), width: 100, },
      { title: 'Business Zip Code', dataIndex: 'businessZipcode', key: 'businessZipcode', sorter: (a, b) => this.sorter(a.businessZipcode, b.businessZipcode), width: 100, },
      { title: 'Business Country', dataIndex: 'businessCountry', key: 'businessCountry', sorter: (a, b) => this.sorter(a.businessCountry, b.businessCountry), width: 100, },
      { title: 'Business Phone Number', dataIndex: 'businessPhoneNumber', key: 'businessPhoneNumber', sorter: (a, b) => this.sorter(a.businessPhoneNumber, b.businessPhoneNumber), width: 100, },
      { title: 'Business Email Address', dataIndex: 'businessEmailAddress', key: 'businessEmailAddress', sorter: (a, b) => this.sorter(a.businessEmailAddress, b.businessEmailAddress), width: 100, },
      { title: 'Business Structure', dataIndex: 'businessStructure', key: 'businessStructure', sorter: (a, b) => this.sorter(a.businessStructure, b.businessStructure), width: 100, },
      { title: 'Created At', dataIndex: 'created_at', key: 'created_at', sorter: (a, b) => this.sorter(a.created_at, b.created_at), width: 100, },
      { title: 'Updated At', dataIndex: 'updated_at', key: 'updated_at', sorter: (a, b) => this.sorter(a.updated_at, b.updated_at), width: 100, },
      // { title: 'Last Updated', dataIndex: 'last_updated', key: 'last_updated', sorter: (a, b) => this.sorter(a.last_updated, b.last_updated), render:(index)=> moment(index.last_updated).format('YYYY-MM-DD'), width: 100, },
      { title: 'Active', dataIndex: 'active', key: 'active', render: (text, index) => index.active === 'true' ? 'True' : 'False', sorter: (a, b) => this.sorter(a.active, b.active), width: 100, },
    ]

    this.tableData = {
      title: title,
      columns: this.columns,
      search: true,
      deleteButtonByFilter: 'Delete By Filter',
      handleDeleteByFilter: this.handleDeleteByFilter,
      button: 'Add License',
      addNewDataUrl: urlConfig.ADMIN_UPLOAD_LICENSE_INFORMATION,
      handleRefresh: this.handleRefresh,
      onSelectionChange: this.onSelectionChange,
      selectionType: 'checkbox',
      xScroll: 5000,
      deleteButton: 'Detelet All Data',
      handleDelete: this.handleDeleteAllConfirmation
    }
  }

  onSelectionChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  handleDeleteByFilter = async () => {
    if (this.state.data.length > 0) this.setState({ isVisible: true })
  }

  handleRefresh = () => {
    this.setState({ data: [] });
    this.fetchData();
  };

  componentDidMount() {
    this.fetchData();
    this.fetchCountryData();
    this.fetchStateData()
  }

  fetchData = async () => {
    this.setState({ loadingData: true })
    let filters = this.state.mainFilter
    if (this.state.filter && this.state.filter.length > 0) {
      filters = this.state.filter
    }
    filters = await getFilters(filters)
    let data = {
      page: this.state.currantPage,
      size: this.state.currantSize,
      orderBy: this.state.sorter,
      filter: filters,
    }
    await API.graphql(graphqlOperation(listLicenseInformationsPagination, data))
      .then(async (result) => {

        result = result.data.listLicenseInformationsPagination
        if (!this.state.isFilters) {
          let dataFilters = {
            filter: `active = 'true'`
          }
          let filters = await getFiltersForColumns(dataFilters)
          let tableColumns = await this.setColumnForLicense(filters, this.columns)
          this.setState({ columns: tableColumns, isFilters: true })
        }

        this.setState({ data: result.items, pageTotal: result.total, })
      })
      .catch(err => {
        console.log(err)
        message.error('Something wrong happened');
      });
    this.setState({ loadingData: false })
  }

  setColumnForLicense = (filters, columns) => {
    let columnsByPlan = columns.map((col, i) => {
      if (filters[col.dataIndex]) {
        return Object.assign(
          {},
          col,
          {
            filters: filters[col.dataIndex],
            onFilter: (value, record) => record[col.dataIndex] ? record[col.dataIndex].indexOf(value) === 0 : null,
            // filteredValue: (value, record) => record[col.dataIndex].includes(value) || null
          },
        )
      }

      return col;
    });
    return columnsByPlan
  }

  fetchCountryData = async () => {
    let res = await API.graphql(graphqlOperation(listCountrys, {}))
    res = res.data.listCountrys
    if (!res && res.errors) {
      message.error('Something wrong happen')
    } else {
      res = res.filter(item => item.active === 'true')
      res = await this.formatCountryData(res)
      res.sort((a, b) => a.name.localeCompare(b.name))
      this.setState({ countryList: res, })
    }
  }

  fetchStateData = async () => {
    let res = await API.graphql(graphqlOperation(listStates, {}))
    res = res.data.listStates
    if (res.errors) {
      message.error('Something wrong happen')
    } else {
      res = res.filter(item => item.active === 'true')
      res = await this.formatStateData(res)
      res.sort((a, b) => a.name.localeCompare(b.name))
      this.setState({ stateList: res, })
    }
  }

  formatCountryData(data) {
    return data.map((item, i) => {
      return {
        ...item,
        id: item.code
      };
    });
  }

  formatStateData(data) {
    return data.map((item, i) => {
      return {
        ...item,
        id: item.abbreviation
      };
    });
  }


  onActionChange = value => {
    this.showConfirm(value.key);
  };

  showConfirm = type => {
    const that = this;
    this.setState({ visiblemodel: true, visible_confirm_model: true })
    if (type === 'delete') {
      this.setState({
        actionData: {
          message: 'Do you want to Delete selected entries?', action: e => that.handleDelete(that.state.selectedRowKeys, that.state.selectedRows)
        }
      })
    } else if (type === 'edit') {
      this.setState({
        actionData: {
          message: 'Do you want to edit selected entries?', action: e => that.handleEdit(that.state.selectedRowKeys, that.state.selectedRows)
        }
      })
    } else if (type === 'enable') {
      this.setState({
        actionData: {
          message: 'Do you want to enable selected entries?', action: e => that.enableEntity(that.state.selectedRowKeys, that.state.selectedRows)
        }
      })
    } else if (type === 'disable') {
      this.setState({
        actionData: {
          message: 'Do you want to disable selected entries?', action: e => that.disabledEntity(that.state.selectedRowKeys, that.state.selectedRows)
        }
      })
    } else if (type === 'deleteAll') {
      this.setState({
        actionData: {
          message: 'Do you want to Delete All data ?', action: e => that.handleDeleteAllData(that.state.selectedRowKeys, that.state.selectedRows)
        }
      })
    }
  };

  handleDeleteAllConfirmation = () => {
    if (this.state.data && this.state.data.length > 0) {
      let data = { key: 'deleteAll' }
      this.onActionChange(data)
    }
  }

  handleDeleteAllData = async () => {
    if (this.state.data && this.state.data.length > 0) {
      this.setState({ loadingData: true });
      await API.graphql(graphqlOperation(deleteAllLicenseInformation, {}))
        .then(res => {
          message.success('License deleted successfully')
          this.onSelectionChange([], '');
          this.setState({ loadingData: false });
          this.fetchData();
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
          this.setState({
            loadingData: false
          });
        });
    }
  }

  visibleModel = () => {
    this.setState({ visiblemodel: !this.state.visiblemodel })
  }

  handleEdit = (key, row) => {
    this.setState({ loadingData: true });
    setTimeout(() => {
      this.props.history.push({ pathname: urlConfig.ADMIN_ADD_LICENSE_INFORMATION, state: { data: row[0].id } });
    }, 2000);
  };

  handleDelete = async (key, row) => {
    this.setState({ loadingData: true });
    for (let i = 0; i < row.length; i++) {
      let body = {
        id: row[i].id,
      }
      await API.graphql(graphqlOperation(deleteLicenseInformation, body))
        .then(result => {
          if (i === row.length - 1) {
            message.success('License deleted successfully')
            this.onSelectionChange([], '');
            this.fetchData();
          }
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
          this.setState({
            loadingData: false
          });
          return false
        });
    }

    this.setState({ loadingData: false });
  };


  enableEntity = async (key, row) => {
    this.setState({ loadingData: true })
    for (let i = 0; i < row.length; i++) {
      let data = {
        updateLicenseInformationInput: {
          id: row[i].id,
          active: 'true'
        }
      }
      await API.graphql(graphqlOperation(updateLicenseInformation, data))
        .then(result => {
          if (i === row.length - 1) {
            this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
            message.success('License activated successfuly');
            this.fetchData();
          }
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
          return false
        });
    }
    this.setState({
      loadingData: false
    });

  };

  disabledEntity = async (key, row) => {
    this.setState({ loadingData: true })
    for (let i = 0; i < row.length; i++) {
      let data = {
        updateLicenseInformationInput: {
          id: row[i].id,
          active: 'false'
        }
      }
      await API.graphql(graphqlOperation(updateLicenseInformation, data))
        .then(result => {
          if (i === row.length - 1) {
            this.onSelectionChange(this.state.selectedRowKeys, this.state.selectedRows);
            message.success('License deactivated successfuly');
            this.fetchData()
          }
        })
        .catch(err => {
          console.log(err)
          message.error('Something wrong happened');
          return false
        });
    }
    this.setState({
      loadingData: false
    });
  };

  changePageNumber = async (e, filters) => {
    this.setState({ currantPage: e }, () => {
      this.fetchData()
    })
  }

  formateDataByFilters = (mainFilter, filters) => {
    let filter = mainFilter
    let filtersColumnArr = [{ name: 'licenseCategory', columnName: 'licenseCategory' }, { name: 'licenseStatus', columnName: 'licenseStatus' }, { name: 'type', columnName: 'licenseType' }, { name: 'state', columnName: 'businessState' }, { name: 'country', columnName: 'businessCountry' }, { name: 'retail', columnName: 'retail' }, { name: 'medical', columnName: 'medical' }, { name: 'structure', columnName: 'businessStructure' },{ name: 'created_at', columnName: 'created_at' },{ name: 'updated_at', columnName: 'updated_at' }]
    for (let index = 0; index < filtersColumnArr.length; index++) {
      let licenseArr = []
      if (filters[filtersColumnArr[index].columnName] && filters[filtersColumnArr[index].columnName].length > 0) {
        filters[filtersColumnArr[index].columnName].map((item, i) => {
          let newObj = {
            [filtersColumnArr[index].columnName]: { eq: item }
          }
          licenseArr.push(newObj)
          return newObj
        })
      }
      if (licenseArr.length > 0) {
        let licenseObj = { or: licenseArr }
        filter.push(licenseObj)
      }
    }
    return filter
  }


  changePageSize = (currentSize, pageSize) => {
    this.setState({ currantPage: 1, currantSize: pageSize }, () => {
      this.fetchData()
    })
  }

  handleTableDataChange = async (pagination, filters, sorter, extra) => {
    const { categoryFilterByTable, updatedAtFilterByTable, statusFilterByTable, createdAtFilterByTable, typeFilterByTable, retailFilterByTable, structureFilterByTable, medicalFilterByTable, stateFilterByTable, countryFilterByTable } = this.state
    let filetrObj = {
      licenseCategory: categoryFilterByTable,
      licenseStatus: statusFilterByTable,
      licenseType: typeFilterByTable,
      businessState: stateFilterByTable,
      businessCountry: countryFilterByTable,
      retail: retailFilterByTable,
      medical: medicalFilterByTable,
      businessStructure: structureFilterByTable,
      createdAt: createdAtFilterByTable,
      updatedAt: updatedAtFilterByTable,
    }
    let mainFilter = [{ active: { eq: "true" } }]
    if (filters.licenseCategory || filters.licenseStatus || filters.licenseType || filters.businessState || filters.businessCountry || filters.businessStructure || filters.retail || filters.medical || filters.created_at || filters.updated_at) {
      if (filters.licenseCategory) {
        this.setState({ categoryFilterByTable: filters.licenseCategory })
        filetrObj.licenseCategory = filters.licenseCategory
      } else if (filters.licenseStatus) {
        this.setState({ statusFilterByTable: filters.licenseStatus })
        filetrObj.licenseStatus = filters.licenseStatus
      } else if (filters.licenseType) {
        this.setState({ typeFilterByTable: filters.licenseType })
        filetrObj.licenseType = filters.licenseType
      } else if (filters.businessState) {
        this.setState({ stateFilterByTable: filters.businessState })
        filetrObj.businessState = filters.businessState
      } else if (filters.businessCountry) {
        this.setState({ countryFilterByTable: filters.businessCountry })
        filetrObj.businessCountry = filters.businessCountry
      } else if (filters.businessStructure) {
        this.setState({ structureFilterByTable: filters.businessStructure })
        filetrObj.businessStructure = filters.businessStructure
      } else if (filters.retail) {
        this.setState({ retailFilterByTable: filters.retail })
        filetrObj.retail = filters.retail
      } else if (filters.medical) {
        this.setState({ medicalFilterByTable: filters.medical })
        filetrObj.medical = filters.medical
      } else if (filters.created_at) {
        this.setState({ createdAtFilterByTable: filters.created_at })
        filetrObj.created_at = filters.created_at
      } else if (filters.updated_at) {
        this.setState({ updatedAtFilterByTable: filters.updated_at })
        filetrObj.updated_at = filters.updated_at
      }
      filters = { ...filters, ...filetrObj }
      mainFilter = await this.formateDataByFilters(mainFilter, filters)
      this.setState({ filter: mainFilter })
    }
    if (sorter.column) {
      let order = sorter.order === "ascend" ? "ASC" : "DESC"
      let columnName = sorter.columnKey
      let orderBy = `${columnName + " " + order}`
      this.setState({ sorter: orderBy })
    }

    this.fetchData()

  }

  handleOk = async () => {
    if (this.state.country === null && this.state.state === null) {
      message.error("please Select a filter")
    } else {
      this.setState({ isVisible: false, loadingData: true })
      let filter = ''
      if (this.state.country && this.state.state) {
        filter += ` businessCountry = '${this.state.country}' and  businessState = '${this.state.state}'`
      } else if (this.state.state) {
        filter += ` businessState = '${this.state.state}'`
      } else if (this.state.country) {
        filter += ` businessCountry = '${this.state.country}' `
      }
      let body = {
        filter: filter
      }
      var response = await API.post('PaymentGatewayAPI', '/paymentgateway/deleteLicenseInformation', { body })
      if (response.success) {
        this.setState({ loadingData: false, country: null, state: null })
        message.success('License Deleted successfuly')
        this.fetchData();
        this.fetchCountryData();
        this.fetchStateData()
      } else {
        this.setState({ loadingData: false, country: null, state: null })
        console.log(response.err)
        message.error("something bad happen")
      }
    }

  }

  handleCancel = async () => {
    this.setState({ isVisible: false })
  }

  handleSelect = (name, e) => {
    this.setState({ [name]: e })
  }

  render() {

    const menu = (
      <Menu onClick={this.onActionChange}>
        <Menu.Item key="enable">
          <CheckCircleOutlined />
                    Active
                </Menu.Item>
        <Menu.Item key="disable">
          <MinusCircleOutlined />
                   InActive
                </Menu.Item>
        {this.state.selectedRows.length === 1 && <Menu.Item key="edit">
          <PlusOutlined />
                   Edit
                </Menu.Item>
        }
        <Menu.Item key="delete">
          <DeleteOutlined />
                   Delete
                </Menu.Item>
      </Menu>
    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
        xl: { span: 24 },
        lg: { span: 24 },
        md: { span: 24 }
      },
    };

    const { form } = this.props;
    let tableData = this.tableData
    if (this.state.columns && this.state.columns.length > 0) {
      tableData.columns = this.state.columns
    }

    return (
      <Auxiliary>
        <DataTable
          menu={menu}
          dataSource={this.state.data}
          data={tableData}
          loadingData={this.state.loadingData}
          pagination={true}
          pageTotal={this.state.pageTotal}
          selectedRowKeys={this.state.selectedRowKeys}
          selectedRows={this.state.selectedRows}
          handleTableDataChange={this.handleTableDataChange}
          setPageNumber={this.changePageNumber}
          setPageSize={this.changePageSize}
        />
        {this.state.visible_confirm_model ? <ConfirmModel actionData={this.state.actionData} visibleModel={this.state.visiblemodel} visible={this.visibleModel} /> : null}
        <Modal title="Choose Filter" visible={this.state.isVisible} onOk={() => this.handleOk()} okText={"Delete"} onCancel={() => this.handleCancel()}>
          <Form ref={this.formRef} form={form} onFinish={this.onFinish} {...formItemLayout}>
            <Row type="flex" justify="center">
              <Col sm={24} xs={24}>
                <InputSelect
                  defaultValue={true}
                  showSearch={true}
                  field={form}
                  label='Country'
                  name='country'
                  validationMessage='Please input correct type'
                  requiredMessage='Please input active type'
                  display={true}
                  required={true}
                  onChange={(e) => this.handleSelect('country', e)}
                  list={this.state.countryList}
                />
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col sm={24} xs={24}>
                <InputSelect
                  defaultValue={true}
                  showSearch={true}
                  field={form}
                  label='State'
                  name='state'
                  validationMessage='Please input correct type'
                  requiredMessage='Please input active type'
                  display={true}
                  required={true}
                  onChange={(e) => this.handleSelect('state', e)}
                  list={this.state.stateList}
                />
              </Col>
            </Row>
          </Form>
        </Modal>
      </Auxiliary>
    );
  }
}

const WrappedLocalAuthForm = (LicenseInformation);

export default withRouter(WrappedLocalAuthForm);



