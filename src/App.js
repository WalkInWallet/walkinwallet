import { useEffect, useCallback, useState, useMemo } from "react";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";
import { buildGallery } from "./3d/MapGenerator";
import { hangPaintings } from "./3d/PaintingDrawer";
import Scene from "./3d/Scene";
import "./App.css";

const App = () => {
  const { account } = useMoralisWeb3Api();
  const address = useMemo(
    () => "0xb251eF5A3d35776931805eb54C73E07B5BeC1632",
    []
  );

  const { isInitialized } = useMoralis();
  const [nfts, setNfts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [paintings, setPaintings] = useState([]);
  const [gallery, setGallery] = useState();
  const [ready, setReady] = useState(false);

  const fetchNFTs = useCallback(async () => {
    if (isInitialized) {
      let response = await account.getNFTs({
        chain: "matic",
        address: address,
      });

      setNfts(
        response.result.map((result) =>
          JSON.parse(result.metadata.replaceAll("\n", " "))
        )
      );
      setFetching(false);
    }
  }, [account, isInitialized, address]);

  useEffect(() => {
    setFetching(true);
    fetchNFTs();
  }, [fetchNFTs]);

  useEffect(() => {
    if (!fetching) {
      setGallery(buildGallery(address, nfts.length));
    }
  }, [nfts, address, fetching]);

  useEffect(() => {
    if (typeof gallery !== "undefined" && !fetching) {
      console.log(gallery, nfts);
      setPaintings(hangPaintings(address, gallery, nfts));
      setReady(true);
    }
  }, [address, gallery, nfts, fetching]);

  if (ready) {
    return <Scene gallery={gallery} paintings={paintings} />;
  } else {
    return null;
  }
};

export default App;
