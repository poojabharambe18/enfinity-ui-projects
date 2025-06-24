import { useRef, useState, useEffect, useContext } from "react";
import {
  Grid,
  Typography,
  Divider,
  Skeleton,
  Collapse,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
// import {
//     kyc_proof_of_address_meta_data,
//     kyc_proof_of_identity_meta_data,
// } from './metadata/individual/kycdetails';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import { GridWrapper } from 'components/dataTableStatic/gridWrapper';
// import { DocumentGridMetaData } from './metadata/individual/personaldetails';
import { useTranslation } from "react-i18next";
import { CkycContext } from "../../../../CkycContext";
import { AuthContext } from "pages_audit/auth";
import { useQuery } from "react-query";
import * as API from "../../../../api";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { transformFileObject, utilFunction } from "@acuteinfo/common-base";
import { useSnackbar } from "notistack";

const PhotoSignature = () => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
  //  const myGridRef = useRef<any>(null);
  const { t } = useTranslation();
  const { state, handleFormDataonSavectx, handleColTabChangectx } =
    useContext(CkycContext);
  const [isPoIExpanded, setIsPoIExpanded] = useState(true);
  const [isPoAExpanded, setIsPoAExpanded] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const KyCPoIFormRef = useRef<any>("");
  const KyCPoAFormRef = useRef<any>("");
  const NextBtnRef = useRef<any>("");
  const { authState } = useContext(AuthContext);
  const [currentTabFormData, setCurrentTabFormData] = useState({
    proof_of_identity: {},
    proof_of_address: {},
  });
  const { enqueueSnackbar } = useSnackbar();
  const [filecnt, setFilecnt] = useState(0);
  let formMode: any = "edit";
  const fileUploadControl = useRef<any | null>(null);
  const fileSignUploadControl = useRef<any | null>(null);
  const submitBtnRef = useRef<any | null>(null);
  const fileURL = useRef<any | null>(null);
  const fileSignURL = useRef<any | null>(null);
  const filesdata = useRef<any | null>(null);
  const filesSigndata = useRef<any | null>(null);
  const fileName = useRef<any | null>(null);
  const fileSignName = useRef<any | null>(null);

  // useEffect(() => {
  //   setInterval(() => {
  //     console.log("asdasdewqdw", filesdata, fileSignName)
  //   },5000)
  // }, [])

  const setImageData = async (blob) => {
    let base64 = await utilFunction.convertBlobToBase64(blob);
    filesdata.current = base64?.[1];
  };

  const setSignImageData = async (blob) => {
    let base64 = await utilFunction.convertBlobToBase64(blob);
    fileSignName.current = base64?.[1];
  };

  const customTransformFileObj = (currentObj) => {
    return transformFileObject({})(currentObj);
  };

  const setImageURL = async (filedata) => {
    if (filedata !== null) {
      let blob = utilFunction.base64toBlob(filedata, "image/png");
      fileURL.current =
        typeof blob === "object" && Boolean(blob)
          ? await URL.createObjectURL(blob as any)
          : null;
      setFilecnt(filecnt + 1);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
    if (filesArray.length > 0) {
      let resdata = filesArray.map((one) => customTransformFileObj(one));
      if (resdata.length > 0) {
        let filesObj: any = await Promise.all(resdata);

        let fileExt = filesObj?.[0]?.fileExt?.toUpperCase();
        if (fileExt === "JPG" || fileExt === "JPEG" || fileExt === "PNG") {
          let fileSize = filesObj?.[0]?.size / 1024 / 1024;

          if (fileSize <= 5) {
            fileURL.current =
              typeof filesObj?.[0]?.blob === "object" &&
              Boolean(filesObj?.[0]?.blob)
                ? await URL.createObjectURL(filesObj?.[0]?.blob as any)
                : null;
            setImageData(filesObj?.[0]?.blob);

            fileName.current = filesObj?.[0]?.blob?.name;
            //submitBtnRef.current?.click?.();
            setFilecnt(filecnt + 1);
          } else {
            enqueueSnackbar("Image size should be less than 5 MB.", {
              variant: "warning",
            });
          }
        } else {
          enqueueSnackbar("Please Select Valid Format.", {
            variant: "warning",
          });
        }
      }
    }
  };
  const handleSignFileSelect = async (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
    if (filesArray.length > 0) {
      let resdata = filesArray.map((one) => customTransformFileObj(one));
      if (resdata.length > 0) {
        let filesObj: any = await Promise.all(resdata);

        let fileExt = filesObj?.[0]?.fileExt?.toUpperCase();
        if (fileExt === "JPG" || fileExt === "JPEG" || fileExt === "PNG") {
          let fileSize = filesObj?.[0]?.size / 1024 / 1024;

          if (fileSize <= 5) {
            fileSignURL.current =
              typeof filesObj?.[0]?.blob === "object" &&
              Boolean(filesObj?.[0]?.blob)
                ? await URL.createObjectURL(filesObj?.[0]?.blob as any)
                : null;
            setSignImageData(filesObj?.[0]?.blob);

            fileSignName.current = filesObj?.[0]?.blob?.name;
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

  //   useEffect(() => {
  //     if (Boolean(result?.data?.[0]?.CARD_IMAGE)) {
  //       setImageURL(result?.data?.[0]?.CARD_IMAGE);
  //       filesdata.current = result?.data?.[0]?.CARD_IMAGE;
  //     }
  //   }, [result?.data?.[0]?.CARD_IMAGE]);

  //    useEffect(() => {
  //     console.log("asdfweafdw",currentTabFormData)
  //    }, [currentTabFormData])

  const handleSavePhotoSign = () => {
    let data = {
      IsNewRow: true,
      COMP_CD: authState?.companyID ?? "",
      ENTERED_BRANCH_CD: authState?.user?.branchCode ?? "",
      REQ_CD: state?.req_cd_ctx,
      // SR_CD:"3",
      SIGN_GROUP: "2",
      FROM_LIMIT: "2",
      TO_LIMIT: "2",
      REQ_FLAG: "F",
      ACT_FLAG: "F",
      CUST_PHOTO: filesdata.current,
      CUST_SIGN: fileSignName.current,
      ENT_COMP_CD: authState?.companyID ?? "",
      ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
    };

    let newData = state?.formDatactx;
    newData["PHOTO_MST"] = { ...newData["PHOTO_MST"], ...data };
    handleFormDataonSavectx(newData);
    handleColTabChangectx(state?.colTabValuectx + 1);
    // handleStepStatusctx({status: "completed", coltabvalue: state?.colTabValuectx})
  };

  return (
    <Grid container rowGap={3}>
      <Grid container></Grid>

      <Grid
        item
        xs={12}
        sm={6}
        md={6}
        style={{ padding: "0px 10px 10px 20px" }}
      >
        {formMode === "edit" || formMode === "add" ? (
          <>
            <Typography
              //   className={headerClasses.typography}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              {t("Note")}
            </Typography>
            <Typography
              //   className={headerClasses.typography}
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

      <Grid container>
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
              formMode === "view" || formMode === "confirm"
                ? ""
                : "Click to upload the Card Image"
            }
            placement={"top"}
            arrow={true}
          >
            <div
              // className={classes.uploadWrapper}
              style={{
                // maxWidth: "50%",
                width: "50%",
                height: "190px",
                background: "#cfcfcf",
                cursor:
                  formMode === "edit" || formMode === "add"
                    ? "pointer"
                    : "auto",
                margin: "10px",
                padding: "4px",
              }}
              ref={submitBtnRef}
              key={"div" + filecnt}
            >
              <Grid
                container
                spacing={0}
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src={Boolean(fileURL.current) ? fileURL.current : ""}
                  style={{
                    maxWidth: "300px",
                    minWidth: "300px",
                    maxHeight: "190px",
                    minHeight: "190px",
                  }}
                />
              </Grid>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => fileUploadControl?.current?.click()}
              >
                {t("UploadPhoto")}
              </Button>
              <input
                name="fileselect"
                type="file"
                style={{ display: "none" }}
                ref={fileUploadControl}
                onChange={(event) => handleFileSelect(event)}
                accept="image/*"
                onClick={(e) => {
                  //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                  //@ts-ignore
                  e.target.value = "";
                }}
              />
            </div>
          </Tooltip>
        </Grid>

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
              formMode === "view" || formMode === "confirm"
                ? ""
                : "Click to upload the Card Image"
            }
            placement={"top"}
            arrow={true}
          >
            <div
              // className={classes.uploadWrapper}
              style={{
                width: "50%",
                height: "190px",
                background: "#cfcfcf",
                cursor:
                  formMode === "edit" || formMode === "add"
                    ? "pointer"
                    : "auto",
                margin: "10px",
                padding: "4px",
              }}
              ref={submitBtnRef}
              key={"div" + filecnt}
            >
              <Grid
                container
                spacing={0}
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src={Boolean(fileSignURL.current) ? fileSignURL.current : ""}
                  style={{
                    maxWidth: "300px",
                    minWidth: "300px",
                    maxHeight: "190px",
                    minHeight: "190px",
                  }}
                />
              </Grid>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => fileSignUploadControl?.current?.click()}
              >
                {t("UploadSignature")}
              </Button>
              <input
                name="fileselect"
                type="file"
                style={{ display: "none" }}
                ref={fileSignUploadControl}
                onChange={(event) => handleSignFileSelect(event)}
                accept="image/*"
                onClick={(e) => {
                  //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                  //@ts-ignore
                  e.target.value = "";
                }}
              />
            </div>
          </Tooltip>
        </Grid>
      </Grid>

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
  );
};

export default PhotoSignature;
