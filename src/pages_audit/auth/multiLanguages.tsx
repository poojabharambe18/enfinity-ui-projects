import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import india from "assets/images/india.png";
import chinese from "assets/images/china.png";
import english from "assets/images/united-states.png";
import spanish from "assets/images/spain.png";
import french from "assets/images/france.png";
import { useStyles } from "./style";
import { FormControl, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { AuthSDK } from "registry/fns/auth";
export const MultiLanguages = () => {
  const classes = useStyles();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.resolvedLanguage);
  const handleChange = (event) => {
    let languageCode = event.target.value;
    setLanguage(languageCode);
    Cookies.set("enfinity.cbs.i18n.language.set.code", languageCode);
    i18n.changeLanguage(languageCode);
    AuthSDK.setDisplayLanguage(i18n.resolvedLanguage);
  };

  useEffect(() => {
    let languageCode = Cookies.get("enfinity.cbs.i18n.language.set.code");
    if (languageCode) {
      i18n.changeLanguage(languageCode);
    }
    AuthSDK.setDisplayLanguage(i18n.resolvedLanguage);
    setLanguage(i18n.resolvedLanguage);
  }, []);
  return (
    <>
      <FormControl
        sx={{
          ml: 1.4,
          "&:hover": {
            letterSpacing: "0.5px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            transition: "all 0.4s ease 0s",
            fontWeight: "800",
          },
        }}
        size="small"
      >
        <Select
          disableUnderline
          variant="standard"
          value={language}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          sx={{
            width: "100px",
            margin: "7px",
            "& .MuiInput-input": {
              display: "contents",
            },
            "& .MuiSelect-icon": {
              paddingBottom: "4px",
            },
          }}
        >
          <MenuItem
            style={{
              display: "flex",
            }}
            value="en"
          >
            <div key="Language" style={{ display: "flex" }}>
              <img src={english} alt="" className={classes.lang_svg} />
            </div>
            English
          </MenuItem>
          <MenuItem
            value="guj"
            style={{
              display: "flex",
            }}
          >
            <div key="Language" style={{ display: "flex" }}>
              <img src={india} alt="" className={classes.lang_svg} />
            </div>
            ગુજરાતી
          </MenuItem>
          {/*<MenuItem
            value="sp"
            style={{
              display: "flex",
            }}
          >
            <div key="Language" style={{ display: "flex" }}>
              <img src={spanish} alt="" className={classes.lang_svg} />
            </div>
            española
          </MenuItem>

          <MenuItem
            value="fr"
            style={{
              display: "flex",
            }}
          >
            <div key="Language" style={{ display: "flex" }}>
              <img src={french} alt="" className={classes.lang_svg} />
            </div>
            Français
          </MenuItem> */}
          {/* <MenuItem
            value="chinese"
            style={{
              display: "flex",
            }}
          >
            <div key="" style={{ display: "flex" }}>
              <img src={chinese} alt="" className={classes.lang_svg} />
            </div>
            Chinese
          </MenuItem> */}
        </Select>
      </FormControl>
    </>
  );
};
