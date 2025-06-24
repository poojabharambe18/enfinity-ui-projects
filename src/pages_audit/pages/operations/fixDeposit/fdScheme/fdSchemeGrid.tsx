import { Dialog } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FDSchemeGridMetaData } from "./gridMetaData";
import * as API from "../api";
import { useQuery } from "react-query";
import {
  ActionTypes,
  GridWrapper,
  GridMetaDataType,
  Transition,
} from "@acuteinfo/common-base";
import { useCallback } from "react";

export const useDialogStyles = makeStyles({
  topScrollPaper: {
    alignItems: "center",
  },
  topPaperScrollBody: {
    verticalAlign: "top",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
});

const actions: ActionTypes[] = [
  {
    actionName: "ok",
    actionLabel: "Ok",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: true,
    alwaysAvailable: true,
  },
];

export const FDSchemeGrid = ({ isOpen, fdTranCode, categCode, onClose }) => {
  const classes = useDialogStyles();

  const setCurrentAction = useCallback((data) => {
    if (data?.name === "close") {
      onClose({ btnName: "close", data: {} });
    } else if (data?.name === "ok") {
      onClose({ btnName: "ok", data: data?.rows?.[0]?.data ?? {} });
    }
  }, []);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getFDSchemeData", fdTranCode, categCode], () =>
    API.getFDSchemeData(fdTranCode, categCode)
  );

  return (
    <Dialog
      open={isOpen}
      //@ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "70%",
        },
      }}
      maxWidth="lg"
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
    >
      <div style={{ padding: "10px" }}>
        <GridWrapper
          key={"fdScheme"}
          finalMetaData={FDSchemeGridMetaData as GridMetaDataType}
          data={data ?? []}
          loading={isLoading || isFetching || isError}
          actions={actions}
          setAction={setCurrentAction}
          refetchData={refetch}
          setData={undefined}
        />
      </div>
    </Dialog>
  );
};
