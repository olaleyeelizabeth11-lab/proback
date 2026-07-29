const express  = require("express");
const router   = express.Router();
const passport = require("../config/passport");

// ── Google ──
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/user-login" }),
    (req, res) => {
        // Build user object same shape as your manual login
        const user = {
            id:        req.user._id,
            firstName: req.user.firstName,
            lastName:  req.user.lastName,
            email:     req.user.email,
            role:      req.user.role,
            photoUrl:  req.user.photoUrl,
        };
        // Send to frontend with user data in URL param (base64 encoded)
        const encoded = Buffer.from(JSON.stringify(user)).toString("base64");
        res.redirect(`${process.env.FRONTEND_URL}/oauth-success?data=${encoded}`);
    }
);

// ── GitHub ──
router.get("/github",
    passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback",
    passport.authenticate("github", { failureRedirect: "/user-login" }),
    (req, res) => {
        const user = {
            id:        req.user._id,
            firstName: req.user.firstName,
            lastName:  req.user.lastName,
            email:     req.user.email,
            role:      req.user.role,
            photoUrl:  req.user.photoUrl,
        };
        const encoded = Buffer.from(JSON.stringify(user)).toString("base64");
        res.redirect(`${process.env.FRONTEND_URL}/oauth-success?data=${encoded}`);
    }
);

module.exports = router;