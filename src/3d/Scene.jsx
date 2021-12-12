import {
  UniversalCamera,
  Vector3,
  Color3,
  HemisphericLight,
  PointLight,
  Light,
  TouchCamera,
} from "@babylonjs/core";

import SceneComponent from "babylonjs-hook";
import "@babylonjs/loaders/glTF";
import { createRoomTile } from "./RoomBuilder";
import { drawPainting } from "./PaintingDrawer";

const Scene = (props) => {
  const CAMERA_HEIGHT = 35;

  const { gallery, paintings } = props;
  const onRender = (scene) => {};

  const onSceneReady = (scene) => {
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
      camera = new TouchCamera("MainCamera", new Vector3(0, 3, 0), scene);
    } else {
      camera = new UniversalCamera("MainCamera", new Vector3(0, 3, 0), scene);
    }
    const canvas = scene.getEngine().getRenderingCanvas();

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

    for (const room of gallery) {
      createRoomTile(room.type, room.row, room.col, scene);
    }

    let paintingNextToCamera;

    for (const painting of paintings) {
      drawPainting(painting, scene);

      if (paintingNextToCamera) {
        if (
          painting.position.row + painting.position.col <
          paintingNextToCamera.position.row + paintingNextToCamera.position.col
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

      camera.setTarget(new Vector3(0 + colOffset, 30, 44 + rowOffset));
    }

    const light = new HemisphericLight(
      "HemisphericLight",
      new Vector3(0, 0, 0),
      scene
    );

    light.intensity = 0.3;

    const pointLight = new PointLight("PointLight", new Vector3(0, 30, 0));
    pointLight.falloffType = Light.FALLOFF_STANDARD;
    pointLight.range = 250;
    pointLight.intensity = 4;

    scene.clearColor = new Color3(0, 0, 0);
    scene.registerBeforeRender(() => {
      camera.position.y = CAMERA_HEIGHT;
      pointLight.position.x = camera.position.x;
      pointLight.position.z = camera.position.z;
    });
  };

  return (
    <SceneComponent
      antialias
      onSceneReady={onSceneReady}
      onRender={onRender}
      id="babylonjs-canvas"
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default Scene;
