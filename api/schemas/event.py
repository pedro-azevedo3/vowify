from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class EventCreate(BaseModel):
    name: str
    date: str = ""
    time: str = ""
    location: str = ""
    address: str = ""
    guest_limit: int = Field(default=50, ge=1)
    traje_on: bool = False
    traje_text: str = ""
    acomp_on: bool = True
    msg_on: bool = False
    msg_text: str = ""
    color_id: str = "violet"
    font_id: str = "bricolage"


class EventUpdate(BaseModel):
    name: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    guest_limit: Optional[int] = Field(default=None, ge=1)
    traje_on: Optional[bool] = None
    traje_text: Optional[str] = None
    acomp_on: Optional[bool] = None
    msg_on: Optional[bool] = None
    msg_text: Optional[str] = None
    color_id: Optional[str] = None
    font_id: Optional[str] = None


class EventOut(BaseModel):
    id: str
    user_id: str
    name: str
    date: str
    time: str
    location: str
    address: str
    guest_limit: int
    traje_on: bool
    traje_text: str
    acomp_on: bool
    msg_on: bool
    msg_text: str
    color_id: str
    font_id: str
    created_at: datetime
    updated_at: datetime


class EventPublic(BaseModel):
    """Dados públicos expostos na página do convite (sem user_id)."""
    id: str
    name: str
    date: str
    time: str
    location: str
    address: str
    traje_on: bool
    traje_text: str
    acomp_on: bool
    msg_on: bool
    msg_text: str
    color_id: str
    font_id: str
