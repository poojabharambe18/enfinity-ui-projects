import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  FC,
  CSSProperties,
  useMemo,
  Fragment,
} from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "../../../../api";
import { CkycContext } from "pages_audit/pages/operations/c-kyc/CkycContext";
import { AuthContext } from "pages_audit/auth";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Slider,
  Tooltip,
  Typography,
  makeStyles,
} from "@mui/material";
import { useSnackbar } from "notistack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useStyles } from "../../../style";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { PhotoHistoryMetadata } from "../../metadata/photohistoryMetadata";
import _ from "lodash";
import { GeneralAPI } from "registry/fns/functions";
import {
  PopupRequestWrapper,
  Alert,
  GridWrapper,
  GridMetaDataType,
  queryClient,
  transformFileObject,
  utilFunction,
} from "@acuteinfo/common-base";
import { getdocCD } from "components/utilFunction/function";
interface PhotoSignProps {
  open: boolean;
  onClose: any;
  viewMode: string;
  //   componentIn?: string;
  //   formMode?: string;
  //   setFormMode?: any;
  //   isHistoryGridVisible?: boolean;
  //   setIsHistoryGridVisible?: any;
  //   isSaveDisabled?: boolean;
  //   setIsSaveDisabled?: any;
  //   dialogAction?: "close" | "cancel" | "save" | null;
  //   setDialogAction?: any;
  //   dialogOpen?: boolean;
  //   setDialogOpen?: any;
}

const PhotoSignatureCpyDialog: FC<PhotoSignProps> = (props) => {
  const { open, onClose, viewMode } = props;

  return (
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
      <PhotoSignCommonComp onClose={onClose} viewMode={viewMode} />
    </Dialog>
  );
};

export const PhotoSignCommonComp = ({ onClose, viewMode }) => {
  const {
    state,
    handleFormDataonSavectx,
    handleColTabChangectx,
    handlePhotoOrSignctx,
    handleStepStatusctx,
    handleModifiedColsctx,
    handleFormModalClosectx,
  } = useContext(CkycContext);
  const { authState } = useContext(AuthContext);
  const classes = useStyles();

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

  const [activePhotoHist, setActivePhotoHist] = useState<any>(null);

  const [formMode, setFormMode] = useState<any>("view");
  const [isHistoryGridVisible, setIsHistoryGridVisible] =
    useState<boolean>(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [dialogAction, setDialogAction] = useState<
    "close" | "cancel" | "save" | null
  >(null);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [customerData, setCustomerData] = useState<any>({});
  const docCD = getdocCD(useLocation().pathname, authState?.menulistdata);

  // useEffect(() => {
  //   console.log("photoBase64ctx, signBase64ctx", Boolean(state?.photoBase64ctx), Boolean(state?.signBase64ctx))
  // }, [state?.photoBase64ctx, state?.signBase64ctx])

  // let customerData = {};
  useEffect(() => {
    if (location.state && location.state.length > 0) {
      // console.log("locationdata", location.state)
      let data = location.state?.[0]?.data;
      setCustomerData(data);
    }
  }, [location]);

  // to get photo/sign history, on edit
  const {
    data: PhotoHistoryData,
    isError: isPhotoHistoryError,
    isLoading: isPhotoHistoryLoading,
    isFetching: isPhotoHistoryFetching,
    refetch: photoHistoryRefetch,
    error: photoHistoryError,
  } = useQuery<any, any>(["getPhotoSignHistory"], () =>
    API.getPhotoSignHistory({
      COMP_CD: authState?.companyID ?? "",
      CUSTOMER_ID: location?.state?.[0]?.data.CUSTOMER_ID,
      REQ_CD: location?.state?.[0]?.data.REQUEST_ID ?? "",
    })
  );

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

  const updateMutation: any = useMutation(API.updatePhotoSignData, {
    onSuccess: (data, payload) => {
      handlePhotoOrSignctx(null, payload.PHOTO_DTL.CUST_PHOTO, "photo");
      handlePhotoOrSignctx(null, payload.PHOTO_DTL.CUST_SIGN, "sign");

      // photoHistoryRefetch()
      // console.log(payload, "datatdastdastdasd", data);
      setDialogAction(null);
      setIsSaveDisabled(true);
      setFormMode("view");
      enqueueSnackbar(t("DataSaveSuccessfully"), {
        variant: "success",
      });
      LatestDtlRefetch();
    },
    onError: (error: any) => {
      // console.log("datatdastdastdasd error", error);
    },
  });

  const onSave = () => {
    // console.log(activePhotoHist, "onsavewefwf", location);
    let tabModifiedCols: any = ["CUST_PHOTO", "CUST_SIGN"];
    let newFormData = {
      CUST_PHOTO: photoFilesdata.current ?? "",
      CUST_SIGN: signFilesdata.current ?? "",
    };

    // let oldFormData = {
    //   CUST_PHOTO: activePhotoHist.CUST_PHOTO ?? "",
    //   CUST_SIGN: activePhotoHist.CUST_SIGN ?? "",
    // };

    let oldFormData = {
      CUST_PHOTO: state?.photoBase64ctx ?? "",
      CUST_SIGN: state?.signBase64ctx ?? "",
    };
    // let newFormData = _.pick(
    //   state?.formDatactx[TAB] ?? {},
    //   state?.modifiedFormCols[TAB] ?? []
    // );
    // let oldFormData = _.pick(
    //   state?.retrieveFormDataApiRes[TAB] ?? {},
    //   state?.modifiedFormCols[TAB] ?? []
    // );
    let upd;
    upd = utilFunction.transformDetailsData(newFormData, oldFormData);
    // console.log("updupd", {
    //   ...upd,
    //   CUST_PHOTO: photoFilesdata.current,
    //   CUST_SIGN: signFilesdata.current,
    // });
    let data = {
      // ENTRY_TYPE: "1",
      COMP_CD: authState?.companyID ?? "",
      CUSTOMER_ID: location?.state?.[0]?.data.CUSTOMER_ID ?? "",
      REQ_FLAG: "E",
      PHOTO_DTL: {
        ...LatestPhotoSignData[0],
        isNewRow: true,
        CUST_PHOTO: photoFilesdata.current ?? "",
        CUST_SIGN: signFilesdata.current ?? "",
        // ...custData,
        ...upd,
      },
    };
    if (Boolean(location.state?.[0]?.data.REQUEST_ID)) {
      const { SR_CD, COMP_CD } = LatestPhotoSignData[0];
      data = {
        // ENTRY_TYPE: "1",
        COMP_CD: authState?.companyID ?? "",
        CUSTOMER_ID: location?.state?.[0]?.data.CUSTOMER_ID ?? "",
        REQ_FLAG: "E",
        PHOTO_DTL: {
          // ...activePhotoHist,
          isNewRow: false,
          SR_CD: SR_CD,
          COMP_CD: COMP_CD,
          REQ_CD: location.state?.[0]?.data.REQUEST_ID,

          CUST_PHOTO: photoFilesdata.current ?? "",
          CUST_SIGN: signFilesdata.current ?? "",
          // ...custData,
          ...upd,
        },
      };
    }
    if (upd) {
      updateMutation.mutate(data);
    }
  };

  const onClear = async () => {
    setFormMode("view");
    // Boolean(state?.photoBase64ctx), Boolean(state?.signBase64ctx)
    await setPhotoImageURL(state?.photoBase64ctx, "photo");
    await setPhotoImageURL(state?.signBase64ctx, "sign");
    // photoFilesdata.current =
    // signFilesdata.current =
    setDialogOpen(false);
    setDialogAction(null);
    setIsSaveDisabled(true);
  };

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

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getPhotoSignHistory"]);
      queryClient.removeQueries(["getLatestPhotoSign"]);
    };
  }, []);

  return (
    <>
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
          <Typography variant="h6">{`Photo & Signature - ${location?.state?.[0]?.data?.CUSTOMER_NAME} - ${location?.state?.[0]?.id}`}</Typography>
          <Typography component="span" variant="h6" color="primary">
            <Chip
              style={{ color: "white", marginLeft: "8px" }}
              variant="outlined"
              color="primary"
              size="small"
              label={formMode === "view" ? "view mode" : "edit mode"}
            />
          </Typography>
        </Grid>
        <div style={{ display: "flex", alignItems: "center" }}>
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

          {formMode === "view" && viewMode === "edit" && (
            <Button onClick={() => setFormMode("edit")}>Edit</Button>
          )}
          {formMode === "edit" && (
            <Button disabled={isSaveDisabled} onClick={onSave}>
              {t("Save")}
            </Button>
          )}
          {/* setDialogOpen(false);
                      setDialogAction(null);
                      setIsSaveDisabled(true); */}

          {formMode === "edit" && (
            <Button
              onClick={() => {
                // setFormMode("view");
                setDialogAction("cancel");
                if (isSaveDisabled) {
                  setFormMode("view");
                } else if (!isSaveDisabled) {
                  setDialogOpen(true);
                }
              }}
            >
              {t("Cancel")}
            </Button>
          )}
          {formMode === "view" && (
            <Button
              onClick={() => {
                handleFormModalClosectx();
                handlePhotoOrSignctx(null, null, "photo");
                handlePhotoOrSignctx(null, null, "sign");
                setDialogAction(null);
                onClose();
              }}
            >
              {t("Close")}
            </Button>
          )}
        </div>
      </DialogTitle>
      <DialogContent sx={{ px: "0" }}>
        <>
          {updateMutation.isLoading ||
          isPhotoHistoryLoading ||
          isLatestDtlLoading ? (
            <LinearProgress color="secondary" />
          ) : null}
          {updateMutation.isError ? (
            <Alert
              severity={updateMutation.error?.severity ?? "error"}
              errorMsg={
                updateMutation.error?.error_msg ?? "Something went to wrong.."
              }
              errorDetail={updateMutation.error?.error_detail}
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
            isLatestDtlError && (
              <Alert
                severity={LatestDtlError?.severity ?? "error"}
                errorMsg={
                  LatestDtlError?.error_msg ?? "Something went to wrong.."
                }
                errorDetail={LatestDtlError?.error_detail}
                color="error"
              />
            )
          )}
          <Grid container sx={{ px: "1" }}>
            {/* photo */}
            <Grid item xs={12} sm={6} md={6} style={{ paddingBottom: "10px" }}>
              <Typography
                // className={headerClasses.title}
                color="inherit"
                variant={"h6"}
                component="div"
              >
                {t("PhotoUpload")}
              </Typography>
              <Tooltip
                key={"tooltip-" + formMode}
                title={
                  formMode !== "edit"
                    ? // formMode === "view" || formMode === "confirm"
                      ""
                    : "Click to upload the Photo Image"
                } // temp
                placement={"top"}
                arrow={true}
              >
                <div
                  className={classes.uploadWrapper}
                  style={{
                    // width: "100%",
                    width: "300px",
                    height: "190px",
                    background: "#cfcfcf",
                    cursor:
                      // formMode === "edit" || formMode === "add" //temp
                      formMode === "edit" //temp
                        ? "pointer"
                        : "auto",
                    margin: "10px",
                    padding: "4px",
                  }}
                  // onDoubleClick={() => {
                  //   if (formMode === "edit" || formMode === "add") {
                  //     fileUploadControl?.current?.click();
                  //   }
                  // }}
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
                  {/* {formMode === "edit" || formMode === "add" ? ( //temp */}
                  {formMode === "edit" ? (
                    <div
                      className="image-upload-icon"
                      onClick={() => photoUploadControl?.current?.click()} //temp
                      style={{
                        width: "300px",
                        height: "190px",
                        borderRadius: "5%",
                      }}
                    >
                      <IconButton>
                        <AddAPhotoIcon htmlColor="white" />
                      </IconButton>
                      <Typography
                        component={"span"}
                        style={{
                          margin: "0",
                          color: "white",
                          lineHeight: "1.5",
                          fontSize: "0.75rem",
                          fontFamily: "Public Sans,sans-serif",
                          fontWeight: "400",
                        }}
                      >
                        {t("UploadPhotoImage")}
                      </Typography>
                      <input
                        name="fileselect"
                        type="file"
                        style={{ display: "none" }}
                        ref={photoUploadControl} //temp
                        onChange={(event) => handleFileSelect(event, "photo")} //temp
                        accept="image/*"
                        onClick={(e) => {
                          // console.log("kwqdiuqhiuwqgdeqweq e1", e)
                          //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                          //@ts-ignore
                          e.target.value = "";
                        }}
                      />
                    </div>
                  ) : (
                    <input
                      name="fileselect"
                      type="file"
                      style={{ display: "none" }}
                      ref={photoUploadControl} // temp
                      onChange={(event) => handleFileSelect(event, "photo")} //temp
                      accept="image/*"
                      onClick={(e) => {
                        // console.log("kwqdiuqhiuwqgdeqweq e2", e)
                        //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                        //@ts-ignore
                        e.target.value = "";
                      }}
                    />
                  )}
                </div>
              </Tooltip>
            </Grid>

            {/* signature */}
            <Grid item xs={12} sm={6} md={6} style={{ paddingBottom: "10px" }}>
              <Typography
                // className={headerClasses.title}
                color="inherit"
                variant={"h6"}
                component="div"
              >
                {t("SignatureImage")}
              </Typography>
              <Tooltip
                key={"tooltip-" + formMode}
                title={
                  formMode !== "edit"
                    ? // formMode === "view" || formMode === "confirm"
                      ""
                    : "Click to upload the Signature Image"
                } // temp
                placement={"top"}
                arrow={true}
              >
                <div
                  className={classes.uploadWrapper}
                  style={{
                    // width: "100%",
                    width: "300px",
                    height: "190px",
                    background: "#cfcfcf",
                    cursor:
                      // formMode === "edit" || formMode === "add" //temp
                      formMode === "edit" //temp
                        ? "pointer"
                        : "auto",
                    margin: "10px",
                    padding: "4px",
                  }}
                  // onDoubleClick={() => {
                  //   if (formMode === "edit" || formMode === "add") {
                  //     fileUploadControl?.current?.click();
                  //   }
                  // }}
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
                  {/* {formMode === "edit" || formMode === "add" ? ( //temp */}
                  {formMode === "edit" ? (
                    <div
                      className="image-upload-icon"
                      onClick={() => signUploadControl?.current?.click()} //temp
                      style={{
                        width: "300px",
                        height: "190px",
                        borderRadius: "5%",
                      }}
                    >
                      <IconButton>
                        <AddAPhotoIcon htmlColor="white" />
                      </IconButton>
                      <Typography
                        component={"span"}
                        style={{
                          margin: "0",
                          color: "white",
                          lineHeight: "1.5",
                          fontSize: "0.75rem",
                          fontFamily: "Public Sans,sans-serif",
                          fontWeight: "400",
                        }}
                      >
                        {t("UploadSignatureImage")}
                      </Typography>
                      <input
                        name="fileselect"
                        type="file"
                        style={{ display: "none" }}
                        ref={signUploadControl} //temp
                        onChange={(event) => handleFileSelect(event, "sign")} //temp
                        accept="image/*"
                        onClick={(e) => {
                          //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                          //@ts-ignore
                          e.target.value = "";
                        }}
                      />
                    </div>
                  ) : (
                    <input
                      name="fileselect"
                      type="file"
                      style={{ display: "none" }}
                      ref={signUploadControl} // temp
                      onChange={(event) => handleFileSelect(event, "sign")} //temp
                      accept="image/*"
                      onClick={(e) => {
                        //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                        //@ts-ignore
                        e.target.value = "";
                      }}
                    />
                  )}
                </div>
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              style={{ padding: "0px 10px 10px 20px" }}
            >
              {/* {formMode === "edit" || formMode === "add" ? ( //temp */}
              {/* {formMode === "edit" ? ( */}
              <Grid>
                <Typography
                  // className={headerClasses.typography}
                  color="inherit"
                  variant={"h6"}
                  component="div"
                >
                  {t("Note")}
                </Typography>
                <Typography
                  // className={headerClasses.typography}
                  color="inherit"
                  variant={"h6"}
                  component="div"
                  style={{ fontSize: "inherit" }}
                >
                  <ul style={{ paddingLeft: "15px" }}>
                    <li>{t("ClickOnTheImageBoxToUploadImage")}</li>
                    <li>{t("MaximumImageSizeShouldBe5MB")}</li>
                    <li>{t("ImageFormatShouldBeJPEGAndPNG")}</li>
                  </ul>
                </Typography>
              </Grid>
            </Grid>

            {PhotoHistoryData && isHistoryGridVisible && (
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
            {
              <PopupRequestWrapper
                MessageTitle={"CONFIRM"}
                Message={t("YourChangesWillBeRemoved")}
                onClickButton={(rows, buttonNames, ...others) => {
                  // console.log(rows, "kjefeiwqf", buttonNames)
                  if (buttonNames === "Ok") {
                    onClear();
                  } else if (buttonNames === "Cancel") {
                    setDialogOpen(false);
                    setDialogAction(null);
                  }
                }}
                buttonNames={["Ok", "Cancel"]}
                rows={[]}
                loading={undefined}
                open={dialogOpen}
              />
            }
          </Grid>
        </>
      </DialogContent>
    </>
  );
};

export default PhotoSignatureCpyDialog;
