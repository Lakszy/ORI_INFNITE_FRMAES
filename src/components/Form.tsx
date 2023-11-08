import React, { useState, useEffect } from "react";

interface IForm {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const Form = ({ handleSubmit, isLoading }: IForm) => {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowErrorMessage(false);
    setShowSearchHistory(true); // Show the search history when the user types
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.trim() === "") {
      setShowErrorMessage(true);
      return;
    }

    // Save the search query to the search history
    setSearchHistory((prevSearchHistory) => [inputValue, ...prevSearchHistory]);
    setInputValue(""); // Clear the input field after submitting

    // Call the handleSubmit function or perform the search
    handleSubmit(e);
  };

  const handleSearchHistoryClick = (query: string) => {
    setInputValue(query);
    setShowSearchHistory(false); // Hide the search history dropdown
  };

  useEffect(() => {
    const fetchImages = async (searchTerm: string) => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=94fdd14a300113aff95a76b9c8996483&text=${searchTerm}&safe_search=2&format=json&nojsoncallback=1`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.photos && data.photos.photo) {
            const photoUrls = data.photos.photo.map(
              (photo: { farm: any; server: any; id: any; secret: any; }) =>
                `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
            );
            setSearchResults(photoUrls);
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages(inputValue);
  }, [inputValue]);

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
