import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import CardIcon from "components/Card/CardIcon.jsx";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "components/CustomButtons/Button.jsx";

// @material-ui/icons
import PaymentIcon from "@material-ui/icons/Payment";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import uaeBuyTokensPageStyle from "assets/jss/material-dashboard-pro-react/views/uaeBuyTokensPageStyle.jsx";

class UAEBuyTokensPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimation: "cardHidden"
    };
    this.handleBuyTokens = this.handleBuyTokens.bind(this);
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function () {
        this.setState({ cardAnimation: "" });
      }.bind(this),
      500
    );
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }

  handleBuyTokens(e) {
    alert("buying tokens!");
  }

  render() {
    const { classes } = this.props;
    return (
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
                <h4 className={classes.cardBody}>
                  Countdown until next price increase:
                </h4>
                <h3 className={classes.cardBody}>COUNTDOWN</h3>
              </CardBody>
              <CardFooter stats>
                <div className={classes.cardFooter}>
                  <Button
                    color="info"
                    size="lg"
                    className={classes.marginRight}
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
    );
  }
}

UAEBuyTokensPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(uaeBuyTokensPageStyle)(UAEBuyTokensPage);
