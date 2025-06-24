import { ColDef } from "ag-grid-community";
import { AgGridMetaData } from "../types";

function transformToAgGridColumn(
  metaData: (AgGridMetaData | ColDef)[],
  i18n
): ColDef[] {
  return metaData.map((meta: any) => {
    const {
      accessor,
      columnName,
      componentType,
      FormatProps,
      className,
      hide,
      displayComponentType,
      headerTooltip,
      postValidationSetCrossAccessorValues,
      isVisible,
      options,
      isReadOnly,
      ...rest
    } = meta;

    return {
      headerName: `${i18n.t(columnName)}`,
      headerTooltip: `${i18n.t(headerTooltip)}`,
      headerValueGetter: () => i18n.t(columnName),
      field: accessor,
      cellEditor: componentType ? componentType : undefined,
      cellEditorParams: {
        postValidationSetCrossAccessorValues,
        ...FormatProps,
        options,
      },
      className,
      hide: isVisible === false ? !isVisible : false,
      cellRenderer: displayComponentType ? displayComponentType : "DisplayCell",
      cellStyle: (params) => {
        if (meta.alignment) {
          return {
            textAlign: meta.alignment,
          };
        }
        return { textAlign: "left" };
      },
      ...(meta?.isCheckBox && {
        onCellValueChanged: async (params) => {
          if (typeof postValidationSetCrossAccessorValues === "function") {
            await postValidationSetCrossAccessorValues(params);
          }
        },
      }),
      editable: (params) => {
        const mode = params.context?.gridContext?.mode ?? "new"; // default to 'edit' if not set

        const modeMeta = {
          edit: meta.__EDIT__,
          view: meta.__VIEW__,
          new: meta.__NEW__,
        }[mode.toLowerCase()];

        if (typeof modeMeta?.isReadOnly === "function") {
          return !modeMeta.isReadOnly(params); // <-- first priority
        }

        if (typeof isReadOnly === "function") {
          return !isReadOnly(params); // <-- second priority
        }

        if (typeof modeMeta?.isReadOnly === "boolean") {
          return !modeMeta.isReadOnly;
        }

        if (typeof isReadOnly === "boolean") {
          return !isReadOnly;
        }

        return true;
      },
      ...rest,
    };
  });
}

export default transformToAgGridColumn;
