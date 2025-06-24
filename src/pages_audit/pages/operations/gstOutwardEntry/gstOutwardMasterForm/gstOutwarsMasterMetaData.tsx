import * as API from "../api";
import { utilFunction } from "@acuteinfo/common-base";
export const GstOutwardForm = {
  masterForm: {
    form: {
      name: "master-gst-form",
      label: "",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
      render: {
        ordering: "auto",
        renderType: "simple",
        gridConfig: {
          item: {
            xs: 12,
            sm: 4,
            md: 4,
            lg: 4,
            xl: 4,
          },
          container: {
            direction: "row",
            spacing: 1,
          },
        },
      },
    },
    fields: [
      {
        render: {
          componentType: "autocomplete",
        },
        name: "MODE",
        label: "Mode",
        required: true,
        placeholder: "SelectMode",
        isFieldFocused: true,
        fullWidth: true,
        options: (dependentValue, formState, _, authState) => {
          return API.getGstOtwardModeDdw({
            BASE_COMP_CD: authState?.baseCompanyID,
            BASE_BRANCH_CD: authState?.user?.baseBranchCode,
            TEMPLATE_TYPE: "OUT",
          });
        },
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          formState.setDataOnFieldChange("GET_DATA", {
            MODE_VALUE: currentField?.value,
          });
        },
        runPostValidationHookAlways: true,
        __EDIT__: {
          isReadOnly: true,
        },
        defaultValue: "T",
        _optionsKey: "getGstOtwardModeDdw",
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["ModeisRequired"] }],
        },
        GridProps: {
          xs: 12,
          md: 2.4,
          sm: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
      },
      {
        render: {
          componentType: "datePicker",
        },
        name: "ENTERED_DATE",
        label: "EntryDate",
        __NEW__: {
          isWorkingDate: true,
        },
        fullWidth: true,
        format: "dd/MM/yyyy",
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 2.4,
          sm: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
      },
      {
        render: { componentType: "_accountNumber" },
        branchCodeMetadata: {
          name: "BRANCH_CD",
          dependentFields: ["MODE"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.["MODE"]?.value === "C") {
              return true;
            } else {
              return false;
            }
          },
          isReadOnly: (fieldValue, dependentFields, formState) => {
            if (formState?.defaultView === "edit") {
              return true;
            }
          },
          runPostValidationHookAlways: true,
          postValidationSetCrossFieldValues: (
            currentField,
            formState,
            authState,
            dependentFieldValue,
            reqFlag
          ) => {
            if (formState?.isSubmitting) return {};
            if (currentField?.value) {
              return {
                ACCT_CD: { value: "" },
                ACCT_NM: { value: "" },
                WIDTH_BAL: { value: "" },
                ACCT_TYPE: { value: "" },
                GSTIN: { value: "" },
              };
            }
          },
          GridProps: {
            xs: 12,
            sm: 2.4,
            md: 2.4,
            lg: 2.4,
            xl: 2.4,
          },
        },
        accountTypeMetadata: {
          name: "ACCT_TYPE",
          dependentFields: ["MODE"],
          isReadOnly: (fieldValue, dependentFields, formState) => {
            if (formState?.defaultView === "edit") {
              return true;
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.["MODE"]?.value === "C") {
              return true;
            } else {
              return false;
            }
          },
          postValidationSetCrossFieldValues: (
            currentField,
            formState,
            authState,
            dependentFieldValue,
            reqFlag
          ) => {
            if (formState?.isSubmitting) return {};
            if (currentField?.value) {
              return {
                ACCT_CD: { value: "" },
                ACCT_NM: { value: "" },
                WIDTH_BAL: { value: "" },
                GSTIN: { value: "" },
              };
            }
          },
          GridProps: {
            xs: 12,
            sm: 2.4,
            md: 2.4,
            lg: 2.4,
            xl: 2.4,
          },
        },
        accountCodeMetadata: {
          name: "ACCT_CD",
          autoComplete: "off",
          dependentFields: ["BRANCH_CD", "ACCT_TYPE", "MODE"],
          isReadOnly: (fieldValue, dependentFields, formState) => {
            if (formState?.defaultView === "edit") {
              return true;
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.["MODE"]?.value === "C") {
              return true;
            } else {
              return false;
            }
          },
          runPostValidationHookAlways: true,
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};
            if (
              dependentFieldValues?.BRANCH_CD?.value &&
              dependentFieldValues?.ACCT_TYPE?.value &&
              currentField?.value &&
              dependentFieldValues?.MODE?.value === "T" &&
              formState?.defaultView === "new"
            ) {
              const reqParameters = {
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value ?? "",
                ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value ?? "",
                ACCT_CD:
                  utilFunction.getPadAccountNumber(
                    currentField?.value,
                    dependentFieldValues?.ACCT_TYPE?.optionData?.[0] ?? ""
                  ) ?? "",
                SCREEN_REF: formState?.docCD ?? "",
                ENT_COMP_CD: authState?.companyID ?? "",
                ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
                WORKING_DATE: authState?.workingDate ?? "",
                USERNAME: authState?.user?.id ?? "",
                USERROLE: authState?.role ?? "",
              };
              formState.handleButtonDisable(true);
              const postData = await API.getAccountDetail(reqParameters);
              let btn99, returnVal;
              for (let i = 0; i < postData?.length; i++) {
                if (postData?.[i]?.O_STATUS === "999") {
                  formState?.handleButtonDisable(false);
                  await formState.MessageBox({
                    messageTitle: postData?.O_MSG_TITLE?.length
                      ? postData?.O_MSG_TITLE
                      : "ValidationFailed",
                    message: postData?.[i]?.O_MESSAGE,
                    icon: "ERROR",
                  });
                  returnVal = "";
                } else if (postData?.[i]?.O_STATUS === "99") {
                  formState?.handleButtonDisable(false);
                  const btnName = await formState.MessageBox({
                    messageTitle: postData?.O_MSG_TITLE?.length
                      ? postData?.O_MSG_TITLE
                      : "Confirmation",
                    message: postData?.[i]?.O_MESSAGE,
                    buttonNames: ["Yes", "No"],
                    icon: "CONFIRM",
                  });
                  btn99 = btnName;
                  if (btnName === "No") {
                    returnVal = "";
                  }
                } else if (postData?.[i]?.O_STATUS === "9") {
                  formState?.handleButtonDisable(false);
                  await formState.MessageBox({
                    messageTitle: postData?.O_MSG_TITLE?.length
                      ? postData?.O_MSG_TITLE
                      : "Alert",
                    message: postData?.[i]?.O_MESSAGE,
                    icon: "WARNING",
                  });
                } else if (postData?.[i]?.O_STATUS === "0") {
                  formState?.handleButtonDisable(false);
                  if (btn99 !== "No") {
                    returnVal = postData?.[i];
                    formState?.setDilogueOpen(true);
                  } else {
                    returnVal = "";
                  }
                }
              }
              btn99 = 0;
              return {
                ACCT_CD:
                  returnVal !== ""
                    ? {
                        value: utilFunction.getPadAccountNumber(
                          currentField?.value,
                          dependentFieldValues?.ACCT_TYPE?.optionData
                        ),
                        isFieldFocused: false,
                        ignoreUpdate: true,
                      }
                    : {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: false,
                      },
                ACCT_NM: {
                  value: returnVal?.ACCT_NM ?? "",
                  ignoreUpdate: true,
                  isFieldFocused: false,
                },
                WIDTH_BAL: {
                  value: returnVal?.WIDTH_BAL ?? "",
                  ignoreUpdate: true,
                  isFieldFocused: false,
                },
                GSTIN: {
                  value: returnVal?.GSTIN ?? "",
                  ignoreUpdate: true,
                  isFieldFocused: false,
                },
              };
            } else if (!currentField?.value) {
              formState?.handleButtonDisable(false);
              return {
                ACCT_NM: { value: "" },
              };
            }
          },
          fullWidth: true,
          GridProps: {
            xs: 12,
            sm: 2.4,
            md: 2.4,
            lg: 2.4,
            xl: 2.4,
          },
        },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "WIDTH_BAL",
        label: "Balance",
        fullWidth: true,
        dependentFields: ["MODE"],
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (dependentFieldsValues?.["MODE"]?.value === "C") {
            return true;
          } else {
            return false;
          }
        },
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 2.4,
          sm: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "ACCT_NM",
        label: "Account_Name",
        dependentFields: ["MODE"],
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (dependentFieldsValues?.["MODE"]?.value === "C") {
            return true;
          } else {
            return false;
          }
        },
        fullWidth: true,
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 4.8,
          sm: 4.8,
          lg: 4.8,
          xl: 4.8,
        },
      },
      {
        render: {
          componentType: "numberFormat",
        },
        name: "GSTIN",
        label: "Gstin",
        dependentFields: ["MODE"],
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          if (dependentFieldsValues?.["MODE"]?.value === "C") {
            return true;
          } else {
            return false;
          }
        },
        fullWidth: true,
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 2.4,
          sm: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "",
      rowIdColumn: "TRAN_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: false,
      disableGroupBy: true,
      enablePagination: false,
      containerHeight: { min: "40vh", max: "45vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: false,
    },
    columns: [
      {
        accessor: "TRAN_CD",
        columnName: "SrNo",
        sequence: 1,
        alignment: "left",
        componentType: "default",
        width: 70,
        minWidth: 60,
        maxWidth: 100,
        __EDIT__: {
          isAutoSequence: true,
        },
      },
      {
        accessor: "TEMP_DISP",
        columnName: "Template",
        sequence: 2,
        alignment: "left",
        componentType: "default",
        width: 200,
        minWidth: 180,
        maxWidth: 220,
      },
      {
        accessor: "TAXABLE_VALUE",
        columnName: "ChargeAmount",
        alignment: "right",
        sequence: 3,
        componentType: "currency",
        isDisplayTotal: true,
        width: 150,
        minWidth: 120,
        maxWidth: 180,
      },
      {
        accessor: "TAX_AMOUNT",
        columnName: "taxAmount",
        sequence: 4,
        alignment: "right",
        isDisplayTotal: true,
        componentType: "currency",
        width: 150,
        minWidth: 120,
        maxWidth: 180,
      },
      {
        accessor: "CHEQUE_NO",
        columnName: "ChequeNo",
        sequence: 5,
        alignment: "right",
        componentType: "default",
        width: 100,
        minWidth: 80,
        maxWidth: 120,
      },
      {
        accessor: "CHEQUE_DT",
        columnName: "ChequeDate",
        sequence: 6,
        alignment: "left",
        componentType: "date",
        dateFormat: "dd/MMM/yyyy",
        width: 150,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        accessor: "REMARKS",
        columnName: "Remarks",
        sequence: 7,
        alignment: "left",
        componentType: "default",
        isDisplayTotal: true,
        footerLabel: "Total: ",
        setFooterValue(total, rows) {
          const { totalTaxableValue, totalTaxAmount } = rows.reduce(
            (acc, row) => {
              acc.totalTaxableValue += parseFloat(
                row.values.TAXABLE_VALUE || 0
              );
              acc.totalTaxAmount += parseFloat(row.values.TAX_AMOUNT || 0);
              return acc;
            },
            { totalTaxableValue: 0, totalTaxAmount: 0 }
          );
          const finalTotal = (totalTaxableValue + totalTaxAmount).toFixed(2);
          return [finalTotal];
        },
        width: 200,
        minWidth: 200,
        maxWidth: 200,
      },
      {
        accessor: "DELETE_ROW",
        columnName: "Delete",
        sequence: 8,
        alignment: "center",
        componentType: "buttonRowCell",
        isVisibleInNew: true,
        __VIEW__: {
          isVisible: false,
        },
        width: 150,
        minWidth: 120,
        maxWidth: 180,
      },
    ],
  },
};
