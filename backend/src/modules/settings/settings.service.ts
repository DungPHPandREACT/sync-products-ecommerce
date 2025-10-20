import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppSetting } from './app-setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(AppSetting)
    private settingsRepo: Repository<AppSetting>,
  ) {}

  private async getOrInit(): Promise<AppSetting> {
    let s = await this.settingsRepo.findOne({ where: {} });
    if (!s) {
      s = this.settingsRepo.create({});
      s = await this.settingsRepo.save(s);
    }
    return s;
  }

  async get(): Promise<AppSetting> {
    return this.getOrInit();
  }

  async update(payload: Partial<AppSetting>): Promise<AppSetting> {
    const s = await this.getOrInit();
    Object.assign(s, payload);
    return this.settingsRepo.save(s);
  }
}


