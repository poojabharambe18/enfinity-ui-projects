import * as API from "../api";
import { utilFunction } from "@acuteinfo/common-base";

export const locker_tab_metadata = {
  form: {
    name: "locker_tab_form",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "sequence",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
        },
        container: {
          direction: "row",
          spacing: 0.5,
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
      Divider: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "divider",
      },
      name: "savingsdivider_ignoreField",
      label: "LockerDetail",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DAY_BOOK_GRP_CD",
      label: "LockerType",
      options: () => API.getAdvDirectorNameTypeOP({ A_ROLE_IND: "D" }),
      _optionsKey: "directorNmLockerOp",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["LockerTypeisrequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "CATEG_CD",
      label: "Category",
      options: (dependentValue, formState, _, authState) =>
        API.getCategoryTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "categLockerOp",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Categoryisrequired"] }],
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "lf_no",
      label: "lockerNumber",
      type: "text",
      maxLength: 8,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "OP_DATE",
      label: "OpDate",
      placeholder: "DD/MM/YYYY",
      validate: (value) => {
        if (
          Boolean(value?.value) &&
          !utilFunction.isValidDate(utilFunction.getParsedDate(value?.value))
        ) {
          return "Mustbeavaliddate";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOCKER_KEY_NO",
      label: "LocKeyNo",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "INST_DUE_DT",
      label: "DueDate",
      placeholder: "DD/MM/YYYY",
      validate: (value) => {
        if (
          Boolean(value?.value) &&
          !utilFunction.isValidDate(utilFunction.getParsedDate(value?.value))
        ) {
          return "Mustbeavaliddate";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PATH_SIGN",
      label: "KararNo",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "INT_SKIP_FLAG",
      label: "keyEmboss",
      options: [],
      _optionsKey: "keyEmbossLockerOp",
      placeholder: "",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["keyEmbossIsRequired"] }],
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "TYPE_CD",
      label: "Rent",
      options: [
        { label: "YES", value: "Y" },
        { label: "NO", value: "N" },
      ],
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["RentIsRequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "LAST_INST_DT",
      label: "SurrDate",
      placeholder: "DD/MM/YYYY",
      validate: (value) => {
        if (
          Boolean(value?.value) &&
          !utilFunction.isValidDate(utilFunction.getParsedDate(value?.value))
        ) {
          return "Mustbeavaliddate";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "INT_RATE",
      label: "InterestRate",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["InterestRateIsRequired"] }],
      },
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "CLASS_CD",
      label: "RiskCategory",
      options: (dependentValue, formState, _, authState) =>
        API.getRiskCategTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "riskCategLockerOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "divider",
      },
      name: "savingsdivider_ignoreField",
      label: "LockerDetail",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REF_COMP_CD",
      label: "FdType",
      placeholder: "COMPCD",
      maxLength: 4,
      GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REF_BRANCH_CD",
      label: "",
      placeholder: "BRANCHCD",
      maxLength: 4,
      GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REF_ACCT_TYPE",
      label: "",
      placeholder: "AccType",
      maxLength: 4,
      GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REF_ACCT_CD",
      label: "",
      placeholder: "ACNo",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AcctNoIsRequired"] }],
      },
      postValidationSetCrossFieldValues: (field) => {
        if (field?.value) {
          return {
            REF_ACCT_CD: {
              value: utilFunction.getPadAccountNumber(field.value, ""),
              ignoreUpdate: true,
            },
          };
        }
      },
      maxLength: 8,
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "DUE_AMT",
      label: "FDNo",
      type: "text",
      FormatProps: {
        allowNegative: true,
      },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["FDNoIsRequired"] }],
      },
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 1.5 },
    },
  ],
};
