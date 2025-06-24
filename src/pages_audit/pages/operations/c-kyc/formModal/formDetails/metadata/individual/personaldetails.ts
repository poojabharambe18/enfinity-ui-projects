import {
  greaterThanDate,
  GridMetaDataType,
  utilFunction,
} from "@acuteinfo/common-base";
import { differenceInYears, format, isValid } from "date-fns";
import { t } from "i18next";
import * as API from "../../../../api";
import {
  getMinorMajorAgeData,
  validateShareMemAcct,
} from "pages_audit/pages/operations/acct-mst/api";

export const personal_detail_prefix_data = {
  form: {
    name: "personal_detail_prefix_details_form",
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
        componentType: "divider",
        sequence: 1,
      },
      name: "prefixDivider_ignoreField",
      label: "Prefix",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 2,
      },
      name: "PREFIX_CD",
      label: "Prefix",
      // placeholder: "Prefix",
      options: () => API.GetDynamicSalutationData("Salutation"),
      _optionsKey: "PDPrefix",
      type: "text",
      required: true,
      // GridProps: {xs:12, sm:2.5, md: 2.5, lg: 1.5, xl: 1 },
      GridProps: { xs: 12, sm: 4, md: 1, lg: 1, xl: 1 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["PrefixIsRequired"] }],
      },
      postValidationSetCrossFieldValues: (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (field.value) {
          console.log("wefuuwiefwef", field?.optionData);
          return {
            // MOTHER_LAST_NM: {value: "", isFieldFocused:true},
            GENDER: { value: field?.optionData[0]?.SET_GENDER ?? "" },
            MARITAL_STATUS: {
              value: field?.optionData[0]?.SET_MARITIAL_STATUS ?? "",
            },
            // SURNAME: {value: "", isFieldFocused:true},
            // LAST_NM: {value: "", isFieldFocused:true},
          };
        }
        return {};
      },
      runPostValidationHookAlways: true,
      // GridProps: {xs:12, sm:2, md: 1, lg: 1, xl:0.5},
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
        componentType: "textField",
        sequence: 3,
      },
      name: "FIRST_NM",
      label: "FirstName",
      // placeholder: "First Name",
      type: "text",
      txtTransform: "uppercase",
      maxLength: 50,
      // GridProps: {xs:4, sm:2},
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["FirstNameIsRequired"] }],
      },
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) =>
        API?.validateSpecialCharsAndSpaces(columnValue),
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 4,
      },
      name: "LAST_NM",
      label: "MiddleName",
      maxLength: 50,
      // placeholder: "Middle Name",
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) =>
        API?.validateSpecialCharsAndSpaces(columnValue),
    },
    {
      render: {
        componentType: "textField",
        sequence: 6,
      },
      name: "SURNAME",
      label: "LastName",
      maxLength: 50,
      // placeholder: "Last Name",
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) =>
        API?.validateSpecialCharsAndSpaces(columnValue),
    },
    {
      render: {
        componentType: "textField",
        sequence: 7,
      },
      name: "ACCT_NM",
      isReadOnly: true,
      label: "FullName",
      placeholder: "",
      dependentFields: ["FIRST_NM", "LAST_NM", "SURNAME"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let full_name = `${dependentFields?.FIRST_NM?.value} ${dependentFields?.LAST_NM?.value} ${dependentFields?.SURNAME?.value}`;
        return full_name;
      },
      type: "text",
      GridProps: { xs: 12, sm: 5, md: 4, lg: 2.8, xl: 3 },
    },
    {
      render: {
        componentType: "formbutton",
        sequence: 7,
      },
      name: "SEARCH_BTN_ignoreField",
      label: "Search",
      endsIcon: "Search",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      dependentFields: ["ACCT_NM"],
      GridProps: { lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 7,
      },
      name: "GENDER",
      label: "Gender",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["GenderIsRequired"] }],
      },
      dependentFields: ["PREFIX_CD"],
      disableCaching: true,
      options: (dependentValue) => API.getGenderOp(dependentValue),
      _optionsKey: "genderOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 7,
      },
      name: "MARITAL_STATUS",
      label: "MaritalStatus",
      required: true,
      disableCaching: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["MaritalStatusIsRequired"] }],
      },
      placeholder: "",
      options: () => API.getPMISCData("Marital"),
      _optionsKey: "maritalStatus",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 8,
      },
      name: "maidenHeaderdivider_ignoreField",
      label: "MaidenName",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 9,
      },
      name: "MAIDEN_PREFIX_CD",
      label: "Prefix",
      options: () => API.getPMISCData("Salutation"),
      _optionsKey: "PDMaidenSalutation",
      defaultValue: "Miss",
      // placeholder: "Prefix",
      type: "text",
      // GridProps: {xs:12, sm:2.5, md: 2.5, lg: 1.5, xl: 1},
      GridProps: { xs: 12, sm: 4, md: 1, lg: 1, xl: 1 },
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
        componentType: "textField",
        sequence: 10,
      },
      accessor: "MAIDEN_FIRST_NM",
      name: "MAIDEN_FIRST_NM",
      label: "FirstName",
      maxLength: 50,
      // placeholder: "First Name",
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) =>
        API?.validateSpecialCharsAndSpaces(columnValue),
      // schemaValidation: {
      //     type: "string",
      //     rules: [
      //         {name: "required", params: ["field is required"]},
      //     ]
      // }
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 11,
      },
      name: "MAIDEN_MIDDLE_NM",
      label: "MiddleName",
      maxLength: 50,
      // placeholder: "Middle Name",
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) => {
        if (!/^[a-zA-Z0-9\s]*$/.test(columnValue?.value)) {
          return "PleaseEnterCharacterValue";
        }
        return "";
      },
    },
    {
      render: {
        componentType: "textField",
        sequence: 12,
      },
      name: "MAIDEN_LAST_NM",
      label: "LastName",
      maxLength: 50,
      // placeholder: "Last Name",
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) =>
        API?.validateSpecialCharsAndSpaces(columnValue),
    },
    {
      render: {
        componentType: "spacer",
        sequence: 13,
      },
      name: "SPACER1",
      sequence: 14,
      GridProps: {
        xs: 12,
        //   sm: 12,
        //   md: 12,
      },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 14,
      },
      name: "FATHER_SPOUSE",
      label: "FatherOrSpuuseName",
      defaultValue: "01",
      options: [
        { label: "Father", value: "01" },
        { label: "Spouse", value: "02" },
      ],
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 2.5, md: 2, lg: 1.5, xl: 2 },
      postValidationSetCrossFieldValues: (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (field?.value == "01") {
          return { fatherHeaderDivider: { value: "Father Name" } };
        }
        if (field?.value == "02") {
          return { fatherHeaderDivider: { value: "Spouse Name" } };
        }
        return {};
      },
      runPostValidationHookAlways: true,
    },

    {
      render: {
        componentType: "divider",
        sequence: 15,
      },
      name: "fatherHeaderDivider_ignoreField",
      label: "FatherName",
      dependentFields: ["FATHER_SPOUSE"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        console.log(
          "setvalue divider",
          dependentFields?.FATHER_SPOUSE?.optionData[0]?.label
        );
        let dividerText = dependentFields?.FATHER_SPOUSE?.optionData[0]?.label
          ? `${dependentFields?.FATHER_SPOUSE?.optionData[0]?.label} Name`
          : null;
        return dividerText;
      },
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 16,
      },
      name: "FATHER_PREFIX_CD",
      label: "Prefix",
      options: () => API.getPMISCData("Salutation"),
      _optionsKey: "PDFatherSalutation",
      defaultValue: "Mr",
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 2.5, md: 1, lg: 1, xl: 1 },
      // GridProps: {{xs:12, sm:4, md: 3, lg: 2.4, xl:2}},
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
        componentType: "textField",
        sequence: 17,
      },
      name: "FATHER_FIRST_NM",
      label: "FirstName",
      maxLength: 50,
      // placeholder: "First Name",
      type: "text",
      txtTransform: "uppercase",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["FirstNameIsRequired"] }],
      },
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) =>
        API?.validateSpecialCharsAndSpaces(columnValue),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 18,
      },
      name: "FATHER_MIDDLE_NM",
      label: "MiddleName",
      maxLength: 50,
      // placeholder: "Middle Name",
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) => {
        if (!/^[a-zA-Z0-9\s]*$/.test(columnValue?.value)) {
          return "PleaseEnterCharacterValue";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 19,
      },
      name: "FATHER_LAST_NM",
      label: "LastName",
      maxLength: 50,
      // placeholder: "Last Name",
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) =>
        API?.validateSpecialCharsAndSpaces(columnValue),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 20,
      },
      name: "motherHeaderDivider_ignoreField",
      label: "MotherName",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 21,
      },
      name: "MOTHER_PREFIX_CD",
      label: "Prefix",
      options: () => API.getPMISCData("Salutation"),
      _optionsKey: "PDMotherSalutation",
      defaultValue: "Mrs",
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 2.5, md: 1, lg: 1, xl: 1 },
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
        componentType: "textField",
        sequence: 22,
      },
      name: "MOTHER_FIRST_NM",
      label: "FirstName",
      maxLength: 50,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["FirstNameIsRequired"] }],
      },
      // placeholder: "First Name",
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) =>
        API?.validateSpecialCharsAndSpaces(columnValue),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 23,
      },
      name: "MOTHER_MIDDLE_NM",
      label: "MiddleName",
      maxLength: 50,
      // placeholder: "Middle Name",
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) => {
        if (!/^[a-zA-Z0-9\s]*$/.test(columnValue?.value)) {
          return "PleaseEnterCharacterValue";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 24,
      },
      name: "MOTHER_LAST_NM",
      label: "LastName",
      maxLength: 50,
      // placeholder: "Last Name",
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) =>
        API?.validateSpecialCharsAndSpaces(columnValue),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "divider",
        sequence: 25,
      },
      name: "MemberAccoountDetails",
      label: "MemberAccoountDetails",
      ignoreInSubmit: true,
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        return !Boolean(formState?.state?.customerIDctx);
      },
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        name: "MEM_BRANCH_CD",
        sequence: 26,
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};

          return {
            MEM_ACCT_TYPE: { value: "", ignoreUpdate: false },
            MEM_ACCT_CD: { value: "", ignoreUpdate: false },
            MEM_ACCT_NM: { value: "", ignoreUpdate: false },
          };
        },
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          return !Boolean(formState?.state?.customerIDctx);
        },

        GridProps: { xs: 12, sm: 6, md: 2, lg: 1.5, xl: 1.5 },
      },
      accountTypeMetadata: {
        name: "MEM_ACCT_TYPE",
        sequence: 27,
        dependentFields: ["MEM_BRANCH_CD"],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          return {
            MEM_ACCT_CD: { value: "", ignoreUpdate: false },
            MEM_ACCT_NM: { value: "", ignoreUpdate: false },
          };
        },

        shouldExclude(fieldData, dependentFieldsValues, formState) {
          return !Boolean(formState?.state?.customerIDctx);
        },

        GridProps: { xs: 12, sm: 6, md: 2, lg: 1.5, xl: 1.5 },
      },
      accountCodeMetadata: {
        name: "MEM_ACCT_CD",
        sequence: 28,
        dependentFields: ["MEM_ACCT_TYPE", "MEM_BRANCH_CD"],
        runPostValidationHookAlways: true,
        required: true,
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          return !Boolean(formState?.state?.customerIDctx);
        },
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField?.value &&
            dependentFieldValues?.MEM_ACCT_TYPE?.value?.length === 0
          ) {
            let buttonName = await formState?.MessageBox({
              messageTitle: "Alert",
              message: "EnterAccountType",
              buttonNames: ["Ok"],
              icon: "WARNING",
            });

            if (buttonName === "Ok") {
              return {
                MEM_ACCT_CD: {
                  value: "",
                  isFieldFocused: false,
                  ignoreUpdate: false,
                },
                MEM_ACCT_TYPE: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: false,
                },
              };
            }
          } else if (
            dependentFieldValues?.MEM_BRANCH_CD?.value &&
            dependentFieldValues?.MEM_ACCT_TYPE?.value &&
            currentField?.value
          ) {
            const reqParameters = {
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: dependentFieldValues?.MEM_BRANCH_CD?.value ?? "",
              ACCT_TYPE: dependentFieldValues?.MEM_ACCT_TYPE?.value ?? "",
              ACCT_CD: utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldValues?.MEM_ACCT_TYPE?.optionData?.[0] ?? ""
              ),
              SCREEN_REF: formState?.docCD,
              CUSTOMER_ID: formState?.customerIDctx ?? "",
              WORKING_DATE: authState?.workingDate ?? "",
              USERNAME: authState?.user?.id ?? "",
              USERROLE: authState?.role ?? "",
            };
            const postData = await validateShareMemAcct(reqParameters);
            let btn99, returnVal;
            for (let i = 0; i < postData?.MSG.length; i++) {
              if (postData?.MSG[i]?.O_STATUS === "999") {
                const btnName = await formState.MessageBox({
                  messageTitle:
                    postData?.MSG[i]?.O_MSG_TITLE ?? "ValidationFailed",
                  message: postData?.MSG[i]?.O_MESSAGE,
                  icon: "ERROR",
                });
                returnVal = "";
              } else if (postData?.MSG[i]?.O_STATUS === "99") {
                const btnName = await formState.MessageBox({
                  messageTitle: postData?.MSG[i]?.O_MSG_TITLE ?? "Confirmation",
                  message: postData?.MSG[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                  icon: "CONFIRM",
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                  break;
                }
              } else if (postData?.MSG[i]?.O_STATUS === "9") {
                const btnName = await formState.MessageBox({
                  messageTitle: postData?.MSG[i]?.O_MSG_TITLE ?? "Alert",
                  message: postData?.MSG[i]?.O_MESSAGE,
                  icon: "WARNING",
                });
              } else if (postData?.MSG[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData;
                } else {
                  returnVal = "";
                }
              }
            }
            return {
              MEM_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldValues?.MEM_ACCT_TYPE?.optionData?.[0] ??
                          "`  "
                      ),
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: false,
                    },

              MEM_ACCT_NM: {
                value: returnVal?.ACCT_NM ?? "",
                ignoreUpdate: true,
                isFieldFocused: false,
              },
            };
          } else if (!currentField?.value) {
            return {
              MEM_ACCT_NM: { value: "", ignoreUpdate: false },
            };
          }
        },

        validate: (currentField, dependentFields) => {
          if (!Boolean(currentField?.value)) {
            return "AccountNumberRequired";
          }
          return "";
        },
        schemaValidation: {},
        fullWidth: true,
        GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MEM_ACCT_NM",
      label: "AccountName",
      sequence: 28,
      placeholder: "AccountName",
      type: "text",
      isReadOnly: true,
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        return !Boolean(formState?.state?.customerIDctx);
      },
      GridProps: { xs: 12, sm: 6, md: 5, lg: 6, xl: 6 },
    },
  ],
};
export const personal_other_detail_meta_data = {
  form: {
    name: "personal_other_details_form",
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
        componentType: "datePicker",
      },
      name: "BIRTH_DT",
      label: "DateOfBirth",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["DateofBirthIsRequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      isMaxWorkingDate: true,
      validate: (value) => {
        if (Boolean(value?.value)) {
          if (!isValid(value?.value)) {
            return "Mustbeavaliddate";
          } else if (
            greaterThanDate(value?.value, value?._maxDt, {
              ignoreTime: true,
            })
          ) {
            return t("DateShouldBeLessThanEqualToWorkingDT");
          }
        }
      },
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (currentField?.value) {
          const reqParameters = {
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: authState.user.branchCode ?? "",
            BIRTH_DT: Boolean(currentField?.value)
              ? format(
                  new Date(currentField?.value),
                  "dd/MMM/yyyy"
                ).toUpperCase()
              : "",
            WORKING_DATE: authState?.workingDate ?? "",
            CUSTOMER_TYPE: formState?.CustomerType ?? "",
          };
          const postData = await getMinorMajorAgeData(reqParameters);
          let btn99, returnVal;
          const getButtonName = async (obj) => {
            let btnName = await formState.MessageBox(obj);
            return { btnName, obj };
          };
          for (let i = 0; i < postData.length; i++) {
            if (postData[i]?.O_STATUS === "999") {
              await getButtonName({
                messageTitle: postData?.[i]?.O_MSG_TITLE
                  ? postData?.[i]?.O_MSG_TITLE
                  : "ValidationFailed",
                message: postData?.[i]?.O_MESSAGE,
                icon: "ERROR",
              });
              returnVal = "";
            } else if (postData[i]?.O_STATUS === "9") {
              if (btn99 !== "No") {
                await getButtonName({
                  messageTitle: postData?.[i]?.O_MSG_TITLE
                    ? postData?.[i]?.O_MSG_TITLE
                    : "Alert",
                  message: postData?.[i]?.O_MESSAGE,
                  icon: "WARNING",
                });
              }
              returnVal = postData[i];
            } else if (postData[i]?.O_STATUS === "99") {
              const { btnName } = await getButtonName({
                messageTitle: postData?.[i]?.O_MSG_TITLE
                  ? postData?.[i]?.O_MSG_TITLE
                  : "Confirmation",
                message: postData?.[i]?.O_MESSAGE,
                buttonNames: ["Yes", "No"],
                icon: "CONFIRM",
              });

              btn99 = btnName;
              if (btnName === "No") {
                returnVal = "";
              }
            } else if (postData[i]?.O_STATUS === "0") {
              if (btn99 !== "No") {
                returnVal = postData[i];
              } else {
                returnVal = "";
              }
            }
          }
          btn99 = 0;
          const ageFinal = Math.floor(Number(returnVal?.AGE ?? "0")).toString();
          formState?.handleAccTypeVal(returnVal?.ACCT_TYPE);
          return {
            BIRTH_DT: returnVal
              ? {
                  value: currentField?.value,
                  isFieldFocused: false,
                  ignoreUpdate: true,
                }
              : {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: false,
                },
            LF_NO: {
              value: returnVal?.LF_NO ?? "",
              ignoreUpdate: false,
            },
            AGE: { value: ageFinal ?? "", ignoreUpdate: false },
          };
        } else if (!currentField?.value) {
          return {
            LF_NO: {
              value: "",
              ignoreUpdate: false,
            },
            AGE: { value: "", ignoreUpdate: false },
          };
        }
        return {};
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "AGE",
      label: "Age",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      dependentFields: ["BIRTH_DT"],
    },
    {
      render: {
        componentType: "select",
      },
      options: [
        { label: "Minor", value: "M" },
        { label: "Major", value: "J" },
        { label: "Sr. Citizen", value: "S" },
      ],
      isReadOnly: true,
      name: "LF_NO",
      label: "Minor/Major",
      placeholder: "",
      type: "text",
      // GridProps: {xs: 4, sm:3},
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "BLOOD_GRP_CD",
      label: "BloodGroup",
      placeholder: "",
      options: () => API.getPMISCData("Blood"),
      _optionsKey: "bloodGroup",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "NATIONALITY",
      label: "Nationality",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["NationalityIsRequired"] }],
      },
      placeholder: "",
      options: (dependentValue, formState, _, authState) =>
        API.getCountryOptions(
          authState?.companyID,
          authState?.user?.branchCode
        ),
      _optionsKey: "countryOptions",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "RESIDENCE_STATUS",
      label: "ResidenceStatus",
      required: true,
      placeholder: "",
      options: () => API.getPMISCData("RESIDE_STATUS"),
      _optionsKey: "ResisdenceStatus",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ResidenceStatusIsRequired"] }],
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "TRADE_CD",
      label: "Occupation",
      options: (dependentValue, formState, _, authState) =>
        API.getOccupationDTL(authState?.companyID, authState?.user?.branchCode),
      _optionsKey: "occupationOp",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["OccupationIsRequired"] }],
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "GROUP_CD",
      label: "Group",
      placeholder: "",
      options: (dependentValue, formState, _, authState) =>
        API.getCustomerGroupOptions(
          authState?.companyID,
          authState?.user?.branchCode
        ),
      _optionsKey: "GroupOptions",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
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
        componentType: "datePicker",
      },
      name: "KYC_REVIEW_DT",
      label: "KycRevisedDate",
      // required: true,
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
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["KYCRevisedDateIsRequired"] }],
      // },
      // placeholder: "",
      // type: "datePicker",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      options: () => API.getPMISCData("CKYC_RISK_CATEG"),
      _optionsKey: "ckycRiskCategOptions",
      name: "RISK_CATEG",
      label: "RiskCategory",
      // isReadOnly: true,
      // required: true,
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "DATE_OF_DEATH",
      label: "DateOfDeath",
      placeholder: "DD/MM/YYYY",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      validate: (currentField, dependentFields, formState) => {
        if (
          Boolean(currentField?.value) &&
          !utilFunction.isValidDate(
            utilFunction.getParsedDate(currentField?.value)
          )
        ) {
          return "Mustbeavaliddate";
        } else if (
          greaterThanDate(
            new Date(currentField.value),
            new Date(formState?.WORKING_DATE),
            {
              ignoreTime: true,
            }
          )
        ) {
          return "DateofDeathcannotbeFutureDate";
        }
        return "";
      },
      __NEW__: {
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          return true;
        },
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      sequence: 1,
      type: "text",
      label: "Other Details",
      multiline: true,
      minRows: 2,
      maxRows: 5,
      GridProps: { xs: 12, md: 12, sm: 12, xl: 12, lg: 12 },
    },
  ],
};

// controlling person  - individual details - view
export const personal_individual_detail_metadata = {
  form: {
    name: "personal_detail_controlling_form",
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
        componentType: "divider",
        sequence: 1,
      },
      name: "prefixDivider_ignoreField",
      label: "Prefix",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "select",
        sequence: 2,
      },
      name: "PREFIX_CD",
      label: "Prefix",
      // placeholder: "Prefix",
      options: () => API.GetDynamicSalutationData("Salutation"),
      _optionsKey: "PDPrefix",
      type: "text",
      // GridProps: {xs:12, sm:2.5, md: 2.5, lg: 1.5, xl: 1 },
      GridProps: { xs: 12, sm: 4, md: 1, lg: 1, xl: 1 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["PrefixIsRequired"] }],
      },
      postValidationSetCrossFieldValues: (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (field.value) {
          return {
            GENDER: { value: field?.optionData[0]?.SET_GENDER ?? "" },
            MARITAL_STATUS: {
              value: field?.optionData[0]?.SET_MARITIAL_STATUS ?? "",
            },
          };
        }
        return {};
      },
      runPostValidationHookAlways: true,
      // GridProps: {xs:12, sm:2, md: 1, lg: 1, xl:0.5},
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
        componentType: "textField",
        sequence: 3,
      },
      name: "FIRST_NM",
      label: "FirstName",
      // placeholder: "First Name",
      type: "text",
      maxLength: 50,
      // GridProps: {xs:4, sm:2},
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["FirstNameIsRequired"] }],
      },
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 4,
      },
      name: "LAST_NM",
      label: "MiddleName",
      maxLength: 50,
      // placeholder: "Middle Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 6,
      },
      name: "SURNAME",
      label: "LastName",
      maxLength: 50,
      // placeholder: "Last Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 7,
      },
      name: "ACCT_NM",
      isReadOnly: true,
      label: "FullName",
      placeholder: "",
      dependentFields: ["FIRST_NM", "LAST_NM", "SURNAME"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let full_name = `${dependentFields?.FIRST_NM?.value} ${dependentFields?.LAST_NM?.value} ${dependentFields?.SURNAME?.value}`;
        return full_name;
      },
      type: "text",
      GridProps: { xs: 12, sm: 5, md: 4, lg: 2.8, xl: 3 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 7,
      },
      name: "GENDER",
      label: "Gender",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["GenderIsRequired"] }],
      },
      dependentFields: ["PREFIX_CD"],
      disableCaching: true,
      options: (dependentValue) => API.getGenderOp(dependentValue),
      _optionsKey: "genderOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 7,
      },
      name: "MARITAL_STATUS",
      label: "MaritalStatus",
      required: true,
      dependentFields: ["PREFIX_CD"],
      disableCaching: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["MaritalStatusIsRequired"] }],
      },
      placeholder: "",
      options: (dependentValue) => API.getPMISCData("Marital", dependentValue),
      _optionsKey: "maritalStatus",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 8,
      },
      name: "maidenHeaderdivider_ignoreField",
      label: "MaidenName",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 9,
      },
      name: "MAIDEN_PREFIX_CD",
      label: "Prefix",
      options: () => API.getPMISCData("Salutation"),
      _optionsKey: "PDMaidenSalutation",
      defaultValue: "Miss",
      // placeholder: "Prefix",
      type: "text",
      // GridProps: {xs:12, sm:2.5, md: 2.5, lg: 1.5, xl: 1},
      GridProps: { xs: 12, sm: 4, md: 1, lg: 1, xl: 1 },
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
        componentType: "textField",
        sequence: 10,
      },
      accessor: "MAIDEN_FIRST_NM",
      name: "MAIDEN_FIRST_NM",
      label: "FirstName",
      // placeholder: "First Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue)) {
          return "This field is required.";
        }
        return "";
      },
      // schemaValidation: {
      //     type: "string",
      //     rules: [
      //         {name: "required", params: ["field is required"]},
      //     ]
      // }
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 11,
      },
      name: "MAIDEN_MIDDLE_NM",
      label: "MiddleName",
      // placeholder: "Middle Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 12,
      },
      name: "MAIDEN_LAST_NM",
      label: "LastName",
      // placeholder: "Last Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "spacer",
        sequence: 13,
      },
      name: "SPACER2",
      sequence: 14,
      GridProps: {
        xs: 12,
        //   sm: 12,
        //   md: 12,
      },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 14,
      },
      name: "FATHER_SPOUSE",
      label: "FatherOrSpuuseName",
      defaultValue: "01",
      options: [
        { label: "Father", value: "01" },
        { label: "Spouse", value: "02" },
      ],
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 2.5, md: 2, lg: 1.5, xl: 2 },
      postValidationSetCrossFieldValues: (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (field?.value == "01") {
          return { fatherHeaderDivider: { value: "Father Name" } };
        }
        if (field?.value == "02") {
          return { fatherHeaderDivider: { value: "Spouse Name" } };
        }
        return {};
      },
      runPostValidationHookAlways: true,
    },

    {
      render: {
        componentType: "divider",
        sequence: 15,
      },
      name: "fatherHeaderDivider_ignoreField",
      label: "FatherName",
      // dependentFields: ["FATHER_SPOUSE"],
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //     console.log("setvalue divider", dependentFields?.FATHER_SPOUSE?.optionData[0]?.label)
      //     let dividerText = dependentFields?.FATHER_SPOUSE?.optionData[0]?.label ? `${dependentFields?.FATHER_SPOUSE?.optionData[0]?.label} Name` : null
      //     return dividerText;
      // },
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 16,
      },
      name: "FATHER_PREFIX_CD",
      label: "Prefix",
      options: () => API.getPMISCData("Salutation"),
      _optionsKey: "PDFatherSalutation",
      defaultValue: "Mr",
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 2.5, md: 1, lg: 1, xl: 1 },
      // GridProps: {{xs:12, sm:4, md: 3, lg: 2.4, xl:2}},
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
        componentType: "textField",
        sequence: 17,
      },
      name: "FATHER_FIRST_NM",
      label: "FirstName",
      // placeholder: "First Name",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["FirstNameIsRequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 18,
      },
      name: "FATHER_MIDDLE_NM",
      label: "MiddleName",
      // placeholder: "Middle Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 19,
      },
      name: "FATHER_LAST_NM",
      label: "LastName",
      // placeholder: "Last Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 20,
      },
      name: "motherHeaderDivider_ignoreField",
      label: "MotherName",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 21,
      },
      name: "MOTHER_PREFIX_CD",
      label: "Prefix",
      options: () => API.getPMISCData("Salutation"),
      _optionsKey: "PDMotherSalutation",
      defaultValue: "Mrs",
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 2.5, md: 1, lg: 1, xl: 1 },
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
        componentType: "textField",
        sequence: 22,
      },
      name: "MOTHER_FIRST_NM",
      label: "FirstName",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["FirstNameIsRequired"] }],
      },
      // placeholder: "First Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 23,
      },
      name: "MOTHER_MIDDLE_NM",
      label: "MiddleName",
      // placeholder: "Middle Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 24,
      },
      name: "MOTHER_LAST_NM",
      label: "LastName",
      // placeholder: "Last Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
  ],
};

// GRID METADATA
export const personal_document_details_data: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Customer Searching",
    rowIdColumn: "CUST_ID",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "42vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
  },
  // filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "DOCUMENT",
      columnName: "Document",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "IS_SUBMIT",
      columnName: "Submit",
      sequence: 3,
      alignment: "center",
      componentType: "editableCheckbox",
      isReadOnly: true,
      width: 80,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      accessor: "CUST_NAME",
      columnName: "CustName",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "DOCUMENT_NO",
      columnName: "DocumentNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "VALID_TILL_DATE",
      columnName: "ValidTillDate",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "EnteredDate",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
  ],
};

export const IdtpChargeConfigGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Documents",
    rowIdColumn: "SR_NO",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "68vh",
      max: "68vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "id",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "DOCUMENT",
      columnName: "Document",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 150,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "SUBMIT",
      columnName: "Submit",
      sequence: 3,
      alignment: "left",
      componentType: "editableCheckbox",
      placeholder: "",
      width: 100,
      minWidth: 150,
      maxWidth: 400,
    },
    {
      accessor: "DOCUMENT_NO",
      columnName: "DocumentNo",
      sequence: 4,
      alignment: "left",
      componentType: "editableTextField",
      placeholder: "",
      width: 200,
      minWidth: 100,
      maxWidth: 300,
      isReadOnly: true,
    },

    {
      accessor: "VALID_TILL_DATE",
      columnName: "ValidTillDate",
      sequence: 8,
      alignment: "left",
      componentType: "editableSelect",
      // options: () => GeneralAPI.GetChargeTemplates(),
      // _optionsKey: "GetChargeTemplates",
      placeholder: "",
      width: 170,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "EnteredDate",
      sequence: 8,
      alignment: "left",
      componentType: "editableSelect",
      // options: () => GeneralAPI.GetChargeTemplates(),
      // _optionsKey: "GetChargeTemplates",
      placeholder: "",
      width: 170,
      minWidth: 80,
      maxWidth: 200,
    },
    // {
    //     accessor: "VAT_PERC",
    //     columnName: "VAT Percentage",
    //     sequence: 8,
    //     alignment: "left",
    //     componentType: "editableTextField",
    //     placeholder: "",
    //     width: 140,
    //     minWidth: 80,
    //     maxWidth: 200,
    // },
    {
      columnName: "Action",
      componentType: "deleteRowCell",
      accessor: "_hidden",
      sequence: 12,
    },
    {
      columnName: "",
      componentType: "buttonRowCell",
      accessor: "SPECIAL_AMOUNT",
      sequence: 11,
      buttonLabel: "Special Amount",
      isVisible: true,
      // __EDIT__: { isVisible: true },
    },
  ],
};
