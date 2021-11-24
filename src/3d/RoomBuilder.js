import {
  Vector3,
  StandardMaterial,
  Texture,
  Color3,
  MeshBuilder,
  Mesh,
  PointLight,
  DirectionalLight,
} from "@babylonjs/core";

const RoomType = Object.freeze({
  LEFT_OPEN: 0,
  RIGHT_OPEN: 1,
  BOTTOM_OPEN: 2,
  TOP_OPEN: 3,
  VERTICAL_FLOOR: 4,
  HORIZONTAL_FLOOR: 5,
  CORNER_LEFT_TOP: 6,
  CORNER_RIGHT_TOP: 7,
  CORNER_LEFT_BOTTOM: 8,
  CORNER_RIGHT_BOTTOM: 9,
  SPACE: 10,
  LEFT_CLOSED: 11,
  RIGHT_CLOSED: 12,
  BOTTOM_CLOSED: 13,
  TOP_CLOSED: 14,
});

const createRoomTile = (type, row, col, scene) => {
  const brickMaterial = new StandardMaterial("BrickMaterial", scene);
  brickMaterial.diffuseTexture = new Texture("./textures/bricks.jpg");
  brickMaterial.diffuseTexture.uScale = 3.0;
  brickMaterial.diffuseTexture.vScale = 2.0;
  brickMaterial.specularColor = new Color3(0, 0, 0);

  const groundMaterial = new StandardMaterial("GroundMaterial", scene);
  groundMaterial.diffuseTexture = new Texture("./textures/ground.jpg");
  groundMaterial.diffuseTexture.uScale = 8.0;
  groundMaterial.diffuseTexture.vScale = 8.0;
  groundMaterial.specularColor = new Color3(0, 0, 0);

  const ceilingMaterial = new StandardMaterial("CeilingMaterial", scene);
  ceilingMaterial.diffuseTexture = new Texture("./textures/concrete.jpg");
  ceilingMaterial.diffuseTexture.uScale = 8.0;
  ceilingMaterial.diffuseTexture.vScale = 8.0;
  ceilingMaterial.specularColor = new Color3(0, 0, 0);

  const light = new PointLight(
    "Light",
    new Vector3(col * 100, 25, row * 100),
    scene
  );
  light.intensity = 1;
  light.range = 400;

  /*const directionalLight = new DirectionalLight(
    "DirectionalLight",
    new Vector3(1, 1, 1),
    scene
  );

  directionalLight.position = new Vector3(0 + col * 100, 50, -50 + row * 100);*/

  const ground = MeshBuilder.CreatePlane(
    "Ground",
    { size: 100, sideOrientation: Mesh.DOUBLESIDE },
    scene
  );
  ground.rotation = new Vector3(Math.PI / 2, 0, 0);
  ground.position = new Vector3(col * 100, 0, row * 100);
  ground.material = groundMaterial;

  const ceiling = MeshBuilder.CreatePlane("Ceiling", {
    size: 100,
    sideOrientation: Mesh.DOUBLESIDE,
  });
  ceiling.rotation = new Vector3(Math.PI / 2, 0, 0);
  ceiling.position = new Vector3(col * 100, 80, row * 100);
  ceiling.material = ceilingMaterial;

  const walls = [];

  if (
    [
      RoomType.TOP_CLOSED,
      RoomType.CORNER_LEFT_TOP,
      RoomType.CORNER_RIGHT_TOP,
      RoomType.HORIZONTAL_FLOOR,
      RoomType.LEFT_OPEN,
      RoomType.RIGHT_OPEN,
      RoomType.BOTTOM_OPEN,
    ].includes(type)
  ) {
    const front = MeshBuilder.CreatePlane(
      "Front Wall",
      { width: 100, height: 80, sideOrientation: Mesh.DOUBLESIDE },
      scene
    );
    front.position = new Vector3(col * 100, 40, 50 + row * 50);
    walls.push(front);
  }

  if (
    [
      RoomType.LEFT_CLOSED,
      RoomType.CORNER_LEFT_TOP,
      RoomType.CORNER_LEFT_BOTTOM,
      RoomType.VERTICAL_FLOOR,
      RoomType.TOP_OPEN,
      RoomType.RIGHT_OPEN,
      RoomType.BOTTOM_OPEN,
    ].includes(type)
  ) {
    const left = MeshBuilder.CreatePlane(
      "Left Wall",
      { width: 100, height: 80, sideOrientation: Mesh.DOUBLESIDE },
      scene
    );
    left.position = new Vector3(-50 + col * 100, 40, row * 100);
    left.rotation = new Vector3(0, -Math.PI / 2, 0);
    walls.push(left);
  }

  if (
    [
      RoomType.RIGHT_CLOSED,
      RoomType.CORNER_RIGHT_TOP,
      RoomType.CORNER_RIGHT_BOTTOM,
      RoomType.VERTICAL_FLOOR,
      RoomType.TOP_OPEN,
      RoomType.LEFT_OPEN,
      RoomType.BOTTOM_OPEN,
    ].includes(type)
  ) {
    const right = MeshBuilder.CreatePlane(
      "Right Wall",
      { width: 100, height: 80, sideOrientation: Mesh.DOUBLESIDE },
      scene
    );
    right.position = new Vector3(col * 100 + 50, 40, row * 100 + 0);
    right.rotation = new Vector3(0, Math.PI / 2, 0);
    walls.push(right);
  }

  if (
    [
      RoomType.BOTTOM_CLOSED,
      RoomType.CORNER_LEFT_BOTTOM,
      RoomType.CORNER_RIGHT_BOTTOM,
      RoomType.HORIZONTAL_FLOOR,
      RoomType.TOP_OPEN,
      RoomType.LEFT_OPEN,
      RoomType.RIGHT_OPEN,
    ].includes(type)
  ) {
    const back = MeshBuilder.CreatePlane(
      "Back Wall",
      { width: 100, height: 80, sideOrientation: Mesh.DOUBLESIDE },
      scene
    );
    back.position = new Vector3(col * 100, 40, -50 + row * 100);
    back.rotation = new Vector3(0, Math.PI, 0);
    walls.push(back);
  }

  for (const wall of walls) {
    wall.checkCollisions = true;
    wall.material = brickMaterial;
  }
};

export { RoomType, createRoomTile };
