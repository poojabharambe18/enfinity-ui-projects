import React, { useContext, useRef } from "react";
import { CkycContext } from "../../CkycContext";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "../../api";
import { enqueueSnackbar } from "notistack";

import { RemarksAPIWrapper } from "@acuteinfo/common-base";
import { t } from "i18next";

export const ActionDialog = ({
  open,
  setOpen,
  closeForm,
  action,
  REQUEST_CD,
  // isLoading, setIsLoading, data, mt
}) => {
  const { authState } = useContext(AuthContext);
  const { state, handleUpdatectx, handleFormModalClosectx } =
    useContext(CkycContext);
  const confirmFormRef = useRef<any>("");
  let initialVal = {};
  const confirmed =
    action === "confirm"
      ? "Y"
      : action === "query"
      ? "M"
      : action === "reject" && "R";
  const successMsg =
    action === "confirm"
      ? `${t("RequestID")} ${REQUEST_CD} ${t("ConfirmedSuccessfully")}.`
      : action === "query"
      ? `${t("RequestID")} ${REQUEST_CD} ${t(
          "SentForModificactionSuccessfully"
        )}.`
      : action === "reject" &&
        `${t("RequestID")} ${REQUEST_CD} ${t("RejectedSuccessfully")}.`;
  const mutation: any = useMutation(API.ConfirmPendingCustomers, {
    onSuccess: (data) => {
      // console.log("data o n save", data)
      handleFormModalClosectx();
      closeForm();
      enqueueSnackbar(successMsg, { variant: "success" });
    },
    onError: (error: any) => {
      // console.log("data o n error", error)
      // setIsUpdated(true)
    },
  });

  const onAction = (e) => {
    confirmFormRef.current.handleSubmit(e, "save");
  };

  const onSubmitFormHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag,
    hasError
  ) => {
    if (data && !hasError) {
      mutation.mutate({
        REQUEST_CD: state?.req_cd_ctx ?? "",
        REMARKS: data.REMARKS ?? "",
        CONFIRMED: confirmed,
      });
    }
  };

  return (
    <RemarksAPIWrapper
      TitleText={"Confirmation"}
      onActionNo={() => setOpen(false)}
      onActionYes={(val, rows) => {
        // console.log(val, "weiuifuhiwuefefgwef", rows)
        mutation.mutate({
          REQUEST_CD: REQUEST_CD ?? "",
          REMARKS: val ?? "",
          CONFIRMED: confirmed,
        });
      }}
      isLoading={mutation.isLoading || mutation.isFetching}
      isEntertoSubmit={true}
      AcceptbuttonLabelText="Ok"
      CanceltbuttonLabelText="Cancel"
      open={open}
      rows={{}}
      isRequired={confirmed === "Y" ? false : true}
      defaultValue={""}
    />
  );
};
