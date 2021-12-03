/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const deleteCity = /* GraphQL */ `
  mutation DeleteCity($id: Int!) {
    deleteCity(id: $id) {
      id
      name
      code
      active
    }
  }
`;
export const createCity = /* GraphQL */ `
  mutation CreateCity($createCityInput: CreateCityInput!) {
    createCity(createCityInput: $createCityInput) {
      id
      name
      code
      active
    }
  }
`;
export const updateCity = /* GraphQL */ `
  mutation UpdateCity($updateCityInput: UpdateCityInput!) {
    updateCity(updateCityInput: $updateCityInput) {
      id
      name
      code
      active
    }
  }
`;
export const deleteCountry = /* GraphQL */ `
  mutation DeleteCountry($id: Int!) {
    deleteCountry(id: $id) {
      id
      name
      code
      active
    }
  }
`;
export const createCountry = /* GraphQL */ `
  mutation CreateCountry($createCountryInput: CreateCountryInput!) {
    createCountry(createCountryInput: $createCountryInput) {
      id
      name
      code
      active
    }
  }
`;
export const updateCountry = /* GraphQL */ `
  mutation UpdateCountry($updateCountryInput: UpdateCountryInput!) {
    updateCountry(updateCountryInput: $updateCountryInput) {
      id
      name
      code
      active
    }
  }
`;
export const deleteFeature = /* GraphQL */ `
  mutation DeleteFeature($id: Int!) {
    deleteFeature(id: $id) {
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
export const createFeature = /* GraphQL */ `
  mutation CreateFeature($createFeatureInput: CreateFeatureInput!) {
    createFeature(createFeatureInput: $createFeatureInput) {
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
export const updateFeature = /* GraphQL */ `
  mutation UpdateFeature($updateFeatureInput: UpdateFeatureInput!) {
    updateFeature(updateFeatureInput: $updateFeatureInput) {
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
export const deleteGeneralSetting = /* GraphQL */ `
  mutation DeleteGeneralSetting($id: Int!) {
    deleteGeneralSetting(id: $id) {
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
export const createGeneralSetting = /* GraphQL */ `
  mutation CreateGeneralSetting(
    $createGeneralSettingInput: CreateGeneralSettingInput!
  ) {
    createGeneralSetting(
      createGeneralSettingInput: $createGeneralSettingInput
    ) {
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
export const updateGeneralSetting = /* GraphQL */ `
  mutation UpdateGeneralSetting(
    $updateGeneralSettingInput: UpdateGeneralSettingInput!
  ) {
    updateGeneralSetting(
      updateGeneralSettingInput: $updateGeneralSettingInput
    ) {
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
export const deleteCustomerCustomQuery = /* GraphQL */ `
  mutation DeleteCustomerCustomQuery($id: Int!) {
    deleteCustomerCustomQuery(id: $id) {
      id
      userId
      query
      createdAt
      name
      filter
    }
  }
`;
export const createCustomerCustomQuery = /* GraphQL */ `
  mutation CreateCustomerCustomQuery(
    $createCustomerCustomQueryInput: CreateCustomerCustomQueryInput!
  ) {
    createCustomerCustomQuery(
      createCustomerCustomQueryInput: $createCustomerCustomQueryInput
    ) {
      id
      userId
      query
      createdAt
      name
      filter
    }
  }
`;
export const updateCustomerCustomQuery = /* GraphQL */ `
  mutation UpdateCustomerCustomQuery(
    $updateCustomerCustomQueryInput: UpdateCustomerCustomQueryInput!
  ) {
    updateCustomerCustomQuery(
      updateCustomerCustomQueryInput: $updateCustomerCustomQueryInput
    ) {
      id
      userId
      query
      createdAt
      name
      filter
    }
  }
`;
export const deleteLicenseCategory = /* GraphQL */ `
  mutation DeleteLicenseCategory($id: Int!) {
    deleteLicenseCategory(id: $id) {
      id
      name
      active
    }
  }
`;
export const createLicenseCategory = /* GraphQL */ `
  mutation CreateLicenseCategory(
    $createLicenseCategoryInput: CreateLicenseCategoryInput!
  ) {
    createLicenseCategory(
      createLicenseCategoryInput: $createLicenseCategoryInput
    ) {
      id
      name
      active
    }
  }
`;
export const updateLicenseCategory = /* GraphQL */ `
  mutation UpdateLicenseCategory(
    $updateLicenseCategoryInput: UpdateLicenseCategoryInput!
  ) {
    updateLicenseCategory(
      updateLicenseCategoryInput: $updateLicenseCategoryInput
    ) {
      id
      name
      active
    }
  }
`;
export const deleteLicenseInformation = /* GraphQL */ `
  mutation DeleteLicenseInformation($id: Int!) {
    deleteLicenseInformation(id: $id) {
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
export const createLicenseInformation = /* GraphQL */ `
  mutation CreateLicenseInformation(
    $createLicenseInformationInput: CreateLicenseInformationInput!
  ) {
    createLicenseInformation(
      createLicenseInformationInput: $createLicenseInformationInput
    ) {
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
export const updateLicenseInformation = /* GraphQL */ `
  mutation UpdateLicenseInformation(
    $updateLicenseInformationInput: UpdateLicenseInformationInput!
  ) {
    updateLicenseInformation(
      updateLicenseInformationInput: $updateLicenseInformationInput
    ) {
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
export const deleteLicenseMainFilterList = /* GraphQL */ `
  mutation DeleteLicenseMainFilterList($id: Int!) {
    deleteLicenseMainFilterList(id: $id) {
      id
      filterOrder
      name
      filter
      active
    }
  }
`;
export const createLicenseMainFilterList = /* GraphQL */ `
  mutation CreateLicenseMainFilterList(
    $createLicenseMainFilterListInput: CreateLicenseMainFilterListInput!
  ) {
    createLicenseMainFilterList(
      createLicenseMainFilterListInput: $createLicenseMainFilterListInput
    ) {
      id
      filterOrder
      name
      filter
      active
    }
  }
`;
export const updateLicenseMainFilterList = /* GraphQL */ `
  mutation UpdateLicenseMainFilterList(
    $updateLicenseMainFilterListInput: UpdateLicenseMainFilterListInput!
  ) {
    updateLicenseMainFilterList(
      updateLicenseMainFilterListInput: $updateLicenseMainFilterListInput
    ) {
      id
      filterOrder
      name
      filter
      active
    }
  }
`;
export const deleteLicenseStatus = /* GraphQL */ `
  mutation DeleteLicenseStatus($id: Int!) {
    deleteLicenseStatus(id: $id) {
      id
      name
      active
    }
  }
`;
export const createLicenseStatus = /* GraphQL */ `
  mutation CreateLicenseStatus(
    $createLicenseStatusInput: CreateLicenseStatusInput!
  ) {
    createLicenseStatus(createLicenseStatusInput: $createLicenseStatusInput) {
      id
      name
      active
    }
  }
`;
export const updateLicenseStatus = /* GraphQL */ `
  mutation UpdateLicenseStatus(
    $updateLicenseStatusInput: UpdateLicenseStatusInput!
  ) {
    updateLicenseStatus(updateLicenseStatusInput: $updateLicenseStatusInput) {
      id
      name
      active
    }
  }
`;
export const deleteNote = /* GraphQL */ `
  mutation DeleteNote($id: Int!) {
    deleteNote(id: $id) {
      id
      notes
    }
  }
`;
export const createNote = /* GraphQL */ `
  mutation CreateNote($createNoteInput: CreateNoteInput!) {
    createNote(createNoteInput: $createNoteInput) {
      id
      notes
    }
  }
`;
export const updateNote = /* GraphQL */ `
  mutation UpdateNote($updateNoteInput: UpdateNoteInput!) {
    updateNote(updateNoteInput: $updateNoteInput) {
      id
      notes
    }
  }
`;
export const deletePendingReport = /* GraphQL */ `
  mutation DeletePendingReport($id: Int!) {
    deletePendingReport(id: $id) {
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
export const createPendingReport = /* GraphQL */ `
  mutation CreatePendingReport(
    $createPendingReportInput: CreatePendingReportInput!
  ) {
    createPendingReport(createPendingReportInput: $createPendingReportInput) {
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
export const updatePendingReport = /* GraphQL */ `
  mutation UpdatePendingReport(
    $updatePendingReportInput: UpdatePendingReportInput!
  ) {
    updatePendingReport(updatePendingReportInput: $updatePendingReportInput) {
      id
    }
  }
`;
export const deletePurchaseReport = /* GraphQL */ `
  mutation DeletePurchaseReport($id: Int!) {
    deletePurchaseReport(id: $id) {
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
export const createPurchaseReport = /* GraphQL */ `
  mutation CreatePurchaseReport(
    $createPurchaseReportInput: CreatePurchaseReportInput!
  ) {
    createPurchaseReport(
      createPurchaseReportInput: $createPurchaseReportInput
    ) {
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
export const updatePurchaseReport = /* GraphQL */ `
  mutation UpdatePurchaseReport(
    $updatePurchaseReportInput: UpdatePurchaseReportInput!
  ) {
    updatePurchaseReport(
      updatePurchaseReportInput: $updatePurchaseReportInput
    ) {
      id
    }
  }
`;
export const deleteState = /* GraphQL */ `
  mutation DeleteState($id: Int!) {
    deleteState(id: $id) {
      id
      name
      abbreviation
      active
    }
  }
`;
export const createState = /* GraphQL */ `
  mutation CreateState($createStateInput: CreateStateInput!) {
    createState(createStateInput: $createStateInput) {
      id
      name
      abbreviation
      active
    }
  }
`;
export const updateState = /* GraphQL */ `
  mutation UpdateState($updateStateInput: UpdateStateInput!) {
    updateState(updateStateInput: $updateStateInput) {
      id
      name
      abbreviation
      active
    }
  }
`;
export const deleteSubscriptionPlan = /* GraphQL */ `
  mutation DeleteSubscriptionPlan($id: Int!) {
    deleteSubscriptionPlan(id: $id) {
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
export const createSubscriptionPlan = /* GraphQL */ `
  mutation CreateSubscriptionPlan(
    $createSubscriptionPlanInput: CreateSubscriptionPlanInput!
  ) {
    createSubscriptionPlan(
      createSubscriptionPlanInput: $createSubscriptionPlanInput
    ) {
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
export const updateSubscriptionPlan = /* GraphQL */ `
  mutation UpdateSubscriptionPlan(
    $updateSubscriptionPlanInput: UpdateSubscriptionPlanInput!
  ) {
    updateSubscriptionPlan(
      updateSubscriptionPlanInput: $updateSubscriptionPlanInput
    ) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
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
export const createPendingReportWithFilter = /* GraphQL */ `
  mutation CreatePendingReportWithFilter(
    $createPendingReportInput: CreatePendingReportInput!
  ) {
    createPendingReportWithFilter(
      createPendingReportInput: $createPendingReportInput
    ) {
      id
    }
  }
`;
export const createPurchaseReportWithFilter = /* GraphQL */ `
  mutation CreatePurchaseReportWithFilter(
    $createPurchaseReportInput: CreatePurchaseReportInput!
  ) {
    createPurchaseReportWithFilter(
      createPurchaseReportInput: $createPurchaseReportInput
    ) {
      id
    }
  }
`;
export const deleteAllLicenseInformation = /* GraphQL */ `
  mutation DeleteAllLicenseInformation {
    deleteAllLicenseInformation {
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
export const deleteLicenseInformationByCsvRowUniqueKey = /* GraphQL */ `
  mutation DeleteLicenseInformationByCsvRowUniqueKey(
    $csvRowUniqueKey: String!
  ) {
    deleteLicenseInformationByCSVRowUniqueKey(
      csvRowUniqueKey: $csvRowUniqueKey
    ) {
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
export const createLicenseInformationWithBatch = /* GraphQL */ `
  mutation CreateLicenseInformationWithBatch(
    $createLicenseInformationInputWithBatch: CreateLicenseInformationInputWithBatch!
  ) {
    createLicenseInformationWithBatch(
      createLicenseInformationInputWithBatch: $createLicenseInformationInputWithBatch
    ) {
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
export const deleteLicenseInformationWithBatch = /* GraphQL */ `
  mutation DeleteLicenseInformationWithBatch($query: String!) {
    deleteLicenseInformationWithBatch(query: $query) {
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
export const deletePricing = /* GraphQL */ `
  mutation DeletePricing($id: Int!) {
    deletePricing(id: $id) {
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
export const createPricing = /* GraphQL */ `
  mutation CreatePricing($createPricingInput: CreatePricingInput!) {
    createPricing(createPricingInput: $createPricingInput) {
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
export const updatePricing = /* GraphQL */ `
  mutation UpdatePricing($updatePricingInput: UpdatePricingInput!) {
    updatePricing(updatePricingInput: $updatePricingInput) {
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
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
      active
    }
  }
`;
export const createProduct = /* GraphQL */ `
  mutation CreateProduct($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
      id
      name
      description
      createdAt
      updatedAt
      active
    }
  }
`;
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct($updateProductInput: UpdateProductInput!) {
    updateProduct(updateProductInput: $updateProductInput) {
      id
      name
      description
      createdAt
      updatedAt
      active
    }
  }
`;
export const deleteCharge = /* GraphQL */ `
  mutation DeleteCharge($id: Int!) {
    deleteCharge(id: $id) {
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
export const createCharge = /* GraphQL */ `
  mutation CreateCharge($createChargeInput: CreateChargeInput!) {
    createCharge(createChargeInput: $createChargeInput) {
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
export const updateCharge = /* GraphQL */ `
  mutation UpdateCharge($updateChargeInput: UpdateChargeInput!) {
    updateCharge(updateChargeInput: $updateChargeInput) {
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
export const deleteCanceledSubscription = /* GraphQL */ `
  mutation DeleteCanceledSubscription($id: Int!) {
    deleteCanceledSubscription(id: $id) {
      id
      customerProfileId
      subscriptionId
      isCancelApplied
      isCanceled
    }
  }
`;
export const createCanceledSubscription = /* GraphQL */ `
  mutation CreateCanceledSubscription(
    $createCanceledSubscriptionInput: CreateCanceledSubscriptionInput!
  ) {
    createCanceledSubscription(
      createCanceledSubscriptionInput: $createCanceledSubscriptionInput
    ) {
      id
      customerProfileId
      subscriptionId
      isCancelApplied
      isCanceled
    }
  }
`;
export const updateCanceledSubscription = /* GraphQL */ `
  mutation UpdateCanceledSubscription(
    $updateCanceledSubscriptionInput: UpdateCanceledSubscriptionInput!
  ) {
    updateCanceledSubscription(
      updateCanceledSubscriptionInput: $updateCanceledSubscriptionInput
    ) {
      id
      customerProfileId
      subscriptionId
      isCancelApplied
      isCanceled
    }
  }
`;
export const deleteUserCredits = /* GraphQL */ `
  mutation DeleteUserCredits($id: Int!) {
    deleteUserCredits(id: $id) {
      id
      customerProfileId
      subscriptionId
      amount
      description
    }
  }
`;
export const createUserCredits = /* GraphQL */ `
  mutation CreateUserCredits($createUserCreditsInput: CreateUserCreditsInput!) {
    createUserCredits(createUserCreditsInput: $createUserCreditsInput) {
      id
      customerProfileId
      subscriptionId
      amount
      description
    }
  }
`;
export const updateUserCredits = /* GraphQL */ `
  mutation UpdateUserCredits($updateUserCreditsInput: UpdateUserCreditsInput!) {
    updateUserCredits(updateUserCreditsInput: $updateUserCreditsInput) {
      id
      customerProfileId
      subscriptionId
      amount
      description
    }
  }
`;
export const deleteCoupon = /* GraphQL */ `
  mutation DeleteCoupon($id: Int!) {
    deleteCoupon(id: $id) {
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
export const createCoupon = /* GraphQL */ `
  mutation CreateCoupon($createCouponInput: CreateCouponInput!) {
    createCoupon(createCouponInput: $createCouponInput) {
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
export const updateCoupon = /* GraphQL */ `
  mutation UpdateCoupon($updateCouponInput: UpdateCouponInput!) {
    updateCoupon(updateCouponInput: $updateCouponInput) {
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
export const deleteEnvVariables = /* GraphQL */ `
  mutation DeleteEnvVariables($id: Int!) {
    deleteEnvVariables(id: $id) {
      id
      name
      value
    }
  }
`;
export const createEnvVariables = /* GraphQL */ `
  mutation CreateEnvVariables(
    $createEnvVariablesInput: CreateEnvVariablesInput!
  ) {
    createEnvVariables(createEnvVariablesInput: $createEnvVariablesInput) {
      id
      name
      value
    }
  }
`;
export const updateEnvVariables = /* GraphQL */ `
  mutation UpdateEnvVariables(
    $updateEnvVariablesInput: UpdateEnvVariablesInput!
  ) {
    updateEnvVariables(updateEnvVariablesInput: $updateEnvVariablesInput) {
      id
      name
      value
    }
  }
`;
