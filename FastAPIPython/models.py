import uuid
from typing import Optional
from pydantic import BaseModel, Field

class Property(BaseModel):
    MAK: int = Field(...)
    PropertyAddress: str = Field(...)
    City: str = Field(...)
    State: str = Field(...)
    ZipCode: int = Field(...)
    CountyLandUseDescription: str = Field(...)
    TotalAssessedValue: int = Field(...)
    AssessmentYear: int = Field(...)
    LotSizeOrArea: int = Field(...)
    YearBuilt: int = Field(...)
    TotalNumberOfRooms: int = Field(...)
    NumberOfBedrooms: int = Field(...)
    NumberOfBaths: int = Field(...)
    NumberOfStories: int = Field(...)
    PoolArea: int = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "MAK": 4945331197,
                "PropertyAddress": "1806 W 19th St",
                "City": "Santa Ana",
                "State": "CA",
                "ZipCode": 92706,
                "CountyLandUseDescription": "SINGLE FAMILY RESIDENTIAL",
                "TotalAssessedValue": 280428,
                "AssessmentYear": 2023,
                "LotSizeOrArea": 6050,
                "YearBuilt": 1951,
                "TotalNumberOfRooms": 4,
                "NumberOfBedrooms": 2,
                "NumberOfBaths": 1,
                "NumberOfStories": 1,
                "PoolArea": 0,
            }
        }

# class BookUpdate(BaseModel):
#     title: Optional[str]
#     author: Optional[str]
#     synopsis: Optional[str]

#     class Config:
#         schema_extra = {
#             "example": {
#                 "title": "Don Quixote",
#                 "author": "Miguel de Cervantes",
#                 "synopsis": "Don Quixote is a Spanish novel by Miguel de Cervantes..."
#             }
#         }