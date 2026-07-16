import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard, MessageSquare, User, Settings,
    Plus, Image as ImageIcon, Trash2, Edit2, Camera,
    ChevronRight, ExternalLink, Star, ShieldCheck, Clock,
    Calendar, Users, QrCode, MapPin, Check, AlertCircle, FileText, Upload,
    Building2, Briefcase, ArrowRight, Heart, Search, Bell, CheckCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import API_URL, { FILE_API_URL } from '../config';
import ChatSystem from '../components/ChatSystem';
import { AccountSettingsModal, SecurityModal, DeleteAccountModal } from '../components/SettingsModals';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import Loader from '../components/Loader';
import VerifyEmailBanner from '../components/VerifyEmailBanner';

const Dashboard = () => {
    const { user, token, updateUser } = useAuth();
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'overview';
    const fileInputRef = useRef(null);

    const [activeTab, setActiveTab] = useState(initialTab);
    const [unreadCount, setUnreadCount] = useState(0);

    // Profile Settings States
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: 'Lagos, Nigeria'
    });

    // Modals
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Dynamic Vendor Profile State
    const [vendorProfile, setVendorProfile] = useState(null);
    const [loadingVendor, setLoadingVendor] = useState(true);
    const [vendorData, setVendorData] = useState({ starting_price: '', price_type: 'per_event', bio: '' });

    // Client Dashboard States
    const [savedVendors, setSavedVendors] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [recentMessages, setRecentMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Booked Tickets States
    const [bookedTickets, setBookedTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(false);

    // E-Ticketing Host States
    const [eventsView, setEventsView] = useState('list'); // 'list', 'create', 'manage'
    const [dashboardEvents, setDashboardEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [eventMetrics, setEventMetrics] = useState(null);
    const [loadingMetrics, setLoadingMetrics] = useState(false);
    const [checkInCode, setCheckInCode] = useState('');
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [checkInResult, setCheckInResult] = useState(null);

    const [eventForm, setEventForm] = useState({
        title: '',
        description: '',
        category: 'Concert',
        location_type: 'physical',
        location: '',
        start_time: '',
        end_time: '',
        status: 'published',
        tickets: [
            { ticket_name: 'Regular Entry', price: 0, capacity: 50, description: '' }
        ]
    });
    // Organizer Enrollment States
    const [organizerProfile, setOrganizerProfile] = useState(null);
    const [loadingOrganizer, setLoadingOrganizer] = useState(true);
    const [organizerEnrollLoading, setOrganizerEnrollLoading] = useState(false);
    const [organizerEnrollForm, setOrganizerEnrollForm] = useState({
        organizationName: '',
        organizationEmail: '',
        organizationPhone: '',
        website: '',
        description: ''
    });
    const [eventBannerFile, setEventBannerFile] = useState(null);
    const [eventBannerPreview, setEventBannerPreview] = useState('');

    // Vendor Dashboard States (Enrolled)
    const [portfolio, setPortfolio] = useState([]);
    const [loadingPortfolio, setLoadingPortfolio] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isAddingWork, setIsAddingWork] = useState(false);
    const [editingWork, setEditingWork] = useState(null);
    const [newWork, setNewWork] = useState({
        title: '',
        description: '',
        files: [],
        previews: []
    });
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    // Vendor Onboarding Enrollment Form State
    const [enrollForm, setEnrollForm] = useState({
        businessName: '',
        cacNumber: '',
        cacCertificate: null,
        businessAddress: '',
        category: '',
        rawFiles: [],
        locationImages: [],
        bio: '',
        startingPrice: '',
        priceType: 'per_event'
    });
    const [enrollLoading, setEnrollLoading] = useState(false);

    const categories = [
        "DJ", "Photographer", "Makeup Artist", "Catering", "Planner", "Security", "Decorator", "Other"
    ];

    const uploadFileToPHP = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(FILE_API_URL, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.status !== 'success') {
            throw new Error(result.message || 'File upload failed');
        }
        return result.data.url;
    };

    // Sync state with URL tab param
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get('tab') || 'overview';
        setActiveTab(tab);
    }, [location.search]);

    // Fetch vendor status / details
    const fetchVendorDetails = async () => {
        if (!user) return;
        setLoadingVendor(true);
        try {
            const response = await fetch(`${API_URL}/vendors/details?id=${user.id}`);
            const data = await response.json();
            if (data.status === 'success') {
                setVendorProfile(data.vendor);
            } else {
                setVendorProfile(null);
            }
        } catch (error) {
            console.error("Failed to load vendor status:", error);
            setVendorProfile(null);
        } finally {
            setLoadingVendor(false);
        }
    };

    // Fetch organizer status / details
    const fetchOrganizerDetails = async () => {
        if (!user) return;
        setLoadingOrganizer(true);
        try {
            const response = await fetch(`${API_URL}/organizers/details?id=${user.id}`);
            const data = await response.json();
            if (data.status === 'success') {
                setOrganizerProfile(data.organizer);
            } else {
                setOrganizerProfile(null);
            }
        } catch (error) {
            console.error("Failed to load organizer status:", error);
            setOrganizerProfile(null);
        } finally {
            setLoadingOrganizer(false);
        }
    };

    useEffect(() => {
        fetchVendorDetails();
        fetchOrganizerDetails();
    }, [user]);

    // Sync profileData when user object changes
    useEffect(() => {
        if (user) {
            setProfileData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            }));
        }
    }, [user]);

    // Sync vendorData when vendorProfile loads
    useEffect(() => {
        if (vendorProfile) {
            setVendorData({
                starting_price: vendorProfile.starting_price || '',
                price_type: vendorProfile.price_type || 'per_event',
                bio: vendorProfile.bio || ''
            });
        }
    }, [vendorProfile]);

    // Unread count polling
    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!user) return;
            try {
                const response = await fetch(`${API_URL}/chat/unread-count`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setUnreadCount(data.unread_count);
                }
            } catch (error) {
                console.error("Error fetching unread count:", error);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 15000);
        return () => clearInterval(interval);
    }, [user, token, activeTab]);

    // Overview Tab Data
    useEffect(() => {
        const fetchOverviewData = async () => {
            if (!user || activeTab !== 'overview') return;
            
            // Favorites
            setLoadingFavorites(true);
            try {
                const response = await fetch(`${API_URL}/favorites`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setSavedVendors(data.favorites);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingFavorites(false);
            }

            // Recent Messages
            setLoadingMessages(true);
            try {
                const response = await fetch(`${API_URL}/chat/conversations.php`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setRecentMessages(data.conversations.slice(0, 3));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchOverviewData();
    }, [user, token, activeTab]);

    // Booked Tickets Tab Data
    useEffect(() => {
        const fetchTickets = async () => {
            if (!user || activeTab !== 'tickets') return;
            setLoadingTickets(true);
            try {
                const response = await fetch(`${API_URL}/events/my-tickets`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setBookedTickets(data.data || []);
                }
            } catch (error) {
                console.error("Failed to load booked tickets:", error);
            } finally {
                setLoadingTickets(false);
            }
        };

        fetchTickets();
    }, [user, token, activeTab]);

    // Hosted Events Tab Data
    const fetchOrganizerEvents = async () => {
        setLoadingEvents(true);
        try {
            const pubRes = await fetch(`${API_URL}/events?status=published`);
            const pubData = await pubRes.json();
            const draftRes = await fetch(`${API_URL}/events?status=draft`);
            const draftData = await draftRes.json();

            let allEvents = [];
            if (pubData.status === 'success' && pubData.data) allEvents = [...allEvents, ...pubData.data];
            if (draftData.status === 'success' && draftData.data) allEvents = [...allEvents, ...draftData.data];

            const myEvents = allEvents.filter(e => e.organizer_id === user.id);
            setDashboardEvents(myEvents);
        } catch (error) {
            console.error("Error fetching organizer events:", error);
            showToast("Failed to load events.", "error");
        } finally {
            setLoadingEvents(false);
        }
    };

    const fetchEventMetrics = async (eventId) => {
        setLoadingMetrics(true);
        try {
            const response = await fetch(`${API_URL}/events/${eventId}/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setEventMetrics(data.data);
            } else {
                showToast(data.message || "Failed to load metrics.", "error");
            }
        } catch (error) {
            console.error("Error fetching event metrics:", error);
            showToast("Connection error.", "error");
        } finally {
            setLoadingMetrics(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'events' && eventsView === 'list') {
            fetchOrganizerEvents();
        }
    }, [activeTab, eventsView]);

    // Vendor Dashboard Tab Data
    const fetchPortfolio = async () => {
        if (!user) return;
        setLoadingPortfolio(true);
        try {
            const response = await fetch(`${API_URL}/vendors/get-portfolio?vendor_id=${user.id}`);
            const data = await response.json();
            if (data.status === 'success') {
                setPortfolio(data.data);
            }
        } catch (error) {
            console.error("Failed to load portfolio", error);
        } finally {
            setLoadingPortfolio(false);
        }
    };

    const fetchReviews = async () => {
        if (!user) return;
        setLoadingReviews(true);
        try {
            const response = await fetch(`${API_URL}/reviews/get.php?vendor_id=${user.id}`);
            const data = await response.json();
            if (data.status === 'success') {
                setReviews(data.reviews || []);
            }
        } catch (error) {
            console.error("Failed to load reviews", error);
        } finally {
            setLoadingReviews(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'vendor' && vendorProfile) {
            fetchPortfolio();
            fetchReviews();
        }
    }, [activeTab, vendorProfile]);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + parseInt(r.rating), 0) / reviews.length).toFixed(1)
        : "0.0";

    // File handlers
    const handleFileChange = (e, field) => {
        const files = e.target.files;
        if (field === 'locationImages') {
            const previewUrls = Array.from(files).map(file => URL.createObjectURL(file));
            setEnrollForm({
                ...enrollForm,
                locationImages: [...enrollForm.locationImages, ...previewUrls],
                rawFiles: [...(enrollForm.rawFiles || []), ...Array.from(files)]
            });
        } else {
            setEnrollForm({ ...enrollForm, [field]: files[0] });
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/clients/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: profileData.name,
                    phone: profileData.phone
                })
            });
            const result = await response.json();
            if (result.status === 'success') {
                showToast('Profile updated successfully!', 'success');
                updateUser({ name: profileData.name, phone: profileData.phone });
            } else {
                showToast('Update failed: ' + result.message, 'error');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            showToast("Connection error.", 'error');
        }
    };

    const handleVendorDetailsUpdate = async (e) => {
        e.preventDefault();
        if (!vendorProfile) return;
        try {
            const response = await fetch(`${API_URL}/vendors/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    business_name: vendorProfile.business_name,
                    category: vendorProfile.category,
                    business_address: vendorProfile.business_address,
                    bio: vendorData.bio,
                    starting_price: vendorData.starting_price,
                    price_type: vendorData.price_type
                })
            });
            const result = await response.json();
            if (result.status === 'success') {
                showToast('Vendor details updated!', 'success');
                setVendorProfile(prev => ({
                    ...prev,
                    bio: vendorData.bio,
                    starting_price: vendorData.starting_price,
                    price_type: vendorData.price_type
                }));
            } else {
                showToast('Update failed: ' + result.message, 'error');
            }
        } catch (error) {
            console.error("Error updating vendor details:", error);
            showToast("Connection error.", 'error');
        }
    };

    const handleProfileImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const imageUrl = await uploadFileToPHP(file);
            
            const response = await fetch(`${API_URL}/clients/upload-profile-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ imageUrl })
            });

            const result = await response.json();
            if (result.status === 'success') {
                updateUser({ image: result.data?.image });
                showToast('Profile image updated!', 'success');
            } else {
                showToast(result.message || 'Failed to update profile image', 'error');
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            showToast("Upload failed", 'error');
        }
    };

    const handleVendorImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const imageUrl = await uploadFileToPHP(file);
            
            const response = await fetch(`${API_URL}/vendors/upload-profile-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ imageUrl })
            });

            const result = await response.json();
            if (result.status === 'success') {
                updateUser({ vendor_image: result.data?.image || result.image });
                if (vendorProfile) {
                    setVendorProfile({ ...vendorProfile, image: result.data?.image || result.image });
                }
                showToast('Vendor profile image updated!', 'success');
            } else {
                showToast('Upload failed: ' + result.message, 'error');
            }
        } catch (error) {
            console.error("Error uploading profile image:", error);
            showToast("Connection error.", 'error');
        }
    };

    // Vendor Enrollment Onboarding
    const handleEnrollSubmit = async (e) => {
        e.preventDefault();
        setEnrollLoading(true);

        try {
            let cacCertificateUrl = null;
            if (enrollForm.cacCertificate) {
                cacCertificateUrl = await uploadFileToPHP(enrollForm.cacCertificate);
            }

            const locationImageUrls = [];
            if (enrollForm.rawFiles && enrollForm.rawFiles.length > 0) {
                for (const file of enrollForm.rawFiles) {
                    const url = await uploadFileToPHP(file);
                    locationImageUrls.push(url);
                }
            }

            const payload = {
                businessName: enrollForm.businessName,
                category: enrollForm.category,
                cacNumber: enrollForm.cacNumber,
                businessAddress: enrollForm.businessAddress,
                bio: enrollForm.bio,
                startingPrice: enrollForm.startingPrice,
                priceType: enrollForm.priceType,
                cacCertificateUrl,
                locationImageUrls
            };

            const response = await fetch(`${API_URL}/vendors/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (response.ok) {
                showToast("Enrolled as a vendor successfully!", "success");
                updateUser({ image: result.image });
                fetchVendorDetails();
            } else {
                showToast(result.message || "Failed to enroll.", "error");
            }
        } catch (error) {
            console.error("Enrollment error:", error);
            showToast("Connection error.", "error");
        } finally {
            setEnrollLoading(false);
        }
    };

    // Organizer Enrollment Onboarding
    const handleOrganizerEnrollSubmit = async (e) => {
        e.preventDefault();
        if (!organizerEnrollForm.organizationName) {
            showToast("Organization/Agency name is required.", "error");
            return;
        }

        setOrganizerEnrollLoading(true);
        try {
            const response = await fetch(`${API_URL}/organizers/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    organizationName: organizerEnrollForm.organizationName,
                    organizationEmail: organizerEnrollForm.organizationEmail,
                    organizationPhone: organizerEnrollForm.organizationPhone,
                    website: organizerEnrollForm.website,
                    description: organizerEnrollForm.description
                })
            });

            const result = await response.json();
            if (response.ok && result.status === 'success') {
                showToast("Enrolled as an Event Organizer successfully!", "success");
                fetchOrganizerDetails();
            } else {
                showToast(result.message || "Failed to enroll.", "error");
            }
        } catch (error) {
            console.error("Organizer enrollment error:", error);
            showToast("Connection error.", "error");
        } finally {
            setOrganizerEnrollLoading(false);
        }
    };

    // Ticket Tiers config functions
    const handleAddTicketTier = () => {
        setEventForm({
            ...eventForm,
            tickets: [...eventForm.tickets, { ticket_name: '', price: 0, capacity: 10, description: '' }]
        });
    };

    const handleRemoveTicketTier = (index) => {
        const updated = eventForm.tickets.filter((_, idx) => idx !== index);
        setEventForm({ ...eventForm, tickets: updated });
    };

    const handleTicketTierChange = (index, field, value) => {
        const updated = eventForm.tickets.map((t, idx) => {
            if (idx === index) {
                return { ...t, [field]: value };
            }
            return t;
        });
        setEventForm({ ...eventForm, tickets: updated });
    };

    const handleCreateEventSubmit = async (e) => {
        e.preventDefault();
        
        if (!eventForm.title || !eventForm.description || !eventForm.location || !eventForm.start_time || !eventForm.end_time) {
            showToast("Please fill in all required fields.", "error");
            return;
        }

        setLoadingEvents(true);
        try {
            let bannerUrl = null;
            if (eventBannerFile) {
                bannerUrl = await uploadFileToPHP(eventBannerFile);
            }

            const payload = {
                title: eventForm.title,
                description: eventForm.description,
                category: eventForm.category,
                location_type: eventForm.location_type,
                location: eventForm.location,
                start_time: eventForm.start_time,
                end_time: eventForm.end_time,
                status: eventForm.status,
                tickets: eventForm.tickets,
                bannerUrl
            };

            const response = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.status === 'success') {
                showToast("Event created successfully!", "success");
                setEventsView('list');
                setEventForm({
                    title: '',
                    description: '',
                    category: 'Concert',
                    location_type: 'physical',
                    location: '',
                    start_time: '',
                    end_time: '',
                    status: 'published',
                    tickets: [{ ticket_name: 'Regular Entry', price: 0, capacity: 50, description: '' }]
                });
                setEventBannerFile(null);
                setEventBannerPreview('');
                fetchOrganizerEvents();
            } else {
                showToast(result.message || "Failed to create event.", "error");
            }
        } catch (error) {
            console.error("Error creating event:", error);
            showToast("Connection error.", "error");
        } finally {
            setLoadingEvents(false);
        }
    };

    const handleCheckInSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!checkInCode) {
            showToast("Please enter a ticket code.", "error");
            return;
        }

        setCheckInLoading(true);
        setCheckInResult(null);
        try {
            const response = await fetch(`${API_URL}/events/verify-ticket`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ticket_code: checkInCode })
            });

            const result = await response.json();
            setCheckInResult(result);
            if (result.status === 'success') {
                showToast("Attendee checked in successfully!", "success");
                fetchEventMetrics(selectedEventId);
                setCheckInCode('');
            } else if (result.status === 'already_checked_in') {
                showToast("Ticket is already checked in.", "warning");
            } else {
                showToast(result.message || "Invalid ticket code.", "error");
            }
        } catch (error) {
            console.error("Check-in error:", error);
            showToast("Connection error.", "error");
        } finally {
            setCheckInLoading(false);
        }
    };

    // Enrolled Vendor Portfolio handlers
    const handlePortfolioImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const previews = files.map(file => URL.createObjectURL(file));
            setNewWork({ ...newWork, previews: [...newWork.previews, ...previews], files: [...newWork.files, ...files] });
        }
    };

    const handleAddWork = async (e) => {
        e.preventDefault();
        if (newWork.files.length === 0) return showToast("Select at least one image.", 'warning');
        
        const ok = await confirm("Uploading a new project to your portfolio costs 5 Tokens. Proceed?", {
            title: "Upload Portfolio Project",
            confirmText: "Upload (5 Tokens)",
            type: "info"
        });
        if (!ok) return;

        setUploading(true);

        try {
            const imageUrls = [];
            for (const file of newWork.files) {
                const url = await uploadFileToPHP(file);
                imageUrls.push(url);
            }

            const payload = {
                title: newWork.title,
                description: newWork.description,
                imageUrls
            };

            const response = await fetch(`${API_URL}/vendors/upload-portfolio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.status === 'success') {
                updateUser({ tokens: result.tokens });
                fetchPortfolio();
                setNewWork({ title: '', description: '', previews: [], files: [] });
                setIsAddingWork(false);
                showToast("Project added successfully! 5 tokens deducted.", 'success');
            } else if (result.status === 'insufficient_tokens') {
                showToast("Insufficient Tokens. Please visit your Wallet to top up.", 'error');
            } else {
                showToast("Upload failed: " + (result.message || "Unknown error"), 'error');
            }
        } catch (error) {
            console.error("Upload error:", error);
            showToast("Error uploading project.", 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteWork = async (workId) => {
        const ok = await confirm("Are you sure you want to delete this entire project? This action cannot be undone.", {
            title: "Delete Project",
            confirmText: "Delete Project",
            type: "danger"
        });
        if (!ok) return;

        try {
            const response = await fetch(`${API_URL}/vendors/delete-portfolio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ work_id: workId })
            });

            const result = await response.json();
            if (result.status === 'success') {
                fetchPortfolio();
                showToast("Project deleted.", 'success');
            } else {
                showToast("Failed to delete: " + result.message, 'error');
            }
        } catch (error) {
            console.error("Delete error:", error);
            showToast("Error deleting project.", 'error');
        }
    };

    const handleDeleteProjectImage = async (imageId) => {
        const ok = await confirm("Remove this image from your portfolio?", {
            title: "Remove Image",
            confirmText: "Remove",
            type: "danger"
        });
        if (!ok) return;
        try {
            const response = await fetch(`${API_URL}/vendors/delete-portfolio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ image_id: imageId })
            });
            const result = await response.json();
            if (result.status === 'success') {
                fetchPortfolio();
                if (editingWork) {
                    const filteredImages = editingWork.images.filter(img => img.id !== imageId);
                    setEditingWork({ ...editingWork, images: filteredImages });
                }
            }
        } catch (e) { console.error(e); }
    };

    const handleUpdateWork = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('work_id', editingWork.id);
            formData.append('title', editingWork.title);
            formData.append('description', editingWork.description);

            if (editingWork.newFiles) {
                editingWork.newFiles.forEach(file => {
                    formData.append('files', file);
                });
            }

            const response = await fetch(`${API_URL}/vendors/edit-portfolio`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();
            if (result.status === 'success') {
                fetchPortfolio();
                setEditingWork(null);
                showToast("Update successful!", 'success');
            } else {
                showToast("Update failed: " + result.message, 'error');
            }
        } catch (error) {
            console.error("Update error:", error);
            showToast("Error updating project.", 'error');
        } finally {
            setUploading(false);
        }
    };

    // Render Sub-components
    const renderOverview = () => (
        <div className="overview-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div style={{ background: 'var(--primary)', padding: '2.5rem', borderRadius: '0', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Find the perfect event talent</h2>
                        <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '400px' }}>Browse through hundreds of verified professionals and start a conversation.</p>
                        <Link to="/vendors" className="btn" style={{ background: 'white', color: 'var(--primary)', padding: '0.85rem 2rem', fontWeight: '700', textDecoration: 'none', borderRadius: '0', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Search size={20} /> Browse All Vendors
                        </Link>
                    </div>
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem' }}>Your Favorite Vendors</h3>
                        <Link to="/vendors" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none' }}>Discover more</Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {loadingFavorites ? <div style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}><Loader size="md" message="Loading favorites..." /></div> : (
                            savedVendors.length > 0 ? (
                                savedVendors.map(v => (
                                    <div key={v.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '0', border: '1px solid #e2e8f0', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                        <img
                                            src={v.image ? (v.image && v.image.startsWith('http') ? v.image : `${API_URL.replace('/api', '')}/${v.image}`) : "https://ui-avatars.com/api/?name=" + (v.business_name || v.name)}
                                            style={{ width: '70px', height: '70px', borderRadius: '0', objectFit: 'cover' }}
                                            onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + (v.business_name || v.name); }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{v.business_name || v.name}</h4>
                                            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0' }}>{v.category}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{parseFloat(v.rating || 0).toFixed(1)}</span>
                                            </div>
                                        </div>
                                        <Link to={`/vendors/${v.id}`} style={{ background: '#f1f5f9', color: '#475569', width: '36px', height: '36px', borderRadius: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '0', border: '1px dashed #e2e8f0' }}>
                                    <p style={{ color: '#64748b', margin: 0 }}>You haven't saved any vendors yet.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Overview Panels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Recent Messages</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {loadingMessages ? <div style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}><Loader size="sm" /></div> : (
                            recentMessages.length > 0 ? (
                                recentMessages.map(m => (
                                    <div key={m.id} style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '0', height: 'fit-content' }}>
                                            <MessageSquare size={18} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', lineHeight: '1.4', margin: '0 0 0.25rem 0', color: '#334155', fontWeight: '500' }}>
                                                {m.sender_id === user.id ? `You: ${m.message}` : `${m.name}: ${m.message}`}
                                            </p>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.time_formatted || 'Recently'}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No recent messages.</p>
                            )
                        )}
                    </div>
                    <Link to="/dashboard?tab=messages" style={{ display: 'block', marginTop: '1.5rem', textAlign: 'center', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none' }}>Go to Messages</Link>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Quick Settings</h3>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                            onClick={() => navigate('?tab=profile')}
                            style={quickLinkStyle}
                        >
                            <User size={18} /> My Profile
                        </button>
                        <button
                            onClick={() => { setEventsView('list'); navigate('?tab=events'); }}
                            style={quickLinkStyle}
                        >
                            <Calendar size={18} /> Manage Hosted Events
                        </button>
                        <button
                            onClick={() => setIsAccountModalOpen(true)}
                            style={quickLinkStyle}
                        >
                            <Settings size={18} /> Account Settings
                        </button>
                        <button
                            onClick={() => setIsSecurityModalOpen(true)}
                            style={quickLinkStyle}
                        >
                            <ShieldCheck size={18} /> Security
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );

    const renderBookedTickets = () => (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>My Booked Tickets</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Show your ticket QR code at the venue gate for check-in.</p>
            </div>

            {loadingTickets ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}><Loader message="Loading tickets..." /></div>
            ) : bookedTickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', border: '1px dashed #e2e8f0' }}>
                    <QrCode size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>No tickets booked yet</h3>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Find amazing events around you and grab your ticket stub!</p>
                    <Link to="/events" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block', padding: '0.75rem 2rem' }}>Find Events</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {bookedTickets.map(ticket => {
                        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(ticket.ticket_code)}`;
                        const eventDate = new Date(ticket.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                        const eventTime = new Date(ticket.start_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

                        return (
                            <div key={ticket.id} style={{ background: 'white', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                {/* Stub Top Banner */}
                                <div style={{ background: '#f8fafc', borderBottom: '1px dashed #cbd5e1', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--primary)' }}>
                                        {ticket.ticket_name}
                                    </span>
                                    <span style={{
                                        fontSize: '0.7rem', padding: '2px 8px', fontWeight: '700',
                                        background: ticket.checked_in ? '#dcfce7' : '#e0f2fe',
                                        color: ticket.checked_in ? '#15803d' : '#0369a1'
                                    }}>
                                        {ticket.checked_in ? 'Checked-In' : 'Active Pass'}
                                    </span>
                                </div>
                                <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem', flex: 1 }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '800' }}>{ticket.event_title}</h3>
                                        <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={14} /> {eventDate} at {eventTime}
                                        </p>
                                        <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <MapPin size={14} /> {ticket.location_type === 'online' ? 'Online Link' : ticket.location}
                                        </p>
                                        <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Guest Name:</span>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{ticket.attendee_name}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={qrUrl} style={{ width: '90px', height: '90px', border: '1px solid #cbd5e1' }} alt="Ticket QR" />
                                        <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#94a3b8', marginTop: '6px' }}>{ticket.ticket_code}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    const renderEventsManager = () => {
        if (loadingOrganizer) {
            return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}><Loader message="Verifying organizer status..." /></div>;
        }

        if (!organizerProfile) {
            return (
                <div style={{ background: 'white', padding: '2.5rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: '800' }}>Enroll as an Event Organizer</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Register your agency or firm to start hosting events and selling tickets.</p>
                    </div>

                    <form onSubmit={handleOrganizerEnrollSubmit} className="form-grid">
                        <div style={{ gridColumn: 'span 2' }} className="span-full">
                            <label style={enrollLabelStyle}>Organization / Agency Name *</label>
                            <div style={{ position: 'relative' }}>
                                <Building2 size={18} style={enrollIconStyle} />
                                <input
                                    type="text" required placeholder="e.g. Enterra Events Ltd or John Doe Production"
                                    style={enrollInputStyle} value={organizerEnrollForm.organizationName}
                                    onChange={(e) => setOrganizerEnrollForm({ ...organizerEnrollForm, organizationName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={enrollLabelStyle}>Organization Email</label>
                            <div style={{ position: 'relative' }}>
                                <Briefcase size={18} style={enrollIconStyle} />
                                <input
                                    type="email" placeholder="e.g. contact@youragency.com"
                                    style={enrollInputStyle} value={organizerEnrollForm.organizationEmail}
                                    onChange={(e) => setOrganizerEnrollForm({ ...organizerEnrollForm, organizationEmail: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={enrollLabelStyle}>Organization Phone</label>
                            <div style={{ position: 'relative' }}>
                                <FileText size={18} style={enrollIconStyle} />
                                <input
                                    type="text" placeholder="e.g. +234 800 000 0000"
                                    style={enrollInputStyle} value={organizerEnrollForm.organizationPhone}
                                    onChange={(e) => setOrganizerEnrollForm({ ...organizerEnrollForm, organizationPhone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ gridColumn: 'span 2' }} className="span-full">
                            <label style={enrollLabelStyle}>Website URL (optional)</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} style={enrollIconStyle} />
                                <input
                                    type="url" placeholder="e.g. https://www.youragency.com"
                                    style={enrollInputStyle} value={organizerEnrollForm.website}
                                    onChange={(e) => setOrganizerEnrollForm({ ...organizerEnrollForm, website: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ gridColumn: 'span 2' }} className="span-full">
                            <label style={enrollLabelStyle}>About / Description</label>
                            <textarea
                                placeholder="Describe your firm, past events you have organized, etc."
                                style={{ ...enrollInputStyle, paddingLeft: '1rem', height: '120px', resize: 'none' }} value={organizerEnrollForm.description}
                                onChange={(e) => setOrganizerEnrollForm({ ...organizerEnrollForm, description: e.target.value })}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }} className="span-full">
                            <button
                                type="submit" disabled={organizerEnrollLoading} className="btn btn-primary"
                                style={{ padding: '0.75rem 2rem', borderRadius: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                {organizerEnrollLoading ? <Loader size="sm" /> : 'Enroll Now'}
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        if (eventsView === 'list') {
            return (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>My Hosted Events</h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Create and manage tickets for your events.</p>
                        </div>
                        <button onClick={() => setEventsView('create')} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> Create Event
                        </button>
                    </div>

                    {loadingEvents ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}><Loader message="Loading your events..." /></div>
                    ) : dashboardEvents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', border: '1px dashed #e2e8f0' }}>
                            <Calendar size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>No events hosted yet</h3>
                            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Organize your first event today and sell tickets or gather registrations!</p>
                            <button onClick={() => setEventsView('create')} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Create Event Now</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {dashboardEvents.map(e => {
                                const banner = e.banner_path 
                                    ? (e.banner_path && e.banner_path.startsWith('http') ? e.banner_path : `${API_URL.replace('/api', '')}/${e.banner_path}`) 
                                    : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=75';

                                return (
                                    <div key={e.id} style={{ background: 'white', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <div style={{ position: 'relative', height: '140px' }}>
                                            <img src={banner} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <span style={{
                                                position: 'absolute', top: '10px', left: '10px',
                                                background: e.status === 'published' ? '#dcfce7' : '#f1f5f9',
                                                color: e.status === 'published' ? '#15803d' : '#475569',
                                                fontSize: '0.7rem', fontWeight: '700', padding: '3px 8px', textTransform: 'uppercase'
                                            }}>{e.status}</span>
                                        </div>
                                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>{e.title}</h3>
                                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <MapPin size={12} /> {e.location}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setSelectedEventId(e.id);
                                                    fetchEventMetrics(e.id);
                                                    setEventsView('manage');
                                                }}
                                                className="btn btn-primary"
                                                style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', marginTop: 'auto', borderRadius: '0' }}
                                            >
                                                Manage Tickets & Check-In
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        }

        if (eventsView === 'create') {
            return (
                <div style={{ background: 'white', padding: '2.5rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                        <button onClick={() => setEventsView('list')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}>
                            ← Back to List
                        </button>
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Create New Event</h2>

                    <form onSubmit={handleCreateEventSubmit} className="form-grid">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', gridColumn: 'span 2' }} className="span-full">
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Event Title *</label>
                            <input
                                type="text" required placeholder="e.g. Annual Tech Symposium"
                                style={formInputStyle} value={eventForm.title}
                                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Category *</label>
                            <select
                                style={formInputStyle} value={eventForm.category}
                                onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                            >
                                <option value="Concert">Concert</option>
                                <option value="Party">Party</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Seminar">Seminar</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Location Format *</label>
                            <select
                                style={formInputStyle} value={eventForm.location_type}
                                onChange={(e) => setEventForm({ ...eventForm, location_type: e.target.value })}
                            >
                                <option value="physical">Physical (In-Person)</option>
                                <option value="online">Online (Virtual Link)</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', gridColumn: 'span 2' }} className="span-full">
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>
                                {eventForm.location_type === 'online' ? 'Meeting URL *' : 'Venue Address *'}
                            </label>
                            <input
                                type="text" required placeholder={eventForm.location_type === 'online' ? 'e.g. https://zoom.us/j/...' : 'e.g. 12 Victoria Island, Lagos'}
                                style={formInputStyle} value={eventForm.location}
                                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Start Date & Time *</label>
                            <input
                                type="datetime-local" required
                                style={formInputStyle} value={eventForm.start_time}
                                onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>End Date & Time *</label>
                            <input
                                type="datetime-local" required
                                style={formInputStyle} value={eventForm.end_time}
                                onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', gridColumn: 'span 2' }} className="span-full">
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Event Banner Cover *</label>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', border: '1px dashed #cbd5e1', padding: '1rem' }}>
                                <input
                                    type="file" accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setEventBannerFile(file);
                                            setEventBannerPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                {eventBannerPreview && (
                                    <img src={eventBannerPreview} style={{ width: '120px', height: '70px', objectFit: 'cover' }} />
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', gridColumn: 'span 2' }} className="span-full">
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Description / Details *</label>
                            <textarea
                                required placeholder="Tell attendees what this event is about..."
                                style={{ ...formInputStyle, height: '120px', resize: 'none' }} value={eventForm.description}
                                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                            />
                        </div>

                        {/* Ticket Config */}
                        <div style={{ gridColumn: 'span 2', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }} className="span-full">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Ticket Configuration</h3>
                                <button type="button" onClick={handleAddTicketTier} className="btn" style={{ background: '#f1f5f9', color: 'var(--primary)', padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: '700', border: '1px solid var(--border-color)', borderRadius: '0' }}>
                                    + Add Ticket Tier
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {eventForm.tickets.map((ticket, idx) => (
                                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr auto', gap: '0.75rem', alignItems: 'center', background: '#f8fafc', padding: '1rem', border: '1px solid #e2e8f0' }}>
                                        <div>
                                            <input
                                                type="text" required placeholder="Tier Name (e.g. VIP)"
                                                style={{ ...formInputStyle, padding: '0.5rem' }} value={ticket.ticket_name}
                                                onChange={(e) => handleTicketTierChange(idx, 'ticket_name', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="number" required placeholder="Price (₦)" min="0"
                                                style={{ ...formInputStyle, padding: '0.5rem' }} value={ticket.price}
                                                onChange={(e) => handleTicketTierChange(idx, 'price', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="number" required placeholder="Capacity" min="1"
                                                style={{ ...formInputStyle, padding: '0.5rem' }} value={ticket.capacity}
                                                onChange={(e) => handleTicketTierChange(idx, 'capacity', parseInt(e.target.value) || 10)}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text" placeholder="Description (e.g. VIP benefits)"
                                                style={{ ...formInputStyle, padding: '0.5rem' }} value={ticket.description}
                                                onChange={(e) => handleTicketTierChange(idx, 'description', e.target.value)}
                                            />
                                        </div>
                                        {eventForm.tickets.length > 1 && (
                                            <button type="button" onClick={() => handleRemoveTicketTier(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', gridColumn: 'span 2', marginTop: '2rem' }} className="span-full">
                            <button type="submit" disabled={loadingEvents} className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                                {loadingEvents ? 'Saving Event...' : 'Publish Event'}
                            </button>
                            <button type="button" onClick={() => setEventsView('list')} className="btn" style={{ background: '#f1f5f9', color: '#475569', padding: '1rem 2.5rem', borderRadius: '0' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        if (eventsView === 'manage') {
            if (loadingMetrics || !eventMetrics) {
                return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}><Loader message="Loading event dashboard..." /></div>;
            }

            const mockScanOptions = eventMetrics.attendees.filter(a => !a.checked_in && (a.payment_status === 'paid' || a.payment_status === 'free'));

            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button onClick={() => setEventsView('list')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}>
                            ← Back to List
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: '800' }}>{eventMetrics.eventTitle}</h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Dashboard and gate check-in systems.</p>
                        </div>
                    </div>

                    {/* Analytics Summary */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ background: 'white', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0' }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Tickets Sold</span>
                            <div style={{ fontSize: '1.75rem', fontWeight: '800', margin: '8px 0', color: 'var(--text-primary)' }}>
                                {eventMetrics.totalSold} / {eventMetrics.totalCapacity}
                            </div>
                        </div>

                        <div style={{ background: 'white', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0' }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Revenue</span>
                            <div style={{ fontSize: '1.75rem', fontWeight: '800', margin: '8px 0', color: 'var(--text-primary)' }}>
                                ₦{eventMetrics.totalRevenue.toLocaleString()}
                            </div>
                        </div>

                        <div style={{ background: 'white', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0' }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Checked In</span>
                            <div style={{ fontSize: '1.75rem', fontWeight: '800', margin: '8px 0', color: 'var(--text-primary)' }}>
                                {eventMetrics.totalCheckedIn} ({eventMetrics.checkInRate}%)
                            </div>
                        </div>
                    </div>

                    {/* Ticket Tiers */}
                    <div style={{ background: 'white', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>Ticket Tiers Summary</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: '700' }}>
                                        <th style={{ padding: '0.75rem 1rem' }}>Tier Name</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Sold</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Capacity</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventMetrics.tiers.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>{t.ticket_name}</td>
                                            <td style={{ padding: '0.75rem 1rem' }}>{parseFloat(t.price) === 0 ? 'Free' : `₦${parseFloat(t.price).toLocaleString()}`}</td>
                                            <td style={{ padding: '0.75rem 1rem' }}>{t.sold_count}</td>
                                            <td style={{ padding: '0.75rem 1rem' }}>{t.capacity}</td>
                                            <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>₦{parseFloat(t.revenue || 0).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="overview-grid">
                        <div style={{ background: 'white', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Users size={18} /> Attendee Roster ({eventMetrics.attendees.length})
                            </h3>
                            {eventMetrics.attendees.length === 0 ? (
                                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, padding: '1rem 0', textAlign: 'center' }}>No tickets booked yet.</p>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569' }}>
                                                <th style={{ padding: '0.5rem' }}>Attendee</th>
                                                <th style={{ padding: '0.5rem' }}>Ticket Tier</th>
                                                <th style={{ padding: '0.5rem' }}>Code</th>
                                                <th style={{ padding: '0.5rem' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {eventMetrics.attendees.map(a => (
                                                <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '0.5rem' }}>
                                                        <div style={{ fontWeight: '600' }}>{a.attendee_name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{a.attendee_email}</div>
                                                    </td>
                                                    <td style={{ padding: '0.5rem' }}>{a.ticket_name}</td>
                                                    <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{a.ticket_code}</td>
                                                    <td style={{ padding: '0.5rem' }}>
                                                        {a.checked_in ? (
                                                            <span style={{ color: '#16803d', background: '#dcfce7', padding: '2px 6px', fontSize: '0.7rem', fontWeight: '700' }}>Checked In</span>
                                                        ) : (
                                                            <span style={{ color: '#0369a1', background: '#e0f2fe', padding: '2px 6px', fontSize: '0.7rem', fontWeight: '700' }}>Valid</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ background: 'white', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <QrCode size={18} /> Gate Ticket Scanner
                                </h3>
                                
                                <form onSubmit={handleCheckInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <input
                                        type="text" placeholder="Scan or enter ticket code (ETK-...)"
                                        style={formInputStyle} value={checkInCode}
                                        onChange={(e) => setCheckInCode(e.target.value.toUpperCase())}
                                    />
                                    <button type="submit" disabled={checkInLoading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '0' }}>
                                        {checkInLoading ? 'Verifying...' : 'Check In Guest'}
                                    </button>
                                </form>

                                {mockScanOptions.length > 0 && (
                                    <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', border: '1px solid #cbd5e1' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                            Scanner Simulator
                                        </label>
                                        <select
                                            onChange={(e) => setCheckInCode(e.target.value)}
                                            style={{ ...formInputStyle, padding: '0.5rem', fontSize: '0.8rem', background: 'white' }}
                                            value={checkInCode}
                                        >
                                            <option value="">Select an attendee ticket to scan...</option>
                                            {mockScanOptions.map(o => (
                                                <option key={o.ticket_code} value={o.ticket_code}>
                                                    {o.attendee_name} ({o.ticket_code} - {o.ticket_name})
                                                </option>
                                            ))}
                                        </select>
                                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                                            Select a guest code to simulate pointing a barcode scanner camera at their ticket QR.
                                        </p>
                                    </div>
                                )}

                                {checkInResult && (
                                    <div style={{
                                        marginTop: '1.5rem', padding: '1rem', border: '1px solid',
                                        borderColor: checkInResult.status === 'success' ? '#22c55e' : checkInResult.status === 'already_checked_in' ? '#eab308' : '#ef4444',
                                        background: checkInResult.status === 'success' ? '#f0fdf4' : checkInResult.status === 'already_checked_in' ? '#fef9c3' : '#fef2f2',
                                        color: checkInResult.status === 'success' ? '#14532d' : checkInResult.status === 'already_checked_in' ? '#713f12' : '#7f1d1d'
                                    }}>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: '800' }}>
                                            {checkInResult.status === 'success' ? '✓ Access Granted' : checkInResult.status === 'already_checked_in' ? '⚠️ Duplicate Scan' : '✗ Access Denied'}
                                        </h4>
                                        <p style={{ margin: 0, fontSize: '0.8rem' }}>{checkInResult.message}</p>
                                        {checkInResult.data && (
                                            <div style={{ marginTop: '8px', fontSize: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '6px' }}>
                                                <div><strong>Name:</strong> {checkInResult.data.attendee_name}</div>
                                                <div><strong>Ticket:</strong> {checkInResult.data.ticket_name}</div>
                                                {checkInResult.data.checked_in_at && <div><strong>Scanned at:</strong> {new Date(checkInResult.data.checked_in_at).toLocaleTimeString()}</div>}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderVendorPortal = () => {
        if (loadingVendor) {
            return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}><Loader message="Verifying vendor status..." /></div>;
        }

        // 1. Render Setup wizard if not enrolled
        if (!vendorProfile) {
            return (
                <div style={{ background: 'white', padding: '2.5rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: '800' }}>Enroll as a Vendor</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Offer your event services to clients in the marketplace.</p>
                    </div>

                    <form onSubmit={handleEnrollSubmit} className="form-grid">
                        <div>
                            <label style={enrollLabelStyle}>Business Name *</label>
                            <div style={{ position: 'relative' }}>
                                <Building2 size={18} style={enrollIconStyle} />
                                <input
                                    type="text" required placeholder="e.g. Lagos Elite Lighting"
                                    style={enrollInputStyle} value={enrollForm.businessName}
                                    onChange={(e) => setEnrollForm({ ...enrollForm, businessName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={enrollLabelStyle}>Primary Category *</label>
                            <div style={{ position: 'relative' }}>
                                <Briefcase size={18} style={enrollIconStyle} />
                                <select
                                    style={{ ...enrollInputStyle, appearance: 'none' }} required
                                    value={enrollForm.category}
                                    onChange={(e) => setEnrollForm({ ...enrollForm, category: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={enrollLabelStyle}>CAC Registration Number</label>
                            <div style={{ position: 'relative' }}>
                                <FileText size={18} style={enrollIconStyle} />
                                <input
                                    type="text" placeholder="e.g. RC-1234567"
                                    style={enrollInputStyle} value={enrollForm.cacNumber}
                                    onChange={(e) => setEnrollForm({ ...enrollForm, cacNumber: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={enrollLabelStyle}>CAC Certificate Upload</label>
                            <div
                                style={enrollUploadZoneStyle}
                                onClick={() => document.getElementById('cac-upload-portal').click()}
                            >
                                {enrollForm.cacCertificate ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '0.85rem' }}>
                                        <CheckCircle size={18} /> {enrollForm.cacCertificate.name}
                                    </div>
                                ) : (
                                    <div style={{ color: '#64748b', textAlign: 'center', fontSize: '0.85rem' }}>
                                        <Upload size={20} style={{ marginBottom: '4px' }} />
                                        <p style={{ margin: 0 }}>Click to upload document</p>
                                    </div>
                                )}
                                <input id="cac-upload-portal" type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'cacCertificate')} />
                            </div>
                        </div>

                        <div style={{ gridColumn: 'span 2' }} className="span-full">
                            <label style={enrollLabelStyle}>Business Address *</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} style={enrollIconStyle} />
                                <input
                                    type="text" required placeholder="No 12, Victoria Island, Lagos"
                                    style={enrollInputStyle} value={enrollForm.businessAddress}
                                    onChange={(e) => setEnrollForm({ ...enrollForm, businessAddress: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={enrollLabelStyle}>Starting Price (₦) *</label>
                            <div style={{ position: 'relative' }}>
                                <Briefcase size={18} style={enrollIconStyle} />
                                <input
                                    type="number" required placeholder="e.g. 150000"
                                    style={enrollInputStyle} value={enrollForm.startingPrice}
                                    onChange={(e) => setEnrollForm({ ...enrollForm, startingPrice: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={enrollLabelStyle}>Pricing Model *</label>
                            <div style={{ position: 'relative' }}>
                                <ShieldCheck size={18} style={enrollIconStyle} />
                                <select
                                    style={{ ...enrollInputStyle, appearance: 'none' }} required
                                    value={enrollForm.priceType}
                                    onChange={(e) => setEnrollForm({ ...enrollForm, priceType: e.target.value })}
                                >
                                    <option value="per_event">Per Event</option>
                                    <option value="per_hour">Per Hour</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ gridColumn: 'span 2' }} className="span-full">
                            <label style={enrollLabelStyle}>Location Images *</label>
                            <div
                                style={{ ...enrollUploadZoneStyle, height: '120px' }}
                                onClick={() => document.getElementById('location-upload-portal').click()}
                            >
                                <div style={{ color: '#64748b', textAlign: 'center', fontSize: '0.85rem' }}>
                                    <Camera size={24} style={{ marginBottom: '6px' }} />
                                    <p style={{ margin: 0 }}>Click to upload multiple images of your workspace</p>
                                </div>
                                <input id="location-upload-portal" type="file" multiple style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'locationImages')} />
                            </div>
                            {enrollForm.locationImages.length > 0 && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', overflowX: 'auto', paddingBottom: '10px' }}>
                                    {enrollForm.locationImages.map((img, idx) => (
                                        <img key={idx} src={img} style={{ width: '80px', height: '60px', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ gridColumn: 'span 2' }} className="span-full">
                            <label style={enrollLabelStyle}>Business Bio / Description *</label>
                            <textarea
                                required placeholder="Tell clients about your services, skills, and past events..."
                                style={{ ...enrollInputStyle, height: '120px', resize: 'none', paddingLeft: '1rem', paddingTop: '0.85rem' }}
                                value={enrollForm.bio}
                                onChange={(e) => setEnrollForm({ ...enrollForm, bio: e.target.value })}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2', marginTop: '1.5rem' }} className="span-full">
                            <button type="submit" disabled={enrollLoading} className="btn btn-primary" style={{ padding: '1rem 3rem', width: '100%' }}>
                                {enrollLoading ? 'Registering Business...' : 'Submit Vendor Application'}
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        // 2. Render Vendor Dashboard (Portfolio & Reviews) if enrolled
        return (
            <div>
                {/* Verification Pending Banner */}
                {vendorProfile.is_verified != 1 && (
                    <div style={{
                        background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                        border: '1px solid #fde68a',
                        padding: '1.25rem 1.5rem',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem'
                    }}>
                        <span style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>⚠️</span>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#92400e', fontWeight: '800', fontSize: '1rem' }}>Verification Pending</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#b45309', lineHeight: 1.6 }}>
                                Your vendor account is awaiting admin verification. Once verified, your profile will be publicly listed in the marketplace and you will be able to upload portfolio projects.
                            </p>
                        </div>
                    </div>
                )}

                {/* Statistics Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div style={{ background: 'white', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Portfolio Projects</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px' }}>{portfolio.length}</div>
                    </div>
                    <div style={{ background: 'white', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Average Rating</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {averageRating} <Star size={20} fill="#fbbf24" color="#fbbf24" style={{ marginBottom: '4px' }} />
                        </div>
                    </div>
                    <div style={{ background: 'white', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Wallet Tokens</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px' }}>{user.tokens || 0} Tokens</div>
                    </div>
                </div>

                {/* Sub-tabs inside Vendor Portal: Portfolio vs Reviews */}
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => { setIsAddingWork(false); setEditingWork(null); }}
                        className="btn"
                        style={{
                            background: !isAddingWork && !editingWork ? 'var(--primary)' : 'white',
                            color: !isAddingWork && !editingWork ? 'white' : '#64748b',
                            border: '1px solid #cbd5e1', padding: '0.5rem 1.5rem', borderRadius: '0'
                        }}
                    >
                        Portfolio Projects
                    </button>
                    {vendorProfile.is_verified == 1 && (
                        <button
                            onClick={() => setIsAddingWork(true)}
                            className="btn"
                            style={{
                                background: isAddingWork ? 'var(--primary)' : 'white',
                                color: isAddingWork ? 'white' : '#64748b',
                                border: '1px solid #cbd5e1', padding: '0.5rem 1.5rem', borderRadius: '0'
                            }}
                        >
                            + Add New Work
                        </button>
                    )}
                </div>

                {isAddingWork && (
                    <div style={{ background: 'white', padding: '2rem', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Add New Work</h3>
                        <form onSubmit={handleAddWork} className="form-grid">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Project Title</label>
                                <input
                                    type="text" style={formInputStyle} value={newWork.title}
                                    placeholder="e.g. Lagos Jazz Festival Setup"
                                    onChange={(e) => setNewWork({ ...newWork, title: e.target.value })} required
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Description</label>
                                <input
                                    type="text" style={formInputStyle} value={newWork.description}
                                    placeholder="Short summary of work done"
                                    onChange={(e) => setNewWork({ ...newWork, description: e.target.value })} required
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 3' }} className="span-full">
                                <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Project Images</label>
                                <div
                                    style={enrollUploadZoneStyle}
                                    onClick={() => document.getElementById('work-image-upload').click()}
                                >
                                    {newWork.previews.length > 0 ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', width: '100%', padding: '1rem' }}>
                                            {newWork.previews.map((src, idx) => (
                                                <div key={idx} style={{ position: 'relative' }}>
                                                    <img src={src} style={{ width: '100%', height: '80px', objectFit: 'cover' }} alt="Preview" />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newPreviews = [...newWork.previews];
                                                            const newFiles = [...newWork.files];
                                                            newPreviews.splice(idx, 1);
                                                            newFiles.splice(idx, 1);
                                                            setNewWork({ ...newWork, previews: newPreviews, files: newFiles });
                                                        }}
                                                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer' }}
                                                    >✕</button>
                                                </div>
                                            ))}
                                            <div style={{ border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px' }}>
                                                <Plus size={20} color="#64748b" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#64748b', textAlign: 'center' }}>
                                            <ImageIcon size={28} style={{ marginBottom: '4px', opacity: 0.5 }} />
                                            <p style={{ margin: 0 }}>Click to upload multiple images</p>
                                        </div>
                                    )}
                                    <input id="work-image-upload" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePortfolioImageChange} />
                                </div>
                            </div>
                            <div style={{ gridColumn: 'span 3', display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }} className="span-full">
                                <button type="button" className="btn" onClick={() => setIsAddingWork(false)} style={{ background: '#f1f5f9', border: 'none' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Save to Portfolio (Costs 5 Tokens)'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {editingWork && (
                    <div style={{ background: 'white', padding: '2rem', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Edit Project Details</h3>
                        <form onSubmit={handleUpdateWork} className="form-grid">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Project Title</label>
                                <input
                                    type="text" style={formInputStyle} value={editingWork.title}
                                    onChange={(e) => setEditingWork({ ...editingWork, title: e.target.value })} required
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Description</label>
                                <input
                                    type="text" style={formInputStyle} value={editingWork.description}
                                    onChange={(e) => setEditingWork({ ...editingWork, description: e.target.value })} required
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 3' }} className="span-full">
                                <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Project Images</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                    {editingWork.images && editingWork.images.map(img => (
                                        <div key={img.id} style={{ position: 'relative' }}>
                                            <img src={(img.file_path && img.file_path.startsWith('http') ? img.file_path : `${API_URL.replace('/api', '')}/${img.file_path}`)} style={{ width: '100%', height: '80px', objectFit: 'cover' }} alt="Portfolio" />
                                            <button
                                                type="button" onClick={() => handleDeleteProjectImage(img.id)}
                                                style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer' }}
                                            >✕</button>
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => document.getElementById('edit-image-upload').click()}
                                        style={{ border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px', cursor: 'pointer' }}
                                    >
                                        <Plus size={20} color="#64748b" />
                                    </div>
                                </div>
                                <input
                                    id="edit-image-upload" type="file" accept="image/*" multiple style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        if (files.length > 0) {
                                            const previews = files.map(file => URL.createObjectURL(file));
                                            setEditingWork({
                                                ...editingWork,
                                                newPreviews: [...(editingWork.newPreviews || []), ...previews],
                                                newFiles: [...(editingWork.newFiles || []), ...files]
                                            });
                                        }
                                    }}
                                />
                            </div>
                            <div style={{ gridColumn: 'span 3', display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }} className="span-full">
                                <button type="button" className="btn" onClick={() => setEditingWork(null)} style={{ background: '#f1f5f9', border: 'none' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>
                                    {uploading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Portfolio Grid */}
                {!isAddingWork && !editingWork && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {loadingPortfolio ? (
                            <div style={{ gridColumn: '1/-1', padding: '3rem 0', display: 'flex', justifyContent: 'center' }}><Loader size="md" /></div>
                        ) : (
                            portfolio.map(work => (
                                <div key={work.id} style={{ background: 'white', border: '1px solid #cbd5e1' }}>
                                    <div style={{ position: 'relative', height: '160px', background: '#f8fafc' }}>
                                        {work.images && work.images.length > 0 ? (
                                            <img src={(work.images[0].file_path && work.images[0].file_path.startsWith('http') ? work.images[0].file_path : `${API_URL.replace('/api', '')}/${work.images[0].file_path}`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Portfolio" />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                                <ImageIcon size={48} opacity={0.3} />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '1.25rem' }}>
                                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{work.title}</h4>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>{work.description}</p>
                                        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                                            <button
                                                onClick={() => { setEditingWork(work); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                                            >
                                                <Edit2 size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteWork(work.id)}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {!loadingPortfolio && portfolio.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#94a3b8', border: '2px dashed #cbd5e1' }}>
                                <ImageIcon size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                                <p>Your portfolio is currently empty. Upload your first project details!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderProfile = () => (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '800' }}>My Account</h1>
            <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Manage your personal details and account settings.</p>

            <div style={{ background: 'white', padding: '2.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={user.image ? (user.image && user.image.startsWith('http') ? user.image : `${API_URL.replace('/api', '')}/${user.image}`) : `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`; }}
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', color: 'white', border: '3px solid white', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <Camera size={18} />
                        </button>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>{profileData.name}</h3>
                        <p style={{ color: '#64748b', margin: 0 }}>
                            {vendorProfile ? `${vendorProfile.business_name} • Vendor` : "Client Account"}
                        </p>
                    </div>
                </div>

                <form className="form-grid" onSubmit={handleProfileUpdate}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Full Name</label>
                        <input
                            type="text" style={formInputStyle} value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Email Address</label>
                        <input
                            type="email" style={formInputStyle} value={profileData.email} disabled
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Phone Number</label>
                        <input
                            type="tel" style={formInputStyle} value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Location</label>
                        <input
                            type="text" style={formInputStyle} value={profileData.location}
                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        />
                    </div>
                    <div style={{ gridColumn: 'span 2', marginTop: '1rem' }} className="span-full">
                        <button type="submit" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>Save Changes</button>
                    </div>
                </form>
            </div>

            {vendorProfile && (
                <div style={{ background: 'white', padding: '2.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                    {/* Header row: title + verification badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1.75rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 0.2rem 0' }}>Vendor Business Details</h3>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>{vendorProfile.business_name} &middot; {vendorProfile.category}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={vendorProfile.image ? (vendorProfile.image.startsWith('http') ? vendorProfile.image : `${API_URL.replace('/api', '')}/${vendorProfile.image}`) : `https://ui-avatars.com/api/?name=${vendorProfile.business_name}&background=6366f1&color=fff`}
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <input
                                    type="file"
                                    id="vendorImageUpload"
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleVendorImageUpload}
                                />
                                <label
                                    htmlFor="vendorImageUpload"
                                    style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white' }}
                                >
                                    <Camera size={12} />
                                </label>
                            </div>
                        </div>
                        {vendorProfile.is_verified == 1 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 14px', color: '#16a34a', fontWeight: '700', fontSize: '0.8rem', boxShadow: '0 0 14px rgba(22,163,74,0.14)' }}>
                                <CheckCircle size={14} /> Verified Vendor
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fffbeb', border: '1px solid #fde68a', padding: '6px 14px', color: '#d97706', fontWeight: '700', fontSize: '0.8rem' }}>
                                ⚠️ Verification Pending
                            </div>
                        )}
                    </div>

                    {/* Read-only fields */}
                    <div className="form-grid" style={{ marginBottom: '1.75rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>Business Name</label>
                            <div style={{ ...formInputStyle, background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', cursor: 'not-allowed' }}>{vendorProfile.business_name || '—'}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>Category</label>
                            <div style={{ ...formInputStyle, background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', cursor: 'not-allowed' }}>{vendorProfile.category || '—'}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>CAC Registration</label>
                            <div style={{ ...formInputStyle, background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'not-allowed' }}>
                                {vendorProfile.cac_certificate ? <><CheckCircle size={14} color="#16a34a" /> Submitted</> : '—'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>Business Address</label>
                            <div style={{ ...formInputStyle, background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', cursor: 'not-allowed' }}>{vendorProfile.business_address || '—'}</div>
                        </div>
                    </div>

                    {/* Editable vendor fields */}
                    <form onSubmit={handleVendorDetailsUpdate} className="form-grid">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Starting Price (₦)</label>
                            <input
                                type="number"
                                style={formInputStyle}
                                value={vendorData.starting_price}
                                onChange={(e) => setVendorData({ ...vendorData, starting_price: e.target.value })}
                                placeholder="e.g. 150000"
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Pricing Model</label>
                            <select
                                style={{ ...formInputStyle, appearance: 'none' }}
                                value={vendorData.price_type}
                                onChange={(e) => setVendorData({ ...vendorData, price_type: e.target.value })}
                            >
                                <option value="per_event">Per Event</option>
                                <option value="per_hour">Per Hour</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }} className="span-full">
                            <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Business Bio / Description</label>
                            <textarea
                                style={{ ...formInputStyle, height: '110px', resize: 'none', paddingTop: '0.75rem' }}
                                value={vendorData.bio}
                                onChange={(e) => setVendorData({ ...vendorData, bio: e.target.value })}
                                placeholder="Tell clients about your services, skills, and past events..."
                            />
                        </div>
                        <div style={{ gridColumn: 'span 2', marginTop: '0.5rem' }} className="span-full">
                            <button type="submit" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>Save Vendor Details</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ background: '#fef2f2', padding: '1.5rem', border: '1px solid #fee2e2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h4 style={{ color: '#991b1b', margin: '0 0 0.25rem 0' }}>Delete Account</h4>
                    <p style={{ color: '#b91c1c', fontSize: '0.85rem', margin: 0 }}>Permanently remove your account and delete all data.</p>
                </div>
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    style={{ background: 'white', color: '#dc2626', border: '1px solid #fecaca', padding: '0.6rem 1.25rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    Delete Account
                </button>
            </div>
        </div>
    );

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar */}
            <aside style={{ width: '280px', background: 'white', borderRight: '1px solid #e2e8f0', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="hidden-mobile">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 0.5rem' }}>
                    <img
                        src={user?.image ? (user.image && user.image.startsWith('http') ? user.image : `${API_URL.replace('/api', '')}/${user.image}`) : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff`}
                        style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff`; }}
                    />
                    <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800' }}>{user?.name || 'Loading...'}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {vendorProfile ? 'Vendor Account' : 'Client Account'}
                        </span>
                    </div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <SidebarLink
                        icon={<LayoutDashboard size={20} />}
                        label="Overview"
                        active={activeTab === 'overview'}
                        onClick={() => navigate('?tab=overview')}
                    />
                    <SidebarLink
                        icon={<FileText size={20} />}
                        label="My Tickets"
                        active={activeTab === 'tickets'}
                        onClick={() => navigate('?tab=tickets')}
                    />
                    <SidebarLink
                        icon={<Calendar size={20} />}
                        label="Hosted Events"
                        active={activeTab === 'events'}
                        onClick={() => { setEventsView('list'); navigate('?tab=events'); }}
                    />
                    <SidebarLink
                        icon={<Building2 size={20} />}
                        label={vendorProfile ? "Vendor Portal" : "Join as Vendor"}
                        active={activeTab === 'vendor'}
                        onClick={() => navigate('?tab=vendor')}
                    />
                    <SidebarLink
                        icon={<MessageSquare size={20} />}
                        label="Messages"
                        badge={unreadCount > 0 ? unreadCount.toString() : null}
                        active={activeTab === 'messages'}
                        onClick={() => navigate('?tab=messages')}
                    />
                    <SidebarLink
                        icon={<User size={20} />}
                        label="Profile Settings"
                        active={activeTab === 'profile'}
                        onClick={() => navigate('?tab=profile')}
                    />
                    <div style={{ height: '1px', background: '#e2e8f0', margin: '1rem 0' }}></div>
                    <SidebarLink
                        icon={<Settings size={20} />}
                        label="Account Settings"
                        onClick={() => setIsAccountModalOpen(true)}
                    />
                    <SidebarLink
                        icon={<ShieldCheck size={20} />}
                        label="Security"
                        onClick={() => setIsSecurityModalOpen(true)}
                    />
                </nav>

                <div style={{ marginTop: 'auto', background: '#f1f5f9', padding: '1.25rem', borderRadius: '1rem' }}>
                    <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem' }}>Need help? Our support team is here for you.</p>
                    <button onClick={() => navigate('/contact')} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', background: 'white', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Contact Support</button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
                <VerifyEmailBanner compact={activeTab !== 'overview'} />
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'tickets' && renderBookedTickets()}
                {activeTab === 'events' && renderEventsManager()}
                {activeTab === 'vendor' && renderVendorPortal()}
                {activeTab === 'messages' && (
                    <div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Your Conversations</h2>
                        <ChatSystem />
                    </div>
                )}
                {activeTab === 'profile' && renderProfile()}
            </main>

            <AccountSettingsModal
                isOpen={isAccountModalOpen}
                onClose={() => setIsAccountModalOpen(false)}
            />
            <SecurityModal
                isOpen={isSecurityModalOpen}
                onClose={() => setIsSecurityModalOpen(false)}
            />
            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />

            {/* Mobile Bottom Nav */}
            <div className="mobile-bottom-nav">
                <button onClick={() => navigate('?tab=overview')} className={activeTab === 'overview' ? 'active' : ''}>
                    <LayoutDashboard size={20} />
                    <span>Home</span>
                </button>
                <button onClick={() => navigate('?tab=tickets')} className={activeTab === 'tickets' ? 'active' : ''}>
                    <FileText size={20} />
                    <span>Tickets</span>
                </button>
                <button onClick={() => { setEventsView('list'); navigate('?tab=events'); }} className={activeTab === 'events' ? 'active' : ''}>
                    <Calendar size={20} />
                    <span>Events</span>
                </button>
                <button onClick={() => navigate('?tab=vendor')} className={activeTab === 'vendor' ? 'active' : ''}>
                    <Building2 size={20} />
                    <span>Vendor</span>
                </button>
                <button onClick={() => navigate('?tab=messages')} className={activeTab === 'messages' ? 'active' : ''} style={{ position: 'relative' }}>
                    <MessageSquare size={20} />
                    <span>Chat</span>
                    {unreadCount > 0 && <span className="mobile-badge">{unreadCount}</span>}
                </button>
            </div>

            <style>{`
                .dashboard-wrapper {
                    padding-top: 5.5rem;
                    min-height: 100vh;
                    background: #f8fafc;
                    display: flex;
                }
                .overview-grid {
                    display: grid;
                    grid-template-columns: 1.8fr 1fr;
                    gap: 2rem;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .mobile-bottom-nav {
                    display: none;
                }
                @media (max-width: 768px) {
                    .dashboard-wrapper {
                        display: block;
                    }
                    .hidden-mobile { display: none !important; }
                    main { 
                        padding: 1.5rem !important; 
                        padding-bottom: 5rem !important; 
                        width: 100% !important;
                    }
                    .overview-grid {
                        grid-template-columns: 1fr;
                        gap: 2.5rem;
                    }
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                    .span-full {
                        grid-column: span 1 !important;
                    }
                    .mobile-bottom-nav {
                        display: flex;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: white;
                        border-top: 1px solid #e2e8f0;
                        padding: 0.75rem 0.5rem;
                        justify-content: space-around;
                        z-index: 1000;
                        box-shadow: 0 -4px 6px -1px rgba(0,0,0,0.05);
                    }
                    .mobile-bottom-nav button {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 4px;
                        background: none;
                        border: none;
                        color: #64748b;
                        cursor: pointer;
                        font-size: 0.7rem;
                        font-weight: 500;
                    }
                    .mobile-bottom-nav button.active {
                        color: var(--primary);
                    }
                    .mobile-badge {
                        position: absolute;
                        top: 2px;
                        right: 25%;
                        background: #ef4444;
                        color: white;
                        font-size: 0.6rem;
                        padding: 1px 4px;
                        border-radius: 0;
                        font-weight: 700;
                        min-width: 14px;
                        text-align: center;
                        border: 1px solid white;
                    }
                }
            `}</style>
        </div>
    );
};

const SidebarLink = ({ icon, label, active, badge, onClick }) => {
    const style = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        borderRadius: '0.75rem',
        background: active ? '#f1f5f9' : 'transparent',
        color: active ? 'var(--primary)' : '#64748b',
        fontWeight: active ? '600' : '500',
        transition: 'all 0.2s',
        cursor: 'pointer',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        fontSize: '0.85rem'
    };

    return (
        <button onClick={onClick} style={style}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {icon}
                {label}
            </div>
            {badge && <span style={{ background: '#ef4444', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '100px' }}>{badge}</span>}
        </button>
    );
};

const quickLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.85rem 1rem',
    background: '#f8fafc',
    border: '1px solid transparent',
    borderRadius: '0',
    width: '100%',
    textAlign: 'left',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none'
};

const formInputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: '#f8fafc'
};

// Onboarding form styles
const enrollLabelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b' };
const enrollInputStyle = {
    width: '100%',
    padding: '0.8rem 1rem 0.8rem 3rem',
    border: '1px solid #cbd5e1',
    background: '#f8fafc',
    outline: 'none',
    fontSize: '0.9rem',
    color: '#0f172a',
    transition: 'all 0.2s'
};
const enrollIconStyle = { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const enrollUploadZoneStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', height: '80px', cursor: 'pointer', background: '#f8fafc', color: '#64748b' };

export default Dashboard;
