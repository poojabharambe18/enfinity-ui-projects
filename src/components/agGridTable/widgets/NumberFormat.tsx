import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FormHelperText, TextField, Tooltip } from "@mui/material";
import { isArray } from "lodash";
import { t } from "i18next";

const NumberFormat = forwardRef((props: any, ref) => {
  const {
    value = "",
    colDef: {
      cellEditorParams: {
        postValidationSetCrossAccessorValues = () => {},
        uppercase = false,
        defaultValue = "",
        isNumber = false, // New prop to allow number or text
        inputProps = {},
        allowNegative = true,
        allowLeadingZeros = true,
        isAllowed = () => true,
        allowAlphaNumeric = false,
      } = {},
      field,
      alignment = "left",
    },
    node,
    api,
    onValueChange,
    context,
  } = props;

  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | null>(null);

  //* Expose `getValue` to AG Grid
  useImperativeHandle(ref, () => ({
    getValue: () => inputValue,
  }));

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.select();
      }, 0);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;

    if (isNumber) {
      // Allow only numbers
      newValue = newValue.replace(/[^0-9.\- ]/g, "");

      // Prevent multiple dots (.)
      if ((newValue.match(/\./g) || []).length > 1) {
        return;
      }

      // Prevent negative sign if not allowed
      if (!allowNegative && newValue.startsWith("-")) {
        return;
      }

      // Remove leading zeros if not allowed
      if (!allowLeadingZeros) {
        newValue = newValue.replace(/^0+/, "");
      }
    } else if (allowAlphaNumeric) {
      newValue = newValue;
    } else {
      // Allow only letters (text mode)
      newValue = newValue.replace(/[^a-zA-Z ]/g, "");
    }

    // Convert to uppercase if required
    if (uppercase) {
      newValue = newValue.toUpperCase();
    }

    if (isAllowed && !isAllowed({ value: newValue })) {
      return;
    }

    setInputValue(newValue);
    const newData = {
      ...node.data,
      [field]: newValue,
    };
    node.setData(newData);
    onValueChange?.(newValue);
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
        inputValue,
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

  const fieldError = node.data?.errors?.find((item) => item.field === field);
  return (
    <>
      <TextField
        defaultValue={defaultValue}
        variant="outlined"
        fullWidth
        size="small"
        value={inputValue}
        inputRef={inputRef}
        onFocus={() => {
          inputRef.current?.select();
          node.setDataValue("disableChequeDate", undefined);
        }}
        InputProps={{
          ...inputProps,
        }}
        sx={{
          "& input": {
            textAlign: alignment,
            border: "none",
            padding: "4px 4px",
          },
          "& fieldset": { border: "none" },
        }}
        onChange={handleChange}
        onBlur={handleBlur}
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
});

export default NumberFormat;
