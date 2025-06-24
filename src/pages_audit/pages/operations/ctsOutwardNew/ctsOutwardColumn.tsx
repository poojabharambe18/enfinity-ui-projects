import { ColDef } from "ag-grid-community";
import { handleBlurBankCode, handleBlurPayee } from "./ctsOutwardColumnHelper";
import { getAgGridSRNo, handleDeleteButtonClick } from "@acuteinfo/common-base";
import { validateChequeDate } from "utils/helper";

export interface CtsOutwardColumnType {
  gridConfig: {
    gridLabel: string;
  };
  columns: (...args: any[]) => ColDef[];
}
export const CtsOutwardColumn: CtsOutwardColumnType = {
  gridConfig: {
    gridLabel: "Cheque Details",
  },
  columns: (
    formState,
    authState,
    setOpenAddBankForm,
    setBankData,
    setCurrentRowIndex,
    defaultView
  ) => {
    return [
      {
        columnName: "Sr.",
        headerTooltip: "Sr.No.",
        lockVisible: true,
        width: 70,
        resizable: false,
        unSortIcon: false,
        filter: false,
        pinned: "left",
        displayComponentType: getAgGridSRNo,
        isReadOnly: true,
      },
      { accessor: "CHQ_MICR_VISIBLE", isVisible: false },
      { accessor: "PAYEE_AC_MANDATORY", isVisible: false },
      { accessor: "TRAN_DT", isVisible: false },
      { accessor: "RANGE_DT", isVisible: false },
      {
        accessor: "CHEQUE_NO",
        columnName: "ChequeNo",
        headerTooltip: "ChequeNo",
        headerClass: "required",
        sequence: 2,
        // width: 200,
        minWidth: 120,
        maxWidth: 200,
        componentType: "NumberFormat",
        addNewRow: true,
        FormatProps: {
          isNumber: true,
          allowNegative: false,
          allowLeadingZeros: false,
          isAllowed: (values) => {
            if (values?.value?.length > 6) {
              return false;
            }

            return true;
          },
        },

        displayComponentType: "DisplayCell",
        singleClickEdit: true,
        alignment: "right",
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["ChequeNorequired"] }],
        },
      },
      {
        accessor: "BANK_CD",
        columnName: "BankCode",
        headerTooltip: "BankCode",
        headerClass: "required",
        alignment: "left",
        sequence: 3,
        // width: 150,
        minWidth: 120,
        maxWidth: 200,
        componentType: "NumberFormat",
        singleClickEdit: true,
        displayComponentType: "DisplayCell",

        postValidationSetCrossAccessorValues: (
          value: any,
          node: any,
          api: any,
          accessor: any,
          onValueChange: any,
          context: any,
          dependentaccessorsValues: any
        ) =>
          handleBlurBankCode(
            value,
            node,
            api,
            accessor,
            onValueChange,
            context,
            dependentaccessorsValues,
            formState,
            authState,
            setOpenAddBankForm,
            setBankData,
            setCurrentRowIndex
          ),

        FormatProps: {
          isNumber: true,
          allowNegative: false,
          allowLeadingZeros: true,
          isAllowed: (values) => {
            if (values?.value?.length > 10) {
              return false;
            }
            return true;
          },
        },
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["BankCodeRequired"] }],
        },
      },
      {
        accessor: "BANK_NM",
        columnName: "BankName",
        headerTooltip: "BankName",
        sequence: 4,
        alignment: "left",
        // width: 200,
        minWidth: 120,
        maxWidth: 200,
        isReadOnly: true,
        displayComponentType: "DisplayCell",
      },
      {
        accessor: "errors",
        isVisible: false,
      },
      {
        accessor: "disableChequeDate",
        isVisible: false,
      },
      {
        accessor: "ECS_SEQ_NO",
        columnName: "PayeeACNo",
        headerTooltip: "PayeeACNo",
        sequence: 5,
        alignment: "right",
        // width: 200,
        minWidth: 120,
        maxWidth: 200,
        isReadOnly: false,
        componentType: "NumberFormat",
        singleClickEdit: true,
        displayComponentType: "DisplayCell",
        cellClass: "currency",
        postValidationSetCrossAccessorValues: async (
          value: any,
          node: any,
          api: any,
          accessor: any,
          onValueChange: any,
          context: any,
          dependentaccessorsValues: any
        ) =>
          handleBlurPayee(
            value,
            node,
            api,
            accessor,
            onValueChange,
            context,
            dependentaccessorsValues
          ),
        FormatProps: {
          isNumber: true,
          allowNegative: false,
          allowLeadingZeros: true,
          isAllowed: (values) => {
            if (values?.value?.length > 6) {
              return false;
            }
            return true;
          },
        },

        validate: (params) => {
          const allaccessor = params.node?.data || {};

          if (allaccessor.PAYEE_AC_MANDATORY === "Y" && !params.value) {
            return "PayeeACNorequired";
          }
          return "";
        },
      },
      {
        accessor: "CHEQUE_DATE",
        columnName: "ChequeDate",
        headerTooltip: "ChequeDate",
        sequence: 6,
        alignment: "left",
        // width: 150,
        minWidth: 120,
        maxWidth: 200,
        isReadOnly: false,
        componentType: "DatePickerCell",
        singleClickEdit: true,
        displayComponentType: "DisplayDateCell",
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["ChequeDateRequired"] }],
        },

        validate: validateChequeDate,
      },
      {
        accessor: "BRANCH",
        columnName: "Description",
        headerTooltip: "Description",
        alignment: "left",
        minWidth: 120,
        // width: 205,
        displayComponentType: "DisplayCell",
      },
      {
        accessor: "CHQ_MICR_CD",
        columnName: "CHQMicr",
        headerTooltip: "CHQMicr",
        alignment: "left",
        minWidth: 120,
        // width: 100,
        componentType: "NumberFormat",
        displayComponentType: "DisplayCell",
        cellClass: "currency",
        FormatProps: {
          isNumber: true,
          allowNegative: false,
          allowLeadingZeros: true,
          isAllowed: (values) => {
            if (values?.value?.length > 2) {
              return false;
            }
            return true;
          },
        },
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["CHQMicrRequired"] }],
        },
      },
      {
        accessor: "ECS_USER_NO",
        columnName: "PayeeName",
        headerTooltip: "PayeeName",
        headerClass: "required",
        alignment: "left",
        // width: 200,
        minWidth: 120,
        maxWidth: 200,
        componentType: "NumberFormat",
        displayComponentType: "DisplayCell",
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["PayeeNameRequired"] }],
        },
      },
      {
        accessor: "AMOUNT",
        columnName: "ChequeAmount",
        headerTooltip: "ChequeAmount",
        headerClass: "required",
        alignment: "right",
        // width: 200,
        minWidth: 120,
        maxWidth: 200,
        componentType: "amountField",
        singleClickEdit: true,
        displayComponentType: "DisplayCurrencyCell",
        cellClass: "currency",
        FormatProps: {
          isNumber: true,
          allowNegative: false,
        },
      },
      {
        accessor: "DELETE_ROW",
        columnName: "Remove",
        headerTooltip: "Remove",
        sequence: 8,
        alignment: "center",
        displayComponentType: "CustomButtonCellEditor",
        // width: 150,
        minWidth: 120,
        maxWidth: 200,
        cellClass: "numeric-cell-text-alignment",
        isReadOnly: true,
        // pinned: "right",
        cellRendererParams: {
          disabled: defaultView === "view",
          buttonName: "Remove",
          handleButtonClick: handleDeleteButtonClick,
        },
      },
    ];
  },
};
