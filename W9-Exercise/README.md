# Week 9: Database Sequelizing & Academic Performance API

This project contains the complete solution for Week 9 Backend Development practice, based on `Word/Tasks .docx`.

## Table of Contents
1. [Overview](#overview)
2. [Database Schema & Models](#database-schema--models)
3. [Setup & Installation](#setup--installation)
4. [Database Seeding](#database-seeding)
5. [Running the Application](#running-the-application)
6. [API Endpoints Reference](#api-endpoints-reference)

---

## Overview
This application implements Sequelize ORM models, relationships, and queries to answer Exercises 1 through 5 and build Part II Academic Performance API endpoints.

---

## Database Schema & Models

- **`Major`** (`majors`): `id`, `name`, `code`
- **`Course`** (`courses`): `id`, `name`, `credit`, `status` (`'active'` | `'inactive'`), `major_id`
- **`Student`** (`students`): `id`, `full_name` (combined), `gender`, `email`
- **`Score`** (`scores`): `id`, `score`, `academic_year`, `student_id`, `course_id`

### Relationship Path
```
Major (1) <---> (N) Course (1) <---> (N) Score (N) <---> (1) Student
```

---

## Setup & Installation

```bash
cd W9
npm install
```

---

## Database Seeding

Run the seed script to populate sample data:

```bash
npm run seed
```

---

## Running the Application

### Development mode:
```bash
npm run dev
```

### Production / Standard mode:
```bash
npm run start
```

Swagger API Documentation is available at:
`http://localhost:3000/api-docs`

---

## API Endpoints Reference

### Exercises 1 - 5
- **Exercise 1 (High-performing students in 2025-2026)**
  - `GET /api/exercises/ex1`
- **Exercise 2 (Score range [60, 90] with `Op.between`)**
  - `GET /api/exercises/ex2`
- **Exercise 3 (Search by keyword & minimum score)**
  - `GET /api/exercises/ex3?keyword=dara&minScore=70`
- **Exercise 4 (Full Academic Report `Student -> Score -> Course -> Major`)**
  - `GET /api/exercises/ex4`
- **Exercise 5 (Average score per student using `Sequelize.fn('AVG')`)**
  - `GET /api/exercises/ex5`

### Part II: Academic Performance API
- **Search Scores**: `GET /api/reports/scores?keyword=dara&minScore=70`
- **Student Performance**: `GET /api/reports/student-performance`
- **Course Performance**: `GET /api/reports/course-performance`
- **Major Performance**: `GET /api/reports/major-performance`
- **Top Students**: `GET /api/reports/top-students`
- **At-Risk Students**: `GET /api/reports/at-risk-students`
- **Pass Rate Summary**: `GET /api/reports/pass-rate`
