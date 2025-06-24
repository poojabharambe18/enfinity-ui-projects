import {
  DefaultErrorObject,
  greaterThanDate,
  lessThanInclusiveDate,
} from "@acuteinfo/common-base";
import * as API from "../../../../api";
import { isValid } from "date-fns";
import { t } from "i18next";

export const kyc_proof_of_identity_meta_data = {
  form: {
    name: "kyc_poi_details_form",
    label: "",
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
      render: {
        componentType: "autocomplete",
      },
      name: "FORM_60",
      label: "Form6061",
      placeholder: "",
      defaultValue: "N",
      type: "text",
      isFieldFocused: true,
      // GridProps: {xs: 4, sm:3},
      // GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      options: [
        { label: "Form60", value: "Y" },
        { label: "Form 61", value: "F" },
        { label: "No", value: "N" },
      ],
      // dependentFields: ["DAILY_AMT"],
      // runValidationOnDependentFieldsChange: true,
      // validate: (currentField, dependentFields) => {
      //     if(Number(dependentFields?.DAILY_AMT?.value) >
      //     Number(currentField?.value)) {
      //         return "Weekly Limit should greater than or equal to Daily Limit";
      //     } else {
      //         return "";
      //     }
      // }
    },
    {
      render: {
        componentType: "panCard",
      },
      name: "PAN_NO",
      label: "PanNo",
      placeholder: "AAAAA1111A",
      type: "text",
      txtTransform: "uppercase",
      dependentFields: ["FORM_60"],
      required: true,
      validate: (columnValue, allField, flag) => {
        if (columnValue.value) {
          return API.validatePAN(columnValue, allField, flag);
        }
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        const DuplicatValidation: any = await API.DuplicationValidate(
          field,
          dependentFieldsValues,
          formState,
          {
            fieldNm: "PAN_NO",
            CHECK_FOR: "1",
          }
        );
        if (Object.hasOwn(DuplicatValidation, "otherData")) {
          const CloseFunction = await formState?.asyncFunction();
          if (CloseFunction === "Clear") {
            return {
              PAN_NO: {
                value: "",
                isFieldFocused: true,
              },
            };
          } else if (CloseFunction === "Saved") {
            return field?.value;
          }
          return CloseFunction;
        }
        return DuplicatValidation;
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["PanNoIsRequired"] },
          {
            name: "pancard",
            params: ["PleaseEnterValidPANNumber"],
          },
        ],
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        const FORM60 = dependentFieldsValues?.FORM_60?.value;
        if (Boolean(FORM60) && FORM60 === "N") {
          return false;
        }
        return true;
      },
      maxLength: 10,
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PAN_DUP_REASON",
      label: "Reason for Duplication",
      dependentFields: ["PAN_NO"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.PAN_NO?.value?.length > 0 &&
          fieldData?.value?.length > 0
        ) {
          return false;
        } else return true;
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "aadharCard",
      },
      name: "UNIQUE_ID",
      label: "UIDAadhaar",
      required: true,
      type: "text",
      maxLength: 12,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AdhaarIsRequired"] }],
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value) {
          return API.validateUniqueId(columnValue, allField, flag);
        }
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        return await API.DuplicationValidate(
          field,
          dependentFieldsValues,
          formState,
          {
            fieldNm: "UNIQUE_ID",
            CHECK_FOR: "4",
          }
        );
      },
      // disableCaching: true,
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ELECTION_CARD_NO",
      label: "VoterId",
      placeholder: "",
      maxLength: 20,
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => {
        if (columnValue?.value?.includes(" ")) {
          return "Space not allowed";
        }
        if (columnValue?.value) {
          if (!/^[a-zA-Z0-9 ]*$/.test(columnValue?.value)) {
            return "PleaseEnterAlphanumericValue";
          }
        }
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        return await API.DuplicationValidate(
          field,
          dependentFieldsValues,
          formState,
          {
            fieldNm: "ELECTION_CARD_NO",
            CHECK_FOR: "5",
          }
        );
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "EXPLICIT_TDS",
      label: "ExplicitTDS",
      defaultValue: "N",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      options: [
        { label: "Yes", value: "T" },
        { label: "No", value: "N" },
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (Boolean(field?.value)) {
          if (field?.value === "T") {
            const buttonName = await formState.MessageBox({
              messageTitle: "CONFIRMATION",
              message:
                "SystemWillDeductTDSFromCustomersInterestEvenIfItIsUnderTDSLimit",
              buttonNames: ["Yes", "No"],
              icon: "CONFIRM",
            });
            if (buttonName === "No") {
              return {
                EXPLICIT_TDS: {
                  value: "N",
                },
              };
            }
            if (buttonName === "Yes") {
              return {
                NREGA_JOB_CARD: {
                  value: "",
                  isFieldFocused: true,
                },
              };
            }
          }
        }
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "NREGA_JOB_CARD",
      label: "NREGA",
      maxLength: 20,
      placeholder: "",
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => {
        if (columnValue?.value?.includes(" ")) {
          return "Space not allowed";
        }
        if (columnValue?.value) {
          if (!/^[a-zA-Z0-9 ]*$/.test(columnValue?.value)) {
            return "PleaseEnterAlphanumericValue";
          }
        }
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "OTHER_DOC",
      label: "OtherPoI",
      placeholder: "",
      type: "text",
      txtTransform: "uppercase",
      maxLength: 50,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0123456789",
      validate: (columnValue) => {
        if (!/^[a-zA-Z\s]*$/.test(columnValue?.value)) {
          return "PleaseEnterCharacterValue";
        }
        return "";
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "OTHER_DOC_NO",
      label: "PoINo",
      placeholder: "",
      maxLength: 20,
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue, allField, flag) => {
        if (columnValue?.value?.includes(" ")) {
          return "Space not allowed";
        }
        if (columnValue?.value) {
          if (!/^[a-zA-Z0-9 ]*$/.test(columnValue?.value)) {
            return "PleaseEnterAlphanumericValue";
          }
        }
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "GSTIN",
      label: "GSTIN",
      placeholder: "",
      maxLength: 20,
      type: "text",
      txtTransform: "uppercase",
      //   validate: (columnValue, allField, flag) => API.validateGSTIN(columnValue, allField, flag),
      validate: (columnValue, allField, flag) => {
        const TIN_ISSUING_COUNTRY = flag?.TIN_ISSUING_COUNTRY;
        const TIN = flag?.TIN;
        if (!Boolean(columnValue?.value)) {
          if (Boolean(TIN_ISSUING_COUNTRY) && !Boolean(TIN)) {
            return "GSTINIsRequired";
          } else {
            return "";
          }
        } else {
          return API.validateGSTIN(columnValue, allField, flag);
        }
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 1,
      },
      name: "passportDivider_ignoreField",
      label: "PassportDetails",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PASSPORT_NO",
      label: "No",
      placeholder: "",
      maxLength: 20,
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue, allField, flag) => {
        if (
          !Boolean(columnValue.value) &&
          Boolean(
            flag.RESIDENCE_STATUS &&
              (flag.RESIDENCE_STATUS === "02" || flag.RESIDENCE_STATUS === "03")
          )
        ) {
          return "PassportIsRequired";
        }
        if (columnValue?.value?.includes(" ")) {
          return "Space not allowed";
        }
        if (columnValue?.value) {
          if (!/^[a-zA-Z0-9 ]*$/.test(columnValue?.value)) {
            return "PleaseEnterAlphanumericValue";
          }
        }
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        return await API.DuplicationValidate(
          field,
          dependentFieldsValues,
          formState,
          {
            fieldNm: "PASSPORT_NO",
            CHECK_FOR: "2",
          }
        );
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "PASSPORT_AUTHORITY_CD",
      label: "Autho",
      placeholder: "",
      dependentFields: ["PASSPORT_NO"],
      options: () => API.getPMISCData("Authority"),
      _optionsKey: "passportAuthority",
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue.value)) {
          const passport = allField?.PASSPORT_NO?.value;
          if (Boolean(passport)) {
            return "AuthoIsRequired";
          }
        }
      },
      runValidationOnDependentFieldsChange: true,
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "PASSPORT_ISSUE_DT",
      label: "IssueDate",
      dependentFields: ["PASSPORT_NO"],
      isMaxWorkingDate: true,
      validate: (value, allField, flag) => {
        if (Boolean(value?.value)) {
          if (!isValid(value?.value)) {
            return "Mustbeavaliddate";
          } else if (
            greaterThanDate(value?.value, value?._maxDt, {
              ignoreTime: true,
            })
          ) {
            return t("PassportIssueDateCantBeGreaterThanTodaysDate");
          }
        } else {
          const passport = allField?.PASSPORT_NO?.value;
          if (Boolean(passport)) {
            return "This field is required";
          }
        }
      },
      runValidationOnDependentFieldsChange: true,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "PASSPORT_EXPIRY_DT",
      label: "ExpiryDate",
      dependentFields: ["PASSPORT_NO"],
      isMinWorkingDate: true,
      validate: (currentField, dependentField, formState) => {
        if (Boolean(currentField.value)) {
          if (!isValid(currentField?.value)) {
            return "Mustbeavaliddate";
          } else if (
            lessThanInclusiveDate(
              currentField?.value,
              new Date(currentField?._minDt)
            )
          ) {
            return t("PassportExpiryDatecantBeLessThanOrEqualToTodaysDate");
          }
        } else {
          const passport = dependentField?.PASSPORT_NO?.value;
          if (Boolean(passport)) {
            return "ThisFieldisrequired";
          }
        }
        return "";
      },
      runValidationOnDependentFieldsChange: true,
      //   required: true,
      // placeholder: "",
      // type: "datePicker",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 1,
      },
      name: "drivingLicenseDivider_ignoreField",
      label: "DrivingLicenseDetails",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DRIVING_LICENSE_NO",
      label: "No",
      placeholder: "",
      maxLength: 20,
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        return await API.DuplicationValidate(
          field,
          dependentFieldsValues,
          formState,
          {
            fieldNm: "DRIVING_LICENSE_NO",
            CHECK_FOR: "3",
          }
        );
      },
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => {
        if (columnValue?.value?.includes(" ")) {
          return "Space not allowed";
        }
        if (columnValue?.value) {
          if (!/^[a-zA-Z0-9 ]*$/.test(columnValue?.value)) {
            return "PleaseEnterAlphanumericValue";
          }
        }
      },
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DRIVING_LICENSE_AUTHORITY_CD",
      label: "Autho",
      options: () => API.getPMISCData("Authority"),
      _optionsKey: "drivingLicenseAuthority",
      dependentFields: ["DRIVING_LICENSE_NO"],
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue?.value)) {
          const passport = allField?.DRIVING_LICENSE_NO?.value;
          if (Boolean(passport)) {
            return "AuthoIsRequired";
          }
        }
      },
      runValidationOnDependentFieldsChange: true,
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "DRIVING_LICENSE_ISSUE_DT",
      label: "IssueDate",
      dependentFields: ["DRIVING_LICENSE_NO"],
      isMaxWorkingDate: true,
      validate: (value, allField, flag) => {
        if (Boolean(value?.value)) {
          if (!isValid(value?.value)) {
            return "Mustbeavaliddate";
          } else if (
            greaterThanDate(value?.value, value?._maxDt, {
              ignoreTime: true,
            })
          ) {
            return t("DrivingLicenseIssueDateCantBeGreaterThanTodaysDate");
          }
        } else {
          const passport = allField?.DRIVING_LICENSE_NO?.value;
          if (Boolean(passport)) {
            return "ThisFieldisrequired";
          }
        }
      },
      runValidationOnDependentFieldsChange: true,
      //   required: true,
      // placeholder: "",
      // type: "datePicker",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "DRIVING_LICENSE_EXPIRY_DT",
      label: "ExpiryDate",
      dependentFields: ["DRIVING_LICENSE_NO"],
      isMinWorkingDate: true,
      validate: (currentField, dependentField, formState) => {
        if (Boolean(currentField.value)) {
          if (!isValid(currentField?.value)) {
            return "Mustbeavaliddate";
          } else if (
            lessThanInclusiveDate(
              currentField?.value,
              new Date(currentField?._minDt)
            )
          ) {
            return t(
              "DrivingLicenseExpiryDateCantBeLessThanOrEqualToTodaysDate"
            );
          }
        } else {
          const drivingLicenseNo = dependentField?.DRIVING_LICENSE_NO?.value;
          if (Boolean(drivingLicenseNo)) {
            return "ThisFieldisrequired";
          }
        }
        return "";
      },
      runValidationOnDependentFieldsChange: true,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
  ],
};

export const kyc_proof_of_address_meta_data = {
  form: {
    name: "kyc_poa_individual_details_form",
    label: "",
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
      render: {
        componentType: "divider",
        sequence: 1,
      },
      name: "currentAddDivider_ignoreField",
      label: "CurrentAddress",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ADDRESS_TYPE",
      label: "AddressType",
      placeholder: "",
      type: "text",
      //   GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
      options: () => API.getPMISCData("ADDRESS_TYPE"),
      _optionsKey: "currentAddType",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Line1",
      required: true,
      maxLength: 50,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Line1IsRequired"] }],
      },
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => API.validateAlphaNumValue(columnValue),
      placeholder: "",
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 5, md: 3.2, lg: 3.2, xl: 3.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD2",
      label: "Line2",
      placeholder: "",
      maxLength: 50,
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => API.validateAlphaNumValue(columnValue),
      GridProps: { xs: 12, sm: 5, md: 3.2, lg: 3.2, xl: 3.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD3",
      label: "Line3",
      placeholder: "",
      maxLength: 50,
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => API.validateAlphaNumValue(columnValue),
      GridProps: { xs: 12, sm: 5, md: 3.2, lg: 3.2, xl: 3.3 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "PIN_CODE",
      label: "PIN",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["PINIsRequired"] }],
      },
      maxLength: 6,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 6) {
            return false;
          }
          return true;
        },
      },
      validate: (columnValue) => {
        const PIN = columnValue.value;
        if (Boolean(PIN) && PIN.length < 6) {
          return "PinCodeShouldBeOfSixDigits";
        }
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      runPostValidationHookAlways: false,
      name: "AREA_CD",
      label: "SubArea",
      dependentFields: ["PIN_CODE"],
      disableCaching: true,
      options: (dependentValue, formState, _, authState) =>
        API.getOptionsOnPinParentArea(
          dependentValue?.PIN_CODE?.value,
          formState,
          _,
          authState
        ),
      _optionsKey: "indSubareaOp",
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const pin_code = dependentFields.PIN_CODE.value;
        if (!Boolean(pin_code)) {
          return true;
        } else if (Boolean(pin_code) && pin_code.length < 6) {
          return true;
        }
        return false;
      },
      setValueOnDependentFieldsChange: (dependentFields) => {
        const pincode = dependentFields.PIN_CODE.value;
        // console.log("siudbcsiudbcisbdc setvalue", pincode);
        if (Boolean(pincode)) {
          if (pincode.length < 6) {
            return "";
          }
        } else return null;
      },
      postValidationSetCrossFieldValues: (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        // console.log("siudbcsiudbcisbdc postValidationSetCrossFieldValues called", field.value)
        // console.log("sdhaiuwqidquwdqwe", dependentFieldsValues)
        if (field.value) {
          let values = {
            CITY_CD: {
              value: field?.optionData[0]?.CITY_CD
                ? field?.optionData[0]?.CITY_CD
                : "",
            },
            CITY_ignoreField: {
              value: field?.optionData[0]?.CITY_NM
                ? field?.optionData[0]?.CITY_NM
                : "",
            },
            // CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
            DISTRICT_CD: {
              value: field?.optionData[0]?.DISTRICT_CD
                ? field?.optionData[0]?.DISTRICT_CD
                : "",
            },
            DISTRICT_ignoreField: {
              value: field?.optionData[0]?.DISTRICT_NM
                ? field?.optionData[0]?.DISTRICT_NM
                : field?.optionData[0]?.DISTRICT_CD
                ? field?.optionData[0]?.DISTRICT_CD
                : "",
            },
            STATE: { value: field?.optionData[0]?.STATE_NM ?? "" },
            COUNTRY: { value: field?.optionData[0]?.COUNTRY_NM ?? "" },
            STATE_CD: { value: field?.optionData[0]?.STATE_CD ?? "" },
            COUNTRY_CD: { value: field?.optionData[0]?.COUNTRY_CD ?? "" },
          };
          return values;
        }
        return {};
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CITY_ignoreField",
      label: "City",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["CityIsRequired"] }],
      },
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].CITY_NM;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CITY_CD",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].CITY_CD;
        } else return "";
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DISTRICT_ignoreField",
      label: "DistrictName",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].DISTRICT_NM;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DISTRICT_CD",
      label: "hiddendistrict",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].DISTRICT_CD;
        } else return "";
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "STATE",
      label: "State",
      isReadOnly: true,
      ignoreInSubmit: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].STATE_NM;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COUNTRY",
      label: "Country",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].COUNTRY_NM;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "STATE_CD",
      label: "UnionTerritoriesCode",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].STATE_CD;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COUNTRY_CD",
      label: "CountryCode",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].COUNTRY_CD;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "PROOF_OF_ADD",
      label: "ProofofAdd",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ProofofAddressIsRequired"] }],
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
      options: () => API.getPMISCData("CKYC_ADD_PROOF"),
      _optionsKey: "currentPoA",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "OTHER_POA",
      label: "OthersPoA",
      placeholder: "",
      maxLength: 80,
      validate: (columnValue) => API.validateAlphaNumValue(columnValue),
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 1,
      },
      name: "localAddDivider_ignoreField",
      label: "CorrespondenceAddress",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: { componentType: "checkbox" },
      name: "SAME_AS_PER",
      label: "SameAsPermanentAddress",
      defaultValue: false,
      // dependentFields: ["ADDRESS_TYPE", "ADD1"],
      // dependentFields: ["PIN_CODE", "AREA_CD", "CITY_CD", "DISTRICT", "STATE", "COUNTRY", "STATE_CD", "COUNTRY_CD"],
      // dependentFields: ["PIN_CODE", "AREA_CD", "CITY_ignoreField", "CITY_CD", "DISTRICT_ignoreField", "DISTRICT_CD", "STATE", "COUNTRY","STATE_CD", "COUNTRY_CD", "PROOF_OF_ADD"],
      // postValidationSetCrossFieldValues: (
      //     field,
      //     __,
      //     ___,
      //     dependentFieldsValues
      //   ) => {
      //     // return {}
      //       console.log(Boolean(field.value), field.value, "same as perch fieldvalueee..", dependentFieldsValues)
      //     //   isReadOnly(
      //     //     fieldData,
      //     //     transformDependentFieldsState(dependentFieldsState),
      //     //     formContext.formState
      //     //   )
      //     if(field.value) {
      //         return {
      //             LOC_PIN_CODE : {value: Number(dependentFieldsValues?.PIN_CODE?.value ?? ""), ignoreUpdate: true},
      //             LOC_AREA_CD2 : {value: dependentFieldsValues?.AREA_CD?.value, ignoreUpdate: true},
      //             LOC_CITY_CD_ignoreField : {value: dependentFieldsValues?.CITY_ignoreField?.value, ignoreUpdate: true},
      //             LOC_CITY_CD : {value: dependentFieldsValues?.CITY_CD?.value, ignoreUpdate: true},
      //             LOC_DISTRICT_ignoreField : {value: dependentFieldsValues?.DISTRICT_ignoreField?.value, ignoreUpdate: true},
      //             LOC_DISTRICT_CD : {value: dependentFieldsValues?.DISTRICT_CD?.value, ignoreUpdate: true},
      //             LOC_STATE : {value: dependentFieldsValues?.STATE?.value, ignoreUpdate: true},
      //             LOC_COUNTRY : {value: dependentFieldsValues?.COUNTRY?.value, ignoreUpdate: true},
      //             LOC_STATE_CD : {value: dependentFieldsValues?.STATE_CD?.value, ignoreUpdate: true},
      //             LOC_COUNTRY_CD : {value: dependentFieldsValues?.COUNTRY_CD?.value, ignoreUpdate: true},
      //         }
      //     } else {
      //         return {
      //             LOC_PIN_CODE : {value: "", ignoreUpdate: true},
      //             LOC_AREA_CD2 : {value: "", ignoreUpdate: true},
      //             LOC_CITY_CD_ignoreField : {value: "", ignoreUpdate: true},
      //             LOC_CITY_CD : {value: "", ignoreUpdate: true},
      //             LOC_DISTRICT_ignoreField : {value: "", ignoreUpdate: true},
      //             LOC_DISTRICT_CD : {value: "", ignoreUpdate: true},
      //             LOC_STATE : {value: "", ignoreUpdate: true},
      //             LOC_COUNTRY : {value: "", ignoreUpdate: true},
      //             LOC_STATE_CD : {value: "", ignoreUpdate: true},
      //             LOC_COUNTRY_CD : {value: "", ignoreUpdate: true},
      //         }
      //     }
      //     return {}
      //   },
      //   runPostValidationHookAlways: false,
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "LOC_ADD_TYPE",
      label: "LocalAddressType",
      placeholder: "",
      type: "text",
      dependentFields: ["SAME_AS_PER", "ADDRESS_TYPE"],
      options: () => API.getPMISCData("ADDRESS_TYPE"),
      _optionsKey: "CurAddTypelocalOp",
      setValueOnDependentFieldsChange: (dependentFields) => {
        // console.log("same as perch", dependentFields.SAME_AS_PER.value)
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const AddType = dependentFields.ADDRESS_TYPE.value;
        if (Boolean(sameAsPer)) {
          return AddType;
        }
        return null;
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        if (Boolean(sameAsPer)) {
          return true;
        }
        return false;
      },
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_ADD1",
      label: "Line1",
      required: true,
      maxLength: 50,
      dependentFields: ["SAME_AS_PER", "ADD1"],
      runValidationOnDependentFieldsChange: true,
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue?.value)) {
          return "Line1IsRequired";
        } else {
          return API.validateAlphaNumValue(columnValue);
        }
      },
      setValueOnDependentFieldsChange: (dependentFields) => {
        // console.log("fewiwuehfiwuefwef", dependentFields)
        if (
          dependentFields.SAME_AS_PER &&
          Boolean(dependentFields.SAME_AS_PER.value)
        ) {
          const add1 = dependentFields.ADD1.value;
          return add1;
        }
        return null;
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        if (Boolean(sameAsPer)) {
          return true;
        }
        return false;
      },
      placeholder: "",
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 5, md: 4, lg: 3.6, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_ADD2",
      label: "Line2",
      placeholder: "",
      maxLength: 50,
      dependentFields: ["SAME_AS_PER", "ADD2"],
      validate: (columnValue, allField, flag) =>
        API.validateAlphaNumValue(columnValue),
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const add2 = dependentFields.ADD2.value;
        if (Boolean(sameAsPer)) {
          return add2;
        }
        return null;
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        if (Boolean(sameAsPer)) {
          return true;
        }
        return false;
      },
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 5, md: 4, lg: 3.6, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_ADD3",
      label: "Line3",
      placeholder: "",
      maxLength: 50,
      validate: (columnValue, allField, flag) =>
        API.validateAlphaNumValue(columnValue),
      dependentFields: ["SAME_AS_PER", "ADD3"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const add3 = dependentFields.ADD3.value;
        if (Boolean(sameAsPer)) {
          return add3;
        }
        return null;
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        if (Boolean(sameAsPer)) {
          return true;
        }
        return false;
      },
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 5, md: 4, lg: 3.6, xl: 4 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "LOC_PIN_CODE",
      label: "PIN",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
      required: true,
      maxLength: 6,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 6) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["SAME_AS_PER", "PIN_CODE"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const pinCode = dependentFields.PIN_CODE.value;
        if (Boolean(sameAsPer)) {
          return pinCode;
        }
        return null;
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        if (Boolean(sameAsPer)) {
          return true;
        }
        return false;
      },
      runValidationOnDependentFieldsChange: true,
      validate: (columnValue, allField, flag) => {
        const PIN = columnValue.value;
        if (!Boolean(columnValue?.value)) {
          return "PINIsRequired";
        } else if (Boolean(PIN) && PIN.length < 6) {
          return "PinCodeShouldBeOfSixDigits";
        }
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "LOC_AREA_CD2",
      dependentFields: ["LOC_PIN_CODE", "SAME_AS_PER", "AREA_CD"],
      disableCaching: true,
      options: (dependentValue, formState, _, authState) =>
        API.getOptionsOnLocalPinParentArea(
          dependentValue,
          formState,
          _,
          authState
        ),
      _optionsKey: "localSubAreaList",
      label: "Sub Area",
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const pin_code = dependentFields.LOC_PIN_CODE.value;
        if (Boolean(sameAsPer)) {
          return true;
        } else if (!Boolean(pin_code)) {
          return true;
        } else if (Boolean(pin_code) && pin_code.length < 6) {
          return true;
        }
        return false;
      },
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const areaCD = dependentFields.AREA_CD.value;
        const pincode = dependentFields.LOC_PIN_CODE.value;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, areaCD)
        if (Boolean(sameAsPer)) {
          return areaCD;
        } else if (Boolean(pincode)) {
          if (pincode.length < 6) {
            return "";
          }
        } else return null;
        return null;
      },
      postValidationSetCrossFieldValues: (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        const sameAsPer = dependentFieldsValues.SAME_AS_PER.value;
        if (field.value && !Boolean(sameAsPer)) {
          let values = {
            LOC_CITY_CD: {
              value: field?.optionData[0]?.CITY_CD
                ? field?.optionData[0]?.CITY_CD
                : "",
            },
            LOC_CITY_CD_ignoreField: {
              value: field?.optionData[0]?.CITY_NM
                ? field?.optionData[0]?.CITY_NM
                : field?.optionData[0]?.CITY_CD
                ? field?.optionData[0]?.CITY_CD
                : "",
            },
            // CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
            LOC_DISTRICT_CD: {
              value: field?.optionData[0]?.DISTRICT_CD
                ? field?.optionData[0]?.DISTRICT_CD
                : "",
            },
            LOC_DISTRICT_ignoreField: {
              value: field?.optionData[0]?.DISTRICT_NM
                ? field?.optionData[0]?.DISTRICT_NM
                : field?.optionData[0]?.DISTRICT_CD
                ? field?.optionData[0]?.DISTRICT_CD
                : "",
            },
            LOC_STATE: { value: field?.optionData[0]?.STATE_NM ?? "" },
            LOC_COUNTRY: { value: field?.optionData[0]?.COUNTRY_NM ?? "" },
            LOC_STATE_CD: { value: field?.optionData[0]?.STATE_CD ?? "" },
            LOC_COUNTRY_CD: { value: field?.optionData[0]?.COUNTRY_CD ?? "" },
          };
          // console.log(dependentFieldsValues.LOC_AREA_CD.value == field?.optionData[0]?.PARENT_AREA, "dsadsaasdasdasdasd", dependentFieldsValues.LOC_PIN_CODE.value == field?.optionData[0]?.PIN_CODE)
          // console.log(`${field?.optionData[0]}, aisudhoptions,
          // ${dependentFieldsValues.LOC_PIN_CODE.value !== field?.optionData[0]?.PIN_CODE},
          // dfield -> ${dependentFieldsValues.LOC_PIN_CODE.value},
          // field -> ${field?.optionData[0]?.PIN_CODE},
          // ${dependentFieldsValues.LOC_AREA_CD.value !== field?.optionData[0]?.PARENT_AREA},
          // dfield -> ${dependentFieldsValues.LOC_AREA_CD.value} ,
          // field ->${field?.optionData[0]?.PARENT_AREA}`)
          return values;

          // return {
          //     // PIN_CODE: {value: (dependentFieldsValues?.PIN_CODE?.value && dependentFieldsValues?.PIN_CODE?.value?.length>5) ? dependentFieldsValues?.PIN_CODE?.value :  field?.optionData[0]?.PIN_CODE ?? ""},
          //     LOC_AREA_CD: {value: field?.optionData[0]?.PARENT_AREA, ignoreUpdate: true},
          //     LOC_PIN_CODE: {value: field?.optionData[0]?.PIN_CODE, ignoreUpdate: true},
          //     LOC_CITY_CD: {value: field?.optionData[0]?.CITY_CD ? field?.optionData[0]?.CITY_CD : ""},
          //     // LOC_CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
          //     LOC_DISTRICT_CD: {value: field?.optionData[0]?.DISTRICT_CD ? field?.optionData[0]?.DISTRICT_CD : ""},
          //     // LOC_DISTRICT_CD: {value: (field?.optionData[0]?.DISTRICT_CD || field?.optionData[0]?.DISTRICT_NM) ? `${field?.optionData[0]?.DISTRICT_NM} - ${field?.optionData[0]?.DISTRICT_CD}` : ""},
          //     LOC_STATE_CD: {value: field?.optionData[0]?.STATE_CD ?? ""},
          //     // LOC_STATE_CD: {value: field?.optionData[0]?.STATE_NM ?? ""},
          //     LOC_COUNTRY: {value: field?.optionData[0]?.COUNTRY_NM ?? ""},
          //     STATE_UT_CODE: {value: field?.optionData[0]?.STATE_CD ?? ""},
          //     LOC_COUNTRY_CD: {value: field?.optionData[0]?.COUNTRY_CD ?? ""},
          // }
        }
        return {};
      },
      runPostValidationHookAlways: false,

      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_CITY_CD_ignoreField",
      label: "City",
      //   required: true,
      isReadOnly: true,
      dependentFields: ["SAME_AS_PER", "CITY_ignoreField", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const cityNM = dependentFields.CITY_ignoreField.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return cityNM;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].CITY_NM;
        } else return "";
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "LOC_CITY_CD",
      dependentFields: ["SAME_AS_PER", "CITY_CD", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const cityCD = dependentFields.CITY_CD.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return cityCD;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].CITY_CD;
        } else return "";
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_DISTRICT_ignoreField",
      label: "District",
      placeholder: "",
      dependentFields: ["SAME_AS_PER", "DISTRICT_ignoreField", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const districtNM = dependentFields.DISTRICT_ignoreField.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return districtNM;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].DISTRICT_NM;
        } else return "";
      },
      isReadOnly: true,
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "LOC_DISTRICT_CD",
      label: "hiddendistrict",
      dependentFields: ["SAME_AS_PER", "DISTRICT_CD", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const districtCD = dependentFields.DISTRICT_CD.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return districtCD;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].DISTRICT_CD;
        } else return "";
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "LOC_STATE",
      label: "State",
      placeholder: "",
      isReadOnly: true,
      ignoreInSubmit: true,
      dependentFields: ["SAME_AS_PER", "STATE", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const state = dependentFields.STATE.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return state;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].STATE_NM;
        } else return "";
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_COUNTRY",
      label: "Country",
      isReadOnly: true,
      ignoreInSubmit: true,
      dependentFields: ["SAME_AS_PER", "COUNTRY", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const country = dependentFields.COUNTRY.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return country;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].COUNTRY_NM;
        } else return "";
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_STATE_CD",
      label: "UnionTerritoriesCode",
      placeholder: "",
      isReadOnly: true,
      dependentFields: ["SAME_AS_PER", "STATE_CD", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const stateCD = dependentFields.STATE_CD.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return stateCD;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].STATE_CD;
        } else return "";
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_COUNTRY_CD",
      label: "CountryCode",
      placeholder: "",
      isReadOnly: true,
      dependentFields: ["SAME_AS_PER", "COUNTRY_CD", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const countryCD = dependentFields.COUNTRY_CD.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return countryCD;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].COUNTRY_CD;
        } else return "";
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "LOC_PROOF_OF_ADD",
      label: "ProofofAdd",
      //   required: true,
      placeholder: "",
      dependentFields: ["SAME_AS_PER", "PROOF_OF_ADD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const proofOfAdd = dependentFields.PROOF_OF_ADD.value;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, proofOfAdd)
        if (Boolean(sameAsPer)) {
          return proofOfAdd;
        }
        return null;
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        if (Boolean(sameAsPer)) {
          return true;
        }
        return false;
      },
      options: () => API.getPMISCData("CKYC_LOC_POA"),
      _optionsKey: "localPoA",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 1,
      },
      name: "contactDivider_ignoreField",
      label: "Contact",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "STD_1",
      label: "PhoneO",
      placeholder: "",
      type: "text",
      maxLength: 5,
      GridProps: { xs: 12, sm: 4, md: 0.7, lg: 0.8, xl: 0.7 },
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 5) {
            return false;
          }
          return true;
        },
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CONTACT1",
      label: "",
      placeholder: "",
      maxLength: 20,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 20) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER1",
      GridProps: {
        xs: 0.1,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "STD_4",
      label: "PhoneR",
      placeholder: "",
      maxLength: 5,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 5) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 0.7, lg: 0.8, xl: 0.7 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CONTACT4",
      label: "",
      placeholder: "",
      maxLength: 20,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 20) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER2",
      GridProps: {
        xs: 0.1,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "STD_2",
      label: "MobileNo",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["MobileNoIsRequired"] }],
      },
      placeholder: "",
      maxLength: 3,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 3) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 0.7, lg: 0.8, xl: 0.7 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CONTACT2",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["CONTACT2IsRequired"] }],
      },
      label: "",
      required: true,
      placeholder: "",
      maxLength: 20,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 20) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["STD_2"],
      type: "text",
      validate: (columnValue, allField, flag) => {
        if (columnValue.value) {
          return API.validateMobileNo(columnValue, allField, flag);
        }
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        return await API.DuplicationValidate(
          field,
          dependentFieldsValues,
          formState,
          {
            fieldNm: "CONTACT2",
            CHECK_FOR: "6",
          }
        );
      },
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER3",
      GridProps: {
        xs: 0.1,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "STD_3",
      label: "Fax",
      placeholder: "",
      maxLength: 5,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 5) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 0.7, lg: 0.8, xl: 0.7 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CONTACT3",
      label: "",
      placeholder: "",
      maxLength: 20,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 20) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "E_MAIL_ID",
      label: "EmailId",
      placeholder: "",
      maxLength: 60,
      validate: (columnValue, allField, flag) =>
        API.validateEmailID(columnValue),
      // validate: (columnValue, allField, flag) => {
      //   let emailRegex =
      //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      //   if (columnValue?.value && !emailRegex.test(columnValue?.value)) {
      //     return "Please enter valid Email ID";
      //   }
      //   return "";
      // },
      type: "text",
      txtTransform: "lowercase",
      GridProps: { xs: 12, sm: 4, md: 4, lg: 2.4, xl: 3 },
    },

    // {
    //     render: {
    //       componentType: "numberFormat",
    //     },
    //     name: "MOBILE_NU",
    //     label: "Mobile Number",
    //     placeholder: "",
    //     type: "text",
    //     StartAdornment: "+00",
    //     GridProps: {
    //       xs: 12,
    //       md: 3,
    //       sm: 3,
    //     },
    //     schemaValidation: {
    //       type: "string",
    //       rules: [{ name: "max", params: [11, "Mobile No should be 11 digit."] }],
    //     },
    //     validate: ({ value }) => {
    //       if (Boolean(value) && value.length < 11) {
    //         return "Mobile No should be 11 digit.";
    //       }
    //       return "";
    //     },
    //     FormatProps: {
    //       format: "###########",
    //       allowNegative: false,
    //       allowLeadingZeros: true,
    //       isNumericString: true,
    //       isAllowed: (values) => {
    //         if (values?.value?.length > 11) {
    //           return false;
    //         }
    //         if (values.floatValue === 0) {
    //           return false;
    //         }
    //         return true;
    //       },
    //     },
    //   }
  ],
};

export const kyc_legal_proof_of_add_meta_data = {
  form: {
    name: "kyc_poa_details_form",
    label: "",
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
      render: {
        componentType: "divider",
        sequence: 1,
      },
      name: "currentAddDivider_ignoreField",
      label: "CurrentAddress",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ADDRESS_TYPE",
      label: "AddressType",
      placeholder: "",
      type: "text",
      //   GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
      options: () => API.getPMISCData("ADDRESS_TYPE"),
      _optionsKey: "currentAddType",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Line1",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Line1IsRequired"] }],
      },
      placeholder: "",
      maxLength: 50,
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => API.validateAlphaNumValue(columnValue),
      GridProps: { xs: 12, sm: 5, md: 3.2, lg: 3.2, xl: 3.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD2",
      label: "Line2",
      placeholder: "",
      maxLength: 50,
      type: "text",
      txtTransform: "uppercase",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => API.validateAlphaNumValue(columnValue),
      GridProps: { xs: 12, sm: 5, md: 3.2, lg: 3.2, xl: 3.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD3",
      label: "Line3",
      placeholder: "",
      maxLength: 50,
      type: "text",
      preventSpecialChars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      validate: (columnValue) => API.validateAlphaNumValue(columnValue),
      GridProps: { xs: 12, sm: 5, md: 3.2, lg: 3.2, xl: 3.3 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "PIN_CODE",
      label: "PIN",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["PINIsRequired"] }],
      },
      maxLength: 6,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 6) {
            return false;
          }
          return true;
        },
      },
      validate: (columnValue) => {
        const PIN = columnValue.value;
        if (Boolean(PIN) && PIN.length < 6) {
          return "PinCodeShouldBeOfSixDigits";
        }
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      runPostValidationHookAlways: false,
      name: "AREA_CD",
      label: "SubArea",
      dependentFields: ["PIN_CODE"],
      disableCaching: true,
      options: (dependentValue, formState, _, authState) =>
        API.getOptionsOnPinParentArea(
          dependentValue?.PIN_CODE?.value,
          formState,
          _,
          authState
        ),
      _optionsKey: "indSubareaOp",
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const pin_code = dependentFields.PIN_CODE.value;
        if (!Boolean(pin_code)) {
          return true;
        } else if (Boolean(pin_code) && pin_code.length < 6) {
          return true;
        }
        return false;
      },
      setValueOnDependentFieldsChange: (dependentFields) => {
        const pincode = dependentFields.PIN_CODE.value;
        // console.log("siudbcsiudbcisbdc setvalue", pincode);
        if (Boolean(pincode)) {
          if (pincode.length < 6) {
            return "";
          }
        } else return null;
      },
      postValidationSetCrossFieldValues: (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        // console.log("siudbcsiudbcisbdc postValidationSetCrossFieldValues called", field.value)
        // console.log("sdhaiuwqidquwdqwe", dependentFieldsValues)
        if (field.value) {
          let values = {
            CITY_CD: {
              value: field?.optionData[0]?.CITY_CD
                ? field?.optionData[0]?.CITY_CD
                : "",
            },
            CITY_ignoreField: {
              value: field?.optionData[0]?.CITY_NM
                ? field?.optionData[0]?.CITY_NM
                : "",
            },
            // CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
            DISTRICT_CD: {
              value: field?.optionData[0]?.DISTRICT_CD
                ? field?.optionData[0]?.DISTRICT_CD
                : "",
            },
            DISTRICT_ignoreField: {
              value: field?.optionData[0]?.DISTRICT_NM
                ? field?.optionData[0]?.DISTRICT_NM
                : field?.optionData[0]?.DISTRICT_CD
                ? field?.optionData[0]?.DISTRICT_CD
                : "",
            },
            STATE: { value: field?.optionData[0]?.STATE_NM ?? "" },
            COUNTRY: { value: field?.optionData[0]?.COUNTRY_NM ?? "" },
            STATE_CD: { value: field?.optionData[0]?.STATE_CD ?? "" },
            COUNTRY_CD: { value: field?.optionData[0]?.COUNTRY_CD ?? "" },
          };
          return values;
        }
        return {};
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CITY_ignoreField",
      label: "City",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["CityIsRequired"] }],
      },
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].CITY_NM;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CITY_CD",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].CITY_CD;
        } else return "";
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DISTRICT_ignoreField",
      label: "DistrictName",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].DISTRICT_NM;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DISTRICT_CD",
      label: "hiddendistrict",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].DISTRICT_CD;
        } else return "";
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "STATE",
      label: "State",
      isReadOnly: true,
      ignoreInSubmit: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].STATE_NM;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COUNTRY",
      label: "Country",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].COUNTRY_NM;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "STATE_CD",
      label: "UnionTerritoriesCode",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].STATE_CD;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COUNTRY_CD",
      label: "CountryCode",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields.AREA_CD.optionData;
        // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue");
        if (optionData && optionData.length > 0) {
          return optionData[0].COUNTRY_CD;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "PROOF_OF_ADD",
      label: "ProofofAdd",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ProofofAddressIsRequired"] }],
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
      options: () => API.getPMISCData("CKYC_ADD_PROOF"),
      _optionsKey: "currentPoA",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "OTHER_POA",
      label: "OthersPoA",
      maxLength: 50,
      validate: (columnValue, allField, flag) => {
        let regex = /^[a-zA-Z]+$/;
        if (columnValue.value && !regex.test(columnValue.value)) {
          return "Please Enter Character Value.";
        }
        return "";
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 1,
      },
      name: "localAddDivider_ignoreField",
      label: "CorrespondenceAddress",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: { componentType: "checkbox" },
      name: "SAME_AS_PER",
      label: "SameAsPermanentAddress",
      defaultValue: false,
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "LOC_ADD_TYPE",
      label: "LocalAddressType",
      placeholder: "",
      type: "text",
      dependentFields: ["SAME_AS_PER", "ADDRESS_TYPE"],
      options: () => API.getPMISCData("ADDRESS_TYPE"),
      _optionsKey: "CurAddTypelocalOp",
      setValueOnDependentFieldsChange: (dependentFields) => {
        // console.log("same as perch", dependentFields.SAME_AS_PER.value)
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const AddType = dependentFields.ADDRESS_TYPE.value;
        if (Boolean(sameAsPer)) {
          return AddType;
        }
        return null;
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        if (Boolean(sameAsPer)) {
          return true;
        }
        return false;
      },
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_ADD1",
      label: "Line1",
      required: true,
      maxLength: 50,
      dependentFields: ["SAME_AS_PER", "ADD1"],
      runValidationOnDependentFieldsChange: true,
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue?.value)) {
          return "Line1IsRequired";
        } else {
          return API.validateAlphaNumValue(columnValue);
        }
      },
      setValueOnDependentFieldsChange: (dependentFields) => {
        // console.log("fewiwuehfiwuefwef", dependentFields)
        if (
          dependentFields.SAME_AS_PER &&
          Boolean(dependentFields.SAME_AS_PER.value)
        ) {
          const add1 = dependentFields.ADD1.value;
          return add1;
        }
        return null;
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        if (Boolean(sameAsPer)) {
          return true;
        }
        return false;
      },
      placeholder: "",
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 5, md: 4, lg: 3.6, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_ADD2",
      label: "Line2",
      placeholder: "",
      maxLength: 50,
      dependentFields: ["SAME_AS_PER", "ADD2"],
      validate: (columnValue, allField, flag) =>
        API.validateAlphaNumValue(columnValue),
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const add2 = dependentFields.ADD2.value;
        if (Boolean(sameAsPer)) {
          return add2;
        }
        return null;
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        if (Boolean(sameAsPer)) {
          return true;
        }
        return false;
      },
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 5, md: 4, lg: 3.6, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_ADD3",
      label: "Line3",
      placeholder: "",
      maxLength: 50,
      validate: (columnValue, allField, flag) =>
        API.validateAlphaNumValue(columnValue),
      dependentFields: ["SAME_AS_PER", "ADD3"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const add3 = dependentFields.ADD3.value;
        if (Boolean(sameAsPer)) {
          return add3;
        }
        return null;
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        if (Boolean(sameAsPer)) {
          return true;
        }
        return false;
      },
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 5, md: 4, lg: 3.6, xl: 4 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "LOC_PIN_CODE",
      label: "PIN",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
      required: true,
      maxLength: 6,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 6) {
            return false;
          }
          return true;
        },
      },
      dependentFields: ["SAME_AS_PER", "PIN_CODE"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const pinCode = dependentFields.PIN_CODE.value;
        if (Boolean(sameAsPer)) {
          return pinCode;
        }
        return null;
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        if (Boolean(sameAsPer)) {
          return true;
        }
        return false;
      },
      runValidationOnDependentFieldsChange: true,
      validate: (columnValue) => {
        const PIN = columnValue.value;
        if (!Boolean(columnValue?.value)) {
          return "PINIsRequired";
        } else if (Boolean(PIN) && PIN.length < 6) {
          return "PinCodeShouldBeOfSixDigits";
        }
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "LOC_AREA_CD2",
      dependentFields: ["LOC_PIN_CODE", "SAME_AS_PER", "AREA_CD"],
      disableCaching: true,
      options: (dependentValue, formState, _, authState) =>
        API.getOptionsOnLocalPinParentArea(
          dependentValue,
          formState,
          _,
          authState
        ),
      _optionsKey: "localSubAreaList",
      label: "Sub Area",
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const pin_code = dependentFields.LOC_PIN_CODE.value;
        if (Boolean(sameAsPer)) {
          return true;
        } else if (!Boolean(pin_code)) {
          return true;
        } else if (Boolean(pin_code) && pin_code.length < 6) {
          return true;
        }
        return false;
      },
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const areaCD = dependentFields.AREA_CD.value;
        const pincode = dependentFields.LOC_PIN_CODE.value;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, areaCD)
        if (Boolean(sameAsPer)) {
          return areaCD;
        } else if (Boolean(pincode)) {
          if (pincode.length < 6) {
            return "";
          }
        } else return null;
        return null;
      },
      postValidationSetCrossFieldValues: (
        field,
        formState,
        ___,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        const sameAsPer = dependentFieldsValues.SAME_AS_PER.value;
        if (field.value && !Boolean(sameAsPer)) {
          let values = {
            LOC_CITY_CD: {
              value: field?.optionData[0]?.CITY_CD
                ? field?.optionData[0]?.CITY_CD
                : "",
            },
            LOC_CITY_CD_ignoreField: {
              value: field?.optionData[0]?.CITY_NM
                ? field?.optionData[0]?.CITY_NM
                : field?.optionData[0]?.CITY_CD
                ? field?.optionData[0]?.CITY_CD
                : "",
            },
            // CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
            LOC_DISTRICT_CD: {
              value: field?.optionData[0]?.DISTRICT_CD
                ? field?.optionData[0]?.DISTRICT_CD
                : "",
            },
            LOC_DISTRICT_ignoreField: {
              value: field?.optionData[0]?.DISTRICT_NM
                ? field?.optionData[0]?.DISTRICT_NM
                : field?.optionData[0]?.DISTRICT_CD
                ? field?.optionData[0]?.DISTRICT_CD
                : "",
            },
            LOC_STATE: { value: field?.optionData[0]?.STATE_NM ?? "" },
            LOC_COUNTRY: { value: field?.optionData[0]?.COUNTRY_NM ?? "" },
            LOC_STATE_CD: { value: field?.optionData[0]?.STATE_CD ?? "" },
            LOC_COUNTRY_CD: { value: field?.optionData[0]?.COUNTRY_CD ?? "" },
          };
          // console.log(dependentFieldsValues.LOC_AREA_CD.value == field?.optionData[0]?.PARENT_AREA, "dsadsaasdasdasdasd", dependentFieldsValues.LOC_PIN_CODE.value == field?.optionData[0]?.PIN_CODE)
          // console.log(`${field?.optionData[0]}, aisudhoptions,
          // ${dependentFieldsValues.LOC_PIN_CODE.value !== field?.optionData[0]?.PIN_CODE},
          // dfield -> ${dependentFieldsValues.LOC_PIN_CODE.value},
          // field -> ${field?.optionData[0]?.PIN_CODE},
          // ${dependentFieldsValues.LOC_AREA_CD.value !== field?.optionData[0]?.PARENT_AREA},
          // dfield -> ${dependentFieldsValues.LOC_AREA_CD.value} ,
          // field ->${field?.optionData[0]?.PARENT_AREA}`)
          return values;

          // return {
          //     // PIN_CODE: {value: (dependentFieldsValues?.PIN_CODE?.value && dependentFieldsValues?.PIN_CODE?.value?.length>5) ? dependentFieldsValues?.PIN_CODE?.value :  field?.optionData[0]?.PIN_CODE ?? ""},
          //     LOC_AREA_CD: {value: field?.optionData[0]?.PARENT_AREA, ignoreUpdate: true},
          //     LOC_PIN_CODE: {value: field?.optionData[0]?.PIN_CODE, ignoreUpdate: true},
          //     LOC_CITY_CD: {value: field?.optionData[0]?.CITY_CD ? field?.optionData[0]?.CITY_CD : ""},
          //     // LOC_CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
          //     LOC_DISTRICT_CD: {value: field?.optionData[0]?.DISTRICT_CD ? field?.optionData[0]?.DISTRICT_CD : ""},
          //     // LOC_DISTRICT_CD: {value: (field?.optionData[0]?.DISTRICT_CD || field?.optionData[0]?.DISTRICT_NM) ? `${field?.optionData[0]?.DISTRICT_NM} - ${field?.optionData[0]?.DISTRICT_CD}` : ""},
          //     LOC_STATE_CD: {value: field?.optionData[0]?.STATE_CD ?? ""},
          //     // LOC_STATE_CD: {value: field?.optionData[0]?.STATE_NM ?? ""},
          //     LOC_COUNTRY: {value: field?.optionData[0]?.COUNTRY_NM ?? ""},
          //     STATE_UT_CODE: {value: field?.optionData[0]?.STATE_CD ?? ""},
          //     LOC_COUNTRY_CD: {value: field?.optionData[0]?.COUNTRY_CD ?? ""},
          // }
        }
        return {};
      },
      runPostValidationHookAlways: false,

      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_CITY_CD_ignoreField",
      label: "City",
      //   required: true,
      isReadOnly: true,
      dependentFields: ["SAME_AS_PER", "CITY_ignoreField", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const cityNM = dependentFields.CITY_ignoreField.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return cityNM;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].CITY_NM;
        } else return "";
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "LOC_CITY_CD",
      dependentFields: ["SAME_AS_PER", "CITY_CD", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const cityCD = dependentFields.CITY_CD.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return cityCD;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].CITY_CD;
        } else return "";
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_DISTRICT_ignoreField",
      label: "District",
      placeholder: "",
      dependentFields: ["SAME_AS_PER", "DISTRICT_ignoreField", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const districtNM = dependentFields.DISTRICT_ignoreField.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return districtNM;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].DISTRICT_NM;
        } else return "";
      },
      isReadOnly: true,
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "LOC_DISTRICT_CD",
      label: "hiddendistrict",
      dependentFields: ["SAME_AS_PER", "DISTRICT_CD", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const districtCD = dependentFields.DISTRICT_CD.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return districtCD;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].DISTRICT_CD;
        } else return "";
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "LOC_STATE",
      label: "State",
      placeholder: "",
      isReadOnly: true,
      ignoreInSubmit: true,
      dependentFields: ["SAME_AS_PER", "STATE", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const state = dependentFields.STATE.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return state;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].STATE_NM;
        } else return "";
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_COUNTRY",
      label: "Country",
      isReadOnly: true,
      ignoreInSubmit: true,
      dependentFields: ["SAME_AS_PER", "COUNTRY", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const country = dependentFields.COUNTRY.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return country;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].COUNTRY_NM;
        } else return "";
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_STATE_CD",
      label: "UnionTerritoriesCode",
      placeholder: "",
      isReadOnly: true,
      dependentFields: ["SAME_AS_PER", "STATE_CD", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const stateCD = dependentFields.STATE_CD.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return stateCD;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].STATE_CD;
        } else return "";
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOC_COUNTRY_CD",
      label: "CountryCode",
      placeholder: "",
      isReadOnly: true,
      dependentFields: ["SAME_AS_PER", "COUNTRY_CD", "LOC_AREA_CD2"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const countryCD = dependentFields.COUNTRY_CD.value;
        const optionData = dependentFields.LOC_AREA_CD2.optionData;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, cityNM)
        if (Boolean(sameAsPer)) {
          return countryCD;
        } else if (optionData && optionData.length > 0) {
          return optionData[0].COUNTRY_CD;
        } else return "";
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "LOC_PROOF_OF_ADD",
      label: "ProofofAdd",
      //   required: true,
      placeholder: "",
      dependentFields: ["SAME_AS_PER", "PROOF_OF_ADD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        const proofOfAdd = dependentFields.PROOF_OF_ADD.value;
        // console.log("siudbcsiudbcisbdc setvalue", sameAsPer, proofOfAdd)
        if (Boolean(sameAsPer)) {
          return proofOfAdd;
        }
        return null;
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        const sameAsPer = dependentFields.SAME_AS_PER.value;
        if (Boolean(sameAsPer)) {
          return true;
        }
        return false;
      },
      options: () => API.getPMISCData("CKYC_LOC_POA"),
      _optionsKey: "localPoA",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 1,
      },
      name: "contactDivider_ignoreField",
      label: "Contact",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "STD_1",
      label: "PhoneO",
      placeholder: "",
      type: "text",
      maxLength: 5,
      GridProps: { xs: 12, sm: 4, md: 0.7, lg: 0.8, xl: 0.7 },
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 5) {
            return false;
          }
          return true;
        },
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CONTACT1",
      label: "",
      placeholder: "",
      maxLength: 20,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 20) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER1",
      GridProps: {
        xs: 0.1,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "STD_2",
      label: "PhoneR",
      placeholder: "",
      maxLength: 5,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 5) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 0.7, lg: 0.8, xl: 0.7 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CONTACT2",
      label: "",
      placeholder: "",
      maxLength: 20,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 20) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER2",
      GridProps: {
        xs: 0.1,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "STD_3",
      label: "MobileNo",
      required: true,
      placeholder: "",
      maxLength: 3,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 3) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 0.7, lg: 0.8, xl: 0.7 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CONTACT3",
      label: "",
      required: true,
      placeholder: "",
      maxLength: 20,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 20) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER3",
      GridProps: {
        xs: 0.1,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "STD_4",
      label: "Fax",
      placeholder: "",
      maxLength: 5,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 5) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 0.7, lg: 0.8, xl: 0.7 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CONTACT4",
      label: "",
      placeholder: "",
      maxLength: 20,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 20) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "E_MAIL_ID",
      label: "EmailId",
      placeholder: "",
      maxLength: 60,
      validate: (columnValue, allField, flag) => {
        let emailRegex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (columnValue?.value && !emailRegex.test(columnValue?.value)) {
          return "PleaseEnterValidEmailID";
        }
        return "";
      },
      type: "text",
      txtTransform: "lowercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "E_MAIL_ID2",
      label: "EmailId2",
      maxLength: 60,
      validate: (columnValue, allField, flag) => {
        let emailRegex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (columnValue?.value && !emailRegex.test(columnValue?.value)) {
          return "PleaseEnterValidEmailID";
        }
        return "";
      },
      placeholder: "",
      type: "text",
      txtTransform: "lowercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 3 },
    },

    // {
    //     render: {
    //       componentType: "numberFormat",
    //     },
    //     name: "MOBILE_NU",
    //     label: "Mobile Number",
    //     placeholder: "",
    //     type: "text",
    //     StartAdornment: "+00",
    //     GridProps: {
    //       xs: 12,
    //       md: 3,
    //       sm: 3,
    //     },
    //     schemaValidation: {
    //       type: "string",
    //       rules: [{ name: "max", params: [11, "Mobile No should be 11 digit."] }],
    //     },
    //     validate: ({ value }) => {
    //       if (Boolean(value) && value.length < 11) {
    //         return "Mobile No should be 11 digit.";
    //       }
    //       return "";
    //     },
    //     FormatProps: {
    //       format: "###########",
    //       allowNegative: false,
    //       allowLeadingZeros: true,
    //       isNumericString: true,
    //       isAllowed: (values) => {
    //         if (values?.value?.length > 11) {
    //           return false;
    //         }
    //         if (values.floatValue === 0) {
    //           return false;
    //         }
    //         return true;
    //       },
    //     },
    //   }
  ],
};
export const kyc_dup_reason_form = {
  form: {
    name: "kyc_dup_reason_form",
    label: "",
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
      render: {
        componentType: "autocomplete",
      },
      name: "PAN_DUP_REASON_DDW",
      label: "Reason of Duplication",
      options: () => API.getPMISCData("DUP_REASON"),
      _optionsKey: "dupReasonOptions",
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (currentField?.value) {
          return {
            PAN_DUP_REASON: {
              value: currentField?.optionData?.[0]?.label ?? "",
              ignoreUpdate: false,
            },
          };
        }
        return {};
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PAN_DUP_REASON",
      label: "Reason of Duplication",
      maxLength: 300,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["DupReasonIsRequired"] }],
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 },
    },
  ],
};
