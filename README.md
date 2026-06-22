# Emergency Response App

A full-stack mobile and web application combining WhatsApp-like messaging with emergency response, real-time location tracking, and community engagement.

## Features

- 🔐 Multi-step user registration with identity verification (AES-256 encrypted)
- 💬 Real-time WhatsApp-style messaging with WebSocket support
- 🚨 Emergency alert system with GPS location capture
- 📍 Real-time location tracking and live map visualization
- 👥 Community engagement with posts, likes, and reputation scoring
- 📰 News and alerts feed integration
- 🔑 JWT-based authentication with role-based access control
- 🛡️ End-to-end encryption (AES-256) for messages and sensitive data
- ⚡ Redis caching and real-time features
- 📱 Mobile-first UI inspired by WhatsApp and Safaricom OneApp

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.9+)
- **Database**: PostgreSQL
- **Cache/Real-time**: Redis
- **WebSocket**: Python WebSockets
- **Security**: JWT, bcrypt, AES-256
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React Native (Expo)
- **UI**: React Native Paper, Material Design
- **Maps**: Google Maps
- **Real-time**: WebSocket client
- **State Management**: Redux
- **Navigation**: React Navigation

## Project Structure

```
emergency-response-app/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── auth/           # Authentication & JWT
│   │   ├── users/          # User management
│   │   ├── messaging/      # Chat & messages
│   │   ├── emergency/      # Emergency alerts
│   │   ├── location/       # Location tracking
│   │   ├── community/      # Community engagement
│   │   ├── services/       # External integrations
│   │   ├── utils/          # Encryption, helpers
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── main.py         # Application entry
│   ├── migrations/         # Database migrations
│   ├── tests/              # Unit tests
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Docker configuration
│   ├── .env.example        # Environment template
│   └── alembic.ini         # Database migration config
├── frontend/               # React Native mobile app
│   ├── src/
│   │   ├── screens/
│   │   │   ├── Auth/
│   │   │   ├── Chat/
│   │   │   ├── Emergency/
│   │   │   ├── Map/
│   │   │   ├── Community/
│   │   │   └── Profile/
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API & WebSocket clients
│   │   ├── store/          # Redux store
│   │   ├── utils/          # Helpers & utilities
│   │   ├── navigation/     # Navigation config
│   │   └── App.tsx         # Root component
│   ├── app.json            # Expo config
│   ├── package.json        # Dependencies
│   └── tsconfig.json       # TypeScript config
├── docker-compose.yml      # Local development setup
├── nginx.conf              # Nginx reverse proxy config
├── docs/                   # Documentation
│   ├── API.md              # API documentation
│   ├── DEPLOYMENT.md       # Deployment guide
│   ├── SECURITY.md         # Security best practices
│   └── DATABASE.md         # Database schema
└── .github/
    └── workflows/          # CI/CD pipelines
```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 16+
- Python 3.9+
- PostgreSQL 13+
- Redis 6+

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install

# For Expo
npm start

# For Android
npm run android

# For iOS
npm run ios
```

### Docker Setup (Recommended)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- FastAPI backend on port 8000
- Nginx on port 80

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Verification
- `POST /api/verify/email` - Send email OTP
- `POST /api/verify/email/confirm` - Confirm email OTP
- `POST /api/verify/phone` - Send SMS OTP
- `POST /api/verify/phone/confirm` - Confirm SMS OTP
- `POST /api/verify/upload-id` - Upload identity document
- `GET /api/verify/status` - Get verification status

### Messaging
- `GET /api/messages/chats` - List all chats
- `GET /api/messages/chat/{chat_id}` - Get chat messages
- `POST /api/messages/send` - Send message
- `WS /ws/chat/{chat_id}` - WebSocket for real-time chat

### Emergency
- `POST /api/emergency/alert` - Trigger emergency alert
- `GET /api/emergency/alerts` - Get nearby emergency alerts
- `GET /api/emergency/services` - Get nearby emergency services

### Location
- `POST /api/location/update` - Update user location
- `GET /api/location/tracking/{user_id}` - Track user location
- `GET /api/location/map` - Get live map data

### Community
- `GET /api/community/posts` - Get feed posts
- `POST /api/community/posts` - Create post
- `POST /api/community/posts/{post_id}/like` - Like post
- `POST /api/community/posts/{post_id}/comment` - Comment on post

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search` - Search users

## Security

- ✅ AES-256 encryption for messages and sensitive data
- ✅ bcrypt password hashing
- ✅ JWT authentication with refresh tokens
- ✅ HTTPS/TLS support
- ✅ Rate limiting on all endpoints
- ✅ Input validation & sanitization
- ✅ CORS protection
- ✅ SQL injection prevention with ORM

## Environment Variables

See `.env.example` for all required variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/emergency_app
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# External Services
SMS_API_KEY=your-sms-key
EMAIL_API_KEY=your-email-key
GOOGLE_MAPS_API_KEY=your-maps-key

# Emergency Contacts
EMERGENCY_POLICE=911
EMERGENCY_MEDICAL=911
EMERGENCY_FIRE=911
```

## Documentation

- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security Best Practices](docs/SECURITY.md)

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
