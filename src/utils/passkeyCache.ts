import type { DomainID } from '@/types';

/**
 * Passkey 用户缓存管理
 *
 * 用于 Welcome Back 遮盖层的本地缓存。
 * 缓存最近一次注册 Passkey 的用户信息，以实现快速回访登录体验。
 *
 * 缓存策略：每个业务域仅缓存最近一次设置 Passkey 的用户提示信息。
 * 缓存仅用于 UI 提示，不作为认证依据。
 */

const CACHE_KEY_PREFIX = 'aegis:passkey:';

function cacheKey(domainId: DomainID): string {
  return `${CACHE_KEY_PREFIX}${domainId}`;
}

/**
 * 缓存的用户信息
 */
export interface PasskeyUserHint {
  /** 用户稳定标识 */
  uid: string;
  /** 遮盖层展示名称 */
  nickname: string;
  /** 头像 URL（可空） */
  picture?: string;
  /** 最后更新时间戳 */
  updated_at: number;
}

/**
 * 暂存的用户信息（用于注册 Passkey 后写入缓存）
 * 在个人信息页设置，注册成功后使用
 */
const pendingUserInfo = new Map<
  DomainID,
  {
    uid: string;
    nickname: string;
    picture?: string;
  }
>();

function isPasskeyUserHint(value: unknown): value is PasskeyUserHint {
  if (!value || typeof value !== 'object') return false;
  const hint = value as Partial<PasskeyUserHint>;
  return (
    typeof hint.uid === 'string' &&
    typeof hint.nickname === 'string' &&
    typeof hint.updated_at === 'number' &&
    (hint.picture === undefined || typeof hint.picture === 'string')
  );
}

export const passkeyUserCache = {
  /**
   * 读取缓存的用户信息
   */
  get(domainId: DomainID): PasskeyUserHint | null {
    const key = cacheKey(domainId);
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;

      const value: unknown = JSON.parse(raw);
      if (isPasskeyUserHint(value)) return value;

      localStorage.removeItem(key);
      return null;
    } catch {
      try {
        localStorage.removeItem(key);
      } catch {
        // localStorage 不可用时静默失败
      }
      return null;
    }
  },

  /**
   * 写入缓存
   */
  set(domainId: DomainID, info: Omit<PasskeyUserHint, 'updated_at'>): void {
    try {
      const data: PasskeyUserHint = {
        ...info,
        updated_at: Date.now(),
      };
      localStorage.setItem(cacheKey(domainId), JSON.stringify(data));
    } catch {
      // localStorage 不可用时静默失败
    }
  },

  /**
   * 清除缓存
   */
  clear(domainId: DomainID): void {
    try {
      localStorage.removeItem(cacheKey(domainId));
    } catch {
      // 静默失败
    }
  },

  /**
   * 暂存当前用户信息（个人信息页调用）
   * 在用户注册 Passkey 之前调用，注册成功后自动写入缓存
   */
  setPendingUserInfo(
    domainId: DomainID,
    info: {
      uid: string;
      nickname: string;
      picture?: string;
    }
  ): void {
    pendingUserInfo.set(domainId, info);
  },

  /**
   * 注册成功后写入缓存
   * 使用之前通过 setPendingUserInfo 暂存的用户信息
   */
  writeAfterRegistration(domainId: DomainID): void {
    const info = pendingUserInfo.get(domainId);
    if (info) {
      passkeyUserCache.set(domainId, info);
      pendingUserInfo.delete(domainId);
    }
  },
};
