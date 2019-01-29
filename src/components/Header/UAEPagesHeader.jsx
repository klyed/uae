import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";

// logo image
import merkleBlueLogo from "assets/img/dic-fam-logo.png";

import uaePagesHeaderStyle from "assets/jss/material-dashboard-pro-react/components/uaePagesHeaderStyle.jsx";

class UAEPagesHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.setState({ open: false });
    }
  }
  render() {
    const { classes, color } = this.props;
    const appBarClasses = cx({
      [" " + classes[color]]: color
    });
    return (
      <AppBar position="static" className={classes.appBar + appBarClasses}>
        <Toolbar className={classes.container}>
          <Hidden smDown>
            <div className={classes.flex}>
              <img src={merkleBlueLogo} alt="Company Logo" />
            </div>
          </Hidden>
          <Hidden mdUp>
            <div className={classes.flex}>
              <img src={merkleBlueLogo} alt="Company Logo" />
            </div>
          </Hidden>
          <h3 className={classes.text}>DIC Token Crowdsale</h3>
        </Toolbar>
      </AppBar>
    );
  }
}

UAEPagesHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"])
};

export default withStyles(uaePagesHeaderStyle)(UAEPagesHeader);
