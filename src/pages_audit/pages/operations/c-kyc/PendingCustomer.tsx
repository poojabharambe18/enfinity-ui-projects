import { Grid, Typography } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import * as API from "./api";
import { t } from "i18next";
import { ckyc_pending_req_meta_data } from "./metadata";
import { Route, Routes, useNavigate } from "react-router-dom";
import FormModal from "./formModal/formModal";
import { format } from "date-fns";
import PhotoSignatureCpyDialog from "./formModal/formDetails/formComponents/individualComps/PhotoSignCopyDialog";
import UpdateDocument from "./formModal/formDetails/formComponents/update-document/Document";

import {
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  queryClient,
} from "@acuteinfo/common-base";
const PendingCustomer = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const [rowsData, setRowsData] = useState<any[]>([]);

  const [formMode, setFormMode] = useState("new");
  // useEffect(() => {
  //   if (isLoadingData) {
  //     setTimeout(() => {
  //       setIsLoadingData(false);
  //       setIsCustomerData(true);
  //     }, 5000);
  //   }
  // }, [isLoadingData]);

  const {
    data: PendingData,
    isError: isPendingError,
    isLoading: isPendingDataLoading,
    isFetching: isPendingDataFetching,
    refetch: PendingRefetch,
    error: PendingError,
  } = useQuery<any, any>(["ckyc", "getPendingTabData"], () =>
    API.getPendingData({
      A_COMP_CD: authState?.companyID ?? "",
      A_BRANCH_CD: authState?.user?.branchCode ?? "",
      A_FLAG: "A",
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["ckyc", "getPendingTabData"]);
    };
  }, []);

  const pendingActions: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "View Detail",
      multiple: false,
      rowDoubleClick: true,
    },
    // {
    //   actionName: "view-all",
    //   actionLabel: "View All",
    //   multiple: false,
    //   rowDoubleClick: false,
    //   alwaysAvailable: true,
    //   isNodataThenShow: true,
    // },
  ];

  const setCurrentAction = useCallback(
    (data) => {
      // console.log(authState, "wekjkbfiweifw", data)
      const confirmed = data?.rows?.[0]?.data?.CONFIRMED ?? "";
      const maker = data?.rows?.[0]?.data?.MAKER ?? "";
      const loggedinUser = authState?.user?.id;
      if (Boolean(confirmed)) {
        // P=SENT TO CONFIRMATION
        if (confirmed.includes("P")) {
          if (maker === loggedinUser) {
            setFormMode("edit");
          } else {
            setFormMode("view");
          }
        } else if (confirmed.includes("M")) {
          // M=SENT TO MODIFICATION
          setFormMode("edit");
        } else {
          setFormMode("view");
        }
      }
      // console.log("kwfeiwehifdhweihfwef pending", data, data.rows?.[0]?.data?.UPD_TAB_NAME)
      if (data.rows?.[0]?.data?.UPD_TAB_FLAG_NM === "P") {
        // P=EXISTING_PHOTO_MODIFY
        navigate("photo-signature", {
          state: data?.rows,
        });
      } else if (data.rows?.[0]?.data?.UPD_TAB_FLAG_NM === "D") {
        // D=EXISTING_DOC_MODIFY
        navigate("document", {
          state: { CUSTOMER_DATA: data?.rows },
        });
      } else {
        setRowsData(data?.rows);
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  ckyc_pending_req_meta_data.gridConfig.gridLabel = "Customer Searching";
  ckyc_pending_req_meta_data.gridConfig["containerHeight"] = {
    min: "42vh",
    max: "calc(100vh - 300px)",
  };

  return (
    <Grid>
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
                variant="h6"
            >
                {t("PendingReq")}
            </Typography> */}
      <Grid item>
        <GridWrapper
          key={`PendingCustEntrties` + PendingData}
          finalMetaData={ckyc_pending_req_meta_data as GridMetaDataType}
          data={PendingData ?? []}
          setData={() => null}
          loading={isPendingDataLoading || isPendingDataFetching}
          actions={pendingActions}
          setAction={setCurrentAction}
          refetchData={() => PendingRefetch()}
          // ref={myGridRef}
        />
      </Grid>
      <Routes>
        <Route
          path="view-detail/*"
          element={
            <FormModal
              onClose={() => navigate(".")}
              formmode={formMode ?? "edit"}
              from={"pending-entry"}
            />
          }
        />
        <Route
          path="photo-signature/*"
          element={
            <PhotoSignatureCpyDialog
              open={true}
              onClose={() => {
                navigate(".");
              }}
              viewMode={formMode ?? "edit"}
            />
          }
        />

        <Route
          path="document/*"
          element={
            <UpdateDocument
              open={true}
              onClose={() => navigate(".")}
              viewMode={formMode ?? "view"}
              from={"ckyc-pending"}
            />
          }
        />
      </Routes>
    </Grid>
  );
};

export default PendingCustomer;
