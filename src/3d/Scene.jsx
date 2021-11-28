import {
  UniversalCamera,
  Vector3,
  Color3,
  HemisphericLight,
  PointLight,
  Light,
} from "@babylonjs/core";

import SceneComponent from "babylonjs-hook";
import "@babylonjs/loaders/glTF";
import { createRoomTile } from "./RoomBuilder";
import { drawPainting } from "./PaintingDrawer";

const Scene = (props) => {
  const CAMERA_HEIGHT = 30;

  const onRender = (scene) => {};

  const onSceneReady = (scene) => {
    const camera = new UniversalCamera(
      "MainCamera",
      new Vector3(0, 3, 0),
      scene
    );
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

    const W_KEY = 87;
    const A_KEY = 65;
    const S_KEY = 83;
    const D_KEY = 68;

    camera.keysUp.push(W_KEY);
    camera.keysLeft.push(A_KEY);
    camera.keysDown.push(S_KEY);
    camera.keysRight.push(D_KEY);

    camera.speed = 20;
    camera.fov = 0.8;
    camera.inertia = 0;

    camera.ellipsoid = new Vector3(1.5, 0.5, 1.5);
    camera.checkCollisions = true;

    for (const room of props.gallery) {
      createRoomTile(room.type, room.row, room.col, scene);
    }

    for (const painting of props.paintings) {
      drawPainting(painting, scene);
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
