## Inital diagram 

Backend Tree


           main.py  (root)
              │
      ┌───────┼────────┐
   routers  controllers  database
      │           │          │
   auth.py     auth.py    mongodb
   slot.py     slot.py

Module 1 :- Authentication Module  

Authentication Module
│
├── Step 1 → Request Schemas(user_schema.py)
├── Step 2 → Password Security
├── Step 3 → JWT Token Creation
├── Step 4 → Auth Controller (signup/login)
├── Step 5 → Auth Router (API endpoints)
├── Step 6 → Authentication Middleware