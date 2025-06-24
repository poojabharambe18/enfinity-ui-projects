import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Alert,
  GridWrapper,
  usePopupContext,
  ActionTypes,
  queryClient,
  GridMetaDataType,
} from "@acuteinfo/common-base";
import { LoaderPaperComponent } from "@acuteinfo/common-base";
import { Dialog } from "@mui/material";
import { ViewEodReport } from "../dayEndProcess/viewEodReport";
import {
  getDocUrl,
  getpendingtrnReport,
  getPendingTrns,
} from "../dayEndProcess/api";
import {
  pendingTrnsEodReportMetaData,
  pendingTrnsMetadata,
} from "../dayEndProcess/gridMetadata";
import { format } from "date-fns";

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: true,
  },
];
export const PendinGTransactionsGridWrapper = () => {
  const { authState } = useContext(AuthContext);
  const [openReport, setOpenReport] = useState(false);
  const [rowData, setRowData] = useState<any>([]);
  const [docData, setDocData] = useState<any>({});
  const [openedWindow, setOpenedWindow] = useState<Window | null>(null);
  const [currentData, setCurrentData] = useState<any>({});
  const { MessageBox } = usePopupContext();
  const [uniqueReportData, setUniqueReportData] = useState([]);
  const { state: rows }: any = useLocation();

  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "close") {
        //@ts-ignore
        navigate("../dayend-process");
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getPendingTrns"], () =>
    getPendingTrns({
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
      BASE_BRANCH: authState?.user?.baseBranchCode,
      TRAN_DT: authState?.workingDate,
    })
  );

  const docurlMutation = useMutation(getDocUrl, {
    onError: async (error: any) => {
      await MessageBox({
        message: error?.error_msg,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: async (data: any) => {
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

  const reportMutation = useMutation(getpendingtrnReport, {
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
        actions={rows?.BACK_FROM === "DAY_END" ? actions : []}
        onClickActionEvent={(index, id, currentData) => {
          if (id === "REPORT") {
            setCurrentData(currentData);
            const payload: any = {
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
              TRAN_DT: authState?.workingDate,
              VERSION: currentData?.VERSION,
              DOCU_CD: currentData?.DOCU_CD,
            };
            reportMutation.mutate({
              ...payload,
            });
            setOpenReport(true);
          }
          if (id === "OPEN") {
            const payload: any = {
              BASE_COMP: authState?.baseCompanyID,
              BASE_BRANCH: authState?.user?.baseBranchCode,
              DOC_CD: currentData?.DOCU_CD,
            };
            docurlMutation.mutate({
              ...payload,
            });
          }
        }}
        loading={isLoading || isFetching}
        enableExport={true}
        setAction={setCurrentAction}
        refetchData={refetch}
      />
      {openReport && (
        <ViewEodReport
          open={openReport}
          close={() => setOpenReport(false)}
          metaData={pendingTrnsEodReportMetaData}
          reportData={rowData}
          reportLabel={`Pending Transaction for: ${format(
            new Date(authState?.workingDate),
            "dd/MM/yyyy"
          )} , Version :${currentData?.VERSION} ${currentData?.SCREEN_NM} `}
          loading={reportMutation.isLoading}
        />
      )}
      {docurlMutation.isLoading ? (
        <Dialog
          open={true}
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
