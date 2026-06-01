from werkzeug.security import generate_password_hash, check_password_hash

pw = "testpassword123"
h = generate_password_hash(pw)
print("Generated hash:", h)

match = check_password_hash(h, pw)
print("Match:", match)
