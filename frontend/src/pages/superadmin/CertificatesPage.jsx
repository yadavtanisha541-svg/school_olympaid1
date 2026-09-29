import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Award, Search, CheckCircle2, Eye, ShieldCheck, Printer, ExternalLink } from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { CertificateView } from '../../components/CertificateView';

export const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/certificates');
      if (res.success) setCertificates(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleOpenCertificate = (cert) => {
    setSelectedCert(cert);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Issued Merit Certificates
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Certificates generated automatically for qualifying candidates meeting examination percentage thresholds.
          </p>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Certificate ID</th>
              <th className="py-3.5 px-4">Candidate Name</th>
              <th className="py-3.5 px-4">Examination</th>
              <th className="py-3.5 px-4">Score</th>
              <th className="py-3.5 px-4">Percentage</th>
              <th className="py-3.5 px-4">Issue Date</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="7" className="py-8 text-center text-slate-400">Loading issued certificates...</td></tr>
            ) : certificates.length === 0 ? (
              <tr><td colSpan="7" className="py-8 text-center text-slate-400">No certificates generated yet.</td></tr>
            ) : (
              certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-700">{cert.certificate_number}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{cert.student_name}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{cert.exam_name}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">{parseFloat(cert.score).toFixed(1)}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 font-mono">{parseFloat(cert.percentage).toFixed(1)}%</td>
                  <td className="py-3.5 px-4 text-slate-500">{cert.issue_date}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="secondary" size="xs" icon={Eye} onClick={() => handleOpenCertificate(cert)}>
                      View & Print
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW CERTIFICATE MODAL */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Merit Certificate Document"
        maxWidth="max-w-4xl"
      >
        {selectedCert && (
          <CertificateView certificate={selectedCert} onClose={() => setShowViewModal(false)} />
        )}
      </Modal>
    </div>
  );
};
