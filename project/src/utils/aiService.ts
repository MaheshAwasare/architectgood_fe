import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIGenerationRequest, AIGenerationResponse, CodeCorrectionRequest, CodeCorrectionResponse } from '../types/ai';

export class AIService {
  private static instance: AIService;
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private currentModel: string = 'gemini-pro';

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  initialize(apiKey: string, modelName: string = 'gemini-pro') {
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: modelName });
      this.currentModel = modelName;
      return true;
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      return false;
    }
  }

  isInitialized(): boolean {
    return this.genAI !== null && this.model !== null;
  }

  getCurrentModel(): string {
    return this.currentModel;
  }

  switchModel(modelName: string) {
    if (this.genAI) {
      this.model = this.genAI.getGenerativeModel({ model: modelName });
      this.currentModel = modelName;
      return true;
    }
    return false;
  }

  async generateDiagram(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.isInitialized()) {
      throw new Error('AI service not initialized. Please provide a valid API key.');
    }

    const prompt = this.buildGenerationPrompt(request);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseGenerationResponse(text);
    } catch (error: any) {
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  async correctCode(request: CodeCorrectionRequest): Promise<CodeCorrectionResponse> {
    if (!this.isInitialized()) {
      throw new Error('AI service not initialized. Please provide a valid API key.');
    }

    const prompt = this.buildCorrectionPrompt(request);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseCorrectionResponse(text);
    } catch (error: any) {
      throw new Error(`Code correction failed: ${error.message}`);
    }
  }

  async generateUMLDiagram(prompt: string): Promise<string> {
    if (!this.isInitialized()) {
      throw new Error('AI service not initialized. Please provide a valid API key.');
    }

    const fullPrompt = `Generate PlantUML code for the following description. Ensure the output is only the PlantUML code, starting with @startuml and ending with @enduml. Do not include any explanations or extra text outside the PlantUML block.

Description: ${prompt}

Example:
@startuml
actor User
participant "System" as S
User -> S: Request data
S --> User: Display data
@enduml`;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      throw new Error(`PlantUML generation failed: ${error.message}`);
    }
  }

  private buildGenerationPrompt(request: AIGenerationRequest): string {
    const { prompt, diagramType, complexity, style } = request;
    
    return `You are an expert Mermaid diagram generator. Generate clean, properly formatted Mermaid code based on the following requirements:

REQUIREMENTS:
- User Description: "${prompt}"
- Diagram Type: ${diagramType || 'auto-detect best type'}
- Complexity: ${complexity || 'medium'}
- Style: ${style || 'professional'}

INSTRUCTIONS:
1. Generate ONLY clean, valid Mermaid syntax without any markdown code blocks
2. Use proper indentation (2 spaces for nested elements)
3. Choose the most appropriate diagram type for the description
4. Keep the syntax simple and readable
5. Use meaningful participant/node names
6. Include proper flow control (alt, else, opt, loop) where appropriate
7. Do NOT add any styling, colors, or style declarations (no "style" commands)
8. Follow standard Mermaid conventions
9. Generate pure functional diagrams without visual styling

EXAMPLE FORMAT (for sequence diagram):
sequenceDiagram
  participant User
  participant WebApp
  participant AuthServer
  
  User->>WebApp: Action
  WebApp->>AuthServer: Request
  AuthServer-->>WebApp: Response
  WebApp-->>User: Result

DIAGRAM TYPES AVAILABLE:
- graph TD/LR: For processes, workflows, decision trees (use TD for top-down, LR for left-right)
- sequenceDiagram: For interactions between entities over time
- classDiagram: For object-oriented design and relationships
- stateDiagram-v2: For state machines and transitions
- erDiagram: For database relationships
- journey: For user journeys and experiences
- gantt: For project timelines
- pie title "Title": For data visualization
- flowchart TD/LR: Modern flowchart syntax

RESPONSE FORMAT:
Respond with a JSON object containing:
{
  "code": "Clean Mermaid code without markdown blocks",
  "explanation": "Brief explanation of the diagram",
  "suggestions": ["improvement1", "improvement2"],
  "confidence": 0.95
}

Generate clean Mermaid code now:`;
  }

  private buildCorrectionPrompt(request: CodeCorrectionRequest): string {
    const { originalCode, errorMessage, context } = request;
    
    return `You are an expert Mermaid syntax corrector. Fix the following Mermaid code to be clean and properly formatted:

ORIGINAL CODE:
\`\`\`mermaid
${originalCode}
\`\`\`

ERROR MESSAGE:
${errorMessage}

CONTEXT:
${context || 'No additional context provided'}

INSTRUCTIONS:
1. Fix all syntax errors while maintaining the original intent
2. Use proper indentation (2 spaces for nested elements)
3. Ensure clean, readable Mermaid syntax
4. Follow standard Mermaid conventions
5. Remove any markdown code blocks or extra formatting
6. Keep the structure simple and clear
7. Use meaningful names for participants/nodes
8. Remove any style declarations or color specifications
9. Generate pure functional diagrams without styling

EXAMPLE CLEAN FORMAT:
sequenceDiagram
  participant User
  participant System
  
  User->>System: Request
  System-->>User: Response

RESPONSE FORMAT:
Respond with a JSON object:
{
  "correctedCode": "Clean corrected Mermaid code",
  "changes": ["Change 1", "Change 2"],
  "explanation": "Explanation of what was wrong and how it was fixed"
}

Fix the code now:`;
  }

  private parseGenerationResponse(text: string): AIGenerationResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          code: parsed.code || '',
          explanation: parsed.explanation || 'No explanation provided',
          suggestions: parsed.suggestions || [],
          confidence: parsed.confidence || 0.8
        };
      }
      
      // Fallback: extract code blocks
      const codeMatch = text.match(/```(?:mermaid)?\n([\s\S]*?)\n```/);
      const code = codeMatch ? codeMatch[1] : text;
      
      return {
        code: code.trim(),
        explanation: 'Generated diagram based on your description',
        suggestions: ['Review the generated diagram', 'Modify as needed', 'Add custom styling'],
        confidence: 0.7
      };
    } catch (error) {
      throw new Error('Failed to parse AI response');
    }
  }

  private parseCorrectionResponse(text: string): CodeCorrectionResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          correctedCode: parsed.correctedCode || '',
          changes: parsed.changes || [],
          explanation: parsed.explanation || 'Code has been corrected'
        };
      }
      
      // Fallback: extract code blocks
      const codeMatch = text.match(/```(?:mermaid)?\n([\s\S]*?)\n```/);
      const correctedCode = codeMatch ? codeMatch[1] : text;
      
      return {
        correctedCode: correctedCode.trim(),
        changes: ['Code syntax corrected'],
        explanation: 'Fixed syntax errors in the diagram'
      };
    } catch (error) {
      throw new Error('Failed to parse correction response');
    }
  }
}

export const aiService = AIService.getInstance();