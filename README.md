# Apify Integration Web App

A simple web application that integrates with Apify's API to fetch actors, display their input schemas, and execute them with user-provided parameters.

## 🚀 Features

- **User Authentication**: Secure API key input and validation
- **Actor Discovery**: Fetch and display available Apify actors
- **Dynamic Schema Loading**: Automatically load and display actor input schemas
- **Interactive Execution**: Execute actors with custom parameters
- **Real-time Results**: Display execution results immediately
- **Error Handling**: Comprehensive error handling for API failures

## 🛠️ Tech Stack

- **Frontend**: React.js with modern hooks and functional components
- **Backend**: Node.js with Express.js
- **Styling**: Tailwind CSS for modern, responsive design
- **HTTP Client**: Axios for API communication
- **Environment**: Environment variables for secure configuration

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Apify API key (get one from [Apify Console](https://console.apify.com/))

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd NewProjectTask
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
APIFY_TOKEN=your_apify_api_key_here
PORT=5002
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm start
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5002

## 📁 Project Structure

```
NewProjectTask/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Backend API Routes

- `GET /api/actors` - Fetch all available actors
- `GET /api/actors/:actorId/schema` - Get actor input schema
- `POST /api/actors/:actorId/run` - Execute actor with input parameters
- `GET /api/actors/:actorId/runs/:runId` - Get execution results

## 🎯 Key Implementation Details

### Dynamic Schema Handling
The application dynamically loads and renders input schemas based on Apify's schema format, supporting various input types including:
- Text inputs
- Number inputs
- Boolean toggles
- Array inputs
- Object inputs

### Error Handling
Comprehensive error handling for:
- Invalid API keys
- Network failures
- Schema validation errors
- Actor execution failures

### Security Features
- API key validation
- Input sanitization
- CORS configuration
- Environment variable protection

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📸 Screenshots

[Add screenshots of your working application here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔧 Troubleshooting

### API Key Issues

If you're getting "Invalid API key" errors:

1. **Verify your API key format**: Apify API keys typically start with `apify_api_` followed by a long string
2. **Check API key permissions**: Ensure your API key has the necessary permissions to access actors
3. **Test the API key**: Use the test script to validate your API key:
   ```bash
   node test-api-key.js your_api_key_here
   ```

### Backend Connection Issues

If the frontend can't connect to the backend:

1. **Check if backend is running**: Ensure the backend server is started on port 5002
2. **Verify ports**: Frontend should be on port 3000, backend on port 5002
3. **Check proxy configuration**: The frontend proxy should point to `http://localhost:5002`

### Common Error Messages

- **"Cannot connect to backend"**: Backend server is not running
- **"Invalid API key"**: API key is incorrect or has insufficient permissions
- **"Backend service not found"**: Port mismatch or backend not accessible

### Debugging Steps

1. Start the backend server and check for any error messages
2. Test the health endpoint: `http://localhost:5002/health`
3. Use the test script to validate your API key
4. Check browser console for any JavaScript errors
5. Verify environment variables are set correctly

## 🔗 Links

- [Apify API Documentation](https://docs.apify.com/api/v2)
- [Apify Console](https://console.apify.com/)
- [React Documentation](https://reactjs.org/)
- [Express.js Documentation](https://expressjs.com/) 