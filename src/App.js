import React from "react";
import {
  UniversalCamera,
  Vector3,
  Color3,
  PointLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  SceneLoader,
  SpotLight,
  DirectionalLight,
} from "@babylonjs/core";

import SceneComponent from "babylonjs-hook";
import "./App.css";
import seedrandom from "seedrandom";
import "@babylonjs/loaders/glTF";

const RoomType = Object.freeze({
  ROOM_CLOSED: 0,
  ROOM_LEFT_OPEN: 1,
  ROOM_RIGHT_OPEN: 2,
  ROOM_BOTTOM_OPEN: 3,
  ROOM_TOP_OPEN: 4,
  ROOM_VERTICAL_FLOOR: 5,
  ROOM_HORIZONTAL_FLOOR: 6,
  ROOM_CORNER_LEFT_TOP: 7,
  ROOM_CORNER_RIGHT_TOP: 8,
  ROOM_CORNER_LEFT_BOTTOM: 9,
  ROOM_CORNER_RIGHT_BOTTOM: 10,
});

const App = () => {
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
    //camera.checkCollisions = true;

    var light = new PointLight("Light", new Vector3(0, 25, 0), scene);
    light.intensity = 1;
    light.range = 400;

    var light1 = new SpotLight(
      "spotLight1",
      new Vector3(0, 30, 20),
      new Vector3(0, 0, 50),
      Math.PI / 2,
      16,
      scene
    );
    light1.intensity = 6;

    const dirLight = new DirectionalLight(
      "dirLight",
      new Vector3(1, 1, 1),
      scene
    );

    dirLight.position = new Vector3(0, 50, -50);

    const frontWall = MeshBuilder.CreateBox("Front Wall", {});
    frontWall.scaling = new Vector3(100, 80, 10);
    frontWall.position = new Vector3(0, 40, 50);

    const rightWall = MeshBuilder.CreateBox("Right Wall", {});
    rightWall.scaling = new Vector3(100, 80, 10);
    rightWall.position = new Vector3(50, 40, 0);
    rightWall.rotation = new Vector3(0, Math.PI / 2, 0);

    const leftWall = MeshBuilder.CreateBox("Left Wall", {});
    leftWall.scaling = new Vector3(100, 80, 10);
    leftWall.position = new Vector3(-50, 40, 0);
    leftWall.rotation = new Vector3(0, Math.PI / 2, 0);

    const backWall = MeshBuilder.CreateBox("Back Wall", {});
    backWall.scaling = new Vector3(100, 80, 10);
    backWall.position = new Vector3(0, 40, -50);

    const brickMaterial = new StandardMaterial("boxMat");
    brickMaterial.diffuseTexture = new Texture("./textures/bricks.jpg");
    brickMaterial.diffuseTexture.uScale = 3.0;
    brickMaterial.diffuseTexture.vScale = 2.0;
    brickMaterial.specularColor = new Color3(0, 0, 0);

    frontWall.checkCollisions = true;
    leftWall.checkCollisions = true;
    backWall.checkCollisions = true;
    rightWall.checkCollisions = true;

    frontWall.material = brickMaterial;
    leftWall.material = brickMaterial;
    backWall.material = brickMaterial;
    rightWall.material = brickMaterial;

    const groundMaterial = new StandardMaterial("boxMat");
    groundMaterial.diffuseTexture = new Texture("./textures/ground.jpg");
    groundMaterial.diffuseTexture.uScale = 8.0;
    groundMaterial.diffuseTexture.vScale = 8.0;
    groundMaterial.specularColor = new Color3(0, 0, 0);

    const ground = MeshBuilder.CreateGround(
      "Ground",
      { width: 100, height: 100 },
      scene
    );
    ground.material = groundMaterial;

    const ceiling = MeshBuilder.CreateBox("Ceiling", {});
    ceiling.scaling = new Vector3(100, 10, 100);
    ceiling.position = new Vector3(0, 80, 0);

    const ceilingMaterial = new StandardMaterial("boxMat");
    ceilingMaterial.diffuseTexture = new Texture("./textures/concrete.jpg");
    ceilingMaterial.diffuseTexture.uScale = 8.0;
    ceilingMaterial.diffuseTexture.vScale = 8.0;
    ceilingMaterial.specularColor = new Color3(0, 0, 0);

    ceiling.material = ceilingMaterial;

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
        }
      }
    });

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

export default App;
