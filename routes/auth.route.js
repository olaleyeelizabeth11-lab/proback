const express  = require("express");
const router   = express.Router();
const passport = require("../config/passport");

// ── Google ──
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
    passport.authenticate("google", { 
        failureRedirect: `${process.env.FRONTEND_URL}/user-login` 
    }),
    (req, res) => {
        try {
            const user = {
                id:        req.user._id,
                firstName: req.user.firstName,
                lastName:  req.user.lastName,
                email:     req.user.email,
                role:      req.user.role,
                photoUrl:  req.user.photoUrl,
            };
            const encoded = Buffer.from(JSON.stringify(user)).toString("base64");
            const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?data=${encoded}`;
            console.log("Redirecting to:", redirectUrl); // ← helps debug
            res.redirect(redirectUrl);
        } catch (err) {
            console.error("OAuth callback error:", err);
            res.redirect(`${process.env.FRONTEND_URL}/user-login`);
        }
    }
);

// ── GitHub ──
router.get("/github",
    passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback",
    passport.authenticate("github", { 
        failureRedirect: `${process.env.FRONTEND_URL}/user-login` 
    }),
    (req, res) => {
        try {
            const user = {
                id:        req.user._id,
                firstName: req.user.firstName,
                lastName:  req.user.lastName,
                email:     req.user.email,
                role:      req.user.role,
                photoUrl:  req.user.photoUrl,
            };
            const encoded = Buffer.from(JSON.stringify(user)).toString("base64");
            const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?data=${encoded}`;
            console.log("Redirecting to:", redirectUrl); // ← helps debug
            res.redirect(redirectUrl);
        } catch (err) {
            console.error("OAuth callback error:", err);
            res.redirect(`${process.env.FRONTEND_URL}/user-login`);
        }
    }
);

module.exports = router;