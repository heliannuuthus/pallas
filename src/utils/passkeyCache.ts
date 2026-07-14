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

type PasskeyUserHintInput = Omit<PasskeyUserHint, 'updated_at'>;

/**
 * 按业务域暂存的 Passkey 用户提示，注册成功后提交到 localStorage。
 */
const pendingPasskeyUserHintsByDomain = new Map<
  DomainID,
  PasskeyUserHintInput
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

function writePasskeyUserHint(
  domainId: DomainID,
  hint: PasskeyUserHintInput
): void {
  try {
    const data: PasskeyUserHint = {
      ...hint,
      updated_at: Date.now(),
    };
    localStorage.setItem(cacheKey(domainId), JSON.stringify(data));
  } catch {
    // localStorage 不可用时静默失败
  }
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
   * 暂存 Passkey 用户提示，等待注册成功后提交。
   */
  stagePasskeyUserHint(domainId: DomainID, hint: PasskeyUserHintInput): void {
    pendingPasskeyUserHintsByDomain.set(domainId, hint);
  },

  /**
   * 注册成功后提交之前暂存的 Passkey 用户提示。
   */
  commitPasskeyUserHint(domainId: DomainID): void {
    const hint = pendingPasskeyUserHintsByDomain.get(domainId);
    if (hint) {
      writePasskeyUserHint(domainId, hint);
      pendingPasskeyUserHintsByDomain.delete(domainId);
    }
  },
};
