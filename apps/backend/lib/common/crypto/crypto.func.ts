import { promises as fsPromises, createReadStream, createWriteStream } from 'fs';
import * as crypto from 'crypto';
import { pipeline } from 'stream/promises';

export class CryptoUtil {
    private static readonly ivLength = 16;

    private static generateKey(secret: string): Buffer {
        return crypto.createHash('sha256').update(secret).digest(); // 32-byte AES key
    }

    private static generateCipher(secret: string, iv: Buffer): crypto.Cipheriv {
        const key = this.generateKey(secret);
        return crypto.createCipheriv('aes-256-cbc', key, iv);
    }

    private static generateDecipher(secret: string, iv: Buffer): crypto.Decipheriv {
        const key = this.generateKey(secret);
        return crypto.createDecipheriv('aes-256-cbc', key, iv);
    }

    /** 문자열 암호화 → base64(IV + 암호문) **/
    static encryptString(plainText: string, secret: string): string {
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = this.generateCipher(secret, iv);

        const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
        const result = Buffer.concat([iv, encrypted]);
        return result.toString('base64');
    }

    /** base64(IV + 암호문) → 문자열 복호화 **/
    static decryptString(encryptedBase64: string, secret: string): string {
        const data = Buffer.from(encryptedBase64, 'base64');
        const iv = data.subarray(0, this.ivLength);
        const encrypted = data.subarray(this.ivLength);

        const decipher = this.generateDecipher(secret, iv);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    }

    /** 파일 암호화: IV를 먼저 파일에 쓰고 암호문 스트림으로 append **/
    static async encryptFile(inputPath: string, outputPath: string, secret: string): Promise<void> {
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = this.generateCipher(secret, iv);

        await fsPromises.writeFile(outputPath, iv); // IV 먼저 저장
        const input = createReadStream(inputPath);
        const output = createWriteStream(outputPath, { flags: 'a' }); // append 모드

        await pipeline(input, cipher, output);
    }

    /** 파일 복호화: 앞 16바이트에서 IV 읽고 나머지를 복호화 **/
    static async decryptFile(inputPath: string, outputPath: string, secret: string): Promise<void> {
        const fd = await fsPromises.open(inputPath, 'r');
        const ivBuffer = Buffer.alloc(this.ivLength);
        await fd.read(ivBuffer, 0, this.ivLength, 0);
        await fd.close();

        const decipher = this.generateDecipher(secret, ivBuffer);
        const input = createReadStream(inputPath, { start: this.ivLength });
        const output = createWriteStream(outputPath);

        await pipeline(input, decipher, output);
    }

    /** 파일 복호화하여 문자열 Read **/
    static async getFileContentWithDecrypt(inputPath: string, secret: string): Promise<string> {
        const fd = await fsPromises.open(inputPath, 'r');
        const ivBuffer = Buffer.alloc(this.ivLength);
        await fd.read(ivBuffer, 0, this.ivLength, 0);
        await fd.close();

        const decipher = this.generateDecipher(secret, ivBuffer);
        const input = createReadStream(inputPath, { start: this.ivLength });

        let decryptedData = '';
        for await (const chunk of input.pipe(decipher)) {
            decryptedData += chunk.toString('utf8');
        }

        return decryptedData;
    }

    /** 문자열을 암호화하여 파일로 저장 **/
    static async encryptStringToFile(plainText: string, outputPath: string, secret: string): Promise<void> {
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = this.generateCipher(secret, iv);

        const encrypted = Buffer.concat([
            cipher.update(plainText, 'utf8'),
            cipher.final()
        ]);

        const result = Buffer.concat([iv, encrypted]); // IV + 암호문

        await fsPromises.writeFile(outputPath, result);
    }

    /** 랜덤 UUID 생성 **/
    static async getRandomUUID(): Promise<string> {
        return crypto.randomUUID();
    }
}
