import { useUser } from '@clerk/clerk-react';
import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Button } from '../components/ui/button';

const Workspace = () => {
    const { user } = useUser();
    if (!user) {
        return <div>Please sign in to access the workspace.
            <Link to="/">
                <Button>Go to Home page</Button>
            </Link>
        </div>
    }
    return (
        <div>
            Workspace
            <Outlet />
        </div>
    )
}

export default Workspace
