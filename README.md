# IADT Frontend (POC)

Angular-based frontend for generating soccer tactics, including lineups, player roles, and tactical approaches using AI.

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

```bash
npm install
ng serve
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
