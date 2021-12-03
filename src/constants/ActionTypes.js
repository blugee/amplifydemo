// Customizer const
export const TOGGLE_COLLAPSED_NAV = 'TOGGLE_COLLAPSE_MENU';
export const WINDOW_WIDTH = 'WINDOW-WIDTH';
export const SWITCH_LANGUAGE = 'SWITCH-LANGUAGE';

//Contact Module const
export const FETCH_START = 'fetch_start';
export const FETCH_SUCCESS = 'fetch_success';
export const FETCH_ERROR = 'fetch_error';
export const SHOW_MESSAGE = 'SHOW_MESSAGE';
export const HIDE_MESSAGE = 'HIDE_MESSAGE';
export const ON_SHOW_LOADER = 'ON_SHOW_LOADER';
export const ON_HIDE_LOADER = 'ON_HIDE_LOADER';

//Auth const
export const SIGNUP_USER = 'SIGNUP_USER';
export const SIGNUP_USER_SUCCESS = 'SIGNUP_USER_SUCCESS';
export const SIGNIN_GOOGLE_USER = 'SIGNIN_GOOGLE_USER';
export const SIGNIN_GOOGLE_USER_SUCCESS = 'SIGNIN_GOOGLE_USER_SUCCESS';
export const SIGNIN_FACEBOOK_USER = 'SIGNIN_FACEBOOK_USER';
export const SIGNIN_FACEBOOK_USER_SUCCESS = 'SIGNIN_FACEBOOK_USER_SUCCESS';
export const SIGNIN_TWITTER_USER = 'SIGNIN_TWITTER_USER';
export const SIGNIN_TWITTER_USER_SUCCESS = 'SIGNIN_TWITTER_USER_SUCCESS';
export const SIGNIN_GITHUB_USER = 'SIGNIN_GITHUB_USER';
export const SIGNIN_GITHUB_USER_SUCCESS = 'signin_github_user_success';
export const SIGNIN_USER = 'SIGNIN_USER';
export const SIGNIN_USER_SUCCESS = 'SIGNIN_USER_SUCCESS';
export const SIGNOUT_USER = 'SIGNOUT_USER';
export const SIGNOUT_USER_SUCCESS = 'SIGNOUT_USER_SUCCESS';
export const INIT_URL = 'INIT_URL';
export const SIGNIN_USER_SUCCESS_DATA = 'SIGNIN_USER_SUCCESS_DATA';
export const SIGNOUT_USER_SUCCESS_DATA = 'SIGNOUT_USER_SUCCESS_DATA';
export const SET_TIMEOUT='SET_TIMEOUT';

//Sticky
export const GET_STICKY = 'GET_STICKY';
export const NOTES_UPDATE='NOTES_UPDATE';
export const FETCH_ALL_NOTES_SUCCESS='FETCH_ALL_NOTES_SUCCESS';
export const UPDATE_ALL_NOTES_SUCCESS='UPDATE_ALL_NOTES_SUCCESS';

//Contact
export const GET_All_CONTACT_SUCCESS = 'GET_All_CONTACT_SUCCESS';
export const ON_ADD_CONTACT_SUCCESS = 'ON_ADD_CONTACT_SUCCESS';
export const UPDATE_CONTACT_SUCCESS='UPDATE_CONTACT_SUCCESS';
export const DELETE_CONTACT_SUCCESS='DELETE_CONTACT_SUCCESS';
export const LICENCE_NUMBER='LICENCE_NUMBER';
export const RESET_PURCHASE='RESET_PURCHASE';
export const DO_PURCHASE='DO_PURCHASE';
export const IS_PURCHASE='IS_PURCHASE';
export const SHOW_MODAL = 'SHOW_MODAL';

export const SAVE_FILTER = 'SAVE_FILTER';
export const SAVE_SORTER = 'SAVE_SORTER';
export const SAVE_FILTERS = 'SAVE_FILTERS';
export const RESET_FILTERS = 'RESET_FILTERS';

export const SORTERS = {
  "License Number": "licenseNumber",
  "License Category": "licenseCategory",
  "License Type": "licenseType",
  "License Status": "licenseStatus",
  "License Issue Date": "licenseIssueDate",
  "License Expire Date": "licenseExpireDate",
  "License Owner": "licenseOwner",
  "Retail": "retail",
  "Medical": "medical",
  "Business Name": "businessLegal_name",
  "Doing Business As": "businessDoingBusinessAs",
  "Business Address1": "businessAddress1",
  "Business Address2": "businessAddress2",
  "City": "businessCity",
  "County": "businessCounty",
  "State": "businessState",
  "Zipcode": "businessZipcode",
  "Country": "businessCountry",
  "Business Phone Number": "businessPhoneNumber",
  "Business Email": "businessEmailAddress",
  "Business Structure": "businessStructure",
}

export const COLUMNS = [
  {
    title: 'License Number',  
    dataIndex: 'number',
    sorter: (a, b) => a.number.localeCompare(b.number)
  },
  {
    title: 'Business Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: 'License Category',
    dataIndex: 'category',
    sorter: (a, b) => a.category.localeCompare(b.category),
    filters: [],
    onFilter: (value, record) => record.category.includes(value),
  },
  {
    title: 'License Status',
    dataIndex: 'status',
    sorter: (a, b) => a.status.localeCompare(b.status),
    filters: [],
    onFilter: (value, record) => record.status.includes(value),
  },
  {
    title: 'City',
    dataIndex: 'city',
    sorter: (a, b) => a.city.localeCompare(b.city)
  },
  {
    title: 'State',
    dataIndex: 'state',
    sorter: (a, b) => a.state.localeCompare(b.state),
  },
  {
    title: 'Country',
    dataIndex: 'country',
    sorter: (a, b) => a.country.localeCompare(b.country)
  },
];

export const PURCHAS_ECOLUMN = [
  {
    title: 'License Number',  
    dataIndex: 'number',
  },
  {
    title: 'Business Name',
    dataIndex: 'name',
  },
  {
    title: 'Business Email',
    dataIndex: 'email',
  },
  {
    title: 'Business Phone Number',
    dataIndex: 'phone',
  },
  {
    title: 'Business Address 1',
    dataIndex: 'address1',
  },
  {
    title: 'Business Address 2',
    dataIndex: 'address2',
  },
  {
    title: 'Business Structure',
    dataIndex: 'structure',
  },
  {
    title: 'Doing Business As',
    dataIndex: 'business_doing_business_as',
  },
  {
    title: 'License Category',
    dataIndex: 'category',
  },
  {
    title: 'License Status',
    dataIndex: 'status',
  },
  {
    title: 'License Expire Date',
    dataIndex: 'expire',
  },
  {
    title: 'License Issue Date',
    dataIndex: 'issue',
  },
  {
    title: 'License Owner',
    dataIndex: 'owner',
  },
  {
    title: 'License Type',
    dataIndex: 'type',
  },
  {
    title: 'City',
    dataIndex: 'city',
  },
  {
    title: 'State',
    dataIndex: 'state',
  },
  {
    title: 'Country',
    dataIndex: 'country',
  },
  {
    title: 'Medical',
    dataIndex: 'medical',
  },
  {
    title: 'Retail',
    dataIndex: 'retail',
  },
];

