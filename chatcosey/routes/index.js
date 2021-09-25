const router = require("express").Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// Bring in the router
router.use("/user", require("./user"));
router.use("/chatroom", require("./chatroom"));

module.exports = router;
