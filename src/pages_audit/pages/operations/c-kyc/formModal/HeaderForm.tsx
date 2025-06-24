import {
  AppBar,
  Autocomplete,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  LinearProgress,
  Toolbar,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CkycContext } from "../CkycContext";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import * as API from "../api";
import { useLocation } from "react-router-dom";
import CategoryUpdate from "./CategoryUpdate";
import { queryClient } from "@acuteinfo/common-base";
import { TextField } from "@acuteinfo/common-base";
import { GradientButton } from "@acuteinfo/common-base";

const HeaderForm = () => {
  const {
    state,
    handleFormModalOpenctx,
    handleFormModalClosectx,
    handleCategConstitutionctx,
    handleApiRes,
    handleCategoryChangectx,
    handleSidebarExpansionctx,
    handleColTabChangectx,
    handleAccTypeVal,
    handleKycNoValctx,
    handleFormDataonRetrievectx,
    handleFormModalOpenOnEditctx,
    handlecustomerIDctx,
    onFinalUpdatectx,
    handleCurrFormctx,
  } = useContext(CkycContext);
  const [categConstitutionIPValue, setCategConstitutionIPValue] = useState<
    any | null
  >("");
  const [acctTypeState, setAcctTypeState] = useState<any | null>(null);
  const [changeCategDialog, setChangeCategDialog] = useState<boolean>(false);
  const { authState } = useContext(AuthContext);
  const categInputRef = useRef<any>(null);
  const location: any = useLocation();
  // state?.currentFormctx.isLoading && <LinearProgress color="secondary" />
  const loader = useMemo(
    () =>
      state?.currentFormctx.isLoading ? (
        <LinearProgress color="secondary" />
      ) : null,
    [state?.currentFormctx.isLoading]
  );
  const {
    data: custCategData,
    isError: isCustCategError,
    isLoading: isCustCategLoading,
    error: custCategError,
    refetch: custCategRefetch,
  } = useQuery<any, any>(
    [
      "getCIFCategories",
      state.entityTypectx,
      // {
      //   COMP_CD: authState?.companyID ?? "",
      //   BRANCH_CD: authState?.user?.branchCode ?? "",
      //   ENTITY_TYPE: state.entityTypectx
      // }
    ],
    () =>
      API.getCIFCategories({
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        ENTITY_TYPE: state?.entityTypectx,
      }),
    {
      enabled: Boolean(state.entityTypectx),
      onSuccess: (data) => {
        if (Boolean(state?.categoryValuectx)) {
          const option = data.find(
            (op) => op?.CATEG_CD === state?.categoryValuectx
          );
          if (Boolean(option)) {
            handleCategConstitutionctx(option);
          }
        }
      },
    }
  );

  const {
    data: AccTypeOptions,
    isSuccess: isAccTypeSuccess,
    isLoading: isAccTypeLoading,
  } = useQuery(["getPMISCData"], () => API.getPMISCData("CKYC_ACCT_TYPE"));

  // get tabs data
  const {
    data: TabsData,
    isSuccess,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery(
    [
      "getTabsDetail",
      {
        ENTITY_TYPE: state?.entityTypectx,
        CATEGORY_CD: state?.categoryValuectx,
        CONS_TYPE: state?.constitutionValuectx,
        CONFIRMFLAG: state?.confirmFlagctx,
      },
    ],
    () =>
      API.getTabsDetail({
        COMP_CD: authState?.companyID ?? "",
        ENTITY_TYPE: state?.entityTypectx,
        CATEGORY_CD: state?.categoryValuectx, //CATEG_CD
        CONS_TYPE: state?.constitutionValuectx, //CONSTITUTION_TYPE
        isFreshEntry: state?.isFreshEntryctx,
        CONFIRMFLAG: state?.confirmFlagctx,
      })
  );

  useEffect(() => {
    if (!isLoading) {
      // console.log("ResultResult", TabsData)
      // setTabsApiRes(data)
      let newData: any[] = [];
      if (TabsData && TabsData.length > 0) {
        TabsData.forEach((element: { [k: string]: any }) => {
          let subtitleinfo = {
            SUB_TITLE_NAME: element?.SUB_TITLE_NAME,
            SUB_TITLE_DESC: element?.SUB_TITLE_DESC,
            SUB_ICON: element?.SUB_ICON,
          };
          let index = newData.findIndex(
            (el: any) => el?.TAB_NAME == element?.TAB_NAME
          );
          if (index != -1) {
            // duplicate tab element
            let subtitles = newData[index].subtitles;
            subtitles.push(subtitleinfo);
          } else {
            // new tab element
            newData.push({
              ...element,
              subtitles: [subtitleinfo],
              isVisible: true,
            });
          }
          // console.log("filled newdata -aft", element.TAB_NAME , newData)
        });
        // setTabsApiRes(newData)
        handleApiRes(newData);
      }
    }
  }, [TabsData, isLoading]);

  useEffect(() => {
    if (
      (isLoading || isFetching) &&
      state?.categoryValuectx &&
      state?.constitutionValuectx &&
      state?.categConstitutionValuectx
    ) {
      handleCurrFormctx({
        isLoading: true,
      });
    }
  }, [
    isLoading,
    isFetching,
    state?.entityTypectx,
    state?.categoryValuectx,
    state?.constitutionValuectx,
  ]);

  useEffect(() => {
    if (state?.accTypeValuectx) {
      if (AccTypeOptions && !isAccTypeLoading) {
        let acctTypevalue = state?.accTypeValuectx;
        let acctType =
          AccTypeOptions &&
          AccTypeOptions.filter((op) => op.value == acctTypevalue);
        setAcctTypeState(acctType[0]);
      }
    } else {
      setAcctTypeState(null);
    }
  }, [state?.accTypeValuectx, AccTypeOptions, isAccTypeLoading]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getCIFCategories", state.entityTypectx]);
      queryClient.removeQueries("getPMISCData");
      queryClient.removeQueries([
        "getTabsDetail",
        {
          ENTITY_TYPE: state?.entityTypectx,
          CATEGORY_CD: state?.categoryValuectx,
          CONS_TYPE: state?.constitutionValuectx,
          CONFIRMFLAG: state?.confirmFlagctx,
        },
      ]);
    };
  }, []);

  useEffect(() => {
    if (state?.isFreshEntryctx && categInputRef.current) {
      categInputRef.current.focus();
    }
  }, [state?.isFreshEntryctx]);

  return (
    <>
      <AppBar
        position="sticky"
        // color=""
        style={{ marginBottom: "10px", top: "113px" }}
      >
        <Toolbar variant="dense" sx={{ display: "flex", alignItems: "center" }}>
          {/* common customer fields */}
          <Grid
            container
            columnGap={(theme) => theme.spacing(1)}
            rowGap={(theme) => theme.spacing(1)}
            my={1}
          >
            <Grid item xs={12} sm={6} md>
              <TextField
                sx={{ width: "100%" }}
                disabled
                id="customer-id"
                label="Cust. ID"
                // size="small"
                value={state?.customerIDctx}
                InputLabelProps={{
                  shrink: true,
                }}
                variant={"standard"}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md>
              <TextField
                sx={{ width: "100%" }}
                disabled
                id="req-id"
                label="Req. ID"
                // size="small"
                value={state?.req_cd_ctx}
                InputLabelProps={{
                  shrink: true,
                }}
                variant={"standard"}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md>
              <Autocomplete
                sx={{ width: "100%", minWidth: 350 }}
                // disablePortal
                disabled={!state?.isFreshEntryctx}
                id="cust-categories"
                value={state?.categConstitutionValuectx || null}
                inputValue={categConstitutionIPValue}
                // options={state?.customerCategoriesctx ?? []}
                options={custCategData ?? []}
                onChange={(e, value: any, r, d) => {
                  handleCategoryChangectx(e, value);
                }}
                onInputChange={(e, newInputValue) => {
                  setCategConstitutionIPValue(newInputValue);
                }}
                isOptionEqualToValue={(option, value) => {
                  return option.value === value.value;
                }}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label="Category - Constitution"
                    autoComplete="disabled"
                    type="text"
                    required={true}
                    FormHelperTextProps={{
                      component: "div",
                    }}
                    InputProps={{
                      ...params.InputProps,
                      autoFocus: true,
                      endAdornment: (
                        <React.Fragment>
                          {isCustCategLoading ? (
                            <CircularProgress
                              color="secondary"
                              size={20}
                              sx={{ marginRight: "8px" }}
                              variant="indeterminate"
                            />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant={"standard"}
                    color="secondary"
                    inputRef={categInputRef}
                  />
                )}
                // enableGrid={false} showCheckbox={false} fieldKey={''} name={''}
              />
            </Grid>

            {/* {entityType == "I" && <TextField
              id="customer-acct-type"
              label="Acc. Type"
              value={accTypeValue}
              size="small"
            />} */}

            {!state?.isFreshEntryctx &&
              !state?.isDraftSavedctx &&
              state?.customerIDctx && (
                <Grid sx={{ alignSelf: "flex-end" }}>
                  <GradientButton
                    onClick={() => setChangeCategDialog(true)}
                    disabled={false}
                    style={{ width: "auto", maxWidth: "20px" }}
                  >
                    ...
                  </GradientButton>
                </Grid>
              )}

            <Grid item xs={12} sm={6} md>
              <Autocomplete
                sx={{ width: "100%" }}
                // disablePortal
                // disabled={!state?.isFreshEntryctx}
                id="acc-types"
                options={AccTypeOptions ?? []}
                getOptionLabel={(option: any) => `${option?.label}`}
                // value={state?.accTypeValuectx ?? null}
                value={acctTypeState}
                onChange={(e, v) => {
                  // setAccTypeValue(v?.value)
                  setAcctTypeState(v);
                  handleAccTypeVal(v?.value);
                }}
                // sx={{ width: 200 }}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label="A/C Type"
                    autoComplete="disabled"
                    type="text"
                    FormHelperTextProps={{
                      component: "div",
                    }}
                    InputProps={{
                      ...params.InputProps,
                      autoFocus: true,
                      endAdornment: (
                        <React.Fragment>
                          {isAccTypeLoading ? (
                            <CircularProgress
                              color="secondary"
                              size={20}
                              sx={{ marginRight: "8px" }}
                              variant="indeterminate"
                            />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant={"standard"}
                    color="secondary"
                  />
                )}
                // enableGrid={false} showCheckbox={false} fieldKey={''} name={''}
              />
            </Grid>
            <Grid item xs={12} sm={6} md>
              <TextField
                disabled
                sx={{ width: "100%" }}
                id="customer-ckyc-number"
                name="KYC_NUMBER"
                label="CKYC No."
                value={state?.kycNoValuectx}
                onChange={(e: any) => {
                  // console.log("e, vasd", e)
                  handleKycNoValctx(e?.target?.value);
                }}
                // sx={{ width: {xs: 12, sm: "", md: "", lg: ""}}}
                // value={accTypeValue}
                // size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                variant={"standard"}
                color="secondary"
              />
            </Grid>
            {!state?.isFreshEntryctx && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      Boolean(
                        state?.isCustActivectx && state?.isCustActivectx === "Y"
                      )
                        ? true
                        : false
                    }
                    disabled
                    color="secondary"
                  />
                }
                label="Active"
              />
            )}
            {/* <ButtonGroup size="small" variant="outlined" color="secondary">
              <Button color="secondary" onClick={() => {
                  setIsCustomerData(false)
                  setIsLoadingData(true)
              }}>Submit</Button>
              <Button color="secondary" onClick={() => {
                  setIsCustomerData(false)
                  // setIsLoading(true)
              }}>Reset</Button>
              <Button color="secondary" onClick={() => {
                  setIsCustomerData(false)
                  // setIsLoading(true)
              }}>Edit</Button>
            </ButtonGroup> */}
          </Grid>
          {/* common customer fields */}
        </Toolbar>
        {loader}
        {/* {state?.currentFormctx.isLoading && <LinearProgress color="secondary" />} */}
      </AppBar>
      {changeCategDialog && (
        <CategoryUpdate
          open={changeCategDialog}
          setChangeCategDialog={setChangeCategDialog}
        />
      )}
    </>
  );
};

export default HeaderForm;
