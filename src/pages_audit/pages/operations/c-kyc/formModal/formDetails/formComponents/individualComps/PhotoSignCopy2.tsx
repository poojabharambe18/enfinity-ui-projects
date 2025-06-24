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
import { queryClient } from "@acuteinfo/common-base";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Slider,
  Tooltip,
  Typography,
} from "@mui/material";
import { CkycContext } from "pages_audit/pages/operations/c-kyc/CkycContext";
import { AuthContext } from "pages_audit/auth";
import { useSnackbar } from "notistack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { PhotoHistoryMetadata } from "../../metadata/photohistoryMetadata";
import _ from "lodash";
import { GeneralAPI } from "registry/fns/functions";
import { useMutation, useQuery } from "react-query";
import * as API from "../../../../api";
import { useStyles } from "../../../style";
import {
  GradientButton,
  utilFunction,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  transformFileObject,
} from "@acuteinfo/common-base";
import { t } from "i18next";

interface PhotoSignProps {
  componentIn?: string;
  formMode?: string;
  setFormMode?: any;
  isHistoryGridVisible?: boolean;
  setIsHistoryGridVisible?: any;
  isSaveDisabled?: boolean;
  setIsSaveDisabled?: any;
  dialogAction?: "close" | "cancel" | "save" | null;
  setDialogAction?: any;
  dialogOpen?: boolean;
  setDialogOpen?: any;
  displayMode?: string;
}

const PhotoSignatureCpy: FC<PhotoSignProps> = (props) => {
  const {
    componentIn,
    formMode = "edit",
    setFormMode,
    isHistoryGridVisible,
    setIsHistoryGridVisible,
    isSaveDisabled,
    setIsSaveDisabled,
    dialogAction,
    setDialogAction,
    dialogOpen,
    setDialogOpen,
    displayMode,
  } = props;

  const {
    state,
    handleFormDataonSavectx,
    handleColTabChangectx,
    handlePhotoOrSignctx,
    handleStepStatusctx,
    handleModifiedColsctx,
  } = useContext(CkycContext);
  const { authState } = useContext(AuthContext);
  const classes = useStyles();
  const [reqCD, setReqCD] = useState(state?.req_cd_ctx);
  const [customerID, CustomerID] = useState(state?.customerIDctx);

  const submitBtnRef = useRef<any | null>(null);
  const [filecnt, setFilecnt] = useState(0);
  const photoFileURL = useRef<any | null>(null);
  const photoUploadControl = useRef<any | null>(null);
  const signUploadControl = useRef<any | null>(null);
  const photoFilesdata = useRef<any | null>(null);
  const fileName = useRef<any | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  // const headerClasses = useTypeStyles();

  const signFileURL = useRef<any | null>(null);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const signFilesdata = useRef<any | null>(null);
  const { t } = useTranslation();
  const location: any = useLocation();

  const [fileSelected, setFileSelected] = useState(false);

  const [photoHistory, setPhotoHistory] = useState<any[]>([]);
  const [activePhotoHist, setActivePhotoHist] = useState<any>(null);

  // const [isHistoryGridVisible, setIsHistoryGridVisible] = useState<boolean>(false);

  // console.log(componentIn, "adqwsqwsqsw", location)

  // useEffect(() => {
  //     if(componentIn) {
  //         console.log("asdkjnasidnqiwndiqnbwdqwd", componentIn)
  //     }
  // }, [])

  // to get photo/sign history, on edit
  const mutation: any = useMutation(API.getPhotoSignHistory, {
    onSuccess: (data) => {
      // console.log("photohistory", data)
      setPhotoHistory(data);
      let activeHistory = null;
      activeHistory =
        data && data.length > 0 && data.findLast((el) => el.ACT_FLAG === "Y");
      setActivePhotoHist(activeHistory);
      // console.log("photohistory ac", activeHistory)
    },
    onError: (error: any) => {},
  });
  // console.log("locationnn..m", location)
  useEffect(() => {
    if (location && componentIn === "kycUpdate") {
      // console.log("asdkjhqaiwdiquwdqwd", location)
      let data = {
        COMP_CD: authState?.companyID ?? "",
        CUSTOMER_ID: location?.state?.[0]?.id,
      };
      // mutation.mutate(data)
    }
  }, [location]);

  // set photo, sign url from history api active record, on edit
  useEffect(() => {
    if (activePhotoHist) {
      // console.log("asdqwdq", photoHistory, activePhotoHist)
      setPhotoImageURL(activePhotoHist.CUST_PHOTO, "photo");
      setPhotoImageURL(activePhotoHist.CUST_SIGN, "sign");
    }
  }, [photoHistory, activePhotoHist]);

  useEffect(() => {
    if (dialogAction == "cancel") {
      if (!isSaveDisabled) {
        setDialogOpen(true);
      }
    }
  }, [dialogAction]);

  // useEffect(() => {
  //     console.log("dialogAction, isSaveDisabled", dialogAction, isSaveDisabled)
  // }, [dialogAction, isSaveDisabled])

  // const result: any = useQuery(["getPhotoSignImage", reqCD, customerID], () =>
  //     API.getPhotoSignImage({
  //         COMP_CD: authState?.companyID,
  //         reqCD: reqCD,
  //         customerID: customerID
  //     })
  // );
  // useEffect(() => {
  //     console.log("result[0].data", result[0].data)
  // }, [result, result[0].loading, result[0].data])

  // const {data:photohistoryData, isError: isPhotohistoryError, isLoading: ishotohistoryLoading, refetch: PhotohistoryRefetch} = useQuery<any, any>(
  //     ["getPhotoSignImage", {}],
  //     () => API.getPhotoSignImage({
  //         COMP_CD: authState?.companyID,
  //         reqCD: reqCD, //634
  //         customerID: "211555"
  //         // customerID: customerID
  //     })
  // );
  // useEffect(() => {
  //     if(!ishotohistoryLoading && photohistoryData) {
  //         console.log("eqweqres PendingData", photohistoryData)
  //     }
  // }, [photohistoryData, ishotohistoryLoading])

  // useEffect(() => {
  //     return () => {
  //       queryClient.removeQueries(["getPhotoSignImage", reqCD, customerID]);
  //     };
  // }, [reqCD, customerID]);

  // useEffect(() => {
  //     if (Boolean(photohistoryData?.[0]?.CARD_IMAGE)) {
  //       setPhotoImageURL(photohistoryData?.[0]?.CARD_IMAGE, "photo");
  //     //   setPhotoImageURL(photohistoryData?.[0]?.CARD2_IMAGE, "sign");
  //       photoFilesdata.current = photohistoryData?.[0]?.CARD_IMAGE;
  //     //   signFilesdata.current = photohistoryData?.[0]?.CARD2_IMAGE;
  //     }
  // }, [photohistoryData?.[0]?.CARD_IMAGE]);

  // useEffect(() => {
  //     console.log("calllleddedede..")
  //     getImageURL();
  // }, [])

  // useEffect(() => {
  //     console.log("state changessss", state?.photoBlobctx,state?.photoBase64ctx, state?.signBlobctx, state?.signBase64ctx)
  // }, [state?.photoBlobctx,state?.photoBase64ctx, state?.signBlobctx, state?.signBase64ctx])

  // for common tabs on form open
  useEffect(() => {
    if (!state?.isFreshEntryctx) {
      // console.log("saldjnqiwudhnqw", state?.update_casectx, state?.update_casectx.includes("A"), state?.photoBase64ctx, state?.signBase64ctx)
      if (
        state?.update_casectx &&
        state?.update_casectx.includes("A")
        //  || state?.update_casectx.includes("P"))
      ) {
        // let formFields = Object.keys(data) // array, get all form-fields-name
        // formFields = formFields.filter(field => !field.includes("_ignoreField")) // array, removed divider field
        // formFieldsRef.current = _.uniq([...formFieldsRef.current, ...formFields]) // array, added distinct all form-field names
        // const formData = ["CUST_PHOTO", "CUST_SIGN"]

        // let newData = state?.formDatactx;
        // newData["PHOTO_MST"] = {
        //     CUST_PHOTO: state?.retrieveFormDataApiRes?.["PHOTO_MST"]?.CUST_PHOTO ?? "",
        //     CUST_SIGN: state?.retrieveFormDataApiRes?.["PHOTO_MST"]?.CUST_SIGN ?? ""
        // };
        // handleFormDataonSavectx(newData);

        // could be, update_casectx !== "P - EXISTING_PHOTO_MODIFY"
        setPhotoImageURL(state?.photoBase64ctx, "photo");
        setPhotoImageURL(state?.signBase64ctx, "sign");
        // setPhotoImageURL(state?.retrieveFormDataApiRes?.["PHOTO_MST"]?.CUST_PHOTO, "photo")
        // setPhotoImageURL(state?.retrieveFormDataApiRes?.["PHOTO_MST"]?.CUST_SIGN, "sign")
      }
    }
  }, [state?.retrieveFormDataApiRes]);

  // set data back from store state
  useEffect(() => {
    if (!(componentIn && componentIn == "kycUpdate")) {
      async function getImageURL() {
        // console.log("async called", state?.photoBase64ctx)
        let photoBlob = utilFunction.base64toBlob(
          state?.photoBase64ctx,
          "image/png"
        );
        photoFileURL.current =
          typeof state?.photoBlobctx === "object" &&
          Boolean(state?.photoBlobctx)
            ? await URL.createObjectURL(state?.photoBlobctx as any)
            : null;

        signFileURL.current =
          typeof state?.signBlobctx === "object" && Boolean(state?.signBlobctx)
            ? await URL.createObjectURL(state?.signBlobctx as any)
            : null;

        // console.log("async called", photoFileURL.current)
        setFilecnt(filecnt + 1);
      }
      if (state?.signBlobctx || state?.photoBlobctx) {
        getImageURL();
      }
    }
  }, []);

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
    if (!(componentIn && componentIn == "kycUpdate")) {
      if (base64 && base64[1]) {
        handlePhotoOrSignctx(blob, base64?.[1], img);

        let newData = state?.formDatactx;
        if (img == "photo") {
          newData["PHOTO_MST"] = {
            CUST_PHOTO:
              state?.retrieveFormDataApiRes?.["PHOTO_MST"]?.CUST_PHOTO ?? "",
            // CUST_SIGN: state?.retrieveFormDataApiRes?.["PHOTO_MST"]?.CUST_SIGN ?? ""
          };
        } else if (img == "sign") {
          newData["PHOTO_MST"] = {
            // CUST_PHOTO: state?.retrieveFormDataApiRes?.["PHOTO_MST"]?.CUST_PHOTO ?? "",
            CUST_SIGN:
              state?.retrieveFormDataApiRes?.["PHOTO_MST"]?.CUST_SIGN ?? "",
          };
        }
        handleFormDataonSavectx(newData);
      }
    }
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

  // const formMode:any = "view";

  // format object for save api on save&next button
  const handleSavePhotoSign = () => {
    if (state?.isFreshEntryctx) {
      let data = {
        IsNewRow: true,
        COMP_CD: authState?.companyID ?? "",
        ENTERED_BRANCH_CD: authState?.user?.branchCode ?? "",
        //   REQ_CD:state?.req_cd_ctx,
        //   SR_CD:"3",
        SIGN_GROUP: "2",
        FROM_LIMIT: "2",
        TO_LIMIT: "2",
        REQ_FLAG: "F",
        ACT_FLAG: "F",
        CUST_PHOTO: photoFilesdata.current ?? "",
        CUST_SIGN: signFilesdata.current ?? "",
        ENT_COMP_CD: authState?.companyID ?? "",
        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
      };
      // if(!state?.isFreshEntryctx) {
      //     if(state?.retrieveFormDataApiRes["PHOTO_MST"].CUST_PHOTO) {
      //         if()
      //     }
      // }

      let newData = state?.formDatactx;
      newData["PHOTO_MST"] = { ...newData["PHOTO_MST"], ...data };
      handleFormDataonSavectx(newData);
    } else if (!state?.isFreshEntryctx) {
      let newData = state?.formDatactx;
      let data = {
        CUST_PHOTO: state?.photoBase64ctx,
        CUST_SIGN: state?.signBase64ctx,
      };
      newData["PHOTO_MST"] = { ...newData["PHOTO_MST"], ...data };
      handleFormDataonSavectx(newData);

      let tabModifiedCols: any = state?.modifiedFormCols;
      // for storing tab-wise updated cols
      // let updatedCols = tabModifiedCols.PHOTO_MST ? _.uniq([...tabModifiedCols.PHOTO_MST, ...upd._UPDATEDCOLUMNS]) : _.uniq([...upd._UPDATEDCOLUMNS])
      // let updatedCols = tabModifiedCols.PHOTO_MST ? _.uniq([...tabModifiedCols.PHOTO_MST, ...formFieldsRef.current]) : _.uniq([...formFieldsRef.current])
      let updatedCols = ["CUST_PHOTO", "CUST_SIGN"];
      tabModifiedCols = {
        ...tabModifiedCols,
        PHOTO_MST: [...updatedCols],
      };
      handleModifiedColsctx(tabModifiedCols);
    }

    handleStepStatusctx({
      status: "completed",
      coltabvalue: state?.colTabValuectx,
    });
    handleColTabChangectx(state?.colTabValuectx + 1);
  };

  const actions: ActionTypes[] = [];

  const SaveUpdateBTNs = useMemo(() => {
    if (componentIn && componentIn !== "kycUpdate") {
    } else if (displayMode) {
      return displayMode == "new" ? (
        <Fragment>
          <Button
            sx={{ mr: 2, mb: 2 }}
            color="secondary"
            variant="contained"
            disabled={isNextLoading}
            onClick={handleSavePhotoSign}
          >
            {t("Next")}
            {/* {t("Save & Next")} */}
          </Button>
        </Fragment>
      ) : displayMode == "edit" ? (
        <Fragment>
          <Button
            sx={{ mr: 2, mb: 2 }}
            color="secondary"
            variant="contained"
            disabled={isNextLoading}
            onClick={handleSavePhotoSign}
          >
            {t("Update & Next")}
          </Button>
        </Fragment>
      ) : (
        displayMode == "view" && (
          <Fragment>
            <Button
              sx={{ mr: 2, mb: 2 }}
              color="secondary"
              variant="contained"
              disabled={isNextLoading}
              onClick={(e) => {
                handleColTabChangectx(state?.colTabValuectx + 1);
              }}
            >
              {t("Next")}
            </Button>
          </Fragment>
        )
      );
    }
  }, [componentIn, displayMode]);

  return (
    <>
      <Grid container>
        {/* photo */}
        <Grid item xs={12} sm={6} md={6} style={{ paddingBottom: "10px" }}>
          <Typography
            // className={headerClasses.title}
            color="inherit"
            variant={"h6"}
            component="div"
          >
            {t("PhotoImage")}
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
                    Boolean(photoFileURL.current) ? photoFileURL.current : ""
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
                  src={Boolean(signFileURL.current) ? signFileURL.current : ""} //temp
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
          {formMode === "edit" ? (
            <>
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
            </>
          ) : (
            <></>
          )}
        </Grid>

        {componentIn &&
          componentIn == "kycUpdate" &&
          photoHistory &&
          isHistoryGridVisible && (
            <GridWrapper
              key={`AssetDTLGrid`}
              finalMetaData={PhotoHistoryMetadata as GridMetaDataType}
              data={photoHistory ?? []}
              setData={() => null}
              loading={mutation.isLoading || mutation.isFetching}
              // actions={actions}
              // setAction={setCurrentAction}
              // refetchData={() => assetDTLRefetch()}
              // ref={myGridRef}
            />
          )}

        {/* {fileSelected && filesdata.length > 0 ? (
                      <PhotoDialog
                        open={fileSelected}
                        onClose={handleProfileUploadClose}
                        files={filesdata}
                        // userID={userID}
                      />
                    ) : null} */}

        {componentIn && componentIn == "kycUpdate" && dialogOpen && (
          <Dialog
            open={true}
            maxWidth="sm"
            PaperProps={{
              style: {
                minWidth: "40%",
                width: "40%",
                // maxWidth: "90%",
              },
            }}
          >
            <DialogTitle
              sx={{
                background: "var(--theme-color3)",
                color: "var(--theme-color2)",
                letterSpacing: "1.3px",
                margin: "10px",
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                fontWeight: "light",
                borderRadius: "inherit",
                minWidth: "450px",
                py: 1,

                display: "flex",
                mx: 1,
                alignItems: "center",
                justifyContent: "space-between",
              }}
              id="data-lost-confirmation"
            >
              <Typography variant="h6">{t("Confirmation")}</Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                {t("YourChangesWillBeRemoved")}
              </Typography>
            </DialogContent>
            <DialogActions>
              <GradientButton
                onClick={() => {
                  setDialogOpen(false);
                  setDialogAction(null);
                  setIsSaveDisabled(true);
                }}
              >
                {t("Cancel")}
              </GradientButton>
              <GradientButton
                onClick={() => {
                  setPhotoImageURL(activePhotoHist.CUST_PHOTO, "photo");
                  setPhotoImageURL(activePhotoHist.CUST_SIGN, "sign");
                  setDialogOpen(false);
                  setDialogAction(null);
                  setIsSaveDisabled(true);
                }}
              >
                {t("Ok")}
              </GradientButton>
            </DialogActions>
          </Dialog>
        )}
      </Grid>
      {!(componentIn && componentIn == "kycUpdate") && (
        <Grid container item sx={{ justifyContent: "flex-end" }}>
          <Button
            sx={{ mr: 2, mb: 2 }}
            color="secondary"
            variant="contained"
            disabled={isNextLoading}
            onClick={(e) => {
              handleColTabChangectx(state?.colTabValuectx - 1);
            }}
          >
            {t("Previous")}
          </Button>
          {SaveUpdateBTNs}
        </Grid>
      )}
    </>
  );
};

export const PhotoSignUpdateDialog = ({ open, onClose }) => {
  // const [open, setOpen] = useState(true)
  // const onClose = () => {
  //     setOpen(false)
  // }
  const [formMode, setFormMode] = useState<any>("view");
  const [isHistoryGridVisible, setIsHistoryGridVisible] =
    useState<boolean>(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [dialogAction, setDialogAction] = useState<
    "close" | "cancel" | "save" | null
  >(null);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const location: any = useLocation();
  let customerData = {};
  useEffect(() => {
    if (location.state && location.state.length > 0) {
      let data = location.state?.[0]?.data;
      customerData = data;
    }
  }, []);
  // console.log("skjvciwhecfvwrefv", location)
  const mutation: any = useMutation(API.updatePhotoSignData, {
    onSuccess: (data) => {
      // // console.log("photohistory", data)
      // setPhotoHistory(data)
      // let activeHistory = null
      // activeHistory = (data && data.length>0) && data.findLast(el => el.ACT_FLAG === "Y")
      // setActivePhotoHist(activeHistory)
      // // console.log("photohistory ac", activeHistory)
    },
    onError: (error: any) => {},
  });

  const onSave = () => {};

  // console.log("locationasdawd", location)
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
      <DialogTitle
        sx={{
          background: "var(--theme-color3)",
          color: "var(--theme-color2)",
          letterSpacing: "1.3px",
          margin: "10px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
          fontWeight: "light",
          borderRadius: "inherit",
          minWidth: "450px",
          py: 1,

          display: "flex",
          mx: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
        id="responsive-dialog-title"
      >
        <Typography variant="h6">{`Photo & Signature - ${location?.state?.[0]?.data?.CUSTOMER_NAME} - ${location?.state?.[0]?.id}`}</Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* <div style={{maxWidth: "150px", border: "1px solid #ddd", padding: "5px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "normal", userSelect: "none"}}>
                        EDIT
                    </div> */}
          {/* <GradientButton onClick={() => {}}>View All</GradientButton>
                    <GradientButton onClick={() => {}}>Edit</GradientButton> */}

          {/* <Button sx={{mr:2}} color="secondary" variant="contained" 
                    // disabled={isNextLoading}
                        // onClick={(e) => {
                        //     // handleColTabChangectx(0)
                        //     handleColTabChangectx(state?.colTabValuectx-1)
                        // }}
                    >View All</Button>
                    <Button sx={{mr:2}} color="secondary" variant="contained" 
                    // disabled={isNextLoading}
                        // onClick={handleSavePhotoSign}
                    >Edit</Button> */}
          {!isHistoryGridVisible && (
            <Button onClick={() => setIsHistoryGridVisible(true)}>
              {t("ViewHistory")}
            </Button>
          )}
          {isHistoryGridVisible && (
            <Button onClick={() => setIsHistoryGridVisible(false)}>
              {t("CloseHistory")}
            </Button>
          )}

          {formMode === "view" && (
            <Button onClick={() => setFormMode("edit")}>Edit</Button>
          )}
          {formMode === "edit" && (
            <Button disabled={isSaveDisabled}>Save</Button>
          )}

          {formMode === "edit" && (
            <Button
              onClick={() => {
                setFormMode("view");
                setDialogAction("cancel");
              }}
            >
              {t("Cancel")}
            </Button>
          )}
          {formMode === "view" && (
            <Button
              onClick={() => {
                setDialogAction(null);
                onClose();
              }}
            >
              {t("Close")}
            </Button>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "150px",
              maxHeight: "50px",
              border: "1px solid #ddd",
              padding: "5px 10px",
              borderRadius: "20px",
              fontSize: "10px",
              fontWeight: "normal",
              userSelect: "none",
            }}
          >
            {formMode === "view" ? "View Mode" : "Edit Mode"}
          </div>
        </div>
      </DialogTitle>
      <PhotoSignatureCpy
        componentIn={"kycUpdate"}
        formMode={formMode}
        setFormMode={setFormMode}
        isHistoryGridVisible={isHistoryGridVisible}
        setIsHistoryGridVisible={setIsHistoryGridVisible}
        isSaveDisabled={isSaveDisabled}
        setIsSaveDisabled={setIsSaveDisabled}
        dialogAction={dialogAction}
        setDialogAction={setDialogAction}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </Dialog>
  );
};

export default PhotoSignatureCpy;
