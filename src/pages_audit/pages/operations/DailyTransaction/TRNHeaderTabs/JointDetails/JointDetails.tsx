import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Dialog from "@mui/material/Dialog";
import { t } from "i18next";
import { useSnackbar } from "notistack";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import * as API from "./api";
import { JointDetailGridMetaData } from "./gridMetadata";

import {
  ActionTypes,
  Alert,
  FormWrapper,
  GradientButton,
  GridMetaDataType,
  GridWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";
import { collateraljoint_tab_metadata } from "pages_audit/pages/operations/acct-mst/tabMetadata/collateralJointMetadata";
import { guarantorjoint_tab_metadata } from "pages_audit/pages/operations/acct-mst/tabMetadata/guarantorJointMetadataa";
import { guardianjoint_tab_metadata } from "pages_audit/pages/operations/acct-mst/tabMetadata/guardianlJointMetadata";
import { introductorjoint_tab_metadata } from "pages_audit/pages/operations/acct-mst/tabMetadata/introductorJointMetadata";
import { joint_tab_metadata } from "pages_audit/pages/operations/acct-mst/tabMetadata/jointTabMetadata";
import { nomineejoint_tab_metadata } from "pages_audit/pages/operations/acct-mst/tabMetadata/nomineeJointMetadata";
import { signatoryjoint_tab_metadata } from "pages_audit/pages/operations/acct-mst/tabMetadata/signatoryJointMetadata";
type JointDetailsCustomProps = {
  hideHeader?: any;
  reqData: any;
  height?: any;
  closeDialog?: any;
};
export const JointDetails: React.FC<JointDetailsCustomProps> = ({
  reqData,
  hideHeader,
  height,
  closeDialog,
}) => {
  const actions: ActionTypes[] = [
    {
      actionName: "ViewDetails",
      actionLabel: "ViewDetails",
      multiple: false,
      rowDoubleClick: true,
      alwaysAvailable: false,
    },
  ];
  const actions2: ActionTypes[] = [
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
    {
      actionName: "ViewDetails",
      actionLabel: "ViewDetails",
      multiple: false,
      rowDoubleClick: true,
      alwaysAvailable: false,
    },
  ];

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // Index for navigation
  const navigate = useNavigate();
  const hasRequiredFields = Boolean(
    reqData?.ACCT_CD && reqData?.ACCT_TYPE && reqData?.BRANCH_CD
  );

  // Close the dialog
  const handleClose = () => setOpen(false);

  // Fetch joint details from API
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(
    ["getJointDetailsList", { reqData }],
    () => API.getJointDetailsList(reqData),
    {
      // enabled: !!reqData?.ACCT_CD, // Only fetch if ACCT_CD exists
      enabled: hasRequiredFields,
      onSuccess(data) {},
      onError(err) {},
    }
  );
  const handleRefetch = () => {
    if (hasRequiredFields) {
      refetch();
    }
  };

  //Grid Header title
  const memoizedMetadata = useMemo(() => {
    JointDetailGridMetaData.gridConfig.gridLabel = reqData?.custHeader
      ? `Joint Details of A/c No.: ${reqData?.BRANCH_CD?.trim() ?? ""}-${
          reqData?.ACCT_TYPE?.trim() ?? ""
        }-${reqData?.ACCT_CD?.trim() ?? ""} ${reqData?.ACCT_NM?.trim() ?? ""}`
      : reqData?.TAB_DISPL_NAME ?? "jointDetails";

    return JointDetailGridMetaData;
  }, [
    reqData?.custHeader,
    reqData?.BRANCH_CD,
    reqData?.ACCT_TYPE,
    reqData?.ACCT_CD,
  ]);

  // Handle the Next/Previous button clicks and index changes
  const changeIndex = (direction) => {
    setCurrentIndex((prevIndex) => {
      const nextIndex =
        direction === "next"
          ? (prevIndex + 1) % data?.length
          : (prevIndex - 1 + data?.length) % data?.length;
      return nextIndex;
    });
  };

  // Action handler for grid
  const setCurrentAction = useCallback((data) => {
    if (data?.name === "close") {
      closeDialog();
      localStorage.removeItem("commonClass");
    } else {
      const index = data?.rows?.[0]?.data?.index;
      if (index !== undefined) {
        setCurrentIndex(index);
        setOpen(true); // Open dialog after setting the currentIndex
      }
    }
  }, []);

  // Dynamically set the form label using account details
  const metaData: any = useMemo(() => {
    let baseMetaData;

    switch (data?.[currentIndex]?.J_TYPE) {
      case "J":
        baseMetaData = joint_tab_metadata;
        break;
      case "N":
        baseMetaData = nomineejoint_tab_metadata;
        break;
      case "G":
        baseMetaData = guarantorjoint_tab_metadata;
        break;
      case "M":
        baseMetaData = collateraljoint_tab_metadata;
        break;
      case "U":
        baseMetaData = guardianjoint_tab_metadata;
        break;
      case "S":
        baseMetaData = signatoryjoint_tab_metadata;
        break;
      case "I":
        baseMetaData = introductorjoint_tab_metadata;
        break;
      default:
        baseMetaData = joint_tab_metadata;
    }

    return {
      ...baseMetaData,
      fields: baseMetaData?.fields.map((field) =>
        field?.render?.componentType === "arrayField"
          ? {
              ...field,
              isDisplayCount: false,
              fixedRows: true,
            }
          : field
      ),
    };
  }, [data, currentIndex]);

  const initialValue = useMemo(() => {
    switch (data?.[currentIndex]?.J_TYPE) {
      case "J":
        return { JOINT_HOLDER_DTL: [data?.[currentIndex]] };
      case "N":
        return { JOINT_NOMINEE_DTL: [data?.[currentIndex]] };
      case "G":
        return { JOINT_GUARANTOR_DTL: [data?.[currentIndex]] };
      case "M":
        return { JOINT_HYPOTHICATION_DTL: [data?.[currentIndex]] };
      case "U":
        return { JOINT_GUARDIAN_DTL: [data?.[currentIndex]] };
      case "S":
        return { JOINT_SIGNATORY_DTL: [data?.[currentIndex]] };
      case "I":
        return { JOINT_INTRODUCTOR_DTL: [data?.[currentIndex]] };
      default:
        return { JOINT_HOLDER_DTL: [data?.[currentIndex]] };
    }
  }, [data, currentIndex]);
  const jointType = useMemo(() => {
    const findJointDisc = (initialValue) => {
      for (const value of Object?.values(initialValue)) {
        if (Array?.isArray(value) && value?.length > 0) {
          return value?.[0]?.JOINT_DISC || "";
        }
      }
      return "";
    };
    return findJointDisc(initialValue);
  }, [data, currentIndex]);

  if (metaData?.form) {
    // @ts-ignore
    metaData.form.label = `Joint Full view For Account :
          ${reqData?.COMP_CD?.trim() ?? ""}${reqData?.BRANCH_CD?.trim() ?? ""}${
      reqData?.ACCT_TYPE?.trim() ?? ""
    }${reqData?.ACCT_CD?.trim() ?? ""} - ${reqData?.ACCT_NM?.trim() ?? ""}
            | Type* : ${jointType} | Row ${currentIndex + 1} of ${
      data?.length
    } `;
  } else {
    return null;
  }

  JointDetailGridMetaData.gridConfig.containerHeight = {
    min: height ? height : "21.4vh",
    max: height ? height : "21.4vh",
  };
  localStorage.setItem("commonClass", "joint");
  return (
    <>
      {isError && (
        <Fragment>
          <Alert
            severity={error?.severity ?? "error"}
            errorMsg={error?.error_msg ?? t("Somethingwenttowrong")}
            errorDetail={error?.error_detail ?? ""}
          />
        </Fragment>
      )}
      <div className="joint">
        <GridWrapper
          key={`JointDetailGridMetaData`}
          finalMetaData={memoizedMetadata as GridMetaDataType}
          data={data ?? []}
          setData={() => null}
          hideHeader={hideHeader}
          actions={reqData?.BTN_FLAG === "Y" ? actions2 : actions}
          setAction={setCurrentAction}
          refetchData={handleRefetch}
          loading={isLoading || isFetching}
          enableExport={true}
        />
      </div>

      {open ? (
        <Dialog
          open={open}
          onKeyUp={(event) => {
            if (event.key === "Escape") handleClose();
          }}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
          scroll="body"
        >
          <FormWrapper
            key={`JointDetailDisplayForm_${data?.[currentIndex]}_${metaData?.form?.label}`}
            metaData={metaData as MetaDataType}
            initialValues={initialValue}
            onSubmitHandler={() => {}}
            displayMode={"view"}
            formState={{ formMode: "view" }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  startIcon={<ArrowBackIosNewIcon />}
                  disabled={1 === currentIndex + 1}
                  onClick={() => changeIndex("previous")}
                  color={"primary"}
                >
                  {t("Prev")}
                </GradientButton>
                <GradientButton
                  endIcon={<ArrowForwardIosIcon />}
                  disabled={currentIndex + 1 === data.length}
                  onClick={() => changeIndex("next")}
                  color={"primary"}
                >
                  {t("Next")}
                </GradientButton>
                <GradientButton onClick={handleClose} color={"primary"}>
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
        </Dialog>
      ) : null}
    </>
  );
};
