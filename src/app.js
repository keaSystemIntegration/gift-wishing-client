require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();

let server = http.createServer(app);
const fs = require("fs");

app.use(express.static("public"));

const path = require("path");

const header = fs.readFileSync(
  path.join(__dirname, "../public/header/header.html"),
  "utf-8"
);
const sideBar = fs.readFileSync(
  path.join(__dirname, "../public/side-bar/side-bar.html"),
  "utf-8"
);
const mainPage = fs.readFileSync(
  path.join(__dirname, "../public/main-page/main-page.html"),
  "utf-8"
);
const footer = fs.readFileSync(
  path.join(__dirname, "../public/footer/footer.html"),
  "utf-8"
);
const create = fs.readFileSync(
  path.join(__dirname, "../public/create-modal/create-modal.html"),
  "utf-8"
);
const deleteAccount = fs.readFileSync(
  path.join(__dirname, "../public/delete-modal/delete-modal.html"),
  "utf-8"
);
const edit = fs.readFileSync(
  path.join(__dirname, "../public/edit-modal/edit-modal.html"),
  "utf-8"
);
const notification = fs.readFileSync(
  path.join(__dirname, "../public/notification-modal/notification-modal.html"),
  "utf-8"
);
const login = fs.readFileSync(
  path.join(__dirname, "../public/login/login.html"),
  "utf-8"
);
const liveChat = fs.readFileSync(
  path.join(__dirname, "../public/live-chat/live-chat.html"),
  "utf-8"
);

const wishlist = fs.readFileSync(
  path.join(__dirname, "../public/wishlist/index.html"),
  "utf-8"
);

const friends = fs.readFileSync(
  path.join(__dirname, "../public/friends/index.html"),
  "utf-8"
);

const wishlistModal = fs.readFileSync(
  path.join(__dirname, "../public/wishlist-modal/index.html"),
  "utf-8"
);

// UI Calls
app.get("/", (req, res) => {
  res.send(
    header +
      sideBar +
      mainPage +
      create +
      deleteAccount +
      edit +
      notification +
      liveChat +
      footer
  );
});

app.get("/login", (req, res) => {
  res.send(header + login + footer);
});

app.get("/wishlists", (req, res) => {
  res.send(header + sideBar + friends + wishlist + wishlistModal + footer);
});

server.listen(process.env.PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log(`App listening on http://localhost:${process.env.PORT}`);
});
