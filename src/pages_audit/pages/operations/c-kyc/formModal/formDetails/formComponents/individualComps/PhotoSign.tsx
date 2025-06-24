import { useState, useEffect, useContext, useRef } from "react";
import { CkycContext } from "pages_audit/pages/operations/c-kyc/CkycContext";
import { AuthContext } from "pages_audit/auth";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useStyles } from "../../../style";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import TabNavigate from "../TabNavigate";
import {
  utilFunction,
  ActionTypes,
  transformFileObject,
} from "@acuteinfo/common-base";
const PhotoSign = () => {
  const {
    state,
    handleFormDataonSavectx,
    handlePhotoOrSignctx,
    handleStepStatusctx,
    handleModifiedColsctx,
    handleCurrFormctx,
    toNextTab,
  } = useContext(CkycContext);
  const { authState } = useContext(AuthContext);
  const classes = useStyles();
  const submitBtnRef = useRef<any | null>(null);
  const [filecnt, setFilecnt] = useState(0);
  const photoUploadControl = useRef<any | null>(null);
  const signUploadControl = useRef<any | null>(null);
  const fileName = useRef<any | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  // const headerClasses = useTypeStyles();

  const photoFileURL = useRef<any | null>(null);
  const photoFilesdata = useRef<any | null>(null);

  const signFileURL = useRef<any | null>(null);
  const signFilesdata = useRef<any | null>(null);
  const { t } = useTranslation();

  // console.log("locationnn..m", location)

  // useEffect(() => {
  //   setPhotoImageURL(state?.photoBase64ctx, "photo");
  //   photoFilesdata.current = state?.photoBase64ctx;
  //   setPhotoImageURL(state?.signBase64ctx, "sign");
  //   signFilesdata.current = state?.signBase64ctx;
  //   // handlePhotoOrSignctx(null, )
  // }, []);
  useEffect(() => {
    if (
      state?.formDatactx["PHOTO_MST"]?.CUST_PHOTO ||
      state?.formDatactx["PHOTO_MST"]?.CUST_SIGN
    ) {
      setPhotoImageURL(state?.formDatactx["PHOTO_MST"]?.CUST_PHOTO, "photo");
      photoFilesdata.current = state?.formDatactx["PHOTO_MST"]?.CUST_PHOTO;
      setPhotoImageURL(state?.formDatactx["PHOTO_MST"]?.CUST_SIGN, "sign");
      signFilesdata.current = state?.formDatactx["PHOTO_MST"]?.CUST_SIGN;
    } else if (
      state?.retrieveFormDataApiRes["PHOTO_MST"]?.CUST_PHOTO ||
      state?.retrieveFormDataApiRes["PHOTO_MST"]?.CUST_SIGN
    ) {
      setPhotoImageURL(
        state?.retrieveFormDataApiRes["PHOTO_MST"]?.CUST_PHOTO,
        "photo"
      );
      photoFilesdata.current =
        state?.retrieveFormDataApiRes["PHOTO_MST"]?.CUST_PHOTO;
      setPhotoImageURL(
        state?.retrieveFormDataApiRes["PHOTO_MST"]?.CUST_SIGN,
        "sign"
      );
      signFilesdata.current =
        state?.retrieveFormDataApiRes["PHOTO_MST"]?.CUST_SIGN;
    }
    // handlePhotoOrSignctx(null, )
  }, [
    state?.isFreshEntryctx["PHOTO_MST"],
    state?.retrieveFormDataApiRes["PHOTO_MST"],
  ]);

  // useEffect(() => {
  //     console.log("photo/sign change.. photoFilesdata, signFilesdata",
  //     Boolean(photoFilesdata.current), photoFilesdata.current?.length,
  //     Boolean(signFilesdata.current), signFilesdata.current?.length)
  // }, [photoFilesdata.current, signFilesdata.current])

  useEffect(() => {
    let refs = [handleSavePhotoSign];
    handleCurrFormctx({
      currentFormRefctx: refs,
      colTabValuectx: state?.colTabValuectx,
      currentFormSubmitted: null,
      isLoading: false,
    });
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

  // format object for save api on save&next button
  const handleSavePhotoSign = () => {
    console.log(
      "photo/sign change.. photoFilesdata, signFilesdata",
      Boolean(photoFilesdata.current),
      photoFilesdata.current?.length,
      Boolean(signFilesdata.current),
      signFilesdata.current?.length
    );
    // if(state?.isFreshEntryctx) {
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
    let newData = state?.formDatactx;
    newData["PHOTO_MST"] = { ...newData["PHOTO_MST"], ...data };
    handleFormDataonSavectx(newData);
    // } else
    if (!state?.isFreshEntryctx && state?.fromctx !== "new-draft") {
      // let newData = state?.formDatactx
      // let data = {
      //     CUST_PHOTO: state?.photoBase64ctx,
      //     CUST_SIGN: state?.signBase64ctx
      // }
      // newData["PHOTO_MST"] = {...newData["PHOTO_MST"], ...data}
      // handleFormDataonSavectx(newData)

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
    toNextTab();
    handleCurrFormctx({
      currentFormSubmitted: true,
      isLoading: false,
    });
  };

  const actions: ActionTypes[] = [];
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
            key={"tooltip-" + state?.formmodectx}
            title={"Click to upload the Photo Image"} // temp
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
                cursor: "pointer",
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
            key={"tooltip-" + state?.formmodectx}
            title={"Click to upload the Signature Image"} // temp
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
                cursor: "pointer",
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
                  src={Boolean(signFileURL.current) ? signFileURL.current : ""} //temp
                  style={{
                    maxWidth: "300px",
                    minWidth: "300px",
                    maxHeight: "190px",
                    minHeight: "190px",
                  }}
                />
              </Grid>
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
        </Grid>
      </Grid>
      <TabNavigate
        handleSave={handleSavePhotoSign}
        displayMode={state?.formmodectx ?? "new"}
      />
    </>
  );
};

export default PhotoSign;
