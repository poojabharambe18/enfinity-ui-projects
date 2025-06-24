import * as API from "../api";
import { getPMISCData } from "../../c-kyc/api";
import { format } from "date-fns";
import { utilFunction } from "@acuteinfo/common-base";

export const fixDeposit_tab_metadata = {
  form: {
    name: "fixdeposit_tab_form",
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
      label: "AcBelongsToDirector",
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
      label: "Name",
      options: () => API.getAdvDirectorNameTypeOP({ A_ROLE_IND: "D" }),
      _optionsKey: "directorNmFDOp",
      placeholder: "SelectName",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DAY_BOOK_REVRS_GRP_CD",
      label: "Relationship",
      options: (dependentValue) => getPMISCData("RELATIONSHIP"),
      _optionsKey: "relationshipFDOp",
      placeholder: "SelectRelationship",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PATH_SIGN",
      label: "NatureOfInterest",
      type: "text",
      maxLength: 100,
      placeholder: "EnterNatureOfInterest",
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    // {
    //     render: {
    //         componentType: "autocomplete",
    //     },
    //     name: "INST_NO",
    //     label: "Chq. Sign Autho",
    //     placeholder: "",
    //     // defaultValue: "N",
    //     type: "text",
    //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
    //     options: [
    //         {label: "", value: ""}
    //     ],
    // },

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
      _optionsKey: "categFDOp",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Categoryisrequired"] }],
      },
      placeholder: "selectCategory",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
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
      _optionsKey: "riskCategFDOp",
      placeholder: "SelectRiskCategory",
      type: "text",
      isReadOnly: (fieldValue, dependentFields, formState) =>
        API.isReadOnlyOn320Flag(formState.DISABLE_CLASS_CD),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "AGENT_CD",
      label: "Agent",
      options: (dependentValue, formState, _, authState) =>
        API.getAgentTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "agentFDOp",
      placeholder: "SelectAgent",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
      },
      name: "fddtldivider_ignoreField",
      label: "FDDetails",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PACKET_NO",
      label: "FDNo",
      type: "text",
      isReadOnly: true,
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "INSTALLMENT_TYPE",
      label: "PeriodTenor",
      options: (dependentValue, formState, _, authState) =>
        API.getAgentTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }), //COME BACK
      _optionsKey: "agentFDOp",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["PeriodTenorIsRequired"] }],
      },
      placeholder: "SelectPeriodTenure",
      type: "text",
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      //COME BACK
      render: {
        componentType: "textField", //come back
      },
      name: "INST_NO",
      label: "Lookupdisplay",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["LookupdisplayIsRequired"] }],
      },
      placeholder: "EnterLookupdisplay",
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "INST_DUE_DT",
      label: "MaturityDate",
      isReadOnly: true,
      placeholder: "DD/MM/YYYY",
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "INT_RATE",
      label: "IntRate",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["IntRateisrequired"] }],
      },
      FormatProps: {
        allowNegative: false,
        isAllowed: (values) => {
          //@ts-ignore
          if (values.floatValue > 999.99) {
            return false;
          }
          return true;
        },
      },
      isReadOnly: (fieldValue, dependentFields, formState) =>
        API.isReadOnlyOn320Flag(formState?.DISABLE_INT_RATE),
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      //COME BACK
      render: {
        componentType: "select",
      },
      name: "INT_TYPE",
      label: "InterestType",
      options: [
        { label: "Monthly", value: "M" },
        { label: "Quarterly", value: "Q" },
        { label: "Half-Yearly", value: "H" },
        { label: "Yearly", value: "Y" },
      ],
      defaultOptionLabel: "SelectIntType",
      type: "text",
      isReadOnly: (fieldValue, dependentFields, formState) =>
        API.isReadOnlyOn320Flag(formState?.DISABLE_INT_TYPE),
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      //come back
      render: {
        componentType: "datePicker",
      },
      name: "INST_RS",
      label: "MonthInt",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["MonthIntisrequired"] }],
      },
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
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REF_COMP_CD",
      label: "CreditAcctNo",
      placeholder: "COMPCD",
      maxLength: 4,
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 2.6, md: 1.5, lg: 1.6, xl: 1.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REF_BRANCH_CD",
      label: "",
      placeholder: "BRANCHCD",
      maxLength: 4,
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 2.7, md: 1.5, lg: 1.6, xl: 1.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REF_ACCT_TYPE",
      label: "",
      placeholder: "AcctType",
      maxLength: 4,
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 2.7, md: 1.5, lg: 1.6, xl: 1.4 },
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
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "REF_ACCT_NM",
      label: "CreditAcctName",
      isReadOnly: true,
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ACTION_TAKEN_CD",
      label: "MatureInstruction",
      options: (dependentValue, formState, _, authState) =>
        API.getAgentTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }), //COME BACK
      _optionsKey: "agentFDOp",
      placeholder: "SelectMatureInstruction",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["MatureInstructionIsRequired"] }],
      },
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
      },
      name: "amountdivider_ignoreField",
      label: "Amount",
      DividerProps: {
        sx: { color: "var(--theme-color1)", fontWeight: "500" },
      },
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "APPLIED_AMT",
      label: "Cash",
      type: "text",
      FormatProps: {
        allowNegative: true,
      },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["CashIsRequired"] }],
      },
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SANCTIONED_AMT",
      label: "Transfer",
      type: "text",
      FormatProps: {
        allowNegative: true,
      },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["TransferIsRequired"] }],
      },
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      dependentFields: ["CATEG_CD"],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        // current, hypo, TL
        if (formState?.isSubmitting) return {};
        if (Boolean(currentField?.value)) {
          const data = await API.validateANCAMT({
            COMP_CD: authState?.companyID,
            BRANCH_CD:
              formState?.formMode !== "new"
                ? formState?.BRANCH_CD ?? ""
                : authState?.user?.branchCode ?? "",
            ACCT_TYPE: formState?.ACCT_TYPE ?? "",
            ACCT_CD: formState?.ACCT_CD ?? "",
            CUSTOMER_ID: formState?.CUSTOMER_ID ?? "",
            CATEG_CD: dependentFieldValues?.CATEG_CD?.value ?? "",
            PURPOSE_CD: dependentFieldValues?.PURPOSE_CD?.value ?? "",
            PTS: dependentFieldValues?.PTS?.value ?? "",
            INT_RATE_BASE_ON: formState?.INT_RATE_BASE_ON ?? "",
            SHARE_ACCT_TYPE: formState?.SHARE_ACCT_TYPE ?? "",
            SHARE_ACCT_CD: formState?.SHARE_ACCT_CD ?? "",
            APPLIED_AMT: formState?.APPLIED_AMT ?? "",
            LIMIT_AMOUNT: formState?.LIMIT_AMOUNT ?? "",
            SANCTIONED_AMT: currentField?.value ?? "",
            SANCTION_DT: Boolean(dependentFieldValues?.SANCTION_DT?.value)
              ? format(
                  utilFunction.getParsedDate(
                    dependentFieldValues?.SANCTION_DT?.value
                  ),
                  "dd/MMM/yyyy"
                )
              : "",
            RECOMMENED_NM: dependentFieldValues?.RECOMMENED_NM?.value ?? "",
            WORKING_DATE: authState?.workingDate ?? "",
            SCREEN_REF: formState?.docCD ?? "",
          });
          let response_messages: any[] = [];
          if (data && data?.[0]?.MSG && Array.isArray(data?.[0]?.MSG)) {
            response_messages = data?.[0]?.MSG;
          }
          if (response_messages?.length > 0) {
            const messagebox = async (msgTitle, msg, buttonNames, status) => {
              let buttonName = await formState.MessageBox({
                messageTitle: msgTitle,
                message: msg,
                buttonNames: buttonNames,
                icon:
                  status === "9"
                    ? "WARNING"
                    : status === "99"
                    ? "CONFIRM"
                    : status === "999"
                    ? "ERROR"
                    : status === "0" && "SUCCESS",
              });
              return { buttonName, status };
            };

            for (let i = 0; i < response_messages?.length; i++) {
              if (response_messages[i]?.O_STATUS !== "0") {
                let btnName = await messagebox(
                  response_messages[i]?.O_MSG_TITLE ??
                    response_messages[i]?.O_STATUS === "999"
                    ? "ValidationFailed"
                    : response_messages[i]?.O_STATUS === "99"
                    ? "Confirmation"
                    : response_messages[i]?.O_STATUS === "9"
                    ? "Alert"
                    : "",
                  response_messages[i]?.O_MESSAGE,
                  response_messages[i]?.O_STATUS === "99"
                    ? ["Yes", "No"]
                    : ["Ok"],
                  response_messages[i]?.O_STATUS
                );
                if (btnName?.status === "999" || btnName?.buttonName === "No") {
                  return {
                    SANCTIONED_AMT: { value: "" },
                  };
                }
              } else {
                const AG_CLR_RATE = data?.[0]?.AG_CLR_RATE ?? "";
                const INSURANCE_EXPIRY_PENAL_RT =
                  data?.[0]?.INSURANCE_EXPIRY_PENAL_RT ?? "";
                const INT_RATE = data?.[0]?.INT_RATE ?? "";
                const PENAL_RATE = data?.[0]?.PENAL_RATE ?? "";
                const STOCK_EXPIRY_PENAL_RT =
                  data?.[0]?.STOCK_EXPIRY_PENAL_RT ?? "";
                return {
                  AG_CLR_RATE: { value: AG_CLR_RATE },
                  INSURANCE_EXPIRY_PENAL_RT: {
                    value: INSURANCE_EXPIRY_PENAL_RT,
                  },
                  INT_RATE: { value: INT_RATE },
                  PENAL_RATE: { value: PENAL_RATE },
                  STOCK_EXPIRY_PENAL_RT: { value: STOCK_EXPIRY_PENAL_RT },
                };
              }
            }
          }
        }
        return {};
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL", //come back
      label: "Total",
      type: "text",
      FormatProps: {
        allowNegative: true,
      },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["TotalIsRequired"] }],
      },
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "DUE_AMT",
      label: "Maturity",
      type: "text",
      FormatProps: {
        allowNegative: true,
      },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["MaturityIsRequired"] }],
      },
      shouldExclude: (fieldData, dependentFieldsValues, formState) =>
        API.excludeFDDetailsOnFlag({ formState }),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
  ],
};
