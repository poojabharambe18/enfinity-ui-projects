import * as API from "../api";

export const update_categ_meta_data = {
  form: {
    name: "update_categ_meta_data",
    label: "Update Category",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
        },
        container: {
          direction: "row",
          spacing: 1,
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
    {
      // CATEG_CD
      render: {
        componentType: "autocomplete",
      },
      name: "OLD_CATEG_CD",
      label: "OldCategory",
      options: (dependentValue, formState, _, authState) =>
        API.getCIFCategories({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: authState?.user?.branchCode ?? "",
          ENTITY_TYPE: formState?.ENTITY_TYPE ?? "",
        }),
      _optionsKey: "categOptions",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "NEW_CATEG_CD",
      label: "NewCategory",
      options: (dependentValue, formState, _, authState) =>
        API.getCIFCategories({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: authState?.user?.branchCode ?? "",
          ENTITY_TYPE: formState?.ENTITY_TYPE ?? "",
        }),
      _optionsKey: "categOptions",
      postValidationSetCrossFieldValues: (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        formState?.setCategCD?.(field?.value);
        return {};
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "arrayField",
      },
      name: "MAPPED_ACCOUNTS",
      // fixedRows: 1,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "hidden",
          },
          name: "APIDATA",
        },
        {
          render: {
            componentType: "textField",
          },
          name: "COMBINED_ACCT_NO",
          label: "AcctNum",
          runValidationOnDependentFieldsChange: true,
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "OLD_CATEG_CD",
          label: "OldCategory",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
          options: (dependentValue, formState, _, authState) =>
            API.getCIFCategories({
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: authState?.user?.branchCode ?? "",
              ENTITY_TYPE: formState?.ENTITY_TYPE ?? "",
            }),
          _optionsKey: "categOptions",
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "NEW_CATEG_CD",
          label: "NewCategory",
          options: (dependentValue, formState, _, authState, parent) => {
            API.getCIFCategories({
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: authState?.user?.branchCode ?? "",
              ENTITY_TYPE: formState?.ENTITY_TYPE ?? "",
            });
          },
          _optionsKey: "categOptions",
          isReadOnly: true,
          dependentFields: ["NEW_CATEG_CD1"],
          parentDependentFields: ["NEW_CATEG_CD1"],
          arrayParentDependOptions: true,
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: { componentType: "checkbox" },
          name: "UPD_FLAG",
          label: "",
          defaultValue: false,
          // getCalculatedRate
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            let isVisible =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.VISIBLE_UPD_FLAG;
            if (isVisible === "N") {
              return true;
            }
            return false;
          },
          dependentFields: [
            "APIDATA",
            "NEW_CATEG_CD",
            "NEW_CATEG_CD1",
            "NEW_INT_RATE",
            "NEW_AG_CL_RATE",
            "NEW_PENAL_RATE",
            "NEW_INS_EXPIRY_PENAL_RATE",
            "NEW_INST_RS",
          ],
          postValidationSetCrossFieldValues: (
            field,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (formState?.isSubmitting) return {};
            let checked = field?.value;
            const currRow =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value;
            const PARENT_CODE =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.SYS_TYPE ?? "";
            const INST_RS =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.NEW_INST_RS ?? "";
            const DUE_AMT =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.NEW_DUE_AMT ?? "";
            const NEW_CATEG_CD =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.NEW_CATEG_CD"]?.value ??
              "";
            // const CATEG_CD = dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value?.NEW_CATEG_CD ?? "";
            let reqObj = {
              CUSTOMER_ID: formState?.CUSTOMER_ID ?? "",
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: authState?.user?.branchCode ?? "",

              ACCT_TYPE: currRow?.ACCT_TYPE ?? "",
              ACCT_CD: currRow?.ACCT_CD ?? "",
              CATEG_CD: NEW_CATEG_CD,
              PARENT_TYPE: currRow?.PARENT_TYPE ?? "",
              PARENT_CODE: PARENT_CODE,
              SANCTIONED_AMT: currRow?.SANCTIONED_AMT ?? "",
              INST_NO: currRow?.INST_NO ?? "",
              INST_RS: INST_RS,
              INSTALLMENT_TYPE: currRow?.INSTALLMENT_TYPE ?? "",
              LIMIT_AMOUNT: currRow?.LIMIT_AMOUNT ?? "",
              DUE_AMT: DUE_AMT,
              INT_RATE:
                dependentFieldsValues?.["MAPPED_ACCOUNTS.NEW_INT_RATE"]
                  ?.value ?? "",
              PENAL_RATE:
                dependentFieldsValues?.["MAPPED_ACCOUNTS.NEW_PENAL_RATE"]
                  ?.value ?? "",
              AG_CLR_RATE:
                dependentFieldsValues?.["MAPPED_ACCOUNTS.NEW_AG_CL_RATE"]
                  ?.value ?? "",
              INSURANCE_EXPIRY_PENAL_RT:
                dependentFieldsValues?.[
                  "MAPPED_ACCOUNTS.NEW_INS_EXPIRY_PENAL_RATE"
                ]?.value ?? "",
              TYPE_CD: currRow?.TYPE_CD ?? "",
            };
            return API.getCalculatedRate(reqObj);
          },
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "rateOfInt",
          },
          name: "OLD_INT_RATE",
          label: "OldInterestRate",
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
          isReadOnly: true,
          dependentFields: ["APIDATA"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            let isVisible =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.VISIBLE_INT_RT;
            if (isVisible === "N") {
              return true;
            }
            return false;
          },
        },
        {
          render: {
            componentType: "rateOfInt",
          },
          name: "NEW_INT_RATE",
          label: "NewInterestRate",
          dependentFields: ["APIDATA"],
          isReadOnly: (fieldValue, dependentFields, formState) => {
            let isDisabled =
              dependentFields?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.DISABLE_INT_RATE;
            if (isDisabled === "N") {
              return false;
            } else {
              return true;
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            let isVisible =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.VISIBLE_INT_RT;
            if (isVisible === "N") {
              return true;
            }
            return false;
          },
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
        },

        {
          render: {
            componentType: "rateOfInt",
          },
          name: "OLD_AG_CL_RATE",
          label: "OldAgainstClearing",
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
          isReadOnly: true,
          dependentFields: ["APIDATA"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            let isVisible =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.VISIBLE_AGCLR_RT;
            if (isVisible === "N") {
              return true;
            }
            return false;
          },
        },
        {
          render: {
            componentType: "rateOfInt",
          },
          name: "NEW_AG_CL_RATE",
          label: "NewAgainstClearing",
          dependentFields: ["APIDATA"],
          isReadOnly: (fieldValue, dependentFields, formState) => {
            let isDisabled =
              dependentFields?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.DISABLE_AGCLR_RATE;
            if (isDisabled === "N") {
              return false;
            } else {
              return true;
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            let isVisible =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.VISIBLE_AGCLR_RT;
            if (isVisible === "N") {
              return true;
            }
            return false;
          },
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
        },

        {
          render: {
            componentType: "rateOfInt",
          },
          name: "OLD_PENAL_RATE",
          label: "OldPenalRate",
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
          isReadOnly: true,
          dependentFields: ["APIDATA"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            let isVisible =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.VISIBLE_PENAL_RT;
            if (isVisible === "N") {
              return true;
            }
            return false;
          },
        },
        {
          render: {
            componentType: "rateOfInt",
          },
          name: "NEW_PENAL_RATE",
          label: "NewPenalRate",
          dependentFields: ["APIDATA"],
          isReadOnly: (fieldValue, dependentFields, formState) => {
            let isDisabled =
              dependentFields?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.DISABLE_PENAL;
            if (isDisabled === "N") {
              return false;
            } else {
              return true;
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            let isVisible =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.VISIBLE_PENAL_RT;
            if (isVisible === "N") {
              return true;
            }
            return false;
          },
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
        },

        {
          render: {
            componentType: "rateOfInt",
          },
          name: "OLD_INS_EXPIRY_PENAL_RATE",
          label: "OldInsExpPanel",
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
          isReadOnly: true,
          dependentFields: ["APIDATA"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            let isVisible =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.VISIBLE_INSU_RT;
            if (isVisible === "N") {
              return true;
            }
            return false;
          },
        },
        {
          render: {
            componentType: "rateOfInt",
          },
          name: "NEW_INS_EXPIRY_PENAL_RATE",
          label: "NewInsExpPanel",
          dependentFields: ["APIDATA"],
          isReadOnly: (fieldValue, dependentFields, formState) => {
            let isDisabled =
              dependentFields?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.DISABLE_INSU_PEN_RATE;
            if (isDisabled === "N") {
              return false;
            } else {
              return true;
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            let isVisible =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.VISIBLE_INSU_RT;
            if (isVisible === "N") {
              return true;
            }
            return false;
          },
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
        },

        {
          render: {
            componentType: "rateOfInt",
          },
          name: "OLD_INST_RS",
          label: "OldEMI",
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
          isReadOnly: true,
          dependentFields: ["APIDATA"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            let isVisible =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.VISIBLE_INST_RS;
            if (isVisible === "N") {
              return true;
            }
            return false;
          },
        },
        {
          render: {
            componentType: "rateOfInt",
          },
          name: "NEW_INST_RS",
          label: "NewEMI",
          dependentFields: ["APIDATA"],
          isReadOnly: (fieldValue, dependentFields, formState) => {
            let isDisabled =
              dependentFields?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.DISABLE_INST_RS;
            if (isDisabled === "N") {
              return false;
            } else {
              return true;
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            let isVisible =
              dependentFieldsValues?.["MAPPED_ACCOUNTS.APIDATA"]?.value
                ?.VISIBLE_INST_RS;
            if (isVisible === "N") {
              return true;
            }
            return false;
          },
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
        },
      ],
    },
  ],
};
