import { GridMetaDataType } from "@acuteinfo/common-base";

export const ChequebookDtlGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "ChequebookDetail",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "calc(100vh - 277px)",
      max: "calc(100vh - 277px)",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "ID",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 76,
      minWidth: 70,
      maxWidth: 100,
      isAutoSequence: true,
    },

    {
      accessor: "TRAN_DT",
      columnName: "IssueDate",
      sequence: 1,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 102,
      minWidth: 900,
      maxWidth: 130,
    },
    {
      accessor: "AUTO_CHQBK_FLAG",
      columnName: "AutoIssue",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 101,
      minWidth: 70,
      maxWidth: 130,
    },
    {
      accessor: "CHEQUE_FROM",
      columnName: "FromChequeNo",
      sequence: 4,
      alignment: "right",
      componentType: "default",
      width: 139,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHEQUE_TO",
      columnName: "ToChequeNo",
      sequence: 5,
      alignment: "right",
      componentType: "default",
      width: 128,
      minWidth: 100,
      maxWidth: 140,
    },
    {
      accessor: "CHEQUE_TOTAL",
      columnName: "NoOfCheques",
      sequence: 6,
      alignment: "right",
      componentType: "default",
      isDisplayTotal: true,
      width: 136,
      minWidth: 100,
      maxWidth: 150,
    },

    {
      accessor: "AMOUNT",

      columnName: "ServiceCharge",
      sequence: 7,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
      totalDecimalCount: 2,
      width: 120,
      minWidth: 80,
      maxWidth: 130,
    },
    {
      accessor: "SERVICE_TAX",
      columnName: "GST",
      sequence: 8,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
      totalDecimalCount: 2,
      width: 120,
      minWidth: 100,
      maxWidth: 130,
    },
    {
      accessor: "CONFIRMED_DISP",
      columnName: "Status",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 120,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },

    {
      accessor: "CHARACTERISTICS",
      columnName: "Characteristics",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "PAYABLE_AT_PAR",
      columnName: "PayableAtPAR",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 147,
      minWidth: 70,
      maxWidth: 190,
    },
    {
      accessor: "REQUISITION_DT",
      columnName: "RequisitionDate",
      sequence: 8,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 133,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "UNUSED_CHQ",
      columnName: "Pending",
      sequence: 10,
      alignment: "right",
      componentType: "default",
      isDisplayTotal: true,
      width: 125,
      minWidth: 70,
      maxWidth: 140,
    },
    {
      accessor: "ALLOW_DELETE",
      columnName: "Action",
      sequence: 8,
      buttonLabel: "Delete",
      alignment: "center",
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (initialValue === "Y") {
          return false;
        }
        return true;
      },
      componentType: "buttonRowCell",
      width: 90,
      minWidth: 60,
      maxWidth: 130,
    },
  ],
};
export const ChequeReturnHistoryGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "index",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: false,
    pageSizes: [15, 25, 35],
    defaultPageSize: 10,
    containerHeight: {
      min: "36vh",
      max: "40vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      isAutoSequence: true,
      width: 80,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "TRAN_TYPE_DISP",
      columnName: "TranType",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      showTooltip: true,
      width: 150,
      minWidth: 130,
      maxWidth: 200,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "ChequeNo",
      sequence: 3,
      alignment: "right",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "CHEQUE_DATE",
      columnName: "ChequeDate",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 80,
      maxWidth: 150,
    },
    {
      accessor: "TRAN_DT",
      columnName: "EntryDate",
      sequence: 5,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 80,
      maxWidth: 150,
    },

    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 6,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
      totalDecimalCount: 2,
      width: 140,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CHARGE_AMT",
      columnName: "ChargeAmount",
      sequence: 7,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
      totalDecimalCount: 2,
      width: 140,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "BANK_NM",
      columnName: "BankName",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      showTooltip: true,
      width: 200,
      minWidth: 100,
      maxWidth: 210,
    },
    {
      accessor: "BRANCH",
      columnName: "FavouringParty",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      showTooltip: true,
      width: 200,
      minWidth: 100,
      maxWidth: 210,
    },
    {
      accessor: "ENTERED_BRANCH_CD",
      columnName: "ReturnFromBranch",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      showTooltip: true,
      width: 135,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "DESCRIPTION",
      columnName: "Reason",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      showTooltip: true,
      width: 135,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ZONE_NM",
      columnName: "Zone",
      sequence: 12,
      alignment: "left",
      componentType: "default",
      showTooltip: true,
      width: 135,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "User",
      sequence: 13,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
  ],
};
export const TodaysClearingGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "index",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: false,
    pageSizes: [15, 25, 35],
    defaultPageSize: 10,
    containerHeight: {
      min: "36vh",
      max: "40vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      isAutoSequence: true,
      width: 80,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "InstrumentNo",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 102,
      minWidth: 900,
      maxWidth: 130,
    },
    {
      accessor: "PAYEE",
      columnName: "InstrumentNaration",
      sequence: 3,
      alignment: "right",
      componentType: "default",
      width: 150,
      minWidth: 130,
      maxWidth: 200,
    },
    {
      accessor: "AMOUNT",
      columnName: "Instrument Amount",
      sequence: 4,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
      totalDecimalCount: 2,
      width: 150,
      minWidth: 130,
      maxWidth: 200,
    },
    {
      accessor: "ERR_DESC",
      columnName: "StatusReturnReason",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
  ],
};
