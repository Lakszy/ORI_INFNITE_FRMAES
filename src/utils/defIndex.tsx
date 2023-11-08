import React, { useEffect, useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import { Card } from "../components";

export const ImageGallery = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=94fdd14a300113aff95a76b9c8996483&text&safe_search=2";
        const response = await axios.get(url);
        const xmlDoc = new DOMParser().parseFromString(response.data, "text/xml");

        // Get the photo elements
        const photoElements = xmlDoc.querySelectorAll("photo");

        // Convert the NodeList to an array of photos
        const photos = Array.from(photoElements).map((photoElement) => ({
          id: photoElement.getAttribute("id"),
          owner: photoElement.getAttribute("owner"),
          secret: photoElement.getAttribute("secret"),
          server: photoElement.getAttribute("server"),
          farm: photoElement.getAttribute("farm"),
          title: photoElement.getAttribute("title"),
          ispublic: photoElement.getAttribute("ispublic"),
          isfriend: photoElement.getAttribute("isfriend"),
          isfamily: photoElement.getAttribute("isfamily"),
        }));

        setData(photos);
        setIsLoading(false);
      } catch (error) {
        setError((error as AxiosError).message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
console.log(data);

  return (
    <div className="grid">
        {data.map((photo) => (
          <Card key={photo.id} res={photo} />
        ))}
      </div>
  );
  // <li key={photo.id}>{photo.title}</li>
};