import { Grid } from "@mui/material";
import { RetrieveDataFilterForm, ckyc_retrieved_meta_data } from "./metadata";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";

import {
  FormComponentView,
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  FilterFormMetaType,
} from "@acuteinfo/common-base";
import FormModal from "./formModal/formModal";
import { DeactivateCustomer } from "./DeactivateCustomer";
// import { PhotoSignUpdateDialog } from "./formModal/formDetails/formComponents/individualComps/PhotoSignCopy2";
import InsuranceComp from "./InsuranceComp";
import BankDTLComp from "./BankDTLComp";
import CreditCardDTLComp from "./CreditCardDTLComp";
import OffencesDTLComp from "./OffencesDTLComp";
import AssetDTLComp from "./AssetDTLComp";
import FinancialDTLComp from "./FinancialDTLComp";
import Dependencies from "pages_audit/acct_Inquiry/dependencies";
import ControllingPersonComp from "./ControllingPersonComp";
import PhotoSignatureCpyDialog from "./formModal/formDetails/formComponents/individualComps/PhotoSignCopyDialog";
import ExtDocument from "./formModal/formDetails/formComponents/existingCusstDoc/ExtDocument";
import _ from "lodash";
import UpdateDocument from "./formModal/formDetails/formComponents/update-document/Document";
import { getdocCD } from "components/utilFunction/function";
import TDSSExemptionComp from "./TDSExemption2/TDSExemptionComp";

const RetrieveCustomer = () => {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [rowsData, setRowsData] = useState<any[]>([]);

  const retrievePayloadRef = useRef<any>(null);
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  const allowUpdateRef = useRef({
    allowDocUpdate: true,
    allowPhotoUpdate: true,
    allowTabsUpdate: true,
  });

  // useEffect(() => {
  //   if (isLoadingData) {
  //     setTimeout(() => {
  //       setIsLoadingData(false);
  //       setIsCustomerData(true);
  //     }, 5000);
  //   }
  // }, [isLoadingData]);

  const actions: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "View Detail",
      multiple: false,
      rowDoubleClick: true,
    },
    {
      actionName: "inactive-customer",
      actionLabel: "Inactivate Customer",
      multiple: false,
      rowDoubleClick: false,
    },
    // {
    //   actionName: "change-category",
    //   actionLabel: "Change Category",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    {
      actionName: "document",
      actionLabel: "Document",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "photo-signature",
      actionLabel: "Photo/Signature",
      multiple: false,
      rowDoubleClick: false,
    },
    // {
    //   actionName: "other-address",
    //   actionLabel: "Other Address",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "insurance",
    //   actionLabel: "Insurance",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "bank-details",
    //   actionLabel: "Bank Details",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "credit-card",
    //   actionLabel: "Credit Card",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "offences-details",
    //   actionLabel: "Offences",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "asset-details",
    //   actionLabel: "Asset Details",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    // {
    //   actionName: "financial-details",
    //   actionLabel: "Financial Details",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
    {
      actionName: "tds-exemption",
      actionLabel: "TDS Exemption",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "dependencies",
      actionLabel: "Dependencies",
      multiple: false,
      rowDoubleClick: false,
    },
    // {
    //   actionName: "controlling-person-details",
    //   actionLabel: "Controlling Person",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
  ];

  const setCurrentAction = useCallback(
    (data) => {
      // console.log(authState, "wekjkbfiweifw", data)
      const confirmed = data?.rows?.[0]?.data?.CONFIRMED ?? "";
      const maker = data?.rows?.[0]?.data?.MAKER ?? "";
      const loggedinUser = authState?.user?.id;
      const updateTabFlag = data?.rows?.[0]?.data?.UPD_TAB_FLAG_NM ?? "";
      if (Boolean(confirmed)) {
        // P=SENT TO CONFIRMATION
        if (confirmed.includes("P")) {
          if (maker === loggedinUser) {
            if(updateTabFlag === "D") {
              allowUpdateRef.current = {
                allowDocUpdate: true,
                allowPhotoUpdate: false,
                allowTabsUpdate: false,
              };
            } else if(updateTabFlag === "P") {
              allowUpdateRef.current = {
                allowPhotoUpdate: true,
                allowDocUpdate: false,
                allowTabsUpdate: false
              };
            } else if(updateTabFlag === "M") {
              allowUpdateRef.current = {
                allowDocUpdate: false,
                allowPhotoUpdate: false,
                allowTabsUpdate: true,
              };
            } else if(updateTabFlag === "A") {
              allowUpdateRef.current = {
                allowDocUpdate: false,
                allowPhotoUpdate: false,
                allowTabsUpdate: true,
              };
            }
          } else {
            allowUpdateRef.current = {
              allowDocUpdate: false,
              allowPhotoUpdate: false,
              allowTabsUpdate: false,
            }
          }
        } else if (confirmed.includes("M")) {
          // M=SENT TO MODIFICATION, which will be only for fresh entry, so will not be in retrieval
          allowUpdateRef.current = {
            allowDocUpdate: false,
            allowPhotoUpdate: false,
            allowTabsUpdate: true,
          };
        } else if (confirmed.includes("Y") || confirmed.includes("R")) {
          allowUpdateRef.current = {
            allowDocUpdate: true,
            allowPhotoUpdate: true,
            allowTabsUpdate: true,
          };
        } else {
          allowUpdateRef.current = {
            allowDocUpdate: false,
            allowPhotoUpdate: false,
            allowTabsUpdate: false,
          };
        }
      }

      setRowsData(data?.rows);
      if (data?.name === "document") {
        navigate(data?.name, {
          state: { CUSTOMER_DATA: data?.rows },
        });
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const mutation: any = useMutation(API.getRetrieveData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  const onFormSubmit = (newObj) => {
    let A_PARA: any[] = [];
    Object.keys(newObj).forEach((fieldKey) => {
      A_PARA.push({
        COL_NM: fieldKey,
        COL_VAL: newObj[fieldKey],
      });
    });
    let data = {
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      A_PARA: A_PARA,
    };
    retrievePayloadRef.current = newObj;
    mutation.mutate(data);
  };

  return (
    <Grid>
      {mutation.isError && (
        <Alert
          severity={mutation.error?.severity ?? "error"}
          errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={mutation.error?.error_detail}
          color="error"
        />
      )}
      <Grid
        sx={{
          backgroundColor: "var(--theme-color2)",
          padding: (theme) => theme.spacing(1),
          boxSizing: "border-box",
          border: (theme) => `2px dashed ${theme.palette.grey[500]}`,
          borderRadius: "20px",
        }}
        my={(theme) => theme.spacing(3)}
        container
        direction={"column"}
      >
        {/* <Grid item>
                <Typography sx={{color: "var(--theme-color1)", paddingBottom: (theme) => theme.spacing(2)}} variant="h6" >Fetch Data</Typography>
            </Grid> */}
        {/* <Grid item container direction={"column"}>
                <label htmlFor="customer_id" style={{color:"grey"}}>Customer ID</label>
                <StyledSearchField sx={{maxWidth: "300px"}} id={"customer_id"} placeholder="Customer ID" />
            </Grid> */}

        <FormComponentView
          key={"retrieveCustForm"}
          finalMetaData={RetrieveDataFilterForm as FilterFormMetaType}
          onAction={(colomnValue, initialVisibleColumn) => {
            let newObj: any = {};
            let newArr = Object.keys(colomnValue).filter((key) =>
              Boolean(colomnValue[key])
            );
            if (newArr && newArr.length === 0) {
              mutation.reset();
              retrievePayloadRef.current = null;
              return;
            } else {
              newArr.forEach((key) => {
                newObj[key] = colomnValue[key];
              });
              if (Boolean(retrievePayloadRef.current)) {
                if (!_.isEqual(retrievePayloadRef.current, newObj)) {
                  onFormSubmit(newObj);
                }
              } else {
                onFormSubmit(newObj);
              }
            }
          }}
          loading={false}
          data={{}}
          submitSecondAction={() => {}}
          submitSecondButtonHide={true}
          submitSecondLoading={false}
          propStyles={{
            titleStyle: { color: "var(--theme-color3) !important" },
            toolbarStyles: { background: "var(--theme-color2) !important" },
            IconButtonStyle: { variant: "secondary" },
            paperStyle: { boxShadow: "none" },
          }}
        ></FormComponentView>

        {/* <Grid item py={2} sx={{textAlign: "right"}}>
                <Button color="secondary" variant="contained">Retrieve</Button>
            </Grid> */}
      </Grid>

      <GridWrapper
        key={`RetrieveCustEntries` + mutation.data}
        finalMetaData={ckyc_retrieved_meta_data as GridMetaDataType}
        data={mutation.data ?? []}
        setData={() => null}
        loading={mutation.isLoading || mutation.isFetching}
        actions={actions}
        setAction={setCurrentAction}
        // refetchData={() => refetch()}
        // ref={myGridRef}
      />

      <Routes>
        <Route
          path="view-detail/*"
          element={
            <FormModal
              onClose={() => navigate(".")}
              formmode={
                Boolean(allowUpdateRef.current?.allowTabsUpdate)
                  ? "edit"
                  : "view"
              }
              from={"retrieve-entry"}
            />
          }
        />

        <Route
          path="inactive-customer/*"
          element={
            <DeactivateCustomer
              rowdata={rowsData}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="photo-signature/*"
          element={
            <PhotoSignatureCpyDialog
              open={true}
              onClose={() => {
                navigate(".");
              }}
              viewMode={
                Boolean(allowUpdateRef.current?.allowPhotoUpdate)
                  ? "edit"
                  : "view"
              }
            />
          }
        />

        <Route
          path="document/*"
          element={
            <UpdateDocument
              open={true}
              onClose={() => navigate(".")}
              viewMode={
                Boolean(allowUpdateRef.current?.allowDocUpdate)
                  ? "edit"
                  : "view"
              }
              from={"ckyc-retrieve"}
            />
            // <ExtDocument
            //   open={true}
            //   onClose={() => {
            //     navigate(".");
            //   }}
            //   viewMode={formMode ?? "edit"}
            // />
          }
        />

        <Route
          path="insurance/*"
          element={
            <InsuranceComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                // setInsuranceOpen(false)
                navigate(".");
              }}
            />
          }
        />
        <Route
          path="bank-details/*"
          element={
            <BankDTLComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="credit-card/*"
          element={
            <CreditCardDTLComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="offences-details/*"
          element={
            <OffencesDTLComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="asset-details/*"
          element={
            <AssetDTLComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="financial-details/*"
          element={
            <FinancialDTLComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="dependencies/*"
          element={
            <Dependencies
              rowsData={rowsData}
              open={true}
              screenRef={docCD}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="tds-exemption/*"
          element={
            <TDSSExemptionComp
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="controlling-person-details/*"
          element={
            <ControllingPersonComp
              // rowsData={rowsData}
              open={true}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />
      </Routes>
    </Grid>
  );
};

export default RetrieveCustomer;
