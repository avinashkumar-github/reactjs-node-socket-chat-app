import React, {useEffect, useState} from "react";
import ScrollToBottom  from 'react-scroll-to-bottom';


function Chat({socket, username, room}) {

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    
    
    const postMessage = async () => {
        if(currentMessage !== ''){        
            const postData = {
                message: currentMessage,
                room: room,
                username : username,
                time: `${new Date(Date.now()).getHours()} : ${new Date(Date.now()).getMinutes()} : ${new Date(Date.now()).getSeconds()}`
            }
            

            await socket.emit("send_message", postData)
            setMessageList((list => [...list, postData]))

            setCurrentMessage("");
        }
    };


    useEffect((messageList)=>{
        socket.on("receive_message", (data) => {
            setMessageList(list => [...list, data])
        })
    }, [socket])

    return(
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
            <ScrollToBottom className="message-container">
                {messageList.map((messageContent) => {
                    return (
                    <div
                        className="message"
                        id={username === messageContent.username ? "you" : "other"} key={messageContent.time + Math.random(0,100)}
                    >
                        <div>
                        <div className="message-content">
                            <p>{messageContent.message}</p>
                        </div>
                        <div className="message-meta">
                            <p id="time">{messageContent.time}</p>
                            <p id="author">{messageContent.username}</p>
                        </div>
                        </div>
                    </div>
                    );
                })}
            </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input
                type="text"
                placeholder="..."
                value={currentMessage}
                onChange={(event)=> setCurrentMessage(event.target.value)}
                onKeyPress={(event)=> event.key === "Enter" && postMessage()}
                />
                <button onClick={postMessage}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chat;