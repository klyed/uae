import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import CardIcon from "components/Card/CardIcon.jsx";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
import PaymentIcon from "@material-ui/icons/Payment";
import AccountBalanceWallet from "@material-ui/icons/AccountBalanceWallet";
import Close from "@material-ui/icons/Close";
import Assignment from "@material-ui/icons/Assignment";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Table from "components/Table/Table.jsx";

// custom components
import UAEBuyTokensModal from "components/Modal/UAEBuyTokensModal.jsx";

import InputValidator from "tools/InputValidator";
import { getTokenBalance, getTxHistory } from "api/etherscanApi";

import uaeBuyTokensPageStyle from "assets/jss/material-dashboard-pro-react/views/uaeBuyTokensPageStyle.jsx";

class UAEBuyTokensPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimation: "cardHidden",
      addressCardAnimation: "cardHidden",
      tokenWalletAddressValid: "",
      tokenOwnerBalance: 0,
      txHistory: [[]],
      isModalOpen: false
    };
    this.handleBuyTokens = this.handleBuyTokens.bind(this);
    this.handleTokenAddressChange = this.handleTokenAddressChange.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function () {
        this.setState({
          cardAnimation: "",
          addressCardAnimation: "addressStatsCard"
        });
      }.bind(this),
      500
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }

  handleBuyTokens(e) {
    this.setState({ isModalOpen: true });
  }

  handleCloseModal(e) {
    this.setState({ isModalOpen: false });
  }

  handleTokenAddressChange(e) {
    this.setState({
      tokenOwnerBalance: 0,
      txHistory: [[]]
    });
    if (e.target.value === "") {
      this.setState({ tokenWalletAddressValid: "" });
    } else if (InputValidator.isEthereumAddress(e.target.value)) {
      this.setState({ tokenWalletAddressValid: "success" });
      getTokenBalance(e.target.value).then(balance => {
        this.setState({ tokenOwnerBalance: balance });
      });
      getTxHistory(e.target.value).then(txHistory => {
        this.setState({ txHistory: txHistory });
      });
    } else {
      this.setState({ tokenWalletAddressValid: "error" });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <UAEBuyTokensModal
          isModalOpen={this.state.isModalOpen}
          handleCloseModal={this.handleCloseModal}
        />
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={5}>
              <Card className={classes[this.state.cardAnimation]}>
                <CardHeader color="info" stats icon>
                  <Tooltip
                    id="tooltip-bottom"
                    title="Buy Tokens Panel"
                    placement="bottom"
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <CardIcon color="info">
                      <PaymentIcon />
                    </CardIcon>
                  </Tooltip>
                  <h3 className={classes.cardTitle}>1 DIC = 1 ETH</h3>
                </CardHeader>
                <CardBody>
                  <h4 className={classes.textCenter}>
                    Countdown until next price increase:
                  </h4>
                  <h3 className={classes.textCenter}>COUNTDOWN</h3>
                </CardBody>
                <CardFooter stats className={classes.justifyContentCenter}>
                  <div className={classes.textCenter}>
                    <Button
                      color="rose"
                      size="lg"
                      className={classes.buyTokensButton}
                      onClick={this.handleBuyTokens}
                    >
                      <PaymentIcon className={classes.icons} /> Buy Tokens
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={7}>
              <Card className={classes[this.state.addressCardAnimation]}>
                <CardHeader color="info" stats icon>
                  <Tooltip
                    id="tooltip-bottom"
                    title="Token Wallet Balance Panel"
                    placement="bottom"
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <CardIcon color="info">
                      <AccountBalanceWallet />
                    </CardIcon>
                  </Tooltip>
                  <h3 className={classes.cardTitle}>Token Wallet Balance</h3>
                </CardHeader>
                <CardBody>
                  <h5 className={classes.textCenter}>
                    Enter the ERC20 wallet address that you used to buy DIC
                    tokens:
                  </h5>
                  <form>
                    <CustomInput
                      success={this.state.tokenWalletAddressValid === "success"}
                      error={this.state.tokenWalletAddressValid === "error"}
                      labelText="Token Address *"
                      id="tokenAddress"
                      formControlProps={{
                        fullWidth: true,
                        classes: {
                          root: classes.customInputRoot
                        }
                      }}
                      inputProps={{
                        onChange: this.handleTokenAddressChange,
                        type: "text",
                        endAdornment:
                          this.state.tokenWalletAddressValid === "error" ? (
                            <InputAdornment position="end">
                              <Close className={classes.danger} />
                            </InputAdornment>
                          ) : (
                            undefined
                          )
                      }}
                    />
                  </form>
                </CardBody>
                <CardFooter stats className={classes.justifyContentCenter}>
                  <div className={classes.textCenter}>
                    <h3>
                      {"Current Balance: "}
                      {this.state.tokenOwnerBalance}
                      {" DIC"}
                    </h3>
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12}>
              <Card className={classes[this.state.cardAnimation]}>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <Assignment />
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>Transaction History</h4>
                </CardHeader>
                <CardBody>
                  <Table
                    hover
                    customClassesForCells={[0, 1, 2, 3]}
                    customCellClasses={[
                      classes.address,
                      classes.address,
                      classes.address,
                      classes.textCenter
                    ]}
                    tableHeaderColor="primary"
                    tableHead={[
                      "Transaction Id",
                      "From Address",
                      "To Address",
                      "Amount"
                    ]}
                    tableData={this.state.txHistory}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

UAEBuyTokensPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(uaeBuyTokensPageStyle)(UAEBuyTokensPage);
