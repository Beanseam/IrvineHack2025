import uuid
from typing import Optional
from pydantic import BaseModel, Field

class Property(BaseModel):
    MAK: int = Field(...)
    PropertyAddress: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "MAK": 4945331197,
                "PropertyAddress": "1806 W 19th St"
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