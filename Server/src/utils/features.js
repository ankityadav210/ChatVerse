// create a function to emit a event for the socket io

function emitEvent(req, event, users, data) {
  console.log("emitting event", event);
}

// cors option

const corsOption = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.CLIENT_URL,
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  Credential: true,
};
export { emitEvent, corsOption };
