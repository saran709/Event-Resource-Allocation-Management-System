# 🛡️ APEX RBAC Security & 4-Level Permission System Walkthrough

This walkthrough outlines the complete, verified 4-tier Role-Based Access Control (RBAC) implementation for the **Event Resource Allocation Management System (APEX)**. Every permission and limitation is enforced across the **Frontend, Backend, REST API, and Data Layers**.

---

## 1. Role Hierarchy

```
👑 SUPER ADMIN (Level 4)
  │
  ├── 👔 EVENT ADMIN (Level 3)
  │     │
  │     ├── 📋 ORGANIZER (Level 2)
  │     │     │
  │     │     └── 👷 STAFF (Level 1)
  │     │
  │     └── 📋 ORGANIZER (Level 2)
  │           │
  │           └── 👷 STAFF (Level 1)
  │
  └── 👔 EVENT ADMIN (Level 3)
        │
        └── 📋 ORGANIZER (Level 2)
              │
              └── 👷 STAFF (Level 1)
```

---

## 2. Permission Matrix

| Functionality / Operation | Super Admin (L4) | Event Admin (L3) | Organizer (L2) | Staff (L1) |
| :--- | :---: | :---: | :---: | :---: |
| **Manage Event Admins** | ✅ YES | ❌ NO | ❌ NO | ❌ NO |
| **Create Event** | ✅ YES | ✅ YES (In Scope) | ❌ NO | ❌ NO |
| **Manage All Events** | ✅ YES | ❌ NO | ❌ NO | ❌ NO |
| **Manage Assigned Events** | ✅ YES | ✅ YES | 🔒 LIMITED (Ops) | 👁️ VIEW ONLY |
| **Assign Organizer** | ✅ YES | ✅ YES (In Scope) | ❌ NO | ❌ NO |
| **Manage Organizers** | ✅ YES | 🔒 LIMITED | ❌ NO | ❌ NO |
| **Assign Staff** | ✅ YES | ✅ YES | ✅ YES (To Assigned Event) | ❌ NO |
| **Manage Equipment** | ✅ YES | 🔒 LIMITED | 🔒 LIMITED | ❌ NO |
| **Manage Venues** | ✅ YES | 🔒 LIMITED | 👁️ VIEW ONLY | 👁️ VIEW ONLY |
| **Manage Vendors** | ✅ YES | 🔒 LIMITED | 🔒 LIMITED | ❌ NO |
| **Manage Budget & POs** | ✅ YES | ✅ YES (In Scope) | 🔒 LIMITED | ❌ NO |
| **Create Tasks** | ✅ YES | ✅ YES | ✅ YES | ❌ NO |
| **Update Own Tasks** | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| **Update Other Staff Tasks** | ✅ YES | ✅ YES | ✅ YES | ❌ NO (403 Blocked) |
| **System Settings & AWS IaC** | ✅ YES | ❌ NO (403 Blocked) | ❌ NO (403 Blocked) | ❌ NO (403 Blocked) |
| **Audit Logs** | ✅ YES (Global) | 🔒 LIMITED (Scoped) | ❌ NO (403 Blocked) | ❌ NO (403 Blocked) |
| **System Executive Reports** | ✅ YES (Global) | 🔒 LIMITED (Scoped) | ❌ NO (403 Blocked) | ❌ NO (403 Blocked) |

---

## 3. Data Isolation & Ownership Chain

Every entity is linked through an explicit ownership chain enforced server-side:

```
Event (eventAdminId)
  └── Organizer (eventId, organizerId)
        └── Task & Staff (assignedEventId, assignedStaffIds, staffId)
```

### Server-Side Data Isolation Rules:
1. **Super Admin**: Reads and mutates all system records.
2. **Event Admin**: Filtered strictly to `managedEventIds` (`ev1`, `ev2`, `ev5`). Cannot read or mutate unassigned events (e.g. `ev3` / `ev4`).
3. **Organizer**: Filtered strictly to assigned `eventId` (`ev1`). Cannot view or mutate other organizers' events or global user pools.
4. **Staff**: Filtered strictly to assigned event and personal tasks (`tk2` for Bob Miller). Blocked from editing other staff tasks, assigning staff, or booking equipment.

---

## 4. Frontend & Backend Protection

- **Backend / API Security**: Every endpoint validates authentication (`req.user`), hierarchical role authority (`requireRole`), and resource ownership (`requireEventScope`). Tampering with URL parameters or payload IDs immediately returns `403 Forbidden`.
- **Audit Logging**: Sensitive actions (`User Created`, `Task Created`, `Event Deleted`, `Conflict Overridden`) are recorded in `data/audit.json` with actor, role, timestamp, IP, and details.
- **Frontend Protection & 403 Page**: An interactive `<AccessRestricted />` component renders if an unauthorized route/tab is opened, providing clear diagnostic feedback and a "Return to Authorized Dashboard" button.

---

## 5. Automated Verification Results

### Test Suite Execution
- **`node test_rbac.js`**: **24 / 24 PASSED (100%)**
  - Super Admin full control & Event Admin creation: ✅ PASSED
  - Event Admin scope isolation & Super Admin creation block: ✅ PASSED
  - Organizer assigned event scope & event creation block: ✅ PASSED
  - Staff task update allowed & staff assignment / event deletion block: ✅ PASSED
  - Cross-staff task modification block (403): ✅ PASSED
  - Audit trail generation & verification: ✅ PASSED
- **`node test_api.js`**: **43 / 43 PASSED (100%)**
  - All core services, budget analytics, conflict engine, AWS IaC, export engine, and reports passed cleanly.

**Final Security Status**: `SECURE`
