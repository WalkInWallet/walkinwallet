import axios from "axios";
import { useEffect, useCallback, useState } from "react";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";
import { buildGallery } from "./3d/MapGenerator";
import { hangPaintings } from "./3d/PaintingDrawer";
import Scene from "./3d/Scene";
import "./App.css";
import WelcomePage from "./pages/WelcomePage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { createUseStyles } from "react-jss";
import { message, Progress } from "antd";

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
  const { user } = useMoralis();

  const { isInitialized } = useMoralis();
  const [progress, setProgress] = useState(false);
  const [hasViewPermissions, setHasViewPermissions] = useState(false);
  const [requestedPermissions, setRequestedPermissions] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(false);
  const [stage, setStage] = useState("");
  const [nfts, setNfts] = useState();
  const [gallery, setGallery] = useState();
  const [paintings, setPaintings] = useState();
  const [galleryVisibility, setGalleryVisibility] = useState("private");
  const [userInfosNotCollected, setUserInfosNotCollected] = useState(true);
  const [userLinkSecret, setUserLinkSecret] = useState("");
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
        pictures = [...pictures, ...response.result];
      } catch (error) {
        console.warn(`Failed to fetch NFTs from ${network} network`);
      }
    }

    setProgress(21);
    setStage("Collecting NFT metadata and read images");

    for (const picture of pictures) {
      if (picture.metadata === null && picture.token_uri !== null) {
        try {
          picture.metadata = JSON.stringify(
            (await axios.get(picture.token_uri)).data
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
    if (hasViewPermissions) {
      setNfts();
      setStage("Read wallet");
      setProgress(0);
      fetchNFTs();
    }
  }, [fetchNFTs, address, hasViewPermissions, isInitialized]);

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

    if (
      hasViewPermissions &&
      sceneVisible &&
      typeof nfts !== "undefined" &&
      nfts.length > 0
    ) {
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
                picture.width = htmlImage.naturalWidth;
                picture.height = htmlImage.naturalHeight;
              } catch (error) {
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
  }, [sceneVisible, nfts, hasViewPermissions]);

  useEffect(() => {
    if (
      userInfosNotCollected &&
      isInitialized &&
      user &&
      user.attributes &&
      user.attributes.ethAddress &&
      user.attributes.ethAddress.toLowerCase() === address.toLowerCase()
    ) {
      axios
        .get("https://us-central1-walkinwallet.cloudfunctions.net/api/infos", {
          headers: {
            "x-user-message": encodeURI(
              user.attributes.authData.moralisEth.data
            ),
            "x-user-signature": encodeURI(
              user.attributes.authData.moralisEth.signature
            ),
          },
        })
        .then((response) => {
          setUserLinkSecret(response.data.secret);
          setGalleryVisibility(response.data.visibility);
        })
        .catch((error) => {
          console.warn("WalkInWallet backend is currently not available.");
          console.warn(error);
        })
        .finally(() => {
          setUserInfosNotCollected(false);
        });
    }
  }, [isInitialized, user, address, userInfosNotCollected]);

  useEffect(() => {
    if (
      isInitialized &&
      user &&
      user.attributes &&
      user.attributes.ethAddress &&
      user.attributes.ethAddress.toLowerCase() === address.toLowerCase()
    ) {
      setHasViewPermissions(true);
    } else if (isInitialized) {
      setRequestedPermissions(false);
      axios
        .get(
          `https://us-central1-walkinwallet.cloudfunctions.net/api/v2/check/${address}`
        )
        .then((response) => {
          setHasViewPermissions(response.data.allowed);
        })
        .catch((error) => {
          message.warn(
            "Failed to fetch wallet permissions. Please try again later and/or send us a mail to contact@walkinwallet.com"
          );
          console.warn(error);
        })
        .finally(() => setRequestedPermissions(true));
    } else {
      setHasViewPermissions(false);
    }
  }, [isInitialized, user, address]);

  const onSceneReady = useCallback(() => setSceneVisible(true), []);

  if (requestedPermissions && !hasViewPermissions) {
    return (
      <div className={classes.page}>
        <p>
          This wallet is not marked as a public wallet. Please login to start
          walking if it's yours.
        </p>
        <Link to="/">Go back</Link>
      </div>
    );
  }

  if (
    typeof nfts !== "undefined" &&
    hasViewPermissions &&
    typeof gallery !== "undefined"
  ) {
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
          userLinkSecret={userLinkSecret}
          galleryVisibility={galleryVisibility}
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
        <Route path="/:address" element={<Main />} />
      </Routes>
    </Router>
  );
};

export default App;
