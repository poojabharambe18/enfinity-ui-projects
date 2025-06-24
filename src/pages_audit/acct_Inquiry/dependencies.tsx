import { useContext } from "react";
import { Dialog } from "@mui/material";
import * as API from "./api";
import { DependenciesData } from "./metaData";
import { AuthContext } from "pages_audit/auth";
import { t } from "i18next";
import { ReportGrid } from "@acuteinfo/common-base";
const Dependencies = ({ open, onClose, rowsData, screenRef }) => {
  const { authState } = useContext(AuthContext);
  return (
    <Dialog
      open={open}
      // onClose={onClose}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1150px",
          height: "90%",
        },
      }}
    >
      <ReportGrid
        reportID={"CUSTOMERDEPENDENCYDTL"}
        reportName={"reportID-" + "getDependenciesData"}
        dataFetcher={API.getDependenciesData}
        metaData={DependenciesData}
        maxHeight={window.innerHeight - 151}
        title={t(
          `DependenciesOfCustomer_id = ${rowsData?.[0]?.data?.CUSTOMER_ID}`
        )}
        onClose={onClose}
        hideFooter={DependenciesData.hideFooter}
        hideAmountIn={DependenciesData.hideAmountIn}
        // retrievalType={data.retrievalType}
        // autoFetch={data?.filters?.fields?.length > 0 ? false : true}
        otherAPIRequestPara={{
          CUSTOMER_ID: rowsData?.[0]?.data?.CUSTOMER_ID,
          COMP_CD: authState.companyID,
          SCREEN_REF: screenRef,
        }}
      />
    </Dialog>
  );
};
export default Dependencies;
