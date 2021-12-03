
const filterByIsEqual = (key, value) => {
    return `${key} = '${value}'`
}

const filterByIn = (key, value) => {
    let list = ''
    for (let i = 0; i < value.length; i++) {
        if (value.length - 1 === i) {
            list = `${list} '${value[i]}'`
        } else {
            list = `${list} '${value[i]}',`
        }
    }
    return `${key} in (${list})`
}

const filterByIsGreaterOrEqual = (key, value) => {
    return `${key} >= '${value}'`
}

const filterByIsLessOrEqual = (key, value) => {
    return `${key} <= '${value}'`
}

const filterByLike = (key, value) => {
    return `${key} LIKE '%${value}%'`
}


const getFilters = async (data) => {

    return new Promise(resolve => {
        var filter = '';
        for (let index = 0; index < data.length; index++) {
            var element = data[index];
            for (let [key, value] of Object.entries(element)) {
                if (key !== 'connector' && key !== 'operator') {
                    let connector = 'where'
                    if (element['connector'] && index > 0) {
                        connector = element['connector']
                    } else if (index > 0) {
                        connector = 'and'
                    }

                    if (!Array.isArray(value)) {
                        if (value) {
                            if (element['operator'] === 'LIKE') {
                                filter += connector + " " + key + " LIKE '%" + value + "%' ";
                            } else if (element['operator'] === 'NOT EQUAL') {
                                filter += connector + " " + key + "!='" + value + "' ";
                            } else {
                                filter += connector + " " + key + "='" + value + "' ";
                            }
                        }

                    } else {
                        let connector = 'where'
                        if (element['connector'] && index > 0) {
                            connector = element['connector']
                        } else if (index > 0) {
                            connector = 'and'
                        }
                        let listFilter = filterByIn(key, value)

                        filter += connector + " " + listFilter + " ";

                    }
                }
            }
        }
        resolve(filter)
    })
}

const getOrder = async (name, order) => {

    return new Promise(resolve => {
        var sorter = '';
        if (name && order) {
            sorter = ` order by ${name} ${order}`
        }

        resolve(sorter)
    })
}



const Filters = {
    filterByIsEqual,
    filterByIn,
    filterByIsGreaterOrEqual,
    filterByIsLessOrEqual,
    getFilters,
    getOrder,
    filterByLike
}


module.exports = Filters