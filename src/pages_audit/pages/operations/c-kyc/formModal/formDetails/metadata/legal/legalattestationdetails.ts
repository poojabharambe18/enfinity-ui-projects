import { isValid } from "date-fns";
import * as API from "../../../../api";
export const legal_attestation_detail_meta_data = {
  form: {
    name: "attestation_details_form",
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
          spacing: 3,
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
        componentType: "select",
      },
      name: "DOC_TYPE",
      label: "TypeOfDocSubmitted",
      options: () => API.getPMISCData("CKYC_RCVDOCTYPE"),
      _optionsKey: "ckycDocTypes",
      required: true,
      placeholder: "",
      type: "text",
      GridProps: { xs: 4, sm: 3 },
    },
    {
      render: {
        componentType: "select",
      },
      options: [
        { label: "Risk Category 1", value: "riskcat1" },
        { label: "Risk Category 2", value: "riskcat2" },
      ],
      name: "RISK_CATEGORY",
      label: "RiskCategory",
      isReadOnly: true,
      // required: true,
      placeholder: "",
      type: "text",
      GridProps: { xs: 4, sm: 3 },
    },
    {
      render: {
        componentType: "select",
      },
      options: [
        { label: "YES", value: "Y" },
        { label: "NO", value: "N" },
      ],
      name: "KYC_VERIFICATION_FLAG",
      label: "KYCVerificationFlag",
      required: true,
      placeholder: "",
      type: "text",
      GridProps: { xs: 4, sm: 3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "KYC_VERIFICATION_EMP_CODE",
      label: "KYCVerificationEmpCode",
      placeholder: "",
      required: true,
      type: "text",
      GridProps: { xs: 4, sm: 3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "KYC_VERIFICATION_EMP_NAME",
      label: "KYCVerificationEmpName",
      placeholder: "",
      type: "text",
      GridProps: { xs: 4, sm: 3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "KYC_VERIFICATION_EMP_DESIGNATION",
      label: "KYCVerificationEmpDesignation",
      placeholder: "",
      type: "text",
      GridProps: { xs: 4, sm: 3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "KYC_VERIFICATION_BRANCH",
      label: "KYCVerificationBranch",
      required: true,
      placeholder: "",
      type: "text",
      GridProps: { xs: 4, sm: 3 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "KYC_VERIFICATION_DATE",
      label: "KYCVerificationDate",
      validate: (value) => {
        if (Boolean(value?.value) && !isValid(value?.value)) {
          return "Mustbeavaliddate";
        }
        return "";
      },
      // placeholder: "",
      // type: "datePicker",
      GridProps: { xs: 4, sm: 3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ORG_CODE",
      label: "OrganizationCode",
      placeholder: "",
      required: true,
      type: "text",
      GridProps: { xs: 4, sm: 3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ORG_NAME",
      label: "OrganizationName",
      placeholder: "",
      required: true,
      type: "text",
      GridProps: { xs: 4, sm: 3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PLACE_OF_DECLARATION",
      label: "PlaceOfDeclaration",
      placeholder: "",
      type: "text",
      GridProps: { xs: 4, sm: 3 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "DATE_OF_DECLARATION",
      label: "DateOfDeclaration",
      validate: (value) => {
        if (Boolean(value?.value) && !isValid(value?.value)) {
          return "Mustbeavaliddate";
        }
        return "";
      },
      // placeholder: "",
      // type: "datePicker",
      GridProps: { xs: 4, sm: 3 },
    },
  ],
};
