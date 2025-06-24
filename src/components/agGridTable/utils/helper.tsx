import { isBefore, isValid, parse } from "date-fns";
import { isEmpty } from "lodash";
import { t } from "i18next";

const getAgGridSRNo = ({ node, api, column }) => {
  if (node.rowPinned) return "";

  const focusedCell = api.getFocusedCell();
  const isFocused = focusedCell?.rowIndex === node.rowIndex;

  return isFocused ? (
    <span>
      <strong>{">>>"}</strong>
    </span>
  ) : (
    node.rowIndex + 1
  );
};

const float = (value: string | number): number => {
  let val: number;

  if (typeof value === "string") {
    val = Number(value.replace(/,/g, "")); // Remove commas and convert to number
  } else {
    val = value; // Already a number
  }

  return !Number.isNaN(val)
    ? parseFloat(val.toFixed(Number(process.env.SYSTEM_DECIMAL_LENGTH) || 3))
    : 0;
};

const customCellAggFunc = (params) => {
  let sum = params.values.reduce((a, b) => (a += float(b)), 0);

  return float(sum);
};

const parseDate = (dateValue: any) => {
  if (!dateValue) return null;
  const parsedDate =
    typeof dateValue === "string"
      ? parse(dateValue, "dd/MM/yyyy", new Date())
      : new Date(dateValue);

  return isValid(parsedDate) ? parsedDate : null;
};

const findLastDisplayColumn = (gridApi, params) => {
  if (gridApi) {
    const displayedColumns = gridApi.current
      .getAllDisplayedColumns()
      .filter((col) => {
        const { editable } = col.colDef;
        if (typeof editable === "function") {
          return editable(params);
        }
        return editable === true;
      });

    if (!displayedColumns.length) return;

    // Return the last displayed editable column
    return displayedColumns[displayedColumns.length - 1];
  }
};

const findFirstDisplayColumn = (gridApi, params) => {
  if (gridApi) {
    const displayedColumns = gridApi.current
      .getAllDisplayedColumns()
      .filter((col) => {
        const { editable } = col.colDef;
        if (typeof editable === "function") {
          return editable(params);
        }
        return editable === true;
      });

    if (!displayedColumns.length) return;
    return displayedColumns[0];
  }
};

const getGridRowData = (gridApi): any[] => {
  if (!gridApi.current) return [];
  const rowData: any[] = [];
  gridApi.current.forEachNode((node) => rowData.push(node.data));

  return rowData;
};

const removeExistingRowData = async (gridApi) => {
  const rowData = getGridRowData(gridApi);
  if (rowData.length > 0) {
    await gridApi.current.applyTransaction({ remove: rowData });
    await gridApi.current.applyTransaction({ add: [{}] });
  }
};

const dynamicRowHeight = (errors, params) => {
  if (!isEmpty(errors)) {
    params.api.getRowNode(params.node.id)?.setRowHeight(45);
    params.api.onRowHeightChanged();
  } else {
    params.api.getRowNode(params.node.id)?.setRowHeight(30);
    params.api.onRowHeightChanged();
  }
};

const displayNumber = (num) => {
  return !isNaN(num) ? `₹ ${num.toFixed(2)}` : 0.0;
};

const lessThanDate = (
  factValue,
  jsonValue,
  options?: { ignoreTime: boolean }
) => {
  if (typeof factValue === "string") {
    factValue = parse(factValue, "dd/MM/yyyy", new Date());
  }
  if (typeof jsonValue === "string") {
    jsonValue = parse(jsonValue, "dd/MMM/yyyy", new Date());
  }
  if (options?.ignoreTime) {
    factValue = new Date(factValue).setHours(0, 0, 0, 0);
    jsonValue = new Date(jsonValue).setHours(0, 0, 0, 0);
  }
  return isBefore(factValue, jsonValue);
};

const setErrorMessage = (node, field, message = "") => {
  const existingErrors = node.data.errors || [];

  const updatedErrors = [
    ...existingErrors.filter((err) => err.field !== field),
    {
      field,
      message: message,
    },
  ];

  node.setData({
    ...node.data,
    errors: updatedErrors,
  });
};

const handleDeleteButtonClick = async (params) => {
  const { context, node, api } = params;

  const rowData: any[] = [];
  api.forEachNode((node) => rowData.push(node.data));

  if (rowData.length === 1) {
    await context.MessageBox({
      messageTitle: "Delete Row",
      message: "You can not delete last row.",
      icon: "ERROR",
      buttonNames: ["Ok"],
    });
  } else {
    let res = await context.MessageBox({
      messageTitle: "confirmation",
      message: "Are you sure want to delete row ?",
      buttonNames: ["Yes", "No"],
      defFocusBtnName: "Yes",
      icon: "CONFIRM",
    });
    if (res === "Yes") {
      api.applyTransaction({ remove: [node.data] });
      context.updatePinnedBottomRow();
    }
  }
};
type UpdateNodeOptions = {
  isFieldFocused?: boolean;
  focusedAccessor?: string;
};

const setDependantFieldValue = async (
  node: any,
  updatedData: Record<string, any>,
  api?: any,
  options: UpdateNodeOptions = {}
) => {
  node.setData({ ...node.data, ...updatedData });

  if (options.isFieldFocused && options.focusedAccessor) {
    await api.setFocusedCell(node.rowIndex, options.focusedAccessor);
    await api.startEditingCell({
      rowIndex: node.rowIndex,
      colKey: options.focusedAccessor,
    });
  }
};

export {
  getAgGridSRNo,
  customCellAggFunc,
  parseDate,
  findLastDisplayColumn,
  findFirstDisplayColumn,
  getGridRowData,
  removeExistingRowData,
  dynamicRowHeight,
  displayNumber,
  lessThanDate,
  setErrorMessage,
  handleDeleteButtonClick,
  setDependantFieldValue,
};
