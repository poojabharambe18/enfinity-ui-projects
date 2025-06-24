import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";
import { GeneralAPI } from "registry/fns/functions";
import { validateAccountAndGetDetail } from "../api";
import { greaterThanDate, lessThanInclusiveDate } from "@acuteinfo/common-base";
import { utilFunction } from "@acuteinfo/common-base";

const getReadOnlyValue = (dependentField, fieldName) => {
  const newDependentField =
    utilFunction.getDependetFieldDataArrayField(dependentField);
  if (newDependentField?.[fieldName]?.value === "Y") {
    return true;
  }
  return false;
};
export const FixDepositDetailFormMetadata = {
  form: {
    name: "fixDepositDetail",
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
          sm: 4,
          md: 4,
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
        componentType: "spacer",
      },
      name: "SPACER",
      GridProps: { xs: 0, md: 10, sm: 10, lg: 10, xl: 10 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL_FD_AMOUNT",
      label: "Total FD Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 1.5 },
      dependentFields: ["FDDTL"],
      postValidationSetCrossFieldValues: async (
        currentFieldState,
        formState,
        auth,
        dependentFieldState
      ) => {
        let accumulatedTakeoverLoanAmount = (
          Array.isArray(dependentFieldState?.["FDDTL"])
            ? dependentFieldState?.["FDDTL"]
            : []
        ).reduce((accum, obj) => accum + Number(obj.FD_AMOUNT?.value), 0);

        if (
          Number(currentFieldState.value) ===
          Number(accumulatedTakeoverLoanAmount)
        ) {
          return {};
        }
        if (accumulatedTakeoverLoanAmount) {
          return {
            TOTAL_FD_AMOUNT: {
              value: accumulatedTakeoverLoanAmount ?? 0,
            },
          };
        } else {
          return {
            TOTAL_FD_AMOUNT: {
              value: "",
            },
          };
        }
      },
    },
    {
      render: {
        componentType: "arrayField",
      },
      name: "FDDTL",
      removeRowFn: "deleteFormArrayFieldData",
      fixedRows: true,
      // isCustomStyle: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH_CD",
          label: "Branch",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Branch is required."] },
              { name: "BRANCH_CD", params: ["Branch is required."] },
            ],
          },
          GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_TYPE",
          label: "Account Type",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Account Type is required."] },
              { name: "ACCT_TYPE", params: ["Account Type is required."] },
            ],
          },
          GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_CD",
          label: "Account Number",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Account Number is required."] },
              { name: "ACCT_CD", params: ["Account Number is required."] },
            ],
          },
          GridProps: { xs: 12, sm: 1, md: 1, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "FD_NO",
          label: "FD Number",
          className: "textInputFromRight",
          placeholder: "",
          maxLength: 10,
          dependentFields: ["FD_NO_DISABLED"],
          isReadOnly: (field, dependentField) => {
            return getReadOnlyValue(dependentField, "FD_NO_DISABLED");
          },
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 10) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
            isValidation: "no",
          },
          GridProps: { xs: 12, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_NM",
          label: "Account Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,

          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "FD_AMOUNT",
          label: "Transfer Amount",
          placeholder: "",
          type: "text",
          isFieldFocused: true,
          required: true,
          FormatProps: {
            allowNegative: false,
          },
          validationRun: "all",
          validate: (columnValue) => {
            if (!Boolean(columnValue.value)) {
              return "Transfer Amount is Required.";
            } else if (columnValue.value <= 0) {
              return "Transfer Amount must be greater than zero.";
            }
            return "";
          },
          postValidationSetCrossFieldValues: async (...arr) => {
            if (arr[0].value) {
              return {
                TOTAL_FD_AMOUNT: { value: arr[0].value ?? "0" },
              };
            } else {
              return {
                TOTAL_FD_AMOUNT: { value: "" },
              };
            }
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "TRAN_DT",
          label: "AsOn Date",
          placeholder: "",
          format: "dd/MM/yyyy",
          defaultValue: new Date(),
          type: "text",
          fullWidth: true,
          maxDate: new Date(),
          maxLength: 6,
          defaultfocus: true,
          required: true,
          dependentFields: [
            "COMP_CD",
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "PERIOD_NO",
            "PERIOD_CD",
            "FD_AMOUNT",
            "TRAN_DT_DISABLED",
            "FROM_TRAN_DT",
            "TO_TRAN_DT",
          ],
          isReadOnly: (field, dependentField) => {
            return getReadOnlyValue(dependentField, "TRAN_DT_DISABLED");
          },
          postValidationSetCrossFieldValues: async (
            currField,
            formState,
            auth,
            dependentFields
          ) => {
            let postData = await GeneralAPI.getFDInterest(
              currField,
              dependentFields
            );
            return postData;
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["AsOn Date is required."] },
              { name: "TRAN_DT", params: ["AsOn Date is required."] },
            ],
          },
          validate: (currField, dependentFields) => {
            const newDependentField: any =
              utilFunction.getDependetFieldDataArrayField(dependentFields);
            let tranDate: any = format(currField?.value, "yyyy/MM/dd");
            let fromTranDate = newDependentField?.FROM_TRAN_DT?.value;
            let toTranDate = newDependentField?.TO_TRAN_DT?.value;

            if (utilFunction.isValidDate(fromTranDate)) {
              fromTranDate = format(new Date(fromTranDate), "yyyy/MM/dd");
              if (
                !greaterThanDate(new Date(tranDate), new Date(fromTranDate))
              ) {
                // Calculate the difference in milliseconds
                var diffms =
                  new Date(toTranDate).getTime() -
                  new Date(fromTranDate).getTime();
                // Convert milliseconds to days
                var diffDays = Math.ceil(diffms / (1000 * 60 * 60 * 24));
                return (
                  "AsOn Date should not be less than " + diffDays + " days."
                );
              }
            }
            if (utilFunction.isValidDate(toTranDate)) {
              toTranDate = format(new Date(toTranDate), "yyyy/MM/dd");
              if (
                toTranDate &&
                !lessThanInclusiveDate(new Date(tranDate), new Date(toTranDate))
              ) {
                return "AsOn Date should be less Than or equal to working Date.";
              }
            }
            return "";
          },
          GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "select",
          },
          name: "PERIOD_CD",
          label: "Period/Tenor",
          options: [
            { label: "Day(s)", value: "D" },
            { label: "Month(s)", value: "M" },
            { label: "Year(s)", value: "Y" },
          ],
          defaultValue: "D",
          required: true,
          dependentFields: [
            "COMP_CD",
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "TRAN_DT",
            "PERIOD_NO",
            "FD_AMOUNT",
          ],
          postValidationSetCrossFieldValues: async (
            currField,
            formState,
            auth,
            dependentFields
          ) => {
            let postData = await GeneralAPI.getFDInterest(
              currField,
              dependentFields
            );
            return postData;
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Period/Tenor is required."] },
              { name: "PERIOD_CD", params: ["Please select Period/Tenor"] },
            ],
          },
          GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "PERIOD_NO",
          label: "Tenor",
          className: "textInputFromRight",
          placeholder: "",
          maxLength: 4,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 4) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
            isValidation: "no",
          },
          required: true,
          dependentFields: [
            "COMP_CD",
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "TRAN_DT",
            "PERIOD_CD",
            "FD_AMOUNT",
          ],
          postValidationSetCrossFieldValues: async (
            currField,
            formState,
            auth,
            dependentFields
          ) => {
            let postData = await GeneralAPI.getFDInterest(
              currField,
              dependentFields
            );
            return postData;
          },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Tenor is Required."] }],
          },
          GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
        },
        {
          render: {
            componentType: "rateOfInt",
          },
          name: "INT_RATE",
          label: "Interest Rate",
          placeholder: "",
          required: true,
          type: "text",
          dependentFields: ["INT_RATE_DISABLED"],
          isReadOnly: (field, dependentField) => {
            return getReadOnlyValue(dependentField, "INT_RATE_DISABLED");
          },
          postValidationSetCrossFieldValues: async (currField) => {
            if (Boolean(currField?.value) && currField?.value > 0) {
              return {
                GETFDMATUREAMOUNT: {
                  value: new Date().getTime(),
                },
              };
            }
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Interest Rate is Required."] },
            ],
          },
          GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
        },
        {
          render: {
            componentType: "select",
          },
          name: "TERM_CD",
          label: "Interest Term",
          options: [
            { label: "MONTHLY", value: "M" },
            { label: "QUARTERLY", value: "Q" },
            { label: "HALF-YEARLY", value: "H" },
            { label: "YEARLY", value: "Y" },
          ],
          defaultValue: "D",
          required: true,
          dependentFields: ["TERM_CD_DISABLED"],
          isReadOnly: (field, dependentField) => {
            return getReadOnlyValue(dependentField, "TERM_CD_DISABLED");
          },
          postValidationSetCrossFieldValues: async (currField) => {
            if (Boolean(currField?.value)) {
              return {
                GETFDMATUREAMOUNT: {
                  value: new Date().getTime(),
                },
              };
            }
          },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Interest Term is required."] },
              { name: "TERM_CD", params: ["Please select Interest Term"] },
            ],
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "MONTHLY_INT",
          label: "Month Interest",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "MATURITY_DT",
          label: "Maturity Date",
          placeholder: "",
          format: "dd/MM/yyyy",
          isReadOnly: true,
          fullWidth: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "CR_COMP_CD",
        },
        {
          render: {
            componentType: "_accountNumber",
          },
          branchCodeMetadata: {
            name: "CR_BRANCH_CD",
            label: "Credit A/c Branch",
            required: false,
            dependentFields: ["MATURE_INST"],
            schemaValidation: {},
            validate: (currField, dependentFields) => {
              const depFields =
                utilFunction.getDependetFieldDataArrayField(dependentFields);
              const matureInst = depFields?.["MATURE_INST"]?.value ?? "";
              if (matureInst !== "AM" && matureInst !== "NO") {
                if (!Boolean(currField?.value ?? "")) {
                  return "Credit A/c Branch Can't be blank.";
                }
              }
              return "";
            },
            postValidationSetCrossFieldValues: () => {
              return {
                CR_ACCT_TYPE: { value: "" },
                CR_ACCT_CD: { value: "", ignoreUpdate: true },
                CR_ACCT_NM: { value: "" },
              };
            },
            GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
          },
          accountTypeMetadata: {
            name: "CR_ACCT_TYPE",
            label: "Credit A/c Type",
            required: false,
            dependentFields: ["MATURE_INST"],
            schemaValidation: {},
            validate: (currField, dependentFields, formState) => {
              const depFields =
                utilFunction.getDependetFieldDataArrayField(dependentFields);
              const matureInst = depFields?.["MATURE_INST"]?.value ?? "";
              if (matureInst !== "AM" && matureInst !== "NO") {
                if (!Boolean(currField?.value ?? "")) {
                  return "Credit A/c Type Can't be blank.";
                }
              }
              return "";
            },
            postValidationSetCrossFieldValues: () => {
              return {
                CR_ACCT_CD: { value: "", ignoreUpdate: true },
                CR_ACCT_NM: { value: "" },
              };
            },
            GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
          },
          accountCodeMetadata: {
            name: "CR_ACCT_CD",
            label: "Credit A/c No.",
            required: false,
            schemaValidation: {},
            dependentFields: [
              "COMP_CD",
              "CR_BRANCH_CD",
              "CR_ACCT_TYPE",
              "MATURE_INST",
            ],
            postValidationSetCrossFieldValues: async (...arg) => {
              const companyCode = arg?.[3]?.["FDDTL.COMP_CD"]?.value ?? "";
              const branchCode = arg?.[3]?.["FDDTL.CR_BRANCH_CD"]?.value ?? "";
              const accountType = arg?.[3]?.["FDDTL.CR_ACCT_TYPE"]?.value ?? "";
              let accountCode = arg?.[0]?.value;

              if (
                Boolean(companyCode) &&
                Boolean(branchCode) &&
                Boolean(accountType) &&
                accountCode
              ) {
                accountCode = utilFunction.getPadAccountNumber(
                  accountCode,
                  arg?.[3]?.["FDDTL.CR_ACCT_TYPE"]?.optionData
                );
                const apiResponse = await validateAccountAndGetDetail(
                  companyCode,
                  branchCode,
                  accountType,
                  accountCode,
                  "FD_CR_ACT"
                );
                if (apiResponse?.status === "0") {
                  if (Boolean(apiResponse?.message)) {
                    arg?.[1]?.MessageBox({
                      messageTitle: "Information",
                      message: apiResponse?.message.startsWith("\n")
                        ? apiResponse?.message?.slice(1)
                        : apiResponse?.message,
                    });
                  }
                  return {
                    CR_ACCT_CD: {
                      value: accountCode,
                      isErrorBlank: true,
                      ignoreUpdate: true,
                    },
                    CR_ACCT_NM: {
                      value: apiResponse?.data?.[0]?.ACCT_NM ?? "",
                    },
                  };
                } else {
                  return {
                    CR_ACCT_CD: {
                      value: "",
                      error: apiResponse?.message ?? "",
                      ignoreUpdate: true,
                      isFieldFocused: true,
                    },
                    CR_ACCT_NM: { value: "" },
                  };
                }
              }
            },
            validate: (currField, dependentFields) => {
              const depFields =
                utilFunction.getDependetFieldDataArrayField(dependentFields);
              const matureInst = depFields?.["MATURE_INST"]?.value ?? "";
              if (matureInst !== "AM" && matureInst !== "NO") {
                if (!Boolean(currField?.value ?? "")) {
                  return "Credit Account Can't be blank.";
                }
              }
              return "";
            },
            GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CR_ACCT_NM",
          label: "Credit A/c Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "MATURITY_AMT",
          label: "Maturity Amount",
          type: "text",
          required: true,
          FormatProps: {
            allowNegative: false,
          },
          dependentFields: ["MATURITY_AMT_DISABLED"],
          isReadOnly: (field, dependentField) => {
            return getReadOnlyValue(dependentField, "MATURITY_AMT_DISABLED");
          },
          validate: (columnValue) => {
            if (!Boolean(columnValue.value)) {
              return "Maturity Amount is Required.";
            } else if (columnValue.value <= 0) {
              return "Maturity Amount must be greater than zero.";
            }
            return "";
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "select",
          },
          name: "MATURE_INST",
          label: "Mature Instruction",
          type: "text",
          dependentFields: ["BRANCH_CD", "ACCT_TYPE"],
          disableCaching: true,
          options: "getMatureInstDetail",
          fullWidth: true,
          schemaValidation: {
            type: "string",
            rules: [
              {
                name: "required",
                params: ["FD Mature Instruction is required."],
              },
              {
                name: "MATURE_INST",
                params: ["Please select FD Mature Instruction"],
              },
            ],
          },
          postValidationSetCrossFieldValues: async (currField) => {
            if (Boolean(currField?.value)) {
              return {
                CR_BRANCH_CD: {
                  isErrorBlank: true,
                },
                CR_ACCT_TYPE: {
                  isErrorBlank: true,
                },
                CR_ACCT_CD: {
                  isErrorBlank: true,
                },
              };
            }
          },
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 3.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "FD_REMARK",
          label: "FD Remark",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "NOMINEE_NM",
          label: "Nominee Name",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 1.5 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "COMP_CD",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "CATEG_CD",
        },
        {
          render: {
            componentType: "textField",
          },
          name: "GETFDMATUREAMOUNT",
          validationRun: "all",
          shouldExclude() {
            return true;
          },
          dependentFields: [
            "COMP_CD",
            "BRANCH_CD",
            "ACCT_TYPE",
            "ACCT_CD",
            "CATEG_CD",
            "TRAN_DT",
            "FD_AMOUNT",
            "PERIOD_CD",
            "PERIOD_NO",
            "TERM_CD",
            "INT_RATE",
            "MATURITY_DT",
          ],
          postValidationSetCrossFieldValues: async (
            currField,
            formState,
            auth,
            dependentFields
          ) => {
            if (!Boolean(dependentFields?.["FDDTL.TRAN_DT"]?.value ?? ""))
              return {};
            if (!Boolean(dependentFields?.["FDDTL.FD_AMOUNT"]?.value ?? ""))
              return {};
            if (!Boolean(dependentFields?.["FDDTL.PERIOD_CD"]?.value ?? ""))
              return {};
            if (!Boolean(dependentFields?.["FDDTL.PERIOD_NO"]?.value ?? ""))
              return {};
            if (!Boolean(dependentFields?.["FDDTL.TERM_CD"]?.value ?? ""))
              return {};
            if (!Boolean(dependentFields?.["FDDTL.INT_RATE"]?.value ?? ""))
              return {};
            if (!Boolean(dependentFields?.["FDDTL.MATURITY_DT"]?.value ?? ""))
              return {};
            const { data, status, message } = await AuthSDK.internalFetcher(
              "GETFDMATUREAMOUNT",
              {
                COMP_CD: dependentFields?.["FDDTL.COMP_CD"]?.value ?? "",
                BRANCH_CD: dependentFields?.["FDDTL.BRANCH_CD"]?.value ?? "",
                ACCT_TYPE: dependentFields?.["FDDTL.ACCT_TYPE"]?.value ?? "",
                ACCT_CD: dependentFields?.["FDDTL.ACCT_CD"]?.value ?? "",
                CATEG_CD: dependentFields?.["FDDTL.CATEG_CD"]?.value ?? "",
                TRAN_DT: dependentFields?.["FDDTL.TRAN_DT"]?.value ?? "",
                FD_AMOUNT: dependentFields?.["FDDTL.FD_AMOUNT"]?.value ?? "",
                PERIOD_CD: dependentFields?.["FDDTL.PERIOD_CD"]?.value ?? "",
                PERIOD_NO: dependentFields?.["FDDTL.PERIOD_NO"]?.value ?? "",
                TERM_CD: dependentFields?.["FDDTL.TERM_CD"]?.value ?? "",
                INT_RATE: dependentFields?.["FDDTL.INT_RATE"]?.value ?? "",
                MATURITY_DT: format(
                  dependentFields?.["FDDTL.MATURITY_DT"]?.value ?? "",
                  "dd/MMM/yyyy"
                ),
              }
            );
            if (status === "0") {
              return {
                MATURITY_AMT: {
                  value: data?.[0]?.MATURITY_AMT ?? "",
                },
                MONTHLY_INT: {
                  value: data?.[0]?.MONTHLY_INT ?? "",
                },
              };
            } else {
              return {
                MATURITY_AMT: {
                  value: "",
                },
                MONTHLY_INT: {
                  value: "",
                },
              };
            }
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "INT_RATE_DISABLED",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "MATURITY_AMT_DISABLED",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "FD_NO_DISABLED",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TRAN_DT_DISABLED",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TERM_CD_DISABLED",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "FROM_TRAN_DT",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TO_TRAN_DT",
        },
      ],
    },
  ],
};
