import { format, isValid, parse } from "date-fns";
import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { dynamicRowHeight } from "../utils/helper";
import ErrorComponent from "./ErrorComponent";
import { usePropertiesConfigContext } from "@acuteinfo/common-base";
import { CircularProgress } from "@mui/material";

const DisplayDateCell = (params) => {
  const errors = params.node?.data?.errors || [];
  const fieldError = errors.find((err) => err.field === params.colDef.field);

  //* Extract loader state for cell
  const loaderArray = params.node.data?.loader || [];
  const loadingField = loaderArray?.find(
    (err) => err.field === params.colDef.field
  );

  const { commonDateFormat = "dd/MM/yyyy" } = usePropertiesConfigContext();

  if (errors) dynamicRowHeight(errors, params);

  const isEditable =
    typeof params.colDef.editable === "function"
      ? params.colDef.editable(params)
      : params.colDef.editable;

  useEffect(() => {
    if (params.eGridCell) {
      params.eGridCell.style.backgroundColor = isEditable
        ? "transparent"
        : "var(--theme-color7)";
    }
  }, [isEditable, params.eGridCell]);

  const knownFormats = [
    "dd/MM/yyyy",
    "yyyy-MM-dd",
    "yyyy-MM-dd HH:mm:ss.S",
    "yyyy-MM-dd HH:mm:ss",
    "MM/dd/yyyy",
    "dd-MM-yyyy",
  ];

  const getFormattedDate = (value, displayFormat = "dd/MM/yyyy") => {
    if (!value || typeof value !== "string") return null;

    let parsedDate;

    for (const fmt of knownFormats) {
      parsedDate = parse(value, fmt, new Date());
      if (isValid(parsedDate)) break;
    }

    // Fallback to native parser if none of the formats matched
    if (!isValid(parsedDate)) {
      const nativeDate = new Date(value);
      parsedDate = isValid(nativeDate) ? nativeDate : null;
    }

    return parsedDate ? format(parsedDate, displayFormat) : value;
  };

  if (params.node?.rowPinned) return params.value ?? null;
  const isCellVisible =
    typeof params?.colDef?.shouldExclude === "function"
      ? params?.colDef?.shouldExclude(params)
      : false;

  return !isCellVisible ? (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>
        {params.value || !isEmpty(fieldError?.message) ? (
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
                title={params?.value}
                style={{
                  display: "inline-block",
                  maxWidth: "100%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  flexGrow: 1,
                }}
              >
                {getFormattedDate(params.value, commonDateFormat)}{" "}
              </div>{" "}
              {loadingField?.loader && params.value ? (
                <CircularProgress
                  size={20}
                  color="secondary"
                  style={{ marginLeft: 1, marginTop: 6 }}
                />
              ) : null}
            </div>
            {!isEmpty(fieldError?.message) && (
              <ErrorComponent fieldError={fieldError} value={params.value} />
            )}
          </div>
        ) : (
          <span className="cell-placeholder">{params.colDef?.headerName}</span>
        )}
      </span>
    </div>
  ) : null;
};
export default DisplayDateCell;
