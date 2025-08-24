export const architecturalDesignPatternsCourse = {
  title: "Architectural Design Patterns",
  description: "A foundational course on common architectural design patterns.",
  lessons: [
    {
      id: "singleton",
      title: "1. Singleton Pattern",
      content: `
        <p>The Singleton pattern ensures that a class has only one instance and provides a global point of access to that instance. It's useful when exactly one object is needed to coordinate actions across the system.</p>
        <p><strong>Key Characteristics:</strong></p>
        <ul>
          <li>A private constructor to prevent direct instantiation.</li>
          <li>A static private instance of the same class.</li>
          <li>A static public method to return the instance.</li>
        </ul>
        <p><strong>Use Cases:</strong> Logging, configuration management, thread pools, database connection pools.</p>
      `,
      umlDiagram: `
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
          <rect x="50" y="20" width="200" height="160" fill="#f0f0f0" stroke="#333" stroke-width="2"/>
          <line x1="50" y1="60" x2="250" y2="60" stroke="#333" stroke-width="1"/>
          <line x1="50" y1="120" x2="250" y2="120" stroke="#333" stroke-width="1"/>

          <text x="150" y="45" font-family="Arial" font-size="18" fill="#333" text-anchor="middle">Singleton</text>

          <text x="60" y="85" font-family="Arial" font-size="14" fill="#333">- instance: Singleton</text>
          <text x="60" y="105" font-family="Arial" font-size="14" fill="#333">- Singleton()</text>

          <text x="60" y="145" font-family="Arial" font-size="14" fill="#333">+ getInstance(): Singleton</text>
        </svg>
      `,
    },
    {
      id: "factory-method",
      title: "2. Factory Method Pattern",
      content: `
        <p>The Factory Method pattern defines an interface for creating an object, but lets subclasses decide which class to instantiate. This pattern promotes loose coupling by decoupling the client code from the concrete classes it instantiates.</p>
        <p><strong>Key Characteristics:</strong></p>
        <ul>
          <li>A Creator class declares the factory method, which returns an object of type Product.</li>
          <li>ConcreteCreator classes override the factory method to return an instance of a ConcreteProduct.</li>
          <li>Product is an interface or abstract class that defines the type of objects the factory method creates.</li>
        </ul>
        <p><strong>Use Cases:</strong> Frameworks that need to standardize the creation of objects, but allow applications to define their own specific types of objects.</p>
      `,
      umlDiagram: `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
          <rect x="20" y="20" width="150" height="80" fill="#f0f0f0" stroke="#333" stroke-width="2"/>
          <text x="95" y="45" font-family="Arial" font-size="16" fill="#333" text-anchor="middle">Creator</text>
          <line x1="20" y1="60" x2="170" y2="60" stroke="#333" stroke-width="1"/>
          <text x="30" y="85" font-family="Arial" font-size="14" fill="#333">+ factoryMethod(): Product</text>

          <rect x="20" y="150" width="150" height="80" fill="#f0f0f0" stroke="#333" stroke-width="2"/>
          <text x="95" y="175" font-family="Arial" font-size="16" fill="#333">ConcreteCreator</text>
          <line x1="20" y1="190" x2="170" y2="190" stroke="#333" stroke-width="1"/>
          <text x="30" y="215" font-family="Arial" font-size="14" fill="#333">+ factoryMethod(): ProductA</text>

          <rect x="230" y="20" width="150" height="80" fill="#f0f0f0" stroke="#333" stroke-width="2"/>
          <text x="305" y="45" font-family="Arial" font-size="16" fill="#333" text-anchor="middle">Product</text>
          <line x1="230" y1="60" x2="380" y2="60" stroke="#333" stroke-width="1"/>
          <text x="240" y="85" font-family="Arial" font-size="14" fill="#333">+ operation()</text>

          <rect x="230" y="150" width="150" height="80" fill="#f0f0f0" stroke="#333" stroke-width="2"/>
          <text x="305" y="175" font-family="Arial" font-size="16" fill="#333" text-anchor="middle">ConcreteProductA</text>
          <line x1="230" y1="190" x2="380" y2="190" stroke="#333" stroke-width="1"/>
          <text x="240" y="215" font-family="Arial" font-size="14" fill="#333">+ operation()</text>

          <path d="M95 150 L95 100" stroke="#333" stroke-width="1" marker-end="url(#triangle)"/>
          <path d="M305 150 L305 100" stroke="#333" stroke-width="1" marker-end="url(#triangle)"/>
          <path d="M170 70 L230 70" stroke="#333" stroke-width="1" marker-end="url(#arrowhead)"/>
          <path d="M170 200 L230 200" stroke="#333" stroke-width="1" marker-end="url(#arrowhead)"/>

          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
            </marker>
            <marker id="triangle" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="#333" />
            </marker>
          </defs>
        </svg>
      `,
    },
    {
      id: "observer",
      title: "3. Observer Pattern",
      content: `
        <p>The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically. This is a key pattern for implementing distributed event handling systems.</p>
        <p><strong>Key Characteristics:</strong></p>
        <ul>
          <li><strong>Subject:</strong> The object being observed. It maintains a list of its dependents (observers) and notifies them of state changes.</li>
          <li><strong>Observer:</strong> An object that wishes to be notified of changes in the Subject. It defines an update interface.</li>
          <li><strong>ConcreteSubject:</strong> Implements the Subject interface and maintains the state.</li>
          <li><strong>ConcreteObserver:</strong> Implements the Observer interface and registers with the ConcreteSubject.</li>
        </ul>
        <p><strong>Use Cases:</strong> Event handling systems, MVC (Model-View-Controller) architecture, stock market monitoring.</p>
      `,
      umlDiagram: `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
          <rect x="50" y="20" width="100" height="80" fill="#f0f0f0" stroke="#333" stroke-width="2"/>
          <text x="100" y="45" font-family="Arial" font-size="16" fill="#333" text-anchor="middle">Subject</text>
          <line x1="50" y1="60" x2="150" y2="60" stroke="#333" stroke-width="1"/>
          <text x="60" y="85" font-family="Arial" font-size="14" fill="#333">+ attach(Observer)</text>
          <text x="60" y="105" font-family="Arial" font-size="14" fill="#333">+ detach(Observer)</text>
          <text x="60" y="125" font-family="Arial" font-size="14" fill="#333">+ notify()</text>

          <rect x="250" y="20" width="100" height="80" fill="#f0f0f0" stroke="#333" stroke-width="2"/>
          <text x="300" y="45" font-family="Arial" font-size="16" fill="#333" text-anchor="middle">Observer</text>
          <line x1="250" y1="60" x2="350" y2="60" stroke="#333" stroke-width="1"/>
          <text x="260" y="85" font-family="Arial" font-size="14" fill="#333">+ update()</text>

          <rect x="50" y="150" width="100" height="80" fill="#f0f0f0" stroke="#333" stroke-width="2"/>
          <text x="100" y="175" font-family="Arial" font-size="16" fill="#333" text-anchor="middle">ConcreteSubject</text>
          <line x1="50" y1="190" x2="150" y2="190" stroke="#333" stroke-width="1"/>
          <text x="60" y="215" font-family="Arial" font-size="14" fill="#333">+ getState()</text>
          <text x="60" y="235" font-family="Arial" font-size="14" fill="#333">+ setState()</text>

          <rect x="250" y="150" width="100" height="80" fill="#f0f0f0" stroke="#333" stroke-width="2"/>
          <text x="300" y="175" font-family="Arial" font-size="16" fill="#333" text-anchor="middle">ConcreteObserver</text>
          <line x1="250" y1="190" x2="350" y2="190" stroke="#333" stroke-width="1"/>
          <text x="260" y="215" font-family="Arial" font-size="14" fill="#333">+ update()</text>

          <path d="M100 150 L100 100" stroke="#333" stroke-width="1" marker-end="url(#triangle)"/>
          <path d="M300 150 L300 100" stroke="#333" stroke-width="1" marker-end="url(#triangle)"/>
          <path d="M150 70 L250 70" stroke="#333" stroke-width="1" marker-end="url(#arrowhead)"/>
          <path d="M150 200 L250 200" stroke="#333" stroke-width="1" marker-end="url(#arrowhead)"/>

          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
            </marker>
            <marker id="triangle" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="#333" />
            </marker>
          </defs>
        </svg>
      `,
    },
    // Add more lessons here
  ],
};