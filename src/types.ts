export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'NORMAL';
export type ConsumerType = 'Residential' | 'Commercial' | 'Industrial';
export type AlertStatus = 'New' | 'Reviewing' | 'Investigation' | 'Resolved';

export interface MonthlyHistoryPoint {
  month: string;
  expected: number;
  actual: number;
}

export interface Consumer {
  id: string;
  name: string;
  area: string;
  consumerType: ConsumerType;
  meterAgeYears: number;
  avgMonthlyConsumption: number; // kWh
  expectedConsumption: number;  // kWh
  actualConsumption: number;    // kWh
  consumptionDeviation: number; // percentage, e.g. -67.2
  nightUsage: 'High' | 'Normal' | 'Low';
  historicalVariance: 'High' | 'Normal' | 'Low';
  peerDeviationPercentile: number; // e.g. 92
  suddenLoadChange: boolean;
  anomalyScore: number;         // 0 to 1
  riskLevel: RiskLevel;
  estimatedLoss: number;        // in INR (₹)
  status: AlertStatus;
  lastUpdated: string;
  coordinates: { x: number; y: number }; // grid coordinates for visualization
  aiExplanation: string;
  history: MonthlyHistoryPoint[];
}

export interface AreaSummary {
  name: string;
  totalConsumers: number;
  expectedLoadMWh: number;
  actualLoadMWh: number;
  deviationPercent: number;
  anomaliesCount: number;
  highRiskCount: number;
  estimatedLossINR: number;
  riskLevel: RiskLevel;
  coordinates: { x: number; y: number };
}

export interface AlertItem {
  id: string;
  consumerId?: string;
  areaName?: string;
  type: string;
  severity: RiskLevel;
  timestamp: string;
  anomalyScore: number;
  status: AlertStatus;
  description: string;
}

export interface DailyDemandPoint {
  date: string;
  expectedMW: number;
  actualMW: number;
  anomalyDetected?: boolean;
  label?: string;
}

export interface ModelMetric {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  description: string;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number; // percentage e.g. 32
  description: string;
}
