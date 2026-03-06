from passlib.context import CryptContext

# bcrypt hashing configuration
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)
# used during signup
def hash_password(password: str):
    return pwd_context.hash(password)

# used during login
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)