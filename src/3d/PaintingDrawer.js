import seedrandom from "seedrandom";
import { RoomType } from "./RoomBuilder";
import { Vector3, SceneLoader, Mesh } from "@babylonjs/core";

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

const drawPainting = (painting, scene) => {
  const { row, col, wall, side, hasNeighbour } = painting.position;
  let rowOffset = 100 * row;
  let colOffset = 100 * col - 6;

  if (wall === "bottom") {
    rowOffset -= 85.5;

    if (side === 0 && hasNeighbour) {
      colOffset -= 30;
    } else if (side === 1 && hasNeighbour) {
      colOffset += 20;
    }
  }

  if (wall === "top") {
    rowOffset += 10;

    if (side === 0 && hasNeighbour) {
      colOffset -= 30;
    } else if (side === 1 && hasNeighbour) {
      colOffset += 20;
    }
  }

  let rotation = 0;

  if (wall === "right") {
    rotation = -Math.PI / 2;
    rowOffset -= 46.25;
    colOffset += 48;

    if (side === 0 && hasNeighbour) {
      rowOffset -= 20;
    } else if (side === 1 && hasNeighbour) {
      rowOffset += 30;
    }
  }

  if (wall === "left") {
    rotation = Math.PI / 2;
    rowOffset -= 46.25;
    colOffset -= 36;

    if (side === 0 && hasNeighbour) {
      rowOffset -= 20;
    } else if (side === 1 && hasNeighbour) {
      rowOffset += 30;
    }
  }

  SceneLoader.ImportMesh("", "/models/", "frame.glb", scene, (meshes) => {
    for (const mesh of meshes) {
      if (mesh.material) {
        mesh.material.sideOrientation = Mesh.DOUBLESIDE;
      }

      if (mesh.name === "__root__") {
        mesh.scaling = new Vector3(8, 8, 8);
        mesh.position = new Vector3(0 + colOffset, 30, 44 + rowOffset);
        mesh.rotation = new Vector3(0, rotation, 0);
      }
    }
  });
};

export { hangPaintings, drawPainting };
