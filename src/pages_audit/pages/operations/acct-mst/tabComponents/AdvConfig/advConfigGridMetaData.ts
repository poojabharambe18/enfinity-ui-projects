import { GridMetaDataType } from "@acuteinfo/common-base";
import { advConfCodeDD } from "../../api";

export const advConfGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: " ",
    subGridLabel: "",
    rowIdColumn: "SR_CD_ID_NO",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    hiddenFlag: "_hidden",
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    hideFooter: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "47vh",
      max: "47vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "ID",
      columnName: "SrNo",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 76,
      minWidth: 70,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "CODE",
      columnName: "ParameterA",
      sequence: 2,
      alignment: "left",
      isReadOnly: true,
      componentType: "editableAutocomplete",
      options: advConfCodeDD,
      _optionsKey: "advConfCodeDD",
      // enableDefaultOption: true,
      width: 350,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "FLAG",
      columnName: " ",
      sequence: 2,
      alignment: "center",
      componentType: "editableCheckbox",
      width: 65,
      minWidth: 50,
      maxWidth: 80,
      isReadOnly: true,
    },
    {
      accessor: "DEF_DESC",
      columnName: "Defination",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 250,
      minWidth: 100,
      maxWidth: 300,
    },

    {
      accessor: "FROM_EFF_DATE",
      columnName: "EffectiveFromDateA",
      sequence: 4,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 152,
      minWidth: 120,
      maxWidth: 250,
    },

    {
      accessor: "TO_EFF_DATE",
      columnName: "EffectiveToDate",
      sequence: 5,
      alignment: "center",
      isReadOnly: true,
      required: true,
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 152,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "AMOUNT_UPTO",
      columnName: "AmountDaysUpToA",
      sequence: 6,
      alignment: "right",
      isReadOnly: true,
      componentType: "currency",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
    },
    {
      columnName: "Action",
      componentType: "deleteRowCell",
      accessor: "_hidden",
      sequence: 7,
      width: 90,
      alignment: "center",
      maxWidth: 120,
      minWidth: 90,
      shouldExclude: (initialValue, original) => {
        if (Boolean(original?._isNewRow)) {
          return false;
        }
        return true;
      },
    },
  ],
};
