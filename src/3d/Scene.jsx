import {
  UniversalCamera,
  Vector3,
  Color3,
  PointLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  SceneLoader,
  DirectionalLight,
} from "@babylonjs/core";

import SceneComponent from "babylonjs-hook";
import seedrandom from "seedrandom";
import "@babylonjs/loaders/glTF";
import { RoomType, createRoomTile } from "./RoomBuilder";

const Scene = (props) => {
  const CAMERA_HEIGHT = 30;

  const onRender = (scene) => {};

  const buildGallery = (hash, paintings) => {
    var random = seedrandom(hash);

    let rooms = [
      {
        render: RoomType.ROOM_CLOSED,
        id: 0,
        extensions: 0,
        row: 0,
        col: 0,
        above: -1,
        below: -1,
        left: -1,
        right: -1,
        spaces: 8,
      },
    ];

    let space = 8;

    while (space < paintings) {
      const options = rooms.filter((room) => room.extensions < 4);
      const choice = options[Math.floor(random() * options.length)];

      let sides = ["above", "below", "left", "right"];
      sides = sides.filter((side) => choice[side] !== -1);

      const side = sides[Math.floor(random() * sides.length)];
      const room = {
        type: RoomType.ROOM_CLOSED,
        id: rooms.length,
        extensions: 0,
        row: 0,
        col: 0,
        above: -1,
        below: -1,
        left: -1,
        right: -1,
        spaces: 8,
      };

      if (side === "above") {
        room.below = choice.id;
        room.row = choice.row;
        room.col = choice.col + 1;
        room.type = RoomType.ROOM_BOTTOM_OPEN;
        room.spaces = 6;
      }
    }

    return rooms;
  };

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

    /*
    SceneLoader.ImportMesh("", "/models/", "frame.glb", scene, (meshes) => {
      for (const mesh of meshes) {
        if (mesh.material) {
          mesh.material.sideOrientation = 1;
        }

        if (mesh.name === "__root__") {
          mesh.scaling = new Vector3(5, 5, 5);
          mesh.position = new Vector3(0, 30, 42);
          mesh.rotation = new Vector3(0, Math.PI / 2, 0);

          const painting = MeshBuilder.CreatePlane(
            "Painting",
            { width: 2, height: 3 },
            scene
          );
          painting.scaling = new Vector3(10, 10, 10);
          painting.position = new Vector3(0, 30, 44);

          const paintingMaterial = new StandardMaterial("boxMat");
          paintingMaterial.diffuseTexture = new Texture(
            "./textures/berggorilla.jpg"
          );
          paintingMaterial.specularColor = new Color3(0, 0, 0);
          painting.material = paintingMaterial;
        }
      }
    });
    */

    createRoomTile(RoomType.CORNER_LEFT_TOP, 0, 0, scene);
    createRoomTile(RoomType.CORNER_RIGHT_TOP, 0, 1, scene);
    createRoomTile(RoomType.CORNER_LEFT_BOTTOM, -1, 0, scene);
    createRoomTile(RoomType.CORNER_RIGHT_BOTTOM, -1, 1, scene);

    scene.clearColor = new Color3(0, 0, 0);
    scene.registerBeforeRender(() => {
      camera.position.y = CAMERA_HEIGHT;
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
