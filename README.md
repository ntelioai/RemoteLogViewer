# NTELIO Real-Time Server Log Viewer

A real-time web-based log viewer for monitoring NTELIO server activities and application logs. This tool provides a comprehensive interface for viewing, filtering, and analyzing server logs in real-time through WebSocket connections.

## Features

- **Real-Time Log Streaming**: Live log updates via WebSocket connection
- **Multi-Level Filtering**: Filter logs by level (debug, info, warn, error, application)
- **Script Filtering**: Filter logs by specific script or component names
- **Component-Specific Renderers**: Specialized views for OpenAI, Similarity, and Pipeline Runner components
- **Persistent Settings**: User preferences saved in local storage
- **Authentication**: Token-based access control for secure log access
- **Responsive Interface**: Clean, modern UI with Bootstrap styling

## Supported Log Types

- **Debug**: Development and debugging information
- **Info**: General informational messages
- **Warn**: Warning messages
- **Error**: Error conditions and exceptions
- **Application**: Application-specific events and transactions

## Component Renderers

### OpenAI Renderer
Displays detailed information for OpenAI API interactions including:
- Question and response
- Model and temperature settings
- Template usage
- Dialog history
- Performance metrics (execution time, token usage)

### Similarity Renderer
Shows similarity search operations with:
- Query details
- Document matches
- Execution performance

### Pipeline Runner Renderer
Monitors pipeline execution activities

## Getting Started

1. Open `index.html` in a web browser
2. Enter your authentication token in the "Token" field
3. Select desired log levels using the multi-select dropdown
4. Use the script filter to narrow down results by component name
5. Click "Clear" to clear the current log display

## Configuration

The application connects to NTELIO's WebSocket API endpoint:
```
wss://api.scriptrapps.io/
```

Authentication is required via token-based access control.

## File Structure

```
RealTimeLogger/
├── index.html              # Main application entry point
├── viewer/
│   ├── viewer.js           # Application initialization and event handlers
│   ├── LogViewer.js        # Core log viewer functionality and renderers
│   ├── LocalSessionStorage.js # Local storage utilities
│   └── css/
│       └── logviewer.css   # Application styling
└── middleware/
    └── RealtimeLogger/     # Additional middleware components
```

## Dependencies

- jQuery 3.6.0
- jQuery UI 1.13.2
- Bootstrap 5.1.3+ with Bootstrap Select
- Bootstrap Icons
- Font Awesome 6.5.0

## Browser Support

This application works in all modern web browsers that support:
- WebSocket API
- ES6 Modules
- Local Storage API

## Privacy and Data Handling

This application processes server logs in real-time and stores user preferences locally. All log data is transmitted over secure WebSocket connections and is not permanently stored by the client application. User authentication tokens and preferences are stored in the browser's local storage with the prefix `ntelio.admin`.

## Security

- All connections require valid authentication tokens
- WebSocket connections use secure protocols (WSS)
- No sensitive data is permanently stored client-side
- Role-based access control at the server level

## Contributing

This is proprietary software owned by NTELIO LLC. Internal development guidelines apply.

## Support

For technical support or questions about this log viewer, contact the NTELIO development team.

---

## Legal Notice

### Copyright

© 2024 NTELIO LLC. All rights reserved.

### Privacy Policy

This software is designed to handle server log data for monitoring and debugging purposes. The application:

- Processes server logs in real-time for authorized users
- Stores user preferences and authentication tokens locally in the browser
- Does not collect, store, or transmit personal information beyond what is necessary for log viewing functionality
- Maintains secure connections to NTELIO servers using industry-standard encryption protocols

### Terms of Use

This software is proprietary to NTELIO LLC and is provided for internal use and authorized customer access only. By using this software, you agree to:

- Use the software solely for its intended purpose of viewing server logs
- Maintain the confidentiality of any authentication tokens or sensitive information accessed
- Comply with all applicable security policies and procedures
- Not attempt to reverse engineer, modify, or redistribute the software

### Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL NTELIO LLC BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### Data Security

NTELIO LLC implements appropriate technical and organizational measures to protect data processed by this application. However, users are responsible for:

- Safeguarding their authentication credentials
- Using the software in compliance with organizational security policies
- Reporting any security incidents or suspected vulnerabilities

### Contact Information

NTELIO LLC  
For legal inquiries: legal@ntelio.ai  
For technical support: support@ntelio.ai  
Website: https://www.ntelio.ai

---

*This document was last updated: September 2024*