from app.utils.security import hash_password, verify_password

hashed = hash_password("123456")

print(hashed)

verify_password("123456", hashed)