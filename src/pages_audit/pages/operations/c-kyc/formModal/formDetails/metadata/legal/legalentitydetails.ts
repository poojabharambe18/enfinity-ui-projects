import { isValid } from "date-fns";
import * as API from "../../../../api";
import { greaterThanDate, lessThanDate } from "@acuteinfo/common-base";
import { t } from "i18next";

export const entity_detail_legal_meta_data = {
  form: {
    name: "personal_legal_detail_prefix_details_form",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
        },
        container: {
          direction: "row",
          spacing: 1,
        },
      },
    },
    componentProps: {
      textField: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
      inputMask: {
        fullWidth: true,
      },
      datetimePicker: {
        fullWidth: true,
      },
      divider: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "SURNAME",
      label: "EntityName",
      required: true,
      isFieldFocused: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["EntityNameIsRequired"] }],
      },
      maxLength: 100,
      validate: (columnValue) => {
        if (columnValue?.value?.startsWith(" ")) {
          return "SpacebeforeNameNotAllowed";
        }
        // Check for trailing space
        if (columnValue?.value?.endsWith(" ")) {
          return "SpaceAfterNameNotAllowed";
        }
        // Check for double spaces
        if (/  /.test(columnValue?.value)) {
          return "DoubleSpaceNotAllowed";
        }
        // Check for multiple consecutive spaces
        if (/\s{2,}/.test(columnValue?.value)) {
          return "DoubleSpaceNotAllowed";
        }
        if (!/^[a-zA-Z0-9\s]*$/.test(columnValue?.value)) {
          return "PleaseEnterAlphanumericValue";
        }
      },
      // placeholder: "Prefix",
      type: "text",
      txtTransform: "uppercase",
      // GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      GridProps: { md: 4.5, lg: 3.6, xl: 3 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "SEARCH_BTN_ignoreField",
      label: "Search",
      endsIcon: "Search",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      dependentFields: ["SURNAME"],
      GridProps: { md: 1.5, lg: 1.2, xl: 1 },
    },
    // {
    //     render: {
    //         componentType: "formbutton"
    //     },
    //     name: "Search",
    // },
    // {
    //     render: {
    //         componentType: "formbutton"
    //     },
    //     name: "Cust.Info",
    // },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "COMMU_CD",
      label: "Religion",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ReligionIsRequired"] }],
      },
      options: (dependentValue, formState, _, authState) =>
        API.getCommunityList(authState?.companyID, authState?.user?.branchCode),
      _optionsKey: "CommunityOptions",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "CASTE_CD",
      label: "Caste",
      placeholder: "",
      options: () => API.getPMISCData("CASTE_CD"),
      _optionsKey: "casteCD",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "select",
      },
      name: "TRADE_CD",
      label: "Occupation",
      options: (dependentValue, formState, _, authState) =>
        API.getOccupationDTL(authState?.companyID, authState?.user?.branchCode),
      _optionsKey: "occupationOpdtl",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["OccupationIsRequired"] }],
      },
      // placeholder: "First Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "select",
      },
      name: "SUB_CUST_TYPE",
      label: "SubCustomerType",
      options: () => API.getPMISCData("SUB_CUST_TYPE"),
      _optionsKey: "getSubCustTypeOpdtl",
      // placeholder: "Middle Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "GROUP_CD",
      label: "Group",
      options: (dependentValue, formState, _, authState) =>
        API.getCustomerGroupOptions(
          authState?.companyID,
          authState?.user?.branchCode
        ),
      _optionsKey: "GroupOptionsdtl",
      // placeholder: "Last Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "RATE_CD",
      label: "Rating",
      options: (dependentValue, formState, _, authState) =>
        API.getRatingOpDTL(authState?.companyID, authState?.user?.branchCode),
      _optionsKey: "ratingOpdtl",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "BIRTH_DT",
      label: "Inception Date",
      isMaxWorkingDate: true,
      type: "text",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["DateofBirthIsRequired"] }],
      },
      validate: (value, allField, flag) => {
        if (Boolean(value?.value)) {
          if (!isValid(value?.value)) {
            return "Mustbeavaliddate";
          } else if (
            greaterThanDate(value?.value, value?._maxDt, {
              ignoreTime: true,
            })
          ) {
            return t("InceptionDateCantBeGreaterThanTodaysDate");
          }
        }
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "EXPLICIT_TDS",
      label: "ExplicitTDS",
      options: [
        { label: "YES", value: "Y" },
        { label: "NO", value: "N" },
      ],
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ExplicitTDSIsRequired"] }],
      },
      placeholder: "",
      type: "text",
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (Boolean(field?.value)) {
          if (field?.value === "Y") {
            const buttonName = await formState.MessageBox({
              messageTitle: "CONFIRMATION",
              message:
                "SystemWillDeductTDSFromCustomersInterestEvenIfItIsUnderTDSLimit",
              buttonNames: ["Yes", "No"],
              icon: "CONFIRM",
            });
            if (buttonName === "No") {
              return {
                EXPLICIT_TDS: {
                  value: "N",
                  // ignoreUpdate: true,
                },
              };
            }
            if (buttonName === "Yes") {
              return {
                GSTIN: {
                  value: "",
                  isFieldFocused: true,
                },
              };
            }
          }
        }
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "GSTIN",
      label: "GSTIN",
      placeholder: "",
      maxLength: 20,
      type: "text",
      txtTransform: "uppercase",
      validate: (columnValue, allField, flag) => {
        const TIN_ISSUING_COUNTRY = flag?.TIN_ISSUING_COUNTRY;
        const TIN = flag?.TIN;
        if (!Boolean(columnValue?.value)) {
          if (Boolean(TIN_ISSUING_COUNTRY) && !Boolean(TIN)) {
            return "GSTINIsRequired";
          } else {
            return "";
          }
        } else {
          return API.validateGSTIN(columnValue, allField, flag);
        }
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "KYC_REVIEW_DT",
      label: "KYCRevisedDt",
      placeholder: "",
      isMaxWorkingDate: true,
      validate: (value, allField, flag) => {
        if (Boolean(value?.value)) {
          if (!isValid(value?.value)) {
            return "Mustbeavaliddate";
          } else if (
            greaterThanDate(value?.value, value?._maxDt, {
              ignoreTime: true,
            })
          ) {
            return t("KYCRevisedDateShouldBeLessThanTodaysDate");
          }
        }
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "RISK_CATEG",
      label: "RiskCategory",
      options: () => API.getPMISCData("CKYC_RISK_CATEG"),
      _optionsKey: "kycRiskCategOpdtl",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "NATIONALITY",
      label: "RegisteredInCountry",
      options: (dependentValue, formState, _, authState) =>
        API.getCountryOptions(
          authState?.companyID,
          authState?.user?.branchCode
        ),
      _optionsKey: "countryOptionsdtl",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "RESIDENCE_STATUS",
      label: "ResidenceStatus",
      options: () => API.getPMISCData("RESIDE_STATUS"),
      _optionsKey: "ResisdenceStatusdtl",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "US_GIIN",
      label: "GIIN",
      maxLength: 24,
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 24) {
            return false;
          }
          return true;
        },
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TIN",
      label: "TIN",
      placeholder: "",
      maxLength: 24,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 24) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "TIN_ISSUING_COUNTRY",
      label: "TINIssuingCountry",
      options: (dependentValue, formState, _, authState) =>
        API.getCountryOptions(
          authState?.companyID,
          authState?.user?.branchCode
        ),
      _optionsKey: "TINIssuingCountriesdtl",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CCIL_ID",
      label: "CCILID",
      maxLength: 24,
      validate: (columnValue) => {
        if (!/^[a-zA-Z0-9_ ]*$/.test(columnValue?.value)) {
          return "SpecialCharactersAreNotAllowed";
        }
      },
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 24) {
            return false;
          }
          return true;
        },
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LEI_NO",
      label: "LEINO",
      txtTransform: "uppercase",
      maxLength: 24,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 24) {
            return false;
          }
          return true;
        },
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "LEI_EXPIRY_DATE",
      label: "LEIExpiryDate",
      validate: (currentField, dependentFields, formState) => {
        if (Boolean(currentField?.value) && !isValid(currentField?.value)) {
          return "Mustbeavaliddate";
        } else if (
          lessThanDate(
            new Date(currentField.value),
            new Date(formState?.WORKING_DATE),
            {
              ignoreTime: true,
            }
          )
        ) {
          return "LEIexpirydateshouldbegreaterthanTodaysDate";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "PARENT_COMPANY",
      label: "ParentCompany",
      options: [
        { label: "YES", value: "Y" },
        { label: "NO", value: "N" },
      ],
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PARENT_COMP_NM",
      label: "ParentCompanyName",
      txtTransform: "uppercase",
      maxLength: 100,
      placeholder: "",
      dependentFields: ["PARENT_COMPANY"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues["PARENT_COMPANY"]?.value === "Y") {
          return false;
        } else {
          return true;
        }
      },
      type: "text",
      // GridProps: {xs:12, sm:5, md: 4, lg: 2.4, xl:2},
      GridProps: { xs: 12, sm: 5, md: 5, lg: 5, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      sequence: 1,
      type: "text",
      label: "OtherDetails",
      multiline: true,
      minRows: 2,
      maxRows: 5,
      GridProps: { xs: 12, md: 12, sm: 12, xl: 12, lg: 12 },
    },
  ],
};
