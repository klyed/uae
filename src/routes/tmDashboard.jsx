import Wizard from "views/Forms/Wizard.jsx";
import TimelinePage from "views/Pages/Timeline.jsx";
import Dashboard from "views/Dashboard/Dashboard.jsx";

// @material-ui/icons
import MonetizationOnOutlined from "@material-ui/icons/MonetizationOnOutlined";
import HourglassEmptyOutlined from "@material-ui/icons/HourglassEmptyOutlined";
import DashboardOutlined from "@material-ui/icons/DashboardOutlined";
import BuildOutlined from "@material-ui/icons/BuildOutlined";

var dashboardRoutes = [
  {
    path: "/token",
    name: "ERC Token Generator",
    icon: MonetizationOnOutlined,
    component: Wizard
  },
  {
    path: "/ico",
    name: "ICO Generator",
    icon: BuildOutlined,
    component: Wizard
  },
  {
    path: "/ico-dashboard",
    name: "ICO Dashboard",
    icon: DashboardOutlined,
    component: Dashboard
  },
  {
    path: "/ico-timeline",
    name: "ICO Planning Timeline",
    icon: HourglassEmptyOutlined,
    component: TimelinePage
  }
];
export default dashboardRoutes;
