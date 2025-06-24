import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import {
  Autocomplete,
  TextField,
  Tooltip,
  FormHelperText,
} from "@mui/material";
import { isArray, isEmpty } from "lodash";
import { t } from "i18next";

const AutoCompleteCellEditor = forwardRef((props: any, ref) => {
  const {
    value,
    colDef: { cellEditorParams, field, name },
    node,
    onValueChange,
    api,
    context,
  } = props;

  const { postValidationSetCrossAccessorValues = () => {} } =
    cellEditorParams || {};

  const selectRef = useRef<HTMLInputElement | null>(null);
  const indexRef = useRef<number>(-1);

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOptions = async () => {
    if (typeof cellEditorParams?.options === "function") {
      setLoading(true);
      try {
        const data = await cellEditorParams.options();
        props.context.updateState(field, data);
        setOptions(data || []);
      } catch (error) {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    let listData = props.context.state?.[field] || [];
    if (listData?.length) {
      setOptions(listData);
      setLoading(false);
    } else {
      fetchOptions();
    }
  }, []);

  const getInitialValue = () => {
    if (!value || (typeof value === "object" && isEmpty(value))) {
      return null;
    }
    return (
      options.find(
        (option: any) => option.value === value?.value || option.value === value
      ) || null
    );
  };

  const [selectedValue, setSelectedValue] = useState<any>(getInitialValue());

  useEffect(() => {
    setSelectedValue(getInitialValue());
  }, [options]);

  const handleChange = (event: any, newValue: any) => {
    if (newValue) {
      setSelectedValue(newValue);

      const newData = {
        ...node.data,
        [field]: newValue?.value,
        [name]: newValue?.label,
      };
      node.setData(newData);
      onValueChange(newValue?.value);
    } else {
      setSelectedValue(null);

      const newData = {
        ...node.data,
        [field]: "",
        [name]: "",
      };
      node.setData(newData);
      onValueChange("");
    }
  };

  useImperativeHandle(ref, () => ({
    getValue: () => (selectedValue ? selectedValue.value : null),
  }));

  const handleLoaderState = async (event) => {
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

  const handleBlur = async (e) => {
    setOpen(false);
    if (typeof postValidationSetCrossAccessorValues === "function")
      await handleLoaderState(e);
    if (indexRef.current !== -1 && options[indexRef.current]) {
      await handleChange(e, options[indexRef.current]);
      if (typeof postValidationSetCrossAccessorValues === "function")
        await handleLoaderState(e);
    }
  };

  const handleFocus = () => {
    if (isEmpty(value)) {
      const newData = {
        ...node.data,
        [field]: undefined,
      };
      node.setData(newData);
      onValueChange(undefined);
      setSelectedValue(undefined);
    }
  };

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, []);

  if (node?.rowPinned) {
    return null;
  }
  const fieldError = node.data?.errors?.find((item) => item.field === field);

  return (
    <>
      <Autocomplete
        id="item-cell-editor"
        value={selectedValue}
        onChange={handleChange}
        options={options}
        loading={loading}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onHighlightChange={(e: any, option: any) => {
          if (e?.type !== "mousemove") {
            indexRef.current = options.indexOf(option);
          } else {
            indexRef.current = -1;
          }
        }}
        autoHighlight
        fullWidth
        sx={{
          padding: "0px",
          "& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator":
            {
              padding: "1px", // shrink the button area
            },
          "& .MuiAutocomplete-popupIndicator svg, & .MuiAutocomplete-clearIndicator":
            {
              fontSize: "16px", // shrink the dropdown arrow icon
              width: "16px",
              height: "16px",
            },
        }}
        renderOption={(props, option) => (
          <li {...props} title={option.label}>
            <span
              style={{
                display: "inline-block",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {option.label}
            </span>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            inputRef={selectRef}
            onFocus={handleFocus}
            onClick={handleFocus}
            onBlur={handleBlur}
            placeholder="Select an option"
            InputProps={{
              ...params.InputProps,
            }}
            inputProps={{
              ...params.inputProps,
              title: selectedValue?.label || "",
              style: {
                paddingRight: "40px",
                whiteSpace: "nowrap",
                overflow: "hidden !important",
                textOverflow: "ellipsis",
              },
            }}
          />
        )}
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

export default AutoCompleteCellEditor;
