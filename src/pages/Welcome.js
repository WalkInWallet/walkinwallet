import { useState } from "react";
import { Button, Card, Row, Col, Input } from "antd";

import { createUseStyles } from "react-jss";
import Blockie from "../components/Blockie";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const { Search } = Input;

const useStyles = createUseStyles({
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflowY: "auto",
    color: "white",
    "& > img": {
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
    "@media screen and (min-width: 768px)": {
      paddingTop: "10vh",
      paddingBottom: 0,
    },
    "& h1": {
      color: "white",
      textShadow: "1px 1px 3px black",
    },
  },
  subtitle: {
    color: "#12284b",
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 0,
    "@media screen and (max-width: 768px)": {
      textAlign: "center",
    },
  },
  title: {
    color: "#27448d",
    marginTop: 24,
    marginBottom: 24,
    fontSize: 18,
    fontWeight: 500,
    "@media screen and (max-width: 768px)": {
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
    "@media screen and (max-width: 768px)": {
      margin: "0 auto",
    },
  },
  links: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 48,
    "@media screen and (max-width: 768px)": {
      marginTop: 48,
      marginBottom: 24,
    },
  },
  link: {
    margin: "0 12px",
    "& button": {
      minWidth: 110,
    },
    "& span": {
      padding: "0 6px",
    },
  },
  search: {
    maxWidth: "40vw",
    "@media screen and (max-width: 768px)": {
      maxWidth: "80vw",
      marginBottom: 12,
      marginTop: 12,
    },
  },
  address: {
    "@media screen and (max-width: 768px)": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 32,
    },
  },
});

const Welcome = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

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
      </div>

      <img src="background.png" alt="preview of a 3d wallet" />
      <div className={classes.content}>
        <Row
          gutter={[{ xs: 0, sm: 24 }, 0]}
          style={{ justifyContent: "center" }}
        >
          <Col sm={24} md={14} className={classes.address}>
            <p className={classes.subtitle}>
              Walk in wallets as you would walk in galleries
            </p>
            <p className={classes.title}>
              Enter a wallet or contract address and start walking. No manual
              configuration required, NFT support for Binance Smart Chain,
              Ethereum Mainnet and Polygon Network
            </p>
            <Search
              placeholder="0xaBc0123..."
              allowClear
              enterButton="Enter"
              size="large"
              className={classes.search}
              onChange={(event) => setAddress(event.target.value)}
              onSearch={() => {
                window.location.href = `/${address}`;
              }}
              onPressEnter={() => {
                window.location.href = `/${address}`;
              }}
            />
          </Col>
          <Col sm={24} md={10}>
            <Row gutter={[0, 24]}>
              <Col span={24}>
                <Card
                  className={classes.card}
                  onClick={() => {
                    window.location.href =
                      "/0xb251ef5a3d35776931805eb54c73e07b5bec1632";
                  }}
                  hoverable
                  cover={<img alt="example" src="./example_wallet.png" />}
                  style={{ maxWidth: 400, width: 300 }}
                >
                  <Card.Meta
                    title="Visit our Demo Gallery"
                    avatar={
                      <Blockie address="0xb251ef5a3d35776931805eb54c73e07b5bec1632" />
                    }
                    description={
                      <a href="/0xb251ef5a3d35776931805eb54c73e07b5bec1632">
                        {getEllipsisTxt(
                          "0xb251ef5a3d35776931805eb54c73e07b5bec1632"
                        )}
                      </a>
                    }
                  />
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <div className={classes.links}>
              <div className={classes.link}>
                <Button
                  style={{ borderRadius: 0 }}
                  size="large"
                  type="primary"
                  onClick={() => {
                    navigate("/faq", { replace: true });
                  }}
                  danger
                >
                  FAQ
                </Button>
              </div>
              <div className={classes.link}>
                <Button
                  style={{ borderRadius: 0 }}
                  size="large"
                  type="primary"
                  onClick={() => {
                    navigate("/benefits", { replace: true });
                  }}
                  danger
                >
                  Benefits
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Footer />
    </div>
  );
};

export default Welcome;
