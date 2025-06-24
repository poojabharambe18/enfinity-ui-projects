import {
  DuplicationValidate,
  getPMISCData,
  getRangeOptions,
} from "../../c-kyc/api";
import * as API from "../api";
import { greaterThanDate, utilFunction } from "@acuteinfo/common-base";
import { t } from "i18next";

export const relativeDtl_tab_metadata = {
  form: {
    name: "relativeDtl_tab_form",
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
        componentType: "arrayField",
      },
      name: "RELATIVE_DTL",
      changeRowOrder: true,
      hideRemoveIconOnSingleRecord: false,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "hidden",
          },
          name: "SR_CD",
          ignoreInSubmit: false,
          __NEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "NAME_OF_THE_FIRM",
          label: "RelativeFirmName",
          required: true,
          maxLength: 100,
          autoComplete: "off",
          placeholder: "EnterRelativeFirmName",
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["RelativeFirmNameIsRequired"] },
            ],
          },
          txtTransform: "uppercase",
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "DATE_OF_BIRTH",
          label: "DateOfBirth",
          placeholder: "DD/MM/YYYY",
          isMaxWorkingDate: true,
          validate: (value) => {
            if (
              Boolean(value?.value) &&
              !utilFunction.isValidDate(
                utilFunction.getParsedDate(value?.value)
              )
            ) {
              return "Mustbeavaliddate";
            } else if (
              greaterThanDate(value?.value, value?._maxDt, {
                ignoreTime: true,
              })
            ) {
              return t("DateShouldBeLessThanEqualToWorkingDT");
            }
            return "";
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "GENDER",
          label: "Gender",
          placeholder: "SelectGender",
          options: [
            { label: "MALE", value: "M" },
            { label: "FEMALE", value: "F" },
            { label: "OTHER", value: "O" },
            { label: "TRANSGENDER", value: "T" },
          ],
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
            sequence: 7,
          },
          name: "MARITAL_STATUS",
          label: "MaritalStatus",
          options: () => API.getMaritalStatusOP(),
          _optionsKey: "maritalMainOp",
          disableCaching: true,
          placeholder: "SelectMaritalStatus",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "EDUCATIONAL_QUALIFICATION",
          label: "EduQualification",
          placeholder: "EnterEduQualification",
          type: "text",
          autoComplete: "off",
          maxLength: 200,
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "RELATIVE_CD",
          label: "Relationship",
          options: (dependentValue) => getPMISCData("RELATIONSHIP"),
          _optionsKey: "relationshipCurrentOp",
          placeholder: "SelectRelationship",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "checkbox",
          },
          defaultValue: false,
          name: "SALARIED",
          label: "Salaried",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "PASSPORT_NO",
          label: "PassportNo",
          placeholder: "EnterPassportNo",
          maxLength: 50,
          type: "text",
          txtTransform: "uppercase",
          // validate: (columnValue, allField, flag) =>
          //   DuplicationValidate(columnValue, allField, flag, {
          //     PASSPORT_NO: columnValue.value,
          //   }),
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "EMAIL",
          label: "EmailId",
          placeholder: "EnterEmailId",
          maxLength: 200,
          validate: (columnValue, allField, flag) =>
            API.ValidateEmailId(columnValue),
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          type: "text",
          txtTransform: "lowercase",
          GridProps: { xs: 12, sm: 4, md: 6, lg: 4.8, xl: 4 },
        },
        {
          render: {
            componentType: "checkbox",
          },
          defaultValue: false,
          name: "SELF_EMPLOYED",
          label: "SelfEmployed",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "panCard",
          },
          name: "PAN_NO",
          label: "PanNum",
          type: "text",
          txtTransform: "uppercase",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
          schemaValidation: {
            type: "string",
            rules: [
              {
                name: "pancard",
                params: ["PleaseEnterValidPANNumber"],
              },
            ],
          },
          validate: (columnValue) => API.validatePAN(columnValue),
          // validate: (columnValue, allField, flag) => API.validatePAN(columnValue, allField, flag),
          maxLength: 10,
        },
        {
          render: {
            componentType: "textField",
          },
          name: "NAME_OF_THE_EMPLOYER",
          label: "EmployerName",
          placeholder: "EnterEmployerName",
          type: "text",
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          maxLength: 100,
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "MONTHLY_HOUSEHOLD_INCOME",
          label: "MonthlyIncome",
          options: API.getMonthlyHouseHoldIncomeDDW,
          _optionsKey: "monIncomeMainOp",
          placeholder: "SelectMonthlyIncome",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "SELF_EMPLOYEED_DETAILS",
          label: "SelfEmpDetails",
          placeholder: "EnterSelfEmpDetails",
          type: "text",
          txtTransform: "uppercase",
          maxLength: 25,
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
      ],
    },
  ],
};
