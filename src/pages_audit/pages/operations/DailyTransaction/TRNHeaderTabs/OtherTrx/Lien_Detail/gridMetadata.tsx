import { GridMetaDataType } from "@acuteinfo/common-base";
export const LienDetailGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "LienDetail",
    rowIdColumn: "index",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 120,
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
  },
  filters: [],
  columns: [
    {
      columnName: "SrNo",
      accessor: "SrNo",
      sequence: 1,
      componentType: "default",
      alignment: "right",
      isAutoSequence: true,
      width: 80,
      maxWidth: 100,
      minWidth: 50,
    },

    {
      columnName: "Lien",
      accessor: "LIEN_DISP",
      sequence: 2,
      componentType: "default",
      width: 80,
    },

    {
      columnName: "Remarks",
      accessor: "REMARKS",
      sequence: 3,
      componentType: "default",
      showTooltip: true,
      width: 210,
    },
    {
      columnName: "EffectiveDate",
      accessor: "EFECTIVE_DT",
      sequence: 4,
      componentType: "date",
      alignment: "center",
      dateFormat: "dd/MM/yyyy",
      width: 80,
    },
    {
      columnName: "RemovalDate",
      accessor: "REMOVAL_DT",
      sequence: 5,
      componentType: "date",
      alignment: "center",
      dateFormat: "dd/MM/yyyy",
      width: 80,
    },
    {
      columnName: "LienAmount",
      accessor: "LIEN_AMOUNT",
      sequence: 6,
      alignment: "right",
      componentType: "currency",
      isDisplayTotal: true,
      totalDecimalCount: 2,
      width: 100,
    },
    {
      columnName: "Status",
      accessor: "LIEN_STATUS",
      sequence: 7,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Confirmed",
      accessor: "CONFIRMED",
      sequence: 8,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Reason",
      accessor: "REASON_NM",
      sequence: 9,
      componentType: "default",
      showTooltip: true,
      width: 150,
    },
    {
      columnName: "EnteredBy",
      accessor: "ENTERED_BY",
      sequence: 10,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "Verified By",
      accessor: "VERIFIED_BY",
      sequence: 11,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "AcknowledgementNo",
      accessor: "ACKNOWLEDGEMENT_NO",
      sequence: 12,
      componentType: "default",
      width: 160,
    },
    {
      columnName: "TransactionId",
      accessor: "TRANSACTION_ID",
      sequence: 13,
      componentType: "default",
      width: 80,
    },
    {
      columnName: "ReportingDate",
      accessor: "REPORTING_DATE",
      sequence: 14,
      componentType: "date",
      alignment: "center",
      dateFormat: "dd/MM/yyyy",
      width: 80,
    },
  ],
};
