<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>物聯網與感測技術監控平台 | IoT Core Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-container">
        <!-- Sidebar Navigation -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="logo-container">
                    <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="url(#logo-grad)"/>
                        <defs>
                            <linearGradient id="logo-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#00F2FE"/>
                                <stop offset="1" stop-color="#4FACFE"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <span class="logo-text">IoT<span class="logo-accent">.Core</span></span>
                </div>
                <button class="sidebar-toggle-btn" id="sidebar-close-btn" aria-label="關閉側邊欄">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <nav class="sidebar-nav">
                <button class="nav-item active" id="nav-dashboard" data-target="view-dashboard">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span>即時儀表板</span>
                </button>
                <button class="nav-item" id="nav-telemetry" data-target="view-telemetry">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    <span>感測器數據</span>
                </button>
                <button class="nav-item" id="nav-analytics" data-target="view-analytics">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    <span>趨勢分析</span>
                </button>
                <button class="nav-item" id="nav-media" data-target="view-media">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                    <span>學術影音</span>
                </button>
                <button class="nav-item" id="nav-docs" data-target="view-docs">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span>技術文件</span>
                </button>
            </nav>

            <div class="sidebar-footer">
                <div class="status-indicator">
                    <span class="pulse-dot"></span>
                    <span class="status-text">系統連線中</span>
                </div>
                <div class="uptime-counter" id="uptime-display">運作時間: 00:00:00</div>
            </div>
        </aside>

        <!-- Main Content Area -->
        <div class="main-wrapper">
            <!-- Header Bar -->
            <header class="main-header">
                <div class="header-left">
                    <button class="sidebar-open-btn" id="sidebar-open-btn" aria-label="開啟側邊欄">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <h1 class="page-title" id="page-title-display">即時儀表板</h1>
                </div>
                <div class="header-right">
                    <div class="header-clock" id="header-clock">2026/06/20 15:46:21</div>
                    <div class="user-badge">
                        <div class="user-avatar">AD</div>
                        <span class="user-name">監控工程師</span>
                    </div>
                </div>
            </header>

            <main class="content-container">
                <!-- VIEW 1: DASHBOARD -->
                <section class="content-view active" id="view-dashboard">
                    <!-- Stat Grid -->
                    <div class="metrics-grid">
                        <!-- Sensor Card 1: Temp -->
                        <div class="metric-card" id="card-temp">
                            <div class="card-glow"></div>
                            <div class="metric-header">
                                <span class="metric-label">感測器節點 A - 溫度</span>
                                <div class="metric-icon-wrap temp-icon">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>
                                </div>
                            </div>
                            <div class="metric-body">
                                <div class="metric-value-container">
                                    <span class="metric-value" id="val-temp">24.8</span>
                                    <span class="metric-unit">°C</span>
                                </div>
                                <div class="metric-trend positive" id="trend-temp">
                                    <span class="trend-arrow">↑</span>
                                    <span class="trend-text">+0.2°C (五分鐘內)</span>
                                </div>
                            </div>
                            <div class="metric-footer">
                                <span class="metric-status">狀態：正常</span>
                                <span class="metric-time" id="time-temp">剛才</span>
                            </div>
                        </div>

                        <!-- Sensor Card 2: Humid -->
                        <div class="metric-card" id="card-humid">
                            <div class="card-glow"></div>
                            <div class="metric-header">
                                <span class="metric-label">感測器節點 B - 濕度</span>
                                <div class="metric-icon-wrap humid-icon">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                                </div>
                            </div>
                            <div class="metric-body">
                                <div class="metric-value-container">
                                    <span class="metric-value" id="val-humid">62.5</span>
                                    <span class="metric-unit">% RH</span>
                                </div>
                                <div class="metric-trend negative" id="trend-humid">
                                    <span class="trend-arrow">↓</span>
                                    <span class="trend-text">-0.8% (五分鐘內)</span>
                                </div>
                            </div>
                            <div class="metric-footer">
                                <span class="metric-status">狀態：正常</span>
                                <span class="metric-time" id="time-humid">剛才</span>
                            </div>
                        </div>

                        <!-- Sensor Card 3: Vibration -->
                        <div class="metric-card" id="card-vibration">
                            <div class="card-glow"></div>
                            <div class="metric-header">
                                <span class="metric-label">感測器節點 C - 震動頻率</span>
                                <div class="metric-icon-wrap vibration-icon">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5v14M7 9v6M22 10v4M2 10v4"></path></svg>
                                </div>
                            </div>
                            <div class="metric-body">
                                <div class="metric-value-container">
                                    <span class="metric-value" id="val-vibration">48.2</span>
                                    <span class="metric-unit">Hz</span>
                                </div>
                                <div class="metric-trend stable" id="trend-vibration">
                                    <span class="trend-arrow">→</span>
                                    <span class="trend-text">波形維持穩定</span>
                                </div>
                            </div>
                            <div class="metric-footer">
                                <span class="metric-status">狀態：正常</span>
                                <span class="metric-time" id="time-vibration">剛才</span>
                            </div>
                        </div>

                        <!-- Sensor Card 4: Gateway -->
                        <div class="metric-card" id="card-gateway">
                            <div class="card-glow"></div>
                            <div class="metric-header">
                                <span class="metric-label">邊緣閘道器連線</span>
                                <div class="metric-icon-wrap gateway-icon">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                                </div>
                            </div>
                            <div class="metric-body">
                                <div class="metric-value-container">
                                    <span class="metric-value" id="val-ping">98</span>
                                    <span class="metric-unit">%</span>
                                </div>
                                <div class="metric-trend positive" id="trend-gateway">
                                    <span class="trend-arrow">↑</span>
                                    <span class="trend-text">閘道節點 3/3 線上</span>
                                </div>
                            </div>
                            <div class="metric-footer">
                                <span class="metric-status status-active">延遲：14 ms</span>
                                <span class="metric-time" id="time-gateway">剛才</span>
                            </div>
                        </div>
                    </div>

                    <!-- Mini Analytics / Secondary Section -->
                    <div class="dashboard-secondary-grid">
                        <div class="secondary-card interactive-preview">
                            <div class="card-header-actions">
                                <h3>即時數據流趨勢</h3>
                                <button class="btn-primary-mini" id="jump-to-chart-btn">查看完整分析</button>
                            </div>
                            <div class="mini-chart-container" id="overview-chart-container">
                                <!-- Will draw static/animated mini SVG inside app.js -->
                            </div>
                        </div>
                        <div class="secondary-card alerts-feed">
                            <h3>系統警報日誌</h3>
                            <div class="alert-list" id="alert-log-container">
                                <div class="alert-item info">
                                    <span class="alert-badge">資訊</span>
                                    <span class="alert-msg">物聯網邊緣閘道 Edge-GW-01 建立安全隧道連線。</span>
                                    <span class="alert-time">15:45</span>
                                </div>
                                <div class="alert-item success">
                                    <span class="alert-badge">成功</span>
                                    <span class="alert-msg">節點 C 震動校準完成，目前工作模式：高精度監測。</span>
                                    <span class="alert-time">15:40</span>
                                </div>
                                <div class="alert-item warning">
                                    <span class="alert-badge">警告</span>
                                    <span class="alert-msg">節點 A 溫度達到預設門檻 25°C，冷卻系統啟動。</span>
                                    <span class="alert-time">15:32</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- VIEW 2: TELEMETRY -->
                <section class="content-view" id="view-telemetry">
                    <div class="view-header-desc">
                        <h2>感測器數據串流</h2>
                        <p>顯示當前感測端點的物理量轉換數值。以下數據模擬自邊緣運算晶片轉換之物理訊號，每隔一秒自動獲取更新。</p>
                    </div>

                    <div class="telemetry-wrapper">
                        <div class="sensor-nodes-flex">
                            <!-- Node Detail Card A -->
                            <div class="node-detail-card">
                                <div class="node-banner temp-bg"></div>
                                <div class="node-content">
                                    <div class="node-tag">節點 A</div>
                                    <h3>溫度感測模組</h3>
                                    <div class="spec-list">
                                        <div class="spec-row"><span>物理量範圍</span><span>-40°C 至 +125°C</span></div>
                                        <div class="spec-row"><span>解析度精度</span><span>0.1°C / ±0.5°C</span></div>
                                        <div class="spec-row"><span>通訊協定</span><span>I2C / Modbus-RTU</span></div>
                                        <div class="spec-row"><span>當前電壓</span><span>3.3V (穩定)</span></div>
                                    </div>
                                    <div class="node-live-panel">
                                        <div class="live-val-box">
                                            <span class="live-label">即時量測值</span>
                                            <span class="live-val text-temp" id="tele-val-temp">24.8°C</span>
                                        </div>
                                        <div class="progress-bar-wrap">
                                            <div class="progress-bar-fill temp-bar" id="tele-bar-temp" style="width: 24.8%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Node Detail Card B -->
                            <div class="node-detail-card">
                                <div class="node-banner humid-bg"></div>
                                <div class="node-content">
                                    <div class="node-tag">節點 B</div>
                                    <h3>濕度感測模組</h3>
                                    <div class="spec-list">
                                        <div class="spec-row"><span>物理量範圍</span><span>0%RH 至 100%RH</span></div>
                                        <div class="spec-row"><span>解析度精度</span><span>0.05% / ±2%RH</span></div>
                                        <div class="spec-row"><span>通訊協定</span><span>GPIO / 1-Wire</span></div>
                                        <div class="spec-row"><span>當前電壓</span><span>3.3V (穩定)</span></div>
                                    </div>
                                    <div class="node-live-panel">
                                        <div class="live-val-box">
                                            <span class="live-label">即時量測值</span>
                                            <span class="live-val text-humid" id="tele-val-humid">62.5%</span>
                                        </div>
                                        <div class="progress-bar-wrap">
                                            <div class="progress-bar-fill humid-bar" id="tele-bar-humid" style="width: 62.5%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Node Detail Card C -->
                            <div class="node-detail-card">
                                <div class="node-banner vibration-bg"></div>
                                <div class="node-content">
                                    <div class="node-tag">節點 C</div>
                                    <h3>三軸加速度與震動感測</h3>
                                    <div class="spec-list">
                                        <div class="spec-row"><span>物理量範圍</span><span>0Hz 至 500Hz / ±16g</span></div>
                                        <div class="spec-row"><span>解析度精度</span><span>12-bit / ±0.01g</span></div>
                                        <div class="spec-row"><span>通訊協定</span><span>SPI / MQTT-JSON</span></div>
                                        <div class="spec-row"><span>當前電壓</span><span>5.0V (穩壓濾波)</span></div>
                                    </div>
                                    <div class="node-live-panel">
                                        <div class="live-val-box">
                                            <span class="live-label">即時量測值</span>
                                            <span class="live-val text-vibration" id="tele-val-vibration">48.2 Hz</span>
                                        </div>
                                        <div class="progress-bar-wrap">
                                            <div class="progress-bar-fill vibration-bar" id="tele-bar-vibration" style="width: 9.6%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Telemetry Grid Logs -->
                        <div class="data-logs-card">
                            <div class="table-header-bar">
                                <h3>即時數據封包串流 (即時更新)</h3>
                                <button class="btn-secondary-mini" id="btn-clear-logs">清除日誌</button>
                            </div>
                            <div class="table-scroll-wrapper">
                                <table class="telemetry-table">
                                    <thead>
                                        <tr>
                                            <th>時間戳記 (Timestamp)</th>
                                            <th>節點名稱 (Node ID)</th>
                                            <th>傳感類型 (Sensor Type)</th>
                                            <th>原始物理數據 (Value)</th>
                                            <th>連線訊號 (RSSI)</th>
                                            <th>狀態評定 (Status)</th>
                                        </tr>
                                    </thead>
                                    <tbody id="telemetry-table-body">
                                        <!-- Realtime rows will insert here via app.js -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- VIEW 3: ANALYTICS -->
                <section class="content-view" id="view-analytics">
                    <div class="view-header-desc">
                        <h2>物理特徵趨勢分析</h2>
                        <p>基於時序資料庫繪製的歷史監測趨勢圖表。您可以點選切換不同感測器，以動態觀察其量測趨勢與上下限警報區間。</p>
                    </div>

                    <div class="analytics-layout-grid">
                        <!-- Chart Control Panel -->
                        <div class="chart-controls">
                            <h3>圖表控制項</h3>
                            <div class="control-group">
                                <label>選擇感測維度</label>
                                <div class="segmented-control">
                                    <button class="segment-btn active" data-chart="temp">溫度 (°C)</button>
                                    <button class="segment-btn" data-chart="humid">濕度 (%RH)</button>
                                    <button class="segment-btn" data-chart="vibration">震動 (Hz)</button>
                                </div>
                            </div>
                            <div class="control-group">
                                <label>數據取樣率</label>
                                <select class="styled-select" id="sampling-rate">
                                    <option value="1">1 秒 (即時資料)</option>
                                    <option value="5" selected>5 秒 (滑動平均)</option>
                                    <option value="10">10 秒 (區間取樣)</option>
                                </select>
                            </div>
                            <div class="stat-summary-box">
                                <div class="stat-row"><span class="stat-label">數據集高值 Max</span><span class="stat-val text-primary" id="chart-stat-max">25.4</span></div>
                                <div class="stat-row"><span class="stat-label">數據集低值 Min</span><span class="stat-val text-primary" id="chart-stat-min">23.9</span></div>
                                <div class="stat-row"><span class="stat-label">數據均值 Avg</span><span class="stat-val text-primary" id="chart-stat-avg">24.5</span></div>
                                <div class="stat-row"><span class="stat-label">有效取樣點 Count</span><span class="stat-val" id="chart-stat-count">20 / 20</span></div>
                            </div>
                        </div>

                        <!-- Chart Canvas Surface -->
                        <div class="chart-display-card">
                            <div class="chart-display-header">
                                <h3 id="chart-title-label">感測器節點 A - 溫度監測曲線 (20點快照)</h3>
                                <span class="chart-badge">動態更新中</span>
                            </div>
                            <!-- Dynamic SVG chart render surface -->
                            <div class="svg-chart-wrapper" id="svg-chart-container">
                                <!-- SVG Element will be programmatically rendered here by app.js -->
                            </div>
                            <div class="chart-footer-legend">
                                <div class="legend-item"><span class="legend-dot primary-bg"></span><span>量測數據線</span></div>
                                <div class="legend-item"><span class="legend-dot border-bg"></span><span>警報上限 (28.0)</span></div>
                                <div class="legend-item"><span class="legend-dot alert-bg"></span><span>警報下限 (15.0)</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- VIEW 4: MEDIA HUB -->
                <section class="content-view" id="view-media">
                    <div class="view-header-desc">
                        <h2>學術影音中心</h2>
                        <p>精選物聯網感測核心技術、原理與實務案例之學術影片。您可以點選右側播放清單進行段落切換與學習。</p>
                    </div>

                    <div class="media-layout-grid">
                        <!-- Left: Responsive Iframe Player -->
                        <div class="video-player-card">
                            <div class="iframe-aspect-ratio">
                                <iframe id="youtube-player" src="" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                            </div>
                            <div class="video-info-panel">
                                <h3 id="current-video-title">載入中...</h3>
                                <p id="current-video-desc">載入中...</p>
                            </div>
                        </div>

                        <!-- Right: Styled Playlist Selector -->
                        <div class="playlist-selector-card">
                            <h3>影片清單 (Playlist)</h3>
                            <div class="playlist-items" id="playlist-container">
                                <!-- Playlist items injected by app.js -->
                            </div>
                        </div>
                    </div>
                </section>

                <!-- VIEW 5: TECHNICAL SPECIFICATIONS -->
                <section class="content-view" id="view-docs">
                    <div class="view-header-desc">
                        <h2>物聯網與感測技術</h2>
                        <p>物聯網（Internet of Things, IoT）是連結感測器、嵌入式軟體與通訊協定的實體聯網系統。以下為感測架構、常見感測模組之原理與規格說明。</p>
                    </div>

                    <div class="docs-accordion-container">
                        <!-- Section 1 -->
                        <div class="docs-section">
                            <div class="docs-section-header">
                                <h3>一、物聯網感測系統之分層架構</h3>
                                <span class="accordion-arrow"></span>
                            </div>
                            <div class="docs-section-content">
                                <p>現代物聯網（IoT）架構通常劃分為四個關鍵層級：</p>
                                <div class="tech-grid">
                                    <div class="tech-step-card">
                                        <div class="step-num">01</div>
                                        <h4>感測層 (Perception Layer)</h4>
                                        <p>藉由各種感測器（如熱敏電阻、MEMS加速度計、光學元件）將實體環境的溫度、濕度、壓力、光照等物理量轉換為類比或數位電氣訊號。</p>
                                    </div>
                                    <div class="tech-step-card">
                                        <div class="step-num">02</div>
                                        <h4>網路傳輸層 (Network Layer)</h4>
                                        <p>負責將數據從邊緣節點傳送至網關或雲端。常用技術包含近距離的 Zigbee、BLE、Wi-Fi，以及遠距離低功耗的 LoRaWAN、NB-IoT。</p>
                                    </div>
                                    <div class="tech-step-card">
                                        <div class="step-num">03</div>
                                        <h4>平台支撐層 (Middleware/Platform)</h4>
                                        <p>主要進行數據的儲存、解譯、安全性加密與邊緣分析。使用協定包括輕量化的 MQTT（Message Queuing Telemetry Transport）與 CoAP。</p>
                                    </div>
                                    <div class="tech-step-card">
                                        <div class="step-num">04</div>
                                        <h4>應用服務層 (Application Layer)</h4>
                                        <p>將感測數據轉化為決策依據的呈現介面。例如工業機台的健康監測儀表板、智慧農棚的自動灌溉中控台等。</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Section 2 -->
                        <div class="docs-section">
                            <div class="docs-section-header">
                                <h3>二、常見工業感測元件技術規格對照表</h3>
                                <span class="accordion-arrow"></span>
                            </div>
                            <div class="docs-section-content">
                                <table class="tech-table">
                                    <thead>
                                        <tr>
                                            <th>感測器類型</th>
                                            <th>感測原理</th>
                                            <th>量測物理量</th>
                                            <th>常見接口介面</th>
                                            <th>工業應用場景</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>溫濕度晶片</strong><br>(如 SHT 系列)</td>
                                            <td>電容式聚合物感測器 / 能隙半導體測溫</td>
                                            <td>溫度 (°C), 相對濕度 (%RH)</td>
                                            <td>I2C / 1-Wire</td>
                                            <td>晶圓廠潔淨室環境控制、智慧溫室、冷鏈物流監控</td>
                                        </tr>
                                        <tr>
                                            <td><strong>MEMS 加速度計</strong><br>(如 ADXL 系列)</td>
                                            <td>微機電系統矽片電容位移變形感測</td>
                                            <td>加速度 (g), 震動頻率 (Hz)</td>
                                            <td>SPI / I2C / 類比電壓</td>
                                            <td>旋轉機械（馬達、泵浦）預測性維護、結構健康監測</td>
                                        </tr>
                                        <tr>
                                            <td><strong>壓電壓力傳感器</strong></td>
                                            <td>壓電石英晶體受力產生極化電荷</td>
                                            <td>動態壓力 (Pa), 剪切力</td>
                                            <td>4-20mA 電流環 / RS485</td>
                                            <td>液壓管路監控、氣體管道壓力監測、重型自動化機台</td>
                                        </tr>
                                        <tr>
                                            <td><strong>光電/雷射測距感測器</strong></td>
                                            <td>飛行時間法 (ToF) / 三角光學定位原理</td>
                                            <td>位移距離, 物品計數</td>
                                            <td>IO-Link / Modbus</td>
                                            <td>傳送帶物品檢知、自動導引車 (AGV) 障礙物避障</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Section 3 -->
                        <div class="docs-section">
                            <div class="docs-section-header">
                                <h3>三、邊緣運算與雲端整合開發流程</h3>
                                <span class="accordion-arrow"></span>
                            </div>
                            <div class="docs-section-content">
                                <p>在感測監控系統的建置中，為了降低伺服器網路頻寬的負載與提高系統的反應速度，<strong>邊緣運算（Edge Computing）</strong>扮演著核心角色：</p>
                                <ul class="tech-list">
                                    <li><strong>微控制器（MCU）預處理</strong>：感測器採樣率可能高達數 kHz（例如震動感測）。微控制器在本地端執行快速傅立葉變換（FFT）或滑动平均濾波，過濾雜訊後再將平均值與特徵值傳送。</li>
                                    <li><strong>輕量化訊息傳輸（MQTT）</strong>：採用發佈/訂閱模式。相較於 HTTP，MQTT 的檔頭僅有 2 位元組，非常適合頻寬有限的無線網路場景（如 NB-IoT、LoRa）。</li>
                                    <li><strong>雲端儲存與 AI 分析</strong>：雲端平台（如 AWS IoT, Azure IoT Hub）收集各節點歷史數據，透過機器學習建立機台失效預估模型，並發送推播警報給維護人員。</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    </div>
    <script src="app.js"></script>
</body>
</html>
