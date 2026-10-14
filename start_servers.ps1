# OlympiadHub Auto Server Manager
$ErrorActionPreference = 'SilentlyContinue'

# 1. Check if port 3000 (Vite) is running
$viteConn = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if (-not $viteConn) {
    Start-Process -FilePath "cmd.exe" -ArgumentList '/c', 'set PATH=C:\Users\HP\node-portable\node-v20.18.0-win-x64;%PATH% && cd /d C:\Users\HP\.gemini\antigravity\scratch\olympiadhub\frontend && npx vite --port 3000 --host' -WindowStyle Hidden
}

# 2. Check if port 8000 (PHP) is running
$phpConn = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
if (-not $phpConn) {
    Start-Process -FilePath "cmd.exe" -ArgumentList '/c', 'C:\xampp\php\php.exe -S 127.0.0.1:8000 -t C:\Users\HP\.gemini\antigravity\scratch\olympiadhub\backend\public' -WindowStyle Hidden
}

# 3. Wait briefly for server to be responsive
$attempts = 0
while ($attempts -lt 15) {
    try {
        $res = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 1
        if ($res.StatusCode -eq 200) { break }
    } catch {}
    Start-Sleep -Milliseconds 600
    $attempts++
}
