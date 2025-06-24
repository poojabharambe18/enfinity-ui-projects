import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  TextField,
  InputAdornment,
  CircularProgress,
  FormHelperText,
  Tooltip,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { isArray } from "lodash";
import { t } from "i18next";
import {
  getCurrencySymbol,
  usePropertiesConfigContext,
} from "@acuteinfo/common-base";

const CustomCurrencyEditor = (props) => {
  const {
    value = 0,
    colDef: {
      cellEditorParams: { postValidationSetCrossAccessorValues, maxLength },
      field,
    },
    node,
    api,
    onValueChange,
    context,
  } = props;

  const [selectedValue, setSelectedValue] = useState(value);
  const [loading, setLoading] = useState(false); // Track loading state
  const { dynamicAmountSymbol } = usePropertiesConfigContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.select();
      }, 0);
    }
  }, []);

  const handleChange = (val) => {
    setSelectedValue(val.floatValue);
    const newData = {
      ...node.data,
      [field]: val.floatValue,
    };
    node.setData(newData);
    onValueChange(val.floatValue);
  };

  const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (typeof postValidationSetCrossAccessorValues === "function") {
      //* Set loader true
      const existingLoaders = node.data.loader || [];

      const updatedLoader = [
        ...existingLoaders.filter((err) => err.field !== field),
      ];

      node.setData({
        ...node.data,
        loader: [...updatedLoader, { field, loader: true }],
      });

      await postValidationSetCrossAccessorValues(
        selectedValue,
        node,
        api,
        field,
        onValueChange,
        context
      );
      //* Set loader false
      node.setData({
        ...node.data,
        loader: [...updatedLoader, { field, loader: false }],
      });
    }
  };

  if (node?.rowPinned) {
    return null;
  }

  const isAllowed = (values) => {
    const { value } = values;
    if (value === undefined) return true;
    if (!maxLength) return true;
    return value.length <= maxLength;
  };
  const fieldError = node.data?.errors?.find((item) => item.field === field);

  return (
    <>
      <NumericFormat
        value={selectedValue}
        thousandSeparator={true}
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        customInput={TextField}
        variant="outlined"
        fullWidth
        size="small"
        inputRef={inputRef}
        onFocus={() => {
          if (inputRef.current) inputRef.current.select();
        }}
        onValueChange={handleChange}
        onBlur={handleBlur}
        sx={{
          "& input": {
            textAlign: "right",
            border: "none",
            padding: "4px 4px",
          },
          "& fieldset": { border: "none" },
        }}
        InputProps={{
          style: { textAlign: "right" },
          startAdornment: (
            <InputAdornment position="start">
              {getCurrencySymbol(dynamicAmountSymbol)}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading && <CircularProgress color="secondary" size={20} />}
            </InputAdornment>
          ),
        }}
        valueIsNumericString={false}
        isAllowed={isAllowed}
      />
      {isArray(node.data?.errors) && fieldError ? (
        <Tooltip title={t(fieldError.message)} arrow>
          <FormHelperText
            style={{
              marginTop: "0px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            error={true}
          >
            {t(fieldError.message)}
          </FormHelperText>
        </Tooltip>
      ) : null}
    </>
  );
};

export default CustomCurrencyEditor;
