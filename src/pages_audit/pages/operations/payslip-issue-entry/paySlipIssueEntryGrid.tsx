import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { DataRetrival } from "./DataRetrival";
import { RetrieveGridMetaData } from "./paySlipMetadata";
import { PaySlipIssueEntryData } from "./PayslipIsuueEntryform";
import {
  Alert,
  ClearCacheProvider,
  queryClient,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
} from "@acuteinfo/common-base";
import { getdocCD } from "components/utilFunction/function";
import { useEnter } from "components/custom/useEnter";
import { DialogProvider, useDialogContext } from "./DialogContext";
const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "Retrive",
    actionLabel: "Retrive",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "close",
    actionLabel: "close",
    multiple: false,
    alwaysAvailable: true,
  },
];

const RetriveDataGrid = ({ onClose }) => {
  const { authState } = useContext(AuthContext);
  const { trackDialogClass, dialogClassNames } = useDialogContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isDataChangedRef = useRef<any>(null);
  const initialRender = useRef<any>(true);
  const [RetreivedData, setRetrievedData] = useState([]);
  const [openDataRetrivalForm, setopenDataRetrivalForm] = useState(true);
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data.name === "Retrive") {
        setopenDataRetrivalForm(true);
      } else if (data.name === "close") {
        onClose();
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === "R") || (e.ctrlKey && e.key === "r")) {
        e.preventDefault();
        setopenDataRetrivalForm(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setopenDataRetrivalForm(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: slipdataRefetch,
  } = useQuery<any, any>(["getRetrievalPaySlipEntryData"], () =>
    API.getRetrievalPaySlipEntryData({
      companyID: authState?.companyID,
      branchCode: authState?.user?.branchCode,
      FROM_DT: authState?.workingDate,
      TO_DT: authState?.workingDate,
      USER_LEVEL: authState?.role,
      GD_DATE: authState?.workingDate,
      DOC_CD: docCD,
    })
  );

  useEffect(() => {
    setGridVal(data);
  }, [data]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      if (location.pathname === "/EnfinityCore/operation/payslip-issue-entry") {
        navigate("add");
      }
    }
  }, [location.pathname, navigate]);

  const setGridVal = async (data) => {
    await setRetrievedData(data);
  };

  const ClosedEventCall = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      slipdataRefetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getRetrievalPaySlipEntryData"]);
    };
  }, []);
  const [className, setClassName] = useState<string>("mainGrid");
  const [coomonClass, setCommonClass] = useState<string | null>(
    localStorage.getItem("F5")
  );
  const path = useLocation()?.pathname;

  setTimeout(() => {
    console.log(localStorage.getItem("commonClass"), "checkStatus");
    setCommonClass(localStorage.getItem("commonClass"));
  }, 1000);

  useEffect(() => {
    if (coomonClass !== null && path.endsWith("add")) {
      setClassName(`${coomonClass}`);
    } else if (path?.endsWith("add") && coomonClass === null) {
      setClassName("form");
    } else if (openDataRetrivalForm) {
      setClassName("Retrive");
    } else {
      setClassName("mainGrid");
    }

    if (dialogClassNames?.length > 0 && dialogClassNames[0] !== "") {
      setClassName(dialogClassNames);
    }
  }, [coomonClass, dialogClassNames, path, openDataRetrivalForm]);

  useEnter(className);
  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Somethingwenttowrong"}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <div className="mainGrid">
        <GridWrapper
          key={"retrieveGridMetaData"}
          finalMetaData={RetrieveGridMetaData as GridMetaDataType}
          data={RetreivedData ?? []}
          setData={() => null}
          actions={actions}
          loading={isLoading || isFetching}
          setAction={setCurrentAction}
          refetchData={async () => {
            slipdataRefetch();
            await setGridVal(data);
          }}
          defaultSortOrder={[{ id: "LEAN_CD", desc: false }]}
        />
      </div>
      <Routes>
        <Route
          path="add/*"
          element={
            <PaySlipIssueEntryData
              defaultView={"new"}
              closeDialog={ClosedEventCall}
              slipdataRefetch={slipdataRefetch}
            />
          }
        />
        <Route
          path="view-details/*"
          element={
            <PaySlipIssueEntryData
              defaultView={"view"}
              closeDialog={ClosedEventCall}
              slipdataRefetch={slipdataRefetch}
            />
          }
        />
      </Routes>
      <DataRetrival
        closeDialog={() => {
          setopenDataRetrivalForm(false);
          trackDialogClass("");
        }}
        open={openDataRetrivalForm}
        onUpload={async (result) => {
          setRetrievedData(result);
        }}
      />
    </Fragment>
  );
};

export const PaySlipIssueEntry = ({ onClose }) => {
  return (
    <ClearCacheProvider>
      <DialogProvider>
        <RetriveDataGrid onClose={onClose} />
      </DialogProvider>
    </ClearCacheProvider>
  );
};
