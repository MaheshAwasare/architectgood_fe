export class MermaidFormatter {
  private static instance: MermaidFormatter;
  
  static getInstance(): MermaidFormatter {
    if (!MermaidFormatter.instance) {
      MermaidFormatter.instance = new MermaidFormatter();
    }
    return MermaidFormatter.instance;
  }

  formatCode(code: string): string {
    const lines = code.split('\n');
    const formatted: string[] = [];
    let indentLevel = 0;
    const indentSize = 4;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        formatted.push('');
        continue;
      }

      // Detect diagram type and reset indent
      if (this.isDiagramDeclaration(line)) {
        indentLevel = 0;
        formatted.push(line);
        continue;
      }

      // Handle subgraph
      if (line.startsWith('subgraph')) {
        formatted.push(' '.repeat(indentLevel * indentSize) + line);
        indentLevel++;
        continue;
      }

      if (line === 'end') {
        indentLevel = Math.max(0, indentLevel - 1);
        formatted.push(' '.repeat(indentLevel * indentSize) + line);
        continue;
      }

      // Handle style and class definitions
      if (line.startsWith('style') || line.startsWith('classDef') || line.startsWith('class ')) {
        formatted.push(' '.repeat(indentLevel * indentSize) + line);
        continue;
      }

      // Handle regular nodes and connections
      if (this.isNodeOrConnection(line)) {
        const baseIndent = indentLevel > 0 ? indentLevel : 1;
        formatted.push(' '.repeat(baseIndent * indentSize) + line);
        continue;
      }

      // Default formatting
      const baseIndent = indentLevel > 0 ? indentLevel : (this.needsIndent(line) ? 1 : 0);
      formatted.push(' '.repeat(baseIndent * indentSize) + line);
    }

    return formatted.join('\n');
  }

  private isDiagramDeclaration(line: string): boolean {
    const diagramTypes = [
      'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 
      'stateDiagram', 'erDiagram', 'journey', 'gantt', 'pie',
      'gitgraph', 'mindmap', 'timeline'
    ];
    
    return diagramTypes.some(type => line.startsWith(type));
  }

  private isNodeOrConnection(line: string): boolean {
    // Check if line contains node definitions or connections
    return line.includes('-->') || 
           line.includes('---') || 
           line.includes('-.->') || 
           line.includes('==>') ||
           line.match(/^[A-Za-z0-9]+[\[\(\{]/) !== null;
  }

  private needsIndent(line: string): boolean {
    // Lines that should be indented in most diagram types
    return !line.startsWith('%%') && // Comments
           !this.isDiagramDeclaration(line) &&
           !line.startsWith('style') &&
           !line.startsWith('classDef') &&
           !line.startsWith('class ');
  }

  beautifyCode(code: string): string {
    let formatted = this.formatCode(code);
    
    // Add spacing around arrows for better readability
    formatted = formatted.replace(/(\w)-->/g, '$1 -->');
    formatted = formatted.replace(/-->(\w)/g, '--> $1');
    formatted = formatted.replace(/(\w)---/g, '$1 ---');
    formatted = formatted.replace(/---(\w)/g, '--- $1');
    
    // Clean up multiple spaces
    formatted = formatted.replace(/ {2,}/g, ' ');
    
    // Remove trailing spaces
    formatted = formatted.split('\n').map(line => line.trimEnd()).join('\n');
    
    // Remove excessive empty lines
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    return formatted.trim();
  }
}

export const mermaidFormatter = MermaidFormatter.getInstance();