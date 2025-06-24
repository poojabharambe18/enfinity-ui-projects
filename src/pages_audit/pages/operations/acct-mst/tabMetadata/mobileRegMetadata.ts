import { validateMobileNo } from "pages_audit/pages/master/usersecurity/stepper/api/api";
import * as API from "../api";

export const mobileReg_tab_metadata = {
  form: {
    name: "mobileReg_tab_form",
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
      name: "MOBILE_REG_DTL",
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
            componentType: "numberFormat",
          },
          name: "MOBILE_NO",
          label: "MobileNum",
          autoComplete: "off",
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
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFields
          ) => {
            if (formState?.isSubmitting) return {};
            if (currentField?.value) {
              let request = {
                MOBILE_NO: currentField?.value,
                SCREEN: "MST/002",
                STD_CD: "",
                FLAG: "",
              };
              let postData = await validateMobileNo({ request });
              if (postData?.[0]?.MOBILE_STATUS.length > 0) {
                let buttonName = await formState.MessageBox({
                  messageTitle: "ValidationFailed",
                  message: postData?.[0]?.MOBILE_STATUS,
                  icon: "ERROR",
                  buttonNames: ["Ok"],
                });
                if (buttonName === "Ok") {
                  return {
                    MOBILE_NO: {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                    MOBILE_REG_FLAG: {
                      value: false,
                      ignoreUpdate: false,
                    },
                  };
                }
              }
            }
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REG_NO",
          label: "RegistrationNumber",
          placeholder: "EnterRegistrationNumber",
          maxLength: 20,
          autoComplete: "off",
          preventSpecialChars: sessionStorage.getItem("specialChar") || "",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "checkbox",
          },
          defaultValue: false,
          name: "MOBILE_REG_FLAG",
          label: "Registered",
          validationRun: "onChange",
          dependentFields: ["MOBILE_NO"],
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFields
          ) => {
            if (formState?.isSubmitting) return {};
            if (
              currentField?.value &&
              !Boolean(dependentFields?.["MOBILE_REG_DTL.MOBILE_NO"]?.value)
            ) {
              let buttonName = await formState.MessageBox({
                messageTitle: "ValidationFailed",
                message: "Please enter Mobile No.",
                icon: "ERROR",
                buttonNames: ["Ok"],
              });
              if (buttonName === "Ok") {
                return {
                  MOBILE_REG_FLAG: {
                    value: false,
                    isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                };
              }
            }
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
      ],
    },
  ],
};
