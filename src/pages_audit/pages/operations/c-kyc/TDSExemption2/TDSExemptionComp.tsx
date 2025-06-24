import {
  ActionTypes,
  CreateDetailsRequestData,
  GridMetaDataType,
  GridWrapper,
  queryClient,
} from "@acuteinfo/common-base";
import { Dialog } from "@mui/material";
import { minWidth } from "@mui/system";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import * as API from "../api";
import { AuthContext } from "pages_audit/auth";
import { tds_exemption_dtl_grid_meta_data } from "./gridMetadata";
import TDSAddNewForm from "./TDSAddNewForm";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";

const actions: ActionTypes[] = [
  {
    actionName: "save",
    actionLabel: "Save",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "add-new",
    actionLabel: "Add New",
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
];
const TDSSExemptionComp = ({ open, onClose }) => {
  const { authState } = useContext(AuthContext);
  const {
    state: [{ data: row }],
  } = useLocation();
  const gridRef = useRef<any>(null);
  const [gridData, setGridData] = useState<any>([]);
  const [formMode, setFormMode] = useState<"view" | "edit" | "new">("edit");
  const [curRow, setCurRow] = useState<any>({});
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isAddNewFormVisible, setIsAddNewFormVisible] =
    useState<boolean>(false);
  const {
    data: TDSExemptionData,
    isError: isTDSExemptionError,
    isLoading: isTDSExemptionLoading,
    isFetching: isTDSExemptionFetching,
    refetch: TDSExemptionRefetch,
    error: TDSExemptionError,
  } = useQuery<any, any>(["TDSExemptionDTL"], () =>
    API.TDSExemptionDTL({
      COMP_CD: authState?.companyID ?? "",
      CUSTOMER_ID: row?.CUSTOMER_ID,
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["TDSExemptionDTL"]);
    };
  }, []);

  // update TDS data
  const updateMutation: any = useMutation(API.SaveTDSExemption, {
    onSuccess: (data) => {
      setIsAddNewFormVisible(false);
      TDSExemptionRefetch();
      enqueueSnackbar("Updated Successfully", { variant: "success" });
    },
    onError: (error: any) => {},
  });

  useEffect(() => {
    if (TDSExemptionData && !isTDSExemptionLoading) {
      setGridData(TDSExemptionData);
    }
  }, [TDSExemptionData, isTDSExemptionLoading]);

  const setCurrentAction = useCallback((data) => {
    if (data.name === "close") {
      onClose();
    } else if (data.name === "add-new") {
      setFormMode("new");
      setCurRow(data.rows?.[0]?.data ?? {});
      // setIsFormVisible(true);
      setIsAddNewFormVisible(true);
    } else if (data?.name === "save") {
      // console.log("wekrufherg>>>>>>>>>>>>", data);
      const formData = gridRef?.current?.cleanData?.();
      const newRows = CreateDetailsRequestData(formData);
      // console.log(newRows, "wekrufherg", formData);
      const { isUpdatedRow } = newRows;
      const updatedRows = isUpdatedRow.map((row) => {
        let {
          _OLDROWVALUE,
          _UPDATEDCOLUMNS,
          IsNewRow,
          ORIGINALACTIVE,
          ...other
        } = row;
        if (_UPDATEDCOLUMNS?.length > 0 && _UPDATEDCOLUMNS.includes("ACTIVE")) {
          _UPDATEDCOLUMNS.push("INACTIVE_DT");
          _OLDROWVALUE["INACTIVE_DT"] = "";
          other["INACTIVE_DT"] = format(new Date(), "dd-MMM-yyyy");
        }
        return { ...other, _OLDROWVALUE, _UPDATEDCOLUMNS };
      });
      // console.log({isNewRow: [], isDeleteRow: [], isUpdatedRow: updatedRows} ,"sdskjdfhiwueef", updatedRows)
      // const {_OLDROWVALUE, _UPDATEDCOLUMNS, ...other} = newRows;
      let payload = {
        DETAILS_DATA: {
          isNewRow: [],
          isDeleteRow: [],
          isUpdatedRow: updatedRows,
        },
      };
      updateMutation.mutate(payload);
    }
  }, []);

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      PaperProps={{ style: { minWidth: "70%", width: "80%" } }}
    >
      <GridWrapper
        key={"TDSExeptionGrid"}
        ref={gridRef}
        finalMetaData={tds_exemption_dtl_grid_meta_data as GridMetaDataType}
        data={gridData}
        setData={setGridData}
        loading={isTDSExemptionLoading || isTDSExemptionFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => TDSExemptionRefetch()}
        onClickActionEvent={(index, id, currentData) => {
          // console.log("swefwefwef", index, id, currentData);
          if (id === "VIEW_EDIT") {
            setCurRow(currentData);
            setFormMode("view");
            setIsAddNewFormVisible(true);
          } else if (id === "DELETE") {
            setGridData((oldData) => {
              const rows = oldData.filter(
                (row) => row?.TRAN_CD !== currentData?.TRAN_CD
              );
              return [...rows];
            });
          }
        }}
      />

      {isAddNewFormVisible && (
        <TDSAddNewForm
          setIsAddNewFormVisible={setIsAddNewFormVisible}
          formMode={formMode}
          setGridData={setGridData}
          curRow={curRow}
          custID={row?.CUSTOMER_ID ?? ""}
          enteredFrom={TDSExemptionData?.[0]?.PARA_28 ?? ""}
          updateMutation={updateMutation}
        />
      )}
    </Dialog>
  );
};

export default TDSSExemptionComp;
