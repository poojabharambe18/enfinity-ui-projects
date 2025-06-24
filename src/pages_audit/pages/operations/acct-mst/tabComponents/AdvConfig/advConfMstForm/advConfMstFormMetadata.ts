import { format } from "date-fns";
import { advConfCodeDD, advConfDefDD } from "../../../api";
import { utilFunction } from "@acuteinfo/common-base";
export const advConfMstFormMetadata = {
  masterForm: {
    form: {
      name: "advConfig-form-metadata",
      label: " ",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
      render: {
        ordering: "auto",
        renderType: "simple",
        gridConfig: {
          item: {
            xs: 12,
            sm: 4,
            md: 4,
          },
          container: {
            direction: "row",
            spacing: 1,
          },
        },
      },
    },
    fields: [
      {
        render: {
          componentType: "hidden",
        },
        label: "",
        name: "COMMON",
        dependentFields: ["CODE"],
        validationRun: "onChange",
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          _,
          dependent
        ) => {
          const messagebox = async (msg) => {
            let buttonName = await formState.MessageBox({
              messageTitle: "ValidationFailed",
              message: msg,
              icon: "ERROR",
              defFocusBtnName: "Ok",
            });
            return buttonName;
          };

          let selectData = dependent?.CODE?.optionData?.[0];

          if (selectData?.ALLOW_DUPLICATE === "N") {
            let abc = formState.gridData
              .filter((item) => !item._isNewRow)
              .some((item) => item.CODE === selectData?.value);
            if (abc) {
              let btnName = await messagebox("ThisParameterisalreadymapped");

              if (btnName === "Ok") {
                return {
                  CODE: { value: "", ignoreUpdate: true },
                };
              }
            }
          } else if (selectData?.ALLOW_NEW_ENTRY === "N") {
            let btnName = await messagebox("ThisParametermappingisnotallowed");

            if (btnName === "Ok") {
              return {
                CODE: { value: "", ignoreUpdate: true },
              };
            }
          }

          return {};
        },
      },
      {
        render: {
          componentType: "autocomplete",
        },
        name: "CODE",
        label: "Parameters",
        required: true,
        fullWidth: true,
        isFieldFocused: true,
        placeholder: "SelectParameters",
        options: advConfCodeDD,
        _optionsKey: "advConfCodeDD",
        validationRun: "all",
        isReadOnly: true,
        __NEW__: { isReadOnly: false },
        postValidationSetCrossFieldValues: (field) => {
          if (field?.value) {
            return {
              COMMON: {
                value: Date.now(),
              },
            };
          }
        },
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["Parametersrequired"] }],
        },
        GridProps: {
          xs: 12,
          sm: 10,
          md: 3.3,
          lg: 3.5,
          xl: 4,
        },
      },

      {
        render: {
          componentType: "checkbox",
        },
        name: "FLAG",
        label: "Flag",
        fullWidth: true,
        GridProps: {
          style: { paddingTop: "40px" },
          xs: 12,
          sm: 2,
          md: 1,
          lg: 1,
          xl: 1,
        },
      },
      {
        render: {
          componentType: "autocomplete",
        },
        name: "DEF_DESC",
        label: "Defination",
        fullWidth: true,
        placeholder: "SelectDefination",
        disableCaching: true,
        dependentFields: ["CODE", "DEFINITION_VISIBLE"],
        options: (dependent, formState, _, authState) => {
          if (dependent?.CODE?.value) {
            return advConfDefDD({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
              BASE_BRANCH: authState?.user?.baseBranchCode,
              CODE: dependent?.CODE?.value,
            });
          }
          return [];
        },
        isReadOnly: true,
        __NEW__: { isReadOnly: false },
        _optionsKey: "advConfDefDD",
        shouldExclude(fieldData, dependent) {
          if (dependent?.CODE?.optionData?.[0]?.DEFINITION_VISIBLE === "N") {
            return true;
          } else {
            return false;
          }
        },
        GridProps: {
          xs: 12,
          sm: 5,
          md: 3.3,
          lg: 3.5,
          xl: 4,
        },
      },

      {
        render: {
          componentType: "datePicker",
        },
        fullWidth: true,
        isReadOnly: true,
        name: "FROM_EFF_DATE",
        required: true,
        placeholder: "DD/MM/YYYY",
        label: "EffectiveFromDate",
        GridProps: {
          xs: 12,
          sm: 3.5,
          md: 2.2,
          lg: 2,
          xl: 1.5,
        },
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["EffectiveFromDateRequired"] }],
        },
        isWorkingDate: true,
        validate: (value) => {
          if (
            Boolean(value?.value) &&
            !utilFunction.isValidDate(utilFunction.getParsedDate(value?.value))
          ) {
            return "Mustbeavaliddate";
          }
          return "";
        },
        __NEW__: {
          isReadOnly: false,
          validate: (value, dependentFields, formState) => {
            if (
              Boolean(value?.value) &&
              !utilFunction.isValidDate(
                utilFunction.getParsedDate(value?.value)
              )
            ) {
              return "Mustbeavaliddate";
            }
            let currentFieldDate = Boolean(value?.value)
              ? format(utilFunction.getParsedDate(value?.value), "dd/MMM/yyyy")
              : "";
            let workingDt = Boolean(formState?.workingDate)
              ? format(
                  utilFunction.getParsedDate(formState?.workingDate),
                  "dd/MMM/yyyy"
                )
              : "";
            if (currentFieldDate < workingDt) {
              return "Effective from date must be greater than working date.";
            }
            return "";
          },
        },
      },

      {
        render: {
          componentType: "datePicker",
        },
        name: "TO_EFF_DATE",
        isReadOnly: true,
        label: "EffectiveToDate",
        isWorkingDate: true,
        placeholder: "DD/MM/YYYY",
        fullWidth: true,
        GridProps: {
          xs: 12,
          sm: 3.5,
          md: 2.2,
          lg: 2,
          xl: 1.5,
        },
        runValidationOnDependentFieldsChange: true,
        dependentFields: ["FROM_EFF_DATE"],
        validate: (value, dependentFields, formState) => {
          if (
            Boolean(value?.value) &&
            !utilFunction.isValidDate(utilFunction.getParsedDate(value?.value))
          ) {
            return "Mustbeavaliddate";
          }
          return "";
        },
        __NEW__: {
          isReadOnly: false,
          validate: (value, dependentFields, formState) => {
            if (
              Boolean(value?.value) &&
              !utilFunction.isValidDate(
                utilFunction.getParsedDate(value?.value)
              )
            ) {
              return "Mustbeavaliddate";
            }
            let currentFieldDate = Boolean(value?.value)
              ? format(utilFunction.getParsedDate(value?.value), "dd/MMM/yyyy")
              : "";
            let dependentField = Boolean(
              dependentFields?.["FROM_EFF_DATE"]?.value
            )
              ? format(
                  utilFunction.getParsedDate(
                    dependentFields?.["FROM_EFF_DATE"]?.value
                  ),
                  "dd/MMM/yyyy"
                )
              : "";
            let workingDt = Boolean(formState?.workingDate)
              ? format(
                  utilFunction.getParsedDate(formState?.workingDate),
                  "dd/MMM/yyyy"
                )
              : "";
            if (currentFieldDate < workingDt) {
              return "Effective To date must be greater than working date.";
            } else if (currentFieldDate < dependentField) {
              return "Effective To date must be greater than From date.";
            }
            return "";
          },
        },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "AMOUNT_UPTO",
        label: "AmountDaysUpTo",
        fullWidth: true,
        required: true,
        isReadOnly: true,
        __NEW__: { isReadOnly: false },
        autoComplete: "off",
        dependentFields: ["CODE"],
        shouldExclude(fieldData, dependent) {
          if (dependent?.CODE?.optionData?.[0]?.AMT_UPTO_VISIBLE === "Y") {
            return false;
          } else {
            return true;
          }
        },
        GridProps: {
          xs: 12,
          sm: 5,
          md: 3.3,
          lg: 3.5,
          xl: 4,
        },
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["AmountDaysUpToIsRequiered"] }],
        },
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "ID_NO",
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Document Detail",
      rowIdColumn: "SR_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: true,
      hideHeader: false,
      disableGroupBy: true,
      enablePagination: false,
      containerHeight: { min: "29vh", max: "29vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: false,
    },
    columns: [
      {
        accessor: "SR_CDZ",
        columnName: "SrNo",
        componentType: "default",
        sequence: 1,
        alignment: "center",
        width: 75,
        minWidth: 50,
        maxWidth: 100,
        isAutoSequence: true,
      },

      {
        accessor: "DOC_DESCRIPTION",
        columnName: "Documents",
        componentType: "default",
        sequence: 2,
        alignment: "left",
        isReadOnly: true,
        width: 350,
        minWidth: 200,
        maxWidth: 400,
      },
      {
        accessor: "SUBMIT",
        columnName: "Submit",
        componentType: "editableCheckbox",
        alignment: "center",
        isReadOnly: true,
        sequence: 2,
        width: 85,
        minWidth: 70,
        maxWidth: 120,
      },

      {
        accessor: "VALID_UPTO",
        columnName: "ValidTillDate",
        componentType: "editableDatePicker",
        alignment: "center",
        isReadOnly: true,
        sequence: 2,
        width: 210,
        minWidth: 100,
        maxWidth: 300,
      },
    ],
  },
};
