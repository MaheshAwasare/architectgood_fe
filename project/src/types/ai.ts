export interface AIGenerationRequest {
  prompt: string;
  diagramType?: string;
  complexity?: 'simple' | 'medium' | 'complex';
  style?: string;
}

export interface AIGenerationResponse {
  code: string;
  explanation: string;
  suggestions: string[];
  confidence: number;
}

export interface CodeCorrectionRequest {
  originalCode: string;
  errorMessage: string;
  context?: string;
}

export interface CodeCorrectionResponse {
  correctedCode: string;
  changes: string[];
  explanation: string;
}

export interface AISettings {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}