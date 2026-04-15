# IADT Football Analytics

Angular-based frontend for generating soccer tactics, including lineups, player roles, and tactical approaches using AI.

## Demo

![Demo](public/demo/IADT.gif)

## Architecture

This project is part of a full-stack system:

- Frontend: Angular (this repository)
- Backend: FastAPI service handling AI-driven tactical generation  
  👉 https://github.com/ehuberman/IADT-Backend

The frontend communicates with the backend to generate tactical insights based on selected players and formations.

## Tech Stack

- Angular 20  
- TypeScript  
- Tailwind CSS  

## Features

- Dynamic lineup visualization for soccer formations  
- AI-generated tactical recommendations via backend integration  
- Interactive UI for exploring different tactical approaches  

## Getting Started

This app requires both the frontend and backend to be running.

**1. Start the backend**

Clone the [IADT Backend](https://github.com/ehuberman/IADT-Backend) and follow its setup instructions. You'll need an OpenAI API key in a `.env` file:

```
OPENAI_API_KEY=your_api_key_here
```

Then start the backend server (default: http://localhost:8000).

**2. Start the frontend**

```bash
npm install
npx ng serve
```

Then open the app in your browser (default: http://localhost:4200).


## Notes

This project was built to explore:
- Integrating AI-driven insights into a frontend application  
- Full-stack communication between Angular and FastAPI  
- UI patterns for visualizing sports tactics  

## Future Improvements

- Real-time updates and streaming responses from backend  
- Enhanced player selection and formation editing  
- Improved UI/UX and animations 
