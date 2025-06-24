import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect, useState } from "react";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { ViewEodReport } from "./viewEodReport";
import {
  Alert,
  GridWrapper,
  usePopupContext,
  ActionTypes,
  queryClient,
  GridMetaDataType,
} from "@acuteinfo/common-base";
import {
  pendingTrnsEodReportMetaData,
  pendingTrnsMetadata,
} from "./gridMetadata";
import { LoaderPaperComponent } from "@acuteinfo/common-base";
import { Dialog } from "@mui/material";

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: true,
  },
];

export const PendinGTrns = ({ open, close }) => {
  const { authState } = useContext(AuthContext);
  const [openReport, setOpenReport] = useState(false);
  const [rowData, setRowData] = useState<any>([]);
  const [docData, setDocData] = useState<any>({});
  const [openedWindow, setOpenedWindow] = useState<Window | null>(null);
  const [currentData, setCurrentData] = useState<any>({});
  const { MessageBox } = usePopupContext();
  const [uniqueReportData, setUniqueReportData] = useState([]);

  const navigate = useNavigate();

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "close") {
        close();
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate, close]
  );

  const { data, isLoading, isFetching, isError, error } = useQuery<any, any>(
    ["getPendingTrns"],
    () =>
      API.getPendingTrns({
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        BASE_BRANCH: authState?.user?.baseBranchCode,
        TRAN_DT: authState?.workingDate,
      })
  );

  const docurlMutation = useMutation(API.getDocUrl, {
    onError: async (error: any) => {
      await MessageBox({
        message: error?.error_msg,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: async (data) => {
      setDocData(data);
      const url = `/EnfinityCore/${data[0]?.DOCUMENT_URL}`;
      const newWindow = window.open(url, "_blank");
      if (newWindow) {
        setOpenedWindow(newWindow);
        newWindow.focus();
        queryClient.removeQueries(["getDocUrl"]);
      }
    },
  });

  const reportMutation = useMutation(API.getpendingtrnReport, {
    onError: async (error: any) => {
      await MessageBox({
        message: error?.error_msg,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: (data: any) => {
      setRowData(data);
    },
  });
  useEffect(() => {
    if (Array.isArray(data)) {
      const updatedReportData: any = data.map((item, index) => ({
        ...item,
        INDEX: `${index}`,
      }));
      setUniqueReportData(updatedReportData);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["pendingtrns"]);
    };
  }, []);
  pendingTrnsMetadata.gridConfig.gridLabel = "";

  return (
    <>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went wrong"}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={"pendingtrns"}
        finalMetaData={pendingTrnsMetadata as GridMetaDataType}
        data={uniqueReportData ?? []}
        setData={() => null}
        actions={actions}
        onClickActionEvent={(index, id, currentData) => {
          if (id === "REPORT") {
            setCurrentData(currentData);
            reportMutation.mutate({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
              TRAN_DT: authState?.workingDate,
              VERSION: currentData?.VERSION,
              DOCU_CD: currentData?.DOCU_CD,
            });
            setOpenReport(true);
          }
          if (id === "OPEN") {
            docurlMutation.mutate({
              BASE_COMP: authState?.baseCompanyID,
              BASE_BRANCH: authState?.user?.baseBranchCode,
              DOC_CD: currentData?.DOCU_CD,
            });
          }
        }}
        loading={isLoading || isFetching}
        enableExport={true}
        setAction={setCurrentAction}
      />
      {openReport && (
        <ViewEodReport
          open={openReport}
          close={() => setOpenReport(false)}
          metaData={pendingTrnsEodReportMetaData}
          reportData={rowData}
          reportLabel={`Pending Transaction for: ${authState?.workingDate} , Version :${currentData?.VERSION} ${currentData?.SCREEN_NM} `}
          loading={reportMutation.isLoading}
        />
      )}
      {docurlMutation.isLoading ? (
        <Dialog
          open={open}
          PaperProps={{
            style: {
              width: "60%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
        >
          <LoaderPaperComponent />
        </Dialog>
      ) : (
        ""
      )}
    </>
  );
};
