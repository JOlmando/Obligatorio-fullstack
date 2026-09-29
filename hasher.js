import bcrypt from 'bcrypt';

const password = "Admin123.";
const hashedPassword = bcrypt.hashSync(password, 12);
console.log(password);
console.log(hashedPassword);