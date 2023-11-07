import React, { useState, useEffect } from "react";

interface IForm {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const Form = ({ handleSubmit, isLoading }: IForm) => {
  const [inputValue, setInputValue] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  // Load search history from local storage on component mount
  useEffect(() => {
    const storedSearchHistory = localStorage.getItem("searchHistory");
    if (storedSearchHistory) {
      setSearchHistory(JSON.parse(storedSearchHistory));
    }
  }, []);

  // Save search history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowErrorMessage(false);
    setShowSearchHistory(true);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.trim() === "") {
      setShowErrorMessage(true);
      return;
    }

    // Add the current search query to the search history
    setSearchHistory((prevSearchHistory) => [inputValue, ...prevSearchHistory]);

    handleSubmit(e);
  };


  const handleSearchHistoryClick = (query: string) => {
    setInputValue(query);
    setShowSearchHistory(false);
  };

  return (
    <>
    <div className="form-container">
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
        {showErrorMessage && inputValue.trim() === "" && (
          <p>Please enter something!</p>
        )}

        {showSearchHistory && searchHistory.length > 0 && (
          <div className="search-history-dropdown">
            <ul>
              {searchHistory.map((query, index) => (
                <li key={index} onClick={() => handleSearchHistoryClick(query)}>
                  {query}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>    </>
  );
};
