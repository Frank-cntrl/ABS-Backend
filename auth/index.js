const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../database");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const cookieSettings = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

const authenticateJWT = (req, res, next) => {
  console.log("=== AUTH MIDDLEWARE DEBUG ===");
  console.log("Environment:", process.env.NODE_ENV);
  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
  
  // Try to get token from Authorization header first, then from cookies
  let token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    token = req.cookies?.token;
  }

  console.log("Token found:", !!token);
  console.log("Token preview:", token ? token.substring(0, 50) + "..." : "No token");

  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({ 
      error: 'Access denied. No token provided.',
      debug: {
        hasAuthHeader: !!req.headers.authorization,
        hasCookieToken: !!req.cookies?.token,
        headers: Object.keys(req.headers)
      }
    });
  }

  try {
    // Use the same JWT_SECRET constant
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified successfully. User:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    res.status(403).json({ 
      error: 'Invalid token.',
      debug: {
        tokenError: error.message,
        jwtSecretExists: !!JWT_SECRET
      }
    });
  }
};

// Auth0 authentication route
router.post("/auth0", async (req, res) => {
  try {
    const { email, name, auth0Id } = req.body;

    if (!email || !auth0Id) {
      return res.status(400).json({ error: "Email and Auth0 ID are required" });
    }

    // Check if user exists
    let user = await User.findOne({ where: { auth0Id } });

    if (!user) {
      // Create new user
      user = await User.create({
        username: name || email.split("@")[0],
        email,
        auth0Id,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        auth0Id: user.auth0Id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set cookie
    res.cookie("token", token, cookieSettings);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Auth0 authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

// Manual login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password (assuming you have a password verification method)
    // const isValid = await user.verifyPassword(password);
    // For now, we'll skip password verification for the admin user
    if (username === "Admin") {
      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          auth0Id: user.auth0Id,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Set cookie
      res.cookie("token", token, cookieSettings);

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// Get current user route (protected)
router.get("/me", (req, res) => {
  // Check for token in Authorization header first, then cookies
  let token = null;
  
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).send({ error: "No token provided" });
  }

  // Use the same JWT_SECRET constant
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log('Token verification error in /me route:', err.message);
      return res.status(403).send({ error: "Invalid or expired token" });
    }
    
    try {
      // Get fresh user data from database
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['passwordHash'] }
      });
      
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      
      res.send({ 
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).send({ error: "Failed to fetch user" });
    }
  });
});

module.exports = { router, authenticateJWT };