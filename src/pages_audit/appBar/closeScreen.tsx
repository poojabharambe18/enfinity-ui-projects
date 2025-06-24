import { IconButton, Tooltip } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "react-query";
import { saveRecentScreenData } from "pages_audit/auth/api";
import { useContext, useEffect, useMemo } from "react";
import { AuthContext } from "pages_audit/auth";
import { format } from "date-fns";
import { getdocCD } from "components/utilFunction/function";

const CloseScreen = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  let currentPath = useLocation().pathname;
  const saveCurrScrDt = useMutation(saveRecentScreenData, {
    onError: (error: any) => {},
    onSuccess: (response: any) => {},
  });
  const docCD = getdocCD(currentPath, authState?.menulistdata);
  return (
    <>
      <Tooltip title="Close" placement="bottom" arrow>
        <IconButton
          onClick={() => {
            saveCurrScrDt.mutate({
              branchCode: authState.user.branchCode,
              flag: "U",
              docCd: docCD,
              uniqueAppId: authState.uniqueAppId,
              tranDt: authState.workingDate,
              closeTime: format(new Date(), "yyyy-MM-dd hh:mm:ss.S"),
              openTime: "",
            });
            navigate("dashboard");
          }}
          sx={{
            backgroundColor: "rgba(235, 237, 238, 0.45)",
            borderRadius: "10px",
            height: "30px",
            width: "30px",
            "& svg": {
              display: "flex",
            },
            "&:hover": {
              background: "var(--theme-color2)",
              borderRadius: "10px",
              transition: "all 0.2s ease 0s",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              "& svg": {
                height: "25px",
                width: "25px",
                transition: "all 0.2s ease 0s",
              },
            },
          }}
        >
          <CloseIcon
            fontSize="small"
            sx={{
              color: "var(--theme-color3)",
            }}
          />
        </IconButton>
      </Tooltip>
    </>
  );
};
export default CloseScreen;
