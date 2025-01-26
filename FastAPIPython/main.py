from fastapi import FastAPI, HTTPException
from dotenv import dotenv_values
from motor.motor_asyncio import AsyncIOMotorClient
from models import Property
from fastapi.middleware.cors import CORSMiddleware

config = dotenv_values(".env")

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient(config["ATLAS_URI"])
db = client.get_database("MelissaDatasets")
propertyAssessCol = db.get_collection("PropertyAssessmentData")

@app.get(
    "/property/{MAK}",
    response_description="Get a single property",
    response_model=Property,
    response_model_by_alias=False,
)
async def findPropMAK(MAK: int):
    """
    Get the record for a specific student, looked up by `id`.
    """
    property = await propertyAssessCol.find_one({"MAK": MAK})
    if (
        property
    ) is not None:
        return property

    raise HTTPException(status_code=404, detail=f"Property {MAK} not found")

@app.get(
    "/generate",
    response_description="Get a single property randomly",
    response_model=Property,
    response_model_by_alias=False,
)
async def randProp():
    """
    Get the record for a specific student, looked up by `id`.
    """
    property = await propertyAssessCol.aggregate([{"$sample": {"size": 1}}]).next()
    if(property is not None):
        return property
    raise HTTPException(status_code=404, detail=f"Property not found")