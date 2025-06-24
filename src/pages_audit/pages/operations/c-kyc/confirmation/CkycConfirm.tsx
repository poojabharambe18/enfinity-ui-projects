import { AuthContext } from "pages_audit/auth";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useQuery } from "react-query";
import * as API from "../api";
import { format } from "date-fns";
import { ckyc_pending_req_meta_data } from "../metadata";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import FormModal from "../formModal/formModal";
import { Grid, Typography } from "@mui/material";
import { t } from "i18next";
import PhotoSignConfirmDialog from "../formModal/formDetails/formComponents/individualComps/PhotoSignConfirmDialog";
import { useSnackbar } from "notistack";
import UpdateDocument from "../formModal/formDetails/formComponents/update-document/Document";
import {
  usePopupContext,
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
} from "@acuteinfo/common-base";

export const CkycConfirm = () => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [rowsData, setRowsData] = useState<any[]>([]);
  const navigate = useNavigate();
  const location: any = useLocation();
  const { MessageBox } = usePopupContext();

  const {
    data: PendingData,
    isError: isPendingError,
    isLoading: isPendingDataLoading,
    isFetching: isPendingDataFetching,
    refetch: PendingRefetch,
    error: PendingError,
  } = useQuery<any, any>(["ckyc", "getConfirmPendingData"], () =>
    API.getPendingData({
      A_COMP_CD: authState?.companyID ?? "",
      A_BRANCH_CD: authState?.user?.branchCode ?? "",
      A_FLAG: "P",
    })
  );

  const actions: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "View Detail",
      multiple: false,
      rowDoubleClick: true,
    },
  ];
  const setCurrentAction = useCallback(
    async (data) => {
      // console.log("iuwefhiuwehfiweuhfiuwhe", data.rows?.[0]?.data?.UPD_TAB_FLAG_NM)
      // console.log("weohhfdwef", data)
      const maker = data.rows?.[0]?.data?.MAKER;
      const loggedinUser = authState?.user?.id;
      // console.log("iuwefhiuwehfiweuhfiuwhe", data.rows?.[0]?.data?.UPD_TAB_FLAG_NM, maker, loggedinUser)
      if (maker === loggedinUser) {
        let buttonName = await MessageBox({
          messageTitle: "InvalidConfirmation",
          message: "ConfirmRestrictMsg",
          buttonNames: ["Ok"],
          icon: "ERROR",
        });
      } else {
        // console.log("iuwefhiuwehfiweuhfiuwhe", data.rows?.[0]?.data?.UPD_TAB_FLAG_NM)
        if (
          data.rows?.[0]?.data?.UPD_TAB_FLAG_NM === "P" ||
          data.rows?.[0]?.data?.UPD_TAB_FLAG_NM?.includes("P")
        ) {
          // P=EXISTING_PHOTO_MODIFY
          navigate("photo-signature", {
            state: data?.rows,
          });
        } else if (
          data.rows?.[0]?.data?.UPD_TAB_FLAG_NM === "D" ||
          data.rows?.[0]?.data?.UPD_TAB_FLAG_NM?.includes("D")
        ) {
          // D=EXISTING_DOC_MODIFY
          navigate("document", {
            state: { CUSTOMER_DATA: data?.rows },
          });
        } else if (
          data.rows?.[0]?.data?.UPD_TAB_NAME === "A" ||
          data.rows?.[0]?.data?.UPD_TAB_NAME?.includes("A") ||
          data.rows?.[0]?.data?.UPD_TAB_NAME === "M" ||
          data.rows?.[0]?.data?.UPD_TAB_NAME?.includes("M")
        ) {
          // console.log("iuwefhiuwehfiweuhfiuwhe", data.rows?.[0]?.data?.UPD_TAB_FLAG_NM)
          // A=FRESH_MODIFY, M=EXISTING_MODIFY
          navigate("view-detail", {
            state: data?.rows,
          });
        }
        //  else {
        //   setRowsData(data?.rows);
        //   navigate(data?.name, {
        //     state: data?.rows,
        //   });
        // }
      }
    },
    [navigate]
  );

  // useEffect(() => {
  //   PendingRefetch()
  // }, [location])

  ckyc_pending_req_meta_data.gridConfig.gridLabel =
    "C-KYC Customer Confirmation (MST/710)";
  ckyc_pending_req_meta_data.gridConfig["containerHeight"] = {
    min: "42vh",
    max: "65vh",
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
        key={`ckycConfirmation`}
        finalMetaData={ckyc_pending_req_meta_data as GridMetaDataType}
        data={PendingData ?? []}
        setData={() => null}
        loading={isPendingDataLoading || isPendingDataFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => PendingRefetch()}
        // ref={myGridRef}
      />

      <Routes>
        <Route
          path="view-detail/*"
          element={
            <FormModal
              onClose={() => navigate(".")}
              formmode={"view"}
              from={"confirmation-entry"}
            />
          }
        />

        <Route
          path="photo-signature/*"
          element={
            <PhotoSignConfirmDialog
              open={true}
              onClose={() => {
                navigate(".");
              }}
              PendingRefetch={PendingRefetch}
            />
          }
        />

        <Route
          path="document/*"
          element={
            <UpdateDocument
              open={true}
              onClose={() => navigate(".")}
              viewMode={"view"}
              from={"ckyc-confirm"}
            />
          }
        />
      </Routes>
    </Grid>
  );
};
