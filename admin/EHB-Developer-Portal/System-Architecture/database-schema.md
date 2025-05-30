# EHB System Database Schema

This document provides information about the database schema used in the EHB system.

## Tables


### users

Store user information

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PRIMARY KEY |\n| email | string | UNIQUE |\n| name | string |  |\n| role | string |  |\n| created_at | timestamp |  |
\n
### departments

Store department information

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PRIMARY KEY |\n| name | string |  |\n| code | string | UNIQUE |\n| manager_id | uuid | REFERENCES users.id |\n| created_at | timestamp |  |
\n
### modules

Store module information

| Column | Type | Constraints |
|--------|------|-------------|
| id | string | PRIMARY KEY |\n| name | string |  |\n| api_endpoint | string |  |\n| version | string |  |\n| status | string |  |\n| registered_at | timestamp |  |\n| updated_at | timestamp |  |
\n
### notifications

Store notification information

| Column | Type | Constraints |
|--------|------|-------------|
| id | string | PRIMARY KEY |\n| user_id | uuid | REFERENCES users.id |\n| title | string |  |\n| message | string |  |\n| type | string |  |\n| read | boolean |  |\n| created_at | timestamp |  |
\n
### ai_feedback

Store AI feedback information

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PRIMARY KEY |\n| user_id | uuid | REFERENCES users.id |\n| prompt | string |  |\n| response | string |  |\n| rating | integer |  |\n| feedback | string |  |\n| created_at | timestamp |  |


## Relationships

- Users can belong to multiple departments
- Departments have one manager (a user)
- Notifications belong to a user
- AI feedback is provided by users

## Indexes

- users(email) - For quick user lookup by email
- departments(code) - For quick department lookup by code
- notifications(user_id) - For quick retrieval of a user's notifications
- ai_feedback(user_id) - For quick retrieval of a user's AI feedback
