import {
  getAgGridSRNo,
  handleDeleteButtonClick,
} from "components/agGridTable/utils/helper";
import { validateChequeDate } from "utils/helper";

export const loanRepaymentMetadata = {
  GridMetaDataType: {
    gridLabel: "Loan Repayment Schedule",
  },
  columns: ({ authState, formRef }) => {
    return [
      {
        columnName: "Sr.",
        alignment: "left",
        width: 40,
        minWidth: 60,
        maxWidth: 80,
        displayComponentType: getAgGridSRNo,
        isReadOnly: true,
      },
      {
        accessor: "INS_START_DT",
        columnName: "Inst. Start Date",
        alignment: "center",
        sequence: 2,
        width: 120,
        minWidth: 120,
        maxWidth: 150,
        sortable: false,
        displayComponentType: "DisplayDateCell",
        isReadOnly: () => true,
        shouldExclude: (params) => {
          if (!params?.value) {
            return true;
          }
          return false;
        },
        componentType: "DatePickerCell",
        FormatProps: {
          authState: authState,
        },
      },
      {
        accessor: "FROM_INST",
        columnName: "From Inst.",
        sequence: 3,
        alignment: "right",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
        singleClickEdit: true,
        sortable: false,
        displayComponentType: "DisplayCell",
        isReadOnly: (params) => params?.data?.INS_START_DT,
        componentType: "NumberFormat",
        FormatProps: {
          isNumber: true,
        },
      },
      {
        accessor: "TO_INST",
        columnName: "To Inst.",
        headerClass: "required",
        sequence: 4,
        alignment: "right",
        width: 100,
        minWidth: 130,
        maxWidth: 180,
        singleClickEdit: true,
        sortable: false,
        displayComponentType: "DisplayCell",
        shouldExclude: false,
        componentType: "NumberFormat",
        FormatProps: {
          isNumber: true,
        },
        postValidationSetCrossAccessorValues: async (
          value: any,
          node: any,
          api: any,
          field: any,
          onValueChange: any,
          context: any
        ) => {
          const fromInst = Number(node.data?.FROM_INST) || 0;
          const toInst = value ? Number(value) : 0;
          const instNo = toInst ? toInst - fromInst + 1 : 0;
          node.setData({
            ...node.data,
            INST_NO: instNo,
          });
        },
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["Please enter To Inst."] }],
        },
      },
      {
        accessor: "INST_NO",
        columnName: "No. of Installment",
        sequence: 5,
        alignment: "right",
        width: 160,
        minWidth: 160,
        maxWidth: 180,
        sortable: false,
        displayComponentType: "DisplayCell",
        isReadOnly: () => true,
        componentType: "NumberFormat",
      },
      {
        accessor: "INST_RS",
        columnName: "Installment Amount",
        sequence: 6,
        alignment: "right",
        width: 160,
        minWidth: 180,
        maxWidth: 220,
        componentType: "amountField",
        sortable: false,
        // isReadOnly: (params) => params?.data?.INS_START_DT,
        isReadOnly: true,
        displayComponentType: "DisplayCurrencyCell",
        cellClass: "currency",
        FormatProps: {
          isNumber: true,
        },
        // editable: (params) => !!params?.data?.TO_INST,
      },
      {
        accessor: "DELETE_ROW",
        columnName: "Delete",
        sequence: 11,
        alignment: "center",
        displayComponentType: "CustomButtonCellEditor",
        width: 150,
        minWidth: 120,
        maxWidth: 180,
        sortable: false,
        cellClass: "numeric-cell-text-alignment",
        // pinned: "right",
        isReadOnly: true,
        cellRendererParams: {
          buttonName: "Remove",
          handleButtonClick: handleDeleteButtonClick,
        },
        shouldExclude: (params) => params?.data?.FROM_INST === "1",
      },
    ];
  },
};
