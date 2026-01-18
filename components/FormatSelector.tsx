
import React, { useState } from 'react';
import { Layers, AlertCircle, TrendingUp, Zap, User, UserCheck, ShieldCheck, Star, PenTool, Image as ImageIcon, Copy, Video, PlayCircle, Users, Smile } from 'lucide-react';
import { CreativeFormat, AdIdentity, MediaType, UGCAvatar } from '../types';

interface FormatSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFormats: Set<CreativeFormat>;
  onSelectFormat: (fmt: CreativeFormat) => void;
  onConfirm: (identity: AdIdentity | null, avatar: UGCAvatar | null) => void;
  formatLibrary: Record<MediaType, Record<string, CreativeFormat[]>>;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ isOpen, onClose, selectedFormats, onSelectFormat, onConfirm, formatLibrary }) => {
    const [selectedIdentity, setSelectedIdentity] = useState<AdIdentity | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<UGCAvatar | null>(null);
    const [activeTab, setActiveTab] = useState<MediaType>('IMAGE');
    
    if (!isOpen) return null;
    
    // Helper to get icon for identity
    const getIdentityIcon = (id: AdIdentity) => {
        switch(id) {
            case AdIdentity.AUTHORITY: return <ShieldCheck className="w-4 h-4"/>;
            case AdIdentity.SKEPTIC: return <UserCheck className="w-4 h-4"/>;
            case AdIdentity.INFLUENCER: return <Star className="w-4 h-4"/>;
            case AdIdentity.DIARIST: return <PenTool className="w-4 h-4"/>;
            case AdIdentity.OBSERVER: return <User className="w-4 h-4"/>;
            default: return <User className="w-4 h-4"/>;
        }
    };

    const getIdentityDesc = (id: AdIdentity) => {
        switch(id) {
            case AdIdentity.AUTHORITY: return "High trust. Uses data & facts. 'As a specialist...'";
            case AdIdentity.SKEPTIC: return "High relatability. Overcomes objections. 'I didn't believe it...'";
            case AdIdentity.INFLUENCER: return "High curiosity. Secret sharing. 'Don't walk, RUN.'";
            case AdIdentity.DIARIST: return "High emotion. Vulnerable & raw. 'I'm shaking writing this...'";
            case AdIdentity.OBSERVER: return "Social proof. Third-party analysis. 'Look at her results...'";
            default: return "";
        }
    };

    // Helper for Avatar Icons (Generic for now)
    const getAvatarIcon = (avatar: UGCAvatar) => {
        return <Smile className="w-5 h-5 text-pink-500" />;
    };
    
    const activeFormats = formatLibrary[activeTab] || {};
    
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-8">
              <div className="bg-white w-full max-w-6xl h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                  
                  {/* HEADER */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div>
                          <h2 className="text-xl font-display font-bold text-slate-900">Select Creative Formats</h2>
                          <p className="text-sm text-slate-500">Define the character, choose the medium, generate the asset.</p>
                      </div>
                      <div className="flex gap-3">
                          <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-lg font-bold text-sm">Cancel</button>
                          <button 
                            onClick={() => onConfirm(selectedIdentity, selectedAvatar)} 
                            disabled={selectedFormats.size === 0} 
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                          >
                            <Zap className="w-4 h-4 fill-white" />
                            Generate {selectedFormats.size} Creatives
                          </button>
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto bg-slate-50/50 custom-scrollbar">
                      <div className="p-8 space-y-8">
                          
                          {/* SECTION 1: VOICE / POV SELECTION */}
                          <div>
                              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                  <User className="w-4 h-4" /> Step 1: Who is speaking? (Voice Archetype)
                              </h3>
                              <div className="grid grid-cols-5 gap-4">
                                  {Object.values(AdIdentity).map((identity) => (
                                      <button
                                          key={identity}
                                          onClick={() => setSelectedIdentity(selectedIdentity === identity ? null : identity)}
                                          className={`relative p-3 rounded-xl border text-left transition-all duration-200 flex flex-col gap-2 h-full ${
                                              selectedIdentity === identity 
                                              ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 shadow-md' 
                                              : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                                          }`}
                                      >
                                          {selectedIdentity === identity && (
                                              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500"></div>
                                          )}
                                          <div className={`p-2 rounded-lg w-fit ${selectedIdentity === identity ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                              {getIdentityIcon(identity)}
                                          </div>
                                          <div>
                                              <div className="font-bold text-xs text-slate-900 mb-1 leading-tight">{identity}</div>
                                              <div className="text-[10px] text-slate-500 leading-snug">{getIdentityDesc(identity)}</div>
                                          </div>
                                      </button>
                                  ))}
                              </div>
                          </div>

                          <div className="w-full h-px bg-slate-200"></div>

                          {/* SECTION 2: FORMAT SELECTION (TABBED) */}
                          <div>
                              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                  <Layers className="w-4 h-4" /> Step 2: Choose Media Format
                              </h3>
                              
                              {/* TABS */}
                              <div className="flex gap-4 mb-6">
                                  <button 
                                      onClick={() => setActiveTab('IMAGE')}
                                      className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-all ${activeTab === 'IMAGE' ? 'bg-white border-blue-500 ring-2 ring-blue-100 text-blue-600 shadow-sm' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-slate-200'}`}
                                  >
                                      <ImageIcon className="w-4 h-4" /> Static Ads
                                  </button>
                                  <button 
                                      onClick={() => setActiveTab('CAROUSEL')}
                                      className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-all ${activeTab === 'CAROUSEL' ? 'bg-white border-purple-500 ring-2 ring-purple-100 text-purple-600 shadow-sm' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-slate-200'}`}
                                  >
                                      <Copy className="w-4 h-4" /> Carousel
                                  </button>
                                  <button 
                                      onClick={() => setActiveTab('VIDEO')}
                                      className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-all ${activeTab === 'VIDEO' ? 'bg-white border-pink-500 ring-2 ring-pink-100 text-pink-600 shadow-sm' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-slate-200'}`}
                                  >
                                      <PlayCircle className="w-4 h-4" /> Video / VSL
                                  </button>
                              </div>

                              {/* FORMAT GRID */}
                              <div className="grid grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 duration-300">
                                  {Object.entries(activeFormats).map(([group, formats]) => {
                                      let headerStyle = "text-slate-500";
                                      let bgStyle = "bg-white";
                                      let borderStyle = "border-slate-200";
                                      let icon = <Layers className="w-4 h-4"/>;
                                      let desc = "";

                                      if (activeTab === 'IMAGE') {
                                          if (group.includes("🔵")) { 
                                              headerStyle = "text-blue-600"; bgStyle = "bg-blue-50/30"; borderStyle = "border-blue-100"; icon = <Zap className="w-4 h-4"/>; desc = "Target 60% Unaware. Stop scroll.";
                                          } else if (group.includes("🟠")) { 
                                              headerStyle = "text-orange-600"; bgStyle = "bg-orange-50/30"; borderStyle = "border-orange-100"; icon = <AlertCircle className="w-4 h-4"/>; desc = "Target 20% Problem Aware. Educate.";
                                          } else if (group.includes("🔴")) { 
                                              headerStyle = "text-red-600"; bgStyle = "bg-red-50/30"; borderStyle = "border-red-100"; icon = <TrendingUp className="w-4 h-4"/>; desc = "Target 3% Ready to Buy. Hard Offer.";
                                          }
                                      } else if (activeTab === 'CAROUSEL') {
                                           headerStyle = "text-purple-600"; bgStyle = "bg-purple-50/30"; borderStyle = "border-purple-100"; icon = <Copy className="w-4 h-4"/>;
                                      } else if (activeTab === 'VIDEO') {
                                           headerStyle = "text-pink-600"; bgStyle = "bg-pink-50/30"; borderStyle = "border-pink-100"; icon = <Video className="w-4 h-4"/>;
                                      }

                                      return (
                                          <div key={group} className="space-y-3">
                                              <div className={`flex items-center gap-2 p-2 rounded-lg ${bgStyle} ${borderStyle} border`}>
                                                  <div className={`${headerStyle}`}>{icon}</div>
                                                  <div>
                                                      <h4 className={`text-xs font-bold uppercase ${headerStyle}`}>{group}</h4>
                                                      {desc && <p className="text-[10px] text-slate-500 leading-none mt-0.5">{desc}</p>}
                                                  </div>
                                              </div>
                                              <div className="space-y-2">
                                                  {formats.map(fmt => (
                                                      <button 
                                                          key={fmt}
                                                          onClick={() => onSelectFormat(fmt)}
                                                          className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center justify-between ${selectedFormats.has(fmt) ? 'bg-slate-900 border-slate-900 text-white shadow-md transform scale-[1.02]' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50'}`}
                                                      >
                                                          <span>{fmt}</span>
                                                          {selectedFormats.has(fmt) && <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />}
                                                      </button>
                                                  ))}
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                          
                          {/* SECTION 3: UGC AVATAR (VIDEO ONLY) */}
                          {activeTab === 'VIDEO' && (
                              <div className="animate-in slide-in-from-bottom-4 duration-500">
                                  <div className="w-full h-px bg-slate-200 mb-8"></div>
                                  <h3 className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-4 flex items-center gap-2">
                                      <Users className="w-4 h-4" /> Step 3: Select UGC Creator (For Video Storyboard)
                                  </h3>
                                  <p className="text-xs text-slate-500 mb-4 -mt-2">The AI will generate a 9-grid storyboard sequence featuring this character.</p>
                                  
                                  <div className="grid grid-cols-4 gap-4">
                                      {Object.values(UGCAvatar).map((avatar) => (
                                          <button
                                              key={avatar}
                                              onClick={() => setSelectedAvatar(selectedAvatar === avatar ? null : avatar)}
                                              className={`relative p-3 rounded-xl border text-left transition-all duration-200 flex flex-col gap-2 ${
                                                  selectedAvatar === avatar 
                                                  ? 'bg-pink-50 border-pink-500 ring-1 ring-pink-500 shadow-md' 
                                                  : 'bg-white border-slate-200 hover:border-pink-300 hover:shadow-sm'
                                              }`}
                                          >
                                              {selectedAvatar === avatar && (
                                                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500"></div>
                                              )}
                                              <div className={`p-2 rounded-lg w-fit ${selectedAvatar === avatar ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-500'}`}>
                                                  <Smile className="w-5 h-5" />
                                              </div>
                                              <div className="font-bold text-xs text-slate-900 leading-tight">{avatar}</div>
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          )}

                      </div>
                  </div>
              </div>
        </div>
    );
};

export default FormatSelector;
