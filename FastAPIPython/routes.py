from fastapi import APIRouter, Body, Request, Response, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List

from models import Property

router = APIRouter()


@router.get("/{MAK}", response_description="Get a single property by id", response_model=Property)
def find_property(MAK: int, request: Request):
    ## ISSUE RIGHT HERE
    if (property := request.app.database["PropertyAssessmentData"].find_one({"MAK": MAK})) is not None:
        return property
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Property with MAK {MAK} not found")