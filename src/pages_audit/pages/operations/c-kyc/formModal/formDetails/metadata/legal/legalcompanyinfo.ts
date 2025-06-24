import { isValid } from "date-fns";
import * as API from "../../../../api";
import { greaterThanDate } from "@acuteinfo/common-base";
import { t } from "i18next";
import { getUdyamRegNoStatus } from "pages_audit/pages/operations/acct-mst/api";

export const company_info_meta_data = {
  form: {
    name: "company-info-kyc-details-form",
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
        componentType: "datePicker",
      },
      name: "COMMENCEMENT_DT",
      label: "Commencement Date",
      placeholder: "",
      isFieldFocused: true,
      isMaxWorkingDate: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["CommencementDateIsRequired"] }],
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
            return t("CommencementDateCantBeGreaterThanTodaysDate");
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
      name: "COMPANY_TYPE",
      label: "Type",
      options: (dependentValue, formState, _, authState) =>
        API.getLegalCompanyTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "legalCompanyTypeOP",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COMP_REG_NO",
      label: "RegNo",
      required: true,
      maxLength: 50,
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COMP_SALES_TAX_NO",
      label: "SalesTaxNo",
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      required: true,
      maxLength: 50,
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COMP_EXCISE_NO",
      label: "ExciseNo",
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      required: true,
      maxLength: 50,
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COMP_IT_NO",
      label: "ITNo",
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      required: true,
      maxLength: 50,
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COMP_TAN_NO",
      label: "TANNo",
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      required: true,
      maxLength: 50,
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COMP_CIN_NO",
      label: "CINNo",
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      required: true,
      maxLength: 50,
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "LIQUIDATION_DT",
      label: "DateOfLiquidation",
      validate: (value) => {
        if (Boolean(value?.value) && !isValid(value?.value)) {
          return "Mustbeavaliddate";
        }
        return "";
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "WEBSITE_DTL",
      label: "Website",
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      required: true,
      maxLength: 100,
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "COMPANY_SIZE",
      label: "Size",
      options: () => API.getPMISCData("CST_COMP_SZ"),
      _optionsKey: "getCompSizedtl",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CEO_NAME",
      label: "CEOName",
      required: true,
      maxLength: 100,
      // placeholder: "Prefix",
      type: "text",
      validate: (columnValue, allField, flag) => {
        if (!/^[a-zA-Z0-9_ ]*$/.test(columnValue?.value)) {
          return "SpecialCharactersAreNotAllowed";
        }
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "STAFF_STRENGTH",
      label: "StaffStrength",
      required: true,
      maxLength: 10,
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CIBIL_SCORE",
      label: "CIBILMSMERank",
      required: true,
      maxLength: 3,
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "SPECIALIZATION_REMARKS",
      label: "Specialization",
      placeholder: "",
      maxLength: 100,
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => API.validateAlphaNumValue(columnValue),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "FORM_60",
      label: "Form6061",
      placeholder: "",
      defaultValue: "N",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      options: [
        { label: "Form60", value: "Y" },
        { label: "Form61", value: "F" },
        { label: "No", value: "N" },
      ],
    },
    {
      render: {
        componentType: "textField",
      },
      name: "OTHER_DOC",
      label: "OtherPoI",
      placeholder: "",
      type: "text",
      txtTransform: "uppercase",
      maxLength: 50,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) => {
        if (!/^[a-zA-Z\s]*$/.test(columnValue?.value)) {
          return "PleaseEnterCharacterValue";
        }
        return "";
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "OTHER_DOC_NO",
      label: "PoINo",
      placeholder: "",
      maxLength: 20,
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => {
        if (columnValue?.value?.includes(" ")) {
          return "Space not allowed";
        }
        if (columnValue?.value) {
          if (!/^[a-zA-Z0-9 ]*$/.test(columnValue?.value)) {
            return "PleaseEnterAlphanumericValue";
          }
        }
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "PAN_NO_SPACER",
      dependentFields: ["FORM_60"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        return Boolean(dependentFieldsValues?.FORM_60?.value === "N");
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "panCard",
      },
      name: "PAN_NO",
      label: "PanNo",
      placeholder: "AAAAA1111A",
      type: "text",
      txtTransform: "uppercase",
      required: true,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["PanNoIsRequired"] },
          {
            name: "pancard",
            params: ["PleaseEnterValidPANNumber"],
          },
        ],
      },
      dependentFields: ["FORM_60"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        return !Boolean(dependentFieldsValues?.FORM_60?.value === "N");
      },
      // validate: (columnValue, allField, flag) => API.validatePAN(columnValue, allField, flag),
      maxLength: 10,
    },
    {
      render: {
        componentType: "textField",
      },
      name: "UDYAM_REG_NO",
      label: "URN/UAN",
      type: "text",
      // maxLength: 18,
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      postValidationSetCrossFieldValues: async (currentField, formState) => {
        if (formState?.isSubmitting) return {};
        if (currentField?.value) {
          const validationMSG = await getUdyamRegNoStatus(currentField.value);
          if (Boolean(validationMSG)) {
            let buttonName = await formState?.MessageBox({
              messageTitle: "UdyamValidationFailed",
              message: validationMSG ?? "",
              buttonNames: ["Ok"],
              icon: "ERROR",
            });
            if (buttonName === "Ok") {
              return {
                UDYAM_REG_NO: { value: "", ignoreUpdate: true },
              };
            }
          }
        }
        return {};
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      // validate: (columnValue, allField, flag) => {
      //   let URNRegex = /^UDYAM-[A=Za-z]{2}-\d{2}-\d{7}$/;
      //   let UANRegex = /^[A=Za-z]{2}\d{2}[A-Za-z]{1}\d{7}$/;
      //   if (
      //     columnValue.value &&
      //     !URNRegex.test(columnValue.value) &&
      //     !UANRegex.test(columnValue.value)
      //   ) {
      //     return "PleaseEnterValidFormat";
      //   }
      //   return "";
      // },
    },
  ],
};
