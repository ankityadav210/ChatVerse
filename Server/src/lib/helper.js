const getOtherMember = (members, userId) => {
  members.find((member) => {
    member._id.toString() !== userId.toString();
  });
};

const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export { getOtherMember, getBase64 };
