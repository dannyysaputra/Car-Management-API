import jwt from 'jsonwebtoken';
import { checkPassword, createToken, encryptPassword } from '../app/utils/encrypt';

describe('Encrypt', () => {
    let pass: string;

    // 1. should return string
    it('encryptPassword should return string', async () => {
        pass = await encryptPassword('12345');
        expect(pass).toEqual(expect.stringMatching(/\$2a\$10\$.+/))
    })

    // 2. check password return false
    it('checkPassword should return false', async () => {
        const check = await checkPassword(pass, '1234');
        expect(check).toBe(false);
    })

    // 3. check password return true
    it('checkPassword should return true', async () => {
        const check = await checkPassword(pass, '12345');
        expect(check).toBe(true);
    })
})

describe('JWT', () => {
    const userObject = {
        name: 'User',
        email: 'user@email.com'
    }

    // 1. create token
    it('create token should return jwt token', async () => {
        const token = await createToken(userObject);
        const verify = jwt.verify(token, 'rahasia');
        expect(verify).toEqual(
            expect.objectContaining({
                name: 'User',
                email: 'user@email.com',
                iat: expect.any(Number),
                exp: expect.any(Number)
            })
        )
    })
})