import {
  Vector3,
  Texture,
  MeshBuilder,
  Mesh,
  PBRMetallicRoughnessMaterial,
  Color3,
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

const createRoomTile = (type, row, col, scene, probe) => {
  const wallMaterial = new PBRMetallicRoughnessMaterial("wallMaterial", scene);
  wallMaterial.baseTexture = new Texture(
    "./textures/Wallpaper_Glassweave_001_basecolor.jpg"
  );
  wallMaterial.metallic = 0;
  wallMaterial.roughness = 1;
  wallMaterial.baseTexture.uScale = 2;
  wallMaterial.baseTexture.vScale = 2;

  wallMaterial.metallicRoughnessTexture = new Texture(
    "./textures/Wallpaper_Glassweave_001_roughness.jpg"
  );
  wallMaterial.metallicRoughnessTexture.uScale = 2;
  wallMaterial.metallicRoughnessTexture.vScale = 2;

  wallMaterial.normalTexture = new Texture(
    "./textures/Wallpaper_Glassweave_001_normal.jpg"
  );
  wallMaterial.normalTexture.uScale = 2;
  wallMaterial.normalTexture.vScale = 2;

  const ceilingMaterial = new PBRMetallicRoughnessMaterial(
    "GroundMaterial",
    scene
  );

  ceilingMaterial.baseColor = new Color3(1, 1, 1);
  ceilingMaterial.metallic = 0.2;
  ceilingMaterial.roughness = 0.6;

  const ceiling = MeshBuilder.CreatePlane("Ceiling", {
    size: 100,
    sideOrientation: Mesh.DOUBLESIDE,
  });
  ceiling.rotation = new Vector3(Math.PI / 2, 0, 0);
  ceiling.position = new Vector3(col * 100, 80, row * 100);
  ceiling.material = ceilingMaterial;
  probe.renderList.push(ceiling);

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
    front.position = new Vector3(col * 100, 40, 50 + row * 100);
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
    wall.material = wallMaterial;
    probe.renderList.push(wall);
  }
};

export { RoomType, createRoomTile };
