import { Menu, Button } from "antd";
import { Link } from "react-router-dom";
import { createUseStyles } from "react-jss";
import Account from "../components/Account";
import { useMoralis } from "react-moralis";

const useStyles = createUseStyles({
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    color: "white",
    "& video": {
      width: "100%",
      height: "100%",
      position: "absolute",
      objectFit: "cover",
      zIndex: -1,
    },
    "& img": {
      width: "100%",
      height: "100%",
      position: "absolute",
      objectFit: "cover",
      zIndex: -1,
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
    paddingTop: "10vh",
    width: "80%",
    alignSelf: "center",
    "& h1": {
      color: "white",
      textShadow: "1px 1px 3px black",
    },
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    padding: 4,
    "& p": {
      margin: 0,
      width: "80%",
      textAlign: "center",
      textShadow: "1px 1px 3px black",
    },
  },
  subtitle: {
    marginTop: 24,
    maxWidth: 700,
    textAlign: "center",
    textShadow: "1px 1px 3px black",
  },
  header: {
    background: "#ffffff",
    display: "flex",
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& > div": {
      width: 32,
      height: 32,
      background: "url(./logo.svg)",
      cursor: "pointer",
      backgroundSize: "cover",
    },
    "& > span": {
      color: "rgba(0, 0, 0, 0.85)",
      marginLeft: 6,
    },
  },
  space: {
    flexGrow: 1,
  },
  menu: {
    minWidth: 180,
  },
});

const WelcomePage = () => {
  const classes = useStyles();
  const { logout, isAuthenticated } = useMoralis();

  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <div className={classes.logo}>
          <div />
          <span>WalkInWallet</span>
        </div>
        <div className={classes.space} />
        <div className={classes.menu}>
          <Menu mode="horizontal">
            <Menu.Item disabled key="/about">
              <Link to="/about">About</Link>
            </Menu.Item>
            <Menu.Item disabled key="/roadmap">
              <Link to="/roadmap">Roadmap</Link>
            </Menu.Item>
          </Menu>
        </div>
        {isAuthenticated && (
          <Button
            className={classes.button}
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Button>
        )}
      </div>

      {/* <video loop autoPlay muted>
        <source src="./videos/walkinwallet.mp4" type="video/mp4" />
      </video> */}
      <img
        style={{ backgroundColor: "#909dad" }}
        src="background.png"
        alt="preview of a 3d wallet"
      />

      <div className={classes.content}>
        <h1>Let's walk in wallet</h1>
        <Account />
        <p className={classes.subtitle}>
          WalkInWallet will create a 3D gallery from the NFT's stored within
          your wallet on Binance Smart Chain, Ethereum Mainnet and Polygon
          Network.
        </p>
      </div>
      <footer className={classes.footer}>
        <p>Created by Fabian Bormann ©2021</p>
      </footer>
    </div>
  );
};

export default WelcomePage;
