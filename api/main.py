from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import events, guests

app = FastAPI(title="Vowify API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # adicione o domínio de produção aqui
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router)
app.include_router(guests.router)


@app.get("/health")
def health():
    return {"status": "ok"}
