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

  const generatePDF = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const element = pdfRef.current;
    element.style.display = 'block';
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${personalDetails.applicantName || 'Applicant'}-Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
      element.style.display = 'none';
      setIsGenerating(false);
    });
  };

  return (
    <>
    <SEO title="Free Online Resume Maker | DailyAxom Tools" description="Create a professional resume for job applications instantly." url="/resume-maker" />
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
      <div style={{ display: 'none' }}>
        <div ref={pdfRef} className="bg-white text-black p-10 mx-auto" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ textAlign: 'center', color: '#000000', fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>RESUME</h1>
          
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-3 flex-1">
              <p className="text-lg"><span className="font-bold inline-block w-40">Name</span>: {personalDetails.applicantName}</p>
              <p className="text-lg"><span className="font-bold inline-block w-40">Father's Name</span>: {personalDetails.fatherName}</p>
              <p className="text-lg"><span className="font-bold inline-block w-40">Mother's Name</span>: {personalDetails.motherName}</p>
              <p className="text-lg"><span className="font-bold inline-block w-40">Date of Birth</span>: {personalDetails.dob}</p>
              <p className="text-lg"><span className="font-bold inline-block w-40">Gender</span>: {personalDetails.gender}</p>
              <p className="text-lg"><span className="font-bold inline-block w-40">Marital Status</span>: {personalDetails.maritalStatus}</p>
              <p className="text-lg"><span className="font-bold inline-block w-40">Category</span>: {personalDetails.category}</p>
              <p className="text-lg"><span className="font-bold inline-block w-40">Languages Known</span>: {personalDetails.languages}</p>
            </div>
            {photoUrl && (
              <div className="w-32 h-40 border-2 border-black flex-shrink-0 ml-4">
                <img src={photoUrl} alt="Passport" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-3 mb-8">
            <p className="text-lg"><span className="font-bold inline-block w-40">Contact Number</span>: {personalDetails.mobileNumber}</p>
            <p className="text-lg"><span className="font-bold inline-block w-40">Email ID</span>: {personalDetails.email}</p>
            <p className="text-lg"><span className="font-bold inline-block w-40 align-top">Address</span>: <span className="inline-block w-[400px]">{personalDetails.address}</span></p>
            {personalDetails.experience && (
              <p className="text-lg"><span className="font-bold inline-block w-40">Experience</span>: {personalDetails.experience}</p>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold underline mb-4">Educational Qualifications</h2>
            <table className="w-full border-collapse border border-black text-center">
              <thead>
                <tr>
                  <th className="border border-black p-2 bg-gray-100">Exam Name</th>
                  <th className="border border-black p-2 bg-gray-100">Board/University</th>
                  <th className="border border-black p-2 bg-gray-100">Passing Year</th>
                  <th className="border border-black p-2 bg-gray-100">Percentage</th>
                  <th className="border border-black p-2 bg-gray-100">Division</th>
                </tr>
              </thead>
              <tbody>
                {education.map(edu => (
                  <tr key={edu.id}>
                    <td className="border border-black p-2">{edu.exam}</td>
                    <td className="border border-black p-2">{edu.board}</td>
                    <td className="border border-black p-2">{edu.passingYear}</td>
                    <td className="border border-black p-2">{edu.percentage}%</td>
                    <td className="border border-black p-2">{edu.division}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {otherQualifications[0]?.exam && (
            <div className="mb-8">
              <h2 className="text-xl font-bold underline mb-4">Other Qualifications</h2>
              <table className="w-full border-collapse border border-black text-center">
                <thead>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100">Qualification Name</th>
                    <th className="border border-black p-2 bg-gray-100">Institute</th>
                    <th className="border border-black p-2 bg-gray-100">Passing Year</th>
                    <th className="border border-black p-2 bg-gray-100">Score/Grade</th>
                    <th className="border border-black p-2 bg-gray-100">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {otherQualifications.map(qual => qual.exam ? (
                    <tr key={qual.id}>
                      <td className="border border-black p-2">{qual.exam}</td>
                      <td className="border border-black p-2">{qual.institute}</td>
                      <td className="border border-black p-2">{qual.passingYear}</td>
                      <td className="border border-black p-2">{qual.percentage}</td>
                      <td className="border border-black p-2">{qual.duration}</td>
                    </tr>
                  ) : null)}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-16">
            <h2 className="text-xl font-bold underline mb-4">Declaration</h2>
            <p className="text-lg leading-relaxed text-justify mb-16">
              I hereby declare that the above particulars of facts and information stated are true, correct and complete to the best of my belief and knowledge.
            </p>
            
            <div className="flex justify-between items-end">
              <div className="text-lg font-bold">
                <p>Date: ........................</p>
                <p className="mt-4">Place: ........................</p>
              </div>
              <div className="text-center">
                <p className="border-b border-black w-48 mb-2"></p>
                <p className="font-bold text-lg">Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
