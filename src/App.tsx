import { useState, useRef } from "react";

// ... (نفس التعريفات السابقة للـ Types والـ Data) ...

export default function App() {
  // ... (نفس الـ States السابقة) ...
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  // رجعنا الـ Refs اللي كانت تسبب خطأ
  const profileImageInput = useRef<HTMLInputElement>(null);
  const coverImageInput = useRef<HTMLInputElement>(null);

  // ... (بقية الدوال) ...

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      {/* ... الكود المعتاد ... */}

      {view === "profile" && (
        <div className="animate-in fade-in">
          <div className={`rounded-[3rem] overflow-hidden border-4 relative ${darkMode ? "border-white" : "border-slate-100 shadow-2xl"}`}>
            <div className="h-48 relative group">
              <img src={userData.coverImage} className="w-full h-full object-cover" alt="cover" />
              {/* رجعنا زر تعديل الغلاف */}
              <button 
                onClick={() => coverImageInput.current?.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold"
              >
                تغيير الغلاف 📷
              </button>
              <input type="file" ref={coverImageInput} className="hidden" />
            </div>
            
            <div className={`p-10 relative ${darkMode ? "bg-black" : "bg-white"}`}>
              <div className={`w-32 h-32 rounded-3xl absolute -top-16 right-10 border-4 overflow-hidden group ${darkMode ? "bg-black border-white" : "bg-white border-white shadow-xl"}`}>
                <div className={`w-full h-full flex items-center justify-center text-4xl font-black ${darkMode ? "text-white" : "text-blue-600"}`}>
                  {userData.name[0]}
                </div>
                {/* زر تعديل الصورة الشخصية */}
                <button 
                  onClick={() => profileImageInput.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs"
                >
                  تعديل
                </button>
                <input type="file" ref={profileImageInput} className="hidden" />
              </div>

              <div className="mt-16 text-right">
                {isEditingProfile ? (
                  <div className="space-y-4">
                    <input 
                      className="w-full p-2 border-2 rounded-lg text-black" 
                      value={userData.name} 
                      onChange={(e) => setUserData({...userData, name: e.target.value})} 
                    />
                    <textarea 
                      className="w-full p-2 border-2 rounded-lg text-black" 
                      value={userData.bio} 
                      onChange={(e) => setUserData({...userData, bio: e.target.value})} 
                    />
                    <button onClick={() => setIsEditingProfile(false)} className="bg-green-500 text-white px-4 py-2 rounded-lg">حفظ</button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-3xl font-black mb-2">{userData.name}</h3>
                    <p className="font-bold opacity-60 mb-6">{selectedMajors[0]}</p>
                    <p className="text-lg leading-relaxed italic opacity-80 mb-8">"{userData.bio}"</p>
                    <button onClick={() => setIsEditingProfile(true)} className={`px-8 py-3 rounded-xl font-bold border-2 ${darkMode ? "border-white" : "border-slate-200"}`}>تعديل الملف</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ... باقي الكود ... */}
    </div>
  );
}
