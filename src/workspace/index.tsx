import { useUser } from '@clerk/clerk-react';
import { useContext, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button } from '../components/ui/button';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseDb } from '../../config/FirebaseConfig';
import { UserDetailContext } from '../../context/UserDetailContext';
import Header from '@/components/ui/custom/Header';
import PromptBox from '@/components/ui/custom/PromptBox';
import MyProjects from '@/components/ui/custom/MyProjects';


const Workspace = () => {
    const { user, isLoaded } = useUser();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const location = useLocation();

    useEffect(() => {
        user && createNewUser();
    }, [user]);

    const createNewUser = async () => {
        if (user) {
            const docRef = doc(firebaseDb, "users", user?.primaryEmailAddress?.emailAddress ?? '');
            const docSnap = await getDoc(docRef);
            // docSnap.data() will be undefined in case document(user) does not exist
            // if user exist then print the data
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setUserDetail(docSnap.data());
            }
            // if user does not exist then insert a new user
            else {
                const data = {
                    fullName: user?.fullName,
                    email: user?.primaryEmailAddress?.emailAddress,
                    createdAt: new Date(),
                    credits: 2     // used to give initial credits to new user
                }
                await setDoc(doc(firebaseDb, "users", user?.primaryEmailAddress?.emailAddress ?? ''), {
                    ...data
                });
                setUserDetail(data);
                console.log("No such document! New user created with data:", { ...data });
            }

        }
    }
    if (!user) {
        return <div>Please sign in to access the workspace.
            <Link to="/">
                <Button>Go to Home page</Button>
            </Link>
        </div>
    }
    return (
        <div>
            <Header />
            {location.pathname === '/workspace' &&
                <div>
                    <PromptBox />
                    <MyProjects />
                </div>
            }
            <Outlet />
        </div>
    )
}

export default Workspace
