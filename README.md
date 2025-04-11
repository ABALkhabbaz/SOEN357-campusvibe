# CampusVibe

CampusVibe is a simple event discovery and registration platform designed to help Concordia students stay informed and engaged with on-campus events. It solves the problem of scattered event information by providing a centralized, easy-to-use interface that students can access on any device.

## Project Overview

This project was developed as part of SOEN 357 – Human-Computer Interaction. The goal is to apply UI/UX principles and design methods to build a usable prototype website that improves student engagement at Concordia.

## Features

- Browse upcoming campus events
- Register and Cancel registration for events
- My Events page showing only registered events
- Dynamic Navbar that changes based on login state
- Clean success notifications for actions (register / cancel)
- Login and Signup functionality
- Manual event submission page
- Responsive and user-friendly web interface
- Consistent UI based on Concordia University style

## Tech Stack

- **Frontend:** React, HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (via `pg` and `pg-pool`)
- **Image Upload:** Multer (saved locally)
- **Version Control:** Git + GitHub


## Setup Instructions

1. Clone the repo
2. Run `npm install` in both `frontend` and `backend`
3. Set up a local PostgreSQL database:
   - Create a `campusvibe` database
   - Run the schema in `backend/schema.sql`
4. Create a `db.js` file with your credentials:
   ```js
   const pool = new Pool({
     user: 'your_username',
     host: 'localhost',
     database: 'campusvibe',
     password: '',
     port: 5432
   });
5. Run the backend: node server.js
6. Run the frontend: npm start   


## Final Deliverables

- Functional event discovery and registration website
- GitHub repository with all code and documentation
- UI/UX design following HCI principles
- Basic user testing and evaluation summary
- User research and observation report
- Final project report (methods, results, discussion)

## Team

- Abdelrahman Alkhabbaz  40258582
- Ali Eldeeb 40237796
- AbdelRahman Eldeeb 40245477
- Mostafa Mohamed 40201893

## License

This project is for educational purposes only (SOEN 357 at Concordia University).
