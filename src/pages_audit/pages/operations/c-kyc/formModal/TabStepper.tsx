import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import { CkycContext } from "../CkycContext";
import { tabPanelClasses } from "@mui/base";
import { Icon } from "@mui/material";
import * as Icons from "@mui/icons-material";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = [
  "Personal Details",
  "KYC",
  "Declaration",
  "Related Person Details",
  "Other Details",
  "Other Address",
  "NRI Details",
  "Attestation",
];

export default function TabStepper() {
  const { state, handleColTabChangectx } = React.useContext(CkycContext);

  const QontoConnector = styled(StepConnector)(({ theme }) => {
    // console.log("{stepConnectorClasses", stepConnectorClasses)
    return {
      [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: "calc(-50% + 16px)",
        right: "calc(50% + 16px)",
      },
      [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: theme.palette.grey[500],
        },
      },
      [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          // borderColor: '#784af4',
          borderColor: "var(--theme-color3)",
        },
      },
      [`& .${stepConnectorClasses.line}`]: {
        borderColor:
          theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
        borderTopWidth: 3,
        borderRadius: 1,
      },
    };
  });

  const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
    ({ theme, ownerState }) => ({
      color:
        theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
      display: "flex",
      height: 22,
      fontSize: 12,
      alignItems: "center",
      "& .QontoStepIcon-circle": {
        color: theme.palette.grey[500],
        ...(ownerState.active && {
          color: theme.palette.grey[600],
          span: {
            fontSize: 32,
          },
        }),
      },
      "& .QontoStepIcon-completedIcon": {
        // color: '#784af4',
        color: "var(--theme-color1)",
        // color: "red",
        zIndex: 1,
        fontSize: 28,
        fontWeight: "bold",
        ...(ownerState.active && {
          span: {
            fontSize: 32,
          },
        }),
      },
      "& .QontoStepIcon-redcircle": {
        color: "#d02e2e",
        ...(ownerState.active && {
          span: {
            fontSize: 32,
          },
        }),
      },
    })
  );

  function QontoStepIcon(props: StepIconProps) {
    const { active, completed, error, className } = props;
    let IconsComp: { [index: string]: any } = {};
    // console.log("wekudiwuegfiwe", state?.tabNameList)
    state?.tabNameList.forEach((tabEl, i) => {
      // console.log('dwoeff', tabEl)
      IconsComp[i + 1] = Icons[tabEl.icon] ?? Icons["HowToReg"];
    });
    const AppIcon = IconsComp[String(props.icon)];
    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {error ? (
          <div className="QontoStepIcon-redcircle">
            <AppIcon fontSize="large" />
          </div>
        ) : completed ? (
          // <Check className="QontoStepIcon-completedIcon" />
          <div className="QontoStepIcon-completedIcon">
            <AppIcon fontSize="large" />
          </div>
        ) : (
          <div className="QontoStepIcon-circle">
            <AppIcon fontSize="large" />
          </div>
        )}
      </QontoStepIconRoot>
    );
  }
  const steps = state?.tabNameList.filter((tab) => tab.isVisible);

  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={state?.colTabValuectx}
        connector={<QontoConnector />}
      >
        {steps.map((tabEl, i) => {
          // if(tabEl.isVisible) {
          // console.log("qwdQDW",)
          return (
            <Step
              sx={{}}
              key={tabEl.tabName}
              completed={state?.steps?.[i]?.status == "completed"}
            >
              <StepLabel
                error={state?.steps?.[i]?.status == "error"}
                sx={{ cursor: "pointer" }}
                StepIconComponent={QontoStepIcon}
                // onClick={() => {
                //   handleColTabChangectx(i);
                // }}
              >
                {tabEl.tabName}
              </StepLabel>
            </Step>
          );
          // }
        })}
      </Stepper>
      {/* <Stepper alternativeLabel activeStep={1} connector={<ColorlibConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper> */}
    </Stack>
  );
}
