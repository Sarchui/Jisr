import React, { useState, useRef } from "react";

// --- 1. التعريفات (Types) ---
type MajorCategories = { [key: string]: string[] };

interface Project {
  id: number;
  title: string;
  owner: string;
  major: string;
  description: string;
  tags: string[];
  requiredMajors: string[];
  status?: "نشط" | "مكتمل" | "قيد التنفيذ";
  colorTag?: "green" | "red" | "yellow";
  statusText?: string;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  projectName?: string;
  timestamp?: string;
}

interface ChatContact {
  id: number;
  name: string;
  lastMessage: string;
  avatarLetter: string;
  messages: Message[];
  isFollowing?: boolean;
}

interface Notification {
  id: number;
  text: string;
  type: "join_request" | "system";
  read: boolean;
}

// --- 2. البيانات الثابتة (Data) ---
const allMajors: MajorCategories = {
  "العلوم والهندسة": ["علوم حاسب", "هندسة برمجيات", "أمن سيبراني", "ذكاء اصطناعي", "هندسة كهربائية", "هندسة ميكانيكية", "نظم معلومات", "تقنية معلومات"],
  "اللغات والآداب": ["لغات وترجمة", "لغة إنجليزية", "لغة عربية", "لغويات تطبيقية", "أدب إنجليزي", "ترجمة فورية"],
  "الإدارة والاقتصاد": ["إدارة أعمال", "محاسبة", "تسويق", "موارد بشرية", "اقتصاد", "مالية", "سلاسل إمداد"],
  "التصميم والإعلام": ["تصميم جرافيك", "إعلام واتصال", "تصميم داخلي", "فنون بصرية", "صناعة أفلام", "علاقات عامة"],
  "تخصصات إضافية": ["قانون", "طب بشري", "تمريض", "صيدلة", "علم نفس", "اجتماع", "تربية خاصة", "رياضيات", "فيزياء", "كيمياء", "أحياء", "جيولوجيا", "عمارة", "تخطيط حضري"],
};

const flatMajorsList = Object.values(allMajors).flat();

const projectsData: Project[] = [
  {
    id: 1,
    title: "مترجم ذكاء اصطناعي",
    owner: "سارة أحمد",
    major: "لغات وترجمة",
    description: "نبحث عن مبرمج لتحويل قاعدة بيانات المصطلحات الطبية إلى تطبيق ويب تفاعلي.",
    tags: ["AI", "React"],
    requiredMajors: ["علوم حاسب"],
    status: "نشط",
    colorTag: "green",
    statusText: "فرصة متاحة"
  },
  {
    id: 2,
    title: "نظام ري ذكي",
    owner: "فهد المطيري",
    major: "هندسة حاسب",
    description: "مشروع تخرج لتقليل استهلاك المياه في المزارع باستخدام مستشعرات الرطوبة.",
    tags: ["IoT", "Hardware"],
    requiredMajors: ["هندسة كهربائية"],
    status: "قيد التنفيذ",
    colorTag: "yellow",
    statusText: "قيد التطوير"
  },
];

// --- المكونات الرسومية ---
const HomeLogo = ({ active, darkMode }: any) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
    stroke={active ? (darkMode ? "#000" : "#2563eb") : (darkMode ? "#FFF" : "#64748b")} 
    strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const ChatLogo = ({ active, darkMode }: any) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
    stroke={active ? (darkMode ? "#000" : "#2563eb") : (darkMode ? "#FFF" : "#64748b")} 
    strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
const NotifLogo = ({ active, darkMode }: any) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
    stroke={active ? (darkMode ? "#000" : "#2563eb") : (darkMode ? "#FFF" : "#64748b")} 
    strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
);
const UserLogo = ({ active, darkMode }: any) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
    stroke={active ? (darkMode ? "#000" : "#2563eb") : (darkMode ? "#FFF" : "#64748b")} 
    strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

// --- المكونات الفرعية ---
const ProjectDetailsModal = ({ project, onClose, onJoin, darkMode, joinStatus, onFollow }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
    <div className={`w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative border-4 text-right transition-all ${darkMode ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-900"}`}>
      <button onClick={onClose} className={`absolute left-6 top-6 text-2xl hover:text-red-500 ${darkMode ? "text-white" : "text-slate-400"}`}>✕</button>
      <span className={`font-black text-[10px] px-4 py-2 rounded-full uppercase mb-6 inline-block ${darkMode ? "bg-white text-black" : "bg-blue-50 text-blue-600"}`}>{project.major}</span>
      <h3 className="text-3xl font-black mb-8">{project.title}</h3>
      <p className={`leading-loose mb-10 text-lg italic opacity-80`}>"{project.description}"</p>
      
      <div className={`flex items-center justify-between gap-4 mb-10 p-4 rounded-2xl border-2 ${darkMode ? "border-white bg-black" : "border-slate-50 bg-slate-50"}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${darkMode ? "bg-white text-black" : "bg-blue-600 text-white"}`}>{project.owner[0]}</div>
          <div className="text-right">
            <p className={`text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1`}>صاحب المشروع</p>
            <p className="font-bold">{project.owner}</p>
          </div>
        </div>
        <button onClick={() => onFollow(project.owner)} className={`px-4 py-2 rounded-lg text-xs font-bold border-2 ${darkMode ? "border-white text-white" : "border-blue-600 text-blue-600"}`}>متابعة +</button>
      </div>

      <button disabled={joinStatus === "sent"} onClick={() => onJoin(project)} className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl active:scale-95 ${joinStatus === "sent" ? "bg-green-500 text-white cursor-default" : darkMode ? "bg-white text-black" : "bg-blue-600 text-white"}`}>
        {joinStatus === "sent" ? "تم إرسال الطلب بنجاح ✅" : "إرسال طلب انضمام ✨"}
      </button>
    </div>
  </div>
);

export default function App() {
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState(1);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [view, setView] = useState<"home" | "profile" | "chat" | "notifications">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [joinStatus, setJoinStatus] = useState<string | null>(null);

  const [rememberMe, setRememberMe] = useState(false); 
  const [notifications, setNotifications] = useState<Notification[]>([ 
    { id: 1, text: "طلب 'محمد' الانضمام لمشروعك: مترجم الذكاء الاصطناعي", type: "join_request", read: false },
  ]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const profileImageInput = useRef<HTMLInputElement>(null);
  const coverImageInput = useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useState({
    name: "سارة الشطيطي",
    email: "",
    phone: "",
    password: "",
    bio: "مترجمة لغة إنجليزية شغوفة بالتقنية 3D Web",
    profileImage: "",
    coverImage: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop",
  });

  const [activeChat, setActiveChat] = useState<ChatContact | null>(null);
  const [contacts, setContacts] = useState<ChatContact[]>([
    {
      id: 1,
      name: "سارة أحمد",
      lastMessage: "أهلاً بك! متى نبدأ العمل على المشروع؟",
      avatarLetter: "س",
      isFollowing: true,
      messages: [
        { id: 1, sender: "سارة أحمد", text: "أهلاً بك! متى نبدأ العمل على المشروع؟", timestamp: "10:30 AM" },
        { id: 2, sender: "أنا", text: "أهلاً سارة، جاهزة متى ما شئتِ", timestamp: "10:32 AM" }
      ]
    }
  ]);

  const [chatInput, setChatInput] = useState("");
  const [formInput, setFormInput] = useState({
    title: "",
    major: "",
    description: "",
    requiredMajors: [] as string[],
  });

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleAuth = () => {
    if (!validateEmail(userData.email)) { alert("يرجى إدخال بريد إلكتروني صحيح"); return; }
    if (userData.password.length < 6) { alert("كلمة المرور يجب أن تكون 6 خانات على الأقل"); return; }
    setStep(3);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !activeChat) return;
    const newMessage = {
      id: Date.now(),
      sender: "أنا",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    
    const updatedContacts = contacts.map(c => {
      if (c.id === activeChat.id) {
        return { ...c, lastMessage: chatInput, messages: [...c.messages, newMessage] };
      }
      return c;
    });
    setContacts(updatedContacts);
    setActiveChat({ ...activeChat, messages: [...activeChat.messages, newMessage] });
    setChatInput("");
  };

  const handleJoinProject = (project: Project) => {
    setJoinStatus("sent");
    const existingChat = contacts.find(c => c.name === project.owner);
    if (!existingChat) {
      const newContact: ChatContact = {
        id: Date.now(),
        name: project.owner,
        lastMessage: `طلب انضمام لمشروع: ${project.title}`,
        avatarLetter: project.owner[0],
        isFollowing: false,
        messages: [{ id: Date.now(), sender: "أنا", text: `مرحباً ${project.owner}، أنا مهتم بالانضمام لمشروعك: (${project.title})`, timestamp: "الآن" }]
      };
      setContacts([newContact, ...contacts]);
    }
    setTimeout(() => { setSelectedProject(null); setJoinStatus(null); setView("chat"); }, 1500);
  };

  const handleFollow = (name: string) => {
    setContacts(contacts.map(c => c.name === name ? { ...c, isFollowing: true } : c));
    alert(`تمت متابعة ${name} بنجاح!`);
  };

  const handleAcceptRequest = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    alert("تم قبول الطلب وبدء العمل على المشروع! 🚀");
  };

  const handleAddProject = () => {
    if (!formInput.title || !formInput.description) {
      alert("عذراً، يجب إكمال كافة معلومات المشروع.");
      return;
    }
    const newProj: Project = {
      id: Date.now(),
      title: formInput.title,
      owner: userData.name,
      major: selectedMajors[0],
      description: formInput.description,
      tags: [],
      requiredMajors: formInput.requiredMajors,
      status: "نشط",
      colorTag: "green",
      statusText: "مشروع ناشئ"
    };
    setProjects([newProj, ...projects]);
    setShowAddForm(false);
    setFormInput({ title: "", major: "", description: "", requiredMajors: [] });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, [type === 'profile' ? 'profileImage' : 'coverImage']: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMajor = (major: string) => setSelectedMajors([major]);

  const filteredProjects = projects.filter((p) => {
    const s = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || p.major.toLowerCase().includes(s);
  });

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onJoin={handleJoinProject}
          onFollow={handleFollow}
          darkMode={darkMode}
          joinStatus={joinStatus}
        />
      )}

      <div className={`min-h-screen pb-24 transition-colors duration-500 font-sans text-right ${darkMode ? "bg-black text-white" : "bg-slate-50 text-slate-900"}`} dir="rtl">
        <nav className={`p-8 flex justify-between items-center max-w-6xl mx-auto border-b-4 ${darkMode ? "border-white" : "border-slate-200"}`}>
          <h1 className={`text-4xl font-black tracking-tighter cursor-pointer ${darkMode ? "text-white" : "text-blue-600"}`} onClick={() => { setView("home"); setShowAddForm(false); setStep(4); setActiveChat(null); }}>جِـسـر</h1>
          <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-2xl transition-all border-2 ${darkMode ? "bg-white text-black border-white" : "bg-white text-slate-900 border-slate-200 shadow-sm"}`}>{darkMode ? "☀️" : "🌙"}</button>
        </nav>

        <main className="max-w-4xl mx-auto p-6 mt-10">
          {step === 1 && (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-1000">
              <div className={`w-16 h-1.5 rounded-full mb-10 ${darkMode ? "bg-white" : "bg-blue-600"}`}></div>
              <h2 className={`text-6xl md:text-7xl font-black mb-8 leading-tight bg-clip-text text-transparent ${darkMode ? "bg-gradient-to-b from-white to-white/40" : "bg-gradient-to-b from-blue-600 to-black"}`}>حيث تلتقي العقول <br /> لتبني المستقبل</h2>
              <button onClick={() => setStep(2)} className={`px-14 py-5 rounded-2xl font-bold text-2xl shadow-2xl transition-all active:scale-95 ${darkMode ? "bg-white text-black" : "bg-blue-600 text-white"}`}>ابدأ رحلتك الآن</button>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-5">
              <h2 className="text-4xl font-black mb-12 text-center">{authMode === "signup" ? "إنشاء حساب جديد" : "تسجيل دخول"}</h2>
              <div className="space-y-6">
                {authMode === "signup" && (
                  <input type="text" placeholder="الاسم الكامل" className={`w-full p-5 rounded-2xl border-4 outline-none font-bold ${darkMode ? "bg-black border-white" : "bg-white border-slate-100"}`} value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
                )}
                <input type="email" placeholder="البريد الإلكتروني" className={`w-full p-5 rounded-2xl border-4 outline-none font-bold ${darkMode ? "bg-black border-white" : "bg-white border-slate-100"}`} value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                <input type="password" placeholder="كلمة المرور" className={`w-full p-5 rounded-2xl border-4 outline-none font-bold ${darkMode ? "bg-black border-white" : "bg-white border-slate-100"}`} value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
                <div className="flex items-center gap-3 px-2">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-5 h-5 accent-blue-600" id="rem" />
                  <label htmlFor="rem" className="font-bold opacity-70 cursor-pointer">تذكرني على هذا الجهاز</label>
                </div>
                <button onClick={handleAuth} className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 ${darkMode ? "bg-white text-black" : "bg-blue-600 text-white"}`}>تأكيد</button>
                <button onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")} className="w-full text-center font-bold opacity-50 text-sm mt-4">تبديل الوضع</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-bottom-10">
              <h2 className="text-4xl font-black mb-12">اختر تخصصك</h2>
              {Object.keys(allMajors).map((category) => (
                <div key={category} className="mb-10">
                  <h3 className={`text-lg font-black mb-6 border-r-4 pr-3 ${darkMode ? "text-white border-white" : "text-slate-400 border-blue-600"}`}>{category}</h3>
                  <div className="flex flex-wrap gap-4">
                    {allMajors[category].map((m) => (
                      <button key={m} onClick={() => toggleMajor(m)} className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${selectedMajors.includes(m) ? darkMode ? "bg-white text-black border-white" : "bg-blue-600 text-white border-blue-600" : darkMode ? "border-white/20 text-white" : "border-slate-200 text-slate-600 bg-white"}`}>{m}</button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={() => setStep(4)} disabled={selectedMajors.length === 0} className={`mt-12 px-12 py-4 rounded-xl font-black text-xl shadow-xl transition-all ${selectedMajors.length > 0 ? darkMode ? "bg-white text-black" : "bg-blue-600 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>دخول للمنصة</button>
            </div>
          )}

          {step === 4 && (
            <>
              {view === "home" && (
                showAddForm ? (
                  <div className={`p-10 rounded-[2.5rem] border-4 shadow-2xl animate-in zoom-in-95 ${darkMode ? "bg-black border-white text-white" : "bg-white border-slate-200 text-slate-900"}`}>
                    <h2 className="text-4xl font-black mb-10">أنشئ بصمتك الخاصة 🚀</h2>
                    <div className="space-y-8">
                      <input type="text" placeholder="عنوان الفكرة..." className={`w-full p-5 rounded-xl border-2 outline-none ${darkMode ? "bg-black border-white text-white" : "bg-slate-50 border-slate-200"}`} value={formInput.title} onChange={(e) => setFormInput({ ...formInput, title: e.target.value })} />
                      <textarea rows={4} placeholder="اشرح الفكرة..." className={`w-full p-5 rounded-xl border-2 outline-none leading-relaxed ${darkMode ? "bg-black border-white text-white" : "bg-slate-50 border-slate-200"}`} value={formInput.description} onChange={(e) => setFormInput({ ...formInput, description: e.target.value })} />
                      <div className="flex gap-4 pt-4">
                        <button onClick={handleAddProject} className={`flex-1 py-5 rounded-2xl font-black text-xl shadow-xl ${darkMode ? "bg-white text-black" : "bg-blue-600 text-white"}`}>نشر</button>
                        <button onClick={() => setShowAddForm(false)} className="px-8 font-bold opacity-50">إلغاء</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-700">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                      <h2 className="text-5xl font-black">المشاريع</h2>
                      <button onClick={() => setShowAddForm(true)} className={`px-10 py-4 rounded-2xl font-black text-xl shadow-xl ${darkMode ? "bg-white text-black" : "bg-blue-600 text-white"}`}>+ أنشئ مشروعك</button>
                    </div>
                    <div className="relative mb-12">
                      <input type="text" placeholder="ابحث عن أفكار، مشاريع..." className={`w-full p-6 rounded-3xl border-4 outline-none font-bold text-lg ${darkMode ? "bg-black border-white" : "bg-white border-slate-100 shadow-lg"}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {filteredProjects.map((p) => (
                        <div key={p.id} className={`p-10 rounded-[2.5rem] border-4 transition-all flex flex-col justify-between hover:scale-[1.02] ${darkMode ? "bg-black border-white" : "bg-white border-slate-100 shadow-xl"}`}>
                          <div>
                            <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase mb-4 inline-block ${darkMode ? "bg-white text-black" : "bg-blue-50 text-blue-600"}`}>{p.major}</span>
                            <h3 className="text-3xl font-black mb-6 leading-snug">{p.title}</h3>
                            <p className="text-lg mb-10 leading-loose italic opacity-70">"{p.description}"</p>
                          </div>
                          <button onClick={() => setSelectedProject(p)} className={`w-full py-4 rounded-xl font-black text-sm ${darkMode ? "bg-white text-black" : "bg-slate-900 text-white"}`}>عرض التفاصيل</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}

              {view === "chat" && (
                <div className="h-[70vh] flex flex-col animate-in fade-in">
                  {!activeChat ? (
                    <div className={`flex-1 overflow-y-auto p-4 rounded-[2.5rem] border-4 ${darkMode ? "bg-black border-white" : "bg-white border-slate-100"}`}>
                      <h2 className="text-2xl font-black mb-6 px-4">المحادثات</h2>
                      {contacts.map(c => (
                        <div key={c.id} onClick={() => setActiveChat(c)} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer mb-2 transition-all ${darkMode ? "hover:bg-zinc-900" : "hover:bg-slate-50"}`}>
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl ${darkMode ? "bg-white text-black" : "bg-blue-600 text-white"}`}>{c.avatarLetter}</div>
                          <div className="flex-1">
                            <h4 className="font-black">{c.name}</h4>
                            <p className="text-sm opacity-60 truncate max-w-[200px]">{c.lastMessage}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-4 p-4 border-b-4 mb-4">
                        <button onClick={() => setActiveChat(null)} className="text-xl">🔙</button>
                        <h4 className="font-black">{activeChat.name}</h4>
                      </div>
                      <div className={`flex-1 overflow-y-auto p-6 space-y-4 border-4 rounded-[2.5rem] mb-6 ${darkMode ? "bg-black border-white" : "bg-white border-slate-100"}`}>
                        {activeChat.messages.map((m) => (
                          <div key={m.id} className={`flex ${m.sender === "أنا" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl font-bold ${m.sender === "أنا" ? (darkMode ? "bg-white text-black" : "bg-blue-600 text-white") : (darkMode ? "bg-zinc-800" : "bg-slate-100")}`}>{m.text}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <input type="text" className={`flex-1 p-5 rounded-2xl border-4 outline-none font-bold ${darkMode ? "bg-black border-white" : "bg-white border-slate-100"}`} placeholder="اكتب..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
                        <button onClick={handleSendMessage} className={`px-8 rounded-2xl font-black ${darkMode ? "bg-white text-black" : "bg-blue-600 text-white"}`}>إرسال</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {view === "notifications" && (
                <div className="space-y-6 animate-in slide-in-from-bottom-5">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-4xl font-black">التنبيهات</h2>
                    {notifications.length > 0 && (
                      <button onClick={() => setNotifications([])} className="text-red-500 font-bold text-sm">مسح الكل</button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-center opacity-50 italic">لا توجد تنبيهات جديدة</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className={`p-8 rounded-[2rem] border-4 flex justify-between items-center ${darkMode ? "bg-black border-white" : "bg-white border-slate-100 shadow-lg"}`}>
                        <p className="text-lg font-bold">{n.text}</p>
                        {/* تفعيل زر القبول هنا */}
                        <button onClick={() => handleAcceptRequest(n.id)} className={`px-6 py-2 rounded-xl text-sm font-black ${darkMode ? "bg-white text-black" : "bg-blue-600 text-white"}`}>قبول</button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {view === "profile" && (
                <div className="animate-in fade-in">
                  <div className={`rounded-[3rem] overflow-hidden border-4 relative ${darkMode ? "border-white" : "border-slate-100 shadow-2xl"}`}>
                    <div className="h-48 relative group">
                      <img src={userData.coverImage} className="w-full h-full object-cover" alt="cover" />
                      {isEditingProfile && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => coverImageInput.current?.click()}>
                          <span className="text-white font-bold">تغيير الغلاف 📷</span>
                        </div>
                      )}
                      <input type="file" ref={coverImageInput} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                    </div>

                    <div className={`p-10 relative ${darkMode ? "bg-black" : "bg-white"}`}>
                      <div className={`w-32 h-32 rounded-3xl absolute -top-16 right-10 border-4 overflow-hidden group ${darkMode ? "bg-black border-white" : "bg-white border-white shadow-xl"}`}>
                        {userData.profileImage ? (
                          <img src={userData.profileImage} className="w-full h-full object-cover" alt="profile" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-4xl font-black ${darkMode ? "text-white" : "text-blue-600"}`}>{userData.name[0]}</div>
                        )}
                        {isEditingProfile && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => profileImageInput.current?.click()}>
                            <span className="text-[10px] text-white font-bold">تغيير 📷</span>
                          </div>
                        )}
                        <input type="file" ref={profileImageInput} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'profile')} />
                      </div>

                      <div className="mt-16 text-right">
                        {isEditingProfile ? (
                          <div className="space-y-4">
                            <input type="text" className={`w-full p-2 border-2 rounded-lg ${darkMode ? 'bg-zinc-900 border-white' : 'border-slate-200'}`} value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
                            <textarea className={`w-full p-2 border-2 rounded-lg ${darkMode ? 'bg-zinc-900 border-white' : 'border-slate-200'}`} value={userData.bio} onChange={(e) => setUserData({...userData, bio: e.target.value})} />
                            <button onClick={() => setIsEditingProfile(false)} className={`w-full py-3 rounded-xl font-black ${darkMode ? "bg-white text-black" : "bg-blue-600 text-white"}`}>حفظ التغييرات</button>
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
            </>
          )}
        </main>
        
        {step === 4 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50">
            <div className={`flex justify-around items-center p-4 rounded-full border-4 shadow-2xl backdrop-blur-md ${darkMode ? "bg-black/80 border-white" : "bg-white/90 border-slate-200"}`}>
              <button onClick={() => {setView("home"); setActiveChat(null);}} className={`p-3 rounded-full transition-all ${view === "home" ? (darkMode ? "bg-white" : "bg-blue-100") : ""}`}><HomeLogo active={view === "home"} darkMode={darkMode} /></button>
              <button onClick={() => setView("chat")} className={`p-3 rounded-full transition-all ${view === "chat" ? (darkMode ? "bg-white" : "bg-blue-100") : ""}`}><ChatLogo active={view === "chat"} darkMode={darkMode} /></button>
              <button onClick={() => {setView("notifications"); setActiveChat(null);}} className={`p-3 rounded-full transition-all ${view === "notifications" ? (darkMode ? "bg-white" : "bg-blue-100") : ""}`}><NotifLogo active={view === "notifications"} darkMode={darkMode} /></button>
              <button onClick={() => {setView("profile"); setActiveChat(null);}} className={`p-3 rounded-full transition-all ${view === "profile" ? (darkMode ? "bg-white" : "bg-blue-100") : ""}`}><UserLogo active={view === "profile"} darkMode={darkMode} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
