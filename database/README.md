# Database Setup (SQLite)

This project includes a complete SQLite schema and seed data:

- `database/schema.sql`
- `database/seed.sql`

## 1) Create or reset the database

From the project root:

```powershell
Remove-Item database\marketplace.db -ErrorAction SilentlyContinue
sqlite3 database/marketplace.db ".read database/schema.sql"
```

## 2) Seed sample data

```powershell
sqlite3 database/marketplace.db ".read database/seed.sql"
```

## 3) Quick sanity checks

```powershell
sqlite3 database/marketplace.db "SELECT COUNT(*) AS users FROM users;"
sqlite3 database/marketplace.db "SELECT COUNT(*) AS listings FROM listings;"
sqlite3 database/marketplace.db "SELECT COUNT(*) AS categories FROM categories;"
sqlite3 database/marketplace.db "SELECT COUNT(*) AS notifications FROM notifications;"
sqlite3 database/marketplace.db "SELECT COUNT(*) AS verification_requests FROM verification_requests;"
```

## Tables covered

- Core marketplace: `users`, `categories`, `listings`, `listing_images`, `listing_attributes`
- User activity: `favorites`, `carts`, `cart_items`, `listing_reports`
- Communication: `chats`, `chat_participants`, `messages`
- Trust and feedback: `reviews`, `verification_requests`
- App support data: `notifications`, `user_settings`, `location_permissions`

## Notes

- Dates are stored as ISO text for SQLite compatibility.
- Boolean fields are stored as `INTEGER` with `0` or `1`.
- Foreign keys are enabled with `PRAGMA foreign_keys = ON;`.
