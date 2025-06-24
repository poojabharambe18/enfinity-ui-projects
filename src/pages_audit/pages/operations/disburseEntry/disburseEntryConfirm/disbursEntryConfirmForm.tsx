import {
  ClearCacheProvider,
  GradientButton,
  ImageViewer,
  LoaderPaperComponent,
  MasterDetailsForm,
  PDFViewer,
  queryClient,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { Dialog } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { disbursEntryConfirmMetadata } from "./disbursEntryConfirmMetadata";
import { useLocation } from "react-router-dom";
import { getdocCD } from "components/utilFunction/function";
import * as API from "../api";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { t } from "i18next";
import { format } from "date-fns";

const DisbursEntryConfirmForm = ({ closeDialog, result }) => {
  let currentPath = useLocation().pathname;
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { state: rows }: any = useLocation();
  const rowsData = rows?.[0]?.data;
  const EnteredBy = rowsData?.ENTERED_BY;
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const [fileBlob, setFileBlob] = useState<any>(null);
  const [openPrint, setOpenPrint] = useState<any>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getDisbConfTrn"], () =>
    API.getDisbConfTrn({
      COMP_CD: rowsData?.COMP_CD ?? "",
      BRANCH_CD: rowsData?.BRANCH_CD ?? "",
      ACCT_TYPE: rowsData?.ACCT_TYPE ?? "",
      ACCT_CD: rowsData?.ACCT_CD ?? "",
      TRAN_CD: rowsData?.TRAN_CD ?? "",
    })
  );

  const viewMemoMutation = useMutation(API.viewmemo, {
    onError: async (error: any) => {
      await MessageBox({
        messageTitle: "ValidationFailed",
        message: error?.error_msg ?? "",
        icon: "ERROR",
      });
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      for (let i = 0; i < data?.[0]?.MSG?.length; i++) {
        if (data?.[0]?.MSG[i]?.O_STATUS === "999") {
          await MessageBox({
            messageTitle: data?.[0]?.MSG[i]?.O_MSG_TITLE ?? "ValidationFailed",
            message: data?.[0]?.MSG[i]?.O_MESSAGE,
            icon: "ERROR",
          });
          setOpenPrint(false);
        } else if (data?.[0]?.MSG[i]?.O_STATUS === "9") {
          await MessageBox({
            messageTitle: data?.[0]?.MSG[i]?.O_MSG_TITLE ?? "Alert",
            message: data?.[0]?.MSG[i]?.O_MESSAGE,
            icon: "WARNING",
          });
        }
      }
      let blobData = utilFunction.blobToFile(data, "");
      if (blobData) {
        setFileBlob(blobData);
        setOpenPrint(true);
      }
    },
  });

  const confirmMutation = useMutation(API.entryConfirm, {
    onSuccess: async (data) => {
      MessageBox({
        message: "Success",
        messageTitle: "Success",
        icon: "SUCCESS",
        buttonNames: ["Ok"],
      });
      closeDialog();
    },
    onError: async (error: any) => {
      await MessageBox({
        messageTitle: "ValidationFailed",
        message: error?.error_msg ?? "",
        icon: "ERROR",
      });
      CloseMessageBox();
    },
  });

  const handleConfirm = async () => {
    if (
      (EnteredBy || "").toLowerCase() ===
      (authState?.user?.id || "").toLowerCase()
    ) {
      MessageBox({
        message: "You can not Confirm your own entry.",
        messageTitle: "Warning",
        icon: "WARNING",
        buttonNames: ["Ok"],
      });
    } else {
      confirmMutation?.mutate({
        isConfirmed: true,
        COMP_CD: rowsData?.COMP_CD ?? "",
        BRANCH_CD: rowsData?.BRANCH_CD ?? "",
        ACCT_TYPE: rowsData?.ACCT_TYPE ?? "",
        ACCT_CD: rowsData?.ACCT_CD ?? "",
        TRAN_CD: rowsData?.TRAN_CD ?? "",
      });
    }
  };

  const handleReject = async () => {
    const Accept = await MessageBox({
      messageTitle: "Confirmation",
      message: "Do you want to reject this Request?",
      icon: "CONFIRM",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });
    if (Accept === "Yes") {
      confirmMutation?.mutate({
        isConfirmed: false,
        COMP_CD: rowsData?.COMP_CD ?? "",
        BRANCH_CD: rowsData?.BRANCH_CD ?? "",
        ACCT_TYPE: rowsData?.ACCT_TYPE ?? "",
        ACCT_CD: rowsData?.ACCT_CD ?? "",
        TRAN_CD: rowsData?.TRAN_CD ?? "",
      });
    }
    CloseMessageBox();
  };

  const handleMemo = async () => {
    viewMemoMutation?.mutate({
      COMP_CD: rowsData?.COMP_CD ?? "",
      BRANCH_CD: rowsData?.BRANCH_CD ?? "",
      ACCT_TYPE: rowsData?.ACCT_TYPE ?? "",
      ACCT_CD: rowsData?.ACCT_CD ?? "",
      TRAN_CD: rowsData?.TRAN_CD ?? "",
      TRAN_DT: Boolean(data?.[0]?.TRAN_DT)
        ? format(utilFunction.getParsedDate(data?.[0]?.TRAN_DT), "dd/MMM/yyyy")
        : "",
      SCREEN_REF: docCD ?? "",
    });
  };

  disbursEntryConfirmMetadata.masterForm.form.label =
    utilFunction.getDynamicLabel(currentPath, authState?.menulistdata, true);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDisbConfTrn"]);
    };
  }, []);

  return (
    <>
      <Dialog
        open={true}
        fullWidth={true}
        PaperProps={{
          style: {
            maxWidth: "1335px",
          },
        }}
      >
        <MasterDetailsForm
          key={"disbursEntryConfirm" + data}
          metaData={disbursEntryConfirmMetadata}
          initialData={{ ...rowsData, DETAILS_DATA: data }}
          onSubmitData={() => {}}
          displayMode={"view"}
          isLoading={isLoading || isFetching}
          formStyle={{ height: "auto" }}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <>
                <GradientButton onClick={handleConfirm} color="primary">
                  {t("Confirm")}
                </GradientButton>
                <GradientButton onClick={handleReject} color="primary">
                  {t("Reject")}
                </GradientButton>
                <GradientButton color="primary">
                  {t("viewSchedule")}
                </GradientButton>
                <GradientButton onClick={handleMemo} color="primary">
                  {t("ViewMemo")}
                </GradientButton>
                <GradientButton onClick={closeDialog}>
                  {" "}
                  {t("Close")}
                </GradientButton>
              </>
            );
          }}
        </MasterDetailsForm>
      </Dialog>

      {viewMemoMutation?.isLoading ? (
        <Dialog
          open={true}
          PaperProps={{
            style: {
              overflow: "auto",
              padding: "10px",
              width: "600px",
              height: "100px",
            },
          }}
          maxWidth="md"
        >
          <LoaderPaperComponent />
        </Dialog>
      ) : (
        Boolean(fileBlob && fileBlob?.type?.includes("pdf")) &&
        Boolean(openPrint) && (
          <Dialog
            open={true}
            PaperProps={{
              style: {
                width: "100%",
                overflow: "auto",
                padding: "10px",
                height: "100%",
              },
            }}
            maxWidth="xl"
          >
            <PDFViewer
              blob={fileBlob}
              fileName={`${"Disbursement Entry"}`}
              onClose={() => setOpenPrint(false)}
            />
          </Dialog>
        )
      )}
    </>
  );
};

export const DisbursEntryConfirmationFormWrapper = ({
  closeDialog,
  result,
}) => {
  return (
    <ClearCacheProvider>
      <DisbursEntryConfirmForm closeDialog={closeDialog} result={result} />
    </ClearCacheProvider>
  );
};
