const { Router } = require("express");
const router = Router();

const example = (req, res) => {
    let data = {}
    data.y = "middlewaresConfig"
    data.x = "crudRouter.stack.map((st) => st.route)"
    let message = "crudRouter"

    res.json({message, data})
}

const errorAction = (req, res) => {
    res.status(444)
    throw new Error("error message");
}

router.route("/example").post(example);
router.route("/error").post(errorAction);

module.exports = router;
