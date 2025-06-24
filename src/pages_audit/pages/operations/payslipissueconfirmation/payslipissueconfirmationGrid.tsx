import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RetrievedinfoGridMetaData } from "./RetrivalInfoGridMetadata";
import { AuthContext } from "pages_audit/auth";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { DataRetrival } from "./RetriveData";
import { PayslipConfirmationFormDetails } from "./payslipConfirmationForm";
import { enqueueSnackbar } from "notistack";

import {
  Alert,
  GridWrapper,
  ActionTypes,
  queryClient,
  ClearCacheProvider,
  GridMetaDataType,
  usePopupContext,
} from "@acuteinfo/common-base";
import i18n from "components/multiLanguage/languagesConfiguration";
import { useEnter } from "components/custom/useEnter";
const actions: ActionTypes[] = [
  {
    actionName: "retrive",
    actionLabel: "Retrieve",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "close",
    actionLabel: "close",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
  },
];

interface PayslipData {
  TRAN_CD: string;
  AMOUNT: string;
  TOTAL_AMT?: number; // Optional because it's calculated
}

const PayslipissueconfirmationGrid = ({ onClose }) => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [dateDialog, setDateDialog] = useState(true); // Changed to false to not show dialog initially
  const [actionMenu, setActionMenu] = useState(actions);
  const [activeSiFlag, setActiveSiFlag] = useState("Y");
  const isDataChangedRef = useRef(false);
  const retrievalParaRef = useRef<any>(null);
  const [gridData, setGridData] = useState<any[]>([]);
  const [isDataRetrieved, setIsDataRetrieved] = useState(false);
  const location = useLocation();
  const initialRender = useRef(true);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: slipdataRefetch,
  } = useQuery<PayslipData[]>(["getPayslipCnfRetrieveData", activeSiFlag], () =>
    API.getPayslipCnfRetrieveData({
      //@ts-ignore
      A_LANG: i18n.resolvedLanguage,
      ENT_COMP_CD: authState?.companyID ?? "",
      ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
      GD_DATE: authState?.workingDate ?? "",
      FROM_DT: authState?.workingDate,
      TO_DT: authState?.workingDate,
      FLAG: "A",
    })
  );

  const retrieveDataMutation = useMutation(API.getPayslipCnfRetrieveData, {
    onError: async (error: any) => {
      setGridData([]);
      let errorMsg = "Unknown error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      await MessageBox({
        message: error?.error_msg,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: (data) => {
      setGridData([]);
      if (data.length > 1) {
        setGridData(data);
        setIsDataRetrieved(true);
      }
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getPayslipCnfRetrieveData"]);
    };
  }, []);

  const setCurrentAction = useCallback(
    async (data: { name: string; rows?: any[] }) => {
      const { name, rows } = data;
      if (name === "retrive") {
        setGridData([]);
        setDateDialog(true);
        retrievalParaRef.current = null;
      } else if (name === "close") {
        onClose();
      } else if (name === "view-details") {
        navigate(name, {
          state: rows,
        });
      }
    },
    [navigate]
  );

  const selectedDatas = (dataObj: any) => {
    setDateDialog(false);
    if (dataObj) retrievalParaRef.current = dataObj;
    retrieveDataMutation.mutate(dataObj);
    // retrieveDataMutation.mutate(retrievalParaRef.current);
  };

  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      setGridData(data);
      setIsDataRetrieved(false);
    }
  }, [data, isLoading, isFetching]);

  const handleDialogClose = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      console.log("isDataRetrieved", isDataRetrieved);

      isDataRetrieved
        ? retrieveDataMutation.mutate(retrievalParaRef.current)
        : slipdataRefetch();
    }
    isDataChangedRef.current = false;
  }, [navigate, slipdataRefetch, data]);
  useEnter("main");
  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          //@ts-ignore
          errorMsg={error?.message ?? "Something went wrong"}
          //@ts-ignore
          errorDetail={error?.message}
          color="error"
        />
      )}
      <div className="main">
        <GridWrapper
          key={"PayslipCnfRetrieveDataGrid" + gridData}
          finalMetaData={RetrievedinfoGridMetaData as GridMetaDataType}
          data={gridData ?? []}
          setData={setGridData}
          actions={actionMenu}
          loading={isLoading || isFetching || retrieveDataMutation?.isLoading}
          setAction={setCurrentAction}
          refetchData={() => slipdataRefetch()}
        />
      </div>
      <Routes>
        <Route
          path="view-details/*"
          element={
            <PayslipConfirmationFormDetails
              defaultView={"view"}
              closeDialog={handleDialogClose}
              slipdataRefetch={slipdataRefetch}
              isDataChangedRef={isDataChangedRef}
            />
          }
        />
      </Routes>

      {dateDialog && (
        <DataRetrival
          closeDialog={() => setDateDialog(false)}
          onUpload={selectedDatas}
        />
      )}
    </Fragment>
  );
};

export const Payslipissueconfirmation = ({ onClose }) => {
  return (
    <ClearCacheProvider>
      <PayslipissueconfirmationGrid onClose={onClose} />
    </ClearCacheProvider>
  );
};
