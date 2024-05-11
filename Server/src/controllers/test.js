import asyncHandler from "../utils/asyncHandler.js";

const test = asyncHandler((req, res) => {
  res.send("welcome to the server");
});

export { test };
