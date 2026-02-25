# ZendFi Admin Dashboard — API Documentation

> **Base URL:** `https://api.zendfi.io/v1`  
> **Auth:** All endpoints require `Authorization: Bearer <admin_jwt>` header.  
> **Format:** JSON request/response bodies throughout.

---

## Authentication

### `POST /auth/login`
Authenticate an admin and receive a JWT.

**Request**
```json
{ "email": "seun@zendfi.io", "password": "••••••••" }
```
**Response `200`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "expiresAt": "2026-02-23T07:00:00Z",
  "user": {
    "id": "1",
    "name": "Oluwaseun Adeyemi",
    "email": "seun@zendfi.io",
    "role": "super_admin",
    "avatar": "OA"
  }
}
```

### `POST /auth/logout`
Invalidate the current token. No body required. Returns `204 No Content`.

### `POST /auth/refresh`
Exchange a valid token for a new one before expiry. Returns same shape as `/auth/login`.

---

## Overview / Dashboard

### `GET /dashboard/summary`
Top-level KPI cards for the Overview page.

**Response `200`**
```json
{
  "totalVolume":     { "value": "₦ 1.24B", "change": "+12.5%", "up": true },
  "totalTransactions": { "value": 48291,   "change": "+8.3%",  "up": true },
  "activeMerchants": { "value": 1284,      "change": "+2.1%",  "up": true },
  "flaggedAlerts":   { "value": 12,        "change": "-3",     "up": false }
}
```

### `GET /dashboard/volume-chart`
7-day or 30-day area chart data.

**Query params**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `period` | `7d` \| `30d` \| `90d` | `7d` | Time window |

**Response `200`**
```json
{
  "data": [
    { "date": "Feb 16", "volume": 9.4, "txns": 380000 },
    { "date": "Feb 17", "volume": 11.1, "txns": 420000 }
  ]
}
```

### `GET /dashboard/transactions-by-type`
Bar chart breakdown — Onchain / Onramp / Off-ramp counts.

**Response `200`**
```json
{
  "data": [
    { "method": "Onchain",  "count": 18420 },
    { "method": "Onramp",   "count": 12840 },
    { "method": "Off-ramp", "count": 10290 }
  ]
}
```

### `GET /dashboard/recent-transactions`
Latest 6 transactions for the activity feed.

**Response `200`**
```json
{
  "data": [
    {
      "id": "TXN-9841",
      "merchant": "Shoprite Ltd",
      "amount": "₦ 145,000",
      "status": "success",
      "method": "Onchain",
      "time": "2 min ago"
    }
  ]
}
```

---

## Transactions

### `GET /transactions`
Paginated, filterable transaction list.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `page` | `int` | Page number (default `1`) |
| `limit` | `int` | Per page, max `100` (default `20`) |
| `status` | `success` \| `failed` \| `pending` \| `reversed` | Filter |
| `method` | `Onchain` \| `Onramp` \| `Off-ramp` | Filter |
| `search` | `string` | Searches `id`, `merchant`, `reference` |
| `from` | `ISO 8601` | Start date |
| `to` | `ISO 8601` | End date |

**Response `200`**
```json
{
  "total": 48291,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "id":        "TXN-9841",
      "merchant":  "Shoprite Ltd",
      "customer":  "Emeka Okonkwo",
      "amount":    145000,
      "currency":  "NGN",
      "fee":       290,
      "method":    "Onchain",
      "channel":   "Web",
      "status":    "success",
      "reference": "REF-8841ABCD",
      "timestamp": "2026-02-22T15:42:10Z"
    }
  ]
}
```

### `GET /transactions/:id`
Single transaction detail.

**Response `200`** — same shape as list item, plus:
```json
{
  "blockchainHash": "0xabc123...",
  "networkConfirmations": 12,
  "metadata": {}
}
```

### `POST /transactions/:id/reverse`
Reverse/refund a transaction. Requires `admin` role or above.

**Request**
```json
{ "reason": "Customer dispute" }
```
**Response `200`** — updated transaction object.

### `GET /transactions/export`
Triggers a CSV export. Returns a signed download URL valid for 5 minutes.
```json
{ "downloadUrl": "https://cdn.zendfi.io/exports/txns-2026-02-22.csv?token=..." }
```

---

## Payments

### `GET /payments/summary`
Payment processing stats for the Payments page top cards.

**Response `200`**
```json
{
  "processedToday": { "value": 1240000000, "currency": "NGN", "change": "+12.5%" },
  "successful":     { "count": 47523, "rate": 98.4 },
  "pending":        { "count": 156 },
  "refunded":       { "value": 4200000, "count": 89 }
}
```

### `GET /payments/volume-hourly`
Hourly volume chart for today.

**Response `200`**
```json
{
  "data": [
    { "hour": "06:00", "volumeMillions": 120 },
    { "hour": "08:00", "volumeMillions": 340 }
  ]
}
```

### `GET /payments/type-breakdown`
Volume, transaction count and success rate per payment type.

**Response `200`**
```json
{
  "data": [
    { "name": "Onchain Payments", "volume": 541000000, "txns": 18420, "successRate": 99.2 },
    { "name": "Onramp",           "volume": 374000000, "txns": 12840, "successRate": 98.7 },
    { "name": "Off-ramp",         "volume": 328000000, "txns": 10290, "successRate": 97.9 }
  ]
}
```

### `GET /settlements`
Pending and historical settlement batches.

**Query params:** `status` (`pending` \| `processing` \| `completed`), `page`, `limit`

**Response `200`**
```json
{
  "data": [
    {
      "id":        "STL-0441",
      "merchant":  "Paystack Inc.",
      "amount":    14800000,
      "currency":  "NGN",
      "txns":      2840,
      "scheduled": "2026-02-22T18:00:00Z",
      "status":    "pending"
    }
  ]
}
```

### `POST /settlements/process`
Trigger batch settlement processing. Requires `finance` role or above.

**Request**
```json
{ "batchIds": ["STL-0441", "STL-0440"] }
```
**Response `202`**
```json
{ "message": "Processing started", "jobId": "job_xyz" }
```

---

## Analytics

### `GET /analytics/monthly-volume`
Monthly transaction volume for the 6-month area chart.

**Query params:** `months` (default `6`, max `24`)

**Response `200`**
```json
{
  "data": [
    { "month": "Sep 2025", "volumeBillions": 8.2, "txns": 320000 },
    { "month": "Feb 2026", "volumeBillions": 13.9, "txns": 520000 }
  ]
}
```

### `GET /analytics/channel-breakdown`
Volume by payment channel for the bar chart.

**Response `200`**
```json
{
  "data": [
    { "channel": "Onchain",  "volumeBillions": 5.4 },
    { "channel": "Onramp",   "volumeBillions": 3.8 },
    { "channel": "Off-ramp", "volumeBillions": 3.2 }
  ]
}
```

### `GET /analytics/transaction-mix`
Transaction count percentage by type — for the donut chart.

**Response `200`**
```json
{
  "data": [
    { "name": "Onchain",  "percent": 44 },
    { "name": "Onramp",   "percent": 31 },
    { "name": "Off-ramp", "percent": 25 }
  ]
}
```

### `GET /analytics/success-rate`
Daily success rate for the last 7 days.

**Response `200`**
```json
{
  "data": [
    { "day": "Mon", "rate": 98.1 },
    { "day": "Sun", "rate": 98.4 }
  ]
}
```

### `GET /analytics/kpis`
Summary KPI cards: GMV, avg ticket, conversion rate, cross-border volume.

**Response `200`**
```json
{
  "monthlyGmv":      { "value": 13900000000, "change": "+12.5%", "up": true },
  "avgTicketSize":   { "value": 25480,        "change": "+3.1%",  "up": true },
  "conversionRate":  { "value": 94.7,         "change": "+1.2%",  "up": true },
  "crossBorderVol":  { "value": 890000000,    "change": "-2.4%",  "up": false }
}
```

---

## Compliance

### `GET /compliance/cases`
Paginated compliance case queue.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `status` | `pending` \| `under_review` \| `approved` \| `rejected` \| `escalated` | Filter |
| `riskLevel` | `high` \| `medium` \| `low` | Filter |
| `type` | `KYC Verification` \| `AML Investigation` \| `Velocity Breach` | Filter |
| `search` | `string` | Searches `id`, `merchant`, `customer` |
| `page`, `limit` | `int` | Pagination |

**Response `200`**
```json
{
  "summary": {
    "total": 47, "pending": 12, "highRisk": 8, "resolvedToday": 21
  },
  "data": [
    {
      "id":          "KYC-3841",
      "type":        "KYC Verification",
      "merchant":    "Apex Traders Ltd",
      "customer":    "Chukwuemeka Obi",
      "amount":      8400000,
      "currency":    "NGN",
      "riskLevel":   "high",
      "status":      "pending",
      "assignee":    null,
      "flag":        "PEP Match",
      "submittedAt": "2026-02-22T13:45:00Z"
    }
  ]
}
```

### `GET /compliance/cases/:id`
Single case detail, including attached documents.

**Response `200`** — same as list item, plus:
```json
{
  "documents": [
    { "name": "NIN Slip", "url": "https://...", "verified": false }
  ],
  "notes": [],
  "timeline": []
}
```

### `PATCH /compliance/cases/:id/status`
Approve, reject, or escalate a case. Requires `compliance` role or above.

**Request**
```json
{ "status": "approved", "note": "Documents verified successfully" }
```
**Response `200`** — updated case object.

### `POST /compliance/cases/:id/assign`
Assign a case to a team member.

**Request**
```json
{ "assigneeId": "2" }
```

### `GET /compliance/cases/export`
Returns a signed CSV download URL for the filtered case list.

---

## Support

### `GET /support/tickets`
Paginated support ticket list.

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `status` | `open` \| `in_progress` \| `resolved` \| `closed` | Filter |
| `priority` | `urgent` \| `high` \| `medium` \| `low` | Filter |
| `search` | `string` | Searches `id`, `subject`, `merchant` |
| `page`, `limit` | `int` | Pagination |

**Response `200`**
```json
{
  "summary": {
    "open": 3, "inProgress": 2, "resolvedToday": 18, "avgResponseHours": 1.4
  },
  "data": [
    {
      "id":        "TKT-3001",
      "subject":   "Onramp payment gateway timeout — API 504 errors",
      "merchant":  "Paystack Inc.",
      "contact":   "Adaobi Mensah",
      "email":     "adaobi@paystack.io",
      "category":  "API Issue",
      "priority":  "urgent",
      "status":    "open",
      "agent":     null,
      "messages":  3,
      "createdAt": "2026-02-22T12:30:00Z",
      "lastReply": "2026-02-22T12:35:00Z"
    }
  ]
}
```

### `GET /support/tickets/:id`
Single ticket with full message thread.

**Response `200`** — same as list item, plus:
```json
{
  "messages": [
    {
      "from":    "merchant",
      "name":    "Adaobi Mensah",
      "text":    "Hello, we are experiencing...",
      "sentAt":  "2026-02-22T12:30:00Z"
    }
  ]
}
```

### `POST /support/tickets/:id/reply`
Post a reply to a ticket.

**Request**
```json
{ "text": "We have escalated this to the API team." }
```
**Response `201`** — the new message object.

### `PATCH /support/tickets/:id/status`
Update ticket status or assign to an agent.

**Request**
```json
{ "status": "resolved", "agentId": "3" }
```

---

## Team

### `GET /team/members`
All team members with roles and permissions.

**Query params:** `search` (name or email), `status` (`active` \| `inactive` \| `pending`)

**Response `200`**
```json
{
  "data": [
    {
      "id":          "1",
      "name":        "Oluwaseun Adeyemi",
      "email":       "seun@zendfi.io",
      "role":        "super_admin",
      "status":      "active",
      "lastActive":  "2026-02-23T07:04:00Z",
      "permissions": ["all"],
      "avatar":      "OA"
    }
  ]
}
```

### `POST /team/members/invite`
Send an invitation email to a new team member.

**Request**
```json
{
  "name":  "Chioma Obi",
  "email": "chioma@company.com",
  "role":  "support"
}
```
**Response `201`**
```json
{ "message": "Invitation sent", "inviteId": "inv_abc123" }
```

### `PATCH /team/members/:id`
Update name, role, or status of a team member. Requires `admin` role.

**Request** _(all fields optional)_
```json
{ "role": "finance", "status": "inactive" }
```

### `DELETE /team/members/:id`
Remove a team member. Requires `super_admin` role.

**Response `204 No Content`**

### `GET /team/permissions`
Permission matrix — which roles can access which features.

**Response `200`**
```json
{
  "matrix": [
    {
      "feature":     "Dashboard Overview",
      "super_admin": true,
      "admin":       true,
      "compliance":  true,
      "support":     true,
      "finance":     true,
      "viewer":      true
    }
  ]
}
```

---

## Webhooks

### `GET /webhooks`
All registered webhook endpoints.

**Response `200`**
```json
{
  "data": [
    {
      "id":           "wh_1",
      "url":          "https://api.paystack.io/webhooks/zendfi",
      "description":  "Paystack payment events",
      "events":       ["payment.success", "payment.failed", "refund.created"],
      "status":       "active",
      "successRate":  99.8,
      "lastDelivery": "2026-02-23T07:02:00Z",
      "secretMasked": "sk_••••••••••••8841"
    }
  ]
}
```

### `POST /webhooks`
Register a new webhook endpoint.

**Request**
```json
{
  "url":         "https://your-server.com/webhooks",
  "description": "Production payment events",
  "events":      ["payment.success", "refund.created"]
}
```
**Response `201`**
```json
{
  "id":     "wh_5",
  "secret": "sk_live_••••••••••••newSecret"
}
```

### `PATCH /webhooks/:id`
Update URL, description, events, or status.

**Request** _(all fields optional)_
```json
{ "status": "inactive", "events": ["payment.success"] }
```

### `DELETE /webhooks/:id`
Delete a webhook endpoint. Returns `204 No Content`.

### `POST /webhooks/:id/test`
Send a test `ping` event to the endpoint and return the delivery result.

**Response `200`**
```json
{ "httpStatus": 200, "responseTime": 142, "success": true }
```

### `GET /webhooks/events`
Catalogue of all subscribable event types.

**Response `200`**
```json
{
  "events": [
    "payment.success", "payment.failed", "payment.pending",
    "refund.created", "refund.completed",
    "settlement.completed", "settlement.failed",
    "transfer.created", "transfer.failed",
    "chargeback.created", "chargeback.resolved",
    "kyc.approved", "kyc.rejected"
  ]
}
```

### `GET /webhooks/:id/deliveries`
Delivery log for a specific webhook.

**Query params:** `page`, `limit`, `status` (`success` \| `failed`)

**Response `200`**
```json
{
  "data": [
    {
      "deliveryId":   "dlv_001",
      "event":        "payment.success",
      "httpStatus":   200,
      "responseTime": 143,
      "deliveredAt":  "2026-02-23T07:02:00Z"
    }
  ]
}
```

---

## Settings

### `GET /settings/general`
Retrieve general account settings.

**Response `200`**
```json
{
  "businessName":    "ZendFi Technologies",
  "businessEmail":   "ops@zendfi.io",
  "supportEmail":    "support@zendfi.io",
  "timezone":        "Africa/Lagos",
  "currency":        "NGN",
  "webhookRetries":  3,
  "sessionTimeout":  30
}
```

### `PATCH /settings/general`
Update general settings. Requires `super_admin`.

**Request** — partial update accepted.

### `GET /settings/api-keys`
List all API keys (secrets masked).

**Response `200`**
```json
{
  "keys": [
    { "id": "pk_1", "label": "Live Public Key",  "value": "pk_live_••••8841", "env": "live",  "type": "public" },
    { "id": "sk_1", "label": "Live Secret Key",  "value": "sk_live_••••2291", "env": "live",  "type": "secret" },
    { "id": "pk_2", "label": "Test Public Key",  "value": "pk_test_••••5510", "env": "test",  "type": "public" },
    { "id": "sk_2", "label": "Test Secret Key",  "value": "sk_test_••••7734", "env": "test",  "type": "secret" }
  ]
}
```

### `POST /settings/api-keys/rotate/:id`
Rotate (regenerate) a secret key. Requires `super_admin`. Returns the **one-time-visible** new secret.

**Response `200`**
```json
{ "id": "sk_1", "newSecret": "sk_live_FULL_KEY_SHOWN_ONCE" }
```

### `GET /settings/security`
2FA status, active sessions, IP whitelist.

**Response `200`**
```json
{
  "twoFactorEnabled": true,
  "activeSessions": 2,
  "ipWhitelist": ["196.12.0.0/24"],
  "lastPasswordChange": "2026-01-15T09:00:00Z"
}
```

### `PATCH /settings/security`
Enable/disable 2FA, update IP whitelist.

### `GET /settings/notifications`
Notification preference flags.

**Response `200`**
```json
{
  "email": {
    "largeTransactions": true,
    "failedPayments": true,
    "dailyDigest": false
  },
  "slack": {
    "webhookUrl": "https://hooks.slack.com/...",
    "highRiskAlerts": true
  }
}
```

### `PATCH /settings/notifications`
Update notification preferences. Partial updates accepted.

---

## Error Responses

All errors follow a consistent envelope:

```json
{
  "error": {
    "code":    "UNAUTHORIZED",
    "message": "Token has expired or is invalid",
    "status":  401
  }
}
```

| HTTP Status | Code | Meaning |
|-------------|------|---------|
| `400` | `VALIDATION_ERROR` | Invalid request body or query params |
| `401` | `UNAUTHORIZED` | Missing or expired JWT |
| `403` | `FORBIDDEN` | Valid token but insufficient role |
| `404` | `NOT_FOUND` | Resource does not exist |
| `422` | `UNPROCESSABLE` | Business logic failure (e.g. reversing an already-reversed txn) |
| `429` | `RATE_LIMITED` | Too many requests — back off and retry |
| `500` | `INTERNAL_ERROR` | Unexpected server error |

---

## Pagination

All list endpoints return a standard pagination envelope:

```json
{
  "total":   48291,
  "page":    1,
  "limit":   20,
  "pages":   2415,
  "data":    [ ... ]
}
```

## Rate Limits

| Tier | Limit |
|------|-------|
| Read (`GET`) | 300 req / min |
| Write (`POST`, `PATCH`, `DELETE`) | 60 req / min |
| Exports | 10 req / min |

Responses include `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers.
