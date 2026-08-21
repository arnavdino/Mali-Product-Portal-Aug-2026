import { Theme } from "@mui/material";
import { closedWidth, drawerWidth } from "../../components/header";

export const upperSectionStyle = (open: boolean, theme: Theme): any => ({
    textAlign: "left",
    color:"white",
    position:"absolute",
    left: open ? `${drawerWidth + 12}px` : `${closedWidth + 12}px`,
    top:"80px",
  ...(open
    ? {
        transition: theme.transitions.create("left", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }
    : {
        transition: theme.transitions.create("left", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }),
      
  zIndex: "50000",
});
