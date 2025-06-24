import {
  FC,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import {
  SubmitFnType,
  GridWrapper,
  ActionTypes,
  GridMetaDataType,
  GradientButton,
  usePopupContext,
  extractMetaData,
  utilFunction,
  LoaderPaperComponent,
  queryClient,
  FormWrapper,
  MetaDataType,
  Alert,
} from "@acuteinfo/common-base";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { Dialog } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import {
  AddNewBenfiDetailGridMetadata,
  AuditBenfiDetailFormMetadata,
  IfscCodeSearchGridMetadata,
} from "./metaData";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { IfscAllListSearch } from "./ifscCodeAllListSearch";
import { useDialogContext } from "../payslip-issue-entry/DialogContext";

const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: t("Add"),
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-detail",
    actionLabel: t("ViewDetails"),
    multiple: undefined,
    rowDoubleClick: true,
  },
  {
    actionName: "Close",
    actionLabel: t("Close"),
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
export const AddNewBeneficiaryDetail: FC<{
  isOpen?: any;
  onClose?: any;
  isBenAuditTrailData?: any;
  isRefresh?: any;
}> = ({ isOpen, onClose, isBenAuditTrailData, isRefresh }) => {
  const isErrorFuncRef = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const previousRowData = useRef(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const controllerRef = useRef<AbortController>();
  const formRef = useRef<any>(null);
  const myGridRef = useRef<any>(null);
  const [isAddOpen, setisAddOpen] = useState<any>(false);
  const [formMode, setFormMode] = useState<any>("new");
  const [gridData, setGridData] = useState<any>({});
  const [retrieveData, setRetrieveData] = useState<any>({});
  const [retrieveDataRefresh, setRetrieveDataRefresh] = useState<any>(0);
  const [ifscAllList, setIfscAllList] = useState<any>(false);
  const { t } = useTranslation();
  const { trackDialogClass } = useDialogContext();
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getRtgsBenfData"], () =>
    API.getRtgsBenfData({
      COMP_CD: authState?.companyID,
      BRANCH_CD:
        isBenAuditTrailData?.BRANCH_CD ?? authState?.user?.branchCode ?? "",
      ACCT_TYPE: isBenAuditTrailData?.ACCT_TYPE ?? "",
      ACCT_CD:
        isBenAuditTrailData?.ACCT_CD.padStart(6, "0")?.padEnd(20, " ") ?? "",
      FLAG: "D",
      WORKING_DATE: authState?.workingDate,
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getRtgsBenfData", isOpen]);
    };
  }, []);
  const getIfscBenAcDetail: any = useMutation(API.getIfscBenDetail, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },

    onSuccess: (data) => {
      if (data?.[0]?.O_STATUS === "999") {
        MessageBox({
          messageTitle: "Alert",
          message: data?.[0]?.O_MESSAGE,
          icon: "WARNING",
        });
      }
    },
  });
  const getAuditDml: any = useMutation(API.getAuditDml, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      CloseMessageBox();
    },

    onSuccess: (data) => {
      isBenAuditTrailData?.SCREEN_REF === "MST/552" && isRefresh();
      trackDialogClass("auditTrailGridDlg");
      setisAddOpen(false);
      refetch();
      enqueueSnackbar(data, {
        variant: "success",
      });
      CloseMessageBox();
    },
  });

  const setCurrentAction = useCallback((data) => {
    if (data?.name === "add") {
      setisAddOpen(true);
      trackDialogClass("auditTrailFormDlg");
      setFormMode("new");
    } else if (data?.name === "view-detail") {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      let rowsData = data?.rows?.[0]?.data;
      setGridData(rowsData);
      if (
        Boolean(rowsData) &&
        JSON.stringify(rowsData) !== JSON.stringify(previousRowData?.current)
      ) {
        previousRowData.current = rowsData;
        getIfscBenAcDetail.mutate({
          IFSC_CODE: rowsData?.TO_IFSCCODE ?? "",
          ENTRY_TYPE: isBenAuditTrailData?.ENTRY_TYPE ?? "",
          USERNAME: authState?.user?.id ?? "",
          USERROLE: authState?.role ?? "",
        });
      }
      setFormMode("edit");
      setisAddOpen(true);
      trackDialogClass("auditTrailFormDlg");
    } else if (data?.name === "Close") {
      onClose();
    }
  }, []);

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // @ts-ignore
    endSubmit(true);
    if (formMode === "new") {
      delete data["ACTIVE_FLAG"];
      delete data["INACTIVE"];
    } else {
      data["ACTIVE_FLAG"] = Boolean(data["ACTIVE_FLAG"]) ? "Y" : "N";
    }
    isErrorFuncRef.current = {
      data: {
        _isNewRow: formMode === "new" ? true : false,
        COMP_CD: formMode === "new" ? authState?.companyID : gridData?.COMP_CD,
        BRANCH_CD:
          formMode === "new"
            ? isBenAuditTrailData?.BRANCH_CD
            : gridData?.BRANCH_CD,
        TRAN_CD: formMode === "new " ? "" : gridData?.TRAN_CD,
        ACCT_TYPE:
          formMode === "new"
            ? isBenAuditTrailData?.ACCT_TYPE ?? ""
            : gridData?.ACCT_TYPE,
        ACCT_CD:
          formMode === "new"
            ? isBenAuditTrailData?.ACCT_CD.padStart(6, "0")?.padEnd(20, " ") ??
              ""
            : gridData?.ACCT_CD,
        ...data,
        FLAG: Boolean(data["FLAG"]) ? "Y" : "N",
      },
      displayData,
      endSubmit,
      setFieldError,
    };
    const buttonName = await MessageBox({
      messageTitle: t("Confirmation"),
      message:
        formMode === "new"
          ? t("AreYouSaveThisRecord")
          : t("AreYouSureInactiveThisRecord"),
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
      icon: "CONFIRM",
    });
    if (buttonName === "Yes") {
      getAuditDml.mutate(isErrorFuncRef?.current?.data);
    }
  };

  AddNewBenfiDetailGridMetadata.gridConfig.gridLabel = `${t(
    "ListOfBeneficiaryAcOrdering"
  )} ${t(
    "ACNo"
  )}: ${authState?.companyID?.trim()}-${isBenAuditTrailData?.BRANCH_CD?.trim()}-${isBenAuditTrailData?.ACCT_TYPE?.trim()}-${isBenAuditTrailData?.ACCT_CD?.trim()}`;

  return (
    <>
      <Dialog
        key="AddNewBenfiDetailDialog"
        open={true}
        maxWidth="lg"
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        className="auditTrailGridDlg"
      >
        <GridWrapper
          key={`AddNewBenfiDetailGrid${isLoading} `}
          finalMetaData={AddNewBenfiDetailGridMetadata as GridMetaDataType}
          data={data ?? []}
          setData={() => null}
          actions={actions}
          setAction={setCurrentAction}
          loading={isLoading || isFetching}
          refetchData={() => refetch()}
          ref={myGridRef}
        />
      </Dialog>
      <>
        {isAddOpen ? (
          <Dialog
            open={true}
            PaperProps={{
              style: {
                width: "90%",
              },
            }}
            maxWidth="md"
            className="auditTrailFormDlg"
          >
            {getIfscBenAcDetail?.isLoading ? (
              <LoaderPaperComponent />
            ) : (
              <>
                {getAuditDml?.isError && (
                  <Alert
                    severity="error"
                    errorMsg={getAuditDml?.error?.error_msg ?? "Unknow Error"}
                    errorDetail={getAuditDml?.error?.error_detail ?? ""}
                    color="error"
                  />
                )}
                <FormWrapper
                  key={`AddNewBenfiDetailForm${getIfscBenAcDetail?.isLoading}${retrieveDataRefresh}${retrieveData}`}
                  metaData={
                    extractMetaData(
                      AuditBenfiDetailFormMetadata,
                      formMode
                    ) as MetaDataType
                  }
                  displayMode={formMode}
                  onSubmitHandler={onSubmitHandler}
                  initialValues={
                    formMode === "edit"
                      ? {
                          ...getIfscBenAcDetail?.data?.[0],
                          ...gridData,
                          INACTIVE: gridData?.ACTIVE_FLAG,
                          ACTIVE_FLAG: gridData?.ACTIVE_FLAG === "Y",
                        }
                      : {
                          TO_IFSCCODE: retrieveData?.IFSC_CODE,
                        }
                  }
                  formStyle={{
                    background: "white",
                  }}
                  formState={{
                    MessageBox: MessageBox,
                  }}
                  ref={formRef}
                  setDataOnFieldChange={(action, payload) => {
                    if (action === "F5") {
                      setIfscAllList(true);
                      setRetrieveData("");
                    }
                  }}
                >
                  {({ isSubmitting, handleSubmit }) => (
                    <>
                      {formMode === "new" ? (
                        <GradientButton
                          onClick={(event) => {
                            handleSubmit(event, "Save");
                          }}
                        >
                          {t("Save")}
                        </GradientButton>
                      ) : gridData?.ACTIVE_FLAG === "Y" ? (
                        <GradientButton
                          onClick={(event) => {
                            handleSubmit(event, "Save");
                          }}
                        >
                          {t("Save")}
                        </GradientButton>
                      ) : null}
                      <GradientButton
                        onClick={() => {
                          setisAddOpen(false);
                          trackDialogClass("auditTrailGridDlg");
                        }}
                      >
                        {t("Close")}
                      </GradientButton>
                    </>
                  )}
                </FormWrapper>
              </>
            )}
          </Dialog>
        ) : null}
        <>
          {ifscAllList ? (
            <IfscAllListSearch
              onClose={(flag, rowsData) => {
                setIfscAllList(false);
                if (flag === "action") {
                  setRetrieveData(rowsData?.[0]?.data);
                  setRetrieveDataRefresh((prev) => prev + 1);
                }
              }}
            />
          ) : null}
        </>
      </>
    </>
  );
};
