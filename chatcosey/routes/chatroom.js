const router = require("express").Router();
const chatroomController = require("../controllers/chatroomController");

const auth = require("../middlewares/auth");

router.get("/", auth, chatroomController.getAllMyChatrooms);
router.post("/", auth, chatroomController.createChatroom);

module.exports = router;
