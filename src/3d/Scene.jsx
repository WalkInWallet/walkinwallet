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
} from "@babylonjs/core";

import SceneComponent from "babylonjs-hook";
import "@babylonjs/loaders/glTF";
import { createRoomTile } from "./RoomBuilder";
import { drawPainting } from "./PaintingDrawer";
import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Button } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const useStyles = createUseStyles({
  fullscreen: {
    height: "100%",
    width: "100%",
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
    height: "fit-content",
    position: "absolute",
    padding: 16,
    color: "white",
    background: "rgba(0,0,0,0.65)",
  },
  info: {
    position: "absolute",
    top: 8,
    right: 8,
    height: 48,
    width: 48,
  },
});

const Scene = (props) => {
  const CAMERA_HEIGHT = 40;
  const [hudDisplayVisible, setHudDisplayVisible] = useState(false);
  const [mainScene, setMainScene] = useState();
  const [initialized, setInitialized] = useState(false);
  const [hudInfos, setHudInfos] = useState({});
  const [showInfos, setShowInfos] = useState(true);
  const classes = useStyles();

  const navigate = useNavigate();
  const { gallery, paintings, onSceneReady } = props;

  useEffect(() => {
    if (
      typeof mainScene !== "undefined" &&
      !initialized &&
      typeof onSceneReady === "function"
    ) {
      console.log("INIT");
      let camera;

      let hasTouchScreen = false;
      if ("maxTouchPoints" in navigator) {
        hasTouchScreen = navigator.maxTouchPoints > 0;
      } else if ("msMaxTouchPoints" in navigator) {
        hasTouchScreen = navigator.msMaxTouchPoints > 0;
      } else {
        const mediaQuery = window.matchMedia && matchMedia("(pointer:coarse)");
        if (mediaQuery && mediaQuery.media === "(pointer:coarse)") {
          hasTouchScreen = !!mediaQuery.matches;
        } else if ("orientation" in window) {
          hasTouchScreen = true;
        } else {
          const userAgent = navigator.userAgent;
          hasTouchScreen =
            /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(userAgent) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(userAgent);
        }
      }

      if (hasTouchScreen) {
        camera = new TouchCamera("MainCamera", new Vector3(0, 3, 0), mainScene);
        setShowInfos(false);
      } else {
        camera = new UniversalCamera(
          "MainCamera",
          new Vector3(0, 3, 0),
          mainScene
        );
      }
      const canvas = mainScene.getEngine().getRenderingCanvas();

      camera.setTarget(
        new Vector3(
          camera.position.x,
          camera.position.y,
          camera.position.z + CAMERA_HEIGHT
        )
      );
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

        camera.keysUp = [W_KEY, UP_KEY];
        camera.keysLeft = [A_KEY, LEFT_KEY];
        camera.keysDown = [S_KEY, DOWN_KEY];
        camera.keysRight = [D_KEY, RIGHT_KEY];

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

      const collider = MeshBuilder.CreateBox(
        "collider",
        { width: 20, depth: 40, height: 20 },
        mainScene
      );
      collider.parent = camera;
      collider.visibility = 0;
      collider.position = new Vector3(0, 10, 35);

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

      mainScene.clearColor = new Color3(0, 0, 0);
      mainScene.executeWhenReady(() => onSceneReady());
      mainScene.registerBeforeRender(() => {
        camera.position.y = CAMERA_HEIGHT;
        pointLight.position.x = camera.position.x;
        pointLight.position.z = camera.position.z;
      });
      setInitialized(true);
    }
  }, [mainScene, initialized, onSceneReady]);

  useEffect(() => {
    if (typeof mainScene !== "undefined" && typeof gallery !== "undefined") {
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
      ground.material.reflectionTexture.mirrorPlane = new Plane(
        0,
        -1.0,
        0,
        -2.0
      );
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
    }
  }, [mainScene, gallery]);

  useEffect(() => {
    if (typeof mainScene !== "undefined" && typeof paintings !== "undefined") {
      const camera = mainScene.getCameraByName("MainCamera");
      const ground = mainScene.getMeshByName("Ground");
      let paintingNextToCamera;
      for (const painting of paintings) {
        drawPainting(
          painting,
          mainScene,
          setHudDisplayVisible,
          setHudInfos,
          ground.material.reflectionTexture
        );

        if (paintingNextToCamera) {
          if (
            painting.position.row + painting.position.col <
            paintingNextToCamera.position.row +
              paintingNextToCamera.position.col
          ) {
            paintingNextToCamera = painting;
          }
        } else {
          paintingNextToCamera = painting;
        }
      }

      if (paintingNextToCamera) {
        const { row, col, wall } = paintingNextToCamera.position;
        let rowOffset = 100 * row;
        let colOffset = 100 * col - 6;

        if (wall === "bottom") {
          rowOffset -= 100;
        }

        if (wall === "top") {
          rowOffset += 10;
        }

        if (wall === "right") {
          rowOffset -= 46.25;
          colOffset += 60;
        }

        if (wall === "left") {
          rowOffset -= 46.25;
          colOffset -= 50;
        }

        camera.setTarget(new Vector3(0 + colOffset, 10, 44 + rowOffset));
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
      <Button
        className={classes.info}
        type="primary"
        icon={
          showInfos ? (
            <EyeOutlined style={{ fontSize: "1.8rem" }} />
          ) : (
            <EyeInvisibleOutlined style={{ fontSize: "1.8rem" }} />
          )
        }
        shape="circle"
        onClick={() => {
          setShowInfos(!showInfos);
        }}
      />
      <SceneComponent
        antialias
        onSceneReady={(scene) => setMainScene(scene)}
        className={classes.fullscreen}
      />
      <div
        className={classes.hud}
        style={{
          display: hudDisplayVisible && showInfos ? "block" : "none",
        }}
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={hudInfos.external_url}
        >
          {hudInfos.name}
        </a>
        <p>{hudInfos.description}</p>
      </div>
    </div>
  );
};

export default Scene;
