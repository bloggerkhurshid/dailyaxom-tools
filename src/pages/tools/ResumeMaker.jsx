import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Plus, Trash2, Download, FileText } from 'lucide-react';
import SEO from '../../components/SEO';

export default function ResumeMaker() {
  const [personalDetails, setPersonalDetails] = useState({
    applicantName: '', fatherName: '', motherName: '', mobileNumber: '', email: '',
    dob: '', gender: '', languages: '', address: '', category: '', maritalStatus: '', experience: ''
  });

  const [education, setEducation] = useState([
    { id: 1, exam: '', board: '', passingYear: '', percentage: '', division: '' }
  ]);

  const [otherQualifications, setOtherQualifications] = useState([
    { id: 1, exam: '', institute: '', passingYear: '', percentage: '', duration: '' }
  ]);

  const [photoUrl, setPhotoUrl] = useState(null);
  const pdfRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePersonalChange = (e) => {
    setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
  };

  const handleEducationChange = (id, field, value) => {
    setEducation(education.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleOtherChange = (id, field, value) => {
    setOtherQualifications(otherQualifications.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024) {
        alert("Please upload a photo smaller than 100KB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPhotoUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addEducation = () => setEducation([...education, { id: Date.now(), exam: '', board: '', passingYear: '', percentage: '', division: '' }]);
  const removeEducation = (id) => setEducation(education.filter(item => item.id !== id));

  const addOther = () => setOtherQualifications([...otherQualifications, { id: Date.now(), exam: '', institute: '', passingYear: '', percentage: '', duration: '' }]);
  const removeOther = (id) => setOtherQualifications(otherQualifications.filter(item => item.id !== id));

  const generatePDF = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const element = pdfRef.current;
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${personalDetails.applicantName || 'Applicant'}-Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
    <SEO title="Online Resume Maker - DailyAxom Tools" description="Create a professional resume for job applications instantly." url="/resume-maker" />
    <div className="max-w-7xl mx-auto space-y-12">
      <form onSubmit={generatePDF} className="space-y-8">
        {/* Step 1: Personal Details */}
        <div className="bg-white p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 bg-black text-white text-sm font-bold">1</span>
            Personal Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicant's Name *</label>
              <input type="text" name="applicantName" required onChange={handlePersonalChange} className="w-full px-4 py-2 border border-gray-200 focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name *</label>
              <input type="text" name="fatherName" required onChange={handlePersonalChange} className="w-full px-4 py-2 border border-gray-200 focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name *</label>
              <input type="text" name="motherName" required onChange={handlePersonalChange} className="w-full px-4 py-2 border border-gray-200 focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
              <input type="tel" name="mobileNumber" required minLength="10" maxLength="10" onChange={handlePersonalChange} className="w-full px-4 py-2 border border-gray-200 focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input type="email" name="email" required onChange={handlePersonalChange} className="w-full px-4 py-2 border border-gray-200 focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input type="date" name="dob" required onChange={handlePersonalChange} className="w-full px-4 py-2 border border-gray-200 focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select name="gender" required onChange={handlePersonalChange} className="w-full px-4 py-2 border border-gray-200 focus:ring-black focus:border-black bg-white">
                <option value="">-- Select --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" onChange={handlePersonalChange} className="w-full px-4 py-2 border border-gray-200 focus:ring-black focus:border-black bg-white">
                <option value="">-- Select --</option>
                <option value="General">General</option>
                <option value="OBC/MOBC">OBC/MOBC</option>
                <option value="SC">Schedule Caste</option>
                <option value="ST">Schedule Tribe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
              <select name="maritalStatus" onChange={handlePersonalChange} className="w-full px-4 py-2 border border-gray-200 focus:ring-black focus:border-black bg-white">
                <option value="">-- Select --</option>
                <option value="Unmarried">Unmarried</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Known Languages *</label>
              <input type="text" name="languages" required onChange={handlePersonalChange} placeholder="e.g., English, Hindi" className="w-full px-4 py-2 border border-gray-200 focus:ring-black focus:border-black" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
              <input type="text" name="address" required onChange={handlePersonalChange} className="w-full px-4 py-2 border border-gray-200 focus:ring-black focus:border-black" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <input type="text" name="experience" onChange={handlePersonalChange} placeholder="e.g., 2 years in XYZ Company" className="w-full px-4 py-2 border border-gray-200 focus:ring-black focus:border-black" />
            </div>
          </div>
        </div>

        {/* Step 2: Educational Qualifications */}
        <div className="bg-white p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 bg-black text-white text-sm font-bold">2</span>
            Educational Qualifications
          </h2>
          
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={edu.id} className="relative grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-100 bg-gray-50/50">
                {index > 0 && (
                  <button type="button" onClick={() => removeEducation(edu.id)} className="absolute -top-3 -right-3 bg-white text-red-500 p-1 border border-gray-200 hover:bg-red-50 transition-colors shadow-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Exam Name *</label>
                  <input type="text" required value={edu.exam} onChange={(e) => handleEducationChange(edu.id, 'exam', e.target.value)} placeholder="e.g. HSLC, B.A." className="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-black focus:border-black" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Board/University *</label>
                  <input type="text" required value={edu.board} onChange={(e) => handleEducationChange(edu.id, 'board', e.target.value)} placeholder="e.g. SEBA, CBSE" className="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Passing Year *</label>
                  <input type="text" required maxLength="4" value={edu.passingYear} onChange={(e) => handleEducationChange(edu.id, 'passingYear', e.target.value)} placeholder="YYYY" className="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Percentage *</label>
                  <input type="number" step="0.01" required value={edu.percentage} onChange={(e) => handleEducationChange(edu.id, 'percentage', e.target.value)} placeholder="%" className="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Division *</label>
                  <select required value={edu.division} onChange={(e) => handleEducationChange(edu.id, 'division', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-black focus:border-black bg-white">
                    <option value="">Select</option>
                    <option value="1st Division">1st Div</option>
                    <option value="2nd Division">2nd Div</option>
                    <option value="3rd Division">3rd Div</option>
                  </select>
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addEducation} className="flex items-center gap-2 text-sm font-semibold text-black hover:bg-gray-100 px-4 py-2 transition-colors border border-gray-200">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        </div>

        {/* Step 3: Other Qualifications */}
        <div className="bg-white p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 bg-black text-white text-sm font-bold">3</span>
            Other Qualifications (Optional)
          </h2>
          
          <div className="space-y-6">
            {otherQualifications.map((qual, index) => (
              <div key={qual.id} className="relative grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-100 bg-gray-50/50">
                {index > 0 && (
                  <button type="button" onClick={() => removeOther(qual.id)} className="absolute -top-3 -right-3 bg-white text-red-500 p-1 border border-gray-200 hover:bg-red-50 transition-colors shadow-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Qualification Name</label>
                  <input type="text" value={qual.exam} onChange={(e) => handleOtherChange(qual.id, 'exam', e.target.value)} placeholder="e.g. Diploma in Computer" className="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-black focus:border-black" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Institute/Organization</label>
                  <input type="text" value={qual.institute} onChange={(e) => handleOtherChange(qual.id, 'institute', e.target.value)} placeholder="Institute name" className="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Passing Year</label>
                  <input type="text" maxLength="4" value={qual.passingYear} onChange={(e) => handleOtherChange(qual.id, 'passingYear', e.target.value)} placeholder="YYYY" className="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Score/Grade</label>
                  <input type="text" value={qual.percentage} onChange={(e) => handleOtherChange(qual.id, 'percentage', e.target.value)} placeholder="Grade or %" className="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                  <input type="text" value={qual.duration} onChange={(e) => handleOtherChange(qual.id, 'duration', e.target.value)} placeholder="e.g. 6 months" className="w-full px-3 py-2 text-sm border border-gray-200 focus:ring-black focus:border-black" />
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addOther} className="flex items-center gap-2 text-sm font-semibold text-black hover:bg-gray-100 px-4 py-2 transition-colors border border-gray-200">
              <Plus className="w-4 h-4" /> Add More
            </button>
          </div>
        </div>

        {/* Step 4: Uploads */}
        <div className="bg-white p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 bg-black text-white text-sm font-bold">4</span>
            Final Steps
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passport Size Photo * (Max 100KB)</label>
              <input type="file" required accept="image/jpeg,image/jpg,image/png" onChange={handlePhotoUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 transition-colors" />
            </div>
            
            <div className="bg-gray-50 p-4 border border-gray-200 text-sm text-gray-600">
              <p className="font-semibold text-black mb-1">Declaration</p>
              I hereby declare that the above particulars of facts and information stated are true, correct and complete to the best of my belief and knowledge.
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button type="submit" disabled={isGenerating} className="flex items-center gap-2 bg-black text-white px-8 py-4 font-bold text-lg hover:bg-gray-800 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20">
            <Download className="w-6 h-6" />
            {isGenerating ? 'Generating PDF...' : 'Generate My Resume'}
          </button>
        </div>
      </form>

      {/* About Section */}
      <section className="bg-white p-8 border-t border-gray-100 mt-16 text-center">
        <h2 className="text-xl font-bold text-black mb-2">About Online Resume Maker</h2>
        <p className="text-gray-600 text-sm max-w-3xl mx-auto">
          Create a professional, standardized resume for job applications in minutes. 
          Your privacy is guaranteed—all data is processed directly in your browser and never stored on our servers.
        </p>
      </section>

      {/* HIDDEN PDF TEMPLATE */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '210mm' }}>
        <div ref={pdfRef} style={{ padding: '40px', backgroundColor: '#ffffff', color: '#000000', width: '210mm', minHeight: '297mm', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }}>
          <h1 style={{ textAlign: 'center', color: '#000000', fontSize: '24px', fontWeight: 'bold', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>RESUME</h1>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
            <div style={{ flex: '1' }}>
              <p style={{ fontSize: '16px', margin: '0 0 10px 0' }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '160px' }}>Name</span>: {personalDetails.applicantName}</p>
              <p style={{ fontSize: '16px', margin: '0 0 10px 0' }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '160px' }}>Father's Name</span>: {personalDetails.fatherName}</p>
              <p style={{ fontSize: '16px', margin: '0 0 10px 0' }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '160px' }}>Mother's Name</span>: {personalDetails.motherName}</p>
              <p style={{ fontSize: '16px', margin: '0 0 10px 0' }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '160px' }}>Date of Birth</span>: {personalDetails.dob}</p>
              <p style={{ fontSize: '16px', margin: '0 0 10px 0' }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '160px' }}>Gender</span>: {personalDetails.gender}</p>
              <p style={{ fontSize: '16px', margin: '0 0 10px 0' }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '160px' }}>Marital Status</span>: {personalDetails.maritalStatus}</p>
              <p style={{ fontSize: '16px', margin: '0 0 10px 0' }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '160px' }}>Category</span>: {personalDetails.category}</p>
              <p style={{ fontSize: '16px', margin: '0 0 10px 0' }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '160px' }}>Languages Known</span>: {personalDetails.languages}</p>
            </div>
            {photoUrl && (
              <div style={{ width: '120px', height: '150px', border: '2px solid #000000', marginLeft: '20px', flexShrink: 0 }}>
                <img src={photoUrl} alt="Passport" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div style={{ marginBottom: '30px' }}>
            <p style={{ fontSize: '16px', margin: '0 0 10px 0' }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '160px' }}>Contact Number</span>: {personalDetails.mobileNumber}</p>
            <p style={{ fontSize: '16px', margin: '0 0 10px 0' }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '160px' }}>Email ID</span>: {personalDetails.email}</p>
            <div style={{ display: 'flex', fontSize: '16px', margin: '0 0 10px 0' }}>
              <span style={{ fontWeight: 'bold', display: 'inline-block', width: '160px', flexShrink: 0 }}>Address</span>
              <span>: {personalDetails.address}</span>
            </div>
            {personalDetails.experience && (
              <p style={{ fontSize: '16px', margin: '0 0 10px 0' }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '160px' }}>Experience</span>: {personalDetails.experience}</p>
            )}
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'underline', margin: '0 0 15px 0' }}>Educational Qualifications</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', border: '1px solid #000000' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px', border: '1px solid #000000', backgroundColor: '#f3f4f6', fontSize: '14px' }}>Exam Name</th>
                  <th style={{ padding: '8px', border: '1px solid #000000', backgroundColor: '#f3f4f6', fontSize: '14px' }}>Board/University</th>
                  <th style={{ padding: '8px', border: '1px solid #000000', backgroundColor: '#f3f4f6', fontSize: '14px' }}>Passing Year</th>
                  <th style={{ padding: '8px', border: '1px solid #000000', backgroundColor: '#f3f4f6', fontSize: '14px' }}>Percentage</th>
                  <th style={{ padding: '8px', border: '1px solid #000000', backgroundColor: '#f3f4f6', fontSize: '14px' }}>Division</th>
                </tr>
              </thead>
              <tbody>
                {education.map(edu => (
                  <tr key={edu.id}>
                    <td style={{ padding: '8px', border: '1px solid #000000', fontSize: '14px' }}>{edu.exam}</td>
                    <td style={{ padding: '8px', border: '1px solid #000000', fontSize: '14px' }}>{edu.board}</td>
                    <td style={{ padding: '8px', border: '1px solid #000000', fontSize: '14px' }}>{edu.passingYear}</td>
                    <td style={{ padding: '8px', border: '1px solid #000000', fontSize: '14px' }}>{edu.percentage}%</td>
                    <td style={{ padding: '8px', border: '1px solid #000000', fontSize: '14px' }}>{edu.division}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {otherQualifications[0]?.exam && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'underline', margin: '0 0 15px 0' }}>Other Qualifications</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', border: '1px solid #000000' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px', border: '1px solid #000000', backgroundColor: '#f3f4f6', fontSize: '14px' }}>Qualification Name</th>
                    <th style={{ padding: '8px', border: '1px solid #000000', backgroundColor: '#f3f4f6', fontSize: '14px' }}>Institute</th>
                    <th style={{ padding: '8px', border: '1px solid #000000', backgroundColor: '#f3f4f6', fontSize: '14px' }}>Passing Year</th>
                    <th style={{ padding: '8px', border: '1px solid #000000', backgroundColor: '#f3f4f6', fontSize: '14px' }}>Score/Grade</th>
                    <th style={{ padding: '8px', border: '1px solid #000000', backgroundColor: '#f3f4f6', fontSize: '14px' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {otherQualifications.map(qual => qual.exam ? (
                    <tr key={qual.id}>
                      <td style={{ padding: '8px', border: '1px solid #000000', fontSize: '14px' }}>{qual.exam}</td>
                      <td style={{ padding: '8px', border: '1px solid #000000', fontSize: '14px' }}>{qual.institute}</td>
                      <td style={{ padding: '8px', border: '1px solid #000000', fontSize: '14px' }}>{qual.passingYear}</td>
                      <td style={{ padding: '8px', border: '1px solid #000000', fontSize: '14px' }}>{qual.percentage}</td>
                      <td style={{ padding: '8px', border: '1px solid #000000', fontSize: '14px' }}>{qual.duration}</td>
                    </tr>
                  ) : null)}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '50px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'underline', margin: '0 0 15px 0' }}>Declaration</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6', textAlign: 'justify', margin: '0 0 60px 0' }}>
              I hereby declare that the above particulars of facts and information stated are true, correct and complete to the best of my belief and knowledge.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                <p style={{ margin: '0 0 10px 0' }}>Date: ........................</p>
                <p style={{ margin: '0' }}>Place: ........................</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ width: '200px', borderBottom: '1px solid #000000', margin: '0 0 10px 0' }}></p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
