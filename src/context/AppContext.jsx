import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const AppContext = createContext();

const INITIAL_EVENTS = [
  {
    id: "EVE01",
    name: "Isabella & Alexander Wedding",
    date: "2026-07-06",
    location: "Plaza Hotel, New York",
    password: "plaza",
    status: "Active",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600", category: "Ceremony", tags: ["ceremony", "bride", "groom"], timestamp: "2026-07-06 10:15" },
      { id: "p2", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600", category: "Portrait", tags: ["portrait", "bride"], timestamp: "2026-07-06 10:30" },
      { id: "p3", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600", category: "Ceremony", tags: ["ceremony", "couple"], timestamp: "2026-07-06 10:45" }
    ],
    videos: [
      { id: "v1", title: "Cinematic Vows Teaser", url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-groom-putting-wedding-ring-on-bride-41618-large.mp4", duration: "1:15" }
    ]
  }
];

const INITIAL_EMPLOYEES = [
  { id: "EMP01", name: "Marcus Sterling", role: "Photographer", phone: "+1 (555) 234-5678", email: "marcus@antigravity.studio", salary: "$4,500/mo", joined: "2024-03-12", attendance: true, tasks: "Royal Wedding Ceremony Shoot" },
  { id: "EMP02", name: "Elena Rostova", role: "Photographer", phone: "+1 (555) 876-5432", email: "elena@antigravity.studio", salary: "$4,200/mo", joined: "2024-09-01", attendance: true, tasks: "Eleanor Vance Portrait Shoot" },
  { id: "EMP03", name: "Christian Vance", role: "Videographer", phone: "+1 (555) 345-6789", email: "christian@antigravity.studio", salary: "$5,000/mo", joined: "2023-05-15", attendance: false, tasks: "Cinematography Edit - Isabella Trailer" },
  { id: "EMP04", name: "Sophie Dubois", role: "Editor", phone: "+1 (555) 765-4321", email: "sophie@antigravity.studio", salary: "$3,800/mo", joined: "2025-01-10", attendance: true, tasks: "Color Grading - Golden Hour Batch" }
];

const INITIAL_PORTFOLIO_ITEMS = [
  { id: "port-1", url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600', cat: 'Wedding', title: 'Editorial Romance', description: 'Editorial romance and classical wedding session.', status: 'Published' },
  { id: "port-2", url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600', cat: 'Ceremony', title: 'Golden Hour Vows', description: 'Intimate ceremony portraits in soft golden hour light.', status: 'Published' },
  { id: "port-3", url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600', cat: 'Wedding', title: 'Timeless Connection', description: 'Classic editorial wedding storytelling.', status: 'Published' },
  { id: "port-4", url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600', cat: 'Reception', title: 'Luxury Tablescape', description: 'Sophisticated reception details and elegant dinner table setups.', status: 'Published' },
  { id: "port-5", url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600', cat: 'Family', title: 'Sacred Milestones', description: 'Milestone family celebrations and raw candid portraits.', status: 'Published' },
  { id: "port-6", url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600', cat: 'Reception', title: 'Midnight Waltz', description: 'Vibrant party reception and high-fashion editorial dance coverage.', status: 'Published' }
];

const INITIAL_CMS_CONTENT = {
  hero: {
    title: "Antigravity Studio Live",
    subtitle: "Relive Every Moment Instantly",
    desc: "Luxury wedding and milestone photography meets real-time digital sharing. Access your professional event gallery live as the shutter clicks.",
    bgImage: "/hero_background.png"
  },
  services: {
    tagline: "What We Do",
    heading: "Our Premium Services",
    list: [
      { title: 'Wedding Photography', desc: 'Capturing editorial, luxury imagery of your special day with classical romance.' },
      { title: 'Wedding Cinematography', desc: 'Cinematic storytelling with cinematic lenses, slow motion, and rich colors.' },
      { title: 'Engagement Events', desc: 'Sophisticated portraits capturing your intimate connection prior to the wedding.' },
      { title: 'Baptism Events', desc: 'Elegant capture of sacred milestone family religious celebrations.' },
      { title: 'Corporate Events', desc: 'Premium coverage of conferences, galas, and corporate PR events.' },
      { title: 'Live Event Sharing', desc: 'Real-time uploads and instantaneous QR gallery delivery for your guests.' }
    ]
  },
  philosophy: {
    tagline: "Studio Philosophy",
    heading: "Where Luxury Meets Instant Emotion",
    quote: "We believe photography is not merely a service—it is a meticulous preservation of human connection. We don't just capture how a moment looks; we capture how it feels.",
    paragraph1: "Every shutter click is an act of artistic devotion. By blending high-fashion editorial styling with our proprietary live sharing technology, we ensure your loved ones are part of the celebration, no matter where they are in the world.",
    paragraph2: "We invite you to experience a new standard of event storytelling, where fine-art photography is delivered in the tempo of the modern era.",
    author: "The Antigravity Creative Team",
    location: "New York • Milan • Paris",
    image: "/studio_thoughts.png"
  },
  testimonials: {
    tagline: "Client Praise",
    heading: "Luxury Chronicles",
    list: [
      {
        rating: 5,
        text: "\"We were absolutely stunned that our family members in Europe could view wedding photos as they were being taken! The quality was breathtaking and the real-time sharing worked perfectly. A class apart.\"",
        author: "Charlotte & Michael D.",
        tagline: "Royal Wedding Couple"
      },
      {
        rating: 5,
        text: "\"The Live QR code setup allowed 200+ baptism guests to grab high-res photos instantly on their phones. We didn't have to follow up or send drives. The best investment for our event!\"",
        author: "Sophia Vance",
        tagline: "Milestone Parent"
      }
    ]
  },
  contact: {
    tagline: "Reservations",
    heading: "Begin Your Journey",
    desc: "Reserve our luxury photography team for your upcoming wedding, baptism, gala, or birthday. Let us bring real-time magic to your celebration.",
    phone: "+91 9846032602",
    email: "reservations@antigravity.studio",
    instagram: "_shimil_m.p_",
    vimeo: "https://vimeo.com/user260728000?fl=pp&fe=sh",
    whatsapp: "9846032602",
    pinterest: "#",
    footerText: "Fifth Avenue, New York, NY • © 2026. All luxury rights reserved."
  }
};

const INITIAL_ACTIVITY_LOGS = [
  { id: "log-1", action: "Studio settings initialized", user: "System", timestamp: "2026-06-17 09:00", tag: "System" },
  { id: "log-2", action: "Live Sharing engine synced", user: "System", timestamp: "2026-06-17 09:05", tag: "Live Sharing" }
];

const INITIAL_ADMIN_ACCOUNTS = {
  sm_gaming: { username: 'sm_gaming', name: 'Super Admin', dob: '1990-01-01', avatarStyle: 'Circle', password: 'anna@123', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', role: 'Super Admin' },
  editor: { username: 'editor', name: 'Color Editor', dob: '1992-05-10', avatarStyle: 'Circle', password: 'editor123', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', role: 'Editor' },
  employee: { username: 'employee', name: 'Creative Staff', dob: '1994-08-20', avatarStyle: 'Circle', password: 'employee123', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', role: 'Employee' }
};

export const AppProvider = ({ children }) => {
  // Theme State & System Listener
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('antigravity_theme') || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      const activeTheme = theme === 'system' 
        ? (mediaQuery.matches ? 'dark' : 'light') 
        : theme;
      
      if (activeTheme === 'dark') {
        root.classList.remove('light-theme');
        root.classList.add('dark-theme');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark-theme');
        root.classList.add('light-theme');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();
    localStorage.setItem('antigravity_theme', theme);

    if (theme === 'system') {
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Local state fallbacks (synced with localStorage when Supabase is not connected)
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [employees, setEmployees] = useState([]);
  const [user, setUser] = useState(null);
  const [cmsContent, setCmsContent] = useState(INITIAL_CMS_CONTENT);
  const [portfolioItems, setPortfolioItems] = useState(INITIAL_PORTFOLIO_ITEMS);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [settings, setSettings] = useState({
    studioName: "Antigravity Studio Live",
    email: "info@antigravity.studio",
    phone: "+1 (555) 019-2831",
    address: "123 Fifth Avenue, New York, NY",
    twoFactor: false,
    passwordPolicy: "Strong (Min 8 chars, 1 uppercase, 1 symbol)",
    cloudStorage: "Google Cloud Storage",
    autoBackup: true,
    qrStyle: "Classic Gold (Branded)",
    aiQuality: "Ultra HDR (32-bit)",
    autoEditRules: "Auto-Color & Light Skin Soften"
  });
  const [adminAccounts, setAdminAccounts] = useState(INITIAL_ADMIN_ACCOUNTS);
  const [notifications, setNotifications] = useState([]);
  const [clientRequests, setClientRequests] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch initial data (from Supabase if available, otherwise localStorage)
  useEffect(() => {
    async function initData() {
      if (supabase) {
        try {
          // 1. Fetch Admin Accounts
          const { data: accountsData } = await supabase.from('admin_accounts').select('*');
          if (accountsData && accountsData.length > 0) {
            const accsMap = {};
            accountsData.forEach(acc => {
              accsMap[acc.username] = {
                ...acc,
                avatarStyle: acc.avatar_style
              };
            });
            setAdminAccounts(accsMap);
          }

          // 2. Fetch Events & Media
          const { data: eventsData } = await supabase.from('events').select('*');
          const { data: mediaData } = await supabase.from('event_media').select('*');
          
          if (eventsData) {
            const formattedEvents = eventsData.map(evt => {
              const eventMedia = mediaData ? mediaData.filter(m => m.event_id === evt.id) : [];
              return {
                ...evt,
                clientName: evt.client_name,
                coverImage: evt.cover_image,
                qrCodeUrl: evt.qr_code_url ? evt.qr_code_url
                  .replace(/localhost%3A5173/g, 'sm-studio-delta.vercel.app')
                  .replace(/localhost:5173/g, 'sm-studio-delta.vercel.app')
                  .replace(/127\.0\.0\.1/g, 'sm-studio-delta.vercel.app') : evt.qr_code_url,
                activeClients: evt.active_clients,
                photos: eventMedia.filter(m => m.type === 'photo').map(m => ({
                  id: m.id,
                  url: m.url,
                  category: m.category,
                  likes: m.likes || 0,
                  likedByUser: m.liked_by_user || false,
                  tags: m.tags || [],
                  timestamp: m.timestamp
                })),
                videos: eventMedia.filter(m => m.type === 'video').map(m => ({
                  id: m.id,
                  title: m.title,
                  url: m.url,
                  duration: m.duration,
                  timestamp: m.timestamp
                }))
              };
            });
            setEvents(formattedEvents);
          }

          // 3. Fetch Employees
          const { data: empData } = await supabase.from('employees').select('*');
          if (empData) setEmployees(empData);

          // 4. Fetch Portfolio Items
          const { data: portData } = await supabase.from('portfolio_items').select('*');
          if (portData && portData.length > 0) setPortfolioItems(portData);

          // 5. Fetch CMS Content
          const { data: cmsData } = await supabase.from('cms_content').select('*');
          if (cmsData && cmsData.length > 0) {
            const cmsMap = { ...INITIAL_CMS_CONTENT };
            cmsData.forEach(row => {
              cmsMap[row.key] = row.value;
            });
            setCmsContent(cmsMap);
          }

          // 6. Fetch Settings
          const { data: settingsData } = await supabase.from('settings').select('*');
          if (settingsData && settingsData.length > 0) {
            const systemSettings = settingsData.find(row => row.key === 'system');
            if (systemSettings) setSettings(systemSettings.value);
          }

          // 7. Fetch Activity Logs
          const { data: logsData } = await supabase.from('activity_logs').select('*');
          if (logsData) {
            setActivityLogs(
              logsData.map(log => ({
                id: log.id,
                action: log.action,
                user: log.user,
                timestamp: log.timestamp ? new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 16) : '',
                tag: log.tag
              }))
            );
          }

          // 8. Fetch Client Requests
          const { data: requestsData } = await supabase.from('client_requests').select('*').order('created_at', { ascending: false });
          if (requestsData) setClientRequests(requestsData);

          setDataLoaded(true);
        } catch (err) {
          console.error("Error loading data from Supabase:", err);
          loadLocalFallback();
        }
      } else {
        loadLocalFallback();
      }
    }

    function loadLocalFallback() {
      const savedEvents = localStorage.getItem('antigravity_events');
      if (savedEvents) {
        const parsed = JSON.parse(savedEvents);
        if (parsed && parsed.length > 0) {
          setEvents(parsed);
        } else {
          setEvents(INITIAL_EVENTS);
        }
      } else {
        setEvents(INITIAL_EVENTS);
      }

      const savedEmployees = localStorage.getItem('antigravity_employees');
      if (savedEmployees) setEmployees(JSON.parse(savedEmployees));

      const savedCms = localStorage.getItem('antigravity_cms');
      if (savedCms) setCmsContent(JSON.parse(savedCms));

      const savedPortfolio = localStorage.getItem('antigravity_portfolio');
      if (savedPortfolio) setPortfolioItems(JSON.parse(savedPortfolio));

      const savedLogs = localStorage.getItem('antigravity_logs');
      if (savedLogs) setActivityLogs(JSON.parse(savedLogs));

      const savedSettings = localStorage.getItem('antigravity_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedAdminAccounts = localStorage.getItem('antigravity_admin_accounts');
      if (savedAdminAccounts) {
        try {
          const parsed = JSON.parse(savedAdminAccounts);
          if (!parsed.admin && parsed.sm_gaming) {
            setAdminAccounts(parsed);
          }
        } catch (e) {}
      }
      setDataLoaded(true);
    }

    initData();
  }, []);

  // Sync user login session state locally
  useEffect(() => {
    try {
      const localUserStr = localStorage.getItem('antigravity_current_user');
      if (localUserStr) {
        const parsed = JSON.parse(localUserStr);
        if (parsed && parsed.role !== 'client') {
          // Proactively migrate/remove old admin session from localStorage to sessionStorage
          localStorage.removeItem('antigravity_current_user');
          sessionStorage.setItem('antigravity_current_user', JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.warn("Session migration check failed:", e);
    }
    const savedUser = sessionStorage.getItem('antigravity_current_user') || localStorage.getItem('antigravity_current_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Listen to Google OAuth state change callback from Supabase
  useEffect(() => {
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
          const email = session.user.email;
          const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Google User';
          
          // Check if this email is a registered client
          const matchedEvent = events.find(e => e.email && e.email.toLowerCase() === email.toLowerCase());
          
          const onLoginPage = window.location.pathname === '/client-login';
          const isSignInEvent = event === 'SIGNED_IN';
          
          if (matchedEvent) {
            const clientUser = {
              role: 'client',
              isGuest: false,
              eventId: matchedEvent.id,
              eventName: matchedEvent.name,
              clientName: matchedEvent.clientName,
              email: email
            };
            
            // Check if we are already on the client dashboard page with the correct event id
            const searchParams = new URLSearchParams(window.location.search);
            const currentId = searchParams.get('id') || '';
            const onCorrectDashboard = window.location.pathname === '/client-dashboard' && currentId.toLowerCase() === matchedEvent.id.toLowerCase();
            
            // Get current saved user to see if it matches
            const savedUserStr = localStorage.getItem('antigravity_current_user');
            const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
            const isAlreadyLoggedIn = savedUser && savedUser.email === email && savedUser.eventId === matchedEvent.id;

            // Silently sync user state without loops
            if (!isAlreadyLoggedIn) {
              setUser(clientUser);
              localStorage.setItem('antigravity_current_user', JSON.stringify(clientUser));
            }

            // Only notify and redirect if they are on a login page
            if (onLoginPage) {
              if (!isAlreadyLoggedIn) {
                addNotification("Google Login", `Logged in as client for ${matchedEvent.name}`, "success");
              }
              if (!onCorrectDashboard) {
                setTimeout(() => {
                  window.location.href = window.location.origin + '/';
                }, 500);
              }
            }
          } else {
            // Check if there is a target guest event id in localStorage
            const targetEventId = localStorage.getItem('google_auth_target_event_id');
            if (targetEventId) {
              const matchedEventGuest = events.find(e => e.id.toLowerCase() === targetEventId.toLowerCase());
              
              const guestPayload = {
                name: name,
                email: email,
                eventId: targetEventId,
                authProvider: 'Google'
              };
              
              await registerGuest(guestPayload);
              
              const guestUser = {
                role: 'client',
                isGuest: false,
                eventId: targetEventId,
                eventName: matchedEventGuest?.name || 'Event Gallery',
                clientName: name,
                email: email
              };
              
              setUser(guestUser);
              localStorage.setItem('antigravity_current_user', JSON.stringify(guestUser));
              localStorage.removeItem('google_auth_target_event_id');
              
              const onLoginPage = window.location.pathname === '/client-login';
              
              if (onLoginPage) {
                addNotification("Google Login", `Logged in as guest for ${matchedEventGuest?.name || 'Gallery'}`, "success");
                
                // Only redirect if we are not already on the correct dashboard page with the correct event id
                const searchParams = new URLSearchParams(window.location.search);
                const currentId = searchParams.get('id') || '';
                const onCorrectDashboard = window.location.pathname === '/client-dashboard' && currentId.toLowerCase() === targetEventId.toLowerCase();
                
                if (!onCorrectDashboard) {
                  setTimeout(() => {
                    window.location.href = window.location.origin + '/';
                  }, 500);
                }
              }
            }
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [supabase, events]);

  // Write changes locally as backup
  useEffect(() => {
    try {
      if (events.length > 0) localStorage.setItem('antigravity_events', JSON.stringify(events));
    } catch (e) {
      console.warn("Storage quota exceeded or disabled: failed to save events", e);
    }
  }, [events]);

  useEffect(() => {
    try {
      if (employees.length > 0) localStorage.setItem('antigravity_employees', JSON.stringify(employees));
    } catch (e) {
      console.warn("Storage quota exceeded or disabled: failed to save employees", e);
    }
  }, [employees]);

  useEffect(() => {
    try {
      if (user) {
        if (user.role === 'client') {
          localStorage.setItem('antigravity_current_user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('antigravity_current_user', JSON.stringify(user));
        }
      } else {
        localStorage.removeItem('antigravity_current_user');
        sessionStorage.removeItem('antigravity_current_user');
      }
    } catch (e) {
      console.warn("Storage error: failed to save current user", e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('antigravity_cms', JSON.stringify(cmsContent));
    } catch (e) {
      console.warn("Storage quota exceeded or disabled: failed to save cmsContent", e);
    }
  }, [cmsContent]);

  useEffect(() => {
    try {
      localStorage.setItem('antigravity_portfolio', JSON.stringify(portfolioItems));
    } catch (e) {
      console.warn("Storage quota exceeded or disabled: failed to save portfolioItems", e);
    }
  }, [portfolioItems]);

  useEffect(() => {
    try {
      localStorage.setItem('antigravity_logs', JSON.stringify(activityLogs));
    } catch (e) {
      console.warn("Storage quota exceeded or disabled: failed to save activityLogs", e);
    }
  }, [activityLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('antigravity_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn("Storage quota exceeded or disabled: failed to save settings", e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('antigravity_admin_accounts', JSON.stringify(adminAccounts));
    } catch (e) {
      console.warn("Storage quota exceeded or disabled: failed to save adminAccounts", e);
    }
  }, [adminAccounts]);

  // Push notification helper
  const addNotification = (title, message, type = "info") => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 6000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Simulate real-time uploads (keep logic local, push notifications, and sync mock photo)
  useEffect(() => {
    const activeInterval = setInterval(() => {
      const randomChance = Math.random();
      if (randomChance < 0.25) {
        setEvents(prevEvents => {
          return prevEvents.map(evt => {
            if (evt.id === "ROYAL-2026" && evt.status === "Active") {
              const photoNum = evt.photos.length + 1;
              const categories = ["Bride", "Groom", "Ceremony", "Reception", "Family"];
              const randomCat = categories[Math.floor(Math.random() * categories.length)];
              
              const stockUrls = [
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800"
              ];
              const randomUrl = stockUrls[Math.floor(Math.random() * stockUrls.length)] + `&random=${photoNum}`;
              
              const newPhoto = {
                id: `p_rt_${photoNum}_${Date.now()}`,
                url: randomUrl,
                category: randomCat,
                likes: 0,
                likedByUser: false,
                tags: [randomCat.toLowerCase(), "realtime", "live", "luxury"],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };

              addNotification(
                "New Photo Shared!",
                `A new photo has been uploaded to the "${evt.name}" gallery.`,
                "success"
              );

              // If connected, sync to remote
              if (supabase) {
                supabase.from('event_media').insert([{
                  id: newPhoto.id,
                  event_id: evt.id,
                  url: newPhoto.url,
                  type: 'photo',
                  category: newPhoto.category,
                  likes: 0,
                  liked_by_user: false,
                  tags: newPhoto.tags,
                  timestamp: newPhoto.timestamp
                }]).then(({ error }) => {
                  if (error) console.error("Error inserting real-time upload to Supabase:", error);
                });
              }

              return {
                ...evt,
                photos: [newPhoto, ...evt.photos]
              };
            }
            return evt;
          });
        });
      }
    }, 25000);

    return () => clearInterval(activeInterval);
  }, []);

  // Supabase Real-time Media Synchronizer
  useEffect(() => {
    if (!supabase) return;

    const mediaChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'event_media'
        },
        (payload) => {
          console.log('Real-time event_media insert received:', payload.new);
          const item = payload.new;
          
          setEvents(prev => prev.map(evt => {
            if (evt.id === item.event_id) {
              if (item.type === 'photo') {
                if (evt.photos.some(p => p.id === item.id)) return evt;
                
                const newPhoto = {
                  id: item.id,
                  url: item.url,
                  category: item.category || 'All',
                  likes: item.likes || 0,
                  likedByUser: false,
                  tags: item.tags || [],
                  timestamp: item.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                addNotification(
                  "New Photo Uploaded!",
                  `A new photo was shared live in the "${evt.name}" gallery.`,
                  "success"
                );
                
                return {
                  ...evt,
                  photos: [newPhoto, ...evt.photos]
                };
              } else if (item.type === 'video') {
                if (evt.videos.some(v => v.id === item.id)) return evt;

                const newVideo = {
                  id: item.id,
                  title: item.title || 'Live Video Capture',
                  url: item.url,
                  duration: item.duration || '0:15',
                  timestamp: item.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                addNotification(
                  "New Video Shared!",
                  `A new video clip was added live to "${evt.name}".`,
                  "success"
                );

                return {
                  ...evt,
                  videos: [newVideo, ...evt.videos]
                };
              }
            }
            return evt;
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'event_media'
        },
        (payload) => {
          console.log('Real-time event_media delete received:', payload.old);
          const deletedId = payload.old.id;
          setEvents(prev => prev.map(evt => ({
            ...evt,
            photos: evt.photos.filter(p => p.id !== deletedId),
            videos: evt.videos.filter(v => v.id !== deletedId)
          })));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(mediaChannel);
    };
  }, [supabase]);

  // Client Auth
  // Client Auth
  const loginClient = async (eventId, password) => {
    const cleanId = (eventId || '').trim();
    const cleanPassword = (password || '').trim();

    if (supabase) {
      try {
        const { data: eventData, error } = await supabase
          .from('events')
          .select('*')
          .ilike('id', cleanId)
          .eq('password', cleanPassword);
          
        if (eventData && eventData.length > 0) {
          const dbEvent = eventData[0];
          const clientUser = {
            role: 'client',
            isGuest: false,
            eventId: dbEvent.id,
            eventName: dbEvent.name,
            clientName: dbEvent.client_name,
            email: dbEvent.email
          };
          setUser(clientUser);
          addNotification("Welcome Back", `Successfully accessed the gallery for ${dbEvent.name}`, "info");
          return { success: true, user: clientUser };
        }
        
        // If Supabase is active, fail immediately if not found in DB
        return { success: false, message: "Invalid credentials or Event ID." };
      } catch (err) {
        console.error("Direct Supabase client login check failed, falling back to state:", err);
      }
    }

    const foundEvent = events.find(e => e.id.toLowerCase() === cleanId.toLowerCase());
    if (foundEvent && foundEvent.password.toLowerCase() === cleanPassword.toLowerCase()) {
      const clientUser = {
        role: 'client',
        isGuest: false,
        eventId: foundEvent.id,
        eventName: foundEvent.name,
        clientName: foundEvent.clientName,
        email: foundEvent.email
      };
      setUser(clientUser);
      addNotification("Welcome Back", `Successfully accessed the gallery for ${foundEvent.name}`, "info");
      return { success: true, user: clientUser };
    }
    return { success: false, message: "Invalid credentials or Event ID." };
  };

  const loginClientViaEmail = async (email) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (supabase) {
      try {
        const { data: eventData, error } = await supabase
          .from('events')
          .select('*')
          .ilike('email', cleanEmail);
          
        if (eventData && eventData.length > 0) {
          const dbEvent = eventData[0];
          const clientUser = {
            role: 'client',
            isGuest: false,
            eventId: dbEvent.id,
            eventName: dbEvent.name,
            clientName: dbEvent.client_name,
            email: dbEvent.email
          };
          setUser(clientUser);
          localStorage.setItem('antigravity_current_user', JSON.stringify(clientUser));
          addNotification("Welcome Back", `Successfully accessed the gallery for ${dbEvent.name}`, "info");
          return { success: true, user: clientUser };
        }
        
        return { success: false, message: "This Gmail address is not registered for any active event." };
      } catch (err) {
        console.error("Direct Supabase email login check failed, falling back to state:", err);
      }
    }

    const foundEvent = events.find(e => e.email && e.email.toLowerCase() === cleanEmail);
    if (foundEvent) {
      const clientUser = {
        role: 'client',
        isGuest: false,
        eventId: foundEvent.id,
        eventName: foundEvent.name,
        clientName: foundEvent.clientName,
        email: foundEvent.email
      };
      setUser(clientUser);
      localStorage.setItem('antigravity_current_user', JSON.stringify(clientUser));
      addNotification("Welcome Back", `Successfully accessed the gallery for ${foundEvent.name}`, "info");
      return { success: true, user: clientUser };
    }
    return { success: false, message: "This Gmail address is not registered for any active event." };
  };

  // Client Auth via QR (No Password required)
  const loginClientViaQr = async (eventId) => {
    const cleanId = (eventId || '').trim();

    if (supabase) {
      try {
        const { data: eventData, error } = await supabase
          .from('events')
          .select('*')
          .ilike('id', cleanId);
          
        if (eventData && eventData.length > 0) {
          const dbEvent = eventData[0];
          const clientUser = {
            role: 'client',
            isGuest: true,
            eventId: dbEvent.id,
            eventName: dbEvent.name,
            clientName: dbEvent.client_name,
            email: dbEvent.email
          };
          setUser(clientUser);
          addNotification("Welcome Back", `Successfully accessed the gallery for ${dbEvent.name}`, "info");
          return { success: true, user: clientUser };
        }
      } catch (err) {
        console.error("Direct Supabase QR login failed, falling back to state:", err);
      }
    }

    const foundEvent = events.find(e => e.id.toLowerCase() === cleanId.toLowerCase());
    if (foundEvent) {
      const clientUser = {
        role: 'client',
        isGuest: true,
        eventId: foundEvent.id,
        eventName: foundEvent.name,
        clientName: foundEvent.clientName,
        email: foundEvent.email
      };
      setUser(clientUser);
      addNotification("Welcome Back", `Successfully accessed the gallery for ${foundEvent.name}`, "info");
      return { success: true, user: clientUser };
    }
    return { success: false, message: "Invalid Event ID." };
  };

  const loginWithGoogleReal = async (eventId = '') => {
    if (supabase) {
      if (eventId) {
        localStorage.setItem('google_auth_target_event_id', eventId);
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/client-login',
          queryParams: {
            prompt: 'select_account'
          }
        }
      });
      
      if (error) {
        throw error;
      }
      return data;
    } else {
      throw new Error("Supabase is not connected.");
    }
  };

  // Register and persist guest credentials
  const registerGuest = async (guestData) => {
    const newGuest = {
      name: guestData.name || 'Anonymous Guest',
      email: guestData.email || null,
      phone_number: guestData.phoneNumber || null,
      auth_provider: guestData.authProvider || 'Google',
      event_id: guestData.eventId || null
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('guest_logins')
          .insert([newGuest])
          .select();
          
        if (error) {
          console.warn("Could not write guest to database (SQL table may not be created yet):", error.message);
        } else {
          console.log("Guest successfully registered in Supabase:", data);
        }
      } catch (err) {
        console.error("Direct Supabase guest registration exception:", err);
      }
    }

    // Fallback/Local persistence for robust offline/sandbox operation
    const storedGuests = JSON.parse(localStorage.getItem('antigravity_guests') || '[]');
    storedGuests.push({
      ...newGuest,
      id: `GST-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('antigravity_guests', JSON.stringify(storedGuests));

    return newGuest;
  };



  // Admin Auth
  const loginAdmin = async (username, password, role) => {
    const lowerUser = username.toLowerCase();
    
    if (supabase) {
      try {
        // Query admin_accounts matching both username and password directly in Supabase
        const { data: accountData, error: accountError } = await supabase
          .from('admin_accounts')
          .select('*')
          .ilike('username', lowerUser)
          .eq('password', password);
          
        if (accountData && accountData.length > 0) {
          const dbAccount = accountData[0];
          
          // Verify selected role matches the database role
          if (dbAccount.role !== role) {
            return { success: false, message: `Access Denied: Your account role does not match "${role}".` };
          }

          const adminUser = {
            role: dbAccount.role, // Strictly use the database role
            username: dbAccount.name || dbAccount.username,
            loginUsername: dbAccount.username,
            avatar: dbAccount.avatar,
            avatarStyle: dbAccount.avatar_style || 'Circle',
            dob: dbAccount.dob || '',
            password: dbAccount.password
          };
          setUser(adminUser);
          addNotification("Dashboard Access", `Logged in as ${adminUser.role}`, "info");
          return { success: true, user: adminUser };
        }
        
        // Query employees table directly in real-time
        let empQuery = supabase.from('employees').select('*');
        if (lowerUser.includes(' ')) {
          empQuery = empQuery.ilike('name', lowerUser);
        } else {
          empQuery = empQuery.or(`id.ilike.${lowerUser},name.ilike.${lowerUser}`);
        }
        const { data: empData, error: empError } = await empQuery;
          
        if (empData && empData.length > 0) {
          const dbEmp = empData[0];
          const matchPassword = dbEmp.password 
            ? (dbEmp.password === password) 
            : (password.toLowerCase() === `${dbEmp.id.toLowerCase()}123`);
            
          if (matchPassword) {
            let resolvedRole = "Employee";
            if (dbEmp.role === "Admin" || dbEmp.role === "Super Admin") {
              resolvedRole = "Super Admin";
            } else if (dbEmp.role === "Editor") {
              resolvedRole = "Editor";
            } else {
              resolvedRole = "Employee";
            }
            
            // Verify selected role matches resolved database role
            if (resolvedRole !== role) {
              return { success: false, message: `Access Denied: Your account role does not match "${role}".` };
            }

            const adminUser = {
              role: resolvedRole, // Strictly use the resolved database role
              username: dbEmp.name,
              loginUsername: dbEmp.id,
              avatar: dbEmp.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
              avatarStyle: dbEmp.avatarStyle || 'Circle',
              dob: dbEmp.dob || '',
              password: dbEmp.password || dbEmp.id.toLowerCase() + "123"
            };
            setUser(adminUser);
            addNotification("Dashboard Access", `Logged in as ${adminUser.role} (${dbEmp.name})`, "info");
            return { success: true, user: adminUser };
          }
        }

        // If Supabase is active, fail immediately if not found in DB
        return { success: false, message: "Invalid credentials." };
      } catch (err) {
        console.error("Direct Supabase admin login check failed, falling back to state:", err);
      }
    }

    // Local fallback check (only run if Supabase is offline)
    const accountKey = Object.keys(adminAccounts).find(
      key => key.toLowerCase() === lowerUser || adminAccounts[key].username.toLowerCase() === lowerUser
    );
    const account = accountKey ? adminAccounts[accountKey] : null;
    
    if (account && password === account.password) {
      if (account.role !== role) {
        return { success: false, message: `Access Denied: Your account role does not match "${role}".` };
      }

      const adminUser = {
        role: account.role, // Strictly use the local mock account role
        username: account.name || account.username,
        loginUsername: account.username,
        avatar: account.avatar,
        avatarStyle: account.avatarStyle || 'Circle',
        dob: account.dob || '',
        password: account.password
      };
      setUser(adminUser);
      addNotification("Dashboard Access", `Logged in as ${adminUser.role}`, "info");
      return { success: true, user: adminUser };
    }

    const foundEmp = employees.find(emp => emp.id.toLowerCase() === lowerUser || emp.name.toLowerCase() === lowerUser);
    if (foundEmp) {
      const matchPassword = foundEmp.password 
        ? (foundEmp.password === password) 
        : (password.toLowerCase() === `${foundEmp.id.toLowerCase()}123`);

      if (matchPassword) {
        let resolvedRole = "Employee";
        if (foundEmp.role === "Admin" || foundEmp.role === "Super Admin") {
          resolvedRole = "Super Admin";
        } else if (foundEmp.role === "Editor") {
          resolvedRole = "Editor";
        } else {
          resolvedRole = "Employee";
        }

        if (resolvedRole !== role) {
          return { success: false, message: `Access Denied: Your account role does not match "${role}".` };
        }

        const adminUser = {
          role: resolvedRole, // Strictly use resolved mock employee role
          username: foundEmp.name,
          loginUsername: foundEmp.id,
          avatar: foundEmp.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
          avatarStyle: foundEmp.avatarStyle || 'Circle',
          dob: foundEmp.dob || '',
          password: foundEmp.password || foundEmp.id.toLowerCase() + "123"
        };
        setUser(adminUser);
        addNotification("Dashboard Access", `Logged in as ${adminUser.role} (${foundEmp.name})`, "info");
        return { success: true, user: adminUser };
      }
    }

    return { success: false, message: "Invalid credentials." };
  };

  const logout = () => {
    setUser(null);
    addNotification("Logged Out", "You have successfully signed out.", "info");
  };

  const updateUserProfile = async (newUsername, newAvatar, newDob, newAvatarStyle, newPassword, newLoginUsername) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      username: newUsername,
      avatar: newAvatar,
      dob: newDob || user.dob || '',
      avatarStyle: newAvatarStyle || user.avatarStyle || 'Circle',
      password: newPassword || user.password || '',
      loginUsername: newLoginUsername || user.loginUsername || ''
    };
    setUser(updatedUser);

    const originalLoginKey = user.loginUsername.toLowerCase();

    // 1. Sync local memory
    const foundKey = Object.keys(adminAccounts).find(
      key => key.toLowerCase() === originalLoginKey || adminAccounts[key].username.toLowerCase() === originalLoginKey
    );
    if (foundKey) {
      setAdminAccounts(prev => {
        const next = { ...prev };
        const updatedAccount = {
          ...next[foundKey],
          username: newLoginUsername || next[foundKey].username,
          name: newUsername,
          avatar: newAvatar,
          dob: newDob || next[foundKey].dob || '',
          avatarStyle: newAvatarStyle || next[foundKey].avatarStyle || 'Circle',
          password: newPassword || next[foundKey].password || ''
        };
        const newKey = (newLoginUsername || next[foundKey].username).toLowerCase();
        if (newKey !== foundKey) delete next[foundKey];
        next[newKey] = updatedAccount;
        return next;
      });
    }

    setEmployees(prev => prev.map(emp => {
      if (emp.id.toLowerCase() === originalLoginKey || emp.name.toLowerCase() === user.username.toLowerCase()) {
        return {
          ...emp,
          id: newLoginUsername || emp.id,
          name: newUsername,
          dob: newDob || emp.dob || '',
          avatar: newAvatar,
          password: newPassword || emp.password || emp.id.toLowerCase() + "123"
        };
      }
      return emp;
    }));

    // 2. Sync to Supabase
    if (supabase) {
      try {
        if (foundKey) {
          await supabase.from('admin_accounts')
            .update({
              username: newLoginUsername || user.loginUsername,
              name: newUsername,
              avatar: newAvatar,
              dob: newDob || null,
              avatar_style: newAvatarStyle,
              password: newPassword
            })
            .eq('username', originalLoginKey);
        } else {
          await supabase.from('employees')
            .update({
              id: newLoginUsername || user.loginUsername,
              name: newUsername,
              avatar: newAvatar,
              password: newPassword
            })
            .eq('id', originalLoginKey);
        }
      } catch (err) {
        console.error("Failed to sync profile update to Supabase:", err);
      }
    }

    addNotification("Profile Updated", "Your profile details have been saved.", "success");
    addActivityLog(`Updated profile details for ${newUsername}`, "Employee", newUsername);
  };

  // Event Management CRUD
  const addEvent = async (eventData) => {
    const eventId = eventData.eventId || `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEvent = {
      id: eventId,
      name: eventData.name,
      clientName: eventData.clientName,
      email: eventData.email,
      phone: eventData.phone || '',
      password: eventData.password || Math.random().toString(36).substring(2, 8),
      type: eventData.type,
      date: eventData.date,
      venue: eventData.venue || '',
      coverImage: eventData.coverImage || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encodeURIComponent(
        ((window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1'))
          ? 'https://sm-studio-delta.vercel.app'
          : window.location.origin) + "/client-dashboard?id=" + eventId + "&qr=true"
      ),
      photographer: eventData.photographer || "Unassigned",
      activeClients: 0,
      status: eventData.status || "Upcoming",
      photos: [],
      videos: []
    };

    setEvents(prev => [...prev, newEvent]);

    if (supabase) {
      try {
        const { error } = await supabase.from('events').insert([{
          id: newEvent.id,
          name: newEvent.name,
          client_name: newEvent.clientName,
          email: newEvent.email,
          phone: newEvent.phone,
          password: newEvent.password,
          type: newEvent.type,
          date: newEvent.date,
          venue: newEvent.venue,
          cover_image: newEvent.coverImage,
          qr_code_url: newEvent.qrCodeUrl,
          photographer: newEvent.photographer,
          active_clients: newEvent.activeClients,
          status: newEvent.status
        }]);
        if (error) throw error;

        // Auto-provision the shared storage bucket for event media.
        // This runs after every new event creation; it's a no-op if the
        // bucket already exists, so it's safe to call repeatedly.
        try {
          const { data: buckets } = await supabase.storage.listBuckets();
          const bucketExists = (buckets || []).some(b => b.name === 'event-media');
          if (!bucketExists) {
            await supabase.storage.createBucket('event-media', { public: true });
          }
        } catch (bucketErr) {
          // Anon key may lack storage-admin rights; the upload step will
          // surface the real error if the bucket is truly missing.
          console.warn("Could not auto-create storage bucket:", bucketErr);
        }
      } catch (err) {
        console.error("Failed to insert event to Supabase:", err);
      }
    }

    addNotification("Event Created", `Event "${newEvent.name}" has been successfully added.`, "success");
    return newEvent;
  };

  const updateEvent = async (id, updatedData) => {
    setEvents(prev => prev.map(evt => evt.id === id ? { ...evt, ...updatedData } : evt));

    if (supabase) {
      try {
        const dbPayload = {};
        if (updatedData.name !== undefined) dbPayload.name = updatedData.name;
        if (updatedData.clientName !== undefined) dbPayload.client_name = updatedData.clientName;
        if (updatedData.email !== undefined) dbPayload.email = updatedData.email;
        if (updatedData.phone !== undefined) dbPayload.phone = updatedData.phone;
        if (updatedData.password !== undefined) dbPayload.password = updatedData.password;
        if (updatedData.type !== undefined) dbPayload.type = updatedData.type;
        if (updatedData.date !== undefined) dbPayload.date = updatedData.date;
        if (updatedData.venue !== undefined) dbPayload.venue = updatedData.venue;
        if (updatedData.coverImage !== undefined) dbPayload.cover_image = updatedData.coverImage;
        if (updatedData.photographer !== undefined) dbPayload.photographer = updatedData.photographer;
        if (updatedData.status !== undefined) dbPayload.status = updatedData.status;

        const { error } = await supabase.from('events').update(dbPayload).eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error("Failed to update event in Supabase:", err);
      }
    }

    addNotification("Event Updated", "Event changes saved successfully.", "success");
  };

  const deleteEvent = async (id) => {
    setEvents(prev => prev.filter(evt => evt.id !== id));

    if (supabase) {
      try {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error("Failed to delete event from Supabase:", err);
      }
    }

    addNotification("Event Deleted", "The event has been permanently removed.", "warning");
  };

  const addPhotosToEvent = async (id, newPhotoUrls, category = "Ceremony") => {
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newPhotos = newPhotoUrls.map((url, idx) => ({
      id: `p_uploaded_${Date.now()}_${idx}`,
      url: url,
      category: category,
      likes: 0,
      likedByUser: false,
      tags: [category.toLowerCase(), "uploaded", "luxury"],
      timestamp: timestampStr
    }));

    setEvents(prev => prev.map(evt => {
      if (evt.id === id) {
        return {
          ...evt,
          photos: [...newPhotos, ...evt.photos]
        };
      }
      return evt;
    }));

    if (supabase) {
      try {
        const payload = newPhotos.map(p => ({
          id: p.id,
          event_id: id,
          url: p.url,
          type: 'photo',
          category: p.category,
          likes: p.likes,
          liked_by_user: p.likedByUser,
          tags: p.tags,
          timestamp: p.timestamp
        }));
        const { error } = await supabase.from('event_media').insert(payload);
        if (error) throw error;
      } catch (err) {
        console.error("Failed to insert photo media to Supabase:", err);
      }
    }

    addNotification("Photos Uploaded", `Added ${newPhotoUrls.length} photos to the gallery.`, "success");
  };

  const addVideoToEvent = async (id, videoTitle, videoUrl, duration = "2:00") => {
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newVideo = {
      id: `v_uploaded_${Date.now()}`,
      title: videoTitle,
      url: videoUrl,
      duration: duration,
      timestamp: timestampStr
    };

    setEvents(prev => prev.map(evt => {
      if (evt.id === id) {
        return {
          ...evt,
          videos: [...evt.videos, newVideo]
        };
      }
      return evt;
    }));

    if (supabase) {
      try {
        const { error } = await supabase.from('event_media').insert([{
          id: newVideo.id,
          event_id: id,
          url: newVideo.url,
          type: 'video',
          title: newVideo.title,
          duration: newVideo.duration,
          timestamp: newVideo.timestamp
        }]);
        if (error) throw error;
      } catch (err) {
        console.error("Failed to insert video media to Supabase:", err);
      }
    }

    addNotification("Video Uploaded", `Added video "${videoTitle}" to the gallery.`, "success");
  };

  const deleteMediaFromEvent = async (eventId, mediaId, mediaType = 'photo') => {
    const idsToDelete = Array.isArray(mediaId) ? mediaId : [mediaId];

    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        if (mediaType === 'photo') {
          return {
            ...evt,
            photos: evt.photos.filter(p => !idsToDelete.includes(p.id))
          };
        } else {
          return {
            ...evt,
            videos: evt.videos.filter(v => !idsToDelete.includes(v.id))
          };
        }
      }
      return evt;
    }));

    if (supabase) {
      try {
        const { error } = await supabase.from('event_media').delete().in('id', idsToDelete);
        if (error) throw error;
      } catch (err) {
        console.error("Failed to delete media from Supabase:", err);
      }
    }

    addNotification("Media Deleted", "Successfully removed items from event gallery.", "warning");
  };

  const toggleLikePhoto = async (eventId, photoId) => {
    let finalLiked = false;
    let finalLikes = 0;

    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          photos: evt.photos.map(p => {
            if (p.id === photoId) {
              finalLiked = !p.likedByUser;
              finalLikes = p.likedByUser ? p.likes - 1 : p.likes + 1;
              return {
                ...p,
                likes: finalLikes,
                likedByUser: finalLiked
              };
            }
            return p;
          })
        };
      }
      return evt;
    }));

    if (supabase) {
      try {
        await supabase.from('event_media')
          .update({ likes: finalLikes, liked_by_user: finalLiked })
          .eq('id', photoId);
      } catch (err) {
        console.error("Failed to update photo like in Supabase:", err);
      }
    }
  };

  const addActivityLog = async (action, tag = "CMS", userName = null) => {
    const activeUser = userName || (user ? user.username : "Admin");
    const timestampObj = new Date();
    const timestampStr = timestampObj.toISOString().replace('T', ' ').substring(0, 16);
    const newLog = {
      id: `log-${Date.now()}`,
      action,
      user: activeUser,
      timestamp: timestampStr,
      tag
    };

    setActivityLogs(prev => [newLog, ...prev]);

    if (supabase) {
      try {
        await supabase.from('activity_logs').insert([{
          id: newLog.id,
          action: newLog.action,
          user: newLog.user,
          tag: newLog.tag,
          timestamp: timestampObj.toISOString()
        }]);
      } catch (err) {
        console.error("Failed to insert activity log to Supabase:", err);
      }
    }
  };

  const updateCmsContent = async (section, updatedData) => {
    let fullSection = {};
    setCmsContent(prev => {
      fullSection = {
        ...prev[section],
        ...updatedData
      };
      return {
        ...prev,
        [section]: fullSection
      };
    });

    if (supabase) {
      try {
        await supabase.from('cms_content')
          .upsert({ key: section, value: fullSection }, { onConflict: 'key' });
      } catch (err) {
        console.error("Failed to update CMS content in Supabase:", err);
      }
    }

    addActivityLog(`Updated homepage ${section} section content`, "CMS Content");
  };

  const addPortfolioItem = async (itemData) => {
    const newItem = {
      id: `port-${Date.now()}`,
      url: itemData.url || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600",
      cat: itemData.cat || "Wedding",
      title: itemData.title || "New Masterpiece",
      description: itemData.description || "Captured by Antigravity Studio.",
      status: itemData.status || "Published"
    };

    setPortfolioItems(prev => [newItem, ...prev]);

    if (supabase) {
      try {
        await supabase.from('portfolio_items').insert([newItem]);
      } catch (err) {
        console.error("Failed to add portfolio item in Supabase:", err);
      }
    }

    addActivityLog(`Added portfolio project "${newItem.title}"`, "Portfolio");
    return newItem;
  };

  const updatePortfolioItem = async (id, updatedData) => {
    setPortfolioItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedData } : item));
    const item = portfolioItems.find(i => i.id === id);
    const titleVal = updatedData.title || item?.title || id;

    if (supabase) {
      try {
        await supabase.from('portfolio_items').update(updatedData).eq('id', id);
      } catch (err) {
        console.error("Failed to update portfolio item in Supabase:", err);
      }
    }

    addActivityLog(`Updated portfolio project "${titleVal}"`, "Portfolio");
  };

  const deletePortfolioItem = async (id) => {
    const item = portfolioItems.find(i => i.id === id);
    setPortfolioItems(prev => prev.filter(item => item.id !== id));

    if (supabase) {
      try {
        await supabase.from('portfolio_items').delete().eq('id', id);
      } catch (err) {
        console.error("Failed to delete portfolio item in Supabase:", err);
      }
    }

    addActivityLog(`Deleted portfolio project "${item?.title || id}"`, "Portfolio");
  };

  const reorderPortfolioItems = (startIndex, endIndex) => {
    setPortfolioItems(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
    addActivityLog("Reordered signature showcase portfolio list", "Portfolio");
  };

  const addEmployee = async (empData) => {
    const newEmp = {
      id: empData.id || `EMP${Math.floor(10 + Math.random() * 90)}`,
      name: empData.name,
      role: empData.role,
      phone: empData.phone || '',
      email: empData.email,
      salary: empData.salary || "$3,000/mo",
      joined: empData.joined || new Date().toISOString().split('T')[0],
      attendance: true,
      tasks: empData.tasks || "Unassigned",
      password: empData.password || Math.random().toString(36).substring(2, 8)
    };

    setEmployees(prev => [...prev, newEmp]);

    if (supabase) {
      try {
        await supabase.from('employees').insert([newEmp]);
      } catch (err) {
        console.error("Failed to add employee to Supabase:", err);
      }
    }

    addNotification("Staff Added", `${newEmp.name} is now registered in the studio system.`, "success");
  };

  const updateEmployeeAttendance = async (id, attended) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, attendance: attended } : emp));

    if (supabase) {
      try {
        await supabase.from('employees').update({ attendance: attended }).eq('id', id);
      } catch (err) {
        console.error("Failed to update employee attendance in Supabase:", err);
      }
    }
  };

  const assignEmployeeTask = async (id, task) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, tasks: task } : emp));

    if (supabase) {
      try {
        await supabase.from('employees').update({ tasks: task }).eq('id', id);
      } catch (err) {
        console.error("Failed to assign employee task in Supabase:", err);
      }
    }

    addNotification("Task Assigned", "Staff work schedule updated.", "success");
  };

  const deleteEmployee = async (id) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(emp => emp.id !== id));

    if (supabase) {
      try {
        await supabase.from('employees').delete().eq('id', id);
      } catch (err) {
        console.error("Failed to delete employee from Supabase:", err);
      }
    }

    addNotification("Staff Removed", `${emp?.name || 'Employee'} has been removed from the registry.`, "warning");
  };

  const updateEmployee = async (id, updatedData) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updatedData } : emp));

    if (supabase) {
      try {
        await supabase.from('employees').update(updatedData).eq('id', id);
      } catch (err) {
        console.error("Failed to update employee in Supabase:", err);
      }
    }

    addNotification("Staff Updated", "Employee profile changes saved.", "success");
  };

  const updateSettings = async (newSettings) => {
    setSettings(newSettings);

    if (supabase) {
      try {
        await supabase.from('settings')
          .upsert({ key: 'system', value: newSettings }, { onConflict: 'key' });
      } catch (err) {
        console.error("Failed to save settings to Supabase:", err);
      }
    }

    addNotification("Settings Saved", "System configuration details updated successfully.", "success");
  };

  const fetchClientRequests = async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('client_requests')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setClientRequests(data || []);
      } catch (err) {
        console.error("Error fetching client requests:", err);
      }
    }
  };

  const submitClientRequest = async (requestPayload) => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('client_requests')
          .insert([requestPayload])
          .select();
        
        if (error) throw error;
        
        await fetchClientRequests();
        return { success: true, data: data[0] };
      } catch (err) {
        console.error("Error submitting client request:", err);
        return { success: false, message: err.message };
      }
    } else {
      const newReq = {
        id: Math.floor(Math.random() * 100000),
        ...requestPayload,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      setClientRequests(prev => [newReq, ...prev]);
      return { success: true, data: newReq };
    }
  };

  const approveClientRequest = async (requestId, email, eventId) => {
    if (supabase) {
      try {
        const { error: requestErr } = await supabase
          .from('client_requests')
          .update({ status: 'approved' })
          .eq('id', requestId);
        if (requestErr) throw requestErr;

        const { error: eventErr } = await supabase
          .from('events')
          .update({ email: email })
          .eq('id', eventId);
        if (eventErr) throw eventErr;

        const { data: eventsData } = await supabase.from('events').select('*');
        const { data: mediaData } = await supabase.from('event_media').select('*');
        if (eventsData) {
          const formattedEvents = eventsData.map(evt => {
            const eventMedia = mediaData ? mediaData.filter(m => m.event_id === evt.id) : [];
            return {
              ...evt,
              clientName: evt.client_name,
              coverImage: evt.cover_image,
              qrCodeUrl: evt.qr_code_url ? evt.qr_code_url
                .replace(/localhost%3A5173/g, 'sm-studio-delta.vercel.app')
                .replace(/localhost:5173/g, 'sm-studio-delta.vercel.app')
                .replace(/127\.0\.0\.1/g, 'sm-studio-delta.vercel.app') : evt.qr_code_url,
              activeClients: evt.active_clients,
              photos: eventMedia.filter(m => m.type === 'photo').map(m => ({
                id: m.id,
                url: m.url,
                category: m.category,
                likes: m.likes || 0,
                likedByUser: m.liked_by_user || false,
                tags: m.tags || [],
                timestamp: m.timestamp
              })),
              videos: eventMedia.filter(m => m.type === 'video').map(m => ({
                id: m.id,
                title: m.title,
                url: m.url,
                duration: m.duration || '0:00',
                likes: m.likes || 0,
                likedByUser: m.liked_by_user || false,
                tags: m.tags || [],
                timestamp: m.timestamp
              }))
            };
          });
          setEvents(formattedEvents);
        }

        await fetchClientRequests();
        addNotification("Request Approved", `Guest ${email} is now the Client for event ${eventId}`, "success");
        return { success: true };
      } catch (err) {
        console.error("Error approving client request:", err);
        return { success: false, message: err.message };
      }
    } else {
      setClientRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, email: email } : e));
      addNotification("Request Approved (Local)", `Guest ${email} is now the Client for event ${eventId}`, "success");
      return { success: true };
    }
  };

  const rejectClientRequest = async (requestId) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('client_requests')
          .update({ status: 'rejected' })
          .eq('id', requestId);
        if (error) throw error;
        await fetchClientRequests();
        addNotification("Request Rejected", "The client access request was rejected.", "warning");
        return { success: true };
      } catch (err) {
        console.error("Error rejecting client request:", err);
        return { success: false, message: err.message };
      }
    } else {
      setClientRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
      addNotification("Request Rejected (Local)", "The client access request was rejected.", "warning");
      return { success: true };
    }
  };

  return (
    <AppContext.Provider value={{
      events,
      employees,
      user,
      dataLoaded,
      settings,
      notifications,
      loginClient,
      loginClientViaEmail,
      loginWithGoogleReal,
      loginClientViaQr,
      registerGuest,
      loginAdmin,
      logout,
      addEvent,
      updateEvent,
      deleteEvent,
      addPhotosToEvent,
      addVideoToEvent,
      deleteMediaFromEvent,
      toggleLikePhoto,
      addEmployee,
      deleteEmployee,
      updateEmployee,
      updateEmployeeAttendance,
      assignEmployeeTask,
      updateSettings,
      addNotification,
      removeNotification,
      cmsContent,
      portfolioItems,
      activityLogs,
      updateCmsContent,
      addPortfolioItem,
      updatePortfolioItem,
      deletePortfolioItem,
      reorderPortfolioItems,
      addActivityLog,
      updateUserProfile,
      theme,
      setTheme,
      clientRequests,
      submitClientRequest,
      approveClientRequest,
      rejectClientRequest,
      fetchClientRequests
    }}>
      {children}
    </AppContext.Provider>
  );
};
