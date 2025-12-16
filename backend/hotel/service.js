import { Hotel } from "./model.js";
import { Room } from "../room/model.js";
import { Review } from "../review/model.js";
import { Reservation } from "../reservation/model.js";
import * as roomService from "../room/service.js";
import { Favorite } from "../favorite/model.js";

const normalizeHotels = (docs) =>
  docs.map((doc) =>
    typeof doc.toJSON === "function" ? doc.toJSON() : Hotel.hydrate(doc).toJSON()
  );

const parseArray = (value) =>
  typeof value === "string"
    ? value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

const getReservedRoomIds = async (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return [];

  const overlap = await Reservation.find({
    status: { $nin: ["cancelled"] },
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  }).select("roomId");

  return overlap.map((r) => r.roomId);
};

export const listHotels = async ({ city, guests }) => {
  const query = { status: "approved" };
  if (city) {
    // 정규식을 사용해 부분 매칭 지원
    const regex = new RegExp(city, "i");
    query.city = regex;
  }

  if (guests) {
    const rooms = await Room.find({
      capacity: { $gte: Number(guests) },
      status: "active",
    }).distinct("hotel");
    query._id = { $in: rooms };
  }

  return Hotel.find(query).sort({ createdAt: -1 });
};


export const getHotelDetail = async (id, { checkIn, checkOut, userId } = {}) => {
  const hotel = await Hotel.findById(id);
  if (!hotel) {
    const err = new Error("HOTEL_NOT_FOUND");
    err.statusCode = 404;
    throw err;
  }

  const rooms = await roomService.getRoomsByHotel(id, { checkIn, checkOut });
  const reviews = await Review.find({ hotelId: id })
    .populate("userId", "name")
    .sort({ createdAt: -1 });

  let isFavorite = false;
  if (userId) {
    const fav = await Favorite.findOne({ userId, hotelId: id }).select("_id");
    isFavorite = !!fav;
  }

  return { hotel, rooms, reviews, isFavorite };
};

export const listRoomsByHotel = async (id, { checkIn, checkOut } = {}) => {
  return roomService.getRoomsByHotel(id, { checkIn, checkOut });
};