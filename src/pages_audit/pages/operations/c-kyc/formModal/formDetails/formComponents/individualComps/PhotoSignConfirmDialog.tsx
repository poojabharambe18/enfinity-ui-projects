import React, { useState, useEffect, useContext, useRef, FC } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "../../../../api";
import { CkycContext } from "pages_audit/pages/operations/c-kyc/CkycContext";
import { AuthContext } from "pages_audit/auth";
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useStyles } from "../../../style";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { PhotoHistoryMetadata } from "../../metadata/photohistoryMetadata";
import _ from "lodash";
import { ActionDialog } from "../../../dialog/ActionDialog";
import { GeneralAPI } from "registry/fns/functions";
import {
  usePopupContext,
  Alert,
  GridWrapper,
  GridMetaDataType,
  utilFunction,
  transformFileObject,
} from "@acuteinfo/common-base";
import { getdocCD } from "components/utilFunction/function";
interface PhotoSignProps {
  open: boolean;
  onClose: any;
  PendingRefetch: any;
}

const PhotoSignConfirmDialog: FC<PhotoSignProps> = (props) => {
  const { open, onClose, PendingRefetch } = props;

  const {
    state,
    handlePhotoOrSignctx,
    handleReqCDctx,
    handleFormModalClosectx,
  } = useContext(CkycContext);
  const { authState } = useContext(AuthContext);
  const classes = useStyles();
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const submitBtnRef = useRef<any | null>(null);
  const [filecnt, setFilecnt] = useState(0);
  const photoFileURL = useRef<any | null>(null);
  const photoUploadControl = useRef<any | null>(null);
  const signUploadControl = useRef<any | null>(null);
  const photoFilesdata = useRef<any | null>("");
  const fileName = useRef<any | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  // const headerClasses = useTypeStyles();

  const signFileURL = useRef<any | null>(null);
  const signFilesdata = useRef<any | null>("");
  const { t } = useTranslation();
  const location: any = useLocation();
  const formMode = "view";
  const [isHistoryGridVisible, setIsHistoryGridVisible] =
    useState<boolean>(true);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  const [customerData, setCustomerData] = useState<any>({});
  const [confirmAction, setConfirmAction] = useState<any>("confirm");
  const [actionDialog, setActionDialog] = useState(false);
  const CUST_NM = location.state?.[0]?.data.CUSTOMER_NAME ?? "";
  const CUST_ID = location.state?.[0]?.data.CUSTOMER_ID ?? "";
  const REQUEST_CD = location.state?.[0]?.data.REQUEST_ID ?? "";
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);
  // useEffect(() => {
  //   console.log("photoBase64ctx, signBase64ctx", Boolean(state?.photoBase64ctx), Boolean(state?.signBase64ctx))
  // }, [state?.photoBase64ctx, state?.signBase64ctx])

  // photo/sign history
  const {
    data: PhotoHistoryData,
    isError: isPhotoHistoryError,
    isLoading: isPhotoHistoryLoading,
    isFetching: isPhotoHistoryFetching,
    refetch: photoHistoryRefetch,
    error: photoHistoryError,
  } = useQuery<any, any>(["getPhotoSignHistory", {}], () =>
    API.getPhotoSignHistory({
      COMP_CD: authState?.companyID ?? "",
      CUSTOMER_ID: location?.state?.[0]?.data.CUSTOMER_ID,
      REQ_CD: location?.state?.[0]?.data.REQUEST_ID ?? "",
    })
  );

  // latest photo/sign data
  const {
    data: LatestPhotoSignData,
    isError: isLatestDtlError,
    isLoading: isLatestDtlLoading,
    isFetching: isLatestDtlFetching,
    refetch: LatestDtlRefetch,
    error: LatestDtlError,
  } = useQuery<any, any>(["getLatestPhotoSign"], () =>
    API.getCustLatestDtl({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      SCREEN_REF: docCD,
      CUSTOMER_ID: location?.state?.[0]?.data.CUSTOMER_ID,
      REQUEST_CD: location?.state?.[0]?.data.REQUEST_ID ?? "",
    })
  );

  // confirmation
  const confirmPhotoMutation: any = useMutation(API.ConfirmCustPhoto, {
    onSuccess: (data, req) => {
      PendingRefetch();
      CloseMessageBox();
      enqueueSnackbar(
        `Request ID ${REQUEST_CD} ${
          req?.CONFIRMED === "Y" ? "confirmed" : "rejected"
        } Successfully.`,
        {
          variant: "success",
        }
      );
      handleFormModalClosectx();
      handlePhotoOrSignctx(null, null, "photo");
      handlePhotoOrSignctx(null, null, "sign");
      onClose();
    },
    onError: (error: any) => {
      let errorMsg: string = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
  });

  useEffect(() => {
    if (LatestPhotoSignData && !isLatestDtlLoading) {
      let custPhoto = LatestPhotoSignData?.[0]?.CUST_PHOTO;
      let custSign = LatestPhotoSignData?.[0]?.CUST_SIGN;
      if (custPhoto) {
        handlePhotoOrSignctx(null, custPhoto, "photo");
        setPhotoImageURL(custPhoto, "photo");
        photoFilesdata.current = custPhoto;
      }
      if (custSign) {
        handlePhotoOrSignctx(null, custSign, "sign");
        setPhotoImageURL(custSign, "sign");
        signFilesdata.current = custSign;
      }
    }
  }, [LatestPhotoSignData, isLatestDtlLoading]);

  // useEffect(() => {
  //   console.log("dialogAction, isSaveDisabled, formMode", dialogAction, isSaveDisabled, formMode)
  // }, [dialogAction, isSaveDisabled, formMode])

  // set image url by getting response in base64, convert to blob;, on edit
  const setPhotoImageURL = async (filedata, img: string) => {
    if (filedata && filedata !== null && filedata.length > 6) {
      let blob = utilFunction.base64toBlob(filedata, "image/png");
      if (img === "photo") {
        photoFileURL.current =
          typeof blob === "object" && Boolean(blob)
            ? await URL.createObjectURL(blob as any)
            : null;
      } else if (img === "sign") {
        signFileURL.current =
          typeof blob === "object" && Boolean(blob)
            ? await URL.createObjectURL(blob as any)
            : null;
      }
      setFilecnt(filecnt + 1);
    } else {
      if (img === "photo") {
        photoFileURL.current = null;
      } else if (img === "sign") {
        signFileURL.current = null;
      }
    }
  };

  // custom blob creation from selected file blob
  const customTransformFileObj = (currentObj) => {
    return transformFileObject({})(currentObj);
  };

  // get base64 from blob and save in store state
  const setImageData = async (blob, img: string) => {
    let base64 = await utilFunction.convertBlobToBase64(blob);
    // console.log("kwqdiuqhiuwqgdeqweq base64", base64)
    if (img === "photo") {
      photoFilesdata.current = base64?.[1];
    } else if (img === "sign") {
      signFilesdata.current = base64?.[1];
    }
    // console.log("aqdqwedqwedqwe", blob, base64, img)
  };

  // on file selection/change
  const handleFileSelect = async (e, img: string) => {
    // console.log("kwqdiuqhiuwqgdeqweq", e)
    const files = e.target.files;
    const filesArray = Array.from(files);
    if (filesArray.length > 0) {
      let resdata = filesArray.map(
        async (one) => await customTransformFileObj(one)
      );
      if (resdata.length > 0) {
        let filesObj: any = await Promise.all(resdata);
        // console.log(filesObj, "kwqdiuqhiuwqgdeqweq", resdata)
        let fileExt = filesObj?.[0]?.fileExt?.toUpperCase();
        if (fileExt === "JPG" || fileExt === "JPEG" || fileExt === "PNG") {
          let fileSize = filesObj?.[0]?.size / 1024 / 1024;

          if (fileSize <= 5) {
            if (img === "photo") {
              photoFileURL.current =
                typeof filesObj?.[0]?.blob === "object" &&
                Boolean(filesObj?.[0]?.blob)
                  ? await URL.createObjectURL(filesObj?.[0]?.blob as any)
                  : null;
            } else if (img === "sign") {
              signFileURL.current =
                typeof filesObj?.[0]?.blob === "object" &&
                Boolean(filesObj?.[0]?.blob)
                  ? await URL.createObjectURL(filesObj?.[0]?.blob as any)
                  : null;
            }
            // console.log("kwqdiuqhiuwqgdeqweq url", photoFileURL.current, typeof photoFileURL.current)
            setImageData(filesObj?.[0]?.blob, img);

            fileName.current = filesObj?.[0]?.blob?.name;
            //submitBtnRef.current?.click?.();
            setFilecnt(filecnt + 1);
            if (isSaveDisabled) {
              setIsSaveDisabled(false);
            }
          } else {
            enqueueSnackbar(t("ImageSizeShouldBeLessThan5MB"), {
              variant: "warning",
            });
          }
        } else {
          enqueueSnackbar(t("PleaseSelectValidFormat"), {
            variant: "warning",
          });
        }
      }
    }
  };

  const onCloseActionDialog = () => {
    setActionDialog(false);
  };

  const openActionDialog = async (state: string) => {
    // setActionDialog(true)
    // setConfirmAction(state)

    const buttonName = await MessageBox({
      messageTitle: "Confirmation",
      message: `Are you sure you want to ${state ?? "confirm"} Request?`,
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
      icon: "CONFIRM",
    });
    if (buttonName === "Yes") {
      confirmPhotoMutation.mutate({
        REQUEST_CD: REQUEST_CD,
        COMP_CD: authState?.companyID ?? "",
        CONFIRMED: state === "confirm" ? "Y" : "N",
      });
    }
  };

  const ActionBTNs = React.useMemo(() => {
    return (
      <React.Fragment>
        {!isHistoryGridVisible && (
          <Button
            sx={{ textWrap: "nowrap" }}
            onClick={() => setIsHistoryGridVisible(true)}
          >
            {t("ViewHistory")}
          </Button>
        )}
        {isHistoryGridVisible && (
          <Button
            sx={{ textWrap: "nowrap" }}
            onClick={() => setIsHistoryGridVisible(false)}
          >
            {t("CloseHistory")}
          </Button>
        )}
        <Button
          onClick={() => openActionDialog("confirm")}
          color="primary"
          // disabled={mutation.isLoading}
        >
          {t("Confirm")}
        </Button>
        <Button
          onClick={() => openActionDialog("reject")}
          color="primary"
          // disabled={mutation.isLoading}
        >
          {t("Reject")}
        </Button>
        <Button
          onClick={() => {
            handleFormModalClosectx();
            handlePhotoOrSignctx(null, null, "photo");
            handlePhotoOrSignctx(null, null, "sign");
            onClose();
          }}
        >
          {t("Close")}
        </Button>
      </React.Fragment>
    );
  }, [isHistoryGridVisible]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        maxWidth="lg"
        PaperProps={{
          style: {
            minWidth: "70%",
            width: "80%",
            // maxWidth: "90%",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "var(--theme-color3)",
            color: "var(--theme-color2)",
            letterSpacing: "1.3px",
            // margin: "10px",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
            fontWeight: "light",
            borderRadius: "inherit",
            minWidth: "450px",
            py: 1,
            // mx: "auto",
            display: "flex",
            // mx: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
          id="responsive-dialog-title"
        >
          <Grid container>
            <Typography variant="h6">
              {`Photo & Signature - ${CUST_NM} ${
                CUST_ID ? ` [Cust. ID : ${CUST_ID}] ` : null
              }`}
            </Typography>
          </Grid>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* {!isHistoryGridVisible && (
            <Button sx={{textWrap: "nowrap"}} onClick={() => setIsHistoryGridVisible(true)}>
              View History
            </Button>
          )}
          {isHistoryGridVisible && (
            <Button sx={{textWrap: "nowrap"}} onClick={() => setIsHistoryGridVisible(false)}>
              Close History
            </Button>
          )} */}
            {ActionBTNs}

            {/* {formMode === "view" && (
            <Button
              onClick={() => {
                handlePhotoOrSignctx(null, null, "photo")
                handlePhotoOrSignctx(null, null, "sign")          
                onClose();
              }}
            >
              Close
            </Button>
          )} */}
          </div>
        </DialogTitle>
        <DialogContent sx={{ px: "0" }}>
          <>
            {isLatestDtlLoading ? <LinearProgress color="secondary" /> : null}
            {isLatestDtlError ? (
              <Alert
                severity={LatestDtlError?.severity ?? "error"}
                errorMsg={
                  LatestDtlError?.error_msg ?? "Something went to wrong.."
                }
                errorDetail={LatestDtlError?.error_detail}
                color="error"
              />
            ) : isPhotoHistoryError ? (
              <Alert
                severity={photoHistoryError?.severity ?? "error"}
                errorMsg={
                  photoHistoryError?.error_msg ?? "Something went to wrong.."
                }
                errorDetail={photoHistoryError?.error_detail}
                color="error"
              />
            ) : (
              confirmPhotoMutation.isError && (
                <Alert
                  severity={confirmPhotoMutation.error?.severity ?? "error"}
                  errorMsg={
                    confirmPhotoMutation.error?.error_msg ??
                    "Something went to wrong.."
                  }
                  errorDetail={confirmPhotoMutation.error?.error_detail}
                  color="error"
                />
              )
            )}
            <Grid container sx={{ px: "1" }}>
              {/* photo */}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ paddingBottom: "10px" }}
              >
                <Typography
                  // className={headerClasses.title}
                  color="inherit"
                  variant={"h6"}
                  component="div"
                >
                  {t("PhotoImage")}
                </Typography>
                <div
                  className={classes.uploadWrapper}
                  style={{
                    // width: "100%",
                    width: "300px",
                    height: "190px",
                    background: "#cfcfcf",
                    cursor: "auto",
                    margin: "10px",
                    padding: "4px",
                  }}
                  ref={submitBtnRef} //temp
                  key={"div" + filecnt} //temp
                >
                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      src={
                        Boolean(photoFileURL.current)
                          ? photoFileURL.current
                          : ""
                      } //temp
                      style={{
                        maxWidth: "300px",
                        minWidth: "300px",
                        maxHeight: "190px",
                        minHeight: "190px",
                      }}
                    />
                  </Grid>
                  <input
                    name="fileselect"
                    type="file"
                    style={{ display: "none" }}
                    ref={photoUploadControl} // temp
                    onChange={(event) => handleFileSelect(event, "photo")} //temp
                    accept="image/*"
                    onClick={(e) => {}}
                  />
                </div>
              </Grid>

              {/* signature */}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ paddingBottom: "10px" }}
              >
                <Typography
                  // className={headerClasses.title}
                  color="inherit"
                  variant={"h6"}
                  component="div"
                >
                  {t("SignatureImage")}
                </Typography>
                <div
                  className={classes.uploadWrapper}
                  style={{
                    // width: "100%",
                    width: "300px",
                    height: "190px",
                    background: "#cfcfcf",
                    cursor: "auto",
                    margin: "10px",
                    padding: "4px",
                  }}
                  ref={submitBtnRef} //temp
                  key={"div" + filecnt} //temp
                >
                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      src={
                        Boolean(signFileURL.current) ? signFileURL.current : ""
                      } //temp
                      style={{
                        maxWidth: "300px",
                        minWidth: "300px",
                        maxHeight: "190px",
                        minHeight: "190px",
                      }}
                    />
                  </Grid>
                  <input
                    name="fileselect"
                    type="file"
                    style={{ display: "none" }}
                    ref={signUploadControl} // temp
                    onChange={(event) => handleFileSelect(event, "sign")} //temp
                    accept="image/*"
                    onClick={(e) => {}}
                  />
                </div>
              </Grid>

              {isHistoryGridVisible && (
                <GridWrapper
                  key={`AssetDTLGrid`}
                  finalMetaData={PhotoHistoryMetadata as GridMetaDataType}
                  data={PhotoHistoryData ?? []}
                  setData={() => null}
                  loading={isPhotoHistoryLoading || isPhotoHistoryFetching}
                  // actions={actions}
                  // setAction={setCurrentAction}
                  // refetchData={() => assetDTLRefetch()}
                  // ref={myGridRef}
                />
              )}
            </Grid>
          </>
        </DialogContent>
      </Dialog>

      {/* {actionDialog && <ActionDialog 
        open={actionDialog} 
        setOpen={setActionDialog} 
        closeForm = {onClose}
        action= {confirmAction}
        REQUEST_CD={REQUEST_CD}
    />} */}
    </React.Fragment>
  );
};

export default PhotoSignConfirmDialog;
