from __future__ import annotations
from pydantic import BaseModel
from typing import Literal
from datetime import datetime


class GuestRSVP(BaseModel):
    """Payload enviado pelo convidado ao confirmar/recusar presença."""
    name: str
    phone: str
    status: Literal["confirmed", "declined"]
    plus: int = 0
    restriction: str = ""


class GuestOut(BaseModel):
    id: str
    event_id: str
    name: str
    phone: str
    status: Literal["confirmed", "declined"]
    plus: int
    restriction: str
    responded_at: datetime
