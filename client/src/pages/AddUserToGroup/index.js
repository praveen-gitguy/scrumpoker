import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../config";
import { useLocation, useNavigate } from "react-router-dom";

export function AddUserToGroup() {
    const userNameRef = useRef('');
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('')
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        setLoading(true)
        axiosInstance.get("/groups").then(res => {
            setGroups(res.data.groups);
            setLoading(false)
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


    return <div className="container shadow p-5 d-flex justify-content-center align-items-center">

        {loading ? <div className="spinner-border"></div> :
            <form noValidate className="d-flex flex-column gap-3" onSubmit={handleFormSubmit} >
                <div className="form-group">
                    <input ref={userNameRef} type="text" placeholder="Username" className="form-control" />
                </div>

                <div className="form-group">
                    <select class="form-control" value={selectedGroup} onChange={(e) => {
                        setSelectedGroup(e.target.value)
                    }}>
                        <option value={''}>Select Group</option>
                        {groups.map(group =>
                            <option key={group.slug} value={group.slug}>{group.name}</option>
                        )}
                    </select>
                </div>
                <button type="submit" className="btn btn-outline-primary">Join</button>
            </form>}
    </div>
}