/**
 * IoT Core Dashboard - Logic and Visualization Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    const state = {
        uptime: 0,
        currentView: 'view-dashboard',
        activeChartDataset: 'temp', // 'temp', 'humid', 'vibration'
        samplingRate: 5, // in seconds
        samplingCounter: 0,
        // Live data histories (last 20 values for charting)
        history: {
            temp: [24.1, 24.2, 24.4, 24.5, 24.3, 24.6, 24.5, 24.7, 24.8, 24.6, 24.7, 24.9, 24.8, 25.0, 24.9, 24.7, 24.8, 25.1, 25.0, 24.8],
            humid: [64.2, 63.9, 63.5, 63.8, 63.2, 63.0, 62.7, 62.9, 63.1, 62.8, 62.5, 62.3, 62.6, 62.4, 62.8, 62.5, 62.1, 62.4, 62.6, 62.5],
            vibration: [45.2, 47.1, 49.0, 48.5, 46.8, 48.0, 52.3, 49.8, 47.5, 48.6, 50.1, 48.8, 47.9, 48.3, 46.9, 47.2, 48.5, 49.1, 48.7, 48.2]
        },
        timestamps: [], // Array of "HH:MM:SS" strings matching the history data points
        currentValues: {
            temp: 24.8,
            humid: 62.5,
            vibration: 48.2
        },
        trends: {
            temp: '+0.2°C',
            humid: '-0.8%',
            vibration: '穩定'
        },
        alertLogs: [
            { type: 'info', msg: '物聯網邊緣閘道 Edge-GW-01 建立安全隧道連線。', time: '15:45' },
            { type: 'success', msg: '節點 C 震動校準完成，目前工作模式：高精度監測。', time: '15:40' },
            { type: 'warning', msg: '節點 A 溫度達到預設門檻 25°C，冷卻系統啟動。', time: '15:32' }
        ],
        videos: [
            {
                id: 'zJ3OcGJQXzg',
                url: 'https://www.youtube.com/embed/zJ3OcGJQXzg?autoplay=1&rel=0',
                title: '物聯網與感測技術導論',
                desc: '本影片深入淺出地介紹了物聯網（IoT）的核心三層架構：感知層、傳輸層和應用層。影片中特別針對工業與商業感測元件（如溫濕度傳感器、震動感測晶片）的工作物理原理進行分析，並探討了物聯網在智慧城市和工業監控中的最新發展趨勢。',
                duration: '11:42',
                tag: '基礎技術'
            },
            {
                id: '2r8j2hG4kdM',
                url: 'https://www.youtube.com/embed/2r8j2hG4kdM?autoplay=1&rel=0',
                title: 'MEMS 微機電與三軸加速度計原理',
                desc: '本影音針對微機電系統（MEMS）的微型感測構造進行解析。展示了三軸加速度計如何在極小的晶片結構下，藉由矽片微小變形造成的電容改變，來精準量測物體在三維空間中的加速度、傾角與震動頻率，是工業預測性維護中最重要的感測器原理。',
                duration: '1:00',
                tag: '感測原理解析'
            },
            {
                id: 'YN_FUMXUT0o',
                url: 'https://www.youtube.com/embed/YN_FUMXUT0o?autoplay=1&rel=0',
                title: '感測技術與智慧製造物聯網應用',
                desc: '本影片說明了感測技術在智慧製造（工業 4.0）中的核心地位。內容介紹了工廠現場如何建置網格拓撲通訊（Mesh Network），將數百台設備的溫度、壓力與震動數據即時彙整，並透過低延遲傳輸發送至邊緣閘道進行初步篩選，以達成遠端自動化警報與製程優化。',
                duration: '15:20',
                tag: '工業實務'
            }
        ],
        activeVideoId: 'zJ3OcGJQXzg'
    };

    // Initialize timestamps backward from now
    const now = new Date();
    for (let i = 19; i >= 0; i--) {
        const timeOffset = new Date(now.getTime() - i * 5000);
        state.timestamps.push(formatTime(timeOffset));
    }

    // --- DOM Elements ---
    const dom = {
        clock: document.getElementById('header-clock'),
        uptime: document.getElementById('uptime-display'),
        sidebar: document.getElementById('sidebar'),
        sidebarClose: document.getElementById('sidebar-close-btn'),
        sidebarOpen: document.getElementById('sidebar-open-btn'),
        navItems: document.querySelectorAll('.nav-item'),
        views: document.querySelectorAll('.content-view'),
        pageTitle: document.getElementById('page-title-display'),
        
        // Dashboard live elements
        valTemp: document.getElementById('val-temp'),
        valHumid: document.getElementById('val-humid'),
        valVibration: document.getElementById('val-vibration'),
        trendTemp: document.getElementById('trend-temp'),
        trendHumid: document.getElementById('trend-humid'),
        trendVibration: document.getElementById('trend-vibration'),
        timeTemp: document.getElementById('time-temp'),
        timeHumid: document.getElementById('time-humid'),
        timeVibration: document.getElementById('time-vibration'),
        
        // Telemetry page elements
        teleValTemp: document.getElementById('tele-val-temp'),
        teleValHumid: document.getElementById('tele-val-humid'),
        teleValVibration: document.getElementById('tele-val-vibration'),
        teleBarTemp: document.getElementById('tele-bar-temp'),
        teleBarHumid: document.getElementById('tele-bar-humid'),
        teleBarVibration: document.getElementById('tele-bar-vibration'),
        teleTableBody: document.getElementById('telemetry-table-body'),
        btnClearLogs: document.getElementById('btn-clear-logs'),
        jumpToChartBtn: document.getElementById('jump-to-chart-btn'),
        alertLogContainer: document.getElementById('alert-log-container'),
        
        // Analytics page elements
        chartSegmentBtns: document.querySelectorAll('.segment-btn'),
        samplingRateSelect: document.getElementById('sampling-rate'),
        svgChartContainer: document.getElementById('svg-chart-container'),
        overviewChartContainer: document.getElementById('overview-chart-container'),
        chartTitleLabel: document.getElementById('chart-title-label'),
        chartStatMax: document.getElementById('chart-stat-max'),
        chartStatMin: document.getElementById('chart-stat-min'),
        chartStatAvg: document.getElementById('chart-stat-avg'),
        chartStatCount: document.getElementById('chart-stat-count'),
        
        // Media Page Elements
        youtubePlayer: document.getElementById('youtube-player'),
        videoTitle: document.getElementById('current-video-title'),
        videoDesc: document.getElementById('current-video-desc'),
        playlistContainer: document.getElementById('playlist-container'),
        
        // Accordion
        accordionHeaders: document.querySelectorAll('.docs-section-header')
    };

    // --- Core Functions & Initializer ---
    function init() {
        // Start timers
        setInterval(updateClock, 1000);
        setInterval(updateUptime, 1000);
        setInterval(generateRealTimeData, 1000); // Ticks every second, samples according to state.samplingRate

        // Set up View Toggles
        dom.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-target');
                switchView(target);
                
                // Toggle sidebar in mobile view
                if (window.innerWidth <= 1024) {
                    dom.sidebar.classList.remove('open');
                }
            });
        });

        // Mobile Sidebar Controls
        dom.sidebarOpen.addEventListener('click', () => dom.sidebar.classList.add('open'));
        dom.sidebarClose.addEventListener('click', () => dom.sidebar.classList.remove('open'));

        // Dashboard shortcuts
        dom.jumpToChartBtn.addEventListener('click', () => {
            switchView('view-analytics');
        });

        // Telemetry controls
        dom.btnClearLogs.addEventListener('click', () => {
            dom.teleTableBody.innerHTML = '';
        });

        // Chart dimension controls
        dom.chartSegmentBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                dom.chartSegmentBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.activeChartDataset = btn.getAttribute('data-chart');
                updateChartDisplay();
            });
        });

        dom.samplingRateSelect.addEventListener('change', (e) => {
            state.samplingRate = parseInt(e.target.value, 10);
            state.samplingCounter = 0;
        });

        // Accordion Controls
        dom.accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const parent = header.parentElement;
                parent.classList.toggle('open');
            });
        });
        // Default open the first section
        if (dom.accordionHeaders.length > 0) {
            dom.accordionHeaders[0].parentElement.classList.add('open');
        }

        // Initialize Media playlist & default video
        setupPlaylist();
        loadVideo(state.activeVideoId, false); // Don't autoplay on initial load

        // Initial chart drawing
        updateChartDisplay();
        drawMiniDashboardChart();
        updateStatsText();
    }

    // --- 1. Navigation & Views ---
    function switchView(targetViewId) {
        state.currentView = targetViewId;
        
        // Update View Display
        dom.views.forEach(view => {
            if (view.id === targetViewId) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        // Update Nav Menu active state
        dom.navItems.forEach(item => {
            if (item.getAttribute('data-target') === targetViewId) {
                item.classList.add('active');
                
                // Update header title
                const titleText = item.querySelector('span').textContent;
                dom.pageTitle.textContent = titleText;
            } else {
                item.classList.remove('active');
            }
        });

        // If switching to chart view, redraw to fit dimensions
        if (targetViewId === 'view-analytics') {
            setTimeout(updateChartDisplay, 50);
        }
    }

    // --- 2. Clock & Timers ---
    function updateClock() {
        const d = new Date();
        dom.clock.textContent = `${d.getFullYear()}/${padZero(d.getMonth() + 1)}/${padZero(d.getDate())} ${padZero(d.getHours())}:${padZero(d.getMinutes())}:${padZero(d.getSeconds())}`;
    }

    function updateUptime() {
        state.uptime++;
        const hours = Math.floor(state.uptime / 3600);
        const minutes = Math.floor((state.uptime % 3600) / 60);
        const seconds = state.uptime % 60;
        dom.uptime.textContent = `運作時間: ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }

    // --- 3. Simulated Sensor Data Engine ---
    function generateRealTimeData() {
        const timeNow = new Date();
        const timeStr = formatTime(timeNow);

        // Random Walk Algorithm for sensor values
        // Temperature: ~24.8°C, range [20, 30]
        let tempChange = (Math.random() - 0.5) * 0.4;
        state.currentValues.temp = parseFloat(Math.min(30.0, Math.max(20.0, state.currentValues.temp + tempChange)).toFixed(1));
        state.trends.temp = tempChange >= 0 ? `+${tempChange.toFixed(1)}°C` : `${tempChange.toFixed(1)}°C`;
        
        // Humidity: ~62.5%, range [40, 80]
        let humidChange = (Math.random() - 0.5) * 0.8;
        state.currentValues.humid = parseFloat(Math.min(80.0, Math.max(40.0, state.currentValues.humid + humidChange)).toFixed(1));
        state.trends.humid = humidChange >= 0 ? `+${humidChange.toFixed(1)}%` : `${humidChange.toFixed(1)}%`;

        // Vibration: ~48.2Hz, range [20, 120]
        let vibChange = (Math.random() - 0.5) * 3.0;
        state.currentValues.vibration = parseFloat(Math.min(120.0, Math.max(20.0, state.currentValues.vibration + vibChange)).toFixed(1));
        state.trends.vibration = Math.abs(vibChange) < 0.6 ? '穩定' : (vibChange >= 0 ? `+${vibChange.toFixed(1)}Hz` : `${vibChange.toFixed(1)}Hz`);

        // A. Update UI elements dynamically
        // Dashboard cards
        dom.valTemp.textContent = state.currentValues.temp;
        dom.valHumid.textContent = state.currentValues.humid;
        dom.valVibration.textContent = state.currentValues.vibration;
        
        updateTrendIndicator(dom.trendTemp, tempChange, state.trends.temp);
        updateTrendIndicator(dom.trendHumid, humidChange, state.trends.humid);
        
        // Vibration trend indicator
        if (state.trends.vibration === '穩定') {
            dom.trendVibration.className = 'metric-trend stable';
            dom.trendVibration.querySelector('.trend-arrow').textContent = '→';
            dom.trendVibration.querySelector('.trend-text').textContent = '波形維持穩定';
        } else {
            const isPos = vibChange >= 0;
            dom.trendVibration.className = isPos ? 'metric-trend positive' : 'metric-trend negative';
            dom.trendVibration.querySelector('.trend-arrow').textContent = isPos ? '↑' : '↓';
            dom.trendVibration.querySelector('.trend-text').textContent = `${state.trends.vibration} (五秒內)`;
        }

        // Sensor Live Telemetry details
        dom.teleValTemp.textContent = `${state.currentValues.temp}°C`;
        dom.teleValHumid.textContent = `${state.currentValues.humid}%`;
        dom.teleValVibration.textContent = `${state.currentValues.vibration} Hz`;

        // Progress bar fills (normalized percent ranges)
        // Temp range -40 to 125, let's map roughly to 0-100%
        let tempPct = Math.min(100, Math.max(0, ((state.currentValues.temp + 10) / 50) * 100)); // offset mapper
        dom.teleBarTemp.style.width = `${tempPct}%`;
        dom.teleBarHumid.style.width = `${state.currentValues.humid}%`;
        let vibrationPct = (state.currentValues.vibration / 120) * 100;
        dom.teleBarVibration.style.width = `${vibrationPct}%`;

        // B. Add logs into packet stream
        addPacketToLogs(timeStr);

        // C. Dynamic Alert generator (occasionally trigger alerts)
        triggerRandomAlerts(state.currentValues.temp, state.currentValues.humid, timeStr);

        // D. Samples data based on the sampling rate selection
        state.samplingCounter++;
        if (state.samplingCounter >= state.samplingRate) {
            state.samplingCounter = 0;
            
            // Append data to historical lists
            state.history.temp.push(state.currentValues.temp);
            state.history.temp.shift();
            state.history.humid.push(state.currentValues.humid);
            state.history.humid.shift();
            state.history.vibration.push(state.currentValues.vibration);
            state.history.vibration.shift();

            state.timestamps.push(timeStr);
            state.timestamps.shift();

            // Re-render chart views
            updateChartDisplay();
            drawMiniDashboardChart();
            updateStatsText();
        }
    }

    function addPacketToLogs(timeStr) {
        // Randomly pick one node to show in packet log per tick
        const nodes = [
            { id: 'Node-A_Temp', type: '溫度感測', val: `${state.currentValues.temp} °C` },
            { id: 'Node-B_Humid', type: '濕度感測', val: `${state.currentValues.humid} %RH` },
            { id: 'Node-C_Vibr', type: '三軸加速度', val: `${state.currentValues.vibration} Hz` }
        ];
        const selectedNode = nodes[Math.floor(Math.random() * nodes.length)];
        
        // Random RSSI signal
        const rssi = -60 - Math.floor(Math.random() * 18); // -60 to -78 dBm
        
        // Determine status
        let status = '正常';
        let statusClass = 'normal';
        if (selectedNode.id === 'Node-A_Temp' && state.currentValues.temp > 25.1) {
            status = '警戒';
            statusClass = 'warning';
        } else if (selectedNode.id === 'Node-B_Humid' && state.currentValues.humid > 75.0) {
            status = '警戒';
            statusClass = 'warning';
        }

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${timeStr}</td>
            <td><code class="code-ref">${selectedNode.id}</code></td>
            <td>${selectedNode.type}</td>
            <td><strong>${selectedNode.val}</strong></td>
            <td>${rssi} dBm</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
        `;

        dom.teleTableBody.insertBefore(newRow, dom.teleTableBody.firstChild);

        // Limit table rows to 25 to protect DOM
        if (dom.teleTableBody.children.length > 25) {
            dom.teleTableBody.removeChild(dom.teleTableBody.lastChild);
        }
    }

    function triggerRandomAlerts(temp, humid, timeStr) {
        // Alert checking
        let newAlert = null;
        if (temp > 25.1 && Math.random() < 0.1) {
            newAlert = {
                type: 'warning',
                msg: `節點 A 溫度偏高（現值 ${temp}°C），冷卻水閥流量自動調升。`,
                time: timeStr.substring(0, 5)
            };
        } else if (humid > 63.8 && Math.random() < 0.1) {
            newAlert = {
                type: 'info',
                msg: `空間環境相對濕度增加（現值 ${humid}%），除濕機進入節能模式。`,
                time: timeStr.substring(0, 5)
            };
        }

        if (newAlert) {
            // Push alert to array
            state.alertLogs.unshift(newAlert);
            if (state.alertLogs.length > 5) {
                state.alertLogs.pop();
            }

            // Repopulate alert list HTML
            dom.alertLogContainer.innerHTML = '';
            state.alertLogs.forEach(alert => {
                const badgeText = alert.type === 'warning' ? '警告' : (alert.type === 'success' ? '成功' : '資訊');
                const alertDiv = document.createElement('div');
                alertDiv.className = `alert-item ${alert.type}`;
                alertDiv.innerHTML = `
                    <span class="alert-badge">${badgeText}</span>
                    <span class="alert-msg">${alert.msg}</span>
                    <span class="alert-time">${alert.time}</span>
                `;
                dom.alertLogContainer.appendChild(alertDiv);
            });
        }
    }

    function updateTrendIndicator(element, change, text) {
        if (change >= 0) {
            element.className = 'metric-trend positive';
            element.querySelector('.trend-arrow').textContent = '↑';
            element.querySelector('.trend-text').textContent = `${text} (五分鐘內)`;
        } else {
            element.className = 'metric-trend negative';
            element.querySelector('.trend-arrow').textContent = '↓';
            element.querySelector('.trend-text').textContent = `${text} (五分鐘內)`;
        }
    }

    // --- 4. Custom SVG Charting Engine ---
    function updateChartDisplay() {
        const container = dom.svgChartContainer;
        if (!container || container.clientWidth === 0) return;

        const width = container.clientWidth;
        const height = container.clientHeight || 320;
        const padding = { top: 40, right: 30, bottom: 40, left: 50 };

        const dataset = state.history[state.activeChartDataset];
        const timestamps = state.timestamps;
        
        // Calculate dynamic bounds
        let maxVal = Math.max(...dataset);
        let minVal = Math.min(...dataset);
        const range = maxVal - minVal;
        
        // Add 10% padding to bounds
        maxVal = parseFloat((maxVal + (range * 0.1 || 1)).toFixed(1));
        minVal = parseFloat((minVal - (range * 0.1 || 1)).toFixed(1));
        
        const scaleX = (width - padding.left - padding.right) / (dataset.length - 1);
        const scaleY = (height - padding.top - padding.bottom) / (maxVal - minVal);

        // Normalize point coordinates
        const points = dataset.map((val, idx) => {
            const x = padding.left + idx * scaleX;
            const y = height - padding.bottom - (val - minVal) * scaleY;
            return { x, y, value: val, time: timestamps[idx] };
        });

        // Start drawing the SVG string
        let svg = `
            <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="chart-glow-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#00F2FE" stop-opacity="0.25"/>
                        <stop offset="100%" stop-color="#00F2FE" stop-opacity="0"/>
                    </linearGradient>
                    <linearGradient id="chart-stroke-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stop-color="#00F2FE"/>
                        <stop offset="100%" stop-color="#4FACFE"/>
                    </linearGradient>
                </defs>
        `;

        // Horizontal Gridlines and Y axis ticks
        const gridTicks = 4;
        for (let i = 0; i <= gridTicks; i++) {
            const yVal = minVal + (range || 4) * (i / gridTicks);
            const yCo = height - padding.bottom - (yVal - minVal) * scaleY;
            
            // Grid line
            svg += `<line x1="${padding.left}" y1="${yCo}" x2="${width - padding.right}" y2="${yCo}" stroke="rgba(255,255,255,0.04)" stroke-dasharray="4,4" />`;
            
            // Label
            svg += `<text x="${padding.left - 12}" y="${yCo + 4}" fill="#6B7280" font-size="11" text-anchor="end" font-family="Inter">${yVal.toFixed(1)}</text>`;
        }

        // X axis ticks (timestamps)
        const tickStep = 4; // Show timestamp every 4 points
        for (let i = 0; i < points.length; i += tickStep) {
            svg += `<text x="${points[i].x}" y="${height - 12}" fill="#6B7280" font-size="11" text-anchor="middle" font-family="Inter">${points[i].time}</text>`;
        }

        // Alarm lines (Thresholds indicator)
        const alarmUpperY = height - padding.bottom - (28.0 - minVal) * scaleY;
        const alarmLowerY = height - padding.bottom - (15.0 - minVal) * scaleY;

        if (state.activeChartDataset === 'temp') {
            // Draw temperature upper limit (e.g. 28°C)
            if (alarmUpperY > padding.top && alarmUpperY < height - padding.bottom) {
                svg += `<line x1="${padding.left}" y1="${alarmUpperY}" x2="${width - padding.right}" y2="${alarmUpperY}" stroke="rgba(245,158,11,0.25)" stroke-width="1.5" stroke-dasharray="6,4" />`;
                svg += `<text x="${width - padding.right - 10}" y="${alarmUpperY - 6}" fill="rgba(245,158,11,0.6)" font-size="10" text-anchor="end" font-family="Outfit">溫度上限門檻 (28.0°C)</text>`;
            }
        }

        // Construct linear path coordinates (Line and Area)
        let pathD = '';
        let areaD = `M ${points[0].x} ${height - padding.bottom} `;
        
        points.forEach((pt, idx) => {
            if (idx === 0) {
                pathD += `M ${pt.x} ${pt.y} `;
                areaD += `L ${pt.x} ${pt.y} `;
            } else {
                // Using bezier curves for smooth tech lines
                const prevPt = points[idx - 1];
                const cpX1 = prevPt.x + (pt.x - prevPt.x) / 2;
                const cpY1 = prevPt.y;
                const cpX2 = prevPt.x + (pt.x - prevPt.x) / 2;
                const cpY2 = pt.y;
                
                pathD += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y} `;
                areaD += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y} `;
            }
        });

        areaD += `L ${points[points.length - 1].x} ${height - padding.bottom} Z`;

        // Draw filled gradient area
        svg += `<path d="${areaD}" fill="url(#chart-glow-grad)" />`;

        // Draw active data line path
        svg += `<path d="${pathD}" fill="none" stroke="url(#chart-stroke-grad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`;

        // Interactive hover nodes (dots on path)
        points.forEach((pt, idx) => {
            svg += `
                <circle cx="${pt.x}" cy="${pt.y}" r="3" fill="#0B0F19" stroke="#00F2FE" stroke-width="1.5" class="chart-point" data-index="${idx}" style="cursor: pointer;" />
                <circle cx="${pt.x}" cy="${pt.y}" r="8" fill="transparent" class="chart-hover-trigger" data-index="${idx}" style="cursor: pointer;" />
            `;
        });

        // Draw a vertical hover tracker guideline
        svg += `<line id="svg-guideline" x1="0" y1="${padding.top}" x2="0" y2="${height - padding.bottom}" stroke="rgba(0, 242, 254, 0.3)" stroke-width="1" style="display: none;" />`;

        svg += `</svg>`;
        container.innerHTML = svg + `<div class="chart-tooltip" id="chart-tooltip-bubble"><div class="chart-tooltip-time"></div><div class="chart-tooltip-val"></div></div>`;

        // E. Bind interactive hover actions on points
        setupChartHoverInteractions(container, points, width, height, padding);
    }

    function setupChartHoverInteractions(container, points, width, height, padding) {
        const tooltip = container.querySelector('#chart-tooltip-bubble');
        const guideline = container.querySelector('#svg-guideline');
        const pointsElements = container.querySelectorAll('.chart-point');

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            
            // Limit bounds to graph area
            if (mouseX < padding.left || mouseX > width - padding.right) {
                if (tooltip) tooltip.style.display = 'none';
                if (guideline) guideline.style.display = 'none';
                return;
            }

            // Find closest coordinate point
            let closestPt = points[0];
            let minDist = Math.abs(mouseX - points[0].x);
            let closestIdx = 0;

            points.forEach((pt, idx) => {
                const dist = Math.abs(mouseX - pt.x);
                if (dist < minDist) {
                    minDist = dist;
                    closestPt = pt;
                    closestIdx = idx;
                }
            });

            // Display guide line and update its position
            if (guideline) {
                guideline.setAttribute('x1', closestPt.x);
                guideline.setAttribute('x2', closestPt.x);
                guideline.style.display = 'block';
            }

            // Highlight corresponding point dot
            pointsElements.forEach((el, idx) => {
                if (idx === closestIdx) {
                    el.setAttribute('r', '5');
                    el.setAttribute('fill', '#00F2FE');
                } else {
                    el.setAttribute('r', '3');
                    el.setAttribute('fill', '#0B0F19');
                }
            });

            // Position and display popup tooltip
            if (tooltip) {
                tooltip.style.display = 'block';
                tooltip.style.left = `${closestPt.x + 10}px`;
                tooltip.style.top = `${closestPt.y - 45}px`;
                tooltip.querySelector('.chart-tooltip-time').textContent = closestPt.time;
                
                let unit = '';
                if (state.activeChartDataset === 'temp') unit = '°C';
                else if (state.activeChartDataset === 'humid') unit = '% RH';
                else if (state.activeChartDataset === 'vibration') unit = ' Hz';
                
                tooltip.querySelector('.chart-tooltip-val').textContent = `${closestPt.value} ${unit}`;
            }
        });

        container.addEventListener('mouseleave', () => {
            if (tooltip) tooltip.style.display = 'none';
            if (guideline) guideline.style.display = 'none';
            pointsElements.forEach(el => {
                el.setAttribute('r', '3');
                el.setAttribute('fill', '#0B0F19');
            });
        });
    }

    // Mini preview chart in Dashboard View
    function drawMiniDashboardChart() {
        const container = dom.overviewChartContainer;
        if (!container || container.clientWidth === 0) return;

        const width = container.clientWidth;
        const height = container.clientHeight || 180;
        const padding = { top: 15, right: 10, bottom: 20, left: 30 };

        const dataset = state.history.temp; // Draw temperature preview by default
        
        let maxVal = Math.max(...dataset);
        let minVal = Math.min(...dataset);
        const range = maxVal - minVal;
        
        maxVal = maxVal + (range * 0.1 || 0.5);
        minVal = minVal - (range * 0.1 || 0.5);

        const scaleX = (width - padding.left - padding.right) / (dataset.length - 1);
        const scaleY = (height - padding.top - padding.bottom) / (maxVal - minVal);

        let pathD = '';
        let areaD = `M ${padding.left} ${height - padding.bottom} `;

        dataset.forEach((val, idx) => {
            const x = padding.left + idx * scaleX;
            const y = height - padding.bottom - (val - minVal) * scaleY;
            if (idx === 0) {
                pathD += `M ${x} ${y} `;
                areaD += `L ${x} ${y} `;
            } else {
                const prevX = padding.left + (idx - 1) * scaleX;
                const prevY = height - padding.bottom - (dataset[idx - 1] - minVal) * scaleY;
                const cpX1 = prevX + (x - prevX) / 2;
                const cpY1 = prevY;
                const cpX2 = prevX + (x - prevX) / 2;
                const cpY2 = y;
                pathD += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y} `;
                areaD += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y} `;
            }
        });

        areaD += `L ${padding.left + (dataset.length - 1) * scaleX} ${height - padding.bottom} Z`;

        let svg = `
            <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="mini-glow-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#00F2FE" stop-opacity="0.15"/>
                        <stop offset="100%" stop-color="#00F2FE" stop-opacity="0"/>
                    </linearGradient>
                </defs>
                <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="rgba(255,255,255,0.03)" />
                <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="rgba(255,255,255,0.06)" />
                <text x="${padding.left - 8}" y="${padding.top + 4}" fill="#6B7280" font-size="9" text-anchor="end" font-family="Inter">${maxVal.toFixed(1)}</text>
                <text x="${padding.left - 8}" y="${height - padding.bottom + 3}" fill="#6B7280" font-size="9" text-anchor="end" font-family="Inter">${minVal.toFixed(1)}</text>
                
                <path d="${areaD}" fill="url(#mini-glow-grad)" />
                <path d="${pathD}" fill="none" stroke="#00F2FE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        `;
        container.innerHTML = svg;
    }

    function updateStatsText() {
        const dataset = state.history[state.activeChartDataset];
        
        let maxVal = Math.max(...dataset);
        let minVal = Math.min(...dataset);
        let sum = dataset.reduce((a, b) => a + b, 0);
        let avgVal = sum / dataset.length;

        dom.chartStatMax.textContent = maxVal.toFixed(1);
        dom.chartStatMin.textContent = minVal.toFixed(1);
        dom.chartStatAvg.textContent = avgVal.toFixed(1);
        dom.chartStatCount.textContent = `${dataset.length} / ${dataset.length}`;

        let titleStr = '';
        if (state.activeChartDataset === 'temp') {
            titleStr = `感測器節點 A - 溫度監測時序 (共 ${dataset.length} 取樣點)`;
        } else if (state.activeChartDataset === 'humid') {
            titleStr = `感測器節點 B - 濕度監測時序 (共 ${dataset.length} 取樣點)`;
        } else if (state.activeChartDataset === 'vibration') {
            titleStr = `感測器節點 C - 機器震動頻率時序 (共 ${dataset.length} 取樣點)`;
        }
        dom.chartTitleLabel.textContent = titleStr;
    }

    // --- 5. Media Hub / Youtube Playlist Manager ---
    function setupPlaylist() {
        dom.playlistContainer.innerHTML = '';
        state.videos.forEach(vid => {
            const item = document.createElement('button');
            item.className = `playlist-item ${vid.id === state.activeVideoId ? 'active' : ''}`;
            item.setAttribute('data-id', vid.id);
            item.innerHTML = `
                <div class="playlist-thumb">
                    <!-- Standard Play SVG Icon -->
                    <svg class="playlist-thumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
                <div class="playlist-meta">
                    <span class="playlist-title">${vid.title}</span>
                    <span class="playlist-subtext">${vid.tag} • 長度: ${vid.duration}</span>
                </div>
            `;
            
            item.addEventListener('click', () => {
                // Remove all active states
                document.querySelectorAll('.playlist-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                
                loadVideo(vid.id, true); // Autoplay when clicked
            });

            dom.playlistContainer.appendChild(item);
        });
    }

    function loadVideo(id, autoplay) {
        state.activeVideoId = id;
        const videoData = state.videos.find(v => v.id === id);
        
        if (videoData) {
            // Setup correct embed link
            const baseUrl = `https://www.youtube.com/embed/${id}`;
            const queryParams = autoplay ? '?autoplay=1&rel=0' : '?autoplay=0&rel=0';
            dom.youtubePlayer.src = baseUrl + queryParams;
            
            // Update labels
            dom.videoTitle.textContent = videoData.title;
            dom.videoDesc.textContent = videoData.desc;
        }
    }

    // --- Auxiliary Utilities ---
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    function formatTime(date) {
        return `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
    }

    // Window Resize event - Redraw charts dynamically to fit container widths
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateChartDisplay();
            drawMiniDashboardChart();
        }, 150);
    });

    // Run Dashboard Initialization
    init();
});
