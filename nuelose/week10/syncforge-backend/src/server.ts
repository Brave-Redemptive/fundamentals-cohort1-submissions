import app from "./config/app.config";

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`SyncForge Backend running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
    console.log('\nServer is shutting down...');
    server.close(()=> {
        console.log("Server closed.")
        process.exit(0);
    })
})
