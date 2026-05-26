const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserDashboard, getUserProfile, updateUserProfile } = require("../controllers/user.controller");

// router.get("/register", (req, res) => {
//     res.status(200).json({ message: "This route exists. Use POST /user/register to submit registration data." });
// });

router.post('/register', registerUser);
router.post('/login', loginUser)
router.get('/dashboard/:id', getUserDashboard);
router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateUserProfile);

module.exports = router;