import {
  Alert,
  extractMetaData,
  FormWrapper,
  GradientButton,
  MetaDataType,
  SubmitFnType,
  usePopupContext,
} from "@acuteinfo/common-base";
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { lockerTrnsEntryFormMetadata } from "./formMetaData";
import { AuthContext } from "pages_audit/auth";
import { dataContext } from "./lockerOperationTrns";
import { useMutation } from "react-query";
import { getLockerOperationReciept, saveLockerOperationEntry } from "./api";
import { t } from "i18next";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";
import { getVoucherList } from "../payslip-issue-entry/api";
import { RecieptPrint } from "./recieptPrint";
import { getdocCD } from "components/utilFunction/function";
import { useLocation } from "react-router-dom";
import PhotoSignWithHistory from "components/common/custom/photoSignWithHistory/photoSignWithHistory";

export const LockerTrnsEntry = forwardRef((props, ref) => {
  const [formMode, setFormMode] = useState("add");
  const formRef = useRef();
  const shrtctKeysRef = useRef<any>(null);
  const isErrorFuncRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const [receiptData, setRecieptData] = useState<any>([]);
  const { saveData, payload, formData, gridData } = useContext(dataContext);
  const [receiptPrint, setReceiptPrint] = useState(false);
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [callCount, setCallCount] = useState(0);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const optionDataref = useRef<any>();
  const handleReset = () => {
    let event: any = {
      preventDefault: () => {
        setCallCount((prev) => prev + 1);
      },
    };
    //@ts-ignore
    formRef.current?.handleFormReset(event, "Reset");
    formData.current = null;
    gridData.current = null;
    saveData(null);
  };
  useImperativeHandle(ref, () => ({
    saveEntry: async () => {
      let event: any = { preventDefault: () => {} };
      //@ts-ignore
      formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
    },
  }));
  const getOptionData = () => {
    return optionDataref?.current;
  };
  const receiptMutation = useMutation(getLockerOperationReciept, {
    onError: async (error: any) => {
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      if (isErrorFuncRef.current.data.OPER_STATUS === "I") {
        setRecieptData(data);
        let buttonName = await MessageBox({
          messageTitle: "Print",
          message: t("receiptPrintCnfmMsg"),
          buttonNames: ["Yes", "No"],
          icon: "CONFIRM",
        });
        if (buttonName === "Yes") {
          setReceiptPrint(true);
        }
      }

      CloseMessageBox();
    },
  });
  const voucherMutation = useMutation(getVoucherList, {
    onError: async (error: any) => {},
    onSuccess: async (data: any) => {
      if (data[0]?.VOUCHER_MSG === "") {
        return;
      } else {
        const btnName = await MessageBox({
          message: data[0]?.VOUCHER_MSG,
          messageTitle: t("voucherConfirmationMSG"),
          icon: "INFO",
          buttonNames: ["Ok"],
        });
      }
      CloseMessageBox();
    },
  });
  const saveOperationMutation = useMutation(saveLockerOperationEntry, {
    onError: async (error: any) => {},
    onSuccess: async (data) => {
      handleReset();
      isErrorFuncRef.current?.endSubmit(false);
      setFormMode("add");

      if (data[0]?.TRAN_CD) {
        const voucherReqData: any = {
          A_ENT_COMP_CD: authState?.companyID,
          A_ENT_BRANCH_CD: authState?.user?.branchCode,
          A_TRAN_DT: format(new Date(authState?.workingDate), "dd/MMM/yyyy"),
          A_TRAN_CD: data[0]?.TRAN_CD,
          A_TRN_FLAG: "IO",
          A_SDC: "LOCO",
          A_SR_CD: "0",
        };
        voucherMutation.mutate(voucherReqData);
      }

      enqueueSnackbar("Success", {
        variant: "success",
      });
      const payloadData: any = {
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        ACCT_TYPE: payload?.ACCT_TYPE,
        ACCT_CD: payload?.ACCT_CD,
        WORKING_DT: authState?.workingDate,
      };
      receiptMutation.mutate(payloadData);
    },
  });
  const handleClick = async () => {
    //@ts-ignore
    if (ref && ref.current && ref.current.saveEntry) {
      //@ts-ignore
      await ref.current.saveEntry();
    }
  };
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);

    const reqData = {
      _isNewRow: true,
      TRAN_DT: authState?.workingDate ?? "",
      ACCT_CD: data?.MAIN_ACCT_CD ?? "",
      ACCT_TYPE: data?.MAIN_ACCT_TYPE ?? "",
      ACCT_NM: data.ACCT_NM ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      COMP_CD: authState?.companyID ?? "",
      CHEQUE_NO: data?.CHEQUE_NO ? data?.CHEQUE_NO : "",
      CHRG_AMT: data?.CHRG_AMT ? data?.CHRG_AMT : "",
      CL_TIME: data?.CL_TIME ?? "",
      ST_TIME: data?.ST_TIME ?? "",
      CUST_SIGNATURE: "",
      EMP_ID: data?.EMP_ID ?? "",
      LOCKER_NO: data?.LOCKER_NO_ ?? "",
      LOC_SIZE_CD: data?.LOC_SIZE_CD ?? "",
      OPER_STATUS: data?.OPER_STATUS ?? "",
      REMARKS: data?.REMARKS ?? "",
      SERVICE_TAX: data?.SERVICE_CHRGE_AUTO ?? "",
      TRN_ACCT_CD: data?.TRF_ACCT_CD ? data?.TRF_ACCT_CD : "",
      TRN_ACCT_TYPE: data?.TRF_ACCT_TYPE ? data?.TRF_ACCT_TYPE : "",
      TRN_BRANCH_CD: data?.TRF_BRANCH_CD ? data?.TRF_BRANCH_CD : "",
      TRN_COMP_CD: authState?.companyID ?? "",
      TYPE_CD: data?.TRX_CD ? data?.TRX_CD : "",
    };

    isErrorFuncRef.current = {
      data: reqData,
      displayData,
      endSubmit,
      setFieldError,
    };
    let buttonName = await MessageBox({
      messageTitle: "Confirmation",
      message: `${t("Proceed")}?`,
      icon: "CONFIRM",
      loadingBtnName: ["Yes"],
      buttonNames: ["Yes", "No"],
    });
    if (buttonName === "Yes") {
      saveOperationMutation.mutate(isErrorFuncRef.current.data);
    }
  };
  const errorDataa: any = [
    { error: receiptMutation?.error, isError: receiptMutation?.isError },
    {
      error: saveOperationMutation?.error,
      isError: saveOperationMutation?.isError,
    },
    { error: voucherMutation?.error, isError: voucherMutation?.isError },
  ];
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F9" && payload?.ACCT_CD) {
        e.preventDefault();
        setSignatureOpen(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSignatureOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [payload]);
  return (
    <>
      {errorDataa.map(
        ({ error, isError }, index) =>
          isError && (
            <Alert
              key={index}
              severity="error"
              errorMsg={error?.error_msg || t("Somethingwenttowrong")}
              errorDetail={error?.error_detail ?? ""}
              color="error"
            />
          )
      )}
      <FormWrapper
        key={"lockerTrnsEntryFormMetadata"}
        metaData={
          extractMetaData(lockerTrnsEntryFormMetadata, formMode) as MetaDataType
        }
        displayMode={formMode}
        onSubmitHandler={onSubmitHandler}
        hideHeader={true}
        onFormButtonClickHandel={async (id) => {
          if (id === "SIGN") {
            setSignatureOpen(true);
          }
        }}
        initialValues={{}}
        formState={{
          MessageBox: MessageBox,
          Mode: formMode,
          saveFn: handleClick,
          docCD: docCD,
          // getOptionData,
          acctDtlReqPara: {
            TRF_ACCT_CD: {
              ACCT_TYPE: "TRF_ACCT_TYPE",
              BRANCH_CD: "TRF_BRANCH_CD",
              SCREEN_REF: docCD ?? "",
            },
          },
        }}
        setDataOnFieldChange={(action, payload) => {
          if (action === "VIEWMST_PAYLOAD") {
            saveData(payload);
          }
          if (action === "SHORTCUTKEY_REQPARA") {
            shrtctKeysRef.current = payload;
          }
          if (action === "DROPDOWN_DATA") {
            optionDataref.current = payload;
          }
        }}
        formStyle={{
          background: "white",
        }}
        ref={formRef}
      />
      {receiptPrint ? (
        <>
          <RecieptPrint
            cardData={receiptData}
            close={() => {
              setReceiptPrint(false);
            }}
          />
        </>
      ) : null}

      {signatureOpen ? (
        <>
          <PhotoSignWithHistory
            data={{
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: authState?.user?.branchCode ?? "",
              ACCT_TYPE: payload?.ACCT_TYPE ?? "",
              ACCT_CD: payload?.ACCT_CD ?? "",
            }}
            screenRef={docCD}
            onClose={() => {
              setSignatureOpen(false);
            }}
          />
        </>
      ) : null}
    </>
  );
});
