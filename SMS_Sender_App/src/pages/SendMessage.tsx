import {
  CheckCircleFilled,
  FileExcelOutlined,
  SendOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Modal,
  Progress,
  Select,
  Tag,
  Upload,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { LoadingComponent } from "../component/LoadingComponent";
import { useAuth } from "../context/AuthContext";
import { SmsSpiApiService } from "../service/SmsApiService";
import templatesData from "../data/Sms_Template.json";

type Template = {
  id: number;
  category: string;
  title: string;
  message: string;
};
type Recipient = {
  id?: number;
  name?: string;
  contact: string;
  class?: string;
};

const { TextArea } = Input;

const CATEGORIES = [...new Set(templatesData.templates.map((t) => t.category))];

function SendMessage() {
  const { user } = useAuth();
  const templates = templatesData.templates as Template[];
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [messageText, setMessageText] = useState("");
  const [category, setCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{
    sent: number;
    total: number;
    successCount: number;
    failedCount: number;
  } | null>(null);
  const sendingRef = useRef(false);

  const addRecipients = (newList: Recipient[]) => {
    const valid: Recipient[] = [];
    const inValid: string[] = [];

    newList.forEach((r) => {
      // Clean contact by removing digit.Prepare list of valid and invalid contact.
      const cleaned = r.contact.replace(/\D/g, "");
      if (/^[6-9]\d{9}$/.test(cleaned)) {
        valid.push({ ...r, contact: cleaned });
      } else {
        inValid.push(r.contact);
      }
      // Add valid recipient with Map to ensure no duplicate contact's is allowed.
      setRecipients((prev) => {
        const map = new Map(prev.map((r) => [r.contact, r]));
        valid.forEach((r) => map.set(r.contact, r));
        return Array.from(map.values());
      });
      // Show Error Message.
      if (inValid.length > 0) {
        message.warning({
          content: `${inValid.length} invalid contact skipped.`,
          duration: 3,
        });
      }
    });
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    setLoading(true);
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const json: any[] = XLSX.utils.sheet_to_json(sheet);
      const contacts = json.map((row) => ({
        name: row.Name,
        contact: String(row.mobile ?? row.Mobile ?? row.Phone ?? row.Contact),
      }));
      setRecipients([]);
      addRecipients(contacts);
      setLoading(false);
      message.success(`${contacts.length} contacts imported`);
    };
    reader.readAsArrayBuffer(file);
    // setLoading(false);

    return false;
  };

  // register/cleanup the progress listener once
  useEffect(() => {
    window.api.onSmsProgress((data) => setProgress(data));
    return () => window.api.offSmsProgress();
  }, []);

  const handleSendMsgBtn = async () => {
    if (!category) {
      message.warning("Please select a category before sending.");
      return;
    }

    let availableCredit: number | undefined;
    try {
      availableCredit = await SmsSpiApiService.getCurrentSmsCredit();
    } catch {
      message.warning(
        "Could not fetch SMS credit. Proceeding without credit check.",
      );
    }

    if (availableCredit !== undefined && availableCredit < totalSms) {
      Modal.error({
        title: "Insufficient SMS Credits",
        content: (
          <div className="space-y-1 mt-2">
            <p>
              Required: <b className="text-red-500">{totalSms} credits</b>
            </p>
            <p>
              Available: <b>{availableCredit} credits</b>
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Please recharge your account before sending.
            </p>
          </div>
        ),
      });
      return;
    }

    Modal.confirm({
      title: "Send Message?",
      content: (
        <div className="space-y-1 mt-1">
          <p>
            Sending to <b>{recipients.length}</b> recipient
            {recipients.length !== 1 ? "s" : ""}
          </p>
          <p>
            Credits required: <b className="text-orange-500">{totalSms}</b>
          </p>
          {availableCredit !== undefined && (
            <p>
              Credits after send:{" "}
              <b className="text-green-600">
                {(availableCredit - totalSms).toFixed(2)}
              </b>
            </p>
          )}
        </div>
      ),
      okText: "Send",
      cancelText: "Cancel",
      okType: "primary",
      onOk: async () => {
        sendingRef.current = true;
        setProgress({
          sent: 0,
          total: recipients.length,
          successCount: 0,
          failedCount: 0,
        });
        try {
          const result = await SmsSpiApiService.sendSms({
            recipients: recipients.map((r) => r.contact),
            message: messageText,
            category,
            sentBy: user?.name ?? "Unknown",
          });
          setProgress(null);
          sendingRef.current = false;
          const resultContent = (
            <div className="space-y-1 mt-2">
              <p>
                Total recipients: <b>{result.totalRecipients}</b>
              </p>
              <p>
                Submitted to network:{" "}
                <b className="text-green-600">{result.successCount}</b>
              </p>
              {result.failedCount > 0 && (
                <p>
                  Failed: <b className="text-red-500">{result.failedCount}</b>
                </p>
              )}
              {result.groupId && (
                <p className="text-xs text-slate-400 mt-2">
                  Group ID: {result.groupId}
                </p>
              )}
            </div>
          );
          if (result.campaignStatus === "PARTIAL") {
            Modal.warning({
              title: "Campaign Partially Sent",
              content: resultContent,
            });
          } else {
            Modal.success({
              title: "Campaign Submitted",
              content: resultContent,
            });
          }
          setRecipients([]);
          setMessageText("");
          setCategory("");
        } catch (err) {
          setProgress(null);
          sendingRef.current = false;
          message.error(err instanceof Error ? err.message : "Failed to send.");
        }
      },
    });
  };

  const charCount = messageText.length;
  // GSM-7 basic charset: 160 chars/segment (153 multipart). Unicode: 70 chars/segment (67 multipart).
  const isGsm7 =
    /^[\x20-\x7E\n\r£¥àèéùìòÇØøÅåΔΦΓΛΩΠΨΣΘΞÆæßÉ¤¡ÄÖÑÜ§¿äöñüà]*$/.test(
      messageText,
    );
  const singleLimit = isGsm7 ? 160 : 70;
  const multiLimit = isGsm7 ? 153 : 67;
  const smsCount =
    charCount === 0
      ? 1
      : charCount <= singleLimit
        ? 1
        : Math.ceil(charCount / multiLimit);
  const totalSms = recipients.length * smsCount;

  if (isLoading) return <LoadingComponent />;
  return (
    <div className=" bg-white pb-32 pt-10">
      {/* Sleek Top Header */}
      <div className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <ThunderboltOutlined />
            </div>
            <h1 className="text-xl font-bold text-slate-900">New Campaign</h1>
          </div>
          <Button
            type="text"
            icon={<FileExcelOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 font-semibold hover:bg-blue-50"
          >
            Import Excel
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Step 1: Recipients */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="flex-none w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">
              {recipients.length > 0 ? (
                <CheckCircleFilled className="text-green-500 text-lg" />
              ) : (
                "01"
              )}
            </span>
            <h2 className="text-xl font-bold text-slate-700">
              Who are we messaging?
            </h2>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <Select
              mode="tags"
              className="w-full text-lg custom-modern-select"
              placeholder="Enter phone numbers manually..."
              onChange={(values) =>
                addRecipients(values.map((v: number) => ({ contact: v })))
              }
            />

            {recipients.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Selected List
                  </span>
                  <Button
                    type="link"
                    danger
                    size="small"
                    onClick={() => setRecipients([])}
                  >
                    Clear
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
                  {recipients.map((r) => (
                    <Tag
                      key={r.contact}
                      closable
                      className="bg-white border-none shadow-sm px-3 py-1 rounded-lg text-slate-600 font-medium"
                      onClose={() =>
                        setRecipients((prev) =>
                          prev.filter((x) => x.contact !== r.contact),
                        )
                      }
                    >
                      {r.contact || r.name}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Step 2: Templates */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="flex-none w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">
              {messageText ? (
                <CheckCircleFilled className="text-green-500 text-lg" />
              ) : (
                "02"
              )}
            </span>
            <h2 className="text-xl font-bold text-slate-700">
              Pick a Template
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => {
                  setMessageText(template.message);
                  setCategory(template.category);
                }}
                className="min-w-50 max-w-50 cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-4 hover:bg-blue-50 hover:border-blue-200 transition-all active:scale-95"
              >
                <h3 className="font-bold text-sm text-slate-800 mb-1 truncate">
                  {template.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {template.message}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Step 3: Composer */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="flex-none w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">
              03
            </span>
            <h2 className="text-xl font-bold text-slate-700">
              Write your message
            </h2>
          </div>

          <div className="mb-4">
            <Select
              className="w-full"
              placeholder="Select a category..."
              value={category || undefined}
              onChange={(val) => setCategory(val)}
              options={CATEGORIES.map((c) => ({ label: c, value: c }))}
              allowClear
            />
          </div>

          <div className="relative">
            <TextArea
              rows={8}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="What's the word?..."
              className="rounded-3xl border-slate-100 bg-slate-50 p-6 text-lg focus:bg-white focus:shadow-xl transition-all"
            />
            <div className="absolute bottom-4 right-6 flex gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              <span>{charCount} Chars</span>
              <span>{smsCount} SMS</span>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Global Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-2xl z-20">
        <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl flex items-center justify-between border border-slate-800">
          <div className="px-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Total Credits
            </div>
            <div className="text-2xl font-black text-white leading-none mt-1">
              {totalSms}{" "}
              <span className="text-xs font-normal text-slate-400 ml-1">
                Credits
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right mr-2 hidden sm:block">
              <div className="text-xs font-bold text-blue-400">
                {recipients.length} Recipients
              </div>
              <div className="text-[10px] text-slate-500">Ready to blast</div>
            </div>
            <Button
              onClick={handleSendMsgBtn}
              type="primary"
              size="large"
              icon={<SendOutlined />}
              disabled={!recipients.length || !messageText || !category}
              className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 border-none font-bold text-base shadow-lg shadow-blue-600/20"
            >
              Send Now
            </Button>
          </div>
        </div>
      </div>

      {/* Sending Progress Modal */}
      <Modal
        open={!!progress}
        closable={false}
        footer={null}
        centered
        width={420}
      >
        {progress && (
          <div className="py-4 px-2 text-center">
            <div className="text-lg font-bold text-slate-800 mb-1">
              Sending Campaign…
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Please keep the app open. Do not close.
            </p>
            <Progress
              percent={Math.round((progress.sent / progress.total) * 100)}
              status={progress.sent < progress.total ? "active" : "success"}
              strokeColor="#2563eb"
            />
            <div className="flex justify-around mt-5 text-sm">
              <div>
                <div className="font-bold text-slate-700">
                  {progress.sent} / {progress.total}
                </div>
                <div className="text-xs text-slate-400">Processed</div>
              </div>
              <div>
                <div className="font-bold text-green-600">
                  {progress.successCount}
                </div>
                <div className="text-xs text-slate-400">Sent</div>
              </div>
              <div>
                <div className="font-bold text-red-500">
                  {progress.failedCount}
                </div>
                <div className="text-xs text-slate-400">Failed</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modern Excel Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={500}
      >
        <div className="text-center py-6 px-2">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            <FileExcelOutlined />
          </div>

          <h2 className="text-xl font-bold mb-2 text-slate-800">
            Import Contacts
          </h2>

          <p className="text-sm text-slate-500 mb-4">
            Upload an Excel file with correct format
          </p>

          {/* Format Guide */}
          <div className="bg-slate-100 rounded-lg p-3 mb-4 text-left text-xs text-slate-600">
            <p className="font-semibold mb-1">Required Columns:</p>
            <p>
              <span className="font-medium">Name</span>,{" "}
              <span className="font-medium">Contact</span>
            </p>

            <p className="mt-2 text-slate-400">Example:</p>
            <p className="font-mono text-[11px]">
              Mobile (or Phone / Contact) | Name <br />
              9876543210 | John
            </p>
          </div>

          <Upload.Dragger
            beforeUpload={handleFile}
            showUploadList={false}
            className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50"
          >
            <div className="py-6">
              <p className="font-semibold text-slate-700">
                Click or drag Excel file here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Only .xlsx / .xls • Max 50,000 contacts
              </p>
            </div>
          </Upload.Dragger>
        </div>
      </Modal>
    </div>
  );
}

export default SendMessage;
