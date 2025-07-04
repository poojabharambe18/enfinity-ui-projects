import { GridMetaDataType } from "@acuteinfo/common-base";

export const lockerDeatilsViewMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "",
    rowIdColumn: "INDEX",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    defaultPageSize: 50,
    disableGroupBy: true,
    enablePagination: true,
    containerHeight: {
      min: "350px",
      max: "350px",
    },
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "SR_CD",
      columnName: "SrNo",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "OPER_STATUS_DISPLAY",
      columnName: "operationStatus",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 200,
      maxWidth: 250,
    },
    {
      accessor: "TRAN_DT",
      columnName: "date",
      sequence: 4,
      alignment: "left",
      componentType: "date",
      width: 180,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ST_TIME",
      columnName: "inTime",
      sequence: 5,
      alignment: "left",
      componentType: "date",
      width: 120,
      minWidth: 100,
      maxWidth: 120,
      dateFormat: "HH:mm:ss",
    },
    {
      accessor: "CL_TIME",
      columnName: "outTime",
      sequence: 6,
      alignment: "left",
      componentType: "date",
      width: 120,
      minWidth: 100,
      maxWidth: 120,
      dateFormat: "HH:mm:ss",
    },
    {
      accessor: "DELETE",
      columnName: "",
      componentType: "buttonRowCell",
      buttonLabel: "delete",
      sequence: 7,
      alignment: "center",
      width: 80,
      minWidth: 70,
      maxWidth: 100,
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (original?.ALLOW_DELETE === "Y") {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      accessor: "CHARGE_AMT",
      columnName: "chargeAmount",
      sequence: 8,
      alignment: "right",
      componentType: "currency",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "SERVICE_TAX",
      columnName: "GST",
      sequence: 9,
      alignment: "right",
      componentType: "currency",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "TRN_ACCT_NO",
      columnName: "debitFrom",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 200,
      maxWidth: 250,
    },
    {
      accessor: "TYPE",
      columnName: "Trx",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 100,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "chequeNo",
      sequence: 12,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 100,
    },
    // {
    //   accessor: "SIGN",
    //   columnName: "Signature",
    //   componentType: "buttonRowCell",
    //   buttonLabel: "View",
    //   sequence: 13,
    //   alignment: "center",
    //   width: 80,
    //   minWidth: 70,
    //   maxWidth: 100,
    //   shouldExclude: (initialValue, original, prevRows, nextRows) => {
    //     if (original?.VIEW_SIGN === "Y") {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    // },
  ],
};
