
/**
 * 
 * @param {*} data 
 * @param {*} total 
 * @param {*} page 
 * @param {*} limit 
 * @returns 
 */
const getPagingData = (data, total, page, limit) => {
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(total / limit);

    return { total, data, totalPages, currentPage };
};

/**
 * 
 * @param {*} page 
 * @param {*} size 
 * @returns 
 */
const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? (page * limit) - limit : 0;

    return { limit, offset };
};



let utils = {
    getPagingData,
    getPagination
}


module.exports = utils
