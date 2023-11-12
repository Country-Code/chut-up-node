const { Router } = require("express");
const router = Router();

const example = (req, res) => {
    res.json({message: "example of test action!", status: "OK"})
}

router.route("/example").post(example);

module.exports = router;
