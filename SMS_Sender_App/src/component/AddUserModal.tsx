import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import { UserApiService } from "../service/UserApiService";
type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const AddUserModal = ({ open, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>();

  const handleSubmit = async (values: { name: string }) => {
    try {
      setLoading(true);

      const res = await UserApiService.createNewUser({
        name: values.name,
      });

      Modal.success({
        title: "User Added Successfully",
        content: (
          <div>
            <p>Account {res.user?.name} has been created.</p>

            <p className="mt-2">
              Default Password:
              <strong> Test@1234</strong>
            </p>
          </div>
        ),
      });
      onSuccess();
      form.resetFields();
      onClose();
    } catch (err: unknown) {
      Modal.error({
        title: "Failed",
        content: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New User"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
    >
      <Form layout="vertical" onFinish={handleSubmit} form={form}>
        <Form.Item
          label="Username"
          name="name"
          rules={[{ required: true, message: "User is required" }]}
        >
          <Input placeholder="e.g. john@gmail.com" />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" loading={loading} htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
export default AddUserModal;
