import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import { searchButttonGridMetaData } from "./metaData/gridMetaData";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { Dialog, Paper, Typography } from "@mui/material";
import SiExecuteDetailView from "./siExecuteDetailView";
import {
  ActionTypes,
  GridWrapper,
  queryClient,
  GridMetaDataType,
  LoaderPaperComponent,
  ClearCacheProvider,
  RemarksAPIWrapper,
  usePopupContext,
} from "@acuteinfo/common-base";
import { t } from "i18next";
import { enqueueSnackbar } from "notistack";
const actions: ActionTypes[] = [
  {
    actionName: "view-all",
    actionLabel: "View All",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: "ViewDetails",
    multiple: false,
    rowDoubleClick: true,
  },
];

const SearchGrid = ({ open, onClose, mainRefetch }) => {
  const authController = useContext(AuthContext);
  const [actionMenu, setActionMenu] = useState(actions);
  const [activeSiFlag, setActiveSiFlag] = useState("Y");
  const [deleteopen, setDeleteOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState<any>({});
  const [opens, setOpens] = useState(false);
  const [uniqueData, setUniqueData] = useState({});
  const isDeleteDataRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const Line_id = currentRowData?.data?.LINE_ID;
  const sr_Cd = currentRowData?.data?.SR_CD;
  const tran_cd = currentRowData?.data?.TRAN_CD;
  const setCurrentAction = useCallback(
    async (data) => {
      isDeleteDataRef.current = data?.rows?.[0];
      const { name, rows } = data;
      if (data?.name === "Delete") {
      } else if (data?.name === "view-all" || data?.name === "view-active") {
        setActiveSiFlag((prevActiveSiFlag) => {
          const newActiveSiFlag = prevActiveSiFlag === "Y" ? "N" : "Y";
          setActionMenu((prevActions) => {
            const newActions = [...prevActions];
            newActions[0].actionLabel =
              newActiveSiFlag === "Y" ? "View All" : "View Active";
            newActions[0].actionName =
              newActiveSiFlag === "Y" ? "view-all" : "view-active";

            return newActions;
          });
          return newActiveSiFlag;
        });
      } else if (data?.name === "view-details") {
        setOpens(true);
        setCurrentRowData(rows[0]);
      }
      if (data?.name === "close") {
        onClose();
      }
    },
    [setActiveSiFlag, setActionMenu]
  );

  const {
    data: apidata,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: sirefetch,
  } = useQuery(["getSearchActiveSi", activeSiFlag], () => {
    return API.getSearchActiveSi({
      companyID: authController?.authState?.companyID,
      branchCode: authController?.authState?.user?.branchCode,
      activeSiFlag: activeSiFlag,
    });
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getSearchActiveSi"]);
    };
  }, []);

  // useEffect(() => {
  //   if (apidata) {
  //     const updatedGridData = apidata.map((item, index) => ({
  //       ...item,
  //       INDEX: `${index}`,
  //     }));
  //     setUniqueData(updatedGridData);
  //   }
  // }, [apidata]);

  const deleteMutation: any = useMutation(API.addStandingInstructionTemplate, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
      setDeleteOpen(false);
    },
    onSuccess: (data) => {
      enqueueSnackbar(t("deleteSuccessfully"), {
        variant: "success",
      });
      CloseMessageBox();
      sirefetch();
      setDeleteOpen(false);
    },
  });

  return (
    <ClearCacheProvider>
      <Fragment>
        <Dialog
          open={open}
          PaperProps={{ style: { width: "100%", overflow: "auto" } }}
          maxWidth="lg"
        >
          {apidata ? (
            <>
              <GridWrapper
                key={"searchButttonGridMetaData"}
                finalMetaData={searchButttonGridMetaData as GridMetaDataType}
                loading={isLoading || isFetching}
                data={apidata ?? []}
                setData={() => null}
                actions={actions}
                setAction={setCurrentAction}
                refetchData={() => sirefetch()}
                onClickActionEvent={(index, id, currentData) => {
                  if (id === "delete") {
                    setDeleteOpen(true);
                    setCurrentRowData(currentData);
                  }
                }}
              />
              <Paper
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  padding: "7px",
                  boxShadow: "none",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "15px",
                    marginLeft: "20px",
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  {`Total No of Rows: ${apidata ? apidata[0]?.ROWS : "0"} `}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    marginLeft: "20px",
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  {`Total No of Active Si: ${
                    apidata ? apidata[0]?.ACTIVE_SI : "0"
                  } `}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    marginLeft: "20px",
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  {`Total No of In-Active Si: ${
                    apidata ? apidata[0]?.IN_ACTIVE_SI : "0"
                  }`}
                </Typography>
              </Paper>
              <Typography
                sx={{
                  fontSize: "15px",
                  marginLeft: "20px",
                  fontWeight: "bold",
                  display: "inline-block",
                  color: "red",
                }}
              >
                {"Note :"}
                {t("ColorandSi")}
              </Typography>
            </>
          ) : (
            <LoaderPaperComponent />
          )}
        </Dialog>

        {deleteopen && (
          <RemarksAPIWrapper
            TitleText={t("EnterRemovalRemarksForSI")}
            onActionNo={() => setDeleteOpen(false)}
            customRequiredMessage="RemovalRemarkRequire"
            onActionYes={async (val, rows) => {
              const buttonName = await MessageBox({
                messageTitle: t("Confirmation"),
                message: t("DoYouWantDeleteRow"),
                buttonNames: ["Yes", "No"],
                icon: "CONFIRM",
                defFocusBtnName: "Yes",
                loadingBtnName: ["Yes"],
              });
              if (buttonName === "Yes") {
                deleteMutation.mutate({
                  _isDeleteRow: true,
                  COMP_CD: rows?.COMP_CD,
                  BRANCH_CD: rows?.BRANCH_CD,
                  ENT_COMP_CD: rows?.ENT_COMP_CD,
                  ENT_BRANCH_CD: rows?.ENT_BRANCH_CD,
                  TRAN_CD: rows?.TRAN_CD,
                  SR_CD: rows?.SR_CD,
                  LINE_ID: rows?.LINE_ID,
                  ACCT_TYPE: rows?.DR_ACCT_TYPE,
                  ACCT_CD: rows?.DR_ACCT_CD,
                  AMOUNT: rows?.SI_AMOUNT,
                  CONFIRMED: rows?.CONFIRMED,
                  CR_ACCT_TYPE: rows?.CR_ACCT_TYPE,
                  CR_ACCT_CD: rows?.CR_ACCT_CD,
                  TRAN_DT: authState.workingDate,
                  ENTERED_BY: rows?.ENTERED_BY,
                  USER_DEF_REMARKS: val,
                  ACTIVITY_TYPE: "SI_ENTRY",
                });
              }
            }}
            isEntertoSubmit={true}
            AcceptbuttonLabelText="Ok"
            CanceltbuttonLabelText="Cancel"
            open={open}
            defaultValue={"WRONGENTRYFROMSTANDING"}
            rows={currentRowData}
          />
        )}
        <SiExecuteDetailView
          open={opens}
          onClose={() => setOpens(false)}
          lineId={Line_id}
          srCd={sr_Cd}
          tran_cd={tran_cd}
        />
      </Fragment>
    </ClearCacheProvider>
  );
};

export default SearchGrid;
