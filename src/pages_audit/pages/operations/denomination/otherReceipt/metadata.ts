import { GridMetaDataType } from "@acuteinfo/common-base";

export const otherReceiptMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "OtherReceiptTransactions",
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
      min: "30vh",
      max: "30vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    // allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "BRANCH_CD",
      columnName: "branchCode",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 140,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "AccType",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 140,
    },
    // {
    //   accessor: "CHQ_BX_FLAG",
    //   columnName: "Select",
    //   alignment: "center",
    //   componentType: "editableCheckbox",
    //   sequence: 3,
    //   width: 80,
    //   minWidth: 80,
    //   maxWidth: 100,
    // },
    {
      accessor: "ACCT_CD",
      columnName: "ACNo",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      accessor: "FD_NO",
      columnName: "FD/Payslip No",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 150,
      maxWidth: 170,
    },
    {
      accessor: "SCROLL1",
      columnName: "TokenNo",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 120,
    },
    {
      accessor: "AMOUNT",
      columnName: "amount",
      sequence: 6,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
      totalDecimalCount: 2,
      width: 120,
      minWidth: 120,
      maxWidth: 140,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Trx",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 80,
      maxWidth: 100,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 200,
      maxWidth: 210,
    },
    {
      accessor: "TRAN_CD",
      columnName: "ScrollNo",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 160,
    },
    {
      accessor: "DAILY_TRN_CD",
      columnName: "Vno",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 160,
    },
  ],
};
