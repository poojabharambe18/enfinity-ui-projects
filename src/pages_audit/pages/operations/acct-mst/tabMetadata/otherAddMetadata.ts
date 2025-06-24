import { getCourtMasterArea } from "pages_audit/pages/master/courtmaster/api";
import { getPMISCData } from "../../c-kyc/api";
import * as API from "../api";

export const otherAdd_tab_metadata = {
  form: {
    name: "otherAdd_tab_form",
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
      name: "OTHER_ADDRESS_DTL",
      // fixedRows: 1,
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
            componentType: "autocomplete",
          },
          name: "ADDRESS_TYPE",
          label: "AddressType",
          options: () => getPMISCData("ADDRESS_TYPE"),
          _optionsKey: "currentAddType",
          placeholder: "SelectAddressType",
          type: "text",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["AddressTypeIsRequired"] }],
          },
          //   GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "divider",
          },
          name: "AddDivider_ignoreField",
          label: "Address",
          DividerProps: {
            sx: { color: "var(--theme-color1)", fontWeight: "500" },
          },
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ADD1",
          label: "Line1",
          maxLength: 50,
          placeholder: "EnterLine1",
          type: "text",
          txtTransform: "uppercase",
          autoComplete: "off",
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          GridProps: { xs: 12, sm: 6, md: 4, lg: 3.2, xl: 3.3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ADD2",
          label: "Line2",
          placeholder: "EnterLine2",
          maxLength: 50,
          type: "text",
          txtTransform: "uppercase",
          autoComplete: "off",
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          GridProps: { xs: 12, sm: 6, md: 4, lg: 3.2, xl: 3.3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ADD3",
          label: "Line3",
          placeholder: "EnterLine3",
          maxLength: 50,
          type: "text",
          txtTransform: "uppercase",
          autoComplete: "off",
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          GridProps: { xs: 12, sm: 6, md: 4, lg: 3.2, xl: 3.3 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "PIN_CD",
          label: "PIN",
          isReadOnly: true,
          type: "text",
          GridProps: { xs: 12, sm: 6, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          runPostValidationHookAlways: true,
          name: "AREA_CD",
          label: "Area",
          enableVirtualized: true,
          dependentFields: ["PIN_CD"],
          // disableCaching: true,
          options: getCourtMasterArea,
          _optionsKey: "OtherAddressAreaDDW",
          // setValueOnDependentFieldsChange: (dependentFields) => {
          //   console.log("dependentPin", dependentFields);
          //   const pincode = dependentFields.PIN_CODE.value;
          //   if (Boolean(pincode)) {
          //     if (pincode.length < 6) {
          //       return "";
          //     }
          //   } else return null;
          // },
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            return {
              PIN_CD: {
                value: Boolean(field.value)
                  ? field?.optionData?.[0]?.PIN_CODE
                  : "",
              },
            };
          },
          placeholder: "selectArea",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CITY_ignoreField",
          label: "City",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS_DTL.AREA_CD"]?.optionData;
            // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue")
            if (optionData && optionData.length > 0) {
              return optionData[0].CITY_NM;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "CITY_CD",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS_DTL.AREA_CD"]?.optionData;
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
          ignoreInSubmit: true,
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS_DTL.AREA_CD"]?.optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].DIST_NM;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "DIST_CD",
          label: "hiddendistrict",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS_DTL.AREA_CD"]?.optionData;
            // console.log(dependentFields.AREA_CD, "siudbcsiudbcisbdc setvalue")
            if (optionData && optionData.length > 0) {
              return optionData[0].DISTRICT_CD;
            } else return "";
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "STATE_ignoreField",
          label: "State",
          isReadOnly: true,
          ignoreInSubmit: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS_DTL.AREA_CD"]?.optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].STATE_NM;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "STATE_CD",
          label: "hiddenState",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].STATE_CD;
            } else return "";
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "COUNTRY_ignoreField",
          label: "Country",
          isReadOnly: true,
          ignoreInSubmit: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS_DTL.AREA_CD"]?.optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].COUNTRY_NM;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "COUNTRY_CD",
          label: "hiddenCountry",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].COUNTRY_CD;
            } else return "";
          },
        },
        {
          render: {
            componentType: "divider",
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
          name: "CONTACT1",
          label: "PhoneO",
          placeholder: "EnterPhoneO",
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
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CONTACT4",
          label: "PhoneR",
          placeholder: "EnterPhoneR",
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
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CONTACT2",
          label: "MobileNum",
          placeholder: "EnterMobileNo",
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
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CONTACT3",
          label: "AlternatePhone",
          placeholder: "EnterAlternatePhone",
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
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
      ],
    },
  ],
};
