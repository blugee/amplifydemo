import { API, graphqlOperation } from "aws-amplify";
import { listUserPagination } from "../../graphql/queries";


export const getCSVRowUniqueKey = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export const getAllAuthorizeUsers = async () => {
    return new Promise(async (resolve) => {
        let data = [];
        let pageTotal = 1000;

        let total = pageTotal % 1000 === 0 ? parseInt(pageTotal / 1000) : parseInt(pageTotal / 1000) + 1;

        var addData = function (items, count) {
            data = data.concat(items)
            total = count
        };

        for (let i = 0; i < total; i++) {
            let body = {
                page: i + 1,
                size: 1000
            }
            await API.graphql(graphqlOperation(listUserPagination, body))
                .then(async (result) => {
                    result = result.data.listUserPagination;
                    let total = result.total % 1000 === 0 ? parseInt(result.total / 1000) : parseInt(result.total / 1000) + 1;
                    await addData(result.items, total)
                }).catch((error) => {
                    resolve(false)
                })
        }
        if (data && data.length >= 0) {
            resolve(data);
        } else {
            resolve(false)
        }
    })
}
