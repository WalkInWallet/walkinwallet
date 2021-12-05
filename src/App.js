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
  useParams,
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
  const { address } = useParams();

  const { isInitialized } = useMoralis();
  const [progress, setProgress] = useState(false);
  const [stage, setStage] = useState("");
  const [nfts, setNfts] = useState();
  const navigate = useNavigate();

  const classes = useStyles();

  const fetchNFTs = useCallback(async () => {
    if (isInitialized) {
      let pictures = [];

      for (const network of ["eth", "polygon", "bsc"]) {
        try {
          const response = await account.getNFTs({
            chain: network,
            address: address,
            limit: 200,
          });
          pictures = [...pictures, ...response.result];
        } catch (error) {
          console.warn(`Failed to fetch NFTs from ${network} network`);
        }
      }

      setProgress(20);
      setStage("Collecting NFT metadata and read images");

      pictures = pictures
        .filter(
          (result) =>
            typeof result.metadata !== "undefined" && result.metadata !== null
        )
        .map((result) => ({
          ...result,
          ...JSON.parse(result.metadata.replaceAll("\n", " ")),
        }));

      pictures = pictures.filter(
        (picture) =>
          typeof picture.image !== "undefined" &&
          !picture.image.endsWith(".gif")
      );
      console.log(pictures);

      let downloads = 0;
      for (const picture of pictures) {
        if (picture.image.startsWith("http")) {
          try {
            const image = await axios.get(
              `http://localhost:3005/${picture.image}`,
              {
                responseType: "blob",
                timeout: 2000,
              }
            );

            picture.image = URL.createObjectURL(image.data);
          } catch (error) {
            console.log("Unable to fetch image " + picture.image);
          } finally {
            downloads += 1;
            setProgress(
              Math.round((20 + downloads * (80 / pictures.length)) * 100) / 100
            );
          }
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
  }, [account, isInitialized, address]);

  useEffect(() => {
    setNfts();
    setStage("Read wallet");
    setProgress(0);
    fetchNFTs();
  }, [fetchNFTs]);

  if (typeof nfts !== "undefined") {
    if (nfts.length === 0) {
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
    const gallery = buildGallery(address, nfts.length);
    const paintings = hangPaintings(address, gallery, nfts);
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
  //"0xb251eF5A3d35776931805eb54C73E07B5BeC1632"
  //"0x10a2dfb788a57587e6dead219fb2829b8ead9d7b"

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/about" element={<WelcomePage />} />
        <Route path="/roadmap" element={<WelcomePage />} />
        <Route path="/:address" element={<Main />} />
      </Routes>
    </Router>
  );
};

export default App;
