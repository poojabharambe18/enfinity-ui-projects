import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { dynamicRowHeight } from "../utils/helper";
import ErrorComponent from "./ErrorComponent";
import { CircularProgress } from "@mui/material";

const DisplaySelectCell = (params) => {
  const {
    value,
    colDef: { cellEditorParams, field, editable, headerName, name },
    node,
    context,
  } = params;

  const errors = node?.data?.errors || [];
  const fieldError = errors.find((err) => err.field === field);
  if (errors) dynamicRowHeight(errors, params);

  //* Extract loader state for cell
  const loaderArray = params.node.data?.loader || [];
  const loadingField = loaderArray?.find(
    (err) => err.field === params.colDef.field
  );

  // Determine if the cell is editable
  const isEditable =
    typeof editable === "function" ? editable(params) : editable;

  const fetchOptions = async () => {
    if (typeof cellEditorParams?.options === "function") {
      const data = await cellEditorParams.options();
      context.updateState(field, data);
      const matchingOption = data.find((option) => option?.value === value);
      if (matchingOption) {
        node.setData({
          ...node.data,
          [name]: matchingOption?.label,
        });
      }
    }
  };
  useEffect(() => {
    let listData = context.state?.[field] || [];
    if (isEmpty(listData)) {
      fetchOptions();
    } else {
      const matchingOption = listData.find((option) => option?.value === value);
      if (matchingOption) {
        node.setData({
          ...node.data,
          [name]: matchingOption?.label,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (params.eGridCell) {
      params.eGridCell.style.backgroundColor = isEditable
        ? "transparent"
        : "var(--theme-color7)";
    }
  }, [isEditable, params.eGridCell]);
  if (node?.rowPinned) return value || false;
  const isCellVisible =
    typeof params?.colDef?.shouldExclude === "function"
      ? params?.colDef?.shouldExclude(params)
      : false;

  return !isCellVisible ? (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>
        {node.data?.[name] || value || !isEmpty(fieldError?.message) ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              className="cell-value"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: params.colDef?.alignment || "center",
                height: "100%",
                width: "100%",
              }}
            >
              <div
                title={node.data?.[name] || value || ""}
                style={{
                  display: "inline-block",
                  maxWidth: "100%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  flexGrow: 1,
                }}
              >
                {node.data?.[name] || value}
              </div>

              {loadingField?.loader && params.value ? (
                <CircularProgress
                  size={20}
                  color="secondary"
                  style={{ marginLeft: 8 }}
                />
              ) : null}
            </div>

            {!isEmpty(fieldError?.message) && (
              <ErrorComponent fieldError={fieldError} value={params.value} />
            )}
          </div>
        ) : (
          <span className="cell-placeholder">{headerName}</span>
        )}
      </span>
    </div>
  ) : null;
};

export default DisplaySelectCell;
