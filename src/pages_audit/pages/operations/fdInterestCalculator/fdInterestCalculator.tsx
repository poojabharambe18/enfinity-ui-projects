import {
  ClearCacheProvider,
  LoaderPaperComponent,
  PDFViewer,
  SubmitFnType,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { FormWrapper, MetaDataType } from "@acuteinfo/common-base";
import { extractMetaData } from "@acuteinfo/common-base";
import { useContext, useRef, useState, useEffect } from "react";
import { metaData } from "./metaData";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useMutation } from "react-query";
import { AppBar, Dialog, Toolbar, Typography } from "@mui/material";
import { format } from "date-fns";
import { Theme } from "@mui/system";
import { makeStyles } from "@mui/styles";
import { useLocation } from "react-router-dom";
import { getdocCD } from "components/utilFunction/function";

const useTypeStyles: any = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));
const FdInterestCalculator = () => {
  let currentPath = useLocation().pathname;
  const [formMode, setFormMode] = useState("add");
  const [calcSwitch, setCalcSwitch] = useState("P");
  const { authState } = useContext(AuthContext);
  const isErrorFuncRef = useRef<any>(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const headerClasses = useTypeStyles();
  const [formKey, setFormKey] = useState(Date.now());
  const [fileBlob, setFileBlob] = useState<any>(null);
  const [openPrint, setOpenPrint] = useState<any>(null);
  const formRef = useRef<any>();
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const compareSheetReportMutation = useMutation(
    API.getCompareSheetReport,

    {
      onError: (error: any) => {},
      onSuccess: (data) => {
        console.log(data);

        let blobData = utilFunction.blobToFile(data, "");
        if (blobData) {
          setFileBlob(blobData);
          setOpenPrint(true);
        }
      },
    }
  );
  const recurringToFDReportMutation = useMutation(
    API.getRecurringFdReport,

    {
      onError: (error: any) => {},
      onSuccess: (data) => {
        console.log(data);

        let blobData = utilFunction.blobToFile(data, "");
        if (blobData) {
          setFileBlob(blobData);
          setOpenPrint(true);
        }
      },
    }
  );
  const handleButtonClick = async (id: string) => {
    let event: any = { preventDefault: () => {} };
    if (id === "NEW_DATE_BTN") {
      setCalcSwitch("D");
      // setFormKey(Date.now());
      formRef.current?.handleFormReset(event, "Reset");
    } else if (id === "NEW_PERIOD_BTN") {
      setCalcSwitch("P");
      formRef.current?.handleFormReset(event, "Reset");
      // setFormKey(Date.now());
    } else if (id === "CAL_COMPARE_SHEET_BTN" || id === "CAL_FD_REPORT__BTN") {
      let event: any = { preventDefault: () => {} };
      formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
    }
  };
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);

    if (data?.CALCSWITCH === "S") {
      isErrorFuncRef.current = {
        data: {
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          HANDBOOK_FLG: "Y",
          FR_DT: format(new Date(data?.TRAN_DT_S), "dd/MMM/yyyy"),
          PERIOD_CD:
            data?.PERIOD_NO_DISP_S === "D"
              ? "Day(s)"
              : data?.PERIOD_NO_DISP_S === "M"
              ? "Month(s)"
              : data?.PERIOD_NO_DISP_S === "Y"
              ? "Year(s)"
              : null,
          PERIOD_NO: data?.PERIOD_NO_S,
          AMOUNT: data?.PRINCIPAL_AMT_S,
          TO_DT: format(new Date(data?.MATURITY_DT_S), "dd/MMM/yyyy"),
          TRAN_CD: data?.RATE_DEFINATION_S,
          GD_TODAY: authState?.workingDate,
          SPL_AMT_FLG: "Y",
          SCREEN_REF: docCD,
        },
        displayData,
        endSubmit,
        setFieldError,
      };
      compareSheetReportMutation.mutate({
        ...isErrorFuncRef.current?.data,
      });
    } else {
      isErrorFuncRef.current = {
        data: {
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          ASON_DT: format(new Date(data?.TRAN_DT_F), "dd/MMM/yyyy"),
          TRAN_CD: data?.RATE_DEFINATION_F,
          CATEG_CD: data?.CATEG_CD_F,
          PROPOSED: data?.REMARK_F,
          SCREEN_REF: docCD,
        },
        displayData,
        endSubmit,
        setFieldError,
      };
      recurringToFDReportMutation.mutate({
        ...isErrorFuncRef.current?.data,
      });
    }
  };

  return (
    <>
      <AppBar position="relative" color="secondary">
        <Toolbar className={headerClasses.root} variant="dense">
          <Typography
            className={headerClasses.title}
            color="inherit"
            variant="h6"
            component="div"
          >
            {utilFunction.getDynamicLabel(
              currentPath,
              authState?.menulistdata,
              true
            )}
          </Typography>
        </Toolbar>
      </AppBar>
      <FormWrapper
        key={formKey}
        ref={formRef}
        metaData={extractMetaData(metaData, formMode) as MetaDataType}
        displayMode={formMode}
        onSubmitHandler={onSubmitHandler}
        initialValues={{
          COMP_CD: authState.companyID,
          BRANCH_CD: authState.user.branchCode,
          CALCSWITCH: calcSwitch,
        }}
        onFormButtonClickHandel={handleButtonClick}
        formState={{
          MessageBox: MessageBox,
          docCD: docCD,
        }}
        hideHeader={true}
        formStyle={{
          background: "white",
        }}
      ></FormWrapper>
      {compareSheetReportMutation?.isLoading ||
      recurringToFDReportMutation?.isLoading ? (
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
              fileName={`${"Fd Interest Calculator"}`}
              onClose={() => setOpenPrint(false)}
            />
          </Dialog>
        )
      )}
    </>
  );
};

export const FdInterestCalculatorMain = () => {
  return (
    <ClearCacheProvider>
      <FdInterestCalculator />
    </ClearCacheProvider>
  );
};
