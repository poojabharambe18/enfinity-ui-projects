import { greaterThanDate, lessThanInclusiveDate } from "@acuteinfo/common-base";
import * as API from "../../../../api";
import { isValid } from "date-fns";
import { t } from "i18next";

export const nri_detail_meta_data = {
  form: {
    name: "nri_details_form",
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
        componentType: "textField",
      },
      name: "VISA_DETAIL",
      label: "VisaDetails",
      placeholder: "",
      maxLength: 50,
      type: "text",
      txtTransform: "uppercase",
      required: true,
      isFieldFocused: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["VisaDetailsIsRequired"] }],
      },
      // GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "VISA_ISSUE_BY",
      label: "VisaIssueBy",
      placeholder: "",
      maxLength: 50,
      type: "text",
      txtTransform: "uppercase",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["VisaIssueByIsRequired"] }],
      },
      validate: (columnValue, allField, flag) =>
        API.validateAlphaNumValue(columnValue),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "VISA_ISSUE_DT",
      label: "VisaIssueDate",
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
            return t("VisaIssueDateCantBeGreaterThanTodayssDate");
          }
        }
      },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["VisaIssueDateIsRequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "VISA_EXPIRY_DT",
      label: "VisaExpiryDate",
      required: true,
      isMinWorkingDate: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["VisaExpiryDateIsRequired"] }],
      },
      validate: (currentField, dependentField, formState) => {
        if (Boolean(currentField.value)) {
          if (!isValid(currentField?.value)) {
            return "Mustbeavaliddate";
          } else if (
            lessThanInclusiveDate(
              currentField?.value,
              new Date(currentField?._minDt)
            )
          ) {
            return t("VisaExpiryDateCantBeLessThanOrEqualToTodaysDate");
          }
        } else {
          const passport = dependentField?.PASSPORT_NO?.value;
          if (Boolean(passport)) {
            return "ThisFieldisrequired";
          }
        }
        return "";
      },
      // placeholder: "",
      // type: "datePicker",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DOMESTIC_RISK",
      label: "DomesticRisk",
      options: () => API.getPMISCData("DOMESTIC_RISK"),
      _optionsKey: "DomesticRiskTypes",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["DomesticRiskIsRequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "COUNTRY_OF_RISK",
      label: "CountryOfRisk",
      options: (dependentValue, formState, _, authState) =>
        API.getCountryOptions(
          authState?.companyID,
          authState?.user?.branchCode
        ),
      _optionsKey: "CountryRiskTypes",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["CountryofRiskIsRequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "CROSS_BORDER_RISK",
      label: "CrossBorderRisk",
      options: () => API.getPMISCData("CROSS_BORDER"),
      _optionsKey: "CrossBorderRiskTypes",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["CrossBorderRiskIsRequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "VISUALLY_IMPAIRED",
      label: "VisuallyImpaired",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      options: [
        { label: "YES", value: "Y" },
        { label: "NO", value: "N" },
      ],
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["VisuallyImpairedIsRequired"] }],
      },
      // dependentFields: ["DAILY_AMT"],
      // runValidationOnDependentFieldsChange: true,
      // validate: (currentField, dependentFields) => {
      //     if(Number(dependentFields?.DAILY_AMT?.value) >
      //     Number(currentField?.value)) {
      //         return "Weekly Limit should greater than or equal to Daily Limit";
      //     } else {
      //         return "";
      //     }
      // }
    },
    {
      render: {
        componentType: "autocomplete",
      },
      options: [
        { label: "YES", value: "Y" },
        { label: "NO", value: "N" },
      ],
      name: "CUSTOMER_EVALUATION_FLAG",
      label: "CustomerEvaluationRequired",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["CustomerEvaluationFlagIsRequired"] },
        ],
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      options: (dependentValue, formState, _, authState) =>
        API.getRelationshipManagerOptions(authState?.companyID),
      _optionsKey: "RelManager",
      name: "RELATIONSHIP_MANAGER",
      label: "RelationshipManager",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 5, lg: 4, xl: 3 },
    },
  ],
};
