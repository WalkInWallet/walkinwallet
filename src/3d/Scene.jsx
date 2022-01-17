import {
  UniversalCamera,
  Vector3,
  Color3,
  HemisphericLight,
  PointLight,
  Light,
  TouchCamera,
  MeshBuilder,
  StandardMaterial,
  Texture,
  MirrorTexture,
  Plane,
  Mesh,
  PointerEventTypes,
} from "@babylonjs/core";

import SceneComponent from "babylonjs-hook";
import "@babylonjs/loaders/glTF";
import { createRoomTile } from "./RoomBuilder";
import { drawPainting } from "./PaintingDrawer";
import { useEffect, useState, useRef, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { Button, Collapse } from "antd";
import {
  SettingOutlined,
  DisconnectOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../helper";
import Settings from "../components/Settings";
import { useMoralis } from "react-moralis";
import { useParams } from "react-router-dom";

const useStyles = createUseStyles({
  fullscreen: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    outline: "none",
  },
  back: {
    backgroundImage: "url(./WalkInWallet_Arrow_Small.png)",
    position: "absolute",
    top: 8,
    left: 8,
    height: 42,
    width: 42,
    backgroundSize: "contain",
    transform: "scaleX(-1)",
    cursor: "pointer",
    zIndex: 3,
  },
  hud: {
    bottom: 0,
    position: "absolute",
    width: "100%",
    borderTop: "1px solid rgba(255, 255, 255, 0.85)",
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(9px)",
  },
  info: {
    position: "absolute",
    top: 8,
    right: 8,
    height: 48,
    width: 48,
  },
});

const { Panel } = Collapse;

const Scene = (props) => {
  const CAMERA_HEIGHT = 40;
  const [hudDisplayVisible, setHudDisplayVisible] = useState(false);
  const hasTouchScreen = useMemo(() => {
    let touchScreen = false;
    if ("maxTouchPoints" in navigator) {
      touchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
      touchScreen = navigator.msMaxTouchPoints > 0;
    } else {
      const mediaQuery = window.matchMedia && matchMedia("(pointer:coarse)");
      if (mediaQuery && mediaQuery.media === "(pointer:coarse)") {
        touchScreen = !!mediaQuery.matches;
      } else if ("orientation" in window) {
        touchScreen = true;
      } else {
        const userAgent = navigator.userAgent;
        touchScreen =
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(userAgent) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(userAgent);
      }
    }
    return touchScreen;
  }, []);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mainScene, setMainScene] = useState();
  const [initialized, setInitialized] = useState(false);
  const [hudInfos, setHudInfos] = useState({});
  const isDrawerOpen = useRef(false);
  const classes = useStyles();
  const [showTitleOnly, setShowTitleOnly] = useLocalStorage(
    "user.settings.overlay.titleOnly",
    hasTouchScreen
  );
  const loadedPictures = useRef([]);
  const { user } = useMoralis();
  const { address } = useParams();

  const navigate = useNavigate();
  const {
    gallery,
    paintings,
    nfts,
    onSceneReady,
    userLinkSecret,
    galleryVisibility,
  } = props;

  useEffect(() => {
    if (
      typeof mainScene !== "undefined" &&
      typeof gallery !== "undefined" &&
      typeof nfts !== "undefined" &&
      typeof onSceneReady === "function" &&
      !initialized
    ) {
      let camera;

      if (hasTouchScreen) {
        camera = new TouchCamera("MainCamera", new Vector3(0, 3, 0), mainScene);
      } else {
        camera = new UniversalCamera(
          "MainCamera",
          new Vector3(0, 3, 0),
          mainScene
        );
      }
      const canvas = mainScene.getEngine().getRenderingCanvas();

      camera.setTarget(new Vector3(150, camera.position.y, 0));
      camera.wheelDeltaPercentage = 0.01;
      camera.attachControl(canvas, true);

      if (hasTouchScreen) {
        camera.keysUp = [];
        camera.keysLeft = [];
        camera.keysDown = [];
        camera.keysRight = [];
        camera.speed = 40;
        camera.touchAngularSensibility = 10000;
        camera.touchMoveSensibility = 200;
      } else {
        camera.speed = 20;
        const W_KEY = 87;
        const UP_KEY = 38;
        const A_KEY = 65;
        const LEFT_KEY = 37;
        const S_KEY = 83;
        const DOWN_KEY = 40;
        const D_KEY = 68;
        const RIGHT_KEY = 39;
        const Q_KEY = 81;
        const E_KEY = 69;

        camera.keysUp = [W_KEY, UP_KEY];
        camera.keysLeft = [A_KEY, LEFT_KEY];
        camera.keysDown = [S_KEY, DOWN_KEY];
        camera.keysRight = [D_KEY, RIGHT_KEY];
        camera.keysRotateLeft.push(Q_KEY);
        camera.keysRotateRight.push(E_KEY);

        canvas.addEventListener(
          "click",
          () => {
            canvas.requestPointerLock =
              canvas.requestPointerLock ||
              canvas.msRequestPointerLock ||
              canvas.mozRequestPointerLock ||
              canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
              canvas.requestPointerLock();
            }
          },
          false
        );
      }

      camera.fov = 0.8;
      camera.inertia = 0;
      camera.ellipsoid = new Vector3(1.5, 0.5, 1.5);
      camera.checkCollisions = true;

      const screenWidth = Math.max(window.screen.width, window.innerWidth);

      let depth = 85;
      let offset = 40;

      if (screenWidth > 800) {
        depth = 55;
        offset = 30;
      } else if (screenWidth > 360) {
        depth = 85 - (30 / 440) * (screenWidth - 360);
        offset = 40 - (10 / 440) * (screenWidth - 360);
      }

      const collider = MeshBuilder.CreateBox(
        "collider",
        { width: 1, depth: depth, height: 1 },
        mainScene
      );

      collider.parent = camera;
      collider.visibility = 0;
      collider.position = new Vector3(0, 0, offset);
      collider.isPickable = false;

      const light = new HemisphericLight(
        "HemisphericLight",
        new Vector3(0, 0, 0),
        mainScene
      );

      light.intensity = 1.3;

      const pointLight = new PointLight("PointLight", new Vector3(0, 30, 0));
      pointLight.falloffType = Light.FALLOFF_STANDARD;
      pointLight.range = 250;
      pointLight.intensity = 1.8;

      const loadingTexture = new Texture("./loading_animation.png", mainScene);

      loadingTexture.uScale = -1 / 10;
      loadingTexture.vScale = 1;
      loadingTexture.uOffset = 0;
      loadingTexture.vOffset = 1;
      loadingTexture.name = "LoadingTexture";

      setInterval(() => {
        if (loadingTexture.uOffset >= 1 - 2 / 10) {
          loadingTexture.uOffset = 0;
        } else {
          loadingTexture.uOffset = loadingTexture.uOffset + 1 / 10;
        }
      }, 1000);

      mainScene.clearColor = new Color3(0, 0, 0);

      const ground = MeshBuilder.CreatePlane(
        "Ground",
        { size: 100 * 20, sideOrientation: Mesh.FRONTSIDE },
        mainScene
      );
      ground.rotation = new Vector3(Math.PI / 2, 0, 0);

      ground.material = new StandardMaterial("ground", mainScene);
      ground.material.diffuseTexture = new Texture(
        "./textures/Marble_White_006_basecolor.jpg"
      );
      ground.material.diffuseTexture.uScale = 40;
      ground.material.diffuseTexture.vScale = 40;
      ground.material.specularColor = new Color3(0, 0, 0);
      ground.material.reflectionTexture = new MirrorTexture(
        "mirror",
        512,
        mainScene,
        true
      );
      ground.material.reflectionTexture.mirrorPlane = new Plane(0, -1.0, 0, 0);
      ground.material.reflectionTexture.level = 0.2;
      ground.material.reflectionTexture.adaptiveBlurKernel = 15;

      for (const room of gallery) {
        createRoomTile(
          room.type,
          room.row,
          room.col,
          mainScene,
          ground.material.reflectionTexture
        );
      }

      for (const nft of nfts) {
        const { row, col, wall, side } = nft.position;
        const paintingMesh = mainScene.getMeshByName(
          `${row}.${col}.${wall}.${side}`
        );
        if (!paintingMesh) {
          drawPainting(
            nft,
            mainScene,
            setHudDisplayVisible,
            setHudInfos,
            ground.material.reflectionTexture
          );
        }
      }

      //const sphere = MeshBuilder.CreateSphere("spehere", { diameter: 2 });

      mainScene.onPointerObservable.add(({ pickInfo, type }) => {
        if (type === PointerEventTypes.POINTERTAP) {
          /*if (pickInfo.hit) {
            console.log(pickInfo.pickedMesh.name);
            //sphere.position = pickInfo.pickedPoint;
          }*/

          if (
            (pickInfo.hit &&
              pickInfo.pickedMesh.name.startsWith("Collider#")) ||
            pickInfo.pickedMesh.name.startsWith("Painting#")
          ) {
            const screenWidth = Math.max(
              window.screen.width,
              window.innerWidth
            );
            let distance = 80;

            if (screenWidth > 800) {
              distance = 55;
            } else if (screenWidth > 360) {
              distance = 80 - (25 / 440) * (screenWidth - 360);
            }

            if (pickInfo.pickedMesh.name.includes("right")) {
              let meshPosition = pickInfo.pickedMesh.absolutePosition;
              camera.position.x = meshPosition.x - distance;
              camera.position.z = meshPosition.z;
            } else if (pickInfo.pickedMesh.name.includes("top")) {
              let meshPosition = pickInfo.pickedMesh.absolutePosition;
              camera.position.x = meshPosition.x;
              camera.position.z = meshPosition.z - distance;
            } else if (pickInfo.pickedMesh.name.includes("bottom")) {
              let meshPosition = pickInfo.pickedMesh.absolutePosition;
              camera.position.x = meshPosition.x;
              camera.position.z = meshPosition.z + distance;
            } else if (pickInfo.pickedMesh.name.includes("left")) {
              let meshPosition = pickInfo.pickedMesh.absolutePosition;
              camera.position.x = meshPosition.x + distance;
              camera.position.z = meshPosition.z;
            }

            camera.setTarget(pickInfo.pickedMesh.absolutePosition);
          }
        }
      });

      mainScene.executeWhenReady(() => onSceneReady());
      mainScene.registerBeforeRender(() => {
        camera.position.y = CAMERA_HEIGHT;
        pointLight.position.x = camera.position.x;
        pointLight.position.z = camera.position.z;
      });
      setInitialized(true);

      document.addEventListener("keydown", (event) => {
        if (event.code === "KeyM") {
          isDrawerOpen.current = !isDrawerOpen.current;
          setDrawerVisible(isDrawerOpen.current);
        }
      });
    }
  }, [mainScene, initialized, onSceneReady, hasTouchScreen, gallery, nfts]);

  useEffect(() => {
    if (typeof mainScene !== "undefined" && typeof paintings !== "undefined") {
      for (const painting of paintings) {
        const { row, col, wall, side } = painting.position;
        if (!loadedPictures.current.includes(`${row}.${col}.${wall}.${side}`)) {
          loadedPictures.current.push(`${row}.${col}.${wall}.${side}`);
          const ratio = painting.width / painting.height;
          const paintingTexture = new Texture(painting.image);
          paintingTexture.uScale = -1;
          paintingTexture.invertZ = true;

          if (ratio > 0.9 && ratio < 1.1) {
            const paintingMaterial = mainScene.getMaterialByName(
              `Painting#material#${row}.${col}.${wall}.${side}#square`
            );

            if (paintingMaterial) {
              for (const meshName of ["Painting", "Passepartout", "Frame"]) {
                const baseName = `${meshName}#${row}.${col}.${wall}.${side}#`;
                const rectMesh = mainScene.getMeshByName(baseName + "rect");
                const squareMesh = mainScene.getMeshByName(baseName + "square");
                rectMesh.visibility = 0;
                squareMesh.visibility = 1;
              }
              try {
                paintingMaterial.baseTexture = paintingTexture;
              } catch (error) {
                console.log(error);
              }
            }
          } else {
            const paintingMaterial = mainScene.getMaterialByName(
              `Painting#material#${row}.${col}.${wall}.${side}#rect`
            );

            if (paintingMaterial) {
              for (const meshName of ["Painting", "Passepartout", "Frame"]) {
                const baseName = `${meshName}#${row}.${col}.${wall}.${side}#`;
                const rectMesh = mainScene.getMeshByName(baseName + "rect");
                const squareMesh = mainScene.getMeshByName(baseName + "square");
                rectMesh.visibility = 1;
                squareMesh.visibility = 0;
              }
              try {
                paintingMaterial.baseTexture = paintingTexture;
              } catch (error) {
                console.log(error);
              }
            }
          }
        }
      }
    }
  }, [mainScene, paintings]);

  return (
    <div
      className={classes.fullscreen}
      style={{
        position: "relative",
        display: props.isVisible ? "block" : "none",
      }}
    >
      <div
        className={classes.back}
        onClick={() => {
          navigate("/", { replace: true });
        }}
      />

      {user &&
        user.attributes &&
        user.attributes.ethAddress &&
        user.attributes.ethAddress.toLowerCase() === address.toLowerCase() && (
          <Button
            className={classes.info}
            type="primary"
            style={{ display: drawerVisible ? "none" : "block" }}
            icon={<SettingOutlined style={{ fontSize: "1.8rem" }} />}
            shape="circle"
            onClick={() => {
              setDrawerVisible(true);
              isDrawerOpen.current = true;
            }}
          />
        )}
      <Settings
        visible={drawerVisible}
        userLinkSecret={userLinkSecret}
        galleryVisibility={galleryVisibility}
        onClose={() => {
          setDrawerVisible(false);
          isDrawerOpen.current = false;
        }}
      />
      <SceneComponent
        antialias
        onSceneReady={(scene) => setMainScene(scene)}
        className={classes.fullscreen}
      />
      <Collapse
        className={classes.hud}
        activeKey={showTitleOnly ? null : 0}
        onChange={(panels) => {
          if (panels.length === 0) {
            setShowTitleOnly(true);
          } else {
            setShowTitleOnly(false);
          }
        }}
        ghost
        style={{
          display: hudDisplayVisible ? "block" : "none",
        }}
      >
        <Panel
          header={
            <a target="_blank" rel="noopener noreferrer" href={hudInfos.link}>
              {hudInfos.name}{" "}
              {hudInfos.offline ? <DisconnectOutlined /> : <LinkOutlined />}
            </a>
          }
        >
          <p
            style={{
              maxHeight: "15vh",
              overflowY: "auto",
              paddingRight: 6,
            }}
          >
            {hudInfos.offline
              ? "This artwork is offline, protected or currently unfetchable. Try to click on the artwork title and use it as direct link to get more information."
              : hudInfos.description}
          </p>
        </Panel>
      </Collapse>
    </div>
  );
};

export default Scene;
