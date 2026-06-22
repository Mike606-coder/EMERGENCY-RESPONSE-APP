# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

All authenticated endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

## Response Format

All API responses follow this format:
```json
{
  "data": {},
  "message": "Success",
  "status": 200
}
```

---

## Authentication Endpoints

### 1. User Registration

**POST** `/auth/register`

Register a new user.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "message": "Registration initiated. Please verify your email and phone.",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "verification_required": [
    "email",
    "phone"
  ]
}
```

**Status Codes:**
- 201: User created successfully
- 400: Validation error
- 409: User already exists

---

### 2. User Login

**POST** `/auth/login`

Authenticate a user and receive tokens.

**Request Body:**
```json
{
  "email_or_phone": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "verification_status": "pending"
  }
}
```

**Status Codes:**
- 200: Login successful
- 401: Invalid credentials
- 403: Account not verified

---

### 3. Refresh Token

**POST** `/auth/refresh`

Refresh an expired access token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 1800
}
```

---

### 4. Logout

**POST** `/auth/logout`

Logout the current user.

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

---

## Verification Endpoints

### 1. Send Email OTP

**POST** `/auth/verify/email`

Send OTP to user's email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent to email",
  "expires_in": 600
}
```

---

### 2. Verify Email OTP

**POST** `/auth/verify/email/confirm`

Confirm email with OTP.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Email verified successfully"
}
```

---

### 3. Send SMS OTP

**POST** `/auth/verify/phone`

Send OTP to user's phone.

**Request Body:**
```json
{
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "OTP sent to phone",
  "expires_in": 600
}
```

---

### 4. Verify Phone OTP

**POST** `/auth/verify/phone/confirm`

Confirm phone with OTP.

**Request Body:**
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Phone verified successfully"
}
```

---

### 5. Upload ID Document

**POST** `/auth/verify/upload-id` (Multipart Form Data)

Upload identity document for verification.

**Request:**
```
Form Data:
- id_type: "national_id" | "passport"
- id_number: "1234567890" (encrypted)
- id_image: <file> (JPG, PNG, or PDF)
- selfie: <file> (JPG or PNG)
```

**Response:**
```json
{
  "message": "ID documents uploaded successfully",
  "verification_status": "pending"
}
```

---

### 6. Get Verification Status

**GET** `/auth/verify/status` (Requires Auth)

Get current user's verification status.

**Response:**
```json
{
  "email_verified": true,
  "phone_verified": true,
  "verification_status": "verified",
  "verified_at": "2024-01-15T10:30:00Z"
}
```

---

## User Endpoints

### 1. Get User Profile

**GET** `/users/profile` (Requires Auth)

Get current user's profile.

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "johndoe",
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "user",
  "reputation_score": 42,
  "help_count": 5,
  "emergency_reports_count": 2,
  "verification_status": "verified",
  "profile_picture_url": "https://...",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 2. Update User Profile

**PUT** `/users/profile` (Requires Auth)

Update current user's profile.

**Request Body:**
```json
{
  "full_name": "John Updated",
  "profile_picture_url": "https://...",
  "bio": "Emergency responder"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { /* updated user data */ }
}
```

---

### 3. Search Users

**GET** `/users/search?query=john` (Requires Auth)

Search for users by username or name.

**Query Parameters:**
- `query` (string, required): Search query
- `limit` (integer, optional, default: 20): Number of results

**Response:**
```json
{
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "full_name": "John Doe",
      "reputation_score": 42,
      "is_responder": false
    }
  ],
  "count": 1
}
```

---

## Messaging Endpoints

### 1. Get All Chats

**GET** `/messages/chats` (Requires Auth)

Get all chats for the current user.

**Query Parameters:**
- `limit` (integer, optional, default: 50): Number of results
- `offset` (integer, optional, default: 0): Pagination offset

**Response:**
```json
{
  "chats": [
    {
      "id": "chat-id-123",
      "name": "Emergency Group",
      "chat_type": "group",
      "member_count": 5,
      "last_message": {
        "id": "msg-id-456",
        "content": "Help needed at Main St",
        "sender_id": "user-id-789",
        "created_at": "2024-01-15T10:30:00Z"
      },
      "unread_count": 2,
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

### 2. Get Chat Messages

**GET** `/messages/chat/{chat_id}` (Requires Auth)

Get messages in a specific chat.

**Query Parameters:**
- `limit` (integer, optional, default: 50): Number of messages
- `offset` (integer, optional, default: 0): Pagination offset

**Response:**
```json
{
  "chat_id": "chat-id-123",
  "messages": [
    {
      "id": "msg-id-456",
      "chat_id": "chat-id-123",
      "sender_id": "user-id-789",
      "content": "Help needed at Main St",
      "message_type": "text",
      "created_at": "2024-01-15T10:30:00Z",
      "read_at": "2024-01-15T10:31:00Z"
    }
  ],
  "count": 1
}
```

---

### 3. Send Message

**POST** `/messages/send` (Requires Auth)

Send a message to a chat.

**Request Body:**
```json
{
  "chat_id": "chat-id-123",
  "content": "Help needed at Main St",
  "message_type": "text"
}
```

**Response:**
```json
{
  "message_id": "msg-id-456",
  "status": "sent",
  "created_at": "2024-01-15T10:30:00Z",
  "encrypted": true
}
```

---

### 4. WebSocket Chat

**WS** `/ws/chat/{chat_id}` (Requires Auth)

WebSocket connection for real-time messaging.

**Connection:**
```
ws://localhost:8000/ws/chat/chat-id-123?token=access_token
```

**Messages:**

*Receive message:*
```json
{
  "type": "message",
  "message": {
    "id": "msg-id-456",
    "sender_id": "user-id-789",
    "content": "Help needed",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

*Typing indicator:*
```json
{
  "type": "typing",
  "user_id": "user-id-789",
  "username": "johndoe"
}
```

*Read receipt:*
```json
{
  "type": "read",
  "message_id": "msg-id-456",
  "user_id": "user-id-789"
}
```

---

## Emergency Endpoints

### 1. Trigger Emergency Alert

**POST** `/emergency/alert` (Requires Auth)

Trigger an emergency alert at current location.

**Request Body:**
```json
{
  "emergency_type": "medical",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "description": "Person unconscious, needs immediate help"
}
```

**Response:**
```json
{
  "alert_id": "alert-id-123",
  "status": "active",
  "message": "Emergency alert sent to nearby responders",
  "responders_notified": 15,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 2. Get Nearby Emergency Alerts

**GET** `/emergency/alerts?latitude=40.7128&longitude=-74.0060&radius_km=5` (Requires Auth)

Get emergency alerts near a location.

**Query Parameters:**
- `latitude` (float, required): Latitude
- `longitude` (float, required): Longitude
- `radius_km` (float, optional, default: 5): Search radius in kilometers

**Response:**
```json
{
  "alerts": [
    {
      "id": "alert-id-123",
      "emergency_type": "medical",
      "status": "active",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "description": "Person unconscious",
      "severity": 5,
      "responder_count": 5,
      "created_at": "2024-01-15T10:30:00Z",
      "distance_km": 0.5
    }
  ],
  "count": 1,
  "location": { "latitude": 40.7128, "longitude": -74.0060 }
}
```

---

### 3. Get Nearby Emergency Services

**GET** `/emergency/services?latitude=40.7128&longitude=-74.0060&service_type=medical&radius_km=5` (Requires Auth)

Get nearby emergency services.

**Query Parameters:**
- `latitude` (float, required): Latitude
- `longitude` (float, required): Longitude
- `service_type` (string, required): "police", "medical", "fire"
- `radius_km` (float, optional, default: 5): Search radius

**Response:**
```json
{
  "services": [
    {
      "id": "service-id-123",
      "service_type": "medical",
      "service_name": "Downtown Hospital",
      "phone_number": "+1234567890",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "123 Main St, New York, NY",
      "response_time": 5,
      "distance_km": 0.5
    }
  ],
  "count": 1,
  "service_type": "medical"
}
```

---

## Location Endpoints

### 1. Update User Location

**POST** `/location/update` (Requires Auth)

Update current user's location.

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "altitude": 10.5,
  "accuracy": 5.0,
  "heading": 0.0,
  "speed": 0.0
}
```

**Response:**
```json
{
  "message": "Location updated",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. Get User Location

**GET** `/location/tracking/{user_id}` (Requires Auth, Admin or Self)

Get a user's current location.

**Response:**
```json
{
  "user_id": "user-id-789",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 5.0,
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 3. Get Live Map Data

**GET** `/location/map?latitude=40.7128&longitude=-74.0060&radius_km=5` (Requires Auth)

Get live map data (users, alerts, services).

**Query Parameters:**
- `latitude` (float, required): Latitude
- `longitude` (float, required): Longitude
- `radius_km` (float, optional, default: 5): Search radius

**Response:**
```json
{
  "users": [
    {
      "id": "user-id-789",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "username": "johndoe",
      "is_responder": false
    }
  ],
  "alerts": [],
  "services": [],
  "location": { "latitude": 40.7128, "longitude": -74.0060 }
}
```

---

## Community Endpoints

### 1. Get Community Feed

**GET** `/community/posts?limit=20&offset=0` (Requires Auth)

Get community posts feed.

**Query Parameters:**
- `limit` (integer, optional, default: 20): Number of posts
- `offset` (integer, optional, default: 0): Pagination offset
- `post_type` (string, optional): Filter by post type

**Response:**
```json
{
  "posts": [
    {
      "id": "post-id-123",
      "user_id": "user-id-789",
      "title": "Help Needed at Main St",
      "content": "Person needs medical assistance",
      "post_type": "help_request",
      "status": "active",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "like_count": 5,
      "comment_count": 2,
      "help_count": 3,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

### 2. Create Community Post

**POST** `/community/posts` (Requires Auth)

Create a new community post.

**Request Body:**
```json
{
  "title": "Help Needed at Main St",
  "content": "Person needs medical assistance",
  "post_type": "help_request",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "tags": ["medical", "urgent"]
}
```

**Response:**
```json
{
  "post_id": "post-id-123",
  "message": "Post created successfully",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 3. Like Post

**POST** `/community/posts/{post_id}/like` (Requires Auth)

Like a post.

**Response:**
```json
{
  "message": "Post liked",
  "like_count": 6
}
```

---

### 4. Comment on Post

**POST** `/community/posts/{post_id}/comment` (Requires Auth)

Add a comment to a post.

**Request Body:**
```json
{
  "content": "I can help with this"
}
```

**Response:**
```json
{
  "comment_id": "comment-id-456",
  "message": "Comment posted",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "error_code",
  "message": "Error description",
  "status": 400,
  "details": {}
}
```

### Common Error Codes

- `400`: Bad Request - Validation error
- `401`: Unauthorized - Missing or invalid token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `409`: Conflict - Resource already exists
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error

---

## Rate Limiting

API endpoints are rate-limited at 60 requests per minute per IP/user.

Rate limit information is returned in response headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642267200
```

---

## Pagination

List endpoints support pagination using `limit` and `offset` parameters:

```
GET /community/posts?limit=20&offset=0
```

**Response:**
```json
{
  "data": [],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 100,
    "pages": 5
  }
}
```
