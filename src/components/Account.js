import { useMoralis } from "react-moralis";

import { Button, Skeleton } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Blockies from "react-blockies";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  account: {
    padding: 24,
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

const Blockie = (props) => {
  const { account } = useMoralis();

  console.log(account);

  if (!props.address && !account) return <Skeleton.Avatar active size={40} />;

  return (
    <Blockies
      seed={
        props.currentWallet
          ? account.toLowerCase()
          : props.address.toLowerCase()
      }
      className="identicon"
      {...props}
    />
  );
};

const Account = () => {
  const {
    authenticate,
    isAuthenticated,
    logout,
    account,
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
  } = useMoralis();

  const [address, setAddress] = useState();
  const classes = useStyles();
  const navigate = useNavigate();

  console.log(isAuthenticated, account);
  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
  }, [isAuthenticated, isWeb3EnableLoading, isWeb3Enabled, enableWeb3]);

  useEffect(() => {
    setAddress(account);
  }, [account]);

  if (!isAuthenticated) {
    return (
      <Button
        size="large"
        className={classes.button}
        ghost
        onClick={() =>
          authenticate({ signingMessage: "Welcome to walkinwallet!" })
        }
      >
        Connect with MetaMask
      </Button>
    );
  }

  const getEllipsisTxt = (str, n = 4) => {
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
          className={classes.button}
          ghost
          icon={<Blockie currentWallet scale={3} />}
          onClick={() => {
            navigate(`/${address}`, { replace: true });
          }}
        >
          {`Visit ${getEllipsisTxt(account)}`}
        </Button>
        <Button
          size="large"
          className={classes.button}
          ghost
          onClick={() => {
            logout();
          }}
        >
          Disconnect Wallet
        </Button>
      </div>
    </>
  );
};

export default Account;
