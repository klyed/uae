// ##############################
// // // UAEBuyTokensPage view styles
// #############################

import {
  container,
  cardTitle,
  dangerColor,
  infoColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const uaeBuyTokensPageStyle = theme => ({
  container: {
    ...container,
    zIndex: "4",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "100px"
    }
  },
  cardTitle: {
    ...cardTitle,
    color: "#000000"
  },
  textCenter: {
    textAlign: "center"
  },
  justifyContentCenter: {
    justifyContent: "center !important"
  },
  customButtonClass: {
    "&,&:focus,&:hover": {
      color: "#FFFFFF"
    },
    marginLeft: "5px",
    marginRight: "5px"
  },
  inputAdornment: {
    marginRight: "18px"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  cardHidden: {
    opacity: "0",
    transform: "translate3d(0, -60px, 0)"
  },
  cardHeader: {
    marginBottom: "20px"
  },
  socialLine: {
    padding: "0.9375rem 0"
  },
  icons: {
    width: "20px",
    height: "20px",
    fontSize: "20px",
    marginRight: "10px !important",
    marginBottom: "10px !important"
  },
  tooltip: {
    fontSize: "16px"
  },
  buyTokensButton: {
    textAlign: "center",
    borderRadius: "30px !important",
    fontSize: "18px"
  },
  addressStatsCard: {
    width: "650px !important"
  },
  danger: {
    color: dangerColor + "!important"
  },
  tokenWalletAddressInput: {
    color: infoColor + "!important"
  },
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
    float: "left"
  },
  customInputRoot: {
    marginBottom: "0px !important"
  }
});

export default uaeBuyTokensPageStyle;
