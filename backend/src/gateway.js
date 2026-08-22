import http from 'http';
import httpProxy from 'http-proxy';

/**
 * Node.js Dynamic Auto-Discovery Load Balancer Gateway
 * Automatically scans and detects active backend instances (ports 5000 - 5010)
 * dynamically adjusts the pool when new instances start or stop.
 */

const GATEWAY_PORT = process.env.GATEWAY_PORT || 8080;
const SCAN_START_PORT = parseInt(process.env.SCAN_START_PORT, 10) || 5000;
const SCAN_END_PORT = parseInt(process.env.SCAN_END_PORT, 10) || 5005;
const HEALTH_CHECK_INTERVAL_MS = 3000;

// Dynamic active servers pool
let activeServers = [];
let currentIndex = 0;

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: true,
});

proxy.on('error', (err, req, res) => {
  console.error('[LoadBalancer] Proxy error:', err.message);
  if (res && !res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: false,
        message: 'Bad Gateway: No active backend instance available. Retrying discovery...',
      })
    );
  }
});

/**
 * Check if a backend port is responding to health checks
 */
async function checkPortHealth(port) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const response = await fetch(`http://127.0.0.1:${port}/api/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        port,
        target: `http://127.0.0.1:${port}`,
        name: `Worker-${port}`,
        status: data.status || 'ok',
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Auto-discovery scan routine
 */
async function scanAndDiscoverServers() {
  const promises = [];
  for (let port = SCAN_START_PORT; port <= SCAN_END_PORT; port++) {
    promises.push(checkPortHealth(port));
  }

  const results = await Promise.all(promises);
  const discovered = results.filter(Boolean);

  const prevPorts = activeServers.map((s) => s.port).sort().join(',');
  const newPorts = discovered.map((s) => s.port).sort().join(',');

  if (prevPorts !== newPorts) {
    activeServers = discovered;
    console.log('----------------------------------------------------------------');
    console.log(`[Auto-Discovery] Detected ${activeServers.length} active backend instance(s):`);
    if (activeServers.length === 0) {
      console.log(`⚠️  No backend instances found running on ports ${SCAN_START_PORT}-${SCAN_END_PORT}. Waiting...`);
    } else {
      activeServers.forEach((s) => {
        console.log(`   🟢 [${s.name}] active on ${s.target}`);
      });
    }
    console.log('----------------------------------------------------------------');
  }
}

// Request Handler
const server = http.createServer((req, res) => {
  if (activeServers.length === 0) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    return res.end(
      JSON.stringify({
        success: false,
        message: `Service Unavailable: No backend instance is currently running on ports ${SCAN_START_PORT}-${SCAN_END_PORT}.`,
      })
    );
  }

  // Round-robin over active discovered servers
  currentIndex = currentIndex % activeServers.length;
  const targetServer = activeServers[currentIndex];
  currentIndex = (currentIndex + 1) % activeServers.length;

  console.log(`[LoadBalancer] ${req.method} ${req.url} --> [${targetServer.name}] (${targetServer.target})`);

  proxy.web(req, res, {
    target: targetServer.target,
    headers: {
      'X-Forwarded-For': req.socket.remoteAddress,
      'X-Forwarded-Host': req.headers.host,
      'X-Gateway': 'Dynamic-AutoDiscovery-LoadBalancer',
      'X-Served-By': targetServer.name,
    },
  });
});

// Start Server and Discovery
server.listen(GATEWAY_PORT, async () => {
  console.log('================================================================');
  console.log(`🚀 Dynamic Auto-Discovery Load Balancer on http://localhost:${GATEWAY_PORT}`);
  console.log(`🔍 Auto-scanning ports ${SCAN_START_PORT} - ${SCAN_END_PORT} every ${HEALTH_CHECK_INTERVAL_MS / 1000}s...`);
  console.log('================================================================');

  // Initial scan
  await scanAndDiscoverServers();

  // Periodic health scan
  setInterval(scanAndDiscoverServers, HEALTH_CHECK_INTERVAL_MS);
});
