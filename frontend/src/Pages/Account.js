import React, { useState } from 'react';
import AddAccount from './Account/AddAccount';
import ListAccount from './Account/ListAccount';

export default function Account() {
    const [selectedOption, setSelectedOption] = useState('Add Account');

    const options = ['Add Account', 'List', 'Modify'];

    return (
        <div className='mt-32 w-full'>
            <div className='flex w-full justify-around text-lg bg-neutral-100 p-1 items-center'>
                {options.map((option) => (
                    <div
                        key={option}
                        onClick={() => setSelectedOption(option)}
                        className={`cursor-pointer p-2 rounded-lg ${selectedOption === option ? 'bg-blue-800 text-white' : 'text-black'
                            } w-52 text-center `} // Set width to w-60 for all options
                    >
                        {option}
                    </div>
                ))}
            </div>
            {selectedOption === "Add Account" &&
                <AddAccount />
            }
            {selectedOption === "List" &&
                <ListAccount />
            }
            {selectedOption === "Modify" &&
                // <AddAccount />
                <h1 className='text-8xl text-center'>You have to select from the list</h1>
            }
        </div>
    );
}
