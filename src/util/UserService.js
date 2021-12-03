import AWS from 'aws-sdk'
import { REACT_APP_USER_POOL_ID, REACT_APP_REGION, REACT_APP_ACCESS_KEY_ID, REACT_APP_SECRET_ACCESS_KEY } from '../config/aws-config';

export const GetAllUser = () => {

    var params = {
        UserPoolId: REACT_APP_USER_POOL_ID
    };

    return new Promise((resolve, reject) => {
        AWS.config.update({ region: REACT_APP_REGION, 'accessKeyId': REACT_APP_ACCESS_KEY_ID, 'secretAccessKey': REACT_APP_SECRET_ACCESS_KEY });
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        cognitoidentityserviceprovider.listUsers(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                console.log("data", data);
                resolve(data)
            }
        })
    })
}

export const EnableUser = (username) => {
    var params = {
        Username: username,
        UserPoolId: REACT_APP_USER_POOL_ID
    }

    return new Promise((resolve, reject) => {
        AWS.config.update({ region: REACT_APP_REGION, 'accessKeyId': REACT_APP_ACCESS_KEY_ID, 'secretAccessKey': REACT_APP_SECRET_ACCESS_KEY });
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        cognitoidentityserviceprovider.adminEnableUser(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                console.log("data", data);
                resolve(data)
            }
        })
    })
}


export const DisableUser = (username) => {
    var params = {
        Username: username,
        UserPoolId: REACT_APP_USER_POOL_ID
    }

    return new Promise((resolve, reject) => {
        AWS.config.update({ region: REACT_APP_REGION, 'accessKeyId': REACT_APP_ACCESS_KEY_ID, 'secretAccessKey': REACT_APP_SECRET_ACCESS_KEY });
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        cognitoidentityserviceprovider.adminDisableUser(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                console.log("data", data);
                resolve(data)
            }
        })
    })
}

export const UpdateUserData = (attr, username) => {
    var params = {
        UserAttributes: attr,
        Username: username,
        UserPoolId: REACT_APP_USER_POOL_ID
    }

    return new Promise((resolve, reject) => {
        AWS.config.update({ region: REACT_APP_REGION, 'accessKeyId': REACT_APP_ACCESS_KEY_ID, 'secretAccessKey': REACT_APP_SECRET_ACCESS_KEY });
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        cognitoidentityserviceprovider.adminUpdateUserAttributes(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                console.log("data", data);
                resolve(data)
            }
        })
    })
}


export const UpdateUserPassword = (password, username) => {
    var params = {
        Password: password,
        Username: username,
        Permanent: true,
        UserPoolId: REACT_APP_USER_POOL_ID
    }

    return new Promise((resolve, reject) => {
        AWS.config.update({ region: REACT_APP_REGION, 'accessKeyId': REACT_APP_ACCESS_KEY_ID, 'secretAccessKey': REACT_APP_SECRET_ACCESS_KEY });
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        cognitoidentityserviceprovider.adminSetUserPassword(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                console.log("data", data);
                resolve(data)
            }
        })
    })
}



export const GetGroupsOfUser = (username) => {

    var params = {
        Username: username,
        UserPoolId: REACT_APP_USER_POOL_ID,
    };

    return new Promise((resolve, reject) => {
        AWS.config.update({ region: REACT_APP_REGION, 'accessKeyId': REACT_APP_ACCESS_KEY_ID, 'secretAccessKey': REACT_APP_SECRET_ACCESS_KEY });
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        cognitoidentityserviceprovider.adminListGroupsForUser(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                console.log("data", data);
                resolve(data)
            }
        })
    })
}