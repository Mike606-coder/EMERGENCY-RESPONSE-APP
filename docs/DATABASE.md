# Database Schema

## Tables

### Users Table

Stores user account information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Verification
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  verification_status VARCHAR(20) DEFAULT 'pending',
  
  -- Identity (Encrypted)
  national_id VARCHAR(255),
  passport_number VARCHAR(255),
  id_country VARCHAR(100),
  
  -- Media
  id_image_path VARCHAR(500),
  selfie_path VARCHAR(500),
  profile_picture_path VARCHAR(500),
  
  -- Role & Permissions
  role VARCHAR(20) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  is_responder BOOLEAN DEFAULT false,
  responder_type VARCHAR(50),
  
  -- Stats
  reputation_score INTEGER DEFAULT 0,
  help_count INTEGER DEFAULT 0,
  emergency_reports_count INTEGER DEFAULT 0,
  
  -- Metadata
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_phone (phone)
);
```

### Chats Table

Stores one-to-one and group chats.

```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  chat_type VARCHAR(20) DEFAULT 'direct',
  description TEXT,
  group_picture_path VARCHAR(500),
  is_emergency_group BOOLEAN DEFAULT false,
  admin_id UUID,
  
  -- Encryption
  is_encrypted BOOLEAN DEFAULT true,
  encryption_key VARCHAR(255),
  
  -- Stats
  member_count INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP
);
```

### Chat Members Table

Stores chat membership information.

```sql
CREATE TABLE chat_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Role
  role VARCHAR(20) DEFAULT 'member',
  
  -- Notification Settings
  notifications_enabled BOOLEAN DEFAULT true,
  muted BOOLEAN DEFAULT false,
  
  -- Read Status
  last_read_message_id UUID,
  last_read_at TIMESTAMP,
  
  -- Timestamps
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP,
  
  UNIQUE(chat_id, user_id),
  INDEX idx_user_id (user_id)
);
```

### Messages Table

Stores chat messages.

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  
  -- Content (Encrypted)
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text',
  media_path VARCHAR(500),
  media_url VARCHAR(500),
  
  -- Metadata
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP,
  
  -- Read Receipts
  read_at TIMESTAMP,
  delivered_at TIMESTAMP,
  
  -- Reactions
  reactions JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_chat_id (chat_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_created_at (created_at)
);
```

### Emergencies Table

Stores emergency alerts.

```sql
CREATE TABLE emergencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_phone VARCHAR(20),
  user_verified BOOLEAN DEFAULT false,
  
  -- Emergency Details
  emergency_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  description TEXT,
  severity INTEGER DEFAULT 1,
  
  -- Location
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  location_address VARCHAR(500),
  location_accuracy FLOAT,
  
  -- Responders
  responder_ids JSONB DEFAULT '[]',
  responder_count INTEGER DEFAULT 0,
  
  -- Engagement
  help_offers INTEGER DEFAULT 0,
  reactions JSONB DEFAULT '{}',
  
  -- Media
  media_paths JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  expires_at TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_location (latitude, longitude),
  INDEX idx_created_at (created_at)
);
```

### Emergency Contacts Table

Stores emergency service numbers and locations.

```sql
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type VARCHAR(50) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  address VARCHAR(500),
  city VARCHAR(100),
  country VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  response_time INTEGER,
  website VARCHAR(500),
  email VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Location History Table

Stores user location history for tracking.

```sql
CREATE TABLE location_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  altitude FLOAT,
  accuracy FLOAT,
  heading FLOAT,
  speed FLOAT,
  address VARCHAR(500),
  city VARCHAR(100),
  country VARCHAR(100),
  device_type VARCHAR(50),
  is_emergency BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  recorded_at TIMESTAMP NOT NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);
```

### Location Preferences Table

Stores user location sharing preferences.

```sql
CREATE TABLE location_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  share_live_location BOOLEAN DEFAULT true,
  share_with_responders BOOLEAN DEFAULT true,
  share_with_contacts BOOLEAN DEFAULT true,
  location_accuracy VARCHAR(20) DEFAULT 'precise',
  update_interval_seconds INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Community Posts Table

Stores community posts and help requests.

```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  post_type VARCHAR(50) DEFAULT 'help_request',
  status VARCHAR(20) DEFAULT 'active',
  
  -- Location
  latitude FLOAT,
  longitude FLOAT,
  location_address VARCHAR(500),
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  category VARCHAR(100),
  priority INTEGER DEFAULT 1,
  
  -- Media
  media_paths JSONB DEFAULT '[]',
  
  -- Engagement
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  help_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Resolution
  resolved_by_user_id UUID,
  resolution_note TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_post_type (post_type),
  INDEX idx_created_at (created_at)
);
```

### Comments Table

Stores comments on posts.

```sql
CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP,
  INDEX idx_post_id (post_id),
  INDEX idx_user_id (user_id)
);
```

### Likes Table

Stores likes on posts and comments.

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);
```

### Verification OTPs Table

Stores OTP codes for email and phone verification.

```sql
CREATE TABLE verification_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  contact VARCHAR(255) NOT NULL,
  contact_type VARCHAR(20) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  is_used BOOLEAN DEFAULT false,
  attempt_count INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP
);
```

## Indexes

Key indexes for performance:

```sql
-- User searches
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Chat queries
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_chat_members_user_id ON chat_members(user_id);

-- Location queries
CREATE INDEX idx_location_history_user_id ON location_history(user_id);
CREATE INDEX idx_location_history_created_at ON location_history(created_at);

-- Emergency queries
CREATE INDEX idx_emergencies_user_id ON emergencies(user_id);
CREATE INDEX idx_emergencies_status ON emergencies(status);
CREATE INDEX idx_emergencies_created_at ON emergencies(created_at);

-- Community queries
CREATE INDEX idx_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_posts_status ON community_posts(status);
CREATE INDEX idx_comments_post_id ON community_comments(post_id);
```

## Relationships

```
Users (1) ---- (Many) Chats (admin_id)
Users (1) ---- (Many) Chat Members
Users (1) ---- (Many) Messages
Users (1) ---- (Many) Emergencies
Users (1) ---- (Many) Location History
Users (1) ---- (Many) Community Posts
Users (1) ---- (Many) Comments
Users (1) ---- (Many) Likes

Chats (1) ---- (Many) Chat Members
Chats (1) ---- (Many) Messages

Community Posts (1) ---- (Many) Comments
Community Posts (1) ---- (Many) Likes
Comments (1) ---- (Many) Likes
```

## Data Types

- `UUID`: PostgreSQL native UUID type
- `TIMESTAMP`: PostgreSQL timestamp with timezone
- `JSONB`: PostgreSQL JSON binary format for efficient querying
- `TEXT[]`: PostgreSQL array type for text values
- `FLOAT`: PostgreSQL double precision

## Backup Strategy

1. **Daily automated backups** to AWS S3
2. **Point-in-time recovery** enabled
3. **Replication** to standby server
4. **Monthly backup retention** for archival
