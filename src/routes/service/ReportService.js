
import Papa from '../../../node_modules/papaparse';
import jsPDF from 'jspdf';
import '../../../node_modules/jspdf-autotable'
import { API, graphqlOperation } from 'aws-amplify'
import { createPurchaseReportWithFilter, updatePendingReport, createPendingReportWithFilter } from '../../graphql/mutations'
import { listLicenseInformationsPagination, listPricings } from '../../graphql/queries'
import * as Amplify from '../../../node_modules/aws-amplify';
import logo from 'assets/images/logo.png';
import { notification } from "antd";
import { exportCustomCSV } from './CustomReportService';
import { GetAllUser } from '../../util/UserService';
import moment from 'moment'


export const getData = async (authUser) => {
    return new Promise(async (resolve) => {

        const type = window.sessionStorage.getItem("purchaseType") || 1;
        let title = window.sessionStorage.getItem("title") || '';
        const name = window.sessionStorage.getItem("name") || '';
        const filter = window.sessionStorage.getItem('filter')
        const sorter = window.sessionStorage.getItem('sorter')
        let isFrom = window.sessionStorage.getItem('isFrom')
        let data = []
        let body

        // let fetchingData = true
        const pageTotal = window.sessionStorage.getItem("count") || 0;

        const total = pageTotal % 1000 === 0 ? parseInt(pageTotal / 1000) : parseInt(pageTotal / 1000) + 1;

        var addData = function (items) {
            data = data.concat(items)
        };

        for (let i = 0; i < total; i++) {
            if (isFrom === 'Custom') {

                body = {
                    query: filter,
                    page: i + 1,
                    size: 1000
                }
                var response = await API.post('CustomerRestAPI', '/customers/getData', { body })
                if (response.success) {
                    data = data.concat(response.customQueryData)
                } else {
                    resolve(false)
                }
            } else {
                body = {
                    filter: filter,
                    orderBy: sorter,
                    page: i + 1,
                    size: 1000
                }
                await API.graphql(graphqlOperation(listLicenseInformationsPagination, body))
                    .then(async (result) => {
                        result = result.data.listLicenseInformationsPagination;
                        await addData(result.items)
                    }).catch((error) => {
                        resolve(false)
                    })
            }

        }



        if (data && data.length > 0) {
            try {
                let result
                if (isFrom === 'Custom') {
                    result = await exportCustomCSV(data, parseInt(type), title, name, authUser);
                } else {
                    result = await exportCSV(data, parseInt(type), title, name, authUser);
                }
                resolve(result);
            } catch (e) {
                console.log(e)
                resolve(false)
            }
        } else {
            resolve(false)
        }
    });
};

const convertToPdf = async (data, authUser) => {

    return new Promise(async (resolve) => {
        let tables = [];
        let columns = [];

        for (let i = 0; i < data.length; i++) {
            // data[i].last_updated = moment(data[i].last_updated).format('MM-DD-YYYY');
            const row = data[i];
            tables.push(Object.values(row))
        }
        let amount = parseInt(window.sessionStorage.getItem("amount"))
        let promotionCode = window.sessionStorage.getItem("promotionCode");
        let totalAmount = parseInt(window.sessionStorage.getItem("totalAmount"));
        let discount = parseInt(window.sessionStorage.getItem("discount"));

        columns.push(Object.keys(data[0]));
        var rows = [
            ['Report create for : ', ` ${authUser.given_name + ' ' + authUser.family_name}`,],
            ['Report Title : ', ` ${window.sessionStorage.getItem("reportname")}`,],
            ['Report Description :  ', ` ${window.sessionStorage.getItem("description")}`,],
            ['Report Creation Date : ', ` ${moment().format('MM-DD-YYYY')}`,],
            ['Report Expiration Date : ', ` ${moment().add(31, 'days').format('MM-DD-YYYY')}`,],
            ['Record Count : ', ` ${data.length}`,],
        ];
        var sellerDetailsRows = [
            ['Name : ', `Canoja Technologies, LLC `,],
            ['Sales Email : ', `sales@canojatech.com`,],
            ['Support Email : ', `support@canojatech.com`,],
        ];
        var paymentDetailsRows = [
            ['Customer Name : ', ` ${authUser.given_name + ' ' + authUser.family_name}`,],
            ['Customer Email : ', ` ${authUser.email}`,],
            ['Purchase Date : ', ` ${moment().format('MM-DD-YYYY')} `,],
            ['Promotion Code : ', ` ${promotionCode}`,],
            ['Purchase Amount : ', ` ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,],
            ['Discount: ', ` ${discount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,],
            ['Purchase Total Amount : ', ` ${totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,],
        ];

        let doc = new jsPDF('l', 'pt', 'a2');
        doc.addImage(logo, 50, 50, 300, 70);
        doc.setTextColor("5fa30f");
        doc.text(50, 145, "The Source for Cannabis License Data and Verification");
        doc.text(50, 205, `Report Details : `);
        doc.autoTable({
            theme: 'plain',
            startY: 225,
            styles: { overflow: 'linebreak', cellWidth: 240, fontSize: 16, },
            columnStyles: { text: 24, },
            body: rows
        })
        doc.line(50, 415, 1500, 415);
        doc.text(90, 485, `Seller Details : `);
        doc.line(485, 465, 485, 665);
        doc.autoTable({
            theme: 'plain',
            margin: { right: 205 },
            startY: 505,
            styles: { overflow: 'linebreak', cellWidth: 220, fontSize: 16, },
            columnStyles: { text: 24, },
            body: sellerDetailsRows
        })
        doc.text(700, 485, `Payment Details : `);
        // doc.line(1050, 465, 1050, 665);
        doc.autoTable({
            margin: { left: 555 },
            theme: 'plain',
            startY: 505,
            styles: { overflow: 'linebreak', cellWidth: 240, fontSize: 16, },
            columnStyles: { text: 24, },
            body: paymentDetailsRows
        })
        doc.addPage('a2', 'l');
        doc.autoTable({
            theme: 'grid',
            startX: 50,
            startY: 25,
            styles: { overflow: 'linebreak', cellWidth: 'auto' },
            columnStyles: { text: { cellWidth: 'auto', textColor: 2 } },
            columns: [
                { header: 'License Number', dataKey: 'licenseNumber' },
                { header: 'Business Name', dataKey: 'businessLegalName' },
                { header: 'Doing Business As', dataKey: 'businessDoingBusinessAs' },
                { header: 'License Status', dataKey: 'licenseStatus' },
                { header: 'License Category', dataKey: 'licenseCategory' },
                { header: 'Medical', dataKey: 'medical' },
                { header: 'Retail', dataKey: 'retail' },
                { header: 'License Issue Date', dataKey: 'licenseIssueDate' },
                { header: 'License Expire Date', dataKey: 'licenseExpireDate' },
                { header: 'License Owner', dataKey: 'licenseOwner' },
                { header: 'Business Address1', dataKey: 'businessAddress1' },
                { header: 'Business Address2', dataKey: 'businessAddress2' },
                { header: 'City', dataKey: 'businessCity' },
                { header: 'State', dataKey: 'businessState' },
                { header: 'Zipcode', dataKey: 'businessZipcode' },
                { header: 'County', dataKey: 'businessCounty' },
                { header: 'Country', dataKey: 'businessCountry' },
                { header: 'Business Phone', dataKey: 'businessPhoneNumber' },
                { header: 'Business Email', dataKey: 'businessEmailAddress' },
                { header: 'Created At', dataKey: 'created_at' },
                { header: 'Upadted At', dataKey: 'updated_at' },
                // { header: 'License Type', dataKey: 'licenseType' },
                // { header: 'Last Upadted', dataKey: 'last_updated' },
                // { header: 'Business Structure', dataKey: 'businessStructure' },
            ],
            body: data
        })

        var result = doc.output("arraybuffer");
        resolve(result);
    });
}

export const exportCSV = async (data, type, title, name, authUser) => {

    return new Promise(async (resolve) => {

        let newData = data.map((d, i) => {
            return {
                key: i + 1,
                licenseNumber: d.licenseNumber,
                businessLegalName: d.businessLegalName,
                businessDoingBusinessAs: d.businessDoingBusinessAs,
                licenseStatus: d.licenseStatus,
                licenseCategory: d.licenseCategory,
                medical: d.medical,
                retail: d.retail,
                licenseIssueDate: d.licenseIssueDate,
                licenseExpireDate: d.licenseExpireDate,
                owner: d.licenseOwner,
                businessAddress1: d.businessAddress1,
                businessAddress2: d.businessAddress2,
                businessCity: d.businessCity,
                businessState: d.businessState,
                businessZipcode: d.businessZipcode,
                businessCounty: d.businessCounty,
                businessCountry: d.businessCountry,
                businessPhoneNumber: d.businessPhoneNumber,
                businessEmailAddress: d.businessEmailAddress,

                // licenseType: d.licenseType,
                // last_updated: moment(d.last_updated).format('MM-DD-YYYY'),
                // businessStructure: d.businessStructure,
                created_at: d.created_at,
                updated_at: d.updated_at
            }
        });
        const csv = Papa.unparse(newData);

        const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const pdfData = await convertToPdf(data, authUser);
        const description = window.sessionStorage.getItem("description");
        const t = window.sessionStorage.getItem("reportname").replace(/\s/g, '')
        const reportname = window.sessionStorage.getItem("reportname");
        const time = new Date().getTime();
        const promotionCode = window.sessionStorage.getItem("promotionCode");
        const totalAmount = window.sessionStorage.getItem("totalAmount");
        const discount = window.sessionStorage.getItem("discount");
        const amount = window.sessionStorage.getItem("amount");
        const filter = window.sessionStorage.getItem('filter')
        const sorter = window.sessionStorage.getItem('sorter')
        const csvName = t + "_csv_" + time;
        const pdfName = t + "_pdf_" + time;
        const isFrom = window.sessionStorage.getItem("isFrom");
        const amountPerRecord = window.sessionStorage.getItem("amountPerRecord");

        let expires = new Date();

        try {
            await Amplify.Storage.put(`purchased-reports/${csvName}.csv`,
                csvData,
                {
                    ContentType: 'text/csv;charset=utf-8;',
                    expires: new Date(expires.setDate(expires.getDate() + 30))
                })

            await Amplify.Storage.put(`purchased-reports/${pdfName}.pdf`,
                pdfData,
                {
                    ContentType: 'application/pdf;',
                    expires: new Date(expires.setDate(expires.getDate() + 30))
                })

            const purchase_report = {
                createPurchaseReportInput: {
                    username: authUser.Username,
                    reportType: title,
                    reportData: name,
                    datePurchase: moment().format('MM-DD-YYYY'),
                    expirationDate: moment().add(31, 'days').format('MM-DD-YYYY'),
                    csvFileName: `purchased-reports/${csvName}.csv`,
                    pdfFileName: `purchased-reports/${pdfName}.pdf`,
                    reportname: reportname,
                    description: description,
                    promotionCode: promotionCode,
                    totalAmount: totalAmount,
                    discount: discount,
                    amount: amount,
                    filter: filter,
                    sorter: sorter,
                    isFrom: isFrom,
                    recordCost: amountPerRecord
                }
            }

            var result = await API.graphql(graphqlOperation(createPurchaseReportWithFilter, purchase_report))
            resolve(result);
        } catch (e) {
            resolve(e)
        }
    });
}

export const getJSONData = async (report) => {
    return new Promise(async (resolve) => {
        let filter = report.filter
        // filter = await getFilters(filter)
        const sorter = report.sorter
        let isFrom = report.isFrom
        let data = [];
        let body

        let pageTotal = 1000;

        let total = pageTotal % 1000 === 0 ? parseInt(pageTotal / 1000) : parseInt(pageTotal / 1000) + 1;

        var addData = async (items, count) => {

            items = await items.map(d => {
                return {
                    licenseNumber: d.licenseNumber,
                    businessLegalName: d.businessLegalName,
                    businessDoingBusinessAs: d.businessDoingBusinessAs,
                    licenseStatus: d.licenseStatus,
                    licenseCategory: d.licenseCategory,
                    medical: d.medical,
                    retail: d.retail,
                    licenseIssueDate: d.licenseIssueDate,
                    licenseExpireDate: d.licenseExpireDate,
                    owner: d.licenseOwner,
                    businessAddress1: d.businessAddress1,
                    businessAddress2: d.businessAddress2,
                    businessCity: d.businessCity,
                    businessState: d.businessState,
                    businessZipcode: d.businessZipcode,
                    businessCounty: d.businessCounty,
                    businessCountry: d.businessCountry,
                    businessPhoneNumber: d.businessPhoneNumber,
                    businessEmailAddress: d.businessEmailAddress,
                    created_at: d.created_at,
                    updated_at: d.updated_at
                }
            })
            data = data.concat(items)
            total = count
        };

        for (let i = 0; i < total; i++) {
            if (isFrom === 'Custom') {

                body = {
                    query: filter,
                    page: i + 1,
                    size: 1000
                }
                var response = await API.post('CustomerRestAPI', '/customers/getData', { body })
                if (response.success) {
                    data = data.concat(response.customQueryData)
                    total = response.total % 1000 === 0 ? parseInt(response.total / 1000) : parseInt(response.total / 1000) + 1;
                } else {
                    resolve(false)
                }
            } else {
                body = {
                    filter: filter,
                    orderBy: sorter,
                    page: i + 1,
                    size: 1000
                }
                await API.graphql(graphqlOperation(listLicenseInformationsPagination, body))
                    .then(async (result) => {
                        result = result.data.listLicenseInformationsPagination;
                        let count = result.total % 1000 === 0 ? parseInt(result.total / 1000) : parseInt(result.total / 1000) + 1;
                        await addData(result.items, count)
                    }).catch((error) => {
                        resolve(false)
                    })
            }

        }

        if (data && data.length > 0) {
            resolve(data);
        } else {
            resolve(false)
        }
    });
};


export const setPendingReportToDB = async (user) => {
    return new Promise(async resolve => {
        const type = window.sessionStorage.getItem("purchaseType") || 1;
        let title = window.sessionStorage.getItem("title") || '';
        const reportname = window.sessionStorage.getItem("reportname");
        const reportDescription = window.sessionStorage.getItem("description");
        const amount = window.sessionStorage.getItem("amount") || '';
        const filter = window.sessionStorage.getItem('filter');
        const sorter = window.sessionStorage.getItem('sorter');
        const count = window.sessionStorage.getItem("count");
        const promotionCode = window.sessionStorage.getItem("promotionCode");
        const totalAmount = window.sessionStorage.getItem("totalAmount");
        const discount = window.sessionStorage.getItem("discount");
        const name = window.sessionStorage.getItem("name");
        const isFrom = window.sessionStorage.getItem("isFrom");
        const amountPerRecord = window.sessionStorage.getItem("amountPerRecord");
        // if (parseInt(type) !== 1) {
        //     title = window.sessionStorage.getItem("count") || '';
        // }
        const pageTotal = window.sessionStorage.getItem("pageTotal") || 0;
        let uniqueId = await getPendingReportUniqueKey()
        let purchase_report_object = {
            createPendingReportInput: {
                username: user.Username,
                purchaseDate: moment().format('MM-DD-YYYY'),
                reportType: title,
                amount: amount,
                reportName: reportname,
                reportDescription: reportDescription,
                filter: filter,
                purchaseType: type,
                title: title,
                sorter: sorter,
                name: name,
                promotionCode: promotionCode,
                totalAmount: totalAmount,
                discount: discount,
                count: count,
                pageTotal: pageTotal,
                downloadStatus: false,
                uniqueId: uniqueId,
                isFrom: isFrom,
                recordCost: amountPerRecord
            }
        }

        try {
            var result = await API.graphql(graphqlOperation(createPendingReportWithFilter, purchase_report_object))
            resolve(result);
        } catch (e) {
            resolve(e)
        }
    })
}

export const updatePendingReportToDB = async (id) => {

    return new Promise(resolve => {
        let purchase_report_object = {
            updatePendingReportInput: {
                downloadStatus: 'true',
                id: id
            }
        }
        API.graphql(graphqlOperation(updatePendingReport, purchase_report_object))
            .then(result => {
                console.log(result)
                resolve(result)
            })
            .catch(err => {
                console.log(err)
                resolve(err)
            });
    })
}

export const clearSessionForPayment = () => {
    window.sessionStorage.removeItem("count")
    window.sessionStorage.removeItem("pageTotal")
    window.sessionStorage.removeItem("sorter")
    window.sessionStorage.removeItem("filter")
    window.sessionStorage.removeItem("reportName")
    window.sessionStorage.removeItem("amount")
    window.sessionStorage.removeItem("title")
    window.sessionStorage.removeItem("isPurchase")
    window.sessionStorage.removeItem("purchaseType")
    window.sessionStorage.removeItem("name")
    window.sessionStorage.removeItem("licenseType")
    window.sessionStorage.removeItem("promotionCode")
    window.sessionStorage.removeItem("totalAmount")
    window.sessionStorage.removeItem("discount")
    window.sessionStorage.removeItem("isFrom")
    window.sessionStorage.removeItem("amountPerRecord");
}

export const setSessionForPayment = (object) => {
    window.sessionStorage.setItem("reportname", object.reportName)
    window.sessionStorage.setItem("description", object.reportDescription)
    window.sessionStorage.setItem("count", object.count);
    window.sessionStorage.setItem("pageTotal", object.pageTotal);
    window.sessionStorage.setItem("sorter", object.sorter);
    window.sessionStorage.setItem("filter", object.filter);
    window.sessionStorage.setItem("amount", object.amount);
    window.sessionStorage.setItem("title", object.title);
    window.sessionStorage.setItem("promotionCode", object.promotionCode);
    window.sessionStorage.setItem("totalAmount", object.totalAmount);
    window.sessionStorage.setItem("discount", object.discount);
    // window.sessionStorage.setItem("isPurchase", true);
    window.sessionStorage.setItem("purchaseType", object.purchaseType);
    window.sessionStorage.setItem("name", object.name);
    window.sessionStorage.setItem("licenseType", object.license_type);
    window.sessionStorage.setItem("isFrom", object.isFrom);
    window.sessionStorage.setItem("amountPerRecord", object.recordCost);

}

export const openSanckbarNotification = (key, placement, message, duration) => {
    notification.success({
        key,
        message: message,
        // description:
        //     'Report Generated successfull',
        placement,
        duration: 10,
    });
};
export const openSanckbarNotificationInfo = (key, placement, message) => {
    notification.info({
        key,
        message: message,
        // description:
        //     'Report Generated successfull',
        placement,
        duration: 10,

    });
};
export const openSanckbarNotificationError = (key, placement, message, button) => {
    notification.error({
        key,
        message: message,
        // description:
        //     'Report Generated successfull',
        btn: button === undefined || button === null ? null : button,
        placement,
        duration: 10,
    });
};
export const closeSanckbarNotification = (key) => {
    notification.close({
        key
    });
};


export const getCoupons = () => {
    return new Promise(async (resolve) => {
        var body = { limit: 100 }
        let coupons = []


        getCodes()

        async function getCodes() {
            var response = await API.post('PaymentGatewayAPI', '/paymentgateway/pagination/couponcode', { body })
            if (response.success) {
                response = response.coupons
                coupons.push(response.data)
                if (response.has_more) {
                    let lastRecordIndex = response.data.length - 1
                    body = {
                        ...body,
                        starting_after: response.data[lastRecordIndex].id
                    }
                    await getCodes()
                } else {
                    resolve(coupons[0])
                }

            } else {
                console.log(response.err)
                resolve(false)
            }
        }
    })

}

export const getSubscriptions = () => {
    return new Promise(async (resolve) => {
        var body = {}
        let subscription = []
        let size = 10
        let page = 1
        let pageData = 1
        getSubscription()

        async function getSubscription() {

            body = { ...body, size: size, page: page }
            var response = await API.post('PaymentGatewayAPI', '/paymentgateway/pagination/subscription', { body })
            if (response.success) {
                response = response.subscriptions
                subscription = subscription.concat(response.subscriptionDetails.subscriptionDetail)
                if (response.totalNumInResultSet > 0) {
                    pageData = Math.ceil(response.totalNumInResultSet / size)
                }
                if (page !== pageData) {
                    page += 1
                    await getSubscription()
                } else {
                    resolve(subscription)
                }
            } else {
                console.log(response.err)
                resolve(false)
            }
        }
    })

}

export const getCustomers = () => {
    return new Promise(async (resolve) => {
        var body = { limit: 100 }
        let customer = []


        getCustomer()

        async function getCustomer() {
            var response = await API.post('PaymentGatewayAPI', '/paymentgateway/pagination/customers', { body })
            if (response.success) {
                response = response.customers
                customer.push(response.data)
                if (response.has_more) {
                    let lastRecordIndex = response.data.length - 1
                    body = {
                        ...body,
                        starting_after: response.data[lastRecordIndex].id
                    }
                    await getCustomer()
                } else {
                    resolve(customer[0])
                }

            } else {
                console.log(response.err)
                resolve(false)
            }
        }
    })

}

export const getPriceList = () => {
    return new Promise(async (resolve) => {
        let res = await API.graphql(graphqlOperation(listPricings, {}))
        res = res.data.listPricings
        if (res.errors) {
            resolve(false)
        } else {
            resolve(res)
        }
    })

}

export const getTransactionList = () => {
    return new Promise(async (resolve) => {
        var body = { limit: 100 }
        let transactions = []

        getCodes()
        async function getCodes() {
            var response = await API.post('PaymentGatewayAPI', '/paymentgateway/pagination/transection', { body })
            if (response.success) {
                response = response.transactions
                transactions.push(response.data)
                if (response.has_more) {
                    let lastRecordIndex = response.data.length - 1
                    body = {
                        ...body,
                        starting_after: response.data[lastRecordIndex].id
                    }
                    await getCodes()
                } else {
                    resolve(transactions[0])
                }

            } else {
                console.log(response.err)
                resolve(false)
            }
        }
    })

}

export const getCustomersList = () => {
    return new Promise(async (resolve) => {
        let dataArray = []

        var data = await GetAllUser()
        if (data && data.Users) {
            data = data.Users
            if (data && data.length) {
                for (let i = 0; i < data.length; i++) {
                    let dataObj = {
                        UserStatus: data[i].UserStatus,
                        Enabled: data[i].Enabled,
                        Username: data[i].Username,
                        id: data[i].Username,
                    }
                    for (let index = 0; index < data[i].Attributes.length; index++) {
                        dataObj = { ...dataObj, [data[i].Attributes[index].Name]: data[i].Attributes[index].Value }
                    }
                    dataArray.push(dataObj)
                }
            }
        }
        resolve(dataArray)
    })

}




export const getPendingReportUniqueKey = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export const convertToCSV2 = (objArray) => {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line !== '') line += '|'

            line += array[i][index];
        }

        str += line + '\n';
    }

    return str;
}

export const exportCSVFile2 = (headers, items, fileTitle) => {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = convertToCSV2(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
