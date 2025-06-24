import { Dialog, Paper, Typography } from "@mui/material";
import { t } from "i18next";
import {
  ActionTypes,
  Alert,
  GridMetaDataType,
  GridWrapper,
  queryClient,
} from "@acuteinfo/common-base";
import { DDtransactionsMetadata } from "./paySlipMetadata";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RetrieveEntryGrid } from "./entries/entryGrid";
import { getDDtransactionScreenList } from "./api";
import { useQuery } from "react-query";
const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: t("Close"),
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "open",
    actionLabel: t("open"),
    multiple: undefined,
    rowDoubleClick: true,
    alwaysAvailable: false,
  },
];
export const PayslipDDTransactionsEntry = () => {
  const navigate = useNavigate();
  const [componentTorender, setComponetToRender] = useState([]);
  const [screenOpen, setScreenOpen] = useState(false);

  const setCurrentAction = useCallback(async (data) => {
    if (data?.name === "close") {
      navigate("/EnfinityCore/dashboard");
    } else if (data?.name === "open") {
      let row = data?.rows[0]?.data;
      setComponetToRender([
        //@ts-ignore
        row?.DOC_CD, //@ts-ignore
        row?.DOC_NM, //@ts-ignore
        row?.SCREENREF, //@ts-ignore
        row?.TRAN_TYPE, //@ts-ignore
      ]);
      setScreenOpen(true);
    }
  }, []);
  useEffect(() => {
    navigate("./");
  }, []);
  const close = () => {
    setScreenOpen(false);
  };
  const { data, isLoading, isFetching, isError, error } = useQuery<any, any>(
    ["getDDtransactionScreenList"],
    () => getDDtransactionScreenList({ FLAG: "E" })
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDDtransactionScreenList"]);
    };
  }, []);

  return (
    <>
      <Dialog
        open={true}
        fullScreen
        PaperProps={{
          style: {
            width: "500px",
            height: "auto",
            overflow: "hidden",
          },
        }}
        maxWidth="md"
      >
        <Paper sx={{ p: 2, pb: 0 }}>
          {isError && (
            <Alert
              severity="error"
              errorMsg={error?.error_msg ?? t("Somethingwenttowrong")}
              errorDetail={error?.error_detail}
              color="error"
            />
          )}
          <GridWrapper
            key={"DDtransactionsMetadata"}
            finalMetaData={DDtransactionsMetadata as GridMetaDataType}
            data={data ?? []}
            setData={() => null}
            actions={actions}
            loading={isLoading || isFetching}
            setAction={setCurrentAction}
            refetchData={null}
            variant="contained"
          />
          <Typography
            color="inherit"
            fontWeight={800}
            variant={"h6"}
            component="div"
            textAlign={"center"}
          >
            {t("openDDtrnsScreenMsg")}
          </Typography>
        </Paper>
        {screenOpen && (
          <RetrieveEntryGrid
            screenFlag={componentTorender[2]}
            open={screenOpen}
            close={close}
            headerLabel={`${componentTorender[1]} (${componentTorender[0]})`}
            apiReqFlag={componentTorender[0]}
            trans_type={componentTorender[3]}
          />
        )}
      </Dialog>
    </>
  );
};
