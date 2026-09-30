import type { Consumer, AreaSummary, AlertItem, DailyDemandPoint, ModelMetric, FeatureImportanceItem, RiskLevel, ConsumerType, AlertStatus } from '../types';

// Area metadata definition
export const MOCK_AREAS: AreaSummary[] = [
  {
    name: 'Whitefield',
    totalConsumers: 1842,
    expectedLoadMWh: 486,
    actualLoadMWh: 421,
    deviationPercent: -13.4,
    anomaliesCount: 31,
    highRiskCount: 8,
    estimatedLossINR: 240000, // ₹2.4L
    riskLevel: 'HIGH',
    coordinates: { x: 78, y: 35 }
  },
  {
    name: 'Marathahalli',
    totalConsumers: 2315,
    expectedLoadMWh: 540,
    actualLoadMWh: 482,
    deviationPercent: -10.7,
    anomaliesCount: 27,
    highRiskCount: 6,
    estimatedLossINR: 190000, // ₹1.9L
    riskLevel: 'HIGH',
    coordinates: { x: 62, y: 48 }
  },
  {
    name: 'Electronic City',
    totalConsumers: 2104,
    expectedLoadMWh: 610,
    actualLoadMWh: 568,
    deviationPercent: -6.9,
    anomaliesCount: 21,
    highRiskCount: 4,
    estimatedLossINR: 130000, // ₹1.3L
    riskLevel: 'MEDIUM',
    coordinates: { x: 45, y: 75 }
  },
  {
    name: 'HSR Layout',
    totalConsumers: 1765,
    expectedLoadMWh: 410,
    actualLoadMWh: 388,
    deviationPercent: -5.3,
    anomaliesCount: 16,
    highRiskCount: 3,
    estimatedLossINR: 98000, // ₹98K
    riskLevel: 'MEDIUM',
    coordinates: { x: 38, y: 55 }
  },
  {
    name: 'Sarjapur',
    totalConsumers: 2482,
    expectedLoadMWh: 520,
    actualLoadMWh: 504,
    deviationPercent: -3.1,
    anomaliesCount: 12,
    highRiskCount: 2,
    estimatedLossINR: 62000, // ₹62K
    riskLevel: 'LOW',
    coordinates: { x: 82, y: 65 }
  },
  {
    name: 'Bellandur',
    totalConsumers: 1940,
    expectedLoadMWh: 460,
    actualLoadMWh: 449,
    deviationPercent: -2.4,
    anomaliesCount: 9,
    highRiskCount: 1,
    estimatedLossINR: 45000, // ₹45K
    riskLevel: 'LOW',
    coordinates: { x: 55, y: 42 }
  },
  {
    name: 'KR Puram',
    totalConsumers: 1510,
    expectedLoadMWh: 380,
    actualLoadMWh: 372,
    deviationPercent: -2.1,
    anomaliesCount: 7,
    highRiskCount: 1,
    estimatedLossINR: 38000, // ₹38K
    riskLevel: 'LOW',
    coordinates: { x: 72, y: 22 }
  },
  {
    name: 'Indiranagar',
    totalConsumers: 2120,
    expectedLoadMWh: 510,
    actualLoadMWh: 506,
    deviationPercent: -0.8,
    anomaliesCount: 5,
    highRiskCount: 0,
    estimatedLossINR: 22000, // ₹22K
    riskLevel: 'NORMAL',
    coordinates: { x: 30, y: 30 }
  }
];

// Helper to generate monthly history with intentional drops for anomalies
function generateMonthlyHistory(expectedBase: number, dropLast3Months: boolean = false, dropPercent: number = 0) {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  return months.map((month, idx) => {
    // Seasonal factor (higher in summer: Apr-Jul)
    const seasonal = (idx >= 6 && idx <= 9) ? 1.2 : 1.0;
    const expected = Math.round(expectedBase * seasonal * (0.95 + Math.random() * 0.1));
    let actual = expected;
    
    if (dropLast3Months && idx >= 9) {
      actual = Math.round(expected * (1 - dropPercent / 100));
    } else {
      actual = Math.round(expected * (0.96 + Math.random() * 0.08));
    }
    
    return { month, expected, actual };
  });
}

// Key prominent consumers required by prompt
const KEY_CONSUMERS: Consumer[] = [
  {
    id: 'C-10482',
    name: 'Sri Krishna Residency',
    area: 'Whitefield',
    consumerType: 'Residential',
    meterAgeYears: 4,
    avgMonthlyConsumption: 284,
    expectedConsumption: 390,
    actualConsumption: 128,
    consumptionDeviation: -67.2,
    nightUsage: 'High',
    historicalVariance: 'High',
    peerDeviationPercentile: 92,
    suddenLoadChange: true,
    anomalyScore: 0.91,
    riskLevel: 'HIGH',
    estimatedLoss: 18500,
    status: 'Investigation',
    lastUpdated: '2 min ago',
    coordinates: { x: 22, y: 82 },
    aiExplanation: 'Consumer C-10482 shows a sustained deviation from its historical consumption baseline. Consumption decreased by approximately 67% despite similar seasonal conditions and neighboring consumer demand remaining stable. The pattern is statistically unusual and warrants field inspection.',
    history: generateMonthlyHistory(390, true, 67.2)
  },
  {
    id: 'C-08721',
    name: 'Verma Cold Storage',
    area: 'Marathahalli',
    consumerType: 'Commercial',
    meterAgeYears: 6,
    avgMonthlyConsumption: 420,
    expectedConsumption: 420,
    actualConsumption: 176,
    consumptionDeviation: -58.1,
    nightUsage: 'High',
    historicalVariance: 'High',
    peerDeviationPercentile: 89,
    suddenLoadChange: true,
    anomalyScore: 0.87,
    riskLevel: 'HIGH',
    estimatedLoss: 24200,
    status: 'Reviewing',
    lastUpdated: '31 min ago',
    coordinates: { x: 18, y: 74 },
    aiExplanation: 'Abnormal night-time consumption drop detected. Facility load drops abruptly during non-operating hours while connected transformer maintains baseline voltage. High probability of meter bypass.',
    history: generateMonthlyHistory(420, true, 58.1)
  },
  {
    id: 'C-19382',
    name: 'Apex Small Scale Fabrication',
    area: 'Electronic City',
    consumerType: 'Industrial',
    meterAgeYears: 3,
    avgMonthlyConsumption: 285,
    expectedConsumption: 285,
    actualConsumption: 194,
    consumptionDeviation: -31.9,
    nightUsage: 'Normal',
    historicalVariance: 'High',
    peerDeviationPercentile: 78,
    suddenLoadChange: true,
    anomalyScore: 0.71,
    riskLevel: 'MEDIUM',
    estimatedLoss: 14200,
    status: 'Reviewing',
    lastUpdated: '48 min ago',
    coordinates: { x: 35, y: 62 },
    aiExplanation: 'Sudden load change detected across peak operational shifts. Consumption level sits 31.9% below peer industrial baseline in Electronic City Cluster 4.',
    history: generateMonthlyHistory(285, true, 31.9)
  },
  {
    id: 'C-04912',
    name: 'Greenwoods Apartment B-402',
    area: 'Whitefield',
    consumerType: 'Residential',
    meterAgeYears: 5,
    avgMonthlyConsumption: 310,
    expectedConsumption: 350,
    actualConsumption: 110,
    consumptionDeviation: -68.5,
    nightUsage: 'High',
    historicalVariance: 'High',
    peerDeviationPercentile: 94,
    suddenLoadChange: true,
    anomalyScore: 0.93,
    riskLevel: 'HIGH',
    estimatedLoss: 16800,
    status: 'Investigation',
    lastUpdated: '1 hour ago',
    coordinates: { x: 15, y: 88 },
    aiExplanation: 'Zero night-time consumption recorded despite registered active occupancy. Potential neutral isolation or shunt injection detected.',
    history: generateMonthlyHistory(350, true, 68.5)
  },
  {
    id: 'C-15209',
    name: 'Metro Plaza Bakers',
    area: 'HSR Layout',
    consumerType: 'Commercial',
    meterAgeYears: 2,
    avgMonthlyConsumption: 510,
    expectedConsumption: 530,
    actualConsumption: 360,
    consumptionDeviation: -32.0,
    nightUsage: 'Normal',
    historicalVariance: 'Normal',
    peerDeviationPercentile: 75,
    suddenLoadChange: false,
    anomalyScore: 0.68,
    riskLevel: 'MEDIUM',
    estimatedLoss: 12100,
    status: 'New',
    lastUpdated: '2 hours ago',
    coordinates: { x: 42, y: 58 },
    aiExplanation: 'Consistent negative drift relative to historical 24-month profile. Secondary meter current transformer mismatch suspected.',
    history: generateMonthlyHistory(530, true, 32.0)
  }
];

// Generator for the remaining 495 consumers to hit 500 total dataset
function generateConsumersDataset(): Consumer[] {
  const areas = ['Whitefield', 'Marathahalli', 'Electronic City', 'HSR Layout', 'Sarjapur', 'Bellandur', 'KR Puram', 'Indiranagar'];
  const types: ConsumerType[] = ['Residential', 'Commercial', 'Industrial'];
  const namesPrefix = ['Sunrise', 'Royal', 'Global', 'Tech', 'Heritage', 'Lotus', 'Skyline', 'Zenith', 'Pinnacle', 'Vanguard', 'Urban', 'Central'];
  const namesSuffix = ['Villa', 'Enclave', 'Enterprises', 'Store', 'Hub', 'Towers', 'Complex', 'Mart', 'Lab', 'Station'];
  
  const dataset: Consumer[] = [...KEY_CONSUMERS];

  // We need: ~15 high risk total (5 key + 10 generated), 25 medium risk total (2 key + 23 generated), 60 low risk total, 400 normal total
  const remainingHigh = 10;
  const remainingMedium = 23;
  const remainingLow = 60;
  const remainingNormal = 402;

  let idCounter = 20000;

  const createConsumer = (risk: RiskLevel): Consumer => {
    idCounter++;
    const id = `C-${idCounter}`;
    const area = areas[Math.floor(Math.random() * areas.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const name = `${namesPrefix[Math.floor(Math.random() * namesPrefix.length)]} ${namesSuffix[Math.floor(Math.random() * namesSuffix.length)]}`;
    const meterAge = Math.floor(Math.random() * 8) + 1;
    
    let expected = 150 + Math.floor(Math.random() * 450); // 150-600 kWh
    if (type === 'Industrial') expected *= 2.5;
    if (type === 'Commercial') expected *= 1.5;

    let devPercent = 0;
    let score = 0;
    let nightUsage: 'High' | 'Normal' | 'Low' = 'Normal';
    let histVar: 'High' | 'Normal' | 'Low' = 'Normal';
    let sudden = false;
    let percentile = 30 + Math.floor(Math.random() * 40);
    let status: AlertStatus = 'New';
    let loss = 0;

    if (risk === 'HIGH') {
      devPercent = -(50 + Math.random() * 30); // -50% to -80%
      score = 0.82 + Math.random() * 0.16;     // 0.82 to 0.98
      nightUsage = Math.random() > 0.3 ? 'High' : 'Normal';
      histVar = 'High';
      sudden = Math.random() > 0.2;
      percentile = 85 + Math.floor(Math.random() * 14);
      status = Math.random() > 0.5 ? 'Investigation' : 'Reviewing';
      loss = Math.round(15000 + Math.random() * 25000);
    } else if (risk === 'MEDIUM') {
      devPercent = -(25 + Math.random() * 24); // -25% to -49%
      score = 0.60 + Math.random() * 0.21;     // 0.60 to 0.81
      nightUsage = Math.random() > 0.5 ? 'High' : 'Normal';
      histVar = Math.random() > 0.4 ? 'High' : 'Normal';
      sudden = Math.random() > 0.4;
      percentile = 70 + Math.floor(Math.random() * 15);
      status = Math.random() > 0.6 ? 'Reviewing' : 'New';
      loss = Math.round(7000 + Math.random() * 9000);
    } else if (risk === 'LOW') {
      devPercent = -(10 + Math.random() * 14); // -10% to -24%
      score = 0.35 + Math.random() * 0.24;     // 0.35 to 0.59
      nightUsage = 'Normal';
      histVar = 'Normal';
      sudden = false;
      percentile = 50 + Math.floor(Math.random() * 20);
      status = Math.random() > 0.8 ? 'Resolved' : 'New';
      loss = Math.round(2000 + Math.random() * 4000);
    } else {
      devPercent = (Math.random() * 12) - 6;   // -6% to +6%
      score = Math.random() * 0.34;            // 0.00 to 0.34
      nightUsage = Math.random() > 0.8 ? 'Low' : 'Normal';
      histVar = 'Low';
      sudden = false;
      percentile = Math.floor(Math.random() * 50);
      status = 'Resolved';
      loss = 0;
    }

    const actual = Math.max(10, Math.round(expected * (1 + devPercent / 100)));

    // Coordinates for scatter plot / scatter layout
    // Normal clusters around actual = expected (y = x)
    // Anomalies deviate below actual = expected
    let xCoord = Math.min(95, Math.max(5, Math.round((expected / 1200) * 100)));
    let yCoord = Math.min(95, Math.max(5, Math.round((actual / 1200) * 100)));

    return {
      id,
      name,
      area,
      consumerType: type,
      meterAgeYears: meterAge,
      avgMonthlyConsumption: Math.round(expected * 0.9),
      expectedConsumption: Math.round(expected),
      actualConsumption: actual,
      consumptionDeviation: Number(devPercent.toFixed(1)),
      nightUsage,
      historicalVariance: histVar,
      peerDeviationPercentile: percentile,
      suddenLoadChange: sudden,
      anomalyScore: Number(score.toFixed(2)),
      riskLevel: risk,
      estimatedLoss: loss,
      status,
      lastUpdated: `${Math.floor(Math.random() * 59) + 1} min ago`,
      coordinates: { x: xCoord, y: yCoord },
      aiExplanation: risk === 'NORMAL'
        ? 'Consumption parameters are within expected statistical variance bounds relative to peer baseline and seasonal index.'
        : `Statistical anomaly score of ${score.toFixed(2)} based on ${Math.abs(devPercent).toFixed(1)}% consumption deviation relative to local feeder baseline.`,
      history: generateMonthlyHistory(expected, risk !== 'NORMAL', Math.abs(devPercent))
    };
  };

  for (let i = 0; i < remainingHigh; i++) dataset.push(createConsumer('HIGH'));
  for (let i = 0; i < remainingMedium; i++) dataset.push(createConsumer('MEDIUM'));
  for (let i = 0; i < remainingLow; i++) dataset.push(createConsumer('LOW'));
  for (let i = 0; i < remainingNormal; i++) dataset.push(createConsumer('NORMAL'));

  return dataset;
}

export const ALL_CONSUMERS = generateConsumersDataset();

// KPI Summary Data
export const MOCK_KPI = {
  totalConsumers: 24860,
  monitoredAreas: 42,
  consumersAnalyzed: 24860,
  potentialTheftCases: 317,
  highRiskCases: 48,
  estimatedSuspiciousLossINR: '₹18.7 Lakhs'
};

// 30-Day Daily Consumption vs Expected chart data for Overview
export const MOCK_30DAY_CONSUMPTION: DailyDemandPoint[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const dateStr = `Aug ${day}`;
  // Normal baseline demand ~ 45-52 MW
  const baseExpected = 48 + Math.sin(i / 3) * 3 + Math.random() * 1.5;
  let baseActual = baseExpected + (Math.random() * 1.2 - 0.6);

  // Introduce significant abnormal drops at Day 14 and Day 24
  let anomalyDetected = false;
  let label = undefined;

  if (day === 14) {
    baseActual = baseExpected * 0.68; // 32% drop
    anomalyDetected = true;
    label = 'Abnormal deviation detected (-32%)';
  } else if (day === 24) {
    baseActual = baseExpected * 0.73; // 27% drop
    anomalyDetected = true;
    label = 'Feeder cluster drop detected (-27%)';
  } else if (day >= 15 && day <= 17) {
    baseActual = baseExpected * 0.85;
  }

  return {
    date: dateStr,
    expectedMW: Number(baseExpected.toFixed(2)),
    actualMW: Number(baseActual.toFixed(2)),
    anomalyDetected,
    label
  };
});

// Risk Distribution Data
export const MOCK_RISK_DISTRIBUTION = [
  { name: 'Normal', value: 91.4, count: 22722, color: '#10b981' },
  { name: 'Low Risk', value: 5.2, count: 1293, color: '#06b6d4' },
  { name: 'Medium Risk', value: 2.1, count: 522, color: '#f59e0b' },
  { name: 'High Risk', value: 1.3, count: 323, color: '#ef4444' }
];

// Recent Alert Events for Overview & Alerts Page
export const MOCK_ALERTS: AlertItem[] = [
  {
    id: 'ALT-2048',
    consumerId: 'C-10482',
    areaName: 'Whitefield',
    type: 'Consumption Deviation',
    severity: 'HIGH',
    timestamp: '2 min ago',
    anomalyScore: 0.91,
    status: 'Investigation',
    description: 'Consumption dropped 67% below expected baseline.'
  },
  {
    id: 'ALT-2047',
    areaName: 'A-17 (Marathahalli Sector 3)',
    type: 'Cluster Anomaly',
    severity: 'HIGH',
    timestamp: '14 min ago',
    anomalyScore: 0.87,
    status: 'New',
    description: 'Unusual cluster of 8 neighboring consumers detected with synchronized load drop.'
  },
  {
    id: 'ALT-2046',
    consumerId: 'C-08721',
    areaName: 'Marathahalli',
    type: 'Night Pattern',
    severity: 'MEDIUM',
    timestamp: '31 min ago',
    anomalyScore: 0.72,
    status: 'Reviewing',
    description: 'Night-time consumption pattern anomaly detected on cold storage connection.'
  },
  {
    id: 'ALT-2045',
    consumerId: 'C-19382',
    areaName: 'Electronic City',
    type: 'Sudden Load Change',
    severity: 'LOW',
    timestamp: '48 min ago',
    anomalyScore: 0.54,
    status: 'Resolved',
    description: 'Abrupt shift in 3-phase current balance detected during peak hours.'
  },
  {
    id: 'ALT-2044',
    consumerId: 'C-04912',
    areaName: 'Whitefield',
    type: 'Zero Night Usage',
    severity: 'HIGH',
    timestamp: '1 hour ago',
    anomalyScore: 0.93,
    status: 'Investigation',
    description: 'Zero night-time power flow recorded on residential smart meter B-402.'
  },
  {
    id: 'ALT-2043',
    consumerId: 'C-15209',
    areaName: 'HSR Layout',
    type: 'Historical Drift',
    severity: 'MEDIUM',
    timestamp: '2 hours ago',
    anomalyScore: 0.68,
    status: 'New',
    description: 'Consistent negative drift of 32% relative to 24-month baseline.'
  },
  {
    id: 'ALT-2042',
    areaName: 'Sarjapur Cluster 9',
    type: 'Transformer Loss Mismatch',
    severity: 'LOW',
    timestamp: '3 hours ago',
    anomalyScore: 0.49,
    status: 'Resolved',
    description: 'Distribution transformer secondary output exceeds total metered billing load by 14%.'
  }
];

// Model Insights Benchmarks (DEMO / SIMULATED)
export const MOCK_MODEL_METRICS: ModelMetric[] = [
  {
    name: 'Random Forest Classifier',
    accuracy: 94.2,
    precision: 91.7,
    recall: 88.4,
    f1Score: 90.0,
    description: 'Supervised ensemble model trained on labeled historical inspection feedback.'
  },
  {
    name: 'Isolation Forest (Unsupervised)',
    accuracy: 89.1, // Anomaly detection rate
    precision: 86.4,
    recall: 89.1,
    f1Score: 87.7,
    description: 'Unsupervised tree isolation for detecting zero-day tampering techniques.'
  },
  {
    name: 'Logistic Regression Baseline',
    accuracy: 87.6,
    precision: 83.2,
    recall: 81.0,
    f1Score: 82.1,
    description: 'Linear baseline benchmark model for statistical odds comparison.'
  }
];

// Feature Importances
export const MOCK_FEATURE_IMPORTANCE: FeatureImportanceItem[] = [
  { feature: 'Consumption deviation', importance: 32, description: 'Percentage difference between baseline prediction model and meter reading.' },
  { feature: 'Historical consumption variance', importance: 21, description: 'Longitudinal volatility score over 12 rolling billing cycles.' },
  { feature: 'Night-time usage ratio', importance: 16, description: 'Off-peak 01:00-05:00 load ratio compared to neighborhood profile.' },
  { feature: 'Peer-group deviation', importance: 13, description: 'Deviation relative to similar consumer category & square footage.' },
  { feature: 'Load factor anomaly', importance: 10, description: 'Ratio of average load to peak registered load over time.' },
  { feature: 'Seasonal deviation', importance: 8, description: 'Temperature-adjusted seasonal cooling/heating demand mismatch.' }
];

// Analytics 12-month demand breakdown
export const MOCK_ANALYTICS_MONTHLY = [
  { month: 'Oct', expected: 1420, actual: 1390, loss: 30 },
  { month: 'Nov', expected: 1380, actual: 1340, loss: 40 },
  { month: 'Dec', expected: 1450, actual: 1410, loss: 40 },
  { month: 'Jan', expected: 1490, actual: 1430, loss: 60 },
  { month: 'Feb', expected: 1510, actual: 1440, loss: 70 },
  { month: 'Mar', expected: 1620, actual: 1520, loss: 100 },
  { month: 'Apr', expected: 1780, actual: 1640, loss: 140 },
  { month: 'May', expected: 1890, actual: 1720, loss: 170 },
  { month: 'Jun', expected: 1820, actual: 1680, loss: 140 },
  { month: 'Jul', expected: 1740, actual: 1620, loss: 120 },
  { month: 'Aug', expected: 1680, actual: 1570, loss: 110 },
  { month: 'Sep', expected: 1590, actual: 1490, loss: 100 }
];

// Peak vs Off-Peak Analytics
export const MOCK_PEAK_OFFPEAK = [
  { time: '00:00 - 04:00 (Night)', expected: 18.5, actual: 14.2, anomalyRatio: '23.2%' },
  { time: '04:00 - 08:00 (Morning)', expected: 32.4, actual: 30.8, anomalyRatio: '4.9%' },
  { time: '08:00 - 12:00 (Peak AM)', expected: 54.1, actual: 49.6, anomalyRatio: '8.3%' },
  { time: '12:00 - 16:00 (Midday)', expected: 58.2, actual: 54.1, anomalyRatio: '7.0%' },
  { time: '16:00 - 20:00 (Peak PM)', expected: 62.8, actual: 56.4, anomalyRatio: '10.2%' },
  { time: '20:00 - 24:00 (Late Night)', expected: 41.0, actual: 35.1, anomalyRatio: '14.4%' }
];
