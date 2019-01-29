import Pages from "layouts/Pages.jsx";
import RTL from "layouts/RTL.jsx";
import TMDashboard from "layouts/TMDashboard.jsx";

var indexRoutes = [
  { path: "/rtl", name: "RTL", component: RTL },
  { path: "/pages", name: "Pages", component: Pages },
  { path: "/", name: "Home", component: TMDashboard }
];

export default indexRoutes;
