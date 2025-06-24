import React, { useContext } from "react";
import { CkycContext } from "../../../CkycContext";
import { GradientButton } from "@acuteinfo/common-base";
import { CircularProgress, Grid } from "@mui/material";
import { t } from "i18next";

const TabNavigate = ({ handleSave, displayMode }) => {
  const { state, handleColTabChangectx } = useContext(CkycContext);
  const steps: any[] = state?.tabsApiResctx.filter((tab) => tab.isVisible);
  const totalTab: any | number = Array.isArray(steps) && steps.length;
  // console.log(state?.colTabValuectx, "wieugufwefw", totalTab, Array.isArray(state?.tabNameList), state?.tabNameList.length, state?.tabNameList)
  return (
    <Grid container item sx={{ justifyContent: "flex-end" }}>
      {Boolean(state?.colTabValuectx && state?.colTabValuectx > 0) && (
        <GradientButton
          sx={{ mr: 2, mb: 2 }}
          disabled={state?.currentFormctx.isLoading}
          onClick={(e) => handleColTabChangectx(state?.colTabValuectx - 1)}
        >
          {t("Previous")}
        </GradientButton>
      )}
      {displayMode === "new" ? (
        <GradientButton
          sx={{ mr: 2, mb: 2 }}
          disabled={state?.currentFormctx.isLoading}
          onClick={handleSave}
          endIcon={
            state?.currentFormctx.isLoading ? (
              <CircularProgress size={20} />
            ) : null
          }
        >
          {totalTab - 1 === state?.colTabValuectx
            ? t("Save")
            : state?.colTabValuectx === 2
            ? t("SaveandNext")
            : t("Next")}
        </GradientButton>
      ) : displayMode == "edit" ? (
        <GradientButton
          sx={{ mr: 2, mb: 2 }}
          disabled={state?.currentFormctx.isLoading}
          onClick={handleSave}
        >
          {totalTab - 1 === state?.colTabValuectx
            ? t("Update")
            : state?.colTabValuectx === 2
            ? t("UpdateAndNext")
            : t("Next")}
        </GradientButton>
      ) : (
        displayMode == "view" &&
        totalTab - 1 !== state?.colTabValuectx && (
          <GradientButton
            sx={{ mr: 2, mb: 2 }}
            disabled={state?.currentFormctx.isLoading}
            onClick={(e) => {
              handleColTabChangectx(state?.colTabValuectx + 1);
            }}
          >
            {t("Next")}
          </GradientButton>
        )
      )}
    </Grid>
  );
};

export default TabNavigate;
