import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  FC,
  CSSProperties,
} from "react";
import { useQuery } from "react-query";
import * as API from "../../../../api";
import { CkycContext } from "pages_audit/pages/operations/c-kyc/CkycContext";
import { AuthContext } from "pages_audit/auth";
import {
  Button,
  CircularProgress,
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
import { transformFileObject, utilFunction } from "@acuteinfo/common-base";
import { useSnackbar } from "notistack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useStyles } from "../../../style";
import { useTranslation } from "react-i18next";

// const useTypeStyles = makeStyles((theme) => ({
//     title: {
//       flex: "1 1 100%",
//       color: "var(--theme-color1)",
//       textAlign: "center",
//     },
//     typography: {
//       flex: "1 1 100%",
//       color: "var(--theme-color1)",
//       textAlign: "left",
//     },
//     refreshiconhover: {},
// }));

const PhotoSignatureCpy: FC = () => {
  const {
    state,
    handleFormDataonSavectx,
    handleColTabChangectx,
    handlePhotoOrSignctx,
    handleStepStatusctx,
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

  const [fileSelected, setFileSelected] = useState(false);

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

  useEffect(() => {
    async function getImageURL() {
      // console.log("async called", state?.photoBase64ctx)
      let photoBlob = utilFunction.base64toBlob(
        state?.photoBase64ctx,
        "image/png"
      );
      photoFileURL.current =
        typeof state?.photoBlobctx === "object" && Boolean(state?.photoBlobctx)
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
  }, []);

  // set image url by getting response in base64, convert to blob;
  const setPhotoImageURL = async (filedata, img: string) => {
    if (filedata !== null) {
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

  const customTransformFileObj = (currentObj) => {
    return transformFileObject({})(currentObj);
  };
  const setImageData = async (blob, img: string) => {
    // console.log("kwqdiuqhiuwqgdeqweq blob", blob)
    let base64 = await utilFunction.convertBlobToBase64(blob);
    // console.log("kwqdiuqhiuwqgdeqweq base64", base64)
    if (img === "photo") {
      photoFilesdata.current = base64?.[1];
    } else if (img === "sign") {
      signFilesdata.current = base64?.[1];
    }
    // console.log("aqdqwedqwedqwe", blob, base64, img)
    if (base64) {
      handlePhotoOrSignctx(blob, base64?.[1], img);
    }
  };
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

  const formMode = "edit";

  const handleSavePhotoSign = () => {
    let data = {
      IsNewRow: true,
      COMP_CD: authState?.companyID ?? "",
      ENTERED_BRANCH_CD: authState?.user?.branchCode ?? "",
      REQ_CD: state?.req_cd_ctx,
      //   SR_CD:"3",
      SIGN_GROUP: "2",
      FROM_LIMIT: "2",
      TO_LIMIT: "2",
      REQ_FLAG: "F",
      ACT_FLAG: "F",
      CUST_PHOTO: photoFilesdata.current,
      CUST_SIGN: signFilesdata.current,
      ENT_COMP_CD: authState?.companyID ?? "",
      ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
    };

    let newData = state?.formDatactx;
    newData["PHOTO_MST"] = { ...newData["PHOTO_MST"], ...data };
    handleFormDataonSavectx(newData);
    handleStepStatusctx({
      status: "completed",
      coltabvalue: state?.colTabValuectx,
    });
    handleColTabChangectx(state?.colTabValuectx + 1);
  };

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

        {/* {fileSelected && filesdata.length > 0 ? (
                      <PhotoDialog
                        open={fileSelected}
                        onClose={handleProfileUploadClose}
                        files={filesdata}
                        // userID={userID}
                      />
                    ) : null} */}

        <Grid container item sx={{ justifyContent: "flex-end" }}>
          <Button
            sx={{ mr: 2, mb: 2 }}
            color="secondary"
            variant="contained"
            disabled={isNextLoading}
            onClick={(e) => {
              // handleColTabChangectx(0)
              handleColTabChangectx(state?.colTabValuectx - 1);
            }}
          >
            {t("Previous")}
          </Button>
          <Button
            sx={{ mr: 2, mb: 2 }}
            color="secondary"
            variant="contained"
            disabled={isNextLoading}
            onClick={handleSavePhotoSign}
          >
            {t("SaveandNext")}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

// const style = ({ disabled }): CSSProperties => ({
//     pointerEvents: disabled ? "none" : "all",
//     opacity: disabled ? 0.5 : 1,
// });
// const PhotoDialog = ({open, onClose, files}) => {
//     const classes = useStyles();
//     const editor = useRef<any>(null);
//     const [zoom, setZoomValue] = useState<number>(1);
//     const [rotate, setRotate] = useState<number>(0);
//     const handleChange = (event: any, newValue: number | number[]) => {
//         setZoomValue(newValue as number);
//     };
//     const handleRotateChange = (event: any, newValue: number | number[]) => {
//         setRotate(newValue as number);
//     };

//     return (
//         <Dialog
//             open= {true} //{open}
//             //@ts-ignore
//             TransitionComponent={Transition}
//             fullWidth={false}
//         >
//             <DialogTitle>Upload Profile Photo</DialogTitle>
//             <DialogContent>
//                 <div
//                     style={style({ disabled: false })}
//                     className={classes.uploadWrapper}
//                 >
//                     {filesdata.length > 0 ? (
//                         <>
//                         <Grid
//                             container
//                             spacing={0}
//                             justifyContent="center"
//                             alignItems="center"
//                         >
//                             <Grid item xs={9} md={9} sm={9}>
//                             <AvatarEditor
//                                 ref={editor}
//                                 image={fileURL.current}
//                                 width={250}
//                                 height={250}
//                                 border={[10, 10]}
//                                 scale={zoom}
//                                 borderRadius={150}
//                                 rotate={rotate}
//                             />
//                             </Grid>
//                             <Grid item xs={9} md={9} sm={9}>
//                             <div>
//                                 <Typography>Zoom:</Typography>
//                                 <Slider
//                                     value={zoom}
//                                     onChange={handleChange}
//                                     aria-labelledby="continuous-slider"
//                                     color="secondary"
//                                     defaultValue={1}
//                                     step={0.1}
//                                     min={0.2}
//                                     max={3}
//                                 />
//                             </div>
//                             </Grid>
//                             <Grid item xs={9} md={9} sm={9}>
//                             <Typography>Rotate :</Typography>

//                             <Slider
//                                 value={rotate}
//                                 onChange={handleRotateChange}
//                                 aria-labelledby="continuous-slider"
//                                 color="secondary"
//                                 defaultValue={0}
//                                 step={1}
//                                 min={0}
//                                 max={360}
//                             />
//                             </Grid>
//                         </Grid>
//                         </>
//                     ) : (
//                         <Typography>File not found</Typography>
//                     )}
//                 </div>
//             </DialogContent>
//             <DialogActions>
//                 <GradientButton disabled={mutation.isLoading} onClick={onClose}>
//                     Close
//                 </GradientButton>
//                 {filesdata.length > 0 ? (
//                     <GradientButton
//                         disabled={mutation.isLoading}
//                         endIcon={mutation.isLoading ? <CircularProgress size={20} /> : null}
//                         onClick={async (e) => {
//                         console.log("editor.current", editor.current)
//                         if (Boolean(editor.current)) {
//                             const canvasScaled = editor.current.getImageScaledToCanvas();
//                             console.log("editor.current, canvasScaled", canvasScaled)
//                             canvasScaled.toBlob(async (blob) => {
//                             console.log("editor.current, canvasScaled - blob", blob)
//                             let imageData: any = await utilFunction.convertBlobToBase64(
//                                 blob
//                             );
//                             console.log("editor.current, canvasScaled - imageData", imageData)
//                             mutation.mutate({
//                                 userID: userID,
//                                 imageData: imageData[1],
//                                 blob: blob,
//                             });
//                             }, filesdata?.[0]?.mimeType ?? "image/png");
//                         }
//                         }}
//                     >
//                         Update
//                     </GradientButton>
//                 ) : null}
//             </DialogActions>
//         </Dialog>
//     )
// }

export default PhotoSignatureCpy;
