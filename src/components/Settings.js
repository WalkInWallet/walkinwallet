import { useState, useEffect } from "react";
import { Drawer, Select, Switch, Row, Col, Tooltip, message } from "antd";
import { createUseStyles } from "react-jss";
import { useMoralis } from "react-moralis";
import { useParams } from "react-router-dom";
import { CopyOutlined } from "@ant-design/icons";
import axios from "axios";
const { Option } = Select;

const useStyles = createUseStyles({
  drawer: {
    "& .ant-drawer-header": {
      justifyContent: "flex-end",
    },
    "& .ant-drawer-body": {
      paddingTop: 12,
    },
  },
  label: {
    marginLeft: 8,
  },
  link: {
    color: "#ef2f6d",
    cursor: "pointer",
  },
});

const Settings = (props) => {
  const {
    onClose,
    visible,
    userLinkSecret,
    galleryVisibility,
    hideEverything,
    setHideEverything,
    showTitleOnly,
    setShowTitleOnly,
  } = props;
  const { address } = useParams();
  const [visibility, setVisibility] = useState();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [disableSelect, setDisableSelect] = useState(false);
  const { user } = useMoralis();
  const classes = useStyles();

  useEffect(() => {
    setVisibility(galleryVisibility);
  }, [galleryVisibility]);

  useEffect(() => {
    if (tooltipVisible) {
      const timeout = setTimeout(() => setTooltipVisible(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [tooltipVisible]);

  let authenticated = false;
  let visibilityMessage =
    "Your gallery is marked as private. Only you can visit it at WalkInWallet.";
  let visibilityLink = "";

  if (
    user &&
    user.attributes &&
    user.attributes.ethAddress &&
    user.attributes.ethAddress.toLowerCase() === address.toLowerCase()
  ) {
    authenticated = true;

    if (visibility === "public") {
      visibilityMessage =
        "Your gallery is marked as public. Everyone who knows your wallet address can visit it.";
    } else if (visibility === "link") {
      visibilityMessage =
        "Your gallery is partially public. Everyone who has the secret link can visit it.";
    }

    visibilityLink = `https://walkinwallet.com/${address.toLowerCase()}`;

    if (visibility === "link") {
      visibilityLink = `https://walkinwallet.com/${address.toLowerCase()}?invite=${userLinkSecret}`;
    }
  }

  return (
    <Drawer className={classes.drawer} onClose={onClose} visible={visible}>
      {authenticated && (
        <>
          <h2>Gallery visibility</h2>
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <Select
                disabled={disableSelect}
                loading={disableSelect}
                onChange={async (value) => {
                  setDisableSelect(true);
                  try {
                    await axios.post(
                      "https://us-central1-walkinwallet.cloudfunctions.net/api/visibility",
                      { visibility: value },
                      {
                        headers: {
                          "x-user-message": encodeURI(
                            user.attributes.authData.moralisEth.data
                          ),
                          "x-user-signature": encodeURI(
                            user.attributes.authData.moralisEth.signature
                          ),
                        },
                      }
                    );
                    setVisibility(value);
                  } catch (error) {
                    console.log(error);
                    message.warn(
                      "Failed to update your wallet visibility. Please try again later and/or contact bug@walkinwallet.com"
                    );
                  } finally {
                    setDisableSelect(false);
                  }
                }}
                value={visibility}
                style={{ minWidth: 180 }}
              >
                <Option value="public">Public</Option>
                <Option value="link">Shareable Link</Option>
                <Option value="private">Private</Option>
              </Select>
            </Col>
            <Col span={24}>
              <p>{visibilityMessage}</p>
              {["public", "link"].includes(visibility) && (
                <Tooltip
                  title="Copied"
                  trigger="click"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(visibilityLink);
                      setTooltipVisible(true);
                    } catch (error) {
                      console.log(error);
                      message.warn("Clipboard is not writable.");
                    }
                  }}
                  visible={tooltipVisible}
                >
                  <p className={classes.link}>
                    {visibilityLink} <CopyOutlined />
                  </p>
                </Tooltip>
              )}
            </Col>
          </Row>
        </>
      )}
      <h2>Information Overlay</h2>
      <Row gutter={[0, 8]}>
        <Col span={24}>
          <Switch
            checked={showTitleOnly || hideEverything}
            disabled={hideEverything}
            onChange={(value) => setShowTitleOnly(value)}
          />
          <span className={classes.label}>Hide description</span>
        </Col>
        <Col span={24}>
          <Switch
            checked={hideEverything}
            onChange={(value) => {
              setHideEverything(value);
            }}
          />
          <span className={classes.label}>Hide title and description</span>
        </Col>
      </Row>
    </Drawer>
  );
};

export default Settings;
