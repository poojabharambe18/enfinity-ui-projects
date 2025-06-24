import { MetaDataType } from "@acuteinfo/common-base";

export const reportConfigMetadata: MetaDataType = {
  form: {
    name: "otpSmsConfigForm",
    label: "Mobile OTP SMS Configuration",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 1.52,
          sm: 4,
          md: 4,
        },
        container: {
          direction: "row",
          spacing: 1.5,
        },
      },
    },
    componentProps: {
      textField: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
      inputMask: {
        fullWidth: true,
      },
      datetimePicker: {
        fullWidth: true,
      },
    },
  },
  fields: [
    // {
    //   render: { componentType: "spacer" },
    //   name: "SPACER1.5",
    //   GridProps: { xs: 2, md: 2, sm: 2, lg: 1, xl: 1 },
    // },
    {
      render: { componentType: "checkbox" },
      name: "PAGINATION_ENABLE",
      label: "Enable Pagination",
      dependentFields: ["PAGINATION_ENABLE"],

      GridProps: { xs: 6, md: 2, sm: 2, lg: 1, xl: 1 },
    },

    {
      render: { componentType: "checkbox" },
      name: "DEFAULT_FILTER",
      label: "Default Filter",
      GridProps: { xs: 6, md: 2, sm: 2, lg: 1, xl: 1 },
    },

    {
      render: { componentType: "textField" },
      name: "id",
      label: "id",
      dependentFields: ["DEFAULT_FILTER"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.DEFAULT_FILTER?.value === true) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 6, md: 4, sm: 1, lg: 1, xl: 1 },
    },
    {
      render: { componentType: "textField" },
      name: "columnName",
      label: "columnName",
      dependentFields: ["DEFAULT_FILTER"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.DEFAULT_FILTER?.value === true) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 6, md: 4, sm: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: { componentType: "textField" },
      name: "type",
      label: "type",
      dependentFields: ["DEFAULT_FILTER"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.DEFAULT_FILTER?.value === true) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 6, md: 4, sm: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: { componentType: "textField" },
      name: "value",
      label: "value",
      dependentFields: ["DEFAULT_FILTER"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.DEFAULT_FILTER?.value === true) {
          return false;
        } else {
          return true;
        }
      },

      GridProps: { xs: 6, md: 4, sm: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: { componentType: "textField" },
      name: "condition",
      label: "condition",
      dependentFields: ["DEFAULT_FILTER"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.DEFAULT_FILTER?.value === true) {
          return false;
        } else {
          return true;
        }
      },

      GridProps: { xs: 6, md: 4, sm: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: { componentType: "checkbox" },
      name: "isDisableDelete",
      label: "isDisableDelete",
      dependentFields: ["DEFAULT_FILTER"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.DEFAULT_FILTER?.value === true) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 6, md: 4, sm: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: { componentType: "spacer" },
      name: "SPACER1.5",
      GridProps: { xs: 2, md: 2, sm: 2, lg: 2, xl: 2 },
    },
  ],
};
