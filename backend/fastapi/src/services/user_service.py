from sqlmodel import Session, select
from src.models.models import User
from src.constants import PWD_CONTEXT


def create_db_user(user: User, session: Session) -> User:
    user.password = PWD_CONTEXT.hash(user.password)
    session.add(user)
    session.commit()
    session.refresh(user)

    return user


def read_db_user(username: str, session: Session) -> User:
    statement = select(User).where(User.username == username)
    results = session.exec(statement)
    user = results.one()

    return user


def update_db_user(user: User, updated_user: User, session: Session) -> User:
    for key, value in updated_user.model_dump(exclude_none=True).items():
        setattr(user, key, value)
    session.commit()
    session.refresh(user)

    return user


def delete_db_user(user: User, session: Session) -> User:
    session.delete(user)
    session.commit()

    return user
