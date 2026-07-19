import { toast } from '@heliannuuthus/ui/toast';
/**
 * 用户中心 Layout（iris 域名专用）
 *
 * 作为 /u 的父路由组件：
 * - 顶部用户卡片 + 登出按钮
 * - Tab 导航与 URL 同步
 * - <Outlet /> 渲染子路由
 */

import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Button, Spin } from 'antd';
import {
  UserOutlined,
  SafetyOutlined,
  LinkOutlined,
  LogoutOutlined,
  RightOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { useAuth } from '@/providers/AuthProvider';
import { getProfile } from '@/services/irisApi';
import { IRIS_AUTH_CONFIG } from '@/config/env';
import { passkeyUserCache } from '@/utils/passkeyCache';
import { showError } from '@/utils/error';
import type { UserProfile } from '@/types';
import Logo from '@/components/Logo';
import styles from './UserLayout.module.scss';

/** 子路由路径 → Tab key 映射 */
const TAB_MAP: Record<string, string> = {
  '/u': 'profile',
  '/u/s': 'security',
  '/u/c': 'linked',
};

/** Tab key → 子路由路径 */
const TAB_ROUTE: Record<string, string> = {
  profile: '/u',
  security: '/u/s',
  linked: '/u/c',
};

const UserLayout = () => {
  const { auth, ready, authenticated, login, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const activeTab = TAB_MAP[location.pathname] ?? 'profile';

  // 认证检查：未登录则触发 OAuth 跳转
  useEffect(() => {
    if (!ready) return;
    if (!authenticated) {
      login();
    }
  }, [ready, authenticated, login]);

  const loadProfile = useCallback(async () => {
    if (!ready || !authenticated) return;
    try {
      const data = await getProfile(auth);
      setProfile(data);
      passkeyUserCache.stagePasskeyUserHint(IRIS_AUTH_CONFIG.domainId, {
        uid: data.id,
        nickname: data.nickname || '用户',
        picture: data.picture,
      });
    } catch (error: unknown) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }, [ready, authenticated, auth]);

  useEffect(() => {
    let cancelled = false;

    if (!ready || !authenticated) return;
    void getProfile(auth)
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        passkeyUserCache.stagePasskeyUserHint(IRIS_AUTH_CONFIG.domainId, {
          uid: data.id,
          nickname: data.nickname || '用户',
          picture: data.picture,
        });
      })
      .catch((error: unknown) => {
        if (!cancelled) showError(error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ready, authenticated, auth]);

  const handleTabChange = (key: string) => {
    const route = TAB_ROUTE[key];
    if (route) {
      navigate(route);
    }
  };

  const handleLogout = async () => {
    toast.success('已退出登录');
    await authLogout();
  };

  // 未初始化 / 未认证（等待跳转）
  if (!ready || !authenticated) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  const navigationItems = [
    {
      key: 'profile',
      title: '个人信息',
      description: '头像与基本资料',
      icon: <UserOutlined />,
    },
    {
      key: 'security',
      title: '安全设置',
      description: '多重验证与安全密钥',
      icon: <SafetyOutlined />,
    },
    {
      key: 'linked',
      title: '关联账号',
      description: '第三方登录身份',
      icon: <LinkOutlined />,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.ambient} aria-hidden="true" />
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <Logo size="sm" showText animated={false} />
          <span>账户中心</span>
        </div>
        <span className={styles.secureLabel}>
          <CheckCircleFilled /> 安全连接
        </span>
      </header>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          {profile && (
            <div className={styles.userHeader}>
              <div className={styles.avatarSection} aria-hidden="true">
                <Avatar
                  size={72}
                  src={profile.picture}
                  icon={<UserOutlined />}
                  className={styles.avatar}
                />
                <span className={styles.onlineDot} />
              </div>
              <div className={styles.userInfo}>
                <span>当前账户</span>
                <h1 className={styles.nickname}>
                  {profile.nickname || '用户'}
                </h1>
                <p className={styles.userId} title={profile.id}>
                  {profile.id}
                </p>
              </div>
            </div>
          )}

          <nav className={styles.navigation} aria-label="账户设置">
            {navigationItems.map((item) => (
              <button
                type="button"
                key={item.key}
                className={
                  activeTab === item.key ? styles.activeNavItem : styles.navItem
                }
                onClick={() => handleTabChange(item.key)}
                aria-current={activeTab === item.key ? 'page' : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navCopy}>
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </span>
                <RightOutlined className={styles.navArrow} />
              </button>
            ))}
          </nav>

          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            退出登录
          </Button>
        </aside>

        <main className={styles.workspace}>
          <header className={styles.pageHeading}>
            <span>ACCOUNT / {activeTab.toUpperCase()}</span>
            <h2>
              {navigationItems.find((item) => item.key === activeTab)?.title}
            </h2>
            <p>
              {
                navigationItems.find((item) => item.key === activeTab)
                  ?.description
              }
            </p>
          </header>
          <Outlet context={{ profile, reloadProfile: loadProfile }} />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
