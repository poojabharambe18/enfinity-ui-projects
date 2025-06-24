import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FDContext } from "./context/fdContext";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useQuery } from "react-query";
import {
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  queryClient,
  LoaderPaperComponent,
} from "@acuteinfo/common-base";
import { useTranslation } from "react-i18next";
import { Dialog } from "@mui/material";
import { SchemeSelectionGridMetaData } from "./schemeSelGridMetadata";
import { FixDepositForm } from "./fixDepositForm/fdStepperForm";
import { useDialogContext } from "../payslip-issue-entry/DialogContext";

// List of actions to be displayed as buttons in the header
const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "new-entry",
    actionLabel: "New Entry",
    multiple: undefined,
    rowDoubleClick: true,
  },
];

export const SchemeSelectionGrid = ({
  handleDialogClose,
  isDataChangedRef,
}) => {
  const { t } = useTranslation();
  const { FDState, updateSchemeSelecRowData } = useContext(FDContext);
  const { authState } = useContext(AuthContext);
  const [openNewFdForScheme, setOpenNewFdForScheme] = useState<boolean>(false);
  const { trackDialogClass } = useDialogContext();

  // API call to fetch FD Scheme Selection data
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getFDDoubleScheme"], () =>
    API.getFDDoubleScheme({
      COMP_CD: authState?.baseCompanyID ?? "",
      BRANCH_CD: authState?.user?.baseBranchCode ?? "",
      DOUBLE_TRAN_CD: FDState?.fdParaDetailData?.DOUBLE_TRAN ?? "",
      CATEG_CD: FDState?.acctNoData?.CATEG_CD ?? "",
      WORKING_DATE: authState?.workingDate ?? "",
    })
  );

  // Remove cached data for the API query to ensure fresh data is fetched
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getFDDoubleScheme"]);
    };
  }, []);

  // Function to handle actions when a button is clicked
  const setCurrentAction = useCallback(async (data) => {
    if (data?.name === "close") {
      handleDialogClose();
    }
    if (data?.name === "new-entry") {
      updateSchemeSelecRowData(data?.rows?.[0]?.data);
      trackDialogClass("fdStepDlg");
      setOpenNewFdForScheme(true);
    }
  }, []);

  // Set the header title for the grid, dynamically generating it based on account details
  const memoizedMetadata = useMemo(() => {
    SchemeSelectionGridMetaData.gridConfig.gridLabel = `Category Name: ${
      data?.[0]?.CATEG_NM ?? ""
    }`;
    return SchemeSelectionGridMetaData;
  }, [data]);

  return (
    <>
      <Dialog
        open={true}
        fullWidth={true}
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        maxWidth="lg"
        className="fdCommDlg"
      >
        {isError && (
          <Alert
            severity="error"
            errorMsg={error?.error_msg || t("Somethingwenttowrong")}
            errorDetail={error?.error_detail || ""}
            color="error"
          />
        )}
        {!data ? (
          <LoaderPaperComponent />
        ) : (
          <GridWrapper
            key={"SchemeSelectionGrid"}
            finalMetaData={memoizedMetadata as GridMetaDataType}
            data={data ?? []}
            setData={() => null}
            actions={actions}
            loading={isLoading || isFetching}
            setAction={setCurrentAction}
            refetchData={() => refetch()}
          />
        )}
      </Dialog>
      {openNewFdForScheme ? (
        <FixDepositForm
          handleDialogClose={handleDialogClose}
          defaultView={"new"}
          openNewFdForScheme={openNewFdForScheme}
          isDataChangedRef={isDataChangedRef}
        />
      ) : null}
    </>
  );
};
