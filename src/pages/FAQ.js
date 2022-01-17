import { Tooltip, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useSharedStyles } from "../helper";

const FAQ = () => {
  const classes = useSharedStyles();
  const navigate = useNavigate();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    if (tooltipVisible) {
      const timeout = setTimeout(() => setTooltipVisible(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [tooltipVisible]);

  const getEllipsisTxt = (str, n = 12) => {
    if (str) {
      return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
    }
    return "";
  };

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
        <h1>FAQ</h1>
        <h2 className={classes.section}>NFT BASICS</h2>
        <h3 className={classes.subsection}>
          What is an NFT (Non-Fungible Token)?
        </h3>
        <p>
          NFTs are <strong>unique</strong> pieces of digital content, for
          instance digital work of art, music, videos or other collectibles, and
          thus one-of-a-kind and verifiable assets that are traded on the
          blockchain. In simple words, just think of trading cards for a moment.
          You can hold a specific card in your hand but noone else in the world
          can have this card at the same time, making it unique. Still, there
          could be other copies of this type of card, posessed by others, making
          it a collectible. NFTs work the same way but are digitalized content.
        </p>
        <p>
          NFTs represent <strong>Non-Fungible Tokens. Non-fungible </strong>
          means not replacable. These items have one-of-a-kind properties and
          are not interchangable. For instance, diamonds are not interchangeable
          because they have unique characteristics such as color, size, etc. in
          a unique combination.
        </p>
        <p>
          Contrary, <strong>fungible</strong> items are interchangable. They are
          not defined by their properties but rather their value. For example, a
          $10 USD note has the same value as another $10 USD note.
        </p>
        <p>
          <strong>Tokens</strong> represent assets or items and are used to
          address ownership for things. They let us tokenise items like art,
          collectibles and even digital land. Tokens have a verified official
          owner at a time and are secured by a blockchain, a type of shared
          database. Thus, nobody can change the record of possession or
          duplicate the NFTs.
        </p>
        <h3 className={classes.subsection}>
          Why can't I just download and copy any NFT? Why pay money?
        </h3>
        <p>
          Sneaky question! This is the part most people get confused about.
          Well, you most certainly can download the same file as the person who
          paid thousands or millions of dollars for it. But NFTs are designed
          through the blockchain to give you something that can never be copied:
          The ownership of the work! Please note: the artist can still retain
          the copyright and reproduction rights, just like with physical
          artwork, if he wants to.
        </p>
        <p>
          If you think of physical art collecting, this might help you
          understand: Anyone can buy a print of a Van Gogh painting, but only
          one person can own and sell the original. This transaction is verified
          and visible in the blockchain.
        </p>
        <h3 className={classes.subsection}>What is a Blockchain?</h3>
        <p>
          Wow, you are eager to learn! A blockchain is a type of shared
          database. Most importantly it has characteristics that differ from a
          typical database. Blockchains store information or data in{" "}
          <strong>blocks</strong>. These are linked together via cryptography.
          Cryptography refers to techniques to secure information and
          communication. Through algorithms, which are mathematical concepts and
          a set of rule-based calculations, these techniques are able to
          transform messages in ways that are very hard to decipher.
        </p>
        <p>
          Everytime new data is written in the blockchain, it is entered into a
          new block. But blocks have limits and as soon as one is filled with
          data, it is <strong>chained</strong> onto the previous block.
        </p>
        <p>
          Different types of data can be stored on a blockchain. Besides the
          most known data, digital currency or cryptocurrency such as Ethereum
          or Bitcoin making it a ledger for transactions, digital assets like
          artwork can be stored on a blockchain in the form of an NFT. Many
          blockchains are set up in a decentralized way. Thus, no single person
          has control over the chain and the data entered is irreversible.
        </p>
        <p>
          Most NFTs run on the Ethereum (ETH) blockchain. Through its smart
          contract features, which ETH established relatively early, it can host
          a wide range of decentralized applications, making it the pioneer of
          NFT blockchains some years ago. There are other blockchains with
          different fuctions such as Solana and Tezos.
        </p>
        <h3 className={classes.subsection}>What is minting?</h3>
        <p>
          Amazing, your thirst for more information cannot be stopped. In simple
          terms, minting means creating the NFT on a blockchain, making it part
          of it. The blockchain algorithm will do its magic and after success,
          the digital artwork is represented as an NFT and can be traded and
          purchased on specialized marketplaces such as Opensea or Treasureland.
          If you want your assets to be on the blockchain, you need to mint
          them. Please note, that WalkInWallet currently only supports NFTs
          which have been traded/collected. This means as for now we do not show
          minted-only NFTs in your 3D gallery (we are working on it!).
        </p>
        <h3 className={classes.subsection}>How to buy NFTs?</h3>
        <p>
          Now we are talking! Three things are essential when buying NFTs: A
          wallet, a marketplace and cryptocurrency.
        </p>
        <p>
          First, when you consider buying NFTs you need to store them somewhere
          and in such a way, that you as the owner are confirmed. This can be
          achieved by setting up a <strong>digital wallet</strong>, for instance
          with Metamask. These wallets are financial accounts that allow you to
          store virtual money (Bitcoins, Ethereum, etc.), make transactions, and
          even store NFTs.
        </p>
        <p>
          Second, you need to decide what <strong>marketplace</strong> you want
          to buy from. The most famous NFT marketplaces are OpenSea, Mintable,
          Nifty Gateway, Treasureland and Rarible. Think of them as a platform
          like eBay, only specialized for NFTs.
        </p>
        <p>
          And third, it is important what kind of{" "}
          <strong>cryptocurrency</strong> you'll need to complete the sale. As
          most NFTs are stored on the Ethereum (ETH) blockchain, you would need
          ETH coins to make transactions and buy these NFTs. Others might be
          stored on different blockchains like Solana or Tezos, where a
          different cryptocurrency is needed. On some marketplaces, it is also
          possible to purchase NFTs with USD.
        </p>
        <h2 className={classes.section}>ABOUT WALKINWALLET</h2>
        <h3 className={classes.subsection}>What is WalkInWallet?</h3>
        <p>
          This is why you are here, friend!{" "}
          <strong>
            WalkInWallet is our free to use 1-click solution to view your NFTs
            in a automatically created 3D gallery.
          </strong>
        </p>
        <p>
          Just login with your Metamask account and start walking. No manual
          configuration is required. WalkInWallet currently supports the Binance
          Smart Chain, the Ethereum Mainnet and the Polygon Network.
        </p>
        <p>
          <em>Walk in wallets as you would walk in galleries!</em>
        </p>
        <h3 className={classes.subsection}>Is WalkInWallet for free?</h3>
        <p>
          <strong>Yes.</strong> We want the whole world to see how great NFTs
          can look. Just sign in with your Metamask wallet and let the magic
          happen.
        </p>
        <h3 className={classes.subsection}>
          Which wallet types are supported?
        </h3>
        <p>Any wallet that supports WalletConnect and MetaMask.</p>
        <h3 className={classes.subsection}>Which Blockchains are supported?</h3>
        <p>
          Currently, WalkInWallet supports the Binance Smart Chain, Ethereum
          Mainnet and the Polygon Network. We are working on integrating further
          Blockchains like Solana or Cardano in the future.
        </p>
        <h3 className={classes.subsection}>
          How safe is WalkInWallet? Is data collected?
        </h3>
        <p>
          It is completely safe because we do not collect any data besides the
          public address of a wallet (which is public in the blockchain anyways)
          in order to generate a 3D gallery. We simply read the public
          blockchain data like any other platform (Opensea, Treasureland, etc.)
          when you connect your wallet. If you have any doubts, please view our{" "}
          <a href="/0xb251ef5a3d35776931805eb54c73e07b5bec1632">Demo Wallet</a>{" "}
          where no login is needed or write your questions to{" "}
          <a href="mailto:contact@walkinwallet.com">contact@walkinwallet.com</a>
          .
        </p>
        <h2 className={classes.section}>COMMUNITY &amp; HOW TO SUPPORT US</h2>
        <h3 className={classes.subsection}>
          How can I join the WalkInWallet community?
        </h3>
        <p>
          The community is a great place to generate ideas for new features.
          With your help, we can make 3D galleries &ldquo;great again&rdquo;.
          Join our{" "}
          <a href="https://discord.gg/zRUB42UPmB">WalkInWallet Discord</a>
        </p>
        <h3 className={classes.subsection}>
          How can I share my WalkInWallet gallery?
        </h3>
        <p>
          Open your 3D gallery by clicking the button on the left side of our
          start page.
        </p>
        <p>Your wallet address should now be part of the website url.</p>
        <p>
          Click on the settings button in the top right corner or use the
          keyboard key "M" to toggle the settings menu. Now you should be able
          to change to visibility of your gallery to public, secret link or
          private.
        </p>
        <p>
          Public wallets are accessible for everyone using your public address
          in the WalkInWallet url (like our demo wallet). Wallets can also be
          shared with small groups using the secret link option.
        </p>
        <p>
          Only people with your secret are able to visit your wallet.Private is
          the default setting. Only you are able to walk in your gallery.
        </p>
        <h3 className={classes.subsection}>
          Can I promote my WalkInWallet gallery on my website or social media?
        </h3>
        <p>
          Of course, go for it! You can promote your gallery for personal or
          commercial use. If you want to support us, we'd be honored if you tag
          us with <strong>@walkinwallet</strong> in order for us to see your
          great NFT collection and artwork.
        </p>
        <h3 className={classes.subsection}>
          Your solution is great! Can I support/gift something to you?
        </h3>
        <p>Wow, you're a nice person! We appreciate any help we can get.</p>
        <p>
          First, help us spread the word. You could tag and feature us on social
          media to promote our solution and show it to your friends and
          audience. Currently, we operate a{" "}
          <a href="https://discord.gg/zRUB42UPmB">Discord</a>,{" "}
          <a href="https://twitter.com/walkinwallet">Twitter</a>,{" "}
          <a href="https://www.instagram.com/walkinwallet/">Instagram </a>and{" "}
          <a href="https://www.linkedin.com/company/walkinwallet/">LinkedIn </a>
          account.
        </p>
        <p>
          Second, you can buy our{" "}
          <a href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/80656453610286593862553941345081200599448839096425722914463096320741286618896">
            WalkInwallet logo as an NFT
          </a>
        </p>
        <p>
          Third, you can also gift cryptocurrency or NFTs to our wallet:{" "}
          <Tooltip
            title="Copied"
            trigger="click"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  "0x8762844699fC638e52e18e400134E5643A7B73F7"
                );
                setTooltipVisible(true);
              } catch (error) {
                console.log(error);
                message.warn("Clipboard is not writable.");
              }
            }}
            visible={tooltipVisible}
          >
            <strong className={classes.link}>
              {getEllipsisTxt("0x8762844699fC638e52e18e400134E5643A7B73F7")}{" "}
              <CopyOutlined />
            </strong>
          </Tooltip>
        </p>
        <p>
          Last, if you're looking to support us with your NFT market or coding
          expertise, please contact us via{" "}
          <a href="mailto:contact@walkinwallet.com">contact@walkinwallet.com</a>
          .
        </p>
        <h3 className={classes.subsection}>
          How can I invest in your WalkInWallet project?
        </h3>
        <p>
          Help is always welcome! If you are serious about funding our solution,
          please contact us via{" "}
          <a href="mailto:contact@walkinwallet.com">contact@walkinwallet.com</a>
          . Funds will be invested in our technology stack, cloud infrastructure
          and new features e.g. upgrading API and infrastructure plans, fetch
          further infos via the fee-based APIs, run own full-nodes or IPFS
          nodes, 3D models and "in-game" interactions.
        </p>

        <h2 className={classes.section}>TECHNICAL SUPPORT</h2>
        <h3 className={classes.subsection}>
          How do I create a 3D gallery on WalkInWallet?
        </h3>
        <p>
          After collecting your first artworks, for instance on Treasureland or
          Opensea, come back to our homepage{" "}
          <a href="https://walkinwallet.com/">WalkInWallet </a>and and click
          "Connect with MetaMask".
        </p>
        <p>
          You will be asked to sign the log-in, as you would on any other site
          when connecting your wallet. Then your 3D gallery is automatically
          created by an algorithm for you with your assets placed on walls.
        </p>
        <h3 className={classes.subsection}>
          What to do if assets are missing?
        </h3>
        <p>
          Sometimes, your assets won't load after connecting MetaMask and
          opening the gallery. Please make sure you have a good internet
          connection and reload the page. Please give it a couple of seconds to
          load all your NFTs. Also, please make sure your NFTs are stored in the
          correct wallet and are not only minted, but have been traded. If the
          problem persists, we are happy to gather your feedback via{" "}
          <a href="mailto:contact@walkinwallet.com">contact@walkinwallet.com</a>{" "}
          and we'll provide you with extra help.
        </p>
        <h3 className={classes.subsection}>
          Audio doesn't seem to play on my videos. Do you support audio?
        </h3>
        <p>
          This feature is in development in 2022 and will be enabled soon. Then,
          we will support NFTs with audio.
        </p>

        <h3 className={classes.subsection}>
          My videos don't seem to be visible. Do you support videos?
        </h3>
        <p>
          This feature is in development in 2022 and will be enabled soon. Then,
          we will support video NFTs.
        </p>

        <h3 className={classes.subsection}>
          I found a bug. How can I report it?
        </h3>
        <p>
          You've earned yourself a reward. Our developers are always happy about
          feedback. Please make a screenshot and send a brief discription along
          with the browser and device you're using to{" "}
          <a href="mailto:contact@walkinwallet.com">contact@walkinwallet.com</a>
          .
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
