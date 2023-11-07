
import React, { useState, useEffect } from 'react';

interface IForm {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const Form = ({ handleSubmit, isLoading }: IForm) => {
  const [inputValue, setInputValue] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowErrorMessage(false);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.trim() === '') {
      setShowErrorMessage(true);
      return;
    }

    handleSubmit(e);
  };

  useEffect(() => {
    const fetchSearchResults = async (query: string) => {
      try {
        const response = await fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=94fdd14a300113aff95a76b9c8996483&text=${query}`);
        const data = await response.json();

        // Update the searchResults state with the fetched results
        setSearchResults(data.results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (inputValue.trim() !== '') {
      fetchSearchResults(inputValue);
    } else {
      setSearchResults([]);
    }
  }, [inputValue]);

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="form"
        value={inputValue}
        onChange={handleInputChange}
        disabled={isLoading}
        placeholder="Example: Bing"
      />
      <button disabled={isLoading}>Search</button>
      {showErrorMessage && inputValue.trim() === '' && <p>Please enter something!</p>}
      
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      )}
    </form>
  );
};