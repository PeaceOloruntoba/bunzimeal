import { useEffect, useState } from 'react';
import { useContentStore } from '../../../content/contentStore';
import QuillEditor from '../../../../components/QuillEditor';
import { Spinner } from '../../../../components/Spinner';
import { toast } from '../../../../utils/toast';

export default function ContentAdmin() {
  const { contents, adminFetchContents, adminUpdateContents, fetchFaqs, faqs, loading, adminCreateFaq, adminUpdateFaq, adminDeleteFaq } = useContentStore();
  const [privacy, setPrivacy] = useState('');
  const [terms, setTerms] = useState('');
  const [refund, setRefund] = useState('');
  const [qText, setQText] = useState('');
  const [aText, setAText] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editingQ, setEditingQ] = useState('');
  const [editingA, setEditingA] = useState('');

  useEffect(() => {
    adminFetchContents().catch(() => {});
    fetchFaqs().catch(() => {});
  }, []);

  useEffect(() => {
    setPrivacy(contents?.privacy_policy || '');
    setTerms(contents?.terms_and_condition || '');
    setRefund(contents?.refund_policy || '');
  }, [contents]);

  const handleSaveContents = async () => {
    setSaving(true);
    try {
      await adminUpdateContents({ privacy_policy: privacy, terms_and_condition: terms, refund_policy: refund });
      toast.success('Contents saved successfully');
    } catch (e) {
      toast.error('Failed to save contents');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFaq = async () => {
    if (!qText.trim() || !aText.trim()) {
      toast.error('Question and answer are required');
      return;
    }
    try {
      await adminCreateFaq(qText, aText);
      setQText('');
      setAText('');
      toast.success('FAQ created');
    } catch (e) {
      toast.error('Failed to create FAQ');
    }
  };

  const handleUpdateFaq = async () => {
    if (!editingFaqId) return;
    if (!editingQ.trim() || !editingA.trim()) {
      toast.error('Question and answer are required');
      return;
    }
    try {
      await adminUpdateFaq(editingFaqId, editingQ, editingA);
      setEditingFaqId(null);
      setEditingQ('');
      setEditingA('');
      toast.success('FAQ updated');
    } catch (e) {
      toast.error('Failed to update FAQ');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await adminDeleteFaq(id);
      toast.success('FAQ deleted');
    } catch (e) {
      toast.error('Failed to delete FAQ');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Site Contents Management</h1>

      {/* POLICIES SECTION */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Policies & Legal Pages</h2>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Privacy Policy</label>
          <QuillEditor value={privacy} onChange={setPrivacy} placeholder="Enter privacy policy..." className="bg-white" />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Terms & Conditions</label>
          <QuillEditor value={terms} onChange={setTerms} placeholder="Enter terms and conditions..." className="bg-white" />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Refund Policy</label>
          <QuillEditor value={refund} onChange={setRefund} placeholder="Enter refund policy..." className="bg-white" />
        </div>

        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
            onClick={handleSaveContents}
            disabled={saving || loading}
          >
            {saving ? <>Saving...</> : 'Save All Policies'}
          </button>
        </div>
      </div>

      <hr className="my-8" />

      {/* FAQ SECTION */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>

        {/* Create/Edit Form */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">{editingFaqId ? 'Edit FAQ' : 'Create New FAQ'}</h3>
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            placeholder="Question"
            value={editingFaqId ? editingQ : qText}
            onChange={(e) => editingFaqId ? setEditingQ(e.target.value) : setQText(e.target.value)}
          />
          <QuillEditor
            value={editingFaqId ? editingA : aText}
            onChange={(html) => editingFaqId ? setEditingA(html) : setAText(html)}
            placeholder="Answer (supports HTML)"
            className="mb-3 bg-white"
          />
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={editingFaqId ? handleUpdateFaq : handleCreateFaq}
            >
              {editingFaqId ? 'Update FAQ' : 'Create FAQ'}
            </button>
            {editingFaqId && (
              <button
                className="px-4 py-2 border rounded hover:bg-gray-200"
                onClick={() => {
                  setEditingFaqId(null);
                  setEditingQ('');
                  setEditingA('');
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* FAQ List */}
        {loading ? (
          <div className="flex items-center gap-2"><Spinner size={16} />Loading FAQs...</div>
        ) : faqs?.length === 0 ? (
          <p className="text-gray-500">No FAQs yet. Create one above.</p>
        ) : (
          <div className="space-y-3">
            {faqs?.map((f) => (
              <div key={f.id} className="p-4 border rounded-lg bg-white">
                <div className="font-semibold mb-2">{f.question}</div>
                <div className="text-sm text-gray-700 mb-3" dangerouslySetInnerHTML={{ __html: f.answer }} />
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                    onClick={() => {
                      setEditingFaqId(f.id);
                      setEditingQ(f.question);
                      setEditingA(f.answer);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    onClick={() => handleDeleteFaq(f.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
