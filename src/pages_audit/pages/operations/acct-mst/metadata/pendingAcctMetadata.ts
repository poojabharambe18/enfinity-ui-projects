import { GridMetaDataType } from "@acuteinfo/common-base";

export const pendingAcctMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "PendingAccounts",
    rowIdColumn: "REQUEST_ID",
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
    pageSizes: [15, 30, 100],
    defaultPageSize: 15,
    containerHeight: {
      min: "60vh",
      max: "calc(100vh - 200px)",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "REQUEST_ID",
      columnName: "ReqID",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 50,
      maxWidth: 150,
    }, // check branch code
    {
      accessor: "ACCT_TYPE",
      columnName: "AcctType",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 90,
      minWidth: 70,
      maxWidth: 170,
    },
    {
      accessor: "ACCT_CD",
      columnName: "ACNo",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CUSTOMER_NAME",
      columnName: "CustomerName",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 270,
      minWidth: 100,
      maxWidth: 350,
      showTooltip: true,
    },
    {
      accessor: "UPD_TAB_NAME",
      columnName: "UpdateType",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "TYPE_NM",
      columnName: "TypeName",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 210,
      minWidth: 100,
      maxWidth: 400,
      showTooltip: true,
    },
    {
      accessor: "REQ_FLAG_DISP",
      columnName: "RequestFlag",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 70,
      maxWidth: 200,
    },
    {
      accessor: "CHECKER",
      columnName: "Checker",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 50,
      maxWidth: 200,
    },
    {
      accessor: "MAKER",
      columnName: "Maker",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 50,
      maxWidth: 200,
    },
    {
      accessor: "CONFIRMED_FLAG",
      columnName: "ConfirmFlag", // value of fresh/existing
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "LAST_MODIFIED",
      columnName: "LastModifiedDate",
      sequence: 11,
      alignment: "center",
      dateFormat: "dd/MM/yyyy hh:mm:ss",
      componentType: "date",
      width: 140,
      minWidth: 70,
      maxWidth: 180,
    },
    {
      accessor: "VERIFIED_DATE",
      columnName: "VerifiedDate",
      sequence: 12,
      alignment: "center",
      dateFormat: "dd/MM/yyyy hh:mm:ss",
      componentType: "date",
      width: 110,
      minWidth: 70,
      maxWidth: 180,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 13,
      alignment: "left",
      componentType: "default",
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
