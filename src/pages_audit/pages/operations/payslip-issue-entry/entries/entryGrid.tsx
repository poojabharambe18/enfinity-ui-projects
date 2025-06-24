import { FC, useRef, useCallback, useContext, Fragment } from "react";
import { useMutation } from "react-query";
import * as API from "./api";
import { RetrieveFormConfigMetaData, RetrieveGridMetaData } from "./metaData";
import { Dialog, Toolbar, Typography } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import {
  ActionTypes,
  Alert,
  GridWrapper,
  GradientButton,
  SubmitFnType,
  FormWrapper,
  MetaDataType,
  ClearCacheProvider,
  usePopupContext,
} from "@acuteinfo/common-base";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import i18n from "components/multiLanguage/languagesConfiguration";
import { PaySlipIssueEntry } from "../paySlipIssueEntryGrid";
import { EntryForm } from "./entryForm";
import { Payslipissueconfirmation } from "../../payslipissueconfirmation/payslipissueconfirmationGrid";
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: t("ViewDetails"),
    multiple: false,
    rowDoubleClick: true,
  },
];
export const RetriveGridForm: FC<{
  screenFlag: string;
  headerLabel: string;
  opem: boolean;
  apiReqFlag: string;
  close(): void;
  trans_type: string;
}> = ({ screenFlag, opem, close, headerLabel, apiReqFlag, trans_type }) => {
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const isErrorFuncRef = useRef<any>(null);
  const indexRef = useRef(0);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const setCurrentAction = useCallback((data) => {
    if (data?.name === "view-detail") {
      indexRef.current = Number(data?.rows?.[0].id);
      navigate("view-detail", {
        state: {
          gridData: data?.rows?.[0]?.data,
          index: indexRef.current,
          formMode: "view",
        },
      });
    }
  }, []);
  const mutation: any = useMutation(API.retRiveGridData, {
    onSuccess: (data) => {
      isErrorFuncRef.current.endSubmit(true);
    },
    onError: async (error: any) => {
      await MessageBox({
        message: error?.error_msg,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
    },
  });

  const handlePrev = useCallback(() => {
    if (indexRef.current > 1) {
      indexRef.current -= 1;
      const index = indexRef.current;
      setTimeout(() => {
        setCurrentAction({
          name: "view-detail",
          rows: [{ data: mutation?.data[index - 1], id: String(index) }],
        });
      }, 0);
      navigate(".");
    }
  }, [mutation?.data, indexRef.current]);
  const handleNext = useCallback(() => {
    const index = indexRef.current++;
    setTimeout(() => {
      setCurrentAction({
        name: "view-detail",
        rows: [{ data: mutation?.data[index], id: String(index + 1) }],
      });
    }, 0);
  }, [mutation?.data, indexRef.current]);
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    delete data["RETRIEVE"];
    isErrorFuncRef.current = {
      data: {
        ...data,
        A_COMP_CD: authState.companyID,
        A_ENT_BRANCH_CD: authState?.user?.branchCode,
        A_BRANCH_CD: data?.BRANCH_CD,
        A_PAYSLIP_NO: data?.PAYSLIP_NO,
        A_DEF_TRAN_CD: data?.DEF_TRAN_CD,
        A_ENTRY_MODE:
          screenFlag === "REALIZEENTRY"
            ? data?.REALIZE
            : screenFlag === "CANCELENTRY"
            ? data?.CANCEL
            : screenFlag === "STOPPAYMENT"
            ? data?.STOPPAYMENT
            : screenFlag === "CANCELCONFIRM"
            ? data?.CANCELCONFRM
            : screenFlag === "REALIZECONFIRM"
            ? data?.REALIZECONF
            : "",
        ALL_BRANCH: "N",
        A_TRAN_TYPE: trans_type,
        A_GD_DATE: authState?.workingDate,
        A_USER: authState?.user?.id,
        A_USER_LEVEL: authState?.role,
        A_SCREEN_REF: apiReqFlag,
        A_LANG: i18n.resolvedLanguage,
      },
      displayData,
      endSubmit,
      setFieldError,
    };

    data = {};
    mutation.mutate({ ...isErrorFuncRef.current?.data });

    // endSubmit(true);
  };

  RetrieveFormConfigMetaData.form.label = headerLabel;
  RetrieveGridMetaData.gridConfig.gridLabel = t("enterRetrivalPara");
  const handleDialogClose = () => {
    navigate(".");
    let event: any = { preventDefault: () => {} };
    formRef?.current?.handleSubmit(event, "RETRIEVE");
  };

  return (
    <>
      <>
        {apiReqFlag === "RPT/15" ? (
          <Dialog
            open={opem}
            PaperProps={{
              style: {
                overflow: "hidden",
                height: "100vh",
              },
            }}
            fullScreen
            maxWidth="xl"
          >
            {
              <Payslipissueconfirmation
                onClose={() => {
                  close();
                }}
              />
            }
          </Dialog>
        ) : apiReqFlag === "RPT/14" ? (
          <Dialog
            open={opem}
            PaperProps={{
              style: {
                overflow: "hidden",
                height: "100vh",
              },
            }}
            fullScreen
            maxWidth="xl"
          >
            {
              <PaySlipIssueEntry
                onClose={() => {
                  close();
                }}
              />
            }
          </Dialog>
        ) : (
          <Dialog
            open={opem}
            PaperProps={{
              style: {
                overflow: "hidden",
                height: "100vh",
              },
            }}
            fullScreen
            maxWidth="xl"
          >
            <FormWrapper
              key={`retrieveForm`}
              metaData={RetrieveFormConfigMetaData as unknown as MetaDataType}
              initialValues={{
                SCREEN_REF: screenFlag ?? "",
              }}
              onSubmitHandler={onSubmitHandler}
              formStyle={{
                background: "white",
              }}
              onFormButtonClickHandel={(id) => {
                let event: any = { preventDefault: () => {} };
                if (id === "RETRIEVE") {
                  formRef?.current?.handleSubmit(event, "RETRIEVE");
                } else if (id === "VIEW_ALL") {
                  formRef?.current?.handleSubmit(event, "VIEW_ALL");
                }
              }}
              ref={formRef}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <GradientButton
                    onClick={() => {
                      close();
                    }}
                  >
                    {t("Close")}
                  </GradientButton>
                </>
              )}
            </FormWrapper>
            <Fragment>
              {mutation.isError && (
                <Alert
                  severity="error"
                  errorMsg={
                    mutation.error?.error_msg ?? "Something went to wrong.."
                  }
                  errorDetail={mutation.error?.error_detail}
                  color="error"
                />
              )}
              <GridWrapper
                key={"RetrieveGridMetaData"}
                finalMetaData={RetrieveGridMetaData}
                data={mutation?.data ?? []}
                hideHeader={false}
                setData={() => null}
                loading={mutation.isLoading || mutation.isFetching}
                actions={actions}
                setAction={setCurrentAction}
              />
            </Fragment>
            <Routes>
              <Route
                path="view-detail/*"
                element={
                  <EntryForm
                    onClose={handleDialogClose}
                    currentIndexRef={indexRef}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    headerLabel={headerLabel}
                    screenFlag={screenFlag}
                    trans_type={trans_type}
                    apiReqFlag={apiReqFlag}
                    totalData={mutation?.data?.length ?? 0}
                    defaultView={"view"}
                  />
                }
              />
            </Routes>
          </Dialog>
        )}
      </>
    </>
  );
};

export const RetrieveEntryGrid = ({
  screenFlag,
  open,
  close,
  headerLabel,
  apiReqFlag,
  trans_type,
}) => {
  return (
    <ClearCacheProvider>
      <RetriveGridForm
        opem={open}
        close={close}
        screenFlag={screenFlag}
        headerLabel={headerLabel}
        apiReqFlag={apiReqFlag}
        trans_type={trans_type}
      />
    </ClearCacheProvider>
  );
};
