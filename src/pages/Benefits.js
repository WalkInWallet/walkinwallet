import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useSharedStyles } from "../helper";

const Benefits = () => {
  const classes = useSharedStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.fullscreen}>
      <img src="background.png" alt="preview of a 3d wallet" />

      <div className={classes.header}>
        <div
          onClick={() => {
            navigate("/", { replace: true });
          }}
          className={classes.logo}
        >
          <div />
          <span>WalkInWallet</span>
        </div>
      </div>
      <div className={classes.content}>
        <h1>3 REASONS TO USE WALKINWALLET</h1>
        <h2 className={classes.section}>
          The new NFT experience for you and your audience.
        </h2>
        <h3 className={classes.subsection}>Part of the web3 journey.</h3>
        <p>Join our world and take a walk in NFT wallets.</p>
        <p>
          Revolutionized NFT interaction. Upgrade from simple lists to a fully
          immersive 3D experience.
        </p>
        <p>
          Let our algorithm do its magic: Your gallery is unique and knows no
          limits.
        </p>

        <h2 className={classes.section}>
          Generate and discover collections beyond your imagination.
        </h2>
        <h3 className={classes.subsection}>Create & get noticed.</h3>
        <p>Add a spatial experience to your NFTs.</p>
        <p>
          Exhibitions of any type and scale to showcase your entire collection.
        </p>
        <p>
          Surprise your audience and get noticed by sharing your gallery in a
          interactive format.
        </p>

        <h3 className={classes.subsection}>Explore & get inspired.</h3>
        <p>Visit public NFT 3D galleries.</p>
        <p>Get inspired as an artist or visitor.</p>
        <p>Search for NFT art to buy as a collector.</p>

        <h2 className={classes.section}>
          No Effort. No Costs. Just simple, safe and always accessible.
        </h2>
        <h3 className={classes.subsection}>Simple and free of charge.</h3>
        <p>1-Click connection with your wallet.</p>
        <p>Save on complex and pricy gallery building.</p>
        <p>Get immediate results and walk through your collection.</p>

        <h3 className={classes.subsection}>Safe and sound.</h3>
        <p>Completly safe without any data collection.</p>
        <p>Based on public blockchain data only.</p>
        <p>You choose: Private and exclusive or public and sharable gallery.</p>

        <h3 className={classes.subsection}>Anyplace, anytime, anywhere.</h3>
        <p>Accessible via mobile and desktop.</p>
        <p>Available 24/7.</p>
        <p>Visit your and other collections from anywhere around the globe.</p>
      </div>
      <Footer />
    </div>
  );
};

export default Benefits;
