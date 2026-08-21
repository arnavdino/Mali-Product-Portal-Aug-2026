import Class from "better-classnames";
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { ProfileInfo, useAuth } from "../providers/auth";
import { FaCaretDown, FaCaretRight, FaUserCircle } from "react-icons/fa";
import Drawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSession } from "../providers/session";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

export const drawerWidth = 260;
export const closedWidth = 70;
export const Header: React.FC<ComponentPropsWithoutRef<"div">> = ({
  children,
}) => {
  const { logout, token, profile, setProfile, hasPermissions } = useAuth();
  const { open, setOpen } = useSession();
  const navigate = useNavigate();

  const theme = useTheme();
  useEffect(() => {
    if ((localStorage.getItem("i18nextLng") || []).length > 2) {
      i18next.changeLanguage("fr");
    }
  }, []);

  const Main = styled("main", {
    shouldForwardProp: (prop) => prop !== "open",
  })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    marginLeft: `${closedWidth}px`,

    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: `${drawerWidth}px`,
    }),
  }));

  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })<AppBarProps>(({ theme, open }) => ({
    width: `calc(100% - ${closedWidth}px)`,
    boxShadow: "none",
    ...(open
      ? {
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }
      : {
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }),
  }));

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "start",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
    height: 154,
  }));

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (
    <div className="relative overflow-hidden">
      <IconButton
        onClick={!open ? handleDrawerOpen : handleDrawerClose}
        className="  bg-green  main w-5 h-5 border border-solid drawer-opener"
        sx={{
          top: "146px",
          left: open ? `${drawerWidth - 12}px` : `${closedWidth - 12}px`,
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
        }}
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
      <AppBar position="fixed" open={open} className="bg-white">
        <Toolbar style={{ height: 78 }} className="bg-green">
          <div className="flex flex-row items-center ml-auto">
            {profile && <HeaderProfile profile={profile as ProfileInfo} />}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className="main-drawer"
        sx={{
          width: open ? drawerWidth : closedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : closedWidth,
            boxSizing: "border-box",
            borderColor: "#B9EA25",
            borderRightWidth: "3px",
            ...(open
              ? {
                  transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
                }
              : {
                  transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
                }),
          },
        }}
        variant="persistent"
        anchor="left"
        open={true}
      >
        <DrawerHeader className="bg-main relative" style={{ height: 154 }}>
          <div className="ml-auto mr-auto mt-auto mb-auto">
            <img src="/lime.svg" />
          </div>
        </DrawerHeader>
        <Divider className="green bg-green border-green h-1" />
        {open ? (
          <div className="bottom-height overflow-y-auto overflow-x-hidden style-2 ">
            {" "}
            <Item
              name="Dashboard"
              image="/home.svg"
              selectedImage="/home-selected.svg"
              subs={[]}
              link="/"
            />
            {hasPermissions({ action: "read", resource: "role" }) && (
              <Item
                name="Manage Roles"
                image="/role.svg"
                selectedImage="/role-selected.svg"
                subs={[
                  {
                    name: "Roles",
                    link: "/manage/roles",
                  },
                ]}
                link="/manage/roles"
              />
            )}
            {hasPermissions({ action: "read", resource: "user" }) && (
              <Item
                name="Manage Users"
                image="/users2.svg"
                selectedImage="/users.svg"
                subs={[
                  {
                    name: "Internal Users",
                    link: "/manage/users",
                  },
                  {
                    name: "Customers",
                    link: "/manage/customers",
                  },
                ]}
                link="/manage/users"
              />
            )}
            {hasPermissions({ action: "read", resource: "vendor" }) && (
              <Item
                name="Manage Vendors"
                image="/vendor.svg"
                selectedImage="/vendor2.svg"
                subs={[
                  {
                    name: "Vendors",
                    link: "/manage/vendors",
                  },
                ]}
                link="/manage/vendors"
              />
            )}
            {hasPermissions({ action: "read", resource: "warehouse" }) && (
              <Item
                name="Manage Warehouses"
                image="/warehouse.svg"
                selectedImage="/warehouse2.svg"
                subs={[
                  {
                    name: "Warehouse",
                    link: "/manage/warehouses",
                  },
                  {
                    name: "Warehouse Manager",
                    link: "/manage/managers",
                  },
                ]}
                link="/manage/warehouses"
              />
            )}
            {hasPermissions({ action: "read", resource: "product" }) && (
              <Item
                name="Manage Products"
                image="/products.svg"
                selectedImage="/products-selected.svg"
                subs={[
                  {
                    name: "Products",
                    link: "/products/products",
                  },
                  {
                    name: "Categories",
                    link: "/products/categories",
                  },
                  {
                    name: "Promotions",
                    link: "/products/promotions",
                  },
                ]}
                link="/products/products"
              />
            )}
            {hasPermissions({ action: "read", resource: "transactions" }) && (
              <Item
                name="Manage Transactions"
                image="/transactions.svg"
                selectedImage="/transactions-selected.svg"
                subs={[
                  {
                    name: "Transactions",
                    link: "/transactions/all",
                  },
                  {
                    name: "Create Transaction",
                    link: "/transactions/create",
                  },
                  {
                    name: "Transaction Refunds",
                    link: "/transactions/refunds",
                  },
                ]}
                link="/transactions/all"
                font="text-16"
              />
            )}
            <div
              className={" p-2 mt-10 cursor-pointer flex flex-row ml-6 mb-10 "}
              onClick={logout}
            >
              <img src="/logout.svg" className=" mr-4" />{" "}
              <span className="font-bold green ">Logout</span>
            </div>
          </div>
        ) : (
          <div className="bottom-height overflow-auto style-2 ml-3">
            <div className={" h-12 w-12 p-2 mb-4 cursor-pointer"}>
              <img
                src="/home.svg"
                onClick={() => {
                  handleDrawerOpen();
                  navigate("/");
                }}
              />
            </div>
            {hasPermissions({ action: "read", resource: "role" }) && (
              <div className={" h-12 w-12 p-2 mb-4 cursor-pointer"}>
                <img
                  src="/role.svg"
                  onClick={() => {
                    handleDrawerOpen();
                    navigate("/manage/roles");
                  }}
                />
              </div>
            )}
            {hasPermissions({ action: "read", resource: "user" }) && (
              <div className={" h-12 w-12 p-2 mb-4 cursor-pointer"}>
                <img
                  src="/union.svg"
                  onClick={() => {
                    handleDrawerOpen();
                    navigate("/manage/users");
                  }}
                />
              </div>
            )}

            {hasPermissions({ action: "read", resource: "product" }) && (
              <div className={" h-12 w-12 p-2 mb-4 cursor-pointer"}>
                <img
                  src="/products.svg"
                  onClick={() => {
                    handleDrawerOpen();
                    navigate("/products/products");
                  }}
                />
              </div>
            )}
            {hasPermissions({ action: "read", resource: "transactions" }) && (
              <div className={" h-12 w-12 p-2 pl-3 mb-4 cursor-pointer"}>
                <img
                  src="/transactions.svg"
                  onClick={() => {
                    handleDrawerOpen();
                    navigate("/transactions");
                  }}
                />
              </div>
            )}
            <div
              className={" h-12 w-12 p-2 mt-56 cursor-pointer"}
              onClick={logout}
            >
              <img src="/logout.svg" />
            </div>
          </div>
        )}
      </Drawer>
      <Main open={open} style={{ marginTop: 78 }}>
        {children}
      </Main>
    </div>
  );
};

const Item: React.FC<{
  name: string;
  link: string;
  image: string;
  selectedImage: string;
  font?: string;
  subs: { name: string; link: string }[];
}> = ({ name, link, image, subs, selectedImage, font = "text-16" }) => {
  const navigate = useNavigate();
  const selected =
    subs.find(({ link }) => window.location.pathname.includes(link)) ||
    window.location.pathname == link;
  return (
    <div className="text-left">
      <div
        className="flex flex-row cursor-pointer pl-4 py-2 w-full mt-2 items-center "
        onClick={() => {
          navigate(link);
        }}
      >
        <div
          style={{ height: 40, width: 40 }}
          className={
            selected
              ? "bg-green rounded-full p-2 shrink-0 flex felx-row justify-center items-center z-50"
              : " p-2"
          }
        >
          <img src={selected ? selectedImage : image} />
        </div>
        <div
          style={selected ? { height: 40 } : {}}
          className={
            selected
              ? "bg-green-fade w-full flex flex-row -ml-5 pl-5 items-center"
              : "flex flex-row w-full  items-center"
          }
        >
          <span className={`ml-2 font-extrabold green ${font} `}>{name}</span>
          {selected && subs.length ? (
            <FaCaretDown className="green ml-auto  mr-3" />
          ) : (
            <FaCaretRight className="green ml-auto mr-3" />
          )}
        </div>
      </div>
      {selected ? (
        <div className="ml-16">
          {subs.map((s) => {
            const subSelected = window.location.pathname.includes(s.link);
            return (
              <div
                style={{ height: 28 }}
                key={s.name}
                className={`green pl-3 rounded-l-xl font-bold my-4 cursor-pointer text-14 ${
                  subSelected ? "bg-green-fade flex items-center " : ""
                }`}
                onClick={() => navigate(s.link)}
              >
                {s.name}
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

const HeaderProfile: React.FC<{ profile: ProfileInfo }> = ({ profile }) => {
  const { logout, role } = useAuth();
  const toggleHidden = () => {
    setHidden(true);
  };
  const navigate = useNavigate();
  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target)) {
          setHidden(false);
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const [hidden, setHidden] = useState(false);
  const { i18n, t } = useTranslation(["main"]);
  const menuRef = useRef(null);
  const handleLanguageChange = (e: any) => {
    i18n.changeLanguage(e.target.value);
  };
  useOutsideAlerter(menuRef);
  return (
    <>
      <span
        className={` mr-8 cursor-pointer relative nice-font text-sm flex flex-row`}
      >
        <select
          className="mr-4 bg-green main outline-none"
          value={localStorage.getItem("i18nextLng") || "fr"}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
        </select>
        <div
          className="flex flex-row main"
          onClick={() => navigate(`manage/users/edit/${profile.id}`)}
        >
          <div className="flex flex-col">
            <span className="font-bold text-base">
              {profile.fname} {profile.lname}
            </span>
            <span className="font-bold text-xs">{role?.name}</span>
          </div>
          <FaUserCircle className="text-black text-3xl ml-2 mt-2" />
        </div>
      </span>
    </>
  );
};
