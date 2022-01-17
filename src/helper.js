import { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";

const useSharedStyles = createUseStyles({
  fullscreen: {
    height: "100%",
    overflowY: "auto",
    position: "relative",
    "& > img": {
      width: "100%",
      height: "100%",
      position: "absolute",
      objectFit: "cover",
      zIndex: -1,
      filter: "blur(21px)",
      backgroundColor: "white",
    },
  },
  header: {
    background: "rgb(255, 255, 255)",
    display: "flex",
    padding: 12,
    position: "fixed",
    width: "100%",
    boxShadow: "rgb(4 17 29 / 25%) 0px 0px 8px 0px",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    "& > div": {
      width: 32,
      height: 32,
      background: "url(./WalkInWallet_Arrow_Small.png)",
      transform: "scaleX(-1)",
      backgroundSize: "contain",
    },
    "& > span": {
      color: "#12284b",
      fontWeight: "bolder",
      marginLeft: 4,
      marginTop: 4,
    },
  },
  content: {
    marginTop: 72,
    marginBottom: 24,
    width: "80%",
    margin: "0 auto",
  },
  section: {
    textDecoration: "underline",
    paddingLeft: 48,
    backgroundImage: "url(./walkinwallet_logo_90.png)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "2.5rem",
    lineHeight: "2.5rem",
    backgroundPositionY: "center",
  },
  subsection: {
    paddingLeft: 36,
    backgroundImage: "url(./walkinwallet_diamond_45.png)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "2rem",
    lineHeight: "2rem",
    backgroundPositionY: "center",
  },
  link: {
    color: "#ef2f6d",
    cursor: "pointer",
  },
});

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};

const getWindowDimensions = () => {
  const { innerWidth, innerHeight, screen } = window;
  const width = Math.max(screen.width, innerWidth);
  const height = Math.max(screen.height, innerHeight);

  return { width, height };
};

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

export { useLocalStorage, useWindowDimensions, useSharedStyles };
