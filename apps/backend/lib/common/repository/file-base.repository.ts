import { promises as fs } from 'fs';
import * as path from 'path';
import { app } from 'electron'

// Windows(Linux) 로컬에서 Electron APP 으로 사용하기 떄문에 DB 사용하지 않음. 파일 Repository 생성해서 처리
export abstract class FileBaseRepository<T extends { [key: string]: any }> {
  protected abstract getFileName(): string;
  protected abstract getId(item: T): string;

  private getFilePath(): string {
    // Electron APP 경로에 파일 저장
    // const filePath = app.getPath('userData')      // Electron App 경로(Windows : C:\Users\{USER}\AppData\Roaming\prg-electron)
    const filePath = path.join(process.cwd())  // 프로젝트 경로(테스트용)
    return path.join(filePath, this.getFileName());
  }

  protected async read(): Promise<T[]> {
    try {
      const data = await fs.readFile(this.getFilePath(), 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  protected async write(data: T[]): Promise<void> {
    await fs.writeFile(this.getFilePath(), JSON.stringify(data, null, 2), 'utf-8');
  }

  async findAll(): Promise<T[]> {
    return this.read();
  }

  async findById(id: string): Promise<T | undefined> {
    const items = await this.read();
    return items.find(item => this.getId(item) === id);
  }

  async save(item: T): Promise<T> {
    // save 함수는 UPSERT 로 구현
    const items = await this.read();
    const id = this.getId(item);
    const index = items.findIndex(i => this.getId(i) === id);

    if (index !== -1) {
      // 기존 항목 덮어쓰기
      items[index] = item;
    } else {
      // 새 항목 추가
      items.push(item);
    }

    await this.write(items);
    return item;
  }

  async saveAll(newItems: T[]): Promise<T[]> {
    // saveAll 함수는 UPSERT 로 구현
    const items = await this.read();

    // 기존 데이터를 Map에 저장 (key: id)
    const map = new Map(items.map(item => [this.getId(item), item]));

    // 새 항목 추가 또는 덮어쓰기
    for (const newItem of newItems) {
      map.set(this.getId(newItem), newItem);
    }

    // 병합된 결과로 저장
    const merged = Array.from(map.values());
    await this.write(merged);
    return newItems;
  }


  async update(id: string, partial: Partial<T>): Promise<T | null> {
    const items = await this.read();
    const index = items.findIndex(i => this.getId(i) === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...partial };
    await this.write(items);
    return items[index];
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.read();
    const filtered = items.filter(i => this.getId(i) !== id);
    const changed = filtered.length !== items.length;

    if (changed) await this.write(filtered);
    return changed;
  }
}