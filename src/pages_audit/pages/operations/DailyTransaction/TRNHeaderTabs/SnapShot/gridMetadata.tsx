import { GridMetaDataType } from "@acuteinfo/common-base";
export const snapShotGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "SnapShot",
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
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "23.7vh",
      max: "23.7vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      columnName: "SrNo",
      accessor: "sr",
      sequence: 1,
      componentType: "default",
      width: 80,
      maxWidth: 100,
      minWidth: 50,
      isAutoSequence: true,
      alignment: "right",
    },
    {
      columnName: "TranDate",
      accessor: "TRN_DATE",
      sequence: 2,
      componentType: "date",
      alignment: "center",
      dateFormat: "dd/MM/yyyy",
      width: 130,
    },
    {
      columnName: "ValueDate",
      accessor: "VALUE_DT",
      sequence: 3,
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      alignment: "center",
      width: 130,
    },

    {
      columnName: "narration",
      accessor: "REMARKS",
      sequence: 4,
      componentType: "default",
      width: 250,
      showTooltip: true,
    },
    {
      columnName: "Trx",
      accessor: "TYPE_CD",
      sequence: 5,
      componentType: "default",
      alignment: "right",
      width: 70,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "ChequeNo",
      accessor: "CHEQUE_NO",
      sequence: 6,
      componentType: "default",
      alignment: "right",
      width: 100,
    },
    {
      columnName: "Debit",
      accessor: "DR_AMT",
      sequence: 7,
      componentType: "currency",
      width: 150,
      color: "red",
      alignment: "right",
      isDisplayTotal: true,
      totalDecimalCount: 2,
    },
    {
      columnName: "Credit",
      accessor: "CR_AMT",
      sequence: 8,
      componentType: "currency",
      width: 150,
      color: "green",
      alignment: "right",
      isDisplayTotal: true,
      totalDecimalCount: 2,
    },

    {
      columnName: "ClosingBalance",
      accessor: "CL_BAL",
      sequence: 9,
      componentType: "currency",
      width: 150,
      alignment: "right",
    },
    {
      columnName: "Branch",
      accessor: "ENTERED_BRANCH_CD",
      sequence: 10,
      componentType: "default",
      alignment: "right",
      width: 70,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "SDC",
      accessor: "SDC",
      sequence: 11,
      componentType: "default",
      width: 70,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "",
      componentType: "buttonRowCell",
      buttonLabel: "*",
      accessor: "CHEQUE_IMG",
      width: 80,
      sequence: 12,
      alignment: "center",
      isVisible: true,
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        if (original?.TYPE_CD === "5") {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      columnName: "Maker",
      accessor: "MAKER",
      sequence: 13,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "Checker",
      accessor: "CHECKER",
      sequence: 14,
      componentType: "default",
      width: 100,
    },
    {
      columnName: "EnteredDate",
      accessor: "ENTRY_DT",
      sequence: 15,
      componentType: "date",
      dateFormat: "dd-MM-yyyy hh:mm:ss a",
      alignment: "center",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
  ],
};
export const scrollRegisterGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "ScrollRegister",
    rowIdColumn: "index",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    allowRowSelection: false,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: false,
    hideFooter: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "40vh",
      max: "40vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
  },
  filters: [],
  columns: [
    {
      columnName: "SrNo",
      accessor: "sr",
      sequence: 1,
      componentType: "default",
      width: 80,
      maxWidth: 100,
      minWidth: 50,
      isAutoSequence: true,
    },
    {
      columnName: "Accountholder",
      accessor: "AC_HOLDER_DISP",
      sequence: 2,
      componentType: "default",
      showTooltip: true,
      width: 300,
      minWidth: 250,
      maxWidth: 350,
    },
    {
      columnName: "",
      accessor: "SCROLL1",
      sequence: 2,
      componentType: "default",
      isVisible: false,
    },
    {
      columnName: "",
      accessor: "TYPE_CD",
      sequence: 2,
      componentType: "default",
      isVisible: false,
    },

    {
      columnName: "Narration",
      accessor: "REMARKS",
      sequence: 3,
      componentType: "default",
      width: 300,
      minWidth: 250,
      maxWidth: 350,
      showTooltip: true,
      isDisplayTotal: true,
      footerIsMultivalue: true,
      footerLabel: "{0}",
      setFooterValue: (_, rows) => {
        let totalCredit = 0;
        let totalDebit = 0;
        rows?.forEach((item) => {
          let credit = parseFloat(item?.values?.CREDIT || 0);
          let debit = parseFloat(item?.values?.DEBIT || 0);

          totalCredit += credit;
          totalDebit += debit;
        });

        if (totalCredit !== totalDebit) {
          let ScrollNo = rows?.[0]?.values?.SCROLL1;
          return [`<-----Scroll ${ScrollNo} not Tally----->`];
        } else {
          return [""];
        }
      },
    },
    {
      columnName: "ChequeNo",
      accessor: "CHEQUE_NO",
      sequence: 4,
      componentType: "default",
      alignment: "right",
      width: 140,
      minWidth: 100,
      maxWidth: 180,
      isDisplayTotal: true,
      footerIsMultivalue: true,
      footerLabel: "{0}",
      setFooterValue: (_, rows) => {
        let ScrollNo = rows?.[0]?.values?.SCROLL1;
        return [`Scroll No.:${ScrollNo || ""}`];
      },
    },

    {
      columnName: "Credit",
      accessor: "CREDIT",
      sequence: 5,
      componentType: "currency",
      color: "green",
      isDisplayTotal: true,
      alignment: "right",
      width: 130,
      minWidth: 100,
      maxWidth: 150,
      footerIsMultivalue: true,
      footerLabel: "{0}\n{1}",
      setFooterValue: (total, rows) => {
        let CreditCount;
        CreditCount = rows?.filter((item) => {
          return parseInt(item?.values?.TYPE_CD?.trim()) < 4;
        }).length;
        return [total.toFixed(2) || "", CreditCount || "0"];
      },
    },
    {
      columnName: "Debit",
      accessor: "DEBIT",
      sequence: 6,
      componentType: "currency",
      alignment: "right",
      color: "red",
      width: 130,
      minWidth: 100,
      maxWidth: 150,
      isDisplayTotal: true,
      footerIsMultivalue: true,
      footerLabel: "{0}\n{1}",
      setFooterValue: (total, rows) => {
        let DeditCount;
        DeditCount = rows?.filter((item) => {
          return parseInt(item?.values?.TYPE_CD?.trim()) > 3;
        }).length;
        return [total.toFixed(2) || "", DeditCount || "0"];
      },
    },
    {
      columnName: "VoucherNo",
      accessor: "REF_TRAN_CD",
      sequence: 7,
      componentType: "default",
      alignment: "right",
      width: 100,
      minWidth: 80,
      maxWidth: 130,
      footerIsMultivalue: true,
      isDisplayTotal: true,
      footerLabel: "{0}\n{1}",
      setFooterValue: (_, rows) => {
        let totalCredit = 0;
        let totalDebit = 0;
        let Count;
        Count = rows?.filter((item) => {
          return Boolean(parseInt(item?.values?.TYPE_CD?.trim()));
        }).length;
        rows?.forEach((item) => {
          let credit = parseFloat(item?.values?.CREDIT || 0);
          let debit = parseFloat(item?.values?.DEBIT || 0);

          totalCredit += credit;
          totalDebit += debit;
        });

        if (totalCredit !== totalDebit) {
          totalCredit = totalCredit - totalDebit;
          return [`${totalCredit.toFixed(2)}`, Count || "0"];
        } else {
          return ["", Count || "0"];
        }
      },
    },

    {
      columnName: "TrBranch",
      accessor: "ENTERED_BRANCH_CD",
      sequence: 8,
      componentType: "default",
      alignment: "right",
      width: 100,
      minWidth: 80,
      maxWidth: 130,
    },

    {
      columnName: "EntryDate",
      accessor: "ENTERED_DATE",
      sequence: 9,
      componentType: "date",
      isVisible: true,
      dateFormat: "dd/MM/yyyy hh:mm:ss",
      width: 150,
      minWidth: 120,
      maxWidth: 180,
    },
    {
      columnName: "Maker",
      accessor: "ENTERED_BY",
      sequence: 10,
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 130,
    },
    {
      columnName: "CheckerDetails",
      accessor: "VERIFIED_BY",
      sequence: 11,
      componentType: "default",
      width: 300,
      minWidth: 250,
      maxWidth: 350,
    },
  ],
};
