/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCity = /* GraphQL */ `
  query GetCity($id: Int!) {
    getCity(id: $id) {
      id
      name
      code
      active
    }
  }
`;
export const listCitys = /* GraphQL */ `
  query ListCitys {
    listCitys {
      id
      name
      code
      active
    }
  }
`;
export const getCountry = /* GraphQL */ `
  query GetCountry($id: Int!) {
    getCountry(id: $id) {
      id
      name
      code
      active
    }
  }
`;
export const listCountrys = /* GraphQL */ `
  query ListCountrys {
    listCountrys {
      id
      name
      code
      active
    }
  }
`;
export const getCustomerCustomQuery = /* GraphQL */ `
  query GetCustomerCustomQuery($id: Int!) {
    getCustomerCustomQuery(id: $id) {
      id
      userId
      query
      createdAt
      name
      filter
    }
  }
`;
export const listCustomerCustomQuerys = /* GraphQL */ `
  query ListCustomerCustomQuerys {
    listCustomerCustomQuerys {
      id
      userId
      query
      createdAt
      name
      filter
    }
  }
`;
export const getFeature = /* GraphQL */ `
  query GetFeature($id: Int!) {
    getFeature(id: $id) {
      id
      name
      subscriptionPlanId
      isAllowNameSearch
      isAllowLicenseNumberSearch
      isAllowLicenseCategorySearch
      isAllowCitySearch
      isAllowStateSearch
      isAllowCountrySearch
      isAllowLicenseTypeSearch
      isAllowLicenseStatusSearch
      isAllowLicenseOwnerSearch
      isAllowLicenseIssueDateSearch
      isAllowLicenseExpireDateSearch
      isAllowDBASearch
      isAllowCountySearch
      isAllowPostalCodeSearch
      isAllowPhoneNumberSearch
      isAllowEmailSearch
      isAllowLastUpdatedDateSearch
      active
    }
  }
`;
export const listFeatures = /* GraphQL */ `
  query ListFeatures {
    listFeatures {
      id
      name
      subscriptionPlanId
      isAllowNameSearch
      isAllowLicenseNumberSearch
      isAllowLicenseCategorySearch
      isAllowCitySearch
      isAllowStateSearch
      isAllowCountrySearch
      isAllowLicenseTypeSearch
      isAllowLicenseStatusSearch
      isAllowLicenseOwnerSearch
      isAllowLicenseIssueDateSearch
      isAllowLicenseExpireDateSearch
      isAllowDBASearch
      isAllowCountySearch
      isAllowPostalCodeSearch
      isAllowPhoneNumberSearch
      isAllowEmailSearch
      isAllowLastUpdatedDateSearch
      active
    }
  }
`;
export const getGeneralSetting = /* GraphQL */ `
  query GetGeneralSetting($id: Int!) {
    getGeneralSetting(id: $id) {
      id
      mapCardUpdateDate
      copyrightText
      signupAgreementDetails
      subscriptionAgreementDetails
      supportPageDetails
      dashboardPageDetails
    }
  }
`;
export const listGeneralSettings = /* GraphQL */ `
  query ListGeneralSettings {
    listGeneralSettings {
      id
      mapCardUpdateDate
      copyrightText
      signupAgreementDetails
      subscriptionAgreementDetails
      supportPageDetails
      dashboardPageDetails
    }
  }
`;
export const getLicenseCategory = /* GraphQL */ `
  query GetLicenseCategory($id: Int!) {
    getLicenseCategory(id: $id) {
      id
      name
      active
    }
  }
`;
export const listLicenseCategorys = /* GraphQL */ `
  query ListLicenseCategorys {
    listLicenseCategorys {
      id
      name
      active
    }
  }
`;
export const getLicenseInformation = /* GraphQL */ `
  query GetLicenseInformation($id: Int!) {
    getLicenseInformation(id: $id) {
      id
      csvRowUniqueKey
      licenseNumber
      licenseCategory
      licenseType
      licenseStatus
      licenseIssueDate
      licenseExpireDate
      licenseOwner
      retail
      medical
      businessLegalName
      businessDoingBusinessAs
      businessAddress1
      businessAddress2
      businessCity
      businessCounty
      businessState
      businessZipcode
      businessCountry
      businessPhoneNumber
      businessEmailAddress
      businessStructure
      last_updated
      created_at
      updated_at
      active
    }
  }
`;
export const listLicenseInformations = /* GraphQL */ `
  query ListLicenseInformations {
    listLicenseInformations {
      id
      csvRowUniqueKey
      licenseNumber
      licenseCategory
      licenseType
      licenseStatus
      licenseIssueDate
      licenseExpireDate
      licenseOwner
      retail
      medical
      businessLegalName
      businessDoingBusinessAs
      businessAddress1
      businessAddress2
      businessCity
      businessCounty
      businessState
      businessZipcode
      businessCountry
      businessPhoneNumber
      businessEmailAddress
      businessStructure
      last_updated
      created_at
      updated_at
      active
    }
  }
`;
export const getLicenseMainFilterList = /* GraphQL */ `
  query GetLicenseMainFilterList($id: Int!) {
    getLicenseMainFilterList(id: $id) {
      id
      filterOrder
      name
      filter
      active
    }
  }
`;
export const listLicenseMainFilterLists = /* GraphQL */ `
  query ListLicenseMainFilterLists {
    listLicenseMainFilterLists {
      id
      filterOrder
      name
      filter
      active
    }
  }
`;
export const getLicenseStatus = /* GraphQL */ `
  query GetLicenseStatus($id: Int!) {
    getLicenseStatus(id: $id) {
      id
      name
      active
    }
  }
`;
export const listLicenseStatuss = /* GraphQL */ `
  query ListLicenseStatuss {
    listLicenseStatuss {
      id
      name
      active
    }
  }
`;
export const getNote = /* GraphQL */ `
  query GetNote($id: Int!) {
    getNote(id: $id) {
      id
      notes
    }
  }
`;
export const listNotes = /* GraphQL */ `
  query ListNotes {
    listNotes {
      id
      notes
    }
  }
`;
export const getPendingReport = /* GraphQL */ `
  query GetPendingReport($id: Int!) {
    getPendingReport(id: $id) {
      id
      name
      username
      purchaseDate
      reportType
      amount
      promotionCode
      totalAmount
      discount
      reportName
      recordCost
      reportDescription
      filter
      purchaseType
      title
      sorter
      count
      pageTotal
      downloadStatus
      createdAt
      uniqueId
      isFrom
    }
  }
`;
export const listPendingReports = /* GraphQL */ `
  query ListPendingReports {
    listPendingReports {
      id
      name
      username
      purchaseDate
      reportType
      amount
      promotionCode
      totalAmount
      discount
      reportName
      recordCost
      reportDescription
      filter
      purchaseType
      title
      sorter
      count
      pageTotal
      downloadStatus
      createdAt
      uniqueId
      isFrom
    }
  }
`;
export const getPurchaseReport = /* GraphQL */ `
  query GetPurchaseReport($id: Int!) {
    getPurchaseReport(id: $id) {
      id
      username
      reportType
      reportData
      datePurchase
      expirationDate
      csvFileName
      pdfFileName
      reportname
      description
      recordCost
      promotionCode
      totalAmount
      discount
      amount
      isFrom
      filter
      sorter
    }
  }
`;
export const listPurchaseReports = /* GraphQL */ `
  query ListPurchaseReports {
    listPurchaseReports {
      id
      username
      reportType
      reportData
      datePurchase
      expirationDate
      csvFileName
      pdfFileName
      reportname
      description
      recordCost
      promotionCode
      totalAmount
      discount
      amount
      isFrom
      filter
      sorter
    }
  }
`;
export const getState = /* GraphQL */ `
  query GetState($id: Int!) {
    getState(id: $id) {
      id
      name
      abbreviation
      active
    }
  }
`;
export const listStates = /* GraphQL */ `
  query ListStates {
    listStates {
      id
      name
      abbreviation
      active
    }
  }
`;
export const getSubscriptionPlan = /* GraphQL */ `
  query GetSubscriptionPlan($id: Int!) {
    getSubscriptionPlan(id: $id) {
      id
      name
      planOrder
      amountPerMonth
      amountPerYear
      description1
      description2
      priceIdMonth
      priceIdYear
      planDetails
      planInterval
      planType
      amountPerRecord
      active
    }
  }
`;
export const listSubscriptionPlans = /* GraphQL */ `
  query ListSubscriptionPlans {
    listSubscriptionPlans {
      id
      name
      planOrder
      amountPerMonth
      amountPerYear
      description1
      description2
      priceIdMonth
      priceIdYear
      planDetails
      planInterval
      planType
      amountPerRecord
      active
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: Int!) {
    getUser(id: $id) {
      id
      customerProfileId
      email
      accessKey
      active
      discount
      planType
      createdAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers {
    listUsers {
      id
      customerProfileId
      email
      accessKey
      active
      discount
      planType
      createdAt
    }
  }
`;
export const getUserByEmail = /* GraphQL */ `
  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      id
      customerProfileId
      email
      accessKey
      active
      discount
      planType
      createdAt
    }
  }
`;
export const countLicenseInformationsByCategory = /* GraphQL */ `
  query CountLicenseInformationsByCategory($filter: String) {
    countLicenseInformationsByCategory(filter: $filter) {
      total
    }
  }
`;
export const listPendingReportsByDownloadStatus = /* GraphQL */ `
  query ListPendingReportsByDownloadStatus($downloadStatus: String) {
    listPendingReportsByDownloadStatus(downloadStatus: $downloadStatus) {
      items {
        id
        name
        username
        purchaseDate
        reportType
        amount
        promotionCode
        totalAmount
        discount
        reportName
        recordCost
        reportDescription
        filter
        purchaseType
        title
        sorter
        count
        pageTotal
        downloadStatus
        createdAt
        uniqueId
        isFrom
      }
    }
  }
`;
export const listSubscriptionPlanByPlanTypeAndActive = /* GraphQL */ `
  query ListSubscriptionPlanByPlanTypeAndActive(
    $planType: String
    $active: String
  ) {
    listSubscriptionPlanByPlanTypeAndActive(
      planType: $planType
      active: $active
    ) {
      items {
        id
        name
        planOrder
        amountPerMonth
        amountPerYear
        description1
        description2
        priceIdMonth
        priceIdYear
        planDetails
        planInterval
        planType
        amountPerRecord
        active
      }
    }
  }
`;
export const listFeatureByPlanTypeAndActive = /* GraphQL */ `
  query ListFeatureByPlanTypeAndActive(
    $subscriptionPlanId: String
    $active: String
  ) {
    listFeatureByPlanTypeAndActive(
      subscriptionPlanId: $subscriptionPlanId
      active: $active
    ) {
      items {
        id
        name
        subscriptionPlanId
        isAllowNameSearch
        isAllowLicenseNumberSearch
        isAllowLicenseCategorySearch
        isAllowCitySearch
        isAllowStateSearch
        isAllowCountrySearch
        isAllowLicenseTypeSearch
        isAllowLicenseStatusSearch
        isAllowLicenseOwnerSearch
        isAllowLicenseIssueDateSearch
        isAllowLicenseExpireDateSearch
        isAllowDBASearch
        isAllowCountySearch
        isAllowPostalCodeSearch
        isAllowPhoneNumberSearch
        isAllowEmailSearch
        isAllowLastUpdatedDateSearch
        active
      }
    }
  }
`;
export const listLicenseInformationsPagination = /* GraphQL */ `
  query ListLicenseInformationsPagination(
    $filter: String
    $orderBy: String
    $page: Int
    $size: Int
  ) {
    listLicenseInformationsPagination(
      filter: $filter
      orderBy: $orderBy
      page: $page
      size: $size
    ) {
      items {
        id
        csvRowUniqueKey
        licenseNumber
        licenseCategory
        licenseType
        licenseStatus
        licenseIssueDate
        licenseExpireDate
        licenseOwner
        retail
        medical
        businessLegalName
        businessDoingBusinessAs
        businessAddress1
        businessAddress2
        businessCity
        businessCounty
        businessState
        businessZipcode
        businessCountry
        businessPhoneNumber
        businessEmailAddress
        businessStructure
        last_updated
        created_at
        updated_at
        active
      }
      total
      total_pages
    }
  }
`;
export const listPurchaseReportPagination = /* GraphQL */ `
  query ListPurchaseReportPagination(
    $filter: String
    $orderBy: String
    $page: Int
    $size: Int
  ) {
    listPurchaseReportPagination(
      filter: $filter
      orderBy: $orderBy
      page: $page
      size: $size
    ) {
      items {
        id
        username
        reportType
        reportData
        datePurchase
        expirationDate
        csvFileName
        pdfFileName
        reportname
        description
        recordCost
        promotionCode
        totalAmount
        discount
        amount
        isFrom
        filter
        sorter
      }
      total
      total_pages
    }
  }
`;
export const listPendingReportPagination = /* GraphQL */ `
  query ListPendingReportPagination(
    $filter: String
    $orderBy: String
    $page: Int
    $size: Int
  ) {
    listPendingReportPagination(
      filter: $filter
      orderBy: $orderBy
      page: $page
      size: $size
    ) {
      items {
        id
        name
        username
        purchaseDate
        reportType
        amount
        promotionCode
        totalAmount
        discount
        reportName
        recordCost
        reportDescription
        filter
        purchaseType
        title
        sorter
        count
        pageTotal
        downloadStatus
        createdAt
        uniqueId
        isFrom
      }
      total
      total_pages
    }
  }
`;
export const listUserPagination = /* GraphQL */ `
  query ListUserPagination(
    $filter: String
    $orderBy: String
    $page: Int
    $size: Int
  ) {
    listUserPagination(
      filter: $filter
      orderBy: $orderBy
      page: $page
      size: $size
    ) {
      items {
        id
        customerProfileId
        email
        accessKey
        active
        discount
        planType
        createdAt
      }
      total
      total_pages
    }
  }
`;
export const listAllLicenseCategroy = /* GraphQL */ `
  query ListAllLicenseCategroy($filter: String) {
    listAllLicenseCategroy(filter: $filter) {
      items
    }
  }
`;
export const listAllLicenseStatus = /* GraphQL */ `
  query ListAllLicenseStatus($filter: String) {
    listAllLicenseStatus(filter: $filter) {
      items
    }
  }
`;
export const listAllLicenseType = /* GraphQL */ `
  query ListAllLicenseType($filter: String) {
    listAllLicenseType(filter: $filter) {
      items
    }
  }
`;
export const listAllBusinessCountry = /* GraphQL */ `
  query ListAllBusinessCountry($filter: String) {
    listAllBusinessCountry(filter: $filter) {
      items
    }
  }
`;
export const listAllBusinessState = /* GraphQL */ `
  query ListAllBusinessState($filter: String) {
    listAllBusinessState(filter: $filter) {
      items
    }
  }
`;
export const listAllBusinessStructure = /* GraphQL */ `
  query ListAllBusinessStructure($filter: String) {
    listAllBusinessStructure(filter: $filter) {
      items
    }
  }
`;
export const listAllCreatedAt = /* GraphQL */ `
  query ListAllCreatedAt($filter: String) {
    listAllCreatedAt(filter: $filter) {
      items
    }
  }
`;
export const listAllUpdatedAt = /* GraphQL */ `
  query ListAllUpdatedAt($filter: String) {
    listAllUpdatedAt(filter: $filter) {
      items
    }
  }
`;
export const listProductByProductType = /* GraphQL */ `
  query ListProductByProductType($productType: String) {
    listProductByProductType(productType: $productType) {
      items {
        id
        name
        description
        createdAt
        updatedAt
        active
      }
    }
  }
`;
export const listPricingByProductAndUsageType = /* GraphQL */ `
  query ListPricingByProductAndUsageType(
    $usageType: String
    $currency: String
    $intervalTime: String
    $productId: String
    $active: String
  ) {
    listPricingByProductAndUsageType(
      usageType: $usageType
      currency: $currency
      intervalTime: $intervalTime
      productId: $productId
      active: $active
    ) {
      items {
        id
        name
        description
        usageType
        currency
        intervalTime
        productId
        pricePerUnit
        createdAt
        updatedAt
        active
      }
    }
  }
`;
export const getPricing = /* GraphQL */ `
  query GetPricing($id: Int!) {
    getPricing(id: $id) {
      id
      name
      description
      usageType
      currency
      intervalTime
      productId
      pricePerUnit
      createdAt
      updatedAt
      active
    }
  }
`;
export const listPricings = /* GraphQL */ `
  query ListPricings {
    listPricings {
      id
      name
      description
      usageType
      currency
      intervalTime
      productId
      pricePerUnit
      createdAt
      updatedAt
      active
    }
  }
`;
export const getProduct = /* GraphQL */ `
  query GetProduct($id: Int!) {
    getProduct(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
      active
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts {
    listProducts {
      id
      name
      description
      createdAt
      updatedAt
      active
    }
  }
`;
export const getCharge = /* GraphQL */ `
  query GetCharge($id: Int!) {
    getCharge(id: $id) {
      id
      customerProfileId
      customerPaymentProfileId
      priceId
      description
      productName
      noOfRecordsFetch
      chargeAmount
      pricePerUnit
    }
  }
`;
export const listCharges = /* GraphQL */ `
  query ListCharges {
    listCharges {
      id
      customerProfileId
      customerPaymentProfileId
      priceId
      description
      productName
      noOfRecordsFetch
      chargeAmount
      pricePerUnit
    }
  }
`;
export const getCanceledSubscription = /* GraphQL */ `
  query GetCanceledSubscription($id: Int!) {
    getCanceledSubscription(id: $id) {
      id
      customerProfileId
      subscriptionId
      isCancelApplied
      isCanceled
    }
  }
`;
export const listCanceledSubscriptions = /* GraphQL */ `
  query ListCanceledSubscriptions {
    listCanceledSubscriptions {
      id
      customerProfileId
      subscriptionId
      isCancelApplied
      isCanceled
    }
  }
`;
export const listCanceledSubscriptionBySubscriptionId = /* GraphQL */ `
  query ListCanceledSubscriptionBySubscriptionId($subscriptionId: String) {
    listCanceledSubscriptionBySubscriptionId(subscriptionId: $subscriptionId) {
      items {
        id
        customerProfileId
        subscriptionId
        isCancelApplied
        isCanceled
      }
    }
  }
`;
export const getUserCredits = /* GraphQL */ `
  query GetUserCredits($id: Int!) {
    getUserCredits(id: $id) {
      id
      customerProfileId
      subscriptionId
      amount
      description
    }
  }
`;
export const listUserCredits = /* GraphQL */ `
  query ListUserCredits {
    listUserCredits {
      id
      customerProfileId
      subscriptionId
      amount
      description
    }
  }
`;
export const listUserCreditsByCustomerId = /* GraphQL */ `
  query ListUserCreditsByCustomerId($customerId: String) {
    listUserCreditsByCustomerId(customerId: $customerId) {
      items {
        id
        customerProfileId
        subscriptionId
        amount
        description
      }
    }
  }
`;
export const listUserByCustomerId = /* GraphQL */ `
  query ListUserByCustomerId($customerId: String) {
    listUserByCustomerId(customerId: $customerId) {
      items {
        id
        customerProfileId
        email
        accessKey
        active
        discount
        planType
        createdAt
      }
    }
  }
`;
export const listUserByEmail = /* GraphQL */ `
  query ListUserByEmail($email: String) {
    listUserByEmail(email: $email) {
      items {
        id
        customerProfileId
        email
        accessKey
        active
        discount
        planType
        createdAt
      }
    }
  }
`;
export const listUserByCustomerIdBatch = /* GraphQL */ `
  query ListUserByCustomerIdBatch($customerId: [String]) {
    listUserByCustomerIdBatch(customerId: $customerId) {
      items {
        id
        customerProfileId
        email
        accessKey
        active
        discount
        planType
        createdAt
      }
    }
  }
`;
export const getCoupon = /* GraphQL */ `
  query GetCoupon($id: Int!) {
    getCoupon(id: $id) {
      id
      couponType
      name
      code
      percentageOff
      amountOff
      currency
      redeemBy
      duration
      durationInMonth
      couponApplyFor
      couponAttachTo
      active
    }
  }
`;
export const listCoupons = /* GraphQL */ `
  query ListCoupons {
    listCoupons {
      id
      couponType
      name
      code
      percentageOff
      amountOff
      currency
      redeemBy
      duration
      durationInMonth
      couponApplyFor
      couponAttachTo
      active
    }
  }
`;
export const listCouponByCode = /* GraphQL */ `
  query ListCouponByCode($code: String, $active: String) {
    listCouponByCode(code: $code, active: $active) {
      items {
        id
        couponType
        name
        code
        percentageOff
        amountOff
        currency
        redeemBy
        duration
        durationInMonth
        couponApplyFor
        couponAttachTo
        active
      }
    }
  }
`;
export const listCouponsPagination = /* GraphQL */ `
  query ListCouponsPagination($page: Int, $size: Int) {
    listCouponsPagination(page: $page, size: $size) {
      items {
        id
        couponType
        name
        code
        percentageOff
        amountOff
        currency
        redeemBy
        duration
        durationInMonth
        couponApplyFor
        couponAttachTo
        active
      }
      total
      total_pages
    }
  }
`;
export const listEnvVariables = /* GraphQL */ `
  query ListEnvVariables {
    listEnvVariables {
      id
      name
      value
    }
  }
`;
export const getEnvVariables = /* GraphQL */ `
  query GetEnvVariables($id: Int!) {
    getEnvVariables(id: $id) {
      id
      name
      value
    }
  }
`;
export const searchEnvVariables = /* GraphQL */ `
  query SearchEnvVariables($EnvVariablesListQuery: EnvVariablesListQuery!) {
    searchEnvVariables(EnvVariablesListQuery: $EnvVariablesListQuery) {
      items {
        id
        name
        value
      }
    }
  }
`;
export const searchEmailTemplate = /* GraphQL */ `
  query SearchEmailTemplate($event: String!) {
    searchEmailTemplate(event: $event) {
      id
      subject
      html
      design
    }
  }
`;
