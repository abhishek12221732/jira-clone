import React, { useEffect, useState } from 'react';
import { Modal, List, Button, Badge, Spin, Typography } from 'antd';

const { Text } = Typography;

const NotificationModal = ({ visible, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await import('../utils/api').then(m => m.apiFetch('/notifications'));
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) fetchNotifications();
  }, [visible]);

  const markAsRead = async (id) => {
    await import('../utils/api').then(m => m.apiFetch(`/notifications/${id}/read`, { method: 'POST' }));
    fetchNotifications();
  };

  return (
    <Modal
      title="Notifications"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      {loading ? <Spin /> : (
        <List
          dataSource={notifications}
          locale={{ emptyText: 'No notifications' }}
          renderItem={item => (
            <List.Item
              style={{ background: item.is_read ? '#fff' : '#e6f7ff', borderRadius: 6, marginBottom: 8 }}
              actions={item.is_read ? [] : [
                <Button size="small" type="link" onClick={() => markAsRead(item.id)} key="read">Mark as read</Button>
              ]}
            >
              <List.Item.Meta
                title={<Text strong={!item.is_read}>{item.message}</Text>}
                description={<span style={{ fontSize: 12, color: '#888' }}>{new Date(item.created_at).toLocaleString()}</span>}
              />
              {!item.is_read && <Badge status="processing" />} 
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default NotificationModal; 