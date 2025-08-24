import mermaid from 'mermaid';
import { EditorError } from '../types/editor';

export class MermaidValidator {
  private static instance: MermaidValidator;
  
  static getInstance(): MermaidValidator {
    if (!MermaidValidator.instance) {
      MermaidValidator.instance = new MermaidValidator();
    }
    return MermaidValidator.instance;
  }

  async validateSyntax(code: string): Promise<EditorError[]> {
    const errors: EditorError[] = [];
    
    if (!code.trim()) {
      return errors;
    }

    try {
      // Detect diagram type
      const diagramType = this.detectDiagramType(code);
      
      // Basic syntax checks
      const lines = code.split('\n');
      
      // Check for common syntax errors
      lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmedLine = line.trim();
        
        if (!trimmedLine || trimmedLine.startsWith('%%')) return; // Skip empty lines and comments
        
        // Check for unmatched brackets (but be more lenient)
        const openSquare = (line.match(/\[/g) || []).length;
        const closeSquare = (line.match(/\]/g) || []).length;
        const openCurly = (line.match(/\{/g) || []).length;
        const closeCurly = (line.match(/\}/g) || []).length;
        const openParen = (line.match(/\(/g) || []).length;
        const closeParen = (line.match(/\)/g) || []).length;
        
        // Only flag if there's a clear mismatch on the same line
        if (openSquare > 0 && closeSquare > 0 && openSquare !== closeSquare) {
          errors.push({
            line: lineNum,
            column: line.length,
            message: 'Unmatched square brackets detected',
            severity: 'warning'
          });
        }
        
        if (openCurly > 0 && closeCurly > 0 && openCurly !== closeCurly) {
          errors.push({
            line: lineNum,
            column: line.length,
            message: 'Unmatched curly brackets detected',
            severity: 'warning'
          });
        }
        
        // Check for invalid arrow syntax ONLY for flowcharts/graphs
        if ((diagramType === 'flowchart' || diagramType === 'graph') && this.hasInvalidFlowchartArrow(line)) {
          const column = this.getInvalidArrowPosition(line);
          errors.push({
            line: lineNum,
            column,
            message: 'Use valid arrow syntax: -->, -.->, ==>, --x, --o, or ---',
            severity: 'error'
          });
        }
        
        // Check for sequence diagram arrows in non-sequence diagrams
        if (diagramType !== 'sequence' && this.hasSequenceArrows(line)) {
          const column = this.getSequenceArrowPosition(line);
          errors.push({
            line: lineNum,
            column,
            message: 'Sequence diagram arrows (->> or ->>) should only be used in sequence diagrams',
            severity: 'warning'
          });
        }
      });

      // Try to parse with Mermaid (but catch and handle errors gracefully)
      try {
        const tempId = `validation-${Date.now()}`;
        await mermaid.parse(code);
      } catch (parseError: any) {
        // Only add parse errors if they're not already covered by our checks
        if (!this.isKnownValidationIssue(parseError.message)) {
          const lineMatch = parseError.message.match(/line (\d+)/i);
          const line = lineMatch ? parseInt(lineMatch[1]) : 1;
          
          errors.push({
            line,
            column: 1,
            message: this.cleanErrorMessage(parseError.message),
            severity: 'error'
          });
        }
      }
      
    } catch (error: any) {
      // Only add unexpected errors
      errors.push({
        line: 1,
        column: 1,
        message: 'Validation error: ' + (error.message || 'Unknown error'),
        severity: 'warning'
      });
    }
    
    return errors;
  }

  private detectDiagramType(code: string): string {
    const firstLine = code.trim().split('\n')[0].toLowerCase();
    
    if (firstLine.includes('sequencediagram')) return 'sequence';
    if (firstLine.includes('classdiagram')) return 'class';
    if (firstLine.includes('statediagram')) return 'state';
    if (firstLine.includes('erdiagram')) return 'er';
    if (firstLine.includes('journey')) return 'journey';
    if (firstLine.includes('gantt')) return 'gantt';
    if (firstLine.includes('pie')) return 'pie';
    if (firstLine.includes('gitgraph')) return 'gitgraph';
    if (firstLine.includes('mindmap')) return 'mindmap';
    if (firstLine.includes('timeline')) return 'timeline';
    if (firstLine.includes('graph') || firstLine.includes('flowchart')) return 'flowchart';
    
    return 'unknown';
  }

  private hasInvalidFlowchartArrow(line: string): boolean {
    // Valid flowchart arrows: -->, -.->, ==>, --x, --o, ---
    const validArrows = [
      /-->/,     // solid arrow
      /-\.->/, // dotted arrow
      /==>/,     // thick arrow
      /--x/,     // cross arrow
      /--o/,     // circle arrow
      /---/      // line
    ];
    
    // Check if line has arrow-like patterns
    const arrowPatterns = [
      /->/,      // basic arrow (invalid for flowcharts)
      /->>/,     // sequence arrow (invalid for flowcharts)
      /-->/,     // could be valid
      /-\.->/, // could be valid
      /==>/,     // could be valid
      /--x/,     // could be valid
      /--o/      // could be valid
    ];
    
    // If no arrow patterns, it's fine
    const hasArrowPattern = arrowPatterns.some(pattern => pattern.test(line));
    if (!hasArrowPattern) return false;
    
    // If it has arrow patterns, check if any are valid
    const hasValidArrow = validArrows.some(pattern => pattern.test(line));
    
    // If it has arrow patterns but no valid arrows, and it's not a sequence arrow, it's invalid
    const hasSequenceArrow = /->>|-->>/.test(line);
    
    return hasArrowPattern && !hasValidArrow && !hasSequenceArrow;
  }

  private hasSequenceArrows(line: string): boolean {
    return /->>|-->>/.test(line);
  }

  private getInvalidArrowPosition(line: string): number {
    const match = line.match(/->(?!>)/);
    return match ? match.index! + 1 : 1;
  }

  private getSequenceArrowPosition(line: string): number {
    const match = line.match(/->>|-->>/) ;
    return match ? match.index! + 1 : 1;
  }

  private isKnownValidationIssue(message: string): boolean {
    // Skip errors we're already handling
    const knownIssues = [
      'arrow',
      'bracket',
      'syntax'
    ];
    
    return knownIssues.some(issue => message.toLowerCase().includes(issue));
  }

  private cleanErrorMessage(message: string): string {
    // Clean up Mermaid error messages to be more user-friendly
    return message
      .replace(/Parse error on line \d+:/i, '')
      .replace(/Expecting .* got .*/i, 'Syntax error')
      .trim();
  }
}

export const mermaidValidator = MermaidValidator.getInstance();