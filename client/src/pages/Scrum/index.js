import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { socket } from "../../config"

export function Scrum() {
    const navigate = useNavigate();
    const params = useParams();
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [voteValue, setVoteValue] = useState(0);
    const [voteCount, setVoteCount] = useState(0)
    const [showResult, setShowResult] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            navigate("/", { state: { group: params.groupId } });
            return;
        }

        socket.emit('join_group', { group: params.groupId, user: localStorage.getItem('userData') })
    }, [navigate, params])

    useEffect(() => {
        function setData(data) {
            setConnectedUsers(data)
            const idx = data.findIndex(user => user.username === localStorage.getItem('userData'))
            if (idx > -1) {
                setVoteValue(data[idx].vote)
            }
        }
        socket.on("chatroom_users", setData)
        socket.on("vote-res", (data) => {
            setData(data)
            setVoteCount(prev => prev + 1)
        })
        socket.on('reset-vote', (data) => {
            setData(data)
            setShowResult(null);
            setVoteCount(0)
        })
        socket.on("show-result", (data) => {
            setShowResult(data)
        });
    }, [])

    function vote(value) {
        socket.emit("vote", { group: params.groupId, user: localStorage.getItem('userData'), voteValue: value })
    }

    function reset() {
        socket.emit('reset-vote', { group: params.groupId })
    }

    function result() {
        const total = connectedUsers.reduce((acc, curr) => acc + curr.vote, 0);
        const avg = total / connectedUsers.length;
        socket.emit("show-result", { avg, group: params.groupId });
    }

    return <div className="container shadow p-5 d-flex flex-column gap-4">

        <div>
            {showResult ? <button className="btn btn-outline-primary" onClick={reset}>Reset</button> : voteCount > 0 ? <button className="btn btn-outline-info" onClick={result}>Show Result</button> : <></>}
        </div>
        {showResult && <div>
            <h1>Avg: {showResult}</h1>
        </div>}

        <div className="d-flex gap-4 flex-wrap">
            {connectedUsers.map(user => <div key={user.username} className="card" style={{
                maxWidth: "10rem", width: "100%", height: "10rem", position: "relative", background: "transparent", overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundImage: user.vote > 0 ? "url(background.png)" : "url(background-red.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(6px)",
                    zIndex: -1
                }}></div>
                <div className="card-body d-flex flex-column gap-2 justify-content-center text-center" style={{ color: "whitesmoke", letterSpacing: "2px" }}>
                    {showResult && <span style={{ fontSize: "2rem" }}>{user.vote}</span>}
                    {!showResult && <span >{user.vote > 0 ? "Voted" : "Not Voted"}</span>}
                    <span style={{ fontWeight: "bold", fontSize: "1.5rem", textTransform: "capitalize" }}>{user.username}</span>
                </div>

            </div>)}

        </div>

        {!showResult && <div className="d-flex gap-4 flex-wrap">
            {[1, 2, 3, 5, 8, 13, 21].map(el => <button key={el} onClick={() => vote(el)} className={`btn ${voteValue === el ? 'btn-success' : 'btn-outline-primary'}`} style={{ maxWidth: "10rem", width: "100%" }}>{el}</button>)}
        </div>}
    </div>
}