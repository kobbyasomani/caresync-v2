const asyncHandler = require("express-async-handler");




const registerUser = asyncHandler(async (req, res) => {
    res.json({
        data: "data send"
    })
})

module.exports = {
    registerUser,
}