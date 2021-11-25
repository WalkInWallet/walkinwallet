import { RoomType } from "./RoomBuilder";
import seedrandom from "seedrandom";

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

export { buildGallery };
