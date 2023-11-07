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

  useEffect(() => {
    const storedSearchHistory = localStorage.getItem("searchHistory");
    if (storedSearchHistory) {
      setSearchHistory(JSON.parse(storedSearchHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    // Function to fetch images from the API
    const fetchImages = async (searchTerm: string) => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`https://your-api-url.com/images?q=${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    // Fetch images as the user types
    fetchImages(inputValue);
  }, [inputValue]);

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

    setSearchHistory((prevSearchHistory) => [inputValue, ...prevSearchHistory]);

    handleSubmit(e);
  };

  const handleSearchHistoryClick = (query: string) => {
    setInputValue(query);
    setShowSearchHistory(false);
  };

  return (
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

        {searchResults.length > 0 && (
          <div className="image-container">
            {searchResults.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`Image ${index}`} />
            ))}
          </div>
        )}
      </form>
    </div>
  );
};
