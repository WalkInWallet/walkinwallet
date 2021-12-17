import seedrandom from "seedrandom";
import { RoomType } from "./RoomBuilder";
import {
  Vector3,
  SceneLoader,
  Mesh,
  PBRMetallicRoughnessMaterial,
  Texture,
  ExecuteCodeAction,
  ActionManager,
} from "@babylonjs/core";

const setupSlots = (rooms) => {
  for (const room of rooms) {
    if (room.type === RoomType.BOTTOM_CLOSED) {
      room.slots = { bottom: [1, 1] };
    } else if (room.type === RoomType.TOP_CLOSED) {
      room.slots = { top: [1, 1] };
    } else if (room.type === RoomType.LEFT_CLOSED) {
      room.slots = { left: [1, 1] };
    } else if (room.type === RoomType.RIGHT_CLOSED) {
      room.slots = { right: [1, 1] };
    } else if (room.type === RoomType.BOTTOM_OPEN) {
      room.slots = {
        top: [1, 1],
        left: [1, 1],
        right: [1, 1],
      };
    } else if (room.type === RoomType.TOP_OPEN) {
      room.slots = {
        bottom: [1, 1],
        left: [1, 1],
        right: [1, 1],
      };
    } else if (room.type === RoomType.LEFT_OPEN) {
      room.slots = {
        top: [1, 1],
        bottom: [1, 1],
        right: [1, 1],
      };
    } else if (room.type === RoomType.RIGHT_OPEN) {
      room.slots = {
        top: [1, 1],
        left: [1, 1],
        bottom: [1, 1],
      };
    } else if (room.type === RoomType.CORNER_LEFT_BOTTOM) {
      room.slots = {
        left: [1, 1],
        bottom: [1, 1],
      };
    } else if (room.type === RoomType.CORNER_LEFT_TOP) {
      room.slots = {
        left: [1, 1],
        top: [1, 1],
      };
    } else if (room.type === RoomType.CORNER_RIGHT_BOTTOM) {
      room.slots = {
        right: [1, 1],
        bottom: [1, 1],
      };
    } else if (room.type === RoomType.CORNER_RIGHT_TOP) {
      room.slots = {
        right: [1, 1],
        top: [1, 1],
      };
    } else if (room.type === RoomType.HORIZONTAL_FLOOR) {
      room.slots = {
        bottom: [1, 1],
        top: [1, 1],
      };
    } else if (room.type === RoomType.VERTICAL_FLOOR) {
      room.slots = {
        left: [1, 1],
        right: [1, 1],
      };
    } else if (room.type === RoomType.SPACE) {
      room.slots = {};
    }
  }
};

const hangPaintings = (hash, rooms, paintings) => {
  const random = seedrandom(hash);
  let options = rooms.filter((room) => room.space > 0);
  setupSlots(options);

  for (const painting of paintings) {
    const choice = options[Math.floor(random() * options.length)];

    const slots = Object.keys(choice.slots);
    const slot = slots[Math.floor(random() * slots.length)];

    let side = Math.round(random());
    if (choice.slots[slot][side] === 1) {
      painting.position = {
        row: choice.row,
        col: choice.col,
        wall: slot,
        side: side,
      };
      choice.slots[slot][side] = 0;
      choice.space -= 1;
    } else {
      painting.position = {
        row: choice.row,
        col: choice.col,
        wall: slot,
        side: 1 - side,
      };
      choice.slots[slot][1 - side] = 0;
      choice.space -= 1;
    }

    if (choice.slots[slot][side] === 0 && choice.slots[slot][1 - side] === 0) {
      delete choice.slots[slot];
    }

    options = options.filter((room) => room.space > 0);
  }

  for (const painting of paintings) {
    const { row, col, wall, side } = painting.position;
    const neighbours = paintings.filter(
      (candidate) =>
        candidate.position.row === row &&
        candidate.position.col === col &&
        candidate.position.wall === wall &&
        candidate.position.side === 1 - side
    );
    painting.position.hasNeighbour = neighbours.length > 0;
  }

  return paintings;
};

const drawPainting = (
  painting,
  scene,
  setHudDisplayVisible,
  setHudInfos,
  probe
) => {
  const { row, col, wall, side, hasNeighbour } = painting.position;
  let rowOffset = 100 * row;
  let colOffset = 100 * col - 6;

  let rotation = new Vector3(0, 0, 0);

  if (wall === "bottom") {
    rowOffset -= 100;

    if (side === 0 && hasNeighbour) {
      colOffset -= 10;
    } else if (side === 1 && hasNeighbour) {
      colOffset += 30;
    }

    rotation = new Vector3(0, Math.PI, 0);
  }

  if (wall === "top") {
    rowOffset += 10;

    if (side === 0 && hasNeighbour) {
      colOffset -= 30;
    } else if (side === 1 && hasNeighbour) {
      colOffset += 20;
    }
  }

  if (wall === "right") {
    rotation = new Vector3(0, Math.PI / 2, 0);
    rowOffset -= 46.25;
    colOffset += 60;

    if (side === 0 && hasNeighbour) {
      rowOffset -= 10;
    } else if (side === 1 && hasNeighbour) {
      rowOffset += 35;
    }
  }

  if (wall === "left") {
    rotation = new Vector3(0, -Math.PI / 2, 0);
    rowOffset -= 46.25;
    colOffset -= 50;

    if (side === 0 && hasNeighbour) {
      rowOffset -= 20;
    } else if (side === 1 && hasNeighbour) {
      rowOffset += 20;
    }
  }

  const ratio = painting.width / painting.height;
  let model = "frame.glb";

  if (ratio > 0.9 && ratio < 1.1) {
    model = "frame-square.glb";
  }

  SceneLoader.ImportMesh("", "/models/", model, scene, (meshes) => {
    for (const mesh of meshes) {
      if (mesh.material) {
        mesh.material.sideOrientation = Mesh.DOUBLESIDE;
      }

      if (mesh.name === "painting") {
        const paintingMaterial = new PBRMetallicRoughnessMaterial(
          "painting#" + painting.image,
          scene
        );
        paintingMaterial.baseTexture = new Texture(painting.image);
        paintingMaterial.metallic = 0.1;
        paintingMaterial.roughness = 0.9;

        mesh.material = paintingMaterial;
        mesh.material.sideOrientation = Mesh.BACKSIDE;

        mesh.actionManager = new ActionManager(scene);
        const enterAction = new ExecuteCodeAction(
          {
            trigger: ActionManager.OnIntersectionEnterTrigger,
            parameter: { mesh: scene.getMeshByName("collider") },
          },
          () => {
            setHudDisplayVisible(true);
            setHudInfos({
              ...painting,
            });
          }
        );
        const exitAction = new ExecuteCodeAction(
          {
            trigger: ActionManager.OnIntersectionExitTrigger,
            parameter: { mesh: scene.getMeshByName("collider") },
          },
          () => {
            setHudDisplayVisible(false);
            setHudInfos({});
          }
        );
        mesh.actionManager.registerAction(enterAction);
        mesh.actionManager.registerAction(exitAction);
      }

      if (mesh.name !== "__root__") {
        probe.renderList.push(mesh);
      } else {
        mesh.scaling = new Vector3(8, 8, 8);
        mesh.position = new Vector3(0 + colOffset, 30, 44 + rowOffset);
        mesh.rotation = rotation;
        mesh.name = `${row}.${col}.${wall}.${side}`;
      }
    }
  });
};

export { hangPaintings, drawPainting };
