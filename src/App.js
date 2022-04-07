import axios from "axios";
import { useEffect, useCallback, useState } from "react";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";
import { buildGallery } from "./3d/MapGenerator";
import { hangPaintings } from "./3d/PaintingDrawer";
import Scene from "./3d/Scene";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { createUseStyles } from "react-jss";
import { Progress } from "antd";
import { FAQ, Welcome, Benefits } from "./pages";

const useStyles = createUseStyles({
  page: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  fullscreen: {
    height: "100%",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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

  const { isInitialized } = useMoralis();
  const [progress, setProgress] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(false);
  const [stage, setStage] = useState("Read wallet");
  const [nfts, setNfts] = useState();
  const [gallery, setGallery] = useState();
  const [paintings, setPaintings] = useState();
  const { address } = useParams();

  const classes = useStyles();

  const fetchNFTs = useCallback(async () => {
    let pictures = [];

    for (const network of ["eth", "polygon", "bsc"]) {
      try {
        const response = await account.getNFTs({
          chain: network,
          address: address,
          limit: 200,
        });

        pictures = [
          ...pictures,
          ...response.result.map((result) => ({ ...result, network: network })),
        ];
      } catch (error) {
        console.warn(`Failed to fetch NFTs from ${network} network`);
      }
    }

    setProgress(21);
    setStage("Collecting NFT metadata and read images");

    for (const picture of pictures) {
      if (
        picture.token_uri ===
        "https://api.opensea.io/api/v2/metadata/matic/0x2953399124F0cBB46d2CbACD8A89cF0599974963/0xb251ef5a3d35776931805eb54c73e07b5bec1632000000000000010000002710"
      ) {
        picture.metadata = JSON.stringify({
          name: "WalkInWallet Logo - 2021 Edition",
          description:
            "This is the WalkInWallet Logo of 2021 designed by Ines Opaska. Support WalkInWallet now and be rewarded later. We have a bag of features in mind and owners of the logo will have access to some rare functionalities in the future.",
          image: "./nfts/logo-2021-1024.png",
        });
      }

      if (picture.metadata === null && picture.token_uri !== null) {
        try {
          picture.metadata = JSON.stringify(
            (await axios.get(picture.token_uri, { timeout: 2000 })).data
          );
        } catch (error) {
          if (!error.response) {
            console.log(error.toJSON());
          } else if (error.response.status !== 404) {
            console.log(error.response.status);
            console.log(error);
          }
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
        typeof picture.image !== "undefined" && !picture.image.endsWith(".gif")
    );

    const rooms = buildGallery(address, pictures.length);
    setGallery(rooms);
    setNfts(pictures);
    hangPaintings(address, rooms, pictures);
    setStage("Rendering 3D gallery");
    setProgress(99);
  }, [account, address]);

  useEffect(() => {
    setNfts();
    setStage("Read wallet");
    setProgress(0);
    fetchNFTs();
  }, [fetchNFTs, address, isInitialized]);

  useEffect(() => {
    const fetchImage = async (url, withCorsProxy) => {
      let location = url;
      if (location.startsWith("ipfs://")) {
        location = location.replace(
          "ipfs://",
          "https://cloudflare-ipfs.com/ipfs/"
        );
      }

      if (location.startsWith("https://ipfs.io/")) {
        location = location.replace(
          "https://ipfs.io/",
          "https://cloudflare-ipfs.com/"
        );
      }

      if (location.startsWith("https://gateway.ipfs.io/")) {
        location = location.replace(
          "https://gateway.ipfs.io/",
          "https://cloudflare-ipfs.com/"
        );
      }

      if (withCorsProxy) {
        location = `https://us-central1-walkinwallet.cloudfunctions.net/api/proxy?url=${url}`;
      }

      try {
        const image = await axios.get(location, {
          responseType: "blob",
          timeout: 30000,
        });
        return { image: image.data, tryAgain: false };
      } catch (error) {
        if (error.response) {
          console.log(error.response);
          return {
            image: null,
            tryAgain:
              !withCorsProxy &&
              (error.response.status === 403 || error.response.status === 401),
          };
        } else {
          if (withCorsProxy) {
            console.log(error);
          }
          return {
            image: null,
            tryAgain: !withCorsProxy,
          };
        }
      }
    };

    if (sceneVisible && typeof nfts !== "undefined" && nfts.length > 0) {
      let fetchedPaintings = [];
      let stopFetching = false;

      const loadPaintings = async () => {
        const loadImage = (image, blob) =>
          new Promise((resolve, reject) => {
            image.addEventListener("load", () => {
              image.replaceWith(image.cloneNode(true));
              resolve(image);
            });
            image.addEventListener("error", (error) => {
              image.replaceWith(image.cloneNode(true));
              reject(error);
            });
            image.src = blob;
          });
        const htmlImage = document.createElement("img");

        for (const picture of nfts) {
          picture.link = `https://opensea.io/assets/${picture.token_address}/${picture.token_id}`;

          if (picture.network === "polygon") {
            picture.link = picture.link.replace("assets/", "assets/matic/");
          } else if (picture.network === "bsc") {
            picture.link = `https://treasureland.market/assets/${picture.token_address}/${picture.token_id}?chain_id=56`;
          }

          if (stopFetching || typeof picture.width !== "undefined") {
            return;
          }
          if (
            picture.image.startsWith("http") ||
            picture.image.startsWith("ipfs://")
          ) {
            let { image, tryAgain } = await fetchImage(picture.image, false);

            if (tryAgain) {
              const retry = await fetchImage(picture.image, true);
              image = retry.image;
            }
            if (!stopFetching) {
              setStage("Rendering 3D gallery");
              setProgress(99);
            }
            if (image !== null) {
              picture.image = URL.createObjectURL(image);
              picture.offline = false;
              htmlImage.src = picture.image;
              try {
                await loadImage(htmlImage, picture.image);

                const MAX_WIDTH = 768;
                const MAX_HEIGHT = 768;

                let width = htmlImage.naturalWidth;
                let height = htmlImage.naturalHeight;

                if (width > height) {
                  if (width > MAX_WIDTH) {
                    height = height * (MAX_WIDTH / width);
                    width = MAX_WIDTH;
                  }
                } else {
                  if (height > MAX_HEIGHT) {
                    width = width * (MAX_HEIGHT / height);
                    height = MAX_HEIGHT;
                  }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                const context = canvas.getContext("2d");
                context.drawImage(htmlImage, 0, 0, width, height);

                picture.width = width;
                picture.height = height;
                picture.image = canvas.toDataURL("image/jpeg", 1.0);

                canvas.remove();
              } catch (error) {
                picture.image = "./offline.png";
                picture.width = 1685;
                picture.height = 1685;
                picture.offline = true;
                console.log(error);
              }
            } else {
              console.log(
                `Unable to fetch image ${picture.image} using fallback image.`
              );
              picture.image = "./offline.png";
              picture.width = 1685;
              picture.height = 1685;
              picture.offline = true;
            }
          } else if (picture.image === "./nfts/logo-2021-1024.png") {
            await loadImage(htmlImage, "./nfts/logo-2021-1024.png");
            const canvas = document.createElement("canvas");

            const width = 1024;
            const height = 1024;

            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext("2d");
            context.drawImage(htmlImage, 0, 0, width, height);

            picture.width = width;
            picture.height = height;
            picture.image = canvas.toDataURL("image/jpeg", 1.0);

            canvas.remove();
            picture.offline = false;
          } else {
            picture.image = "./offline.png";
            picture.width = 1685;
            picture.height = 1685;
            picture.offline = true;
          }
          htmlImage.remove();
          fetchedPaintings = [...fetchedPaintings, picture];
          if (!stopFetching) {
            setPaintings(fetchedPaintings);
          }
        }
      };

      loadPaintings();

      return () => {
        stopFetching = true;
      };
    }
  }, [sceneVisible, nfts]);

  const onSceneReady = useCallback(() => setSceneVisible(true), []);

  if (typeof nfts !== "undefined" && typeof gallery !== "undefined") {
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

    return (
      <div className={classes.fullscreen}>
        <p style={{ display: sceneVisible ? "none" : "block" }}>{stage}</p>
        <Progress
          style={{ display: sceneVisible ? "none" : "block" }}
          type="circle"
          percent={progress}
        />
        <Scene
          onSceneReady={onSceneReady}
          isVisible={sceneVisible}
          gallery={gallery}
          paintings={paintings}
          nfts={nfts}
        />
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/:address" element={<Main />} />
      </Routes>
    </Router>
  );
};

export default App;
