import React, { useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { debounce } from 'lodash';

const Search = ({ deleteMany, setSearchText, setData, store, setCurrentPage }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSearchDebounced = debounce((value) => {
        setCurrentPage(0);
        const filteredData = store.filter((item) => {
            return Object.keys(item).some((key) =>
                item[key].toString().toLowerCase().includes(value.toLowerCase())
            );
        });
        setData(filteredData);
    }, 300);

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setSearchText(value);
        handleSearchDebounced(value);
    };

    return (
        <div className='flex justify-between w-full py-5'>
            <div className='relative'>
                <input
                    className='px-3 pl-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500  focus:ring-offset-gray-200 search-icon'
                    value={inputValue}
                    autoFocus={true}
                    onChange={handleChange}
                    type='search'
                    placeholder='Search'
                />
                <MdSearch size={22} className='absolute top-2.5 left-3 text-gray-500' />
            </div>
            <button
                onClick={() => deleteMany()}
                className='bg-rose-500 delete hover:bg-rose-600 text-white p-2 px-3.5 rounded-lg'
            >
                <FaRegTrashAlt size={18} />
            </button>
        </div>
    );
};

export default Search;
