import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Card } from "./Card";
import { ResponseAPI, Result } from "../interface";
import { getImages } from "../utils";
import { Loading } from "./Loading";

interface IGridResults {
  handleLoading: (e: boolean) => void;
  query: string;
}

export const GridResults = ({ query, handleLoading }: IGridResults) => {
  const { data, isLoading, error, isError } = useQuery<ResponseAPI>(
    [query],
    () => getImages(query)
  );

  // Call handleLoading when loading state changes
  useEffect(() => handleLoading(isLoading), [isLoading]);

  if (isLoading) return <Loading />; // Display loading indicator

  if (isError) return <p>{(error as AxiosError).message}</p>; // Display error message

  let photos: Result[] = [];

  // Check if there is data and it's a string
  if (data && typeof data === "string") {
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");

      // Get the photo elements
      const photoElements = xmlDoc.querySelectorAll("photo");

      // Loop through the photo elements and extract their attributes
      photos = Array.from(photoElements).map((photoElement) => ({
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
    } catch (e) {
      console.error("Error parsing XML data:", e);
    }
  }

  return (
    <>
      <p className="no-results">
        {photos.length === 0 ? "No results with: " : "Results with: "}
        <b>{query}</b>
      </p>

      <div className="grid">
        {photos.map((photo: Result) => (
          // Render the Card component for each photo
          <Card key={photo.id} res={photo} />
        ))}
      </div>
    </>
  );
};


