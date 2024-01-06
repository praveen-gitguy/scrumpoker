import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../config";
import { useLocation, useNavigate } from "react-router-dom";

export function AddUserToGroup() {
    const userNameRef = useRef('');
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('')
    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        axiosInstance.get("/groups").then(res => {
            setGroups(res.data.groups);
        })
    }, [])

    useEffect(() => {
        if (location.state) {
            setSelectedGroup(location.state.group)
        }
    }, [location])

    function handleFormSubmit(e) {
        e.preventDefault();
        const userName = userNameRef.current.value;
        if (!userName || !selectedGroup) {
            console.log("Please fill username and select a group")
            return;
        }
        localStorage.setItem("userData", userName)
        navigate(`/${selectedGroup}`);
    }


    return <div>
        <form noValidate onSubmit={handleFormSubmit}>
            <input ref={userNameRef} type="text" placeholder="Username" />
            <select value={selectedGroup} onChange={(e) => {
                setSelectedGroup(e.target.value)
            }}>
                <option value={''}>Select</option>
                {groups.map(group =>
                    <option key={group.slug} value={group.slug}>{group.name}</option>
                )}
            </select>
            <button type="submit">Start</button>
        </form>
    </div>
}