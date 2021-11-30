import { Menu, Input } from "antd";
import { Link } from "react-router-dom";

const { Search } = Input;

const WelcomePage = () => {
  return (
    <>
      <Menu mode="horizontal">
        <Menu.Item key="/about">
          <Link to="/about">About</Link>
        </Menu.Item>
        <Menu.Item key="/roadmap">
          <Link to="/roadmap">Roadmap</Link>
        </Menu.Item>
      </Menu>
      <div>
        <h1>Let's walk in wallet</h1>
        <Search
          placeholder="input search text"
          allowClear
          onSearch={() => {}}
        />
      </div>
      <p>
        walkinwallet will create a 3D gallery from the NFT's stored within the
        given wallet on Binance Smart Chain, Ethereum Mainnet and Polygon
        Network.
      </p>
      <hr />
      <footer>
        Copyright ©2021 Created by Fabian Bormann - Powered by Babylon.js and
        Moralis
      </footer>
    </>
  );
};

export default WelcomePage;
