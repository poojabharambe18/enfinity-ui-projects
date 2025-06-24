import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import React from "react";

const ErrorComponent = ({ fieldError, value }) => {
  const { i18n } = useTranslation();

  return (
    <Tooltip title={i18n.t(fieldError?.message)} arrow>
      <span
        style={{
          display: "block",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
          color: "#d32f2f",
          fontSize: "0.75rem",
          marginTop: value ? "-2px" : "20px",
          cursor: "pointer",
        }}
      >
        {i18n.t(fieldError.message)}
      </span>
    </Tooltip>
  );
};

export default ErrorComponent;
