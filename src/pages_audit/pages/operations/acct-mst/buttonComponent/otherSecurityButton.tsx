import { useContext } from "react";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
import {
  usePopupContext,
  GradientButton,
  FormWrapper,
  MetaDataType,
  SubmitFnType,
  LoaderPaperComponent,
  extractMetaData,
} from "@acuteinfo/common-base";
import { CircularProgress, Dialog } from "@mui/material";
import {
  securityBtnBFDMetadata,
  securityBtnLICMetadata,
  securityBtnOTHMetadata,
  securityBtnSHMetadata,
  securityBtnSTKMetadata,
  securityBtnVEHMetadata,
} from "../buttonMetadata/securityBtnMetadata";
import { useMutation } from "react-query";
import * as API from "../api";
import { enqueueSnackbar } from "notistack";
import { AcctMSTContext } from "../AcctMSTContext";

export const OtherSecurityButton = ({
  closeDialog,
  buttonName,
  optionData,
  isLoading,
  otherSecurityData,
  isData,
}: any) => {
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  const { authState } = useContext(AuthContext);
  const { AcctMSTState } = useContext(AcctMSTContext);

  const otherSecurityDML = useMutation(API.otherSecurityDTL, {
    onError: (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
    onSuccess: (data) => {
      console.log("data", data);
      let Success = t("insertSuccessfully");
      enqueueSnackbar(Success, {
        variant: "success",
      });
      CloseMessageBox();
    },
  });

  let metaData: any;
  let initialValue;

  switch (optionData) {
    case "OTH":
    case "GOV":
      metaData = securityBtnOTHMetadata as MetaDataType;
      initialValue = {
        SECURITY_OTH:
          otherSecurityData?.length > 0
            ? [...otherSecurityData]
            : [
                {
                  SR_CD: "",
                  MARGIN: isData?.securityCode?.optionData?.[0]?.LIMIT_MARGIN,
                },
              ],
      };
      break;
    case "BFD":
    case "BRD":
      metaData = securityBtnBFDMetadata as MetaDataType;
      initialValue = {
        SECURITY_BFD:
          otherSecurityData?.length > 0
            ? [...otherSecurityData]
            : [
                {
                  SR_CD: "",
                  MARGIN: isData?.securityCode?.optionData?.[0]?.LIMIT_MARGIN,
                },
              ],
      };
      break;
    case "VEH":
      metaData = securityBtnVEHMetadata as MetaDataType;
      initialValue = {
        SECURITY_VEH:
          otherSecurityData?.length > 0
            ? [...otherSecurityData]
            : [
                {
                  SR_CD: "",
                  MARGIN: isData?.securityCode?.optionData?.[0]?.LIMIT_MARGIN,
                },
              ],
      };
      break;
    case "STK":
    case "BDC":
      metaData = securityBtnSTKMetadata as MetaDataType;
      initialValue = {
        SECURITY_STK:
          otherSecurityData?.length > 0
            ? [...otherSecurityData]
            : [
                {
                  SR_CD: "",
                  MARGIN: isData?.securityCode?.optionData?.[0]?.LIMIT_MARGIN,
                },
              ],
      };
      break;
    case "SH":
      metaData = securityBtnSHMetadata as MetaDataType;
      initialValue = {
        SECURITY_SH:
          otherSecurityData?.length > 0
            ? [...otherSecurityData]
            : [
                {
                  SR_CD: "",
                  MARGIN: isData?.securityCode?.optionData?.[0]?.LIMIT_MARGIN,
                },
              ],
      };
      break;
    case "LIC":
      metaData = securityBtnLICMetadata as MetaDataType;
      initialValue = {
        SECURITY_LIC:
          otherSecurityData?.length > 0
            ? [...otherSecurityData]
            : [
                {
                  SR_CD: "",
                  MARGIN: isData?.securityCode?.optionData?.[0]?.LIMIT_MARGIN,
                },
              ],
      };
      break;
    default:
      break;
  }

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    action
  ) => {
    endSubmit(true);
  };

  if (metaData?.form) {
    const securityLabel = isData?.securityCode?.optionData?.[0]?.label ?? "";
    const sanctionedLimit =
      AcctMSTState?.retrieveFormDataApiRes?.MAIN_DETAIL?.SANCTIONED_AMT ?? "";
    metaData.form.label = `${t("PrimeSecurityDetail")}: ${securityLabel} ${t(
      "SanctionedLimit"
    )}: ${sanctionedLimit}`;
  } else {
    metaData.form.label = "PrimeSecurityDetail";
  }

  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "70%",
          overflow: "auto",
        },
      }}
      maxWidth="md"
    >
      {isLoading ? (
        <LoaderPaperComponent />
      ) : (
        <FormWrapper
          key={"MachineryDetailsMetadata"}
          metaData={
            extractMetaData(metaData, AcctMSTState?.formmodectx) as MetaDataType
          }
          onSubmitHandler={onSubmitHandler}
          initialValues={{ ...initialValue }}
          formStyle={{
            background: "white",
          }}
          formState={{
            MessageBox: MessageBox,
            isData: isData,
            authState: authState,
            formMode: AcctMSTState?.formmodectx,
          }}
          displayMode={AcctMSTState?.formmodectx}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <GradientButton
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                disabled={isSubmitting}
                endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color={"primary"}
              >
                {t("Save")}
              </GradientButton>
              <GradientButton onClick={closeDialog} color={"primary"}>
                {t("Back")}
              </GradientButton>
            </>
          )}
        </FormWrapper>
      )}
    </Dialog>
  );
};
