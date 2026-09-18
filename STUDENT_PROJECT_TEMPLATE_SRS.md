# Student Project Template (SRD)

CREATED FROM SRD DOC

> **Instruction for students:** This document serves as the formal "Contract" for your team project. It must be maintained in your GitHub repository.

## OurLibrary

### Software Requirements Specification

- **Instructor:** Lara Nichols-Brown
- **Term:** Fall 2026
- **Section:** 09

### The Engineering Team

- **Student A:** Gaven Bui — Scrum Master\*
- **Student B:** Sanjana Narasimhan — Product Owner\*
- **Student C:** Prasi Aravind — Lead Engineer\*
- **Student D:** Gwyn Marin — Tester\*

\*Roles will be rotated throughout the semester.

### Project Assets

- **GitHub:** [github.com/iyeri/csc-3100-project](https://github.com/iyeri/csc-3100-project) (private)
- **Deployment:** [Link to Live Site]

### Document History

| Last Date Changed | Who    | What Was Changed        |
| ----------------- | ------ | ----------------------- |
| 9/15/2026         | Gaven  | Wrote down class info & team roles. |
| 9/18/2026         | Prasi  | Established project purpose & problem statement. |
| 9/18/2026         | Gaven  | Established preliminary project stakeholders and scope. |
|                   |        |                         |
|                   |        |                         |

---

# [Project Title]

## Software Requirements Specification (SRS)

- **Course:** CSC 3100
- **Date:** [Submission Date]

## Table of Contents

1. [Introduction](#1-introduction)
   - [1.1 Project Purpose](#11-project-purpose)
   - [1.2 Intended Audience](#12-intended-audience)
   - [1.3 Project Scope](#13-project-scope)
2. [User Stories](#2-user-stories)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
   - [4.1 Data Integrity and Security](#41-data-integrity-and-security)
   - [4.2 Performance and Usability](#42-performance-and-usability)
5. [System Architecture](#5-system-architecture)
   - [5.1 REST API Endpoints](#51-rest-api-endpoints)
   - [5.2 Database Schema](#52-database-schema)
6. [User Interface](#6-user-interface)
   - [6.1 Wireframes and Mockups](#61-wireframes-and-mockups)
7. [Data Requirements](#7-data-requirements)
   - [7.1 Persistent Data](#71-persistent-data)
8. [Traceability Matrix](#8-traceability-matrix)
9. [AI Usage and Disclosure](#9-ai-usage-and-disclosure)
10. [Appendices](#10-appendices)

## 1. Introduction

### 1.1 Project Purpose

**Problem Statement:** What specific problem are you solving?

The importance of books in today's modern world is often understated. Many Cal Poly students are aware of this and even bring books with them to keep them company while at school. However, most books brought to school are personal favorites and are rarely ones they haven't read before. We'd like to fix this problem by allowing people to trade their books and __.

### 1.2 Intended Audience

**Target Audience:** Who are the stakeholders?

The stakeholders of OurLibrary are us, the developers / product owners, and the users of the app.

### 1.3 Project Scope

**Scope:** What is the scope of this project?

In terms of deployment and testing, OurLibrary's scope will be limited to the Cal Poly campus. However, the functionality of OurLibrary will be designed to used anywhere. (SUBJECT TO CHANGE)

## 2. User Stories

User stories follow this format:

> **As a [type of user], I want to [action] so that [value or benefit].**

| ID    | Requirement                                                  | Priority |
| ----- | ------------------------------------------------------------ | -------: |
| US-01 | As a user, I want to add books to lend.                      |        ? |
| US-02 | As a user, I want to remove books from my lending library.   |        ? |
| US-03 | As a user, I want to request to borrow a book.               |        ? |
| US-04 | As a user, I want to message another user to coordinate book drop offs. |        ? |
| US-05 | As a user, I want to change my profile picture and bio.      |        ? |
| US-05 | As a user, I want to mark books that are currently being lended. |        ? |
| US-06 | As a user, I want to set my lending/borrowing range.         |        ? |
| US-07 | As a user, I want to filter for books based on certain criteria. |        ? |

## 3. Functional Requirements

Functional requirements should follow this format:

> **The system shall...**

| ID    | Requirement                                                    | Priority |
| ----- | -------------------------------------------------------------- | -------: |
| FR-01 | The system shall authenticate users via username and password. |        ? |
| FR-02 | The system shall store the users' emails, usernames, and hashed passwords. |        ? |
| FR-03 | The system shall allow users to change their username and password. |        ? |
| FR-04 | The system shall send an email to a user if they make a 'forgot my password' request. |        ? |
| FR-04 | The system shall allow users to add books to their library for lending (and remove books if requested). |        ? |
| FR-05 | The system shall store book data (title, author, genre).       |        ? |
| FR-06 | The system shall allow users to notify and message other users about interest in borrowing a book. |        ? |
| FR-07 | The system shall store and display user uploaded profile pictures. |        ? |
| FR-08 | The system shall allow users to write and save personal biographes. |        ? |
| FR-09 | The system shall allow users to mark books as available or lent. |        ? |
| FR-10 | The system shall allow to add a location range for lending/borrowing books. |        ? |
| FR-11 | The system shall store a user selected location (with radius), indicating their range of interaction. |        ? |
| FR-12 | The system shall allow users to search for books by title, author, and/or genre. |        ? |

## 4. Non-Functional Requirements

### 4.1 Data Integrity and Security

- **Integrity:** Describe how the system will handle errors and invalid data.
- **Security:** Implement bcrypt for password hashing and environment variables for database credentials.

### 4.2 Performance and Usability

- **Performance:** [Define performance requirements.]
- **Usability:** [Define usability requirements.]

## 5. System Architecture

### 5.1 REST API Endpoints

List each planned endpoint using the format `METHOD | URL | DESCRIPTION`.

| Method | URL              | Description                      |
| ------ | ---------------- | -------------------------------- |
| `GET`  | `/api/resources` | Fetches the resource collection. |
| `POST` | `/api/resources` | Creates a new resource.          |

### 5.2 Database Schema

[Describe or attach the database schema. Update the database technology if the project does not use MySQL.]

### 5.3 UML Diagram

[Attach or link the UML diagram here.]

## 6. User Interface

### 6.1 Wireframes and Mockups

[Attach or link wireframes and mockups here.]

## 7. Data Requirements

### 7.1 Persistent Data

[List all data that the system must store persistently.]

## 8. Traceability Matrix

| ID    | Requirement                                                   | Implementation Reference |
| ----- | ------------------------------------------------------------- | ------------------------ |
| US-01 | The system will authenticate users via username and password. | Line 152                 |
| US-02 | Allow users to store workout information.                     | Line 256                 |
| US-03 | Allow users to search their workout history.                  | Line 46                  |
| US-04 | Allow users to add new workout types.                         | Line 45                  |

> **Note:** File paths, function names, issue numbers, or commit references are generally more maintainable than line numbers because line numbers change as the code evolves.

## 9. AI Usage and Disclosure

- **Model(s) Used:** [e.g., GPT-4o, Claude 3.5]
- **Prompts Used During Coding:**
  - [Prompt 1]
  - [Prompt 2]

## 10. Appendices

[Add supporting materials here.]
