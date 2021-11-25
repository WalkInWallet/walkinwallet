//import { useEffect, useCallback } from "react";
//import { useMoralisWeb3Api, useMoralis } from "react-moralis";
import { buildGallery } from "./3d/MapGenerator";
import Scene from "./3d/Scene";
import "./App.css";

const App = () => {
  /*const { account } = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();

  const fetchNFTs = useCallback(async () => {
    if (isInitialized) {
      const nfts = await account.getNFTs({
        chain: "matic",
        address: "0xb251eF5A3d35776931805eb54C73E07B5BeC1632",
      });

      console.log(nfts);
    }
  }, [account, isInitialized]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);*/

  const nfts = 44;
  const address = "0xb251eF5A3d35776931805eb54C73E07B5BeC1632";

  const gallery = buildGallery(address, nfts);

  return <Scene gallery={gallery} />;
};

export default App;
