# EHB System Database Status

## Database Overview

**Type**: Supabase PostgreSQL
**Version**: PostgreSQL 14.1
**Status**: ✅ Operational
**Last Checked**: May 9, 2025 10:30 AM UTC

## Connection Status

| Service | Status | Last Connected | Connection Pool |
|---------|--------|----------------|----------------|
| Backend Server | ✅ Connected | May 9, 2025 10:28 AM | 5/10 active |
| Integration Hub | ✅ Connected | May 9, 2025 10:25 AM | 3/10 active |
| EHB Dashboard | ✅ Connected | May 9, 2025 10:22 AM | 2/10 active |
| GoSellr | ✅ Connected | May 9, 2025 10:18 AM | 1/10 active |
| TrustyWallet | ✅ Connected | May 9, 2025 10:15 AM | 2/10 active |

## Database Schema

### Tables

| Table Name | Rows | Size | Last Updated |
|------------|------|------|-------------|
| users | 1,245 | 2.3 MB | May 9, 2025 |
| departments | 11 | 8 KB | May 8, 2025 |
| permissions | 48 | 12 KB | May 7, 2025 |
| roles | 5 | 4 KB | May 7, 2025 |
| notifications | 8,732 | 4.5 MB | May 9, 2025 |
| user_preferences | 1,102 | 0.9 MB | May 9, 2025 |
| widgets | 345 | 1.2 MB | May 9, 2025 |
| dashboard_layouts | 98 | 0.8 MB | May 9, 2025 |
| ai_feedback | 2,567 | 3.1 MB | May 9, 2025 |
| ai_suggestions | 4,123 | 5.5 MB | May 9, 2025 |
| transactions | 12,456 | 8.2 MB | May 9, 2025 |
| products | 576 | 2.8 MB | May 8, 2025 |
| orders | 2,345 | 3.5 MB | May 9, 2025 |

### Indexes

| Index Name | Table | Columns | Size |
|------------|-------|---------|------|
| users_pkey | users | id | 256 KB |
| users_email_idx | users | email | 128 KB |
| departments_code_idx | departments | code | 4 KB |
| notifications_user_id_idx | notifications | user_id | 512 KB |
| transactions_wallet_id_idx | transactions | wallet_id | 768 KB |
| orders_user_id_idx | orders | user_id | 256 KB |
| products_category_idx | products | category | 64 KB |

## Database Performance

### Query Performance (Last 24 hours)

| Metric | Value |
|--------|-------|
| Average Query Time | 45ms |
| 95th Percentile Query Time | 120ms |
| Slow Queries (>500ms) | 12 |
| Total Queries | 128,456 |
| Reads/Writes Ratio | 78%/22% |

### Top 5 Slowest Queries

1. **Query**: User transaction history with joined wallet data
   - **Avg Time**: 380ms
   - **Count**: 432
   - **Optimization**: Added index on transactions.created_at

2. **Query**: Department dashboard with widget data
   - **Avg Time**: 320ms
   - **Count**: 256
   - **Optimization**: Cached dashboard layouts

3. **Query**: Product search with filters
   - **Avg Time**: 290ms
   - **Count**: 1,245
   - **Optimization**: Improved search index

4. **Query**: AI suggestion history lookup
   - **Avg Time**: 270ms
   - **Count**: 3,456
   - **Optimization**: Scheduled

5. **Query**: User notification aggregation
   - **Avg Time**: 210ms
   - **Count**: 5,678
   - **Optimization**: In progress

## Recent Migrations

| Migration ID | Description | Applied On | Status |
|--------------|-------------|------------|--------|
| 20250509-01 | Add dashboard templates table | May 9, 2025 | ✅ Success |
| 20250507-03 | Add widget settings column | May 7, 2025 | ✅ Success |
| 20250507-02 | Optimize notification indices | May 7, 2025 | ✅ Success |
| 20250507-01 | Add AI feedback categories | May 7, 2025 | ✅ Success |
| 20250505-01 | Add transaction metadata | May 5, 2025 | ✅ Success |

## Scheduled Maintenance

| Date | Time | Duration | Description |
|------|------|----------|-------------|
| May 15, 2025 | 02:00 UTC | 30 min | Database optimization |
| May 22, 2025 | 02:00 UTC | 1 hour | Version upgrade to PostgreSQL 14.3 |

## Backup Status

| Backup Type | Last Backup | Size | Status |
|-------------|-------------|------|--------|
| Full | May 9, 2025 01:00 UTC | 28.5 GB | ✅ Success |
| Incremental | May 9, 2025 07:00 UTC | 1.2 GB | ✅ Success |
| Transaction Logs | Continuous | 4.5 GB/day | ✅ Active |

## Monitoring Alerts

| Date | Type | Description | Resolution |
|------|------|-------------|------------|
| May 8, 2025 | ⚠️ Warning | Connection pool near limit | Auto-scaled |
| May 7, 2025 | ⚠️ Warning | Slow query threshold exceeded | Optimized indices |
| May 5, 2025 | 🔴 Critical | Database connectivity lost | Failover activated |
| May 5, 2025 | ✅ Resolved | Database connectivity restored | Primary node restarted |