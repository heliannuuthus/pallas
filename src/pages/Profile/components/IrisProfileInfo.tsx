import { toast } from '@heliannuuthus/ui/toast';
/**
 * iris 域名下的个人信息页面（/u）
 *
 * 使用 irisApi（Bearer Token）替代原有的 Cookie API
 */

import { useState } from 'react';
import { Form, Input, Button, Avatar } from 'antd';
import {
  CheckCircleFilled,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/providers/AuthProvider';
import { updateProfile } from '@/services/irisApi';
import { showError } from '@/utils/error';
import type { UserProfile, UpdateProfileRequest } from '@/types';
import { useOutletContext } from 'react-router-dom';
import styles from './ProfileInfo.module.scss';

interface UserLayoutContext {
  profile: UserProfile | null;
  reloadProfile: () => void;
}

const IrisProfileInfo = () => {
  const { profile, reloadProfile } = useOutletContext<UserLayoutContext>();
  const { auth } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  if (!profile) return null;

  const handleSubmit = async (values: UpdateProfileRequest) => {
    try {
      setLoading(true);
      await updateProfile(auth, values);
      toast.success('资料更新成功');
      reloadProfile();
    } catch (error: unknown) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          nickname: profile.nickname,
          picture: profile.picture,
        }}
        onFinish={handleSubmit}
        className={styles.form}
      >
        <section className={styles.profileCard}>
          <div className={styles.avatarPreview}>
            <Avatar size={68} src={profile.picture} icon={<UserOutlined />} />
            <div>
              <strong>公开资料</strong>
              <span>这些信息会显示在使用统一身份的服务中。</span>
            </div>
          </div>
          <Form.Item
            label="昵称"
            name="nickname"
            rules={[{ max: 50, message: '昵称不能超过 50 个字符' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            label="头像地址"
            name="picture"
            rules={[
              {
                type: 'url',
                warningOnly: true,
                message: '请输入完整的图片地址',
              },
            ]}
          >
            <Input
              prefix={<IdcardOutlined />}
              placeholder="https://example.com/avatar.png"
            />
          </Form.Item>
          <div className={styles.formActions}>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存修改
            </Button>
          </div>
        </section>
      </Form>

      <section className={styles.contactCard} aria-labelledby="contact-title">
        <header>
          <div>
            <h3 id="contact-title">联系信息</h3>
            <p>联系信息由身份认证服务管理。</p>
          </div>
          <span>只读</span>
        </header>
        <dl>
          <div>
            <dt>
              <MailOutlined /> 邮箱
            </dt>
            <dd>
              {profile.email || '未绑定'}
              {profile.email_verified && (
                <span className={styles.verified}>
                  <CheckCircleFilled /> 已验证
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt>
              <PhoneOutlined /> 手机号
            </dt>
            <dd>{profile.phone || '未绑定'}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
};

export default IrisProfileInfo;
