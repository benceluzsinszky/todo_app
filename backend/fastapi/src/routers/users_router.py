from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from src.auth.auth import get_current_user
from sqlmodel import Session
from sqlalchemy.exc import NoResultFound, IntegrityError


from src.services.user_service import (
    User,
    create_db_user,
    update_db_user,
    delete_db_user,
)

from src.db.core import get_db

router = APIRouter(
    prefix="/users",
)


@router.get("/me")
async def read_current_user(token: Annotated[str, Depends(get_current_user)]) -> User:
    return {"token": token}


@router.post("/")
async def create_user(user: User, db: Session = Depends(get_db)) -> User:
    try:
        user = create_db_user(user, db)
    except IntegrityError:
        raise HTTPException(status_code=409, detail="User already exists")

    return user


@router.put("/{id}")
async def update_User(
    id: int, updated_user: User, db: Session = Depends(get_db)
) -> User:
    try:
        user = update_db_user(id, updated_user, db)
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"User with id {id} not found")

    return user


@router.delete("/{id}")
async def delete_user(id: int, db: Session = Depends(get_db)) -> User:
    try:
        user = delete_db_user(id, db)
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"User with id {id} not found")

    return user
