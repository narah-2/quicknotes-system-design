# QuickNotes System Design

## Project Description

QuickNotes is a note-taking application designed to evolve from a browser-only app into a reliable online service capable of supporting one million registered users.

This project demonstrates how a frontend communicates with a REST API and documents the backend design, database model, and scalable system architecture.

The API client uses JSONPlaceholder as a practice API for loading, creating, and deleting notes. The design documents describe the production QuickNotes service that a backend team could build.

## Features

* Load up to 10 notes from the practice API.
* Create notes with a required title and an optional body.
* Delete notes from the displayed list.
* Display loading, success, error, and empty states.
* Validate note titles and handle failed requests.
* Document REST endpoints, database relationships, and system architecture.

## Technologies

* HTML5
* CSS3
* JavaScript (async/await and Fetch API)
* JSONPlaceholder practice API
* Markdown
* PostgreSQL for the proposed production data model
* Mermaid for the architecture diagram

## How to Run the API Client

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code or another code editor.
3. Open `index.html` using a local development server, such as the Live Server extension in Visual Studio Code.
4. Click **Load notes** to retrieve notes from JSONPlaceholder.
5. Use the form to create a note.
6. Click **Delete** beside a displayed note to test the DELETE request.

An internet connection is required to contact JSONPlaceholder.

### Practice API

`https://jsonplaceholder.typicode.com/posts`

The practice API simulates data operations. Created or deleted notes are not permanently stored by JSONPlaceholder, so changes should not be treated as persistent server data.

## System Design Documents

* [API Design](docs/api-design.md) — REST endpoints, request and response examples, status codes, validation, and security.
* [Data Model](docs/data-model.md) — Database entities, keys, relationships, SQL statements, queries, indexes, and database choice.
* [Architecture](docs/architecture.md) — Functional and non-functional requirements, capacity estimates, architecture diagram, request flows, trade-offs, and reliability.

## Scaling Assumptions

The architecture uses one million registered users as its planning target. Traffic and storage figures are estimates based on stated daily activity assumptions, not production measurements.

The proposed design includes a CDN, load balancer, multiple application servers, a distributed cache, a primary database, a read replica, and asynchronous background processing.

## What I Learned

1. How to use JavaScript's Fetch API and async/await to communicate with a REST API.
2. How to handle loading, success, error, and empty states while validating user input.
3. How GET, POST, and DELETE requests support basic CRUD operations.
4. How primary keys, foreign keys, indexes, and JOIN queries support a relational database.
5. How caching, read replicas, load balancing, and background queues can improve scalability.
6. How to document API contracts, database design, capacity estimates, and architectural trade-offs.

## Project Status

This is an educational system-design project. The frontend uses JSONPlaceholder for practice, while the documents describe a proposed production backend. A real production service would require backend implementation, authentication, persistent storage, monitoring, and deployment.
