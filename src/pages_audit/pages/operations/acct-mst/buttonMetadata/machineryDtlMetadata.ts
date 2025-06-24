import { isValid } from "date-fns";
import { getMachineryDtlDefaultDW } from "../api";
import { getPMISCData } from "../../c-kyc/api";
import { utilFunction } from "@acuteinfo/common-base";

export const MachineryDetailsMetadata = {
  form: {
    name: "MachineryDetailsMetadata",
    label: "Machinery Detail",
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
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "DEALER_NAME",
      label: "DealerName",
      placeholder: "EnterDealerName",
      type: "text",
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MAKER",
      label: "MakerName",
      placeholder: "EnterMakerName",
      type: "text",
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MACHINE_SR_NO",
      label: "MachineSrNo",
      placeholder: "EnterMachineSrNo",
      type: "text",
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      GridProps: { xs: 12, sm: 12, md: 6, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MODEL_NO",
      label: "ModelNo",
      placeholder: "EnterModelNo",
      type: "text",
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 4, xl: 4 },
    },
    {
      render: { componentType: "numberFormat" },
      name: "MANUF_YEAR",
      placeholder: "0000",
      label: "YearOfManufacture",
      FormatProps: {
        allowNegative: false,
        isAllowed: (values) => {
          if (values?.value?.length > 4) {
            return false;
          }
          return true;
        },
      },
      GridProps: { xs: 12, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "HYPO_TO_BANK",
      label: "HypoToBank",
      options: getMachineryDtlDefaultDW,
      _optionsKey: "getMachineryDtlDefaultDW",
      defaultValue: "N",
      defaultOptionLabel: "SelectHypoToBank",
      GridProps: { xs: 12, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "ROC",
      label: "RegistarOfCompanies",
      options: getMachineryDtlDefaultDW,
      _optionsKey: "getMachineryDtlDefaultDW",
      defaultValue: "N",
      defaultOptionLabel: "SelectRegistarOfCompanies",
      GridProps: { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "IMPORTED",
      label: "Imported",
      options: getMachineryDtlDefaultDW,
      _optionsKey: "getMachineryDtlDefaultDW",
      defaultValue: "N",
      defaultOptionLabel: "SelectImported",
      GridProps: { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "COST_AMT",
      label: "CostAmount",
      type: "text",
      FormatProps: {
        allowNegative: false,
        isAllowed: (values) => {
          if (values?.value?.length > 15) {
            return false;
          }
          return true;
        },
      },
      GridProps: { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "MARGIN",
      label: "Margin",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 4, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "ELIGIBLE_VALUE",
      label: "EligibleValue",
      type: "text",
      FormatProps: {
        allowNegative: false,
        isAllowed: (values) => {
          if (values?.value?.length > 15) {
            return false;
          }
          return true;
        },
      },
      GridProps: { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "DOCUMENT_DT",
      label: "DocumentDate",
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
      GridProps: { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "PROPERTY_TYPE",
      label: "EquipmentType",
      options: () => getPMISCData("EQUIPMENT_TYPE"),
      _optionsKey: "getPMISCData",
      defaultOptionLabel: "SelectEquipmentType",
      GridProps: { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "DescriptionRemarks",
      placeholder: "EnterDescriptionRemarks",
      type: "text",
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
  ],
};
