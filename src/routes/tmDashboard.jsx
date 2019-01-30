import Wizard from "views/Forms/Wizard.jsx";
import TimelinePage from "views/Pages/Timeline.jsx";

// @material-ui/icons
import MonetizationOnOutlined from "@material-ui/icons/MonetizationOnOutlined";
import HourglassEmptyOutlined from "@material-ui/icons/HourglassEmptyOutlined";

var dashboardRoutes = [
  {
    path: "/token",
    name: "ERC Token Generator",
    icon: MonetizationOnOutlined,
    component: Wizard
  },
  {
    path: "/ico-timeline",
    name: "ICO Planning Timeline",
    icon: HourglassEmptyOutlined,
    component: TimelinePage
  }
];
export default dashboardRoutes;
