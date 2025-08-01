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
PORT=5000
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
- Backend API: http://localhost:5000

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

## 🔗 Links

- [Apify API Documentation](https://docs.apify.com/api/v2)
- [Apify Console](https://console.apify.com/)
- [React Documentation](https://reactjs.org/)
- [Express.js Documentation](https://expressjs.com/) 