/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCity = /* GraphQL */ `
  subscription OnCreateCity {
    onCreateCity {
      id
      name
      code
      active
    }
  }
`;
export const onCreateCountry = /* GraphQL */ `
  subscription OnCreateCountry {
    onCreateCountry {
      id
      name
      code
      active
    }
  }
`;
export const onCreateFeature = /* GraphQL */ `
  subscription OnCreateFeature {
    onCreateFeature {
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
export const onCreateGeneralSetting = /* GraphQL */ `
  subscription OnCreateGeneralSetting {
    onCreateGeneralSetting {
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
export const onCreateCustomerCustomQuery = /* GraphQL */ `
  subscription OnCreateCustomerCustomQuery {
    onCreateCustomerCustomQuery {
      id
      userId
      query
      createdAt
      name
      filter
    }
  }
`;
export const onCreateLicenseCategory = /* GraphQL */ `
  subscription OnCreateLicenseCategory {
    onCreateLicenseCategory {
      id
      name
      active
    }
  }
`;
export const onCreateLicenseInformation = /* GraphQL */ `
  subscription OnCreateLicenseInformation {
    onCreateLicenseInformation {
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
export const onCreateLicenseMainFilterList = /* GraphQL */ `
  subscription OnCreateLicenseMainFilterList {
    onCreateLicenseMainFilterList {
      id
      filterOrder
      name
      filter
      active
    }
  }
`;
export const onCreateLicenseStatus = /* GraphQL */ `
  subscription OnCreateLicenseStatus {
    onCreateLicenseStatus {
      id
      name
      active
    }
  }
`;
export const onCreateNote = /* GraphQL */ `
  subscription OnCreateNote {
    onCreateNote {
      id
      notes
    }
  }
`;
export const onCreatePendingReport = /* GraphQL */ `
  subscription OnCreatePendingReport {
    onCreatePendingReport {
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
export const onCreatePurchaseReport = /* GraphQL */ `
  subscription OnCreatePurchaseReport {
    onCreatePurchaseReport {
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
export const onCreateState = /* GraphQL */ `
  subscription OnCreateState {
    onCreateState {
      id
      name
      abbreviation
      active
    }
  }
`;
export const onCreateSubscriptionPlan = /* GraphQL */ `
  subscription OnCreateSubscriptionPlan {
    onCreateSubscriptionPlan {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onCreatePricing = /* GraphQL */ `
  subscription OnCreatePricing {
    onCreatePricing {
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct {
    onCreateProduct {
      id
      name
      description
      createdAt
      updatedAt
      active
    }
  }
`;
export const onCreateCharge = /* GraphQL */ `
  subscription OnCreateCharge {
    onCreateCharge {
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
export const onCreateCanceledSubscription = /* GraphQL */ `
  subscription OnCreateCanceledSubscription {
    onCreateCanceledSubscription {
      id
      customerProfileId
      subscriptionId
      isCancelApplied
      isCanceled
    }
  }
`;
export const onCreateCoupon = /* GraphQL */ `
  subscription OnCreateCoupon {
    onCreateCoupon {
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
