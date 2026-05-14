from __future__ import annotations
from supabase import create_client, Client
from typing import Optional
from config import settings


def get_client(user_jwt: Optional[str] = None) -> Client:
    """
    Returns a Supabase client.
    - With user_jwt: uses the user's token so Row Level Security applies.
    - Without: uses the service role key (admin operations only).
    """
    if user_jwt:
        client = create_client(settings.supabase_url, settings.supabase_anon_key)
        client.auth.set_session(user_jwt, "")
        return client
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
