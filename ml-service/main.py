from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.predict import router as predict_router

app = FastAPI(
    title="CloudGuard ML Service",
    description="AI-powered risk scoring for cloud misconfigurations",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/ml", tags=["ML"])

@app.get("/")
async def root():
    return {"service": "CloudGuard ML Engine", "version": "2.0.0"}