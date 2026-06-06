# SMS Sender Pulse

A modern desktop application for bulk SMS management designed for schools and educational institutions. SMS Sender Pulse enables administrators and staff to send personalized SMS campaigns, manage message templates, track delivery status, and monitor SMS credits from a simple desktop interface.

## Overview

SMS Sender Pulse is an Electron-based desktop application built for speed, reliability, and ease of use. It integrates with the Spring Edge SMS Gateway and provides a complete communication management solution for schools.

### Key Benefits

* Send SMS messages to hundreds of recipients in seconds
* Import recipient data from Excel or CSV files
* Track campaign delivery status
* Manage multiple users with role-based permissions
* Store campaign history locally using SQLite
* Monitor SMS credits in real time
* Secure authentication and user management

---

## Features

### Bulk SMS Campaigns

Send personalized SMS messages to large recipient lists using Excel or CSV uploads.

### SMS Templates

Create and reuse predefined templates for common school communications such as:

* Fee reminders
* Examination notifications
* Event announcements
* Result declarations
* Parent communications

### Message History

Maintain a complete audit trail of all SMS campaigns, including:

* Delivery status
* Timestamps
* Failed messages
* Campaign statistics

### Multi-User Access

Role-based access control with:

* **ADMIN** – Full access to users, settings, campaigns, and reports
* **USER** – Access to SMS sending and campaign history

### Offline-First Architecture

All application data is stored locally using SQLite, ensuring:

* Fast performance
* Offline access to history and reports
* Reliable data storage

### Dashboard & Reports

View real-time analytics including:

* SMS credits balance
* Campaign statistics
* Daily SMS volume
* Interactive charts and reports

### Secure Authentication

Security features include:

* Password hashing
* Login protection
* Session management
* Mandatory password change on first login

### Application Configuration

Administrators can configure:

* Spring Edge API credentials
* Sender ID
* SMS gateway settings

No code changes are required.

---

## Technology Stack

| Technology      | Purpose                            |
| --------------- | ---------------------------------- |
| Electron        | Cross-platform desktop application |
| React 19        | User interface development         |
| TypeScript      | Type-safe JavaScript               |
| Tailwind CSS v4 | Styling framework                  |
| Ant Design v6   | UI component library               |
| Vite 8          | Build and development tooling      |
| better-sqlite3  | Embedded local database            |
| Spring Edge API | SMS gateway integration            |
| ApexCharts      | Data visualization                 |
| Axios           | HTTP client                        |
| xlsx            | Excel file processing              |
| React Router v7 | Routing and navigation             |

---

## Installation

### Prerequisites

* Windows or Linux operating system
* Active Spring Edge SMS account
* Valid API key and Sender ID

### Setup

1. Install the application.
2. Launch SMS Sender Pulse.
3. Log in using your assigned credentials.
4. Change your password on first login.
5. Navigate to **App Settings**.
6. Enter your Spring Edge API Key and Sender ID.
7. Save configuration.

The application is now ready to send SMS campaigns.

---

## Usage Guide

### Step 1: Login

Sign in using your username and password.

### Step 2: Configure SMS Gateway

Administrator users should:

1. Open **App Settings**
2. Enter Spring Edge API credentials
3. Configure Sender ID
4. Save settings

### Step 3: Prepare Recipient List

Create an Excel file with a column for the phone number and an optional `Name` column.

The phone number column can be named **`Mobile`**, **`Phone`**, or **`Contact`** (case-insensitive).

The column should contain valid 10-digit Indian mobile numbers.

Example:

| Mobile     | Name    |
| ---------- | ------- |
| 9876543210 | Rahul   |
| 9123456789 | Priya   |
| 9988776655 | Anjali  |

### Step 4: Send SMS Campaign

1. Open **Send SMS**
2. Select a template or compose a custom message
3. Upload the Excel file
4. Preview recipients
5. Send campaign

### Step 5: Track Delivery

Navigate to **Message History** to view:

* Campaign results
* Delivery reports
* Failed messages
* Message logs

### Step 6: Monitor Credits

View remaining SMS credits directly from the Dashboard.

---

## Application Information

| Property         | Value                     |
| ---------------- | ------------------------- |
| Application Name | SMS Sender Pulse          |
| Version          | 1.0.0                     |
| App ID           | com.smssenderpro.app      |
| Platform         | Windows / Linux           |
| SMS Provider     | Spring Edge API           |
| Database         | SQLite (better-sqlite3)   |
| Build Tool       | Vite 8 + electron-builder |
| License          | Private / Proprietary     |

---

## Developer

**Suryansh Sharma**
Full-Stack Developer

Organization: Self Developer

---

## License

Private and Proprietary Software.

All rights reserved.

© 2026 SMS Sender Pulse
