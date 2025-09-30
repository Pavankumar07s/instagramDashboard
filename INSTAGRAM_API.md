# Instagram API Integration

This project integrates with the Instagram Premium API 2023 to fetch real user profile data.

## Setup

1. **Get API Access**:
   - Visit [RapidAPI Instagram Premium API 2023](https://rapidapi.com/DataFanatic/api/instagram-premium-api-2023)
   - Create an account and subscribe to the API
   - Copy your API key

2. **Configure Environment**:
   - Update `.env.local` with your API key:
   ```
   RAPIDAPI_KEY=your_actual_api_key_here
   ```

3. **Start Development**:
   ```bash
   pnpm dev
   ```

## Features

The application now fetches and displays:

- **Profile Information**:
  - Full name and username
  - Profile picture (HD version)
  - Verification status
  - Privacy status
  - Category (e.g., Education, Business)

- **Statistics**:
  - Followers count
  - Following count
  - Posts count

- **Biography**:
  - Complete bio text with formatting
  - External links from bio

## API Response Mapping

The Instagram API response is mapped to our Profile type as follows:

```typescript
// Instagram API -> Our Profile Type
full_name -> name
username -> username
profile_pic_url_hd -> profilePic
edge_followed_by.count -> followers
edge_follow.count -> following
edge_owner_to_timeline_media.count -> postsCount
biography -> biography
bio_links -> bioLinks
category_name -> categoryName
is_verified -> isVerified
is_private -> isPrivate
```

## Error Handling

- If the API fails or returns no data, the application falls back to mock data
- API errors are logged to the console for debugging
- Users see a graceful fallback experience

## Usage

1. Enter an Instagram username in the search box
2. The app will fetch real data from Instagram's API
3. View the comprehensive profile information in a professional layout
