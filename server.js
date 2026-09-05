import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// ==================== COMBINED MLBB API ENDPOINT ====================
app.all("/api/mlbb", async (req, res) => {
  const { action, id, ...params } = req.query;
  const baseUrl = "https://arena.rone.dev/api";

  try {
    let url;
    let options = {
      method: "GET",
      headers: { accept: "application/json" },
    };

    switch (action) {
      case "heroes":
        url = `${baseUrl}/heroes?size=${params.size || 20}&index=${params.index || 1}&order=${params.order || "desc"}&lang=${params.lang || "en"}`;
        break;

      case "heroes-rank":
        url = `${baseUrl}/heroes/rank?days=${params.days || 1}&rank=${params.rank || "all"}&sort_field=${params.sort_field || "win_rate"}&sort_order=${params.sort_order || "desc"}&size=${params.size || 20}&index=${params.index || 1}&lang=${params.lang || "en"}`;
        console.log("Fetching rankings:", url);
        break;

      case "heroes-positions":
        let posUrl = `${baseUrl}/heroes/positions?`;
        if (Array.isArray(params.role)) {
          params.role.forEach((role) => (posUrl += `role=${role}&`));
        } else if (params.role) {
          posUrl += `role=${params.role}&`;
        }
        if (Array.isArray(params.lane)) {
          params.lane.forEach((lane) => (posUrl += `lane=${lane}&`));
        } else if (params.lane) {
          posUrl += `lane=${params.lane}&`;
        }
        url =
          posUrl +
          `size=${params.size || 20}&index=${params.index || 1}&order=${params.order || "desc"}&lang=${params.lang || "en"}`;
        break;

      case "hero-detail":
        if (!id)
          return res.status(400).json({ error: "Hero identifier is required" });
        url = `${baseUrl}/heroes/${id}?size=${params.size || 20}&index=${params.index || 1}&lang=${params.lang || "en"}`;
        break;

      case "hero-skill-combos":
        if (!id)
          return res.status(400).json({ error: "Hero identifier is required" });
        url = `${baseUrl}/heroes/${id}/skill-combos?size=${params.size || 20}&index=${params.index || 1}&lang=${params.lang || "en"}`;
        break;

      case "hero-relations":
        if (!id)
          return res.status(400).json({ error: "Hero identifier is required" });
        url = `${baseUrl}/heroes/${id}/relations?size=${params.size || 20}&index=${params.index || 1}&lang=${params.lang || "en"}`;
        break;

      case "hero-counters":
        if (!id)
          return res.status(400).json({ error: "Hero identifier is required" });
        url = `${baseUrl}/heroes/${id}/counters?days=${params.days || 1}&rank=${params.rank || "all"}&size=${params.size || 20}&index=${params.index || 1}&lang=${params.lang || "en"}`;
        break;

      case "hero-compatibility":
        if (!id)
          return res.status(400).json({ error: "Hero identifier is required" });
        url = `${baseUrl}/heroes/${id}/compatibility?days=${params.days || 1}&rank=${params.rank || "all"}&size=${params.size || 20}&index=${params.index || 1}&lang=${params.lang || "en"}`;
        break;

      case "hero-trends":
        if (!id)
          return res.status(400).json({ error: "Hero identifier is required" });
        url = `${baseUrl}/heroes/${id}/trends?days=${params.days || 7}&size=${params.size || 20}&index=${params.index || 1}&lang=${params.lang || "en"}`;
        break;

      case "hero-stats":
        if (!id)
          return res.status(400).json({ error: "Hero identifier is required" });
        url = `${baseUrl}/heroes/${id}/stats?lang=${params.lang || "en"}`;
        break;

      case "send-vc":
        if (req.method !== "POST")
          return res.status(405).json({ error: "Method not allowed" });
        const { roleId, zoneId } = req.body;
        if (!roleId || !zoneId)
          return res
            .status(400)
            .json({ error: "Role ID and Zone ID are required" });

        options = {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            role_id: parseInt(roleId),
            zone_id: parseInt(zoneId),
          }),
        };
        url = `${baseUrl}/user/auth/send-vc`;
        console.log("Sending VC:", url);
        break;

      case "login":
        if (req.method !== "POST")
          return res.status(405).json({ error: "Method not allowed" });
        const { roleId: rid, zoneId: zid, verificationCode } = req.body;
        if (!rid || !zid || !verificationCode)
          return res.status(400).json({ error: "Missing required fields" });

        options = {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            role_id: parseInt(rid),
            zone_id: parseInt(zid),
            vc: parseInt(verificationCode),
          }),
        };
        url = `${baseUrl}/user/auth/login`;
        console.log("Login:", url);
        break;

      case "user-info":
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace("Bearer ", "");
        if (!token) return res.status(401).json({ error: "No token provided" });

        options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        url = `${baseUrl}/user/info?lang=en`;
        console.log("User info:", url);
        break;

      default:
        return res.status(400).json({ error: "Invalid action" });
    }

    console.log("Fetching:", url);
    const response = await fetch(url, options);
    const data = await response.json();
    console.log("Response received");
    return res.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// ==================== PLAYER CHECKER (Keep existing) ====================
app.post("/api/check-player", async (req, res) => {
  try {
    const { userId, zoneId } = req.body;

    if (!userId || !zoneId) {
      return res
        .status(400)
        .json({ error: "User ID and Zone ID are required" });
    }

    console.log(`Checking player: ${userId} (${zoneId})`);

    const response = await fetch("https://order-sa.codashop.com/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        Origin: "https://www.codashop.com",
        Referer: "https://www.codashop.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        country: "PK",
        deviceId: "4eefb088-6f38-4297-9dc9-a29e2322a00e",
        userId: userId,
        zoneId: zoneId,
        voucherTypeName: "MOBILE_LEGENDS",
        whiteLabelId: "0",
      }),
    });

    const data = await response.json();
    console.log("Codashop response:", JSON.stringify(data));
    return res.json(data);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - GET/POST /api/mlbb?action=heroes`);
  console.log(`   - GET/POST /api/mlbb?action=heroes-rank`);
  console.log(`   - GET/POST /api/mlbb?action=heroes-positions`);
  console.log(`   - GET/POST /api/mlbb?action=hero-detail&id=Gusion`);
  console.log(`   - GET/POST /api/mlbb?action=send-vc`);
  console.log(`   - GET/POST /api/mlbb?action=login`);
  console.log(`   - GET /api/mlbb?action=user-info`);
  console.log(`   - POST /api/check-player`);
});
