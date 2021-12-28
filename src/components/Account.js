import { useMoralis } from "react-moralis";
import { useEffect, useRef } from "react";

import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import Blockie from "./Blockie";
import { createUseStyles } from "react-jss";
import axios from "axios";

const useStyles = createUseStyles({
  account: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    cursor: "pointer",
  },
  text: {
    color: "#00d7b9",
  },
  button: {
    minWidth: 220,
    marginBottom: 6,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    "& > canvas": {
      marginRight: 6,
    },
  },
});

const Account = () => {
  const { authenticate, isAuthenticated, user, isAuthenticating } =
    useMoralis();
  const wasAuthenticating = useRef(false);

  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isAuthenticating && wasAuthenticating.current) {
      axios
        .post(
          "https://us-central1-walkinwallet.cloudfunctions.net/api/v2/login",
          {},
          {
            headers: {
              "x-user-message": encodeURI(
                user.attributes.authData.moralisEth.data
              ),
              "x-user-signature": encodeURI(
                user.attributes.authData.moralisEth.signature
              ),
            },
          }
        )
        .catch((error) => {
          console.warn("WalkInWallet backend is currently not available.");
          console.warn(error);
        });
    }

    if (isAuthenticating && !wasAuthenticating.current) {
      wasAuthenticating.current = true;
    } else if (!isAuthenticating && wasAuthenticating) {
      wasAuthenticating.current = false;
    }
  }, [isAuthenticating, isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <Button
        size="large"
        type="primary"
        danger
        className={classes.button}
        onClick={async () => {
          try {
            if (typeof window.ethereum !== "undefined") {
              await authenticate({
                signingMessage:
                  'Welcome to WalkInWallet! This a client webapp which does not store any of your data online. The only database entry we will create is about the sharing options of your gallery which can be "accessable via link", "public", or "private" (default). We wish you a lot of fun while walking!',
              });
            } else {
              await authenticate({
                provider: "walletconnect",
                signingMessage:
                  'Welcome to WalkInWallet! This a client webapp which does not store any of your data online. The only database entry we will create is about the sharing options of your gallery which can be "accessable via link", "public", or "private" (default). We wish you a lot of fun while walking!',
              });
            }
          } catch (error) {
            message.warn(
              "The login is currently not available. Please check the login on another device, try it again later or/and send a mail to contact@walkinwallet.com."
            );
          }
        }}
      >
        Connect with MetaMask
      </Button>
    );
  }

  const getEllipsisTxt = (str, n = 6) => {
    if (str) {
      return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
    }
    return "";
  };

  return (
    <>
      <div className={classes.account}>
        <Button
          size="large"
          type="primary"
          className={classes.button}
          icon={<Blockie address={user.attributes.ethAddress} scale={3} />}
          onClick={() => {
            navigate(`/${user.attributes.ethAddress}`, { replace: true });
          }}
        >
          {`${getEllipsisTxt(user.attributes.ethAddress)}`}
        </Button>
      </div>
    </>
  );
};

export default Account;
