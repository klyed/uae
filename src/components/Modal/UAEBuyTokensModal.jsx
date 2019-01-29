import React from "react";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
import Close from "@material-ui/icons/Close";
import FileCopyOutlined from "@material-ui/icons/FileCopyOutlined";
// core components
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import { getContractAddress } from "api/etherscanApi";

import uaeBuyTokensModalStyle from "assets/jss/material-dashboard-pro-react/components/uaeBuyTokensModalStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class UAEBuyTokensModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this);
  }

  handleClose() {
    this.props.handleCloseModal();
  }

  handleCopyToClipboard(str) {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  render() {
    const { classes } = this.props;
    const contractAddress = getContractAddress();
    return (
      <div>
        <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal
          }}
          open={this.props.isModalOpen}
          transition={Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby="modal-slide-title"
          aria-describedby="modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <Button
              justIcon
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="transparent"
              onClick={() => this.handleClose()}
            >
              <Close className={classes.modalClose} />
            </Button>
            <h4 className={classes.modalTitle}>Buy DIC Tokens</h4>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={classes.modalBody}
          >
            <h5>
              To purchase DIC tokens please make payment to the following ETH
              address:
            </h5>
            <form>
              <CustomInput
                id="contractAddress"
                formControlProps={{
                  fullWidth: true,
                  variant: "outlined"
                }}
                inputProps={{
                  type: "text",
                  disabled: true,
                  value: contractAddress,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        color="rose"
                        size="sm"
                        className={classes.copyButton}
                        onClick={this.handleCopyToClipboard(contractAddress)}
                      >
                        <FileCopyOutlined className={classes.copyToClipboard} />
                        Copy
                      </Button>
                    </InputAdornment>
                  )
                }}
              />
            </form>
            <h5>
              <strong>NOTE: </strong>
              Minimum deposit is <strong>0.2 ETH!</strong> Any amount less than
              that will not be considered.
            </h5>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

UAEBuyTokensModal.propTypes = {
  classes: PropTypes.object.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired
};

export default withStyles(uaeBuyTokensModalStyle)(UAEBuyTokensModal);
