
import { API, graphqlOperation } from 'aws-amplify'
import { listAllBusinessCountry, listAllBusinessState, listAllBusinessStructure, listAllCreatedAt, listAllLicenseCategroy, listAllLicenseStatus, listAllLicenseType, listAllUpdatedAt, } from "../../graphql/queries";

export const getFiltersForColumns = async (data) => {
    let licenseCategory = []
    let licenseStatus = []
    let licenseType = []
    let businessCountry = []
    let businessState = []
    let businessStructure = []
    let created_at = []
    let updated_at = []

    await API.graphql(graphqlOperation(listAllLicenseCategroy, data))
        .then(result => {
            licenseCategory = result.data.listAllLicenseCategroy
        })
        .catch(err => {
            console.log(err)
        });

    await API.graphql(graphqlOperation(listAllLicenseStatus, data))
        .then(result => {
            licenseStatus = result.data.listAllLicenseStatus
        })
        .catch(err => {
            console.log(err)
        });


    await API.graphql(graphqlOperation(listAllLicenseType, data))
        .then(result => {
            licenseType = result.data.listAllLicenseType
        })
        .catch(err => {
            console.log(err)
        });

    await API.graphql(graphqlOperation(listAllBusinessStructure, data))
        .then(result => {
            businessStructure = result.data.listAllBusinessStructure
        })
        .catch(err => {
            console.log(err)
        });

    await API.graphql(graphqlOperation(listAllBusinessState, data))
        .then(result => {
            businessState = result.data.listAllBusinessState
        })
        .catch(err => {
            console.log(err)
        });

    await API.graphql(graphqlOperation(listAllBusinessCountry, data))
        .then(result => {
            businessCountry = result.data.listAllBusinessCountry
        })
        .catch(err => {
            console.log(err)
        });

    await API.graphql(graphqlOperation(listAllCreatedAt, data))
        .then(result => {
            created_at = result.data.listAllCreatedAt
        })
        .catch(err => {
            console.log(err)
        });

    await API.graphql(graphqlOperation(listAllUpdatedAt, data))
        .then(result => {
            updated_at = result.data.listAllUpdatedAt
        })
        .catch(err => {
            console.log(err)
        });
    licenseCategory = licenseCategory.map(t => {
        return { text: t.items, value: t.items }
    })
    licenseStatus = licenseStatus.map(t => {
        return { text: t.items, value: t.items }
    })
    licenseType = licenseType.map(t => {
        return { text: t.items, value: t.items }
    })
    businessCountry = businessCountry.map(t => {
        return { text: t.items, value: t.items }
    })
    businessState = businessState.map(t => {
        return { text: t.items, value: t.items }
    })
    businessStructure = businessStructure.map(t => {
        return { text: t.items, value: t.items }
    })
    created_at = created_at.map(t => {
        return { text: t.items, value: t.items }
    }).filter(item => item.value !== null)

    updated_at = updated_at.map(t => {
        return { text: t.items, value: t.items }
    }).filter(item => item.value !== null)

    let retail = [{ text: 'True', value: 'True' }, { text: 'False', value: 'False' }]
    let medical = [{ text: 'True', value: 'True' }, { text: 'False', value: 'False' }]

    return {
        licenseCategory,
        licenseStatus,
        licenseType,
        businessCountry,
        businessState,
        businessStructure,
        retail,
        medical,
        created_at,
        updated_at
    }

}

export const getFilters = async (data) => {

    return new Promise(resolve => {
        var filter = '';

        for (let index = 0; index < data.length; index++) {
            var element = data[index];

            for (let [key, value] of Object.entries(element)) {

                if (!Array.isArray(value)) {
                    if (value.hasOwnProperty("eq")) {
                        filter += key + "='" + value.eq + "'";
                    } else if (value.hasOwnProperty("ne")) {
                        filter += key + "!='" + value.ne + "'";
                    } else {
                        filter += key + " LIKE '%" + value.like + "%'";
                    }

                    if (index + 1 !== data.length) {
                        filter += " and ";
                    }
                } else {
                    if (key === 'searchString') {
                        filter += " ( ";
                        for (let inner = 0; inner < value.length; inner++) {
                            var obj = value[inner];

                            for (let [key, value] of Object.entries(obj)) {
                                filter += key + " LIKE '%" + value.like + "%'";
                            }
                            if (inner + 1 !== value.length) {
                                filter += " or ";
                            } else {
                                filter += " ) ";
                            }
                        }

                    } else {
                        var inFilterValue = [];
                        var inFilterKey = '';

                        for (let inner = 0; inner < value.length; inner++) {
                            var insider = value[inner];

                            for (let [key, value] of Object.entries(insider)) {
                                inFilterKey = key;
                                inFilterValue.push("'" + value.eq + "'");
                            }
                        }

                        filter += inFilterKey + " in (" + inFilterValue.join() + ")";
                    }

                    if (index + 1 !== data.length) {
                        filter += " and ";
                    }
                }
            }

        }

        resolve(filter)
    })
}

export const getStateOptions = () => {
    var states = [
        {
            id: "US-AL",
            name: "US-AL",
        },
        {
            id: "US-AK",
            name: "US-AK",
        },
        {
            id: "US-AZ",
            name: "US-AZ",
        },
        {
            id: "US-AR",
            name: "US-AR",
        },
        {
            id: "US-CA",
            name: "US-CA",
        },
        {
            id: "US-CO",
            name: "US-CO",
        },
        {
            id: "US-CT",
            name: "US-CT",
        },
        {
            id: "US-DE",
            name: "US-DE",
        },
        {
            id: "US-FL",
            name: "US-FL",
        },
        {
            id: "US-GA",
            name: "US-GA",
        },
        {
            id: "US-HI",
            name: "US-HI",
        },
        {
            id: "US-ID",
            name: "US-ID",
        },
        {
            id: "US-IL",
            name: "US-IL",
        },
        {
            id: "US-IN",
            name: "US-IN",
        },
        {
            id: "US-IA",
            name: "US-IA",
        },
        {
            id: "US-KS",
            name: "US-KS",
        },
        {
            id: "US-KY",
            name: "US-KY",
        },
        {
            id: "US-LA",
            name: "US-LA",
        },
        {
            id: "US-ME",
            name: "US-ME",
        },
        {
            id: "US-MD",
            name: "US-MD",
        },
        {
            id: "US-MA",
            name: "US-MA",
        },
        {
            id: "US-MI",
            name: "US-MI",
        },
        {
            id: "US-MN",
            name: "US-MN",
        },
        {
            id: "US-MS",
            name: "US-MS",
        },
        {
            id: "US-MO",
            name: "US-MO",
        },
        {
            id: "US-MT",
            name: "US-MT",
        },
        {
            id: "US-NE",
            name: "US-NE",
        },
        {
            id: "US-NV",
            name: "US-NV",
        },
        {
            id: "US-NH",
            name: "US-NH",
        },
        {
            id: "US-NJ",
            name: "US-NJ",
        },
        {
            id: "US-NM",
            name: "US-NM",
        },
        {
            id: "US-NY",
            name: "US-NY",
        },
        {
            id: "US-NC",
            name: "US-NC",
        },
        {
            id: "US-ND",
            name: "US-ND",
        },
        {
            id: "US-OH",
            name: "US-OH",
        },
        {
            id: "US-OK",
            name: "US-OK",
        },
        {
            id: "US-OR",
            name: "US-OR",
        },
        {
            id: "US-PA",
            name: "US-PA",
        },
        {
            id: "US-RI",
            name: "US-RI",
        },
        {
            id: "US-SC",
            name: "US-SC",
        },
        {
            id: "US-SD",
            name: "US-SD",
        },
        {
            id: "US-TN",
            name: "US-TN",
        },
        {
            id: "US-TX",
            name: "US-TX",
        },
        {
            id: "US-UT",
            name: "US-UT",
        },
        {
            id: "US-VT",
            name: "US-VT",
        },
        {
            id: "US-VA",
            name: "US-VA",
        },
        {
            id: "US-WA",
            name: "US-WA",
        },
        {
            id: "US-WV",
            name: "US-WV",
        },
        {
            id: "US-WI",
            name: "US-WI",
        },
        {
            id: "US-WY",
            name: "US-WY",
        }
    ];


    return states;
}

export const getProductTypesOptions = () => {
    var types = [
        { name: 'Canoja Verify', id: 1 },
        { name: 'Canoja Verify API', id: 2 },
        { name: 'Canoja Verify Premium Plan', id: 3 },
        { name: 'Canoja Verify Enterprise Plan', id: 4 },
        { name: 'Canoja Verify Basic Plan', id: 5 },
    ];
    return types;
}

export const getEmail = async (data) => {
    return new Promise(async (resolve) => {
        let idArray = []

        for (let i = 0; i < data.length; i++) {
            const element = data[i].customerProfileId
            if (element) {
                idArray.push(element)
            }
        }
        if (idArray) {
            let body = {
                userId: idArray
            }
            let response = await API.post('PaymentGatewayAPI', '/paymentgateway/user/batchById', { body })
            if (response.success) {
                resolve(response.result)
            } else {
                console.log(response.err)
                resolve(false)
            }
        } else {
            resolve(false)
        }
    })
}

