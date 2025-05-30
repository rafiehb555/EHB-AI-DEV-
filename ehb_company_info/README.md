# EHB Test Service

This is a sample service module for testing the EHB Agent Installer.

## Overview

The Test Service demonstrates how modules are installed and registered with the Developer Portal.

## Features

- Simple web interface
- Basic API endpoints for status and info
- Integrates with the Developer Portal

## Installation

This service is automatically installed by the EHB Agent Installer when uploaded as a ZIP file.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/status` | GET | Check service status |
| `/api/info` | GET | Get service information |

## Usage

Access the service at: `http://localhost:5003`