import http from "node:http";
import { spawn, execSync, ChildProcess } from "node:child_process";

const PHP_PORT = 8080;
const SERVER_PORT = 3000;
let phpProcess: ChildProcess | null = null;

// Ensure PHP CLI is installed in Linux container
function ensurePhpInstalled() {
  try {
    execSync("which php", { stdio: "ignore" });
  } catch {
    console.log("PHP binary not found. Installing PHP CLI and SQLite/MySQL extensions...");
    try {
      execSync(
        "rm -f /var/lib/dpkg/lock* /var/lib/apt/lists/lock /var/cache/apt/archives/lock && " +
        "DEBIAN_FRONTEND=noninteractive apt-get update && " +
        "DEBIAN_FRONTEND=noninteractive dpkg --configure --force-confdef --force-confold -a && " +
        "DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends -o Dpkg::Options::='--force-confdef' -o Dpkg::Options::='--force-confold' php-cli php-sqlite3 php-mysql",
        { stdio: "inherit" }
      );
      console.log("PHP installed successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Failed to auto-install PHP:", msg);
    }
  }
}

// Ensure MariaDB daemon is running in Linux container
function ensureMariaDbRunning() {
  ensurePhpInstalled();
  try {
    execSync("/etc/init.d/mariadb status", { stdio: "ignore" });
    console.log("MariaDB service is already running.");
  } catch {
    try {
      console.log("Starting MariaDB service...");
      execSync("/etc/init.d/mariadb start || service mariadb start", { stdio: "inherit" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("Notice: MariaDB could not be started via service script:", msg);
    }
  }

  // Ensure carcare schema is initialized
  try {
    const dbCheck = execSync("mariadb -u root -e \"USE carcare; SHOW TABLES;\"", { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] });
    if (!dbCheck.includes("services")) {
      console.log("Initializing carcare database from database/schema.sql...");
      execSync("mariadb -u root < database/schema.sql", { stdio: "inherit" });
    }
  } catch {
    // SQLite fallback is configured in config/database.php
  }
}

// Start PHP 8 built-in server on localhost:8080 with router.php
function startPhpServer(): Promise<void> {
  return new Promise((resolve) => {
    ensureMariaDbRunning();

    console.log(`Starting PHP built-in server on 127.0.0.1:${PHP_PORT}...`);
    phpProcess = spawn("php", ["-S", `127.0.0.1:${PHP_PORT}`, "router.php"], {
      stdio: "inherit",
      env: {
        ...process.env,
        DB_HOST: process.env.DB_HOST || "127.0.0.1",
        DB_NAME: process.env.DB_NAME || "carcare",
        DB_USER: process.env.DB_USER || "root",
        DB_PASS: process.env.DB_PASS || "",
      },
    });

    phpProcess.on("error", (err) => {
      console.error("Failed to start PHP server:", err);
    });

    phpProcess.on("exit", (code) => {
      console.log(`PHP server exited with code ${code}`);
    });

    // Give PHP a brief moment to bind to socket
    setTimeout(resolve, 600);
  });
}

// Reverse proxy incoming requests on port 3000 to PHP on 8080
function createProxyServer() {
  const server = http.createServer((req, res) => {
    const options: http.RequestOptions = {
      hostname: "127.0.0.1",
      port: PHP_PORT,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: `127.0.0.1:${PHP_PORT}`,
        "x-forwarded-for": req.socket.remoteAddress || "127.0.0.1",
        "x-forwarded-proto": (req.headers["x-forwarded-proto"] as string) || "https",
        "x-forwarded-host": req.headers.host || `localhost:${SERVER_PORT}`,
      },
    };

    const proxyReq = http.request(options, (proxyRes) => {
      // Ensure cookies work inside iframe preview (SameSite=None; Secure; Partitioned)
      const headers = { ...proxyRes.headers };
      if (headers["set-cookie"]) {
        headers["set-cookie"] = headers["set-cookie"].map((cookieStr) => {
          let updated = cookieStr;
          if (!/;\s*Secure/i.test(updated)) {
            updated += "; Secure";
          }
          if (/;\s*SameSite=[^;]+/i.test(updated)) {
            updated = updated.replace(/;\s*SameSite=[^;]+/i, "; SameSite=None");
          } else {
            updated += "; SameSite=None";
          }
          if (!/;\s*Partitioned/i.test(updated)) {
            updated += "; Partitioned";
          }
          return updated;
        });
      }

      // Forward status code and processed headers
      res.writeHead(proxyRes.statusCode || 200, headers);
      proxyRes.pipe(res);
    });

    proxyReq.on("error", (err) => {
      console.error("Proxy error to PHP:", err.message);
      if (!res.headersSent) {
        res.writeHead(502, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`
          <div style="font-family:sans-serif;padding:40px;text-align:center;">
            <h2>Starting CarCare PHP Server...</h2>
            <p>The PHP automotive service backend is initializing. Please refresh in a few seconds.</p>
          </div>
        `);
      }
    });

    // Pipe request stream (POST/PUT body payload) to PHP
    req.pipe(proxyReq);
  });

  server.listen(SERVER_PORT, "0.0.0.0", () => {
    console.log(`CarCare PHP Full-Stack Gateway running at http://0.0.0.0:${SERVER_PORT}`);
  });
}

// Cleanup on exit
process.on("SIGINT", () => {
  if (phpProcess) phpProcess.kill();
  process.exit();
});

process.on("SIGTERM", () => {
  if (phpProcess) phpProcess.kill();
  process.exit();
});

startPhpServer().then(() => {
  createProxyServer();
});
