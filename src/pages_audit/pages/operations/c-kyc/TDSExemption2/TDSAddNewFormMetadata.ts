import { isValid } from "date-fns";
import * as API from "../api";
import { lessThanDate, lessThanInclusiveDate } from "@acuteinfo/common-base";
import { t } from "i18next";

export const TDSAddNewFormMetadata = {
  form: {
    name: "tds_exemption_form",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "sequence",
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
      Divider: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "arrayField",
      },
      name: "TDS_ADD_NEW_ROWS",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      fixedRows: true,
      __NEW__: {
        fixedRows: false,
      },
      _fields: [
        {
          render: {
            componentType: "checkbox",
          },
          defaultValue: true,
          name: "IsNewRow",
          label: "IsNewRow",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TRAN_CD",
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "FORM_TYPE",
          label: "ExemptionType",
          options: () => API.getPMISCData("EXEMPTION_TYPE"),
          _optionsKey: "exemptionTypeOp",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["BranchCodeReqired"] }],
          },
          isReadOnly: true,
          __NEW__: {
            isReadOnly: false,
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "FORM_NM",
          label: "Form Name",
          dependentFields: ["FORM_TYPE"],
          options: (dependentValue, formState) =>
            API.getPMISCData("TDS_EXEMPTION", { dependentValue, formState }),
          _optionsKey: "getPMISCData",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["PersonNameIsRequired"] }],
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
          isReadOnly: true,
          disableCaching: true,
          __NEW__: {
            disableCaching: false,
            isReadOnly: false,
          },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "RECEIVED_DT",
          label: "Received Date",
          isReadOnly: true,
          __NEW__: {
            isReadOnly: false,
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "EFFECTIVE_DT",
          label: "Effective Date",
          isReadOnly: true,
          __NEW__: {
            isReadOnly: false,
          },
          dependentFields: ["FORM_EXPIRY_DATE"],
          isMaxWorkingDate: true,
          validate: (currentField, dependentField, formState) => {
            let formatdate = new Date(currentField?.value);
            const expiryDate =
              dependentField?.["TDS_ADD_NEW_ROWS.FORM_EXPIRY_DATE"]?.value;
            if (Boolean(currentField?.value)) {
              if (!isValid(formatdate)) {
                return t("Mustbeavaliddate");
              } else if (
                lessThanDate(
                  new Date(formState?.WORKING_DATE),
                  currentField?.value,
                  {
                    ignoreTime: true,
                  }
                )
              ) {
                return t(
                  "Expiry Date should be less than or equal to Working Date."
                );
              }
            }
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "FORM_EXPIRY_DATE",
          label: "Expiry Date",
          isReadOnly: true,
          __NEW__: {
            isReadOnly: false,
          },
          isMinWorkingDate: true,
          dependentFields: ["EFFECTIVE_DT"],
          runValidationOnDependentFieldsChange: true,
          validate: (currentField, dependentField, formState) => {
            let formatdate = new Date(currentField?.value);
            const effectiveDate =
              dependentField?.["TDS_ADD_NEW_ROWS.EFFECTIVE_DT"]?.value;
            if (!currentField?.value) {
              return "Please Enter Expiry Date";
            } else if (Boolean(formatdate) && !isValid(formatdate)) {
              return t("Mustbeavaliddate");
            } else if (
              lessThanDate(
                currentField?.value,
                new Date(formState?.WORKING_DATE),
                {
                  ignoreTime: true,
                }
              )
            ) {
              return t(
                "Expiry Date should be greater than or equal to Working Date."
              );
            } else if (
              Boolean(effectiveDate) &&
              isValid(new Date(effectiveDate)) &&
              lessThanInclusiveDate(formatdate, new Date(effectiveDate))
            ) {
              return t("Expiry Date should be greater than Effective Date.");
            }
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "TDS_LIMIT",
          label: "Exemption Limit",
          defaultValue: "0.00",
          autoComplete: "off",
          runPostValidationHookAlways: true,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 14) {
                return false;
              }
              return true;
            },
          },
          isReadOnly: true,
          dependentFields: ["FORM_TYPE"],
          __NEW__: {
            isReadOnly: (field, dependentFields, formState) => {
              const ExemptionType =
                dependentFields["TDS_ADD_NEW_ROWS.FORM_TYPE"]?.value;
              if (ExemptionType === "TDS_EXEMPTION") {
                return true;
              }
              return false;
            },
            setValueOnDependentFieldsChange: (dependentFields) => {
              const ExemptionType =
                dependentFields["TDS_ADD_NEW_ROWS.FORM_TYPE"]?.value;
              if (ExemptionType === "TDS_EXEMPTION") {
                return "";
              } else return null;
            },
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "rateOfInt",
          },
          name: "TDS_RATE",
          label: "Rate",
          // placeholder: "",
          type: "text",
          fullWidth: true,
          decimalScale: 2,
          FormatProps: {
            allowLeadingZeros: false,
            allowNegative: true,
            isAllowed: (values) => {
              if (values?.value?.length > 6) {
                return false;
              }
              return true;
            },
          },
          isReadOnly: true,
          dependentFields: ["FORM_TYPE"],
          __NEW__: {
            isReadOnly: (field, dependentFields, formState) => {
              const ExemptionType =
                dependentFields["TDS_ADD_NEW_ROWS.FORM_TYPE"]?.value;
              if (ExemptionType === "TDS_EXEMPTION") {
                return true;
              }
              return false;
            },
            setValueOnDependentFieldsChange: (dependentFields) => {
              const ExemptionType =
                dependentFields["TDS_ADD_NEW_ROWS.FORM_TYPE"]?.value;
              if (ExemptionType === "TDS_EXEMPTION") {
                return "";
              } else return null;
            },
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TDS_CERTI_DETAILS",
          label: "Exemption Details",
          // maxLength: 50,
          type: "text",
          isReadOnly: true,
          dependentFields: ["FORM_TYPE"],
          __NEW__: {
            isReadOnly: (field, dependentFields, formState) => {
              const ExemptionType =
                dependentFields["TDS_ADD_NEW_ROWS.FORM_TYPE"]?.value;
              if (ExemptionType === "TDS_EXEMPTION") {
                return true;
              }
              return false;
            },
            setValueOnDependentFieldsChange: (dependentFields) => {
              const ExemptionType =
                dependentFields["TDS_ADD_NEW_ROWS.FORM_TYPE"]?.value;
              if (ExemptionType === "TDS_EXEMPTION") {
                return "";
              } else return null;
            },
          },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "FIN_INT_AMT",
          label: "Projected Fin. Int.",
          defaultValue: "0.00",
          autoComplete: "off",
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 14) {
                return false;
              }
              return true;
            },
          },
          isReadOnly: true,
          __NEW__: {
            isReadOnly: false,
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "SUBMISSION_DT",
          label: "Subimission to IT",
          isReadOnly: true,
          __NEW__: {
            isReadOnly: false,
          },
          isMinWorkingDate: true,
          validate: (currentField, dependentField, formState) => {
            let formatdate = new Date(currentField?.value);
            if (currentField?.value) {
              if (!isValid(formatdate)) {
                return t("Mustbeavaliddate");
              } else if (
                lessThanDate(
                  currentField?.value,
                  new Date(formState?.WORKING_DATE),
                  {
                    ignoreTime: true,
                  }
                )
              ) {
                return t(
                  "Subimission to IT Date should be greater than or equal to Working Date."
                );
              }
            }
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "ENTERED_DATE",
          label: "Entered Date",
          isReadOnly: true,
          __NEW__: {
            isWorkingDate: true,
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "checkbox",
          },
          defaultValue: true,
          name: "ACTIVE",
          label: "Active",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
          __NEW__: {
            isReadOnly: true,
          },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "INACTIVE_DT",
          label: "Inactive Date",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
      ],
    },
  ],
};
