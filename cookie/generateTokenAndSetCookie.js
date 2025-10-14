import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d'
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // Required for HTTPS on Vercel
    sameSite: "lax", // Changed from "Strict" to "lax" for cross-site requests
    maxAge: 15 * 24 * 60 * 60 * 1000,
    path: "/" // Ensure cookie is available on all routes
  });

  return token;
};