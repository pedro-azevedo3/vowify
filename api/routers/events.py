from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException, status, Request
from schemas.event import EventCreate, EventUpdate, EventOut, EventPublic
from auth import get_current_user
from database import get_client

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[EventOut])
def list_events(user_id: str = Depends(get_current_user), request: Request = None):
    token = request.headers.get("authorization", "").removeprefix("Bearer ")
    db = get_client(token)
    res = db.table("events").select("*").eq("user_id", user_id).order("created_at").execute()
    return res.data


@router.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(
    body: EventCreate,
    user_id: str = Depends(get_current_user),
    request: Request = None,
):
    token = request.headers.get("authorization", "").removeprefix("Bearer ")
    db = get_client(token)
    payload = {**body.model_dump(), "user_id": user_id}
    res = db.table("events").insert(payload).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Erro ao criar evento")
    return res.data[0]


@router.get("/{event_id}", response_model=EventOut)
def get_event(
    event_id: str,
    user_id: str = Depends(get_current_user),
    request: Request = None,
):
    token = request.headers.get("authorization", "").removeprefix("Bearer ")
    db = get_client(token)
    res = db.table("events").select("*").eq("id", event_id).eq("user_id", user_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    return res.data


@router.put("/{event_id}", response_model=EventOut)
def update_event(
    event_id: str,
    body: EventUpdate,
    user_id: str = Depends(get_current_user),
    request: Request = None,
):
    token = request.headers.get("authorization", "").removeprefix("Bearer ")
    db = get_client(token)
    payload = {k: v for k, v in body.model_dump().items() if v is not None}
    payload["updated_at"] = "now()"
    res = (
        db.table("events")
        .update(payload)
        .eq("id", event_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    return res.data[0]


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: str,
    user_id: str = Depends(get_current_user),
    request: Request = None,
):
    token = request.headers.get("authorization", "").removeprefix("Bearer ")
    db = get_client(token)
    db.table("events").delete().eq("id", event_id).eq("user_id", user_id).execute()


# ── Public endpoint for invite page ──────────────────────────────────────────
@router.get("/public/{event_id}", response_model=EventPublic, tags=["invite"])
def get_event_public(event_id: str):
    db = get_client()
    res = db.table("events").select(
        "id,name,date,time,location,address,traje_on,traje_text,acomp_on,msg_on,msg_text,color_id,font_id"
    ).eq("id", event_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Convite não encontrado")
    return res.data
