import { GeneralAPI } from "registry/fns/functions";
import { utilFunction, GridMetaDataType } from "@acuteinfo/common-base";
import {
  getPadAccountNumber,
  validateHOBranch,
} from "components/utilFunction/function";
import { validatePAN } from "../api";
export const retrieveAcctFormMetaData = {
  form: {
    name: "retrieveAcctForm",
    label: "Retrieve Accounts",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    // allowColumnHiding: true,
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
      formbutton: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        required: false,
        schemaValidation: {},
        defaultValue: "",
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          authState
        ) => {
          const isHOBranch = await validateHOBranch(
            field,
            formState?.MessageBox,
            authState
          );
          if (isHOBranch) {
            return {
              BRANCH_CD: {
                value: "",
                isFieldFocused: true,
                ignoreUpdate: false,
              },
            };
          }
          if (field.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              CUSTOMER_ID: { value: "" },
              CONTACT2: { value: "" },
              PAN_NO: { value: "" },
            };
          } else if (!field.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              CUSTOMER_ID: { value: "" },
              CONTACT2: { value: "" },
              PAN_NO: { value: "" },
            };
          }
        },
        GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
        runPostValidationHookAlways: true,
      },
      accountTypeMetadata: {
        dependentFields: ["BRANCH_CD"],
        validationRun: "onChange",
        required: false,
        schemaValidation: {},
        isFieldFocused: true,
        postValidationSetCrossFieldValues: (
          field,
          formState,
          authState,
          dependentFieldValues
        ) => {
          return {
            ACCT_CD: { value: "" },
            CUSTOMER_ID: { value: "" },
            CONTACT2: { value: "" },
            PAN_NO: { value: "" },
          };
        },
        runPostValidationHookAlways: true,
        GridProps: { xs: 12, sm: 4, md: 4, lg: 1.5, xl: 1.5 },
      },
      accountCodeMetadata: {
        render: {
          componentType: "textField",
        },
        required: false,
        schemaValidation: {
          type: "string",
          rules: [
            {
              name: "max",
              params: [20, "AcctNoValidationMsg"],
            },
          ],
        },
        validate: (columnValue) => {
          let regex = /^[^!&]*$/;
          if (!regex.test(columnValue.value)) {
            return "Special Characters (!, &) not Allowed";
          }
          return "";
        },
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          authState,
          dependentValue
        ) => {
          const ACCT_TYPE = dependentValue?.ACCT_TYPE?.value;
          const BRANCH_CD = dependentValue?.BRANCH_CD?.value;
          if (
            field?.value &&
            dependentValue?.BRANCH_CD?.value &&
            dependentValue?.ACCT_TYPE?.value
          ) {
            let apiRequest = {
              ACCT_CD: getPadAccountNumber(
                field?.value,
                dependentValue?.ACCT_TYPE?.optionData?.[0]
              ),
              ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
              BRANCH_CD: dependentValue?.BRANCH_CD?.value,
              SCREEN_REF: formState.docCD,
            };

            let postData = await GeneralAPI.getAccNoValidation(apiRequest);
            let apiRespMSGdata = postData?.MSG;
            const messagebox = async (msgTitle, msg, buttonNames, status) => {
              let buttonName = await formState.MessageBox({
                messageTitle: msgTitle,
                message: msg,
                buttonNames: buttonNames,
                icon:
                  status === "9"
                    ? "WARNING"
                    : status === "99"
                    ? "CONFIRM"
                    : status === "999"
                    ? "ERROR"
                    : status === "0" && "SUCCESS",
              });
              return { buttonName, status };
            };
            if (apiRespMSGdata?.length) {
              for (let i = 0; i < apiRespMSGdata?.length; i++) {
                if (apiRespMSGdata[i]?.O_STATUS !== "0") {
                  formState?.setDisplayGridData(false);
                  let btnName = await messagebox(
                    apiRespMSGdata[i]?.O_STATUS === "999"
                      ? "ValidationFailed"
                      : apiRespMSGdata[i]?.O_STATUS === "999"
                      ? "Confirmation"
                      : "Alert",
                    apiRespMSGdata[i]?.O_MESSAGE,
                    apiRespMSGdata[i]?.O_STATUS === "99"
                      ? ["Yes", "No"]
                      : ["Ok"],
                    apiRespMSGdata[i]?.O_STATUS
                  );
                  if (
                    btnName?.status === "999" ||
                    btnName?.buttonName === "No"
                  ) {
                    return {
                      ACCT_CD: {
                        value: "",
                        isFieldFocused: true,
                        ignoreUpdate: false,
                      },
                      CUSTOMER_ID: { value: "" },
                      CONTACT2: { value: "" },
                      PAN_NO: { value: "" },
                    };
                  }
                } else {
                  formState.setDataOnFieldChange("BUTTON_CLICK_ACCTCD", {
                    ACCT_TYPE: ACCT_TYPE,
                    BRANCH_CD: BRANCH_CD,
                    ACCT_CD: field?.value,
                    PADDINGNUMBER:
                      dependentValue?.ACCT_TYPE?.optionData?.[0] ?? "",
                  });
                  return {
                    CUSTOMER_ID: { value: "" },
                    CONTACT2: { value: "" },
                    PAN_NO: { value: "" },
                  };
                }
              }
            }
          }
          formState?.setDisplayGridData(false);
          return {};
        },
        autoComplete: "off",
        runPostValidationHookAlways: true,
        GridProps: { xs: 12, sm: 4, md: 4, lg: 2, xl: 2 },
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "PADDINGNUMBER",
      dependentFields: ["ACCT_TYPE"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.ACCT_TYPE.optionData;
        if (optionData && optionData.length > 0) {
          return optionData[0]?.PADDING_NUMBER;
        } else return "";
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER_ID",
      label: "CustomerId",
      placeholder: "EnterCustomerID",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 6,
        md: 3.5,
        lg: 2,
        xl: 2,
      },
      FormatProps: {
        allowNegative: false,
        isAllowed: (values) => {
          const value = values?.value;
          if (value === "") return true;
          return Boolean(
            /^[0-9]+$/.test(value) &&
              !value?.startsWith("0") &&
              value?.length <= 12
          );
        },
      },
    },
    {
      render: {
        componentType: "phoneNumberOptional",
      },
      name: "CONTACT2",
      label: "MobileNo",
      placeholder: "EnterMobileNo",
      autoComplete: "off",
      type: "string",
      startsIcon: "PhoneAndroidSharp",
      GridProps: {
        xs: 12,
        sm: 6,
        md: 3.5,
        lg: 2,
        xl: 2,
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value.length <= 0) {
          return "";
        } else if (columnValue.value.length >= 11) {
          return "MobileNumberGreaterThanValidation";
        } else if (columnValue.value.length <= 9) {
          return "MobileNumberLessThanValidation";
        }
        return "";
      },
      FormatProps: {
        isAllowed: (values) => {
          return Boolean(values?.value?.length <= 10);
        },
      },
    },
    {
      render: {
        componentType: "panCardOptional",
      },
      name: "PAN_NO",
      label: "PAN_NO",
      placeholder: "EnterPAN",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 6,
        md: 3.5,
        lg: 2,
        xl: 2,
      },
      validate: (columnValue) => validatePAN(columnValue),
      FormatProps: {
        isAllowed: (values) => {
          return Boolean(values?.value?.length <= 10);
        },
      },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "RETRIEVE_BTN",
      label: "Retrieve",
      isReadOnly: false,
      endsIcon: "YoutubeSearchedFor",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 6,
        md: 1.5,
        lg: 1,
        xl: 1,
      },
    },
  ],
};

export const retrieveAcctGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "RetrieveAccounts",
    rowIdColumn: "U_ID",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "42vh",
      max: "calc(100vh - 260px)",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      componentType: "default",
      accessor: "REQUEST_ID",
      columnName: "ReqID",
      sequence: 1,
      alignment: "left",
      width: 80,
      minWidth: 50,
      maxWidth: 150,
    },
    {
      componentType: "default",
      accessor: "BRANCH_CD",
      columnName: "Branch Code",
      sequence: 2,
      alignment: "left",
      width: 110,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      componentType: "default",
      accessor: "ACCT_TYPE",
      columnName: "AcctType",
      sequence: 3,
      alignment: "left",
      width: 90,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      componentType: "default",
      accessor: "ACCT_CD",
      columnName: "ACNo",
      sequence: 4,
      alignment: "left",
      width: 100,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      componentType: "default",
      accessor: "CUSTOMER_NAME",
      columnName: "CustomerName",
      sequence: 5,
      alignment: "left",
      width: 270,
      minWidth: 100,
      maxWidth: 350,
      showTooltip: true,
    },
    {
      componentType: "default",
      accessor: "UPD_TAB_NAME",
      columnName: "UpdateType",
      sequence: 6,
      alignment: "left",
      width: 110,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      componentType: "default",
      accessor: "TYPE_NM",
      columnName: "TypeName",
      sequence: 7,
      alignment: "left",
      width: 210,
      minWidth: 100,
      maxWidth: 400,
      showTooltip: true,
    },
    {
      componentType: "default",
      accessor: "REQ_FLAG",
      columnName: "RequestFlag",
      sequence: 8,
      alignment: "left",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      componentType: "default",
      accessor: "CHECKER",
      columnName: "Checker",
      sequence: 9,
      alignment: "left",
      width: 80,
      minWidth: 50,
      maxWidth: 200,
    },
    {
      componentType: "default",
      accessor: "MAKER",
      columnName: "Maker",
      sequence: 10,
      alignment: "left",
      width: 80,
      minWidth: 50,
      maxWidth: 200,
    },
    {
      componentType: "default",
      accessor: "CONFIRMED_FLAG",
      columnName: "ConfirmFlag", // value of fresh/existing
      sequence: 11,
      alignment: "left",
      width: 170,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      componentType: "date",
      accessor: "LAST_MODIFIED_DATE",
      columnName: "LastModifiedDate",
      sequence: 12,
      alignment: "center",
      dateFormat: "dd/MM/yyyy",
      width: 140,
      minWidth: 70,
      maxWidth: 180,
    },
    {
      componentType: "date",
      accessor: "VERIFIED_DATE",
      columnName: "VerifiedDate",
      sequence: 13,
      alignment: "center",
      dateFormat: "dd/MM/yyyy",
      width: 110,
      minWidth: 70,
      maxWidth: 180,
    },
    {
      componentType: "default",
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 14,
      alignment: "left",
      width: 280,
      minWidth: 100,
      maxWidth: 500,
      showTooltip: true,
    },
    //   {
    //     accessor: "ENTRY_TYPE",
    //     columnName: "Req. Type", // value for fresh/existing
    //     sequence: 8,
    //     alignment: "left",
    //     componentType: "default",
    //     width: 140,
    //     minWidth: 140,
    //     maxWidth: 180,
    //   },

    //   {
    //     accessor: "CUSTOMER_ID",
    //     columnName: "CustomerId",
    //     sequence: 6,
    //     alignment: "left",
    //     componentType: "default",
    //     width: 140,
    //     minWidth: 140,
    //     maxWidth: 180,
    //   },

    //   {
    //     accessor: "CUSTOMER_TYPE_FLAG",
    //     columnName: "CustomerType",
    //     sequence: 7,
    //     alignment: "left",
    //     componentType: "default",
    //     width: 140,
    //     minWidth: 140,
    //     maxWidth: 180,
    //   },

    //   {
    //     accessor: "CHECKER",
    //     columnName: "Checker",
    //     sequence: 11,
    //     alignment: "center",
    //     componentType: "default",
    //     isReadOnly: true,
    //     width: 140,
    //     minWidth: 140,
    //     maxWidth: 140,
    //   },
  ],
};
