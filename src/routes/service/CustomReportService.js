import Papa from '../../../node_modules/papaparse';
import jsPDF from 'jspdf';
import '../../../node_modules/jspdf-autotable'
import { API, graphqlOperation } from 'aws-amplify'
import { createPurchaseReportWithFilter } from '../../graphql/mutations'
import { listLicenseInformationsPagination } from '../../graphql/queries'
import * as Amplify from '../../../node_modules/aws-amplify';
import logo from 'assets/images/logo.png';
import moment from 'moment'


const TITLES = {
    listByBusinessName: "Business Name",
    listByCategory: "License Category",
    listByBusinessCity: "Business City",
    listByCountry: "Business Country",
    listByDoingBusinessAs: "Doing Business As",
    listByLicenseNumber: "License Number",
    listByState: "Business State",
    listByBusinessCounty: "Business County",
    listByBusinessEmailAddress: "Business Email Address",
    listBylicenseExpireDate: "License Expire Date",
    listBylicenseIssueDate: "License Issue Date",
    listBylicenseOwner: "License Owner",
    listBybusinessPhoneNumber: "Business Phone Number",
    listBylicenseStatus: "License Status",
    listBylicenseType: "License Type ",
    listByZipCode: "Business Zip Code",
    listByLastUpdated: 'Last Updated',
    getLicenseCountTotalRecords: "Total Licenses",
    getLicenseRetailCountTotalRecords: "Retail Licenses",
    getLicenseMedicalCountTotalRecords: "Medical Licenses",
    getLicenseMedicalCultivationsCountRecords: "Med. Cultivation",
    getLicenseRetailCultivationsCountRecords: "Rec. Cultivation",
    getLicenseMedicalManufacturerCountRecords: "Infused Medical",
    getLicenseRetailManufacturerCountRecords: "Infused Retail",
    getLicenseAncillaryCountRecords: "Ancillary Licenses",
    getLicenseStoresCountRecords: "Stores",
    getLicenseDistributorCountRecords: "Distributors",
    getCountriesCountRecords: "Legal Countries",
    getStatesCountRecords: "Legal U.S. States",
}

let columnHeaders = {
    licenseNumber: 'License Number',
    licenseCategory: 'License Category',
    licenseType: 'License Type',
    licenseStatus: 'License Status',
    licenseIssueDate: 'License Issue Date',
    licenseExpireDate: 'License Expire Date',
    licenseOwner: 'License Owner',
    retail: 'Retail',
    medical: 'Medical',
    businessLegalName: 'Business Name',
    businessDoingBusinessAs: 'Doing Business As',
    businessAddress1: 'Business Address1',
    businessAddress2: 'Business Address2',
    businessCity: 'City',
    businessCounty: 'County',
    businessState: 'State',
    businessZipcode: 'Zipcode',
    lastUpdated: 'Last Updated',
    businessCountry: 'Country',
    businessPhoneNumber: 'Business Phone',
    businessEmailAddress: 'Business Email',
    businessStructure: 'Business Structure',
    created_at: 'Created At',
    updated_at: 'Updated At',
}


export const getData = async (authUser) => {
    return new Promise(async (resolve) => {
        const type = window.sessionStorage.getItem("purchaseType") || 1;
        let title = window.sessionStorage.getItem("title") || '';
        const name = window.sessionStorage.getItem("name") || '';
        let filter = window.sessionStorage.getItem('filter')
        const sorter = window.sessionStorage.getItem('sorter')
        let data = [];
        let body = {
            filter: filter,
            orderBy: sorter,
            page: 1,
            size: 1000
        }

        // let fetchingData = true
        const pageTotal = window.sessionStorage.getItem("count") || 0;

        const total = pageTotal % 1000 === 0 ? parseInt(pageTotal / 1000) : parseInt(pageTotal / 1000) + 1;

        var addData = function (items) {
            data = data.concat(items)
        };


        for (let i = 0; i < total; i++) {
            await API.graphql(graphqlOperation(listLicenseInformationsPagination, body))
                .then(async (result) => {
                    result = result.data.listLicenseInformationsPagination;
                    await addData(result.items)
                }).catch((error) => {
                    resolve(false)
                })
        }

        if (data && data.length > 0) {
            try {
                let newData = data
                var result = await exportCustomCSV(newData, parseInt(type), title, name, authUser);
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

        let tableColumns = await getColumns(data[0])

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
            columns: tableColumns,
            body: data
        })

        var result = doc.output("arraybuffer");
        resolve(result);
    });
}

export const getDataForCsv = (data) => {
    return data.map((item, i) => {
        return {
            key: i + 1,
            // last_updated: moment(item.last_updated).format('MM-DD-YYYY'),
            ...item
        };
    });
}


export const exportCustomCSV = async (data, type, title, name, authUser) => {

    return new Promise(async (resolve) => {

        let newData = await getDataForCsv(data)
        const csv = Papa.unparse(newData);
        const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const pdfData = await convertToPdf(data, authUser);
        const description = window.sessionStorage.getItem("description");
        const t = window.sessionStorage.getItem("reportname").replace(/\s/g, '')
        const reportname = window.sessionStorage.getItem("reportname");
        const time = new Date().getTime();
        const csvName = t + "_csv_" + time;
        const pdfName = t + "_pdf_" + time;
        const promotionCode = window.sessionStorage.getItem("promotionCode");
        const totalAmount = window.sessionStorage.getItem("totalAmount");
        const discount = window.sessionStorage.getItem("discount");
        const amount = window.sessionStorage.getItem("amount");
        const isFrom = window.sessionStorage.getItem("isFrom");
        const filter = window.sessionStorage.getItem('filter')
        const sorter = window.sessionStorage.getItem('sorter')
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
                    reportType: TITLES[title] ? TITLES[title] : title,
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
                    isFrom: isFrom,
                    filter: filter,
                    sorter: sorter,
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




export const getColumns = async (data) => {
    return new Promise(async (resolve) => {
        let columnArr = Object.keys(data)
        let columns = []
        for (let i = 0; i < columnArr.length; i++) {
            let columnObj = {
                header: columnHeaders[columnArr[i]],
                dataKey: columnArr[i],
            }
            columns.push(columnObj)
        }
        resolve(columns)
    })
}

