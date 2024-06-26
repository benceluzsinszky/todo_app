import { createContext, useEffect, useState } from "react";
import { BACKEND_URL } from "./App";
import { TodoItem } from "./interfaces/interfaces";

interface MessageBox {
    text: string;
    color: string;
}
interface TodoItemContextValue {
    todoItems: TodoItem[];
    setTodoItems: Function;
    fetchTodoItems: Function;
}

interface IsLoggedInContextValue {
    isLoggedIn: boolean;
    setIsLoggedIn: Function;
    loggedInUser: string | null;
    setLoggedInUser: Function;
}

interface MessageBoxContextProps {
    messageBox: MessageBox;
    setMessageBox: Function;
}

interface GlobalContextProps {
    children: React.ReactNode
}


export const TodoItemContext = createContext<TodoItemContextValue>({
    todoItems: [],
    setTodoItems: () => { },
    fetchTodoItems: () => { },
});

export const IsLoggedInContext = createContext<IsLoggedInContextValue>({
    isLoggedIn: true,
    setIsLoggedIn: () => { },
    loggedInUser: null,
    setLoggedInUser: () => { },
});

export const MessageBoxContext = createContext<MessageBoxContextProps>({
    messageBox: { text: '', color: 'green' },
    setMessageBox: () => { },
});

export default function GlobalContext({ children }: GlobalContextProps) {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
    const [loggedInUser, setLoggedInUser] = useState<string | null>(localStorage.getItem('loggedInUser'));
    const [messageBox, setMessageBox] = useState<MessageBox>({ text: '', color: 'green' });

    const fetchTodoItems = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoggedIn(false)
            return
        };
        if (!isLoggedIn) return;
        await fetch(`${BACKEND_URL}/items/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    setIsLoggedIn(false);
                }
                return response.json();
            })
            .then(data => {
                setTodoItems(data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchTodoItems();
    }, [isLoggedIn]);

    useEffect(() => {
        localStorage.setItem('loggedInUser', loggedInUser || '');
    }, [loggedInUser]);

    return (
        <IsLoggedInContext.Provider value={{ isLoggedIn, setIsLoggedIn, loggedInUser, setLoggedInUser }}>
            <TodoItemContext.Provider value={{ todoItems, setTodoItems, fetchTodoItems }}>
                <MessageBoxContext.Provider value={{ messageBox, setMessageBox }}>
                    {children}
                </MessageBoxContext.Provider>
            </TodoItemContext.Provider>
        </IsLoggedInContext.Provider>
    )
};