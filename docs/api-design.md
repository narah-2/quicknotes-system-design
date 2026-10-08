# QuickNotes API Design

## 1. Overview

The QuickNotes API allows users to create, view, update, and delete notes. It also supports organizing notes with tags. The production API will use REST principles and JSON for request and response bodies.

Base URL: `https://api.quicknotes.example.com/v1`

Authentication: Protected endpoints require a valid bearer access token.

## 2. REST Endpoints

| Method | Path                       | Description                         | Success Status |
| ------ | -------------------------- | ----------------------------------- | -------------- |
| POST   | `/auth/register`           | Register a new user                 | 201 Created    |
| POST   | `/auth/login`              | Authenticate a user                 | 200 OK         |
| GET    | `/notes`                   | List the authenticated user's notes | 200 OK         |
| GET    | `/notes/{id}`              | Retrieve one note                   | 200 OK         |
| POST   | `/notes`                   | Create a note                       | 201 Created    |
| PATCH  | `/notes/{id}`              | Update a note                       | 200 OK         |
| DELETE | `/notes/{id}`              | Delete a note                       | 204 No Content |
| GET    | `/tags`                    | List the user's tags                | 200 OK         |
| POST   | `/notes/{id}/tags/{tagId}` | Attach a tag to a note              | 204 No Content |

## 3. List Notes

Request:

`GET /v1/notes?page=1&limit=20`

Header:

`Authorization: Bearer <access_token>`

Success status: `200 OK`

Example response:

```json
{
  "data": [
    {
      "id": 101,
      "title": "Project plan",
      "body": "Finish the project proposal.",
      "createdAt": "2026-10-09T08:00:00Z",
      "updatedAt": "2026-10-09T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

## 4. Create a Note

Request:

`POST /v1/notes`

Headers:

`Authorization: Bearer <access_token>`

`Content-Type: application/json`

Example request body:

```json
{
  "title": "Project plan",
  "body": "Finish the project proposal."
}
```

Success status: `201 Created`

Example response:

```json
{
  "id": 101,
  "title": "Project plan",
  "body": "Finish the project proposal.",
  "createdAt": "2026-10-09T08:00:00Z",
  "updatedAt": "2026-10-09T08:00:00Z"
}
```

The server assigns the note ID and timestamps. Each note belongs to the authenticated user.

## 5. Error Status Codes

| Status | Name                  | Meaning                                              |
| ------ | --------------------- | ---------------------------------------------------- |
| 400    | Bad Request           | Invalid input or malformed JSON                      |
| 401    | Unauthorized          | Missing or invalid authentication                    |
| 403    | Forbidden             | Authenticated user lacks permission                  |
| 404    | Not Found             | Note or resource does not exist or is not accessible |
| 409    | Conflict              | Duplicate or conflicting resource                    |
| 422    | Unprocessable Entity  | Input fails validation                               |
| 429    | Too Many Requests     | Rate limit exceeded                                  |
| 500    | Internal Server Error | Unexpected server failure                            |
| 503    | Service Unavailable   | Service temporarily unavailable                      |

Example error body:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The note title is required.",
    "details": {
      "field": "title"
    }
  }
}
```

## 6. Validation and Security

* Titles are required and must not exceed 100 characters.
* Note bodies are optional.
* The API validates all input on the server.
* Authentication uses short-lived access tokens.
* Users can only access and modify their own notes.
* Requests are rate-limited to reduce abuse.
* All production traffic uses HTTPS.
* Errors must not expose passwords, tokens, or internal implementation details.

## 7. Pagination and Performance

The notes endpoint supports `page` and `limit` parameters. The default page size is 20, with a maximum of 100 notes per request. Pagination avoids returning an unnecessarily large response.

## 8. API Versioning

The `/v1` prefix identifies the first API version. Breaking changes should be introduced through a new version while allowing clients time to migrate.

## 9. Practice API Note

The front-end assignment uses JSONPlaceholder at `https://jsonplaceholder.typicode.com/posts` to practise GET, POST, and DELETE requests. JSONPlaceholder is a demonstration service, not the production QuickNotes API described in this document.
