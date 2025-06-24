import {
  Fragment,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  FixDepositParaFormMetadata,
  FixDepositAccountsFormMetadata,
} from "./metaData/fdParaMetaData";
import { FixDepositContext } from "./fixDepositContext";
import {
  usePopupContext,
  InitialValuesType,
  SubmitFnType,
  FormWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";
export const DetailForm = forwardRef<any, any>(
  ({ onSubmitHandler, setDataOnFieldChange, submitEventRef }, ref) => {
    const {
      fdState,
      updateFDParaFormData,
      updateFDParaDataOnChange,
      setIsOpendfdAcctForm,
      updateFDAccountsFormData,
      openFDScheme,
    } = useContext(FixDepositContext);

    const { MessageBox } = usePopupContext();

    const fdAccountRef: any = useRef(null);

    const onParaSubmitHandler: SubmitFnType = (
      data: any,
      displayData,
      endSubmit,
      setFieldError,
      actionFlag
    ) => {
      endSubmit(true);
      updateFDParaFormData(data);
      if (data?.FD_TYPE === "E") {
        fdAccountRef.current?.handleSubmit(submitEventRef?.current);
      } else {
        onSubmitHandler(
          data,
          displayData,
          endSubmit,
          setFieldError,
          actionFlag
        );
      }
    };
    return (
      <Fragment>
        <FormWrapper
          key={"FixDepositParaForm"}
          // metaData={MobileAppReviewMetaData}
          metaData={FixDepositParaFormMetadata as MetaDataType}
          initialValues={fdState?.fdParaFormData as InitialValuesType}
          onSubmitHandler={onParaSubmitHandler}
          hideHeader={true}
          formStyle={{
            background: "white",
            // height: "56vh",
            // overflowY: "auto",
            // overflowX: "hidden",
            padding: "5px",
            border: "1px solid var(--theme-color4)",
            borderRadius: "10px",
            boxShadow:
              "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
          }}
          ref={ref}
          setDataOnFieldChange={(action, payload) => {
            if (action === "CUSTOMER_ID_FEFORE") {
              setIsOpendfdAcctForm(false);
              updateFDAccountsFormData([]);
            } else if (action === "CUSTOMER_ID") {
              if (
                Boolean(payload?.value) &&
                Array.isArray(payload?.FD_ACCTS) &&
                payload?.FD_ACCTS?.length > 0
              ) {
                updateFDParaDataOnChange({ [action]: payload?.value ?? "" });
                setIsOpendfdAcctForm(true);
                updateFDAccountsFormData({ FDACCTS: payload?.FD_ACCTS });
              } else {
                setIsOpendfdAcctForm(false);
                updateFDAccountsFormData([]);
                setDataOnFieldChange(action, payload);
              }
            } else {
              setIsOpendfdAcctForm(false);
              updateFDAccountsFormData([]);
              setDataOnFieldChange(action, payload);
            }
          }}
          formState={{ isBackButton: fdState?.isBackButton }}
        />
        {fdState?.isOpendfdAcctForm &&
          fdState?.fdParaFormData?.FD_TYPE === "E" && (
            <FormWrapper
              key={
                "FDAccounts" +
                fdState?.isOpendfdAcctForm +
                fdState?.fdAcctFormData?.FDACCTS?.length
              }
              // metaData={MobileAppReviewMetaData}
              metaData={FixDepositAccountsFormMetadata as MetaDataType}
              initialValues={fdState?.fdAcctFormData as InitialValuesType}
              onSubmitHandler={onSubmitHandler}
              hideHeader={true}
              formStyle={{
                background: "white",
                // height: "56vh",
                // overflowY: "auto",
                // overflowX: "hidden",
                padding: "10px",
                border: "1px solid var(--theme-color4)",
                borderRadius: "10px",
                boxShadow:
                  "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
              }}
              ref={fdAccountRef}
              formState={{ MessageBox: MessageBox, openFDScheme: openFDScheme }}
            />
          )}
      </Fragment>
    );
  }
);
