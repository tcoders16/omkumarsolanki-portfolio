"""External service clients (Resend email, Google Calendar).

Every client here is defensive: if its credentials or optional libraries are
missing it returns a typed "not configured" result instead of raising, so the
agent graph keeps working (draft-only email, booking-link fallback) before the
keys are wired up in production.
"""
