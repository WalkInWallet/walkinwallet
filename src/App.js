import axios from "axios";
import { useEffect, useCallback, useState } from "react";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";
import { buildGallery } from "./3d/MapGenerator";
import { hangPaintings } from "./3d/PaintingDrawer";
import Scene from "./3d/Scene";
import "./App.css";
import WelcomePage from "./pages/WelcomePage";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { createUseStyles } from "react-jss";
import { Button, Progress } from "antd";
import { LeftOutlined } from "@ant-design/icons";

const useStyles = createUseStyles({
  page: {
    height: "100vh",
  },
  fullscreen: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  controls: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  progress: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Main = (props) => {
  const { account } = useMoralisWeb3Api();
  const { user } = useMoralis();

  const { isInitialized } = useMoralis();
  const [progress, setProgress] = useState(false);
  const [stage, setStage] = useState("");
  const [nfts, setNfts] = useState();
  const navigate = useNavigate();

  const classes = useStyles();

  const loadImage = (image, blob) =>
    new Promise((resolve, reject) => {
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = blob;
    });

  const fetchNFTs = useCallback(async () => {
    if (
      isInitialized &&
      user &&
      user.attributes &&
      user.attributes.ethAddress
    ) {
      let pictures = [];

      for (const network of ["eth", "polygon", "bsc"]) {
        try {
          const response = await account.getNFTs({
            chain: network,
            address: user.attributes.ethAddress,
            limit: 200,
          });
          pictures = [...pictures, ...response.result];
        } catch (error) {
          console.warn(`Failed to fetch NFTs from ${network} network`);
        }
      }

      setProgress(20);
      setStage("Collecting NFT metadata and read images");

      for (const picture of pictures) {
        if (picture.metadata === null && picture.token_uri !== null) {
          try {
            picture.metadata = JSON.stringify(
              (await axios.get(picture.token_uri)).data
            );
          } catch (error) {
            console.log(error);
          }
        }
      }

      pictures = pictures
        .filter(
          (result) =>
            typeof result.metadata !== "undefined" && result.metadata !== null
        )
        .map((result) => ({
          ...result,
          ...JSON.parse(result.metadata.replaceAll("\n", " ")),
        }));

      for (let i = 0; i < pictures.length; i++) {
        if (
          typeof pictures[i].image === "undefined" &&
          pictures[i].hasOwnProperty("data")
        ) {
          pictures[i] = { ...pictures[i], ...pictures[i].data };
        }
      }

      pictures = pictures.filter(
        (picture) =>
          typeof picture.image !== "undefined" &&
          !picture.image.endsWith(".gif")
      );

      const fetchImage = async (url, withCorsProxy) => {
        let location = url;
        if (withCorsProxy) {
          location = `https://walkinwallet.herokuapp.com/${url}`;
        }

        try {
          const image = await axios.get(location, {
            responseType: "blob",
            timeout: 6000,
          });
          return image.data;
        } catch (error) {
          console.log(error);
          return null;
        }
      };

      let downloads = 0;
      for (const picture of pictures) {
        if (picture.image.startsWith("http")) {
          let image = await fetchImage(picture.image, false);

          if (image === null) {
            image = await fetchImage(picture.image, true);
          }

          if (image !== null) {
            picture.image = URL.createObjectURL(image);

            const htmlImage = document.createElement("img");

            htmlImage.src = picture.image;
            await loadImage(htmlImage, picture.image);

            picture.width = htmlImage.naturalWidth;
            picture.height = htmlImage.naturalHeight;

            htmlImage.remove();
          } else {
            console.log("Unable to fetch image " + picture.image);
          }

          downloads += 1;
          setProgress(
            Math.round((20 + downloads * (80 / pictures.length)) * 100) / 100
          );
        }
      }

      pictures = pictures.filter(
        (picture) =>
          picture.image.startsWith("data") || picture.image.startsWith("blob")
      );

      setNfts(pictures);
      setStage("");
      setProgress(100);
    }
  }, [account, isInitialized, user]);

  useEffect(() => {
    setNfts();
    setStage("Read wallet");
    setProgress(0);
    fetchNFTs();
  }, [fetchNFTs]);

  if (typeof nfts !== "undefined") {
    if (!user || !user.attributes || !user.attributes.ethAddress) {
      return (
        <div className={classes.page}>
          <p>Please login to start walking</p>
          <Link to="/">Go back</Link>
        </div>
      );
    } else if (nfts.length === 0) {
      return (
        <div className={classes.page}>
          <p>
            This wallet does not contain any NFT, or it is not a correct wallet
            address.
          </p>
          <Link to="/">Go back</Link>
        </div>
      );
    }
    const gallery = buildGallery(user.attributes.ethAddress, nfts.length);
    const paintings = hangPaintings(user.attributes.ethAddress, gallery, nfts);
    return (
      <div className={classes.fullscreen}>
        <div className={classes.controls}>
          <Button
            icon={<LeftOutlined />}
            ghost
            onClick={() => {
              navigate("/", { replace: true });
            }}
          >
            Back
          </Button>
        </div>
        <Scene gallery={gallery} paintings={paintings} />
      </div>
    );
  } else {
    return (
      <div className={classes.progress}>
        <p>{stage}</p>
        <Progress type="circle" percent={progress} />
      </div>
    );
  }
};

const App = () => {
  const { enableWeb3, isAuthenticated, isWeb3Enabled, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) {
      if (typeof window.ethereum === "undefined") {
        enableWeb3({ provider: "walletconnect" });
      } else {
        enableWeb3();
      }
    }
  }, [isAuthenticated, isWeb3EnableLoading, isWeb3Enabled, enableWeb3]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/about" element={<WelcomePage />} />
        <Route path="/roadmap" element={<WelcomePage />} />
        <Route path="/gallery" element={<Main />} />
      </Routes>
    </Router>
  );
};

export default App;
