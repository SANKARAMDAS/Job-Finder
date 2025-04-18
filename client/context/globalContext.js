import React, {createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const GlobalContext = createContext();

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

export const GlobalContextProvider = ({children}) => {

    const [userProfile, setUserProfile] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [auth0User, setAuth0User] = useState(null);
    const [loading, setLoading] = useState(false);

    //input state
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [salary, setSalary] = useState(0);
    const [activeEmploymentTypes, setActiveEmploymentTypes] = useState([]);
    const [salaryType, setSalaryType] = useState('Year');
    const [negotiable, setNegotiable] = useState(false);
    const [tags, setTags] = useState([]);
    const [skills, setSkills] = useState([]);
    const [location, setLocation] = useState({
        country: '',
        city: '',
        address: '',
    });

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/v1/check-auth');
                // console.log(res.data);
                setIsAuthenticated(res.data.isAuthenticated);
                setAuth0User(res.data.user);
                setLoading(false);
                // if (res.data) {
                //     setUserProfile(res.data.userProfile);
                //     setIsAuthenticated(true);
                //     setAuth0User(res.data.auth0User);
                // } else {
                //     setIsAuthenticated(false);
                // }
            } catch (error) {
                console.error('Error checking authentication:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        // if(!isAuthenticated) {
        //     router.push('http://localhost:8080/login');
        // }
    }, []);

    const getUserProfile = async(id) => {
        try {
            const res = await axios.get(`/api/v1/user/${id}`);
            // console.log(res.data);
            setUserProfile(res.data);
        }
        catch (error) {
            console.error('Error in GlobalContext:', error);
        }
    }

    //handle input change
    const handleJobTitleChange = (e) => {
        setJobTitle(e.target.value.trimStart());
    };

    const handleJobDescriptionChange = (e) => {
        setJobDescription(e.target.value.trimStart());
    };

    const handleSalaryChange = (e) => {
        setSalary(e.target.value);
    };


    useEffect(() => {
            if (isAuthenticated && auth0User) {
                getUserProfile(auth0User.sub);
            }
    }, [isAuthenticated, auth0User]);

    // console.log(auth0User);

    return (
        <GlobalContext.Provider value={{isAuthenticated, userProfile, getUserProfile, loading, auth0User, jobTitle, jobDescription, setJobDescription, salary, activeEmploymentTypes, salaryType, negotiable, tags, setTags, skills, setSkills, location, setLocation, handleJobTitleChange, handleJobDescriptionChange, handleSalaryChange, setActiveEmploymentTypes, setNegotiable, setSalaryType }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};