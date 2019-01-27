import UAEBuyTokensPage from "views/Pages/UAEBuyTokensPage.jsx";

// @material-ui/icons
import PaymentIcon from "@material-ui/icons/Payment";

const pagesRoutes = [
  {
    path: "/pages/buy-tokens",
    name: "Buy Tokens",
    short: "Buy",
    mini: "BT",
    icon: PaymentIcon,
    component: UAEBuyTokensPage
  },
  {
    redirect: true,
    path: "/pages",
    pathTo: "/pages/buy-tokens",
    name: "Buy Tokens"
  }
];

export default pagesRoutes;
