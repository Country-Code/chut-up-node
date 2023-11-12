const { Router } = require("express");
const router = Router();

const example = (req, res) => {
    let data = {}
    data.y = "middlewaresConfig"
    data.x = "crudRouter.stack.map((st) => st.route)"
    let message = "crudRouter"

    res.json({message, data})
}

router.route("/example").post(example);

module.exports = router;
