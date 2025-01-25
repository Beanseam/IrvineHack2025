from fastapi import FastAPI
from dotenv import dotenv_values
from pymongo import MongoClient
from routes import router as property_router

config = dotenv_values(".env")

app = FastAPI()

@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient(config["ATLAS_URI"])
    app.database = app.mongodb_client[config["DB_NAME"]]
    print("Connected to the MongoDB database!")

@app.get("/hello")
async def root():
    return {"message": "Hello World"}

@app.get("/test")
async def root():
    return {"message": "test"}


app.include_router(property_router, tags=["properties"], prefix="/property")