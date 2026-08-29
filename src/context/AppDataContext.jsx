import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, hasSupabase } from '../lib/supabase.js';

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const [state, setState] = useState({
    eventInfo: {
      name: "PromptWar 2026",
      date: "Oct 24 - 26, 2026",
      location: "San Francisco, CA"
    },
    users: [
      { id: "u1", name: "Alex Chen", role: "participant", checkedIn: true, teamId: "t1", skills: ["React", "JavaScript", "Tailwind"], preferredRole: "Frontend", interests: ["Web App", "Productivity"], availability: "Full event" },
      { id: "u2", name: "Sarah Jenkins", role: "judge", assignedProjects: ["p1", "p2"] },
      { id: "u3", name: "Marcus Webb", role: "organizer" },
      { id: "u4", name: "Priya Patel", role: "participant", checkedIn: false, teamId: null, skills: ["React", "UI/UX", "Figma"], preferredRole: "Designer", interests: ["Web App", "AI"], availability: "Full event" },
      { id: "u5", name: "David Kim", role: "participant", checkedIn: true, teamId: null, skills: ["Node.js", "Python", "PostgreSQL"], preferredRole: "Backend", interests: ["AI", "Data"], availability: "Saturday only" },
      { id: "u6", name: "Emily Croft", role: "participant", checkedIn: true, teamId: null, skills: ["Python", "TensorFlow", "Data Science"], preferredRole: "ML Engineer", interests: ["AI", "Data", "Health"], availability: "Full event" },
      { id: "u7", name: "Michael Chang", role: "participant", checkedIn: true, teamId: null, skills: ["React Native", "Firebase"], preferredRole: "Fullstack", interests: ["Mobile", "Social"], availability: "Full event" }
    ],
    teams: [
      { id: "t1", name: "ByteBuilders", members: ["u1"], projectStatus: "In Progress" },
      { id: "t2", name: "PromptMasters", members: [], projectStatus: "Submitted" },
      { id: "t3", name: "NeuralNinjas", members: [], projectStatus: "Evaluating" }
    ],
    teamRequests: [
      { id: "req1", fromUserId: "u5", toUserId: "u1", status: "pending", createdAt: new Date().toISOString() }
    ],
    announcements: [
      { id: 1, title: "Welcome to PromptWar 2026!", message: "Hacking officially begins at 9 PM.", priority: "high", timestamp: "2 hrs ago", read: false },
      { id: 2, title: "Midnight Pizza", message: "Pizza has arrived in the main hall.", priority: "low", timestamp: "1 hr ago", read: false }
    ],
    projects: [
      { id: "p1", name: "EventFlow MVP", teamId: "t1", status: "submitted", scores: null, description: "A seamless platform for managing hackathons and tech events.", technologies: ["React", "Supabase", "Tailwind"] },
      { id: "p2", name: "AI Code Reviewer", teamId: "t2", status: "evaluated", scores: { innovation: 18, technical: 15, impact: 19, uiux: 16, presentation: 17 }, description: "An automated assistant that reviews pull requests using Gemini.", technologies: ["Python", "Gemini API", "GitHub Actions"] }
    ]
  });

  // Fetch Supabase data if available
  const fetchData = async () => {
    try {
      const { data: announcements } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (announcements && announcements.length > 0) {
        setState(prev => ({ ...prev, announcements: announcements.map(a => ({ ...a, read: false, timestamp: new Date(a.created_at).toLocaleTimeString() })) }));
      }
      
      const { data: projects } = await supabase.from('projects').select('*');
      if (projects && projects.length > 0) {
        setState(prev => ({ ...prev, projects }));
      }
    } catch (err) {
      console.warn("Failed to fetch from Supabase, using mock data", err);
    }
  };

  const fetchUserProfile = async (user) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setCurrentUser({ ...data, email: user.email });
      } else {
        // Fallback if profile row is missing
        setCurrentUser({ id: user.id, email: user.email, name: user.email, role: 'participant' });
      }
    } catch (err) {
      console.warn("Error fetching profile", err);
      setCurrentUser({ id: user.id, email: user.email, name: user.email, role: 'participant' });
    }
  };

  useEffect(() => {
    if (hasSupabase) {
      // 1. Initial auth state
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) fetchUserProfile(session.user);
      });

      // 2. Auth listener
      const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchUserProfile(session.user);
        } else {
          setCurrentUser(null);
        }
      });

      // 3. Initial data fetch
      fetchData();

      // 4. Realtime subscription (Centralized hook)
      const channel = supabase.channel('eventflow-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
          fetchData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'check_ins' }, () => {
          fetchData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'evaluations' }, () => {
          fetchData();
        })
        .subscribe();

      return () => {
        authSub.unsubscribe();
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const loginAs = (userId) => {
    const user = state.users.find(u => u.id === userId);
    setCurrentUser(user);
  };

  const loginWithEmail = async (email, password) => {
    if (!hasSupabase) throw new Error("Supabase is not configured.");
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    if (hasSupabase) await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const checkIn = async (userId) => {
    const user = state.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: "Invalid participant ID" };
    }
    if (user.role !== 'participant') {
      return { success: false, message: "User is not a participant" };
    }
    if (user.checkedIn) {
      return { success: false, message: "Participant is already checked in" };
    }

    if (hasSupabase) {
      try {
        const { error } = await supabase.from('check_ins').insert({ profile_id: userId, event_id: state.eventInfo.id });
        if (error) {
          if (error.code === '23505') {
            return { success: false, message: "Participant is already checked in." };
          }
          return { success: false, message: error.message };
        }
      } catch (e) {
        console.warn("Check-in via Supabase failed", e);
        return { success: false, message: "Network error during check-in" };
      }
    }
    
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, checkedIn: true } : u)
    }));
    
    return { success: true, message: `Successfully checked in ${user.name}` };
  };

  const submitEvaluation = async (projectId, scores, feedback) => {
    // Security: Only allow if the project is assigned to the current judge
    if (!currentUser?.assignedProjects?.includes(projectId)) {
      return { success: false, message: "Unauthorized: You are not assigned to evaluate this project." };
    }

    const project = state.projects.find(p => p.id === projectId);
    if (!project) return { success: false, message: "Project not found." };

    if (hasSupabase) {
      try {
        const { error } = await supabase.from('evaluations').insert({ 
          project_id: projectId, 
          judge_id: currentUser.id, 
          scores,
          feedback 
        });
        if (error) {
           return { success: false, message: error.message };
        }
      } catch (e) {
        console.warn("Submit eval via Supabase failed", e);
        return { success: false, message: "Network error during evaluation submission." };
      }
    }

    setState(prev => {
      const newProjects = prev.projects.map(p => 
        p.id === projectId ? { ...p, status: "evaluated", scores, feedback } : p
      );
      
      return { ...prev, projects: newProjects };
    });

    return { success: true };
  };

  const sendTeamRequest = (toUserId) => {
    if (!currentUser) return;
    setState(prev => {
      const newReq = {
        id: `req_${Date.now()}`,
        fromUserId: currentUser.id,
        toUserId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      return { ...prev, teamRequests: [...prev.teamRequests, newReq] };
    });
  };

  const acceptTeamRequest = (requestId) => {
    setState(prev => {
      const req = prev.teamRequests.find(r => r.id === requestId);
      if (!req) return prev;

      const fromUser = prev.users.find(u => u.id === req.fromUserId);
      const toUser = prev.users.find(u => u.id === req.toUserId);
      if (!fromUser || !toUser) return prev;

      let newTeams = [...prev.teams];
      let newUsers = [...prev.users];
      let targetTeamId = null;

      if (toUser.teamId) {
        // Current user has a team, add requester to it
        targetTeamId = toUser.teamId;
      } else if (fromUser.teamId) {
        // Requester has a team, add current user to it
        targetTeamId = fromUser.teamId;
      } else {
        // Neither has a team, create one
        targetTeamId = `t_${Date.now()}`;
        newTeams.push({
          id: targetTeamId,
          name: `${toUser.name}'s Team`,
          members: [],
          projectStatus: "Ideation"
        });
      }

      // Add both users to the team (ensuring no duplicates)
      newTeams = newTeams.map(t => {
        if (t.id === targetTeamId) {
          const members = new Set(t.members);
          members.add(req.fromUserId);
          members.add(req.toUserId);
          return { ...t, members: Array.from(members) };
        }
        return t;
      });

      // Update user objects
      newUsers = newUsers.map(u => {
        if (u.id === req.fromUserId || u.id === req.toUserId) {
          return { ...u, teamId: targetTeamId };
        }
        return u;
      });

      // Mark request as accepted and decline other pending requests involving these users if they now have a team.
      // (Simplified: just mark this one as accepted)
      const newRequests = prev.teamRequests.map(r => 
        r.id === requestId ? { ...r, status: 'accepted' } : r
      );

      // If current user is updated, update currentUser state
      const updatedCurrentUser = newUsers.find(u => u.id === currentUser?.id);
      if (updatedCurrentUser && currentUser?.teamId !== updatedCurrentUser.teamId) {
        setCurrentUser(updatedCurrentUser);
      }

      return {
        ...prev,
        teams: newTeams,
        users: newUsers,
        teamRequests: newRequests
      };
    });
  };

  const rejectTeamRequest = (requestId) => {
    setState(prev => ({
      ...prev,
      teamRequests: prev.teamRequests.map(r => 
        r.id === requestId ? { ...r, status: 'rejected' } : r
      )
    }));
  };

  const createProject = (projectDetails) => {
    if (!currentUser || !currentUser.teamId) return { success: false, message: 'You must be in a team to submit a project.' };

    const newProject = {
      id: `p_${Date.now()}`,
      teamId: currentUser.teamId,
      name: projectDetails.name || 'Untitled Project',
      description: projectDetails.description || '',
      technologies: projectDetails.technologies || [],
      status: 'submitted',
      scores: null
    };

    setState(prev => {
      // Update team projectStatus
      const newTeams = prev.teams.map(t => 
        t.id === currentUser.teamId ? { ...t, projectStatus: 'Submitted' } : t
      );
      
      return {
        ...prev,
        projects: [...prev.projects, newProject],
        teams: newTeams
      };
    });

    return { success: true };
  };

  const publishAnnouncement = async (announcement) => {
    if (currentUser?.role !== 'organizer') {
      return { success: false, message: 'Unauthorized' };
    }
    
    if (hasSupabase) {
      try {
        const { error } = await supabase.from('announcements').insert({
          event_id: state.eventInfo.id,
          title: announcement.title,
          message: announcement.message,
          priority: announcement.priority || 'low'
        });
        if (error) {
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.warn('Supabase publish announcement failed', err);
        return { success: false, message: 'Network error' };
      }
    }
    
    setState(prev => ({
      ...prev,
      announcements: [
        {
          id: `a_${Date.now()}`,
          ...announcement,
          timestamp: 'Just now',
          read: false
        },
        ...prev.announcements
      ]
    }));
    return { success: true };
  };

  const value = {
    currentUser,
    loginAs,
    loginWithEmail,
    logout,
    state,
    checkIn,
    submitEvaluation,
    sendTeamRequest,
    acceptTeamRequest,
    rejectTeamRequest,
    createProject,
    publishAnnouncement,
    hasSupabase
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error("useAppData must be used within AppDataProvider");
  return context;
}
