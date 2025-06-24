import { isValid } from "date-fns";
import * as API from "../../../../api";
import { lessThanDate } from "@acuteinfo/common-base";
export const other_details_meta_data = {
  form: {
    name: "other_details_annual_income_details_form",
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
    },
  },
  fields: [
    {
      render: {
        componentType: "divider",
      },
      name: "AnnualIncomeDivider_ignoreField",
      label: "AnnualIncome",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ANNUAL_INCOME_SR_CD",
      label: "Range",
      options: (dependentValue, formState, _, authState) =>
        API.getRangeOptions(authState?.companyID, authState?.user?.branchCode),
      _optionsKey: "rangeOptions",
      // required: true,
      isFieldFocused: true,
      placeholder: "",
      type: "text",
      //   GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      // className: "textInputFromRight",
      name: "ANNUAL_TURNOVER_SR_CD",
      label: "Turnover",
      options: (dependentValue, formState, _, authState) =>
        API.getRangeOptions(authState?.companyID, authState?.user?.branchCode),
      _optionsKey: "turnoverOptions",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      // maxLength: 3,
      // showMaxLength: false,
      // FormatProps: {
      //   allowNegative: false,
      //   allowLeadingZeros: true,
      //   decimalScale: 0,
      //   isAllowed: (values) => {
      //     if (values?.value?.length > 3) {
      //       return false;
      //     }
      //     if (values?.value > 100) {
      //       return false;
      //     }
      //     return true;
      //   },
      // },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ANNUAL_OTHER_INCOME_SR_CD",
      label: "OtherIncome",
      options: (dependentValue, formState, _, authState) =>
        API.getRangeOptions(authState?.companyID, authState?.user?.branchCode),
      _optionsKey: "otherIncomeOptions",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SOURCE_OF_INCOME",
      label: "SourceOfIncome",
      maxLength: 200,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 200) {
            return false;
          }
          return true;
        },
      },
      placeholder: "",
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => API.validateAlphaNumValue(columnValue),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 4 },
    },

    {
      render: {
        componentType: "divider",
      },
      name: "ExposureInfoDivider_ignoreField",
      label: "ExposureInfo",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "amountField",
      },
      // className: "textInputFromRight",
      name: "FUNDED_AMT",
      label: "Funded",
      enableNumWords: false,
      placeholder: "",
      type: "text",
      maxLength: 15,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      // className: "textInputFromRight",
      name: "NON_FUNDED_AMT",
      label: "NonFunded",
      enableNumWords: false,
      placeholder: "",
      type: "text",
      maxLength: 15,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      // className: "textInputFromRight",
      name: "THRESHOLD_AMT",
      label: "ThresholdLimit",
      enableNumWords: false,
      placeholder: "",
      maxLength: 15,
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
      },
      name: "PersonalInfoDivider_ignoreField",
      label: "PersonalInfo",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      // className: "textInputFromRight",
      name: "NO_OF_CHILDREN",
      label: "ChildrenCount",
      placeholder: "",
      maxLength: 2,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 2) {
            return false;
          }
          return true;
        },
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value && columnValue.value < 0) {
          return "MinimumAllowedValueIsZero";
        }
        return "";
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "HOUSE_CD",
      label: "HouseType",
      options: () => API.getPMISCData("House"),
      _optionsKey: "HouseTypes",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      // className: "textInputFromRight",
      name: "NO_OF_ADULTS",
      label: "AdultsCount",
      placeholder: "",
      maxLength: 2,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 2) {
            return false;
          }
          return true;
        },
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value && columnValue.value < 0) {
          return "MinimumAllowedValueIsZero";
        }
        return "";
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      defaultValue: false,
      name: "POLITICALLY_CONNECTED",
      label: "PoliticallyConnected",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      // className: "textInputFromRight",
      name: "EARNING_MEMEBER",
      label: "EarningMembers",
      placeholder: "",
      maxLength: 3,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 3) {
            return false;
          }
          return true;
        },
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value && columnValue.value < 0) {
          return "MinimumAllowedValueIsZero";
        }
        return "";
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      defaultValue: false,
      name: "BLINDNESS",
      label: "Blind",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ID_MARK",
      label: "IDMark",
      placeholder: "",
      type: "text",
      txtTransform: "uppercase",
      maxLength: 100,
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) => API?.validateCharValue(columnValue),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 4 },
    },

    {
      render: {
        componentType: "divider",
      },
      name: "VehicleInfoDivider_ignoreField",
      label: "VehicleInfo",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      // className: "textInputFromRight",
      name: "NO_OF_2_WHEELERS",
      label: "TwoWheelers",
      maxLength: 2,
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 2) {
            return false;
          }
          //   if (values.floatValue === 0) {
          //     return false;
          //   }
          return true;
        },
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value && columnValue.value < 0) {
          return "MinimumAllowedValueIsZero";
        }
        return "";
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      // className: "textInputFromRight",
      name: "NO_OF_4_WHEELERS",
      label: "FourWheelers",
      maxLength: 2,
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 2) {
            return false;
          }
          //   if (values.floatValue === 0) {
          //     return false;
          //   }
          return true;
        },
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value && columnValue.value < 0) {
          return "MinimumAllowedValueIsZero";
        }
        return "";
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CIBIL_SCORE",
      label: "CIBILScore",
      placeholder: "",
      type: "text",
      maxLength: 3,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 3) {
            return false;
          }
          return true;
        },
      },
      validate: (columnValue, allField, flag) => {
        if (
          columnValue.value &&
          (columnValue.value > 900 || columnValue.value < 0)
        ) {
          return "CIBILScoreShouldBeBetween0To900";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
      },
      name: "EmpInfoDivider_ignoreField",
      label: "EmploymentInfo",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "EMPLOYMENT_STATUS",
      label: "EmpStatus",
      options: () => API.getPMISCData("Emp_Status"),
      _optionsKey: "EmpStatus",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      defaultValue: false,
      name: "REFERRED_BY_STAFF",
      label: "ReferredByStaff",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "EDUCATION_CD",
      label: "EduQualification",
      options: (dependentValue, formState, _, authState) =>
        API.getEduQualiOptions(
          authState?.companyID,
          authState?.user?.branchCode
        ),
      _optionsKey: "eduQualiOptions",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "COMPANY_NM_OPTION",
      label: "SelectCompanyName",
      placeholder: "SelectCompanyName",
      options: () => API.getPMISCData("COMPANY_NM"),
      _optionsKey: "getPMISCDataForCompanyName",
      ignoreInSubmit: true,
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (currentField?.value) {
          return {
            COMPANY_NM: {
              value: currentField?.optionData?.[0]?.label ?? "",
              ignoreUpdate: false,
            },
          };
        }
        return {};
      },
      GridProps: { xs: 12, sm: 3, md: 2, lg: 1.8, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COMPANY_NM",
      label: "CompanyName",
      placeholder: "",
      type: "text",
      txtTransform: "uppercase",
      maxLength: 100,
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => API.validateAlphaNumValue(columnValue),
      GridProps: { xs: 12, sm: 5, md: 4, lg: 3.0, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DEPARTMENT_NM",
      label: "Department",
      placeholder: "",
      maxLength: 100,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 100) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => API.validateAlphaNumValue(columnValue),
      GridProps: { xs: 12, sm: 12, md: 12, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COMPANT_ADDRESS",
      label: "CompanyAdd",
      placeholder: "",
      type: "text",
      txtTransform: "uppercase",
      maxLength: 100,
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => API.validateAlphaNumValue(columnValue),
      GridProps: { xs: 12, sm: 12, md: 12, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      // className: "textInputFromRight",
      name: "JOINING_DT",
      label: "JoiningDate",
      placeholder: "",
      type: "text",
      validate: (currentField, dependentFields, formState) => {
        if (Boolean(currentField?.value) && !isValid(currentField?.value)) {
          return "Mustbeavaliddate";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      // className: "textInputFromRight",
      name: "RETIREMENT_DT",
      label: "RetirementDate",
      placeholder: "",
      type: "text",
      dependentFields: ["JOINING_DT"],
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
          return "RetirementDatecantbelessthanTodayDate";
        } else if (
          lessThanDate(
            new Date(currentField.value),
            new Date(dependentFields?.JOINING_DT?.value),
            {
              ignoreTime: true,
            }
          )
        ) {
          return "RetirementDatecantbelessthanJoiningDate";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      // className: "textInputFromRight",
      name: "EMP_COMPANY_TYPE",
      label: "EmpCompanyType",
      placeholder: "",
      type: "text",
      options: (dependentValue, formState, _, authState) =>
        API.getEmpCompanyTypes(
          authState?.companyID,
          authState?.user?.branchCode
        ),
      _optionsKey: "PDPrefix",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SPECIALIZATION_REMARKS",
      label: "Specialization",
      placeholder: "",
      type: "text",
      txtTransform: "uppercase",
      maxLength: 100,
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => API.validateAlphaNumValue(columnValue),
      GridProps: { xs: 12, sm: 8, md: 6, lg: 4.8, xl: 6 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      // className: "textInputFromRight",
      name: "WORK_EXP",
      label: "WorkExperienceYear",
      placeholder: "",
      maxLength: 2,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 2) {
            return false;
          }
          return true;
        },
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value) {
          if (columnValue.value && columnValue.value < 0) {
            return "MinimumAllowedValueIsZero";
          }
          if (columnValue.value > 10) {
            return "MaximumAllwedValueIs10";
          }
        }
        return "";
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
  ],
};
