from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException, status, Request
from schemas.guest import GuestRSVP, GuestOut
from auth import get_current_user
from database import get_client

router = APIRouter(tags=["guests"])


# ── Authenticated: event owner manages guests ─────────────────────────────
@router.get("/events/{event_id}/guests", response_model=list[GuestOut])
def list_guests(
    event_id: str,
    user_id: str = Depends(get_current_user),
    request: Request = None,
):
    token = request.headers.get("authorization", "").removeprefix("Bearer ")
    db = get_client(token)
    # Confirms the event belongs to the user before returning guests
    ev = db.table("events").select("id").eq("id", event_id).eq("user_id", user_id).single().execute()
    if not ev.data:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    res = db.table("guests").select("*").eq("event_id", event_id).order("responded_at").execute()
    return res.data


@router.delete(
    "/events/{event_id}/guests/{guest_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_guest(
    event_id: str,
    guest_id: str,
    user_id: str = Depends(get_current_user),
    request: Request = None,
):
    token = request.headers.get("authorization", "").removeprefix("Bearer ")
    db = get_client(token)
    ev = db.table("events").select("id").eq("id", event_id).eq("user_id", user_id).single().execute()
    if not ev.data:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    db.table("guests").delete().eq("id", guest_id).eq("event_id", event_id).execute()


# ── Public: guest submits RSVP ────────────────────────────────────────────
@router.post(
    "/invite/{event_id}/rsvp",
    response_model=GuestOut,
    status_code=status.HTTP_201_CREATED,
    tags=["invite"],
)
def submit_rsvp(event_id: str, body: GuestRSVP):
    db = get_client()  # service role — sem JWT
    ev = db.table("events").select("id,acomp_on").eq("id", event_id).single().execute()
    if not ev.data:
        raise HTTPException(status_code=404, detail="Convite não encontrado")

    # Se acompanhante estiver desativado, força plus=0
    plus = body.plus if ev.data["acomp_on"] else 0

    # Verifica se o convidado já respondeu (pelo telefone)
    existing = (
        db.table("guests")
        .select("id")
        .eq("event_id", event_id)
        .eq("phone", body.phone)
        .execute()
    )
    if existing.data:
        # Atualiza resposta existente
        res = (
            db.table("guests")
            .update({"status": body.status, "plus": plus, "restriction": body.restriction})
            .eq("event_id", event_id)
            .eq("phone", body.phone)
            .execute()
        )
        return res.data[0]

    payload = {
        "event_id": event_id,
        "name": body.name,
        "phone": body.phone,
        "status": body.status,
        "plus": plus,
        "restriction": body.restriction,
    }
    res = db.table("guests").insert(payload).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Erro ao registrar resposta")
    return res.data[0]
