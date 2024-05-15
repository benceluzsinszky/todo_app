
import { useContext, useState } from "react";
import { TodoItemContext } from "../GlobalContext";
import { TodoItem } from "../interfaces/interfaces";

export default function AddItem() {
    const [inputValue, setInputValue] = useState('');

    const { setTodoItems } = useContext(TodoItemContext);

    const addNewItem = async () => {
        if (inputValue === '') {
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/items/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: inputValue
                })
            });
            if (!response.ok) {
                throw new Error('Failed to add new item');
            }
            const addedItem = await response.json();
            setTodoItems((prevItems: TodoItem[]) => [addedItem, ...prevItems]);
            setInputValue('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            addNewItem();
        }
    };


    return (
        <div className="additem">
            <input className="additem-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyUp={handleKeyPress}></input>
            <button className="additem-button" onClick={addNewItem}>ADD</button>
        </div>
    )
}