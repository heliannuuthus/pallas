import { Routes, Route, Navigate } from 'react-router-dom';
import { isIrisDomain } from '@/config/env';
import { AuthProvider } from '@/providers/AuthProvider';

// Aegis 域名页面（认证 UI）
import HomePage from './pages/Home/index.tsx';
import AuthorizePage from './pages/Authorize/index.tsx';
import LoginPage from './pages/Login/index.tsx';
import ConsentPage from './pages/Consent/index.tsx';
import BindingPage from './pages/Binding/index.tsx';
import TermsPage from './pages/Terms/index.tsx';
import PrivacyPage from './pages/Privacy/index.tsx';
import ProfilePage from './pages/Profile/index.tsx';

// Iris 域名页面（用户中心 UI）
import UserLayout from './layouts/UserLayout.tsx';
import AuthCallbackPage from './pages/AuthCallback/index.tsx';
import IrisProfileInfo from './pages/Profile/components/IrisProfileInfo.tsx';
import IrisSecuritySettings from './pages/Profile/components/IrisSecuritySettings.tsx';
import IrisLinkedAccounts from './pages/Profile/components/IrisLinkedAccounts.tsx';

/** Aegis 域名路由（认证相关） */
function AegisRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/authorize" element={<AuthorizePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/consent" element={<ConsentPage />} />
      <Route path="/binding" element={<BindingPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

/** Iris 域名路由（用户中心） */
function IrisRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/u" element={<UserLayout />}>
          <Route index element={<IrisProfileInfo />} />
          <Route path="s" element={<IrisSecuritySettings />} />
          <Route path="c" element={<IrisLinkedAccounts />} />
        </Route>
        <Route path="/user/profile" element={<Navigate to="/u" replace />} />
        <Route path="/user/security" element={<Navigate to="/u/s" replace />} />
        <Route path="/user/linked" element={<Navigate to="/u/c" replace />} />
        <Route path="*" element={<Navigate to="/u" replace />} />
      </Routes>
    </AuthProvider>
  );
}

function App() {
  if (isIrisDomain()) {
    return <IrisRoutes />;
  }
  return <AegisRoutes />;
}

export default App;
