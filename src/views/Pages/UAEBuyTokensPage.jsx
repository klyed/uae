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

import InputValidator from "tools/InputValidator";

import uaeBuyTokensPageStyle from "assets/jss/material-dashboard-pro-react/views/uaeBuyTokensPageStyle.jsx";

class UAEBuyTokensPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimation: "cardHidden",
      addressCardAnimation: "cardHidden",
      tokenWalletAddressValid: ""
    };
    this.handleBuyTokens = this.handleBuyTokens.bind(this);
    this.handleTokenAddressChange = this.handleTokenAddressChange.bind(this);
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

  handleBuyTokens() {
    alert("buying tokens!");
  }

  handleTokenAddressChange(e) {
    if (e.target.value === "") {
      this.setState({ tokenWalletAddressValid: "" });
    } else if (InputValidator.isEthereumAddress(e.target.value)) {
      this.setState({ tokenWalletAddressValid: "success" });
      //TODO: check stats here
    } else {
      this.setState({ tokenWalletAddressValid: "error" });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={4}>
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
                  <h3 className={classes.cardTitle}>1 TOKEN = 1 ETH</h3>
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
                      color="info"
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
          </GridContainer>
        </div>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={4}>
              <Card className={classes[this.state.addressCardAnimation]}>
                <CardHeader color="info" stats icon>
                  <Tooltip
                    id="tooltip-bottom"
                    title="Token Address Stats Panel"
                    placement="bottom"
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <CardIcon color="info">
                      <AccountBalanceWallet />
                    </CardIcon>
                  </Tooltip>
                  <h3 className={classes.cardTitle}>Token Wallet Stats</h3>
                </CardHeader>
                <CardBody>
                  <h5 className={classes.textCenter}>
                    Enter the ERC20 compatible wallet address that you used to
                    buy [TOKEN] tokens:
                  </h5>
                  <form>
                    <CustomInput
                      success={this.state.tokenWalletAddressValid === "success"}
                      error={this.state.tokenWalletAddressValid === "error"}
                      labelText="Token Address *"
                      id="tokenAddress"
                      formControlProps={{
                        fullWidth: true
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
                      InputProps={{
                        className: classes.tokenWalletAddressInput
                      }}
                    />
                  </form>
                </CardBody>
                <CardFooter stats className={classes.justifyContentCenter}>
                  <div className={classes.textCenter}>
                    <h3>Current Balance: 0 TOKENS</h3>
                    <GridContainer>
                      <GridItem xs={12}>
                        <Card>
                          <CardHeader color="info" icon>
                            <CardIcon color="info">
                              <Assignment />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>
                              Transaction History
                            </h4>
                          </CardHeader>
                          <CardBody>
                            <Table
                              tableHeaderColor="primary"
                              tableHead={[
                                "Transaction Id",
                                "From Address",
                                "To Address",
                                "Amount",
                                "Status"
                              ]}
                              tableData={[]}
                              coloredColls={[3]}
                              colorsColls={["primary"]}
                            />
                          </CardBody>
                        </Card>
                      </GridItem>
                    </GridContainer>
                  </div>
                </CardFooter>
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
