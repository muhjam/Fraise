const jwt = require("jsonwebtoken");
const { jwtVerify } = require("jose");

const JWT_SECRET = "fraise-secret-key-change-in-production";

async function run() {
  const token = jwt.sign({ id: 1, role: "USER" }, JWT_SECRET, { expiresIn: "7d" });
  console.log("Token:", token.substring(0, 20) + "...");

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log("Verified JOSE:", payload);
  } catch (e) {
    console.error("JOSE Verify failed:", e.message);
  }
}
run();
