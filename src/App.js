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
} from "react-router-dom";

const Main = (props) => {
  const { account } = useMoralisWeb3Api();
  const { address } = useParams();

  const { isInitialized } = useMoralis();
  const [nfts, setNfts] = useState();

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

      pictures = pictures
        .filter(
          (result) =>
            typeof result.metadata !== "undefined" && result.metadata !== null
        )
        .map((result) => ({
          ...result,
          ...JSON.parse(result.metadata.replaceAll("\n", " ")),
        }));

      for (const picture of pictures) {
        if (picture.image.startsWith("http")) {
          try {
            const image = await axios.get(picture.image, {
              responseType: "blob",
              timeout: 2000,
            });
            picture.image = URL.createObjectURL(image.data);
          } catch (error) {
            console.log("Unable to fetch image " + picture.image);
          }
        }
      }

      pictures = pictures.filter(
        (picture) =>
          picture.image.startsWith("data") || picture.image.startsWith("blob")
      );

      setNfts(pictures);
    }
  }, [account, isInitialized, address]);

  useEffect(() => {
    setNfts();

    fetchNFTs();
  }, [fetchNFTs]);

  if (typeof nfts !== "undefined") {
    if (nfts.length === 0) {
      return (
        <>
          <p>
            This wallet does not contain any NFT, or it is not a correct wallet
            address.
          </p>
          <Link to="/">Go back</Link>
        </>
      );
    }
    const gallery = buildGallery(address, nfts.length);
    const paintings = hangPaintings(address, gallery, nfts);
    return <Scene gallery={gallery} paintings={paintings} />;
  } else {
    return null;
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
