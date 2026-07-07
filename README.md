# Daily Log Tracker

## Overview
Daily Log Tracker lets every team member share a concise summary of their day while giving managers a consolidated view of the entire team’s progress, blockers, and achievements.

## Architecture
- **Frontend**: Create React App (JavaScript) that consumes the backend API for creating and listing logs.
- **Backend**: ASP.NET Core 8 minimal API powered by Entity Framework Core with SQLite for persistence.

## Getting started
### Backend
1. `cd backend`
2. `dotnet restore`
3. `dotnet build`
4. `dotnet run`
   - Defaults to `http://localhost:5000`.

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`
   - Runs on `http://localhost:3000` and proxies API requests to `http://localhost:5000` unless `REACT_APP_API_URL` is set.

## Manager workflow
- Switch to the **Manager** role in the UI to filter logs by employee or date.
- Filters run client-side after fetching the selected employee’s logs (or all logs if no employee is chosen).

## Notes
- Backend data lives in `backend/dailylogs.db` when running locally.
- Update the `REACT_APP_API_URL` environment variable if the API runs on a different host or port.
