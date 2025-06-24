import {
  ActionTypes,
  Alert,
  GridMetaDataType,
  GridWrapper,
  queryClient,
} from "@acuteinfo/common-base";
import { cloneDeep } from "lodash";
import { AuthContext } from "pages_audit/auth";
import SiExecuteDetailView from "pages_audit/pages/operations/standingInstruction/siExecuteDetailView";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import * as API from "./api";
import { SIDetailGridMetaData } from "./gridMetadata";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "ViewDetail",
    multiple: undefined,
    rowDoubleClick: true,
    alwaysAvailable: false,
  },
];

export const SIDetail = ({ reqData }) => {
  const { authState } = useContext(AuthContext);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rows, setRows] = useState<any>({});

  const hasRequiredFields = Boolean(
    reqData?.ACCT_CD && reqData?.ACCT_TYPE && reqData?.BRANCH_CD
  );

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getSIDetailList", { reqData }], () => API.getSIDetailList(reqData), {
    enabled: hasRequiredFields,
  });
  const handleRefetch = () => {
    if (hasRequiredFields) {
      refetch();
    }
  };

  const setCurrentAction = useCallback(async (data) => {
    if (data?.name === "view-details") {
      setRows(data?.rows?.[0]?.data);
      setDetailsOpen(true);
    }
  }, []);

  const memoizedMetadata = useMemo(() => {
    const metadata = cloneDeep(SIDetailGridMetaData);
    if (metadata?.gridConfig) {
      metadata.gridConfig.gridLabel =
        reqData?.TAB_DISPL_NAME ?? "StandingInstructionDetail";
    }
    return metadata;
  }, [data]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getSIDetailList",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

  return (
    <>
      {isError ? (
        <Alert
          severity={error?.severity ?? "error"}
          errorMsg={error?.error_msg ?? "Error"}
          errorDetail={error?.error_detail ?? ""}
        />
      ) : null}
      <GridWrapper
        key={`SIDetailGridMetaData ${data?.length}`}
        finalMetaData={memoizedMetadata as GridMetaDataType}
        loading={isLoading || isFetching}
        data={data ?? []}
        setData={() => null}
        refetchData={handleRefetch}
        actions={actions}
        setAction={setCurrentAction}
        enableExport={true}
      />

      <SiExecuteDetailView
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        lineId={rows?.LINE_ID ?? ""}
        srCd={rows?.SR_CD ?? ""}
        tran_cd={rows?.TRAN_CD ?? ""}
        screenFlag={"SIDTL_TRN"}
      />
    </>
  );
};
