import { AuthContext } from "pages_audit/auth";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useQuery } from "react-query";
import * as API from "./api";
import { pendingAcctMetadata } from "./metadata/pendingAcctMetadata";
import {
  ActionTypes,
  queryClient,
  usePopupContext,
} from "@acuteinfo/common-base";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AcctModal from "./AcctModal";
import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";

import { Alert, GridMetaDataType, GridWrapper } from "@acuteinfo/common-base";

const AcctConfirm = () => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [rowsData, setRowsData] = useState<any[]>([]);
  const navigate = useNavigate();
  const location: any = useLocation();
  const { MessageBox } = usePopupContext();
  const {
    data: PendingAcct,
    isError: isPendingError,
    isLoading: isPendingAcctLoading,
    isFetching: isPendingAcctFetching,
    refetch: PendingRefetch,
    error: PendingError,
  } = useQuery<any, any>(
    ["getConfirmPendingData", authState?.user?.branchCode],
    () =>
      API.getPendingAcct({
        A_COMP_CD: authState?.companyID ?? "",
        A_BRANCH_CD: authState?.user?.branchCode ?? "",
        A_FLAG: "P",
      })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getConfirmPendingData",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

  const actions: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "ViewDetails",
      multiple: false,
      rowDoubleClick: true,
    },
    // {
    //   actionName: "inactive-customer",
    //   actionLabel: "Inactivate Customer",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
  ];
  const setCurrentAction = useCallback(
    async (data) => {
      // console.log("weohhfdwef", data)
      const maker = data.rows?.[0]?.data?.MAKER;
      const loggedinUser = authState?.user?.id;
      if (maker === loggedinUser) {
        let buttonName = await MessageBox({
          messageTitle: "InvalidConfirmation",
          message: "YouCanNotConfirmAccountModifiedByYourself",
          buttonNames: ["Ok"],
          icon: "ERROR",
        });
      } else {
        if (data.rows?.[0]?.data?.UPD_TAB_NAME === "EXISTING_PHOTO_MODIFY") {
          navigate("photo-signature", {
            state: data?.rows,
          });
        } else if (data.rows?.[0]?.data?.UPD_TAB_NAME === "FRESH_MODIFY") {
          navigate("view-detail", {
            state: {
              rows: data?.rows ?? [{ data: null }],
              formmode: "view",
              from: "confirmation-entry",
            },
          });
        } else {
          setRowsData(data?.rows);
          navigate(data?.name, {
            state: {
              rows: data?.rows ?? [{ data: null }],
              formmode: "view",
              from: "confirmation-entry",
            },
          });
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    PendingRefetch();
  }, [location]);

  pendingAcctMetadata.gridConfig.gridLabel = "ConfirmationPendingRequest";
  pendingAcctMetadata.gridConfig["containerHeight"] = {
    min: "60vh",
    max: "calc(100vh - 200px)",
  };

  return (
    <Grid sx={{ mx: "10px" }}>
      {isPendingError && (
        <Alert
          severity={PendingError?.severity ?? "error"}
          errorMsg={PendingError?.error_msg ?? "Something went to wrong.."}
          errorDetail={PendingError?.error_detail}
          color="error"
        />
      )}
      {/* <Typography
          sx={{
            color: (theme) => theme.palette.grey[700],
            mb: (theme) => theme.spacing(2),
          }}
          variant="h5"
        >
          {t("Confirmation Pending")}
        </Typography> */}
      <GridWrapper
        key={`ckycConfirmation` + PendingAcct}
        finalMetaData={pendingAcctMetadata as GridMetaDataType}
        data={PendingAcct ?? []}
        setData={() => null}
        loading={isPendingAcctLoading || isPendingAcctFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => PendingRefetch()}
        // ref={myGridRef}
      />

      <Routes>
        <Route
          path="view-detail/*"
          element={<AcctModal onClose={() => navigate(".")} />}
        />

        {/* <Route
            path="photo-signature/*"
            element={
              <PhotoSignConfirmDialog
                open={true}
                onClose={() => {
                  navigate(".");
                }}
              />
            }
          /> */}
      </Routes>
    </Grid>
  );
};

export default AcctConfirm;
