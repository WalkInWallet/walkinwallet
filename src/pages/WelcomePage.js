import { Button, Card, Row, Col } from "antd";
import { createUseStyles } from "react-jss";
import Account from "../components/Account";
import { useMoralis } from "react-moralis";
import {
  HeartFilled,
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  MailOutlined,
} from "@ant-design/icons";

const useStyles = createUseStyles({
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "auto",
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
      backgroundColor: "white",
    },
  },
  content: {
    display: "flex",
    flexGrow: 1,
    paddingTop: "5vh",
    paddingBottom: "5vh",
    width: "95%",
    alignSelf: "center",
    "@media screen and (min-width: 800px)": {
      width: "80%",
    },
    "@media screen and (min-width: 576px)": {
      paddingTop: "10vh",
      paddingBottom: 0,
    },
    "& h1": {
      color: "white",
      textShadow: "1px 1px 3px black",
    },
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12284b",
    padding: 12,
    "& h2": {
      color: "white",
      marginBottom: 4,
    },
    "& > span": {
      borderBottom: "2px solid white",
      width: 32,
      marginTop: 4,
      marginBottom: 4,
    },
    "& p": {
      margin: 0,
      textAlign: "center",
      textShadow: "1px 1px 3px black",
    },
  },
  contact: {
    display: "flex",
    marginTop: 12,
    marginBottom: 12,
    "& > a": {
      marginLeft: 4,
      marginRight: 4,
      "& > span": {
        fontSize: "1.2rem",
        color: "white",
      },
    },
  },
  subtitle: {
    color: "#12284b",
    fontSize: 28,
    fontWeight: 600,
    "@media screen and (max-width: 576px)": {
      textAlign: "center",
    },
  },
  title: {
    color: "#27448d",
    fontSize: 20,
    fontWeight: 600,
    "@media screen and (max-width: 576px)": {
      textAlign: "center",
    },
  },
  header: {
    background: "rgba(255, 255, 255, 0.95)",
    display: "flex",
    padding: 12,
    boxShadow: "rgb(4 17 29 / 25%) 0px 0px 8px 0px",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& > div": {
      width: 32,
      height: 32,
      background: "url(./logo.png)",
      cursor: "pointer",
      backgroundSize: "cover",
    },
    "& > span": {
      color: "#12284b",
      fontWeight: "bolder",
      marginLeft: 4,
      marginTop: 4,
    },
  },
  space: {
    flexGrow: 1,
  },
  menu: {
    minWidth: 180,
  },
  card: {
    margin: 0,
    "@media screen and (max-width: 576px)": {
      margin: "0 auto",
    },
  },
});

const WelcomePage = () => {
  const classes = useStyles();
  const { logout, isAuthenticated } = useMoralis();

  const getEllipsisTxt = (str, n = 12) => {
    if (str) {
      return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
    }
    return "";
  };

  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <div className={classes.logo}>
          <div />
          <span>WalkInWallet</span>
        </div>
        <div className={classes.space} />
        {isAuthenticated && (
          <Button
            type="primary"
            className={classes.button}
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Button>
        )}
      </div>

      <img src="background.png" alt="preview of a 3d wallet" />
      <div className={classes.content}>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={12}>
            <p className={classes.subtitle}>
              Walk in wallets as you would walk in galleries
            </p>
            <p className={classes.title}>
              Login and start walking. No manual configuration required, NFT
              support for Binance Smart Chain, Ethereum Mainnet and Polygon
              Network
            </p>
          </Col>
          <Col xs={24} sm={12}>
            <Row gutter={[0, 24]}>
              <Col span={24}>
                <Card
                  className={classes.card}
                  title="Walk in your wallet"
                  style={{ maxWidth: 400 }}
                >
                  <Account />
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  className={classes.card}
                  title="Walk in public wallets"
                  style={{ maxWidth: 400 }}
                >
                  <a href="/#/0xb251ef5a3d35776931805eb54c73e07b5bec1632">
                    {getEllipsisTxt(
                      "0xb251ef5a3d35776931805eb54c73e07b5bec1632"
                    )}
                  </a>
                  <br />
                  <a href="/#/0xccc8d1306c35719cf6a101fdd64f91f5129fb80a">
                    {getEllipsisTxt(
                      "0xccc8d1306c35719cf6a101fdd64f91f5129fb80a"
                    )}
                  </a>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <footer className={classes.footer}>
        <h2>Contact</h2>
        <span />
        <div className={classes.contact}>
          <Button
            type="link"
            href="https://www.instagram.com/walkinwallet/"
            icon={<InstagramOutlined />}
            target="_blank"
          />
          <Button
            type="link"
            href="https://www.instagram.com/walkinwallet/"
            icon={<FacebookOutlined />}
            target="_blank"
          />
          <Button
            type="link"
            href="https://www.instagram.com/walkinwallet/"
            icon={<TwitterOutlined />}
            target="_blank"
          />
          <Button
            type="link"
            href="https://www.instagram.com/walkinwallet/"
            icon={<LinkedinOutlined />}
            target="_blank"
          />
          <Button
            type="link"
            href="mailto:contact@walkinwallet.com"
            icon={<MailOutlined />}
            target="_blank"
          />
        </div>
        <p>
          Created with <HeartFilled /> by WalkInWallet ©2021
        </p>
      </footer>
    </div>
  );
};

export default WelcomePage;
