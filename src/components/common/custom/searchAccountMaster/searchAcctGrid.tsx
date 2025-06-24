import {
  ActionTypes,
  ClearCacheProvider,
  GridMetaDataType,
  GridWrapper,
  queryClient,
} from "@acuteinfo/common-base";
import { Fragment } from "react/jsx-runtime";
import * as API from "./api";
import { useQuery } from "react-query";
import { gridMetadata } from "./gridMetaData";
import { Dialog } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { PaperComponent } from "pages_audit/pages/operations/DailyTransaction/TRN001/components";
import { useEnter } from "components/custom/useEnter";

const actions: ActionTypes[] = [
  {
    actionName: "view-all",
    actionLabel: "ViewAll",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "close-dbl",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: false,
    rowDoubleClick: true,
  },
];

const SearchAcctGrid = ({ open, close, reqPara }) => {
  const [actionMenu, setActionMenu] = useState(actions);
  const [activeSiFlag, setActiveSiFlag] = useState("Y"); // "Y" for View All, "N" for View Pending or Close

  const setCurrentAction = useCallback(async (data) => {
    if (data?.name === "close") {
      close();
      setActiveSiFlag("N");
    } else if (data?.name === "view-all") {
      setActionMenu((values) =>
        values.map((item) =>
          item.actionName === "view-all"
            ? { ...item, actionName: "view-Open", actionLabel: "View Open" }
            : item
        )
      );
      setActiveSiFlag("N");
    } else if (data?.name === "view-Open") {
      setActionMenu((values) =>
        values.map((item) =>
          item.actionName === "view-Open"
            ? { ...item, actionName: "view-all", actionLabel: "viewAll" }
            : item
        )
      );
      setActiveSiFlag("Y");
    } else if (data?.name === "close-dbl") {
      console.log(data, data?.rows[0]?.data?.ACCT_CD);
      close(data?.rows[0]?.data?.ACCT_CD);
    }
  }, []);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getAccountsOnF5"], () =>
    API.getAccountsOnF5({
      ...reqPara,
    })
  );

  const filteredData =
    data?.filter((item) => {
      if (activeSiFlag === "Y") {
        return item.STATUS !== "C";
      }
      return true;
    }) ?? [];
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getAccountsOnF5"]);
      localStorage.removeItem("commonClass");
    };
  }, []);

  return (
    <Fragment>
      <ClearCacheProvider>
        <Dialog
          open={open}
          className="acctGrid"
          PaperComponent={PaperComponent}
          id="draggable-dialog-title"
          aria-labelledby="draggable-dialog-title"
          PaperProps={{
            style: {
              width: "100%",
            },
          }}
          maxWidth="xl"
          onKeyUp={(event) => {
            if (event.key === "Escape") {
              localStorage.removeItem("commonClass");
              close();
            }
          }}
        >
          <div id="draggable-dialog-title" style={{ cursor: "move" }}>
            <GridWrapper
              key={"modeMasterGrid" + activeSiFlag}
              finalMetaData={gridMetadata as GridMetaDataType}
              data={filteredData}
              setData={() => null}
              actions={actionMenu}
              loading={isLoading || isFetching}
              setAction={setCurrentAction}
              refetchData={() => refetch()}
              variant="contained"
            />
          </div>
        </Dialog>
      </ClearCacheProvider>
    </Fragment>
  );
};

export const SearchAcctGridMain = ({ open, close, reqPara }) => {
  useEffect(() => {
    if (open) {
      localStorage.setItem("commonClass", "acctGrid");
    }
  }, [open]);
  return (
    <ClearCacheProvider>
      <SearchAcctGrid reqPara={reqPara} open={open} close={close} />
    </ClearCacheProvider>
  );
};
