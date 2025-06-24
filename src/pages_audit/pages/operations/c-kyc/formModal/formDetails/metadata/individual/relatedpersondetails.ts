import { isValid } from "date-fns";
import * as API from "../../../../api";
import { lessThanInclusiveDate } from "@acuteinfo/common-base";
import { t } from "i18next";

export const related_person_detail_data = {
  form: {
    name: "rel_person_details_form",
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
          spacing: 3,
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
        componentType: "arrayField",
      },
      name: "RELATED_PERSON_DTL",
      hideRemoveIconOnSingleRecord: false,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "hidden",
          },
          name: "SR_CD",
          label: "SrNo",
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          options: () =>
            API.getPMISCData("CKYC_RELAT_PERS", { CUST_TYPE: "I" }),
          _optionsKey: "kycRelatedtype",
          name: "RELATED_PERSON_TYPE",
          label: "Type",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["RelatedPersonTypeIsRequired"] },
            ],
          },
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "REF_TYPE",
          label: "RefType",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["RefTypeIsRequired"] }],
          },
          // options: () => API.getPMISCData("REF_RELATION"),
          options: [
            { label: "OTHER", value: "O" },
            { label: "C-KYC", value: "C" },
          ],
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
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
            componentType: "numberFormat",
          },
          name: "REF_CUST_ID",
          label: "RefCustID",
          maxLength: 12,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              return true;
            },
          },
          type: "text",
          reqired: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["RefCustIDIsRequired"] }],
          },
          dependentFields: ["REF_TYPE"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (
              dependentFieldsValues["RELATED_PERSON_DTL.REF_TYPE"]?.value ===
              "C"
            ) {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
          // dependentFields: ["DAILY_AMT"],
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REF_FIRST_NM",
          label: "FirstName",
          placeholder: "First Name",
          maxLength: 50,
          showMaxLength: false,
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["FirstNameIsRequired"] }],
          },
          preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
          validate: (columnValue) => API?.validateCharValue(columnValue),
          type: "text",
          txtTransform: "uppercase",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
          // dependentFields: ["DAILY_AMT"],
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REF_MIDDLE_NM",
          label: "MiddleName",
          placeholder: "Middle Name",
          maxLength: 50,
          showMaxLength: false,
          preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
          validate: (columnValue) => API?.validateCharValue(columnValue),
          type: "text",
          txtTransform: "uppercase",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REF_LAST_NM",
          label: "LastName",
          placeholder: "Last Name",
          maxLength: 50,
          showMaxLength: false,
          preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
          validate: (columnValue) => API?.validateCharValue(columnValue),
          type: "text",
          txtTransform: "uppercase",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "RELATED_PERSON_KYC",
          label: "CkycNo",
          placeholder: "",
          maxLength: 14,
          showMaxLength: false,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 14) {
                return false;
              }
              return true;
            },
          },
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REF_ACCT_NM",
          label: "RefName",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["REF_FIRST_NM", "REF_MIDDLE_NM", "REF_LAST_NM"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            let full_name = `${
              dependentFields?.["RELATED_PERSON_DTL.REF_FIRST_NM"]?.value ?? ""
            } ${
              dependentFields?.["RELATED_PERSON_DTL.REF_MIDDLE_NM"]?.value ?? ""
            } ${
              dependentFields?.["RELATED_PERSON_DTL.REF_LAST_NM"]?.value ?? ""
            }`;
            return full_name;
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },

        {
          render: {
            componentType: "divider",
            sequence: 20,
          },
          name: "PoIOfRelatedPersonDivider_ignoreField",
          label: "PoIOfRelatedPerson",
          DividerProps: {
            sx: { color: "var(--theme-color1)", fontWeight: "500" },
          },
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },
        {
          render: {
            componentType: "panCardOptional",
          },
          name: "PAN_NO",
          label: "PAN",
          placeholder: "AAAAA1111A",
          type: "text",
          txtTransform: "uppercase",
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            ___,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};
            return API.validatePAN(field, dependentFieldsValues, formState);
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "DRIVING_LICENSE_NO",
          label: "DrivingLicNo",
          placeholder: "",
          type: "text",
          maxLength: 50,
          showMaxLength: false,
          txtTransform: "uppercase",
          preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
          validate: (columnValue, allField, flag) => {
            if (columnValue?.value?.includes(" ")) {
              return "Space not allowed";
            }
            if (columnValue?.value) {
              if (!/^[a-zA-Z0-9 ]*$/.test(columnValue?.value)) {
                return "PleaseEnterAlphanumericValue";
              }
            }
          },
          // postValidationSetCrossFieldValues: async (
          //   field,
          //   formState,
          //   ___,
          //   dependentFieldsValues
          // ) => {
          //   return API.DuplicationValidate(field, dependentFieldsValues, formState, {
          //     fieldNm: "DRIVING_LICENSE_NO", CHECK_FOR: "3", DATAVALUE: field.value
          //   })
          // },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
          // dependentFields: ["DAILY_AMT"],
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "DRIVING_LICENSE_EXPIRY_DT",
          label: "DrivingLicExpDt",
          dependentFields: ["DRIVING_LICENSE_NO"],
          isMinWorkingDate: true,
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
                return t("DrivingLicenseExpiryDateShouldBeFutureDate");
              }
            } else {
              const dirvingLicenseNo =
                dependentField?.["RELATED_PERSON_DTL.DRIVING_LICENSE_NO"]
                  ?.value;
              if (Boolean(dirvingLicenseNo)) {
                return "ThisFieldisrequired";
              }
            }
            return "";
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ELECTION_CARD_NO",
          label: "VoterId",
          placeholder: "",
          type: "text",
          maxLength: 50,
          showMaxLength: false,
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
          // postValidationSetCrossFieldValues: async (
          //   field,
          //   formState,
          //   ___,
          //   dependentFieldsValues
          // ) => {
          //   return API.DuplicationValidate(field, dependentFieldsValues, formState, {
          //     fieldNm: "ELECTION_CARD_NO", CHECK_FOR: "5", DATAVALUE: field.value
          //   })
          // },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "PASSPORT_NO",
          label: "PassportNo",
          placeholder: "",
          type: "text",
          maxLength: 25,
          showMaxLength: false,
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
          // postValidationSetCrossFieldValues: async (
          //   field,
          //   formState,
          //   ___,
          //   dependentFieldsValues
          // ) => {
          //   return API.DuplicationValidate(field, dependentFieldsValues, formState, {
          //     fieldNm: "PASSPORT_NO", CHECK_FOR: "2", DATAVALUE: field.value
          //   })
          // },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "PASSPORT_EXPIRY_DT",
          label: "PassportExpDt",
          dependentFields: ["PASSPORT_NO"],
          isMinWorkingDate: true,
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
                return t("PassportExpiryDateShouldBeFutureDate");
              }
            } else {
              const passport =
                dependentField?.["RELATED_PERSON_DTL.PASSPORT_NO"]?.value;
              if (Boolean(passport)) {
                return "ThisFieldisrequired";
              }
            }
            return "";
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "UNIQUE_ID",
          label: "UniqueId",
          placeholder: "",
          type: "text",
          validate: (columnValue, allField, flag) => {
            if (columnValue.value) {
              return API.validateUniqueId(columnValue, allField, flag);
            }
          },
          maxLength: 12,
          showMaxLength: false,
          // postValidationSetCrossFieldValues: async (
          //   field,
          //   formState,
          //   ___,
          //   dependentFieldsValues
          // ) => {
          //   return await API.DuplicationValidate(field, dependentFieldsValues, formState, {
          //     fieldNm: "UNIQUE_ID", CHECK_FOR: "4", DATAVALUE: field.value
          //   })
          // },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "NREGA_JOB_CARD",
          label: "NREGAJobCard",
          placeholder: "",
          type: "text",
          txtTransform: "uppercase",
          maxLength: 20,
          showMaxLength: false,
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
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "OTHER_DOC",
          label: "OtherDoc",
          placeholder: "",
          type: "text",
          txtTransform: "uppercase",
          maxLength: 50,
          showMaxLength: false,
          preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
          validate: (columnValue) => API?.validateCharValue(columnValue),
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "OTHER_DOC_NO",
          label: "OtherDocNo",
          placeholder: "",
          type: "text",
          maxLength: 25,
          showMaxLength: false,
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
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },

        {
          render: {
            componentType: "divider",
            sequence: 20,
          },
          name: "AttesDetailsIPVByDivider_ignoreField",
          label: "AttesDetailsIPVBy",
          DividerProps: {
            sx: { color: "var(--theme-color1)", fontWeight: "500" },
          },
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "RCV_DOC_TYPE",
          label: "DocReceived",
          options: () => API.getPMISCData("CKYC_RCVDOCTYPE"),
          _optionsKey: "kycDocReceivedType",
          placeholder: "",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["DocReceivedIsRequired"] }],
          },
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          options: () => API.getPMISCData("CKYC_RISK_CATEG"),
          _optionsKey: "kycRiskCateg",
          name: "RISK_CATEG",
          label: "RiskCategory",
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "IPV_FLAG",
          label: "IPVFlag",
          options: [
            { label: "YES", value: "Y" },
            { label: "NO", value: "N" },
          ],
          _optionsKey: "ipvFlag",
          placeholder: "",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["IPVFlagIsRequired"] }],
          },
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "IPV_DATE",
          label: "IPVDate",
          isReadOnly: true,
          format: "dd/MM/yyyy HH:mm:ss",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
          defaultValue: (formState, currentField) => {
            return formState?.attestData?.[0]?.IPV_DATE;
          },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "IPV_EMP_CODE",
          label: "EmpCode",
          options: API.getEmpCodeList,
          _optionsKey: "getEmpCodeList",
          enableVirtualized: true,
          placeholder: "",
          disableCaching: true,
          defaultValue: (formState, currentField) => {
            return formState?.attestData?.[0]?.IPV_EMP_CODE;
          },
          isReadOnly: (current, dependent, formState) => {
            return Boolean(
              formState?.state?.tabsApiResctx?.[0]?.PROTECT_IPV_EMP_CODE === "Y"
            );
          },

          postValidationSetCrossFieldValues: async (
            field,
            formState,
            ___,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};
            return {
              IPV_NAME: {
                value: field?.optionData?.[0]?.DESCRIPTION ?? "",
                isFieldFocused: false,
                ignoreUpdate: false,
              },
              IPV_EMP_DESIG: {
                value: field?.optionData?.[0]?.GROUP_NAME ?? "",
                isFieldFocused: false,
                ignoreUpdate: false,
              },
            };
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "IPV_NAME",
          label: "EmpName",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          txtTransform: "uppercase",
          defaultValue: (formState, currentField) => {
            return formState?.attestData?.[0]?.IPV_NAME;
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "IPV_EMP_DESIG",
          label: "EmpDesig",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          txtTransform: "uppercase",
          defaultValue: (formState, currentField) => {
            return formState?.attestData?.[0]?.IPV_EMP_DESIG;
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "IPV_BRANCH",
          label: "IPVBranch",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          txtTransform: "uppercase",
          defaultValue: (formState, currentField) => {
            return formState?.attestData?.[0]?.IPV_BRANCH;
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ORG_NAME",
          label: "OrgName",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          txtTransform: "uppercase",
          defaultValue: (formState, currentField) => {
            return formState?.attestData?.[0]?.ORG_NAME;
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ORG_CODE",
          label: "OrgCode",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          txtTransform: "uppercase",
          defaultValue: (formState, currentField) => {
            return formState?.attestData?.[0]?.ORG_CODE;
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "PLACE_OF_DECLARE",
          label: "DecPlace",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          txtTransform: "uppercase",
          defaultValue: (formState, currentField) => {
            return formState?.attestData?.[0]?.PLACE_OF_DECLARE;
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "DATE_OF_DECLARE",
          label: "DecDate",
          isReadOnly: true,
          format: "dd/MM/yyyy HH:mm:ss",
          defaultValue: (formState, currentField) => {
            return formState?.attestData?.[0]?.DATE_OF_DECLARE;
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
      ],
    },
  ],
};
